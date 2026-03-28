// Porygon Trail - Event Engine
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    // Themed opponent pools for event battles
    // Each pool has tiers based on game progression (badges)
    const EVENT_BATTLE_OPPONENTS = {
        // Jesse & James — anime-accurate teams
        jessie_james: [
            { id: 23, name: "Ekans" },      // Jessie's Ekans
            { id: 109, name: "Koffing" },    // James's Koffing
            { id: 52, name: "Meowth" },      // Meowth (that's right!)
            { id: 24, name: "Arbok" },       // Jessie's evolved Ekans
            { id: 110, name: "Weezing" },    // James's evolved Koffing
            { id: 108, name: "Lickitung" },  // Jessie's Lickitung
        ],
        // Giovanni — boss-level, game/anime accurate
        giovanni: [
            { id: 53, name: "Persian" },     // His signature
            { id: 111, name: "Rhyhorn" },
            { id: 112, name: "Rhydon" },
            { id: 34, name: "Nidoking" },
            { id: 31, name: "Nidoqueen" },
            { id: 51, name: "Dugtrio" },
        ],
        // Team Rocket grunts — poison/dark themed
        rocket_grunt: {
            early: [
                { id: 19, name: "Rattata" }, { id: 41, name: "Zubat" },
                { id: 23, name: "Ekans" }, { id: 109, name: "Koffing" },
                { id: 88, name: "Grimer" }, { id: 52, name: "Meowth" },
            ],
            mid: [
                { id: 20, name: "Raticate" }, { id: 42, name: "Golbat" },
                { id: 24, name: "Arbok" }, { id: 110, name: "Weezing" },
                { id: 89, name: "Muk" }, { id: 53, name: "Persian" },
                { id: 93, name: "Haunter" },
            ],
            late: [
                { id: 24, name: "Arbok" }, { id: 110, name: "Weezing" },
                { id: 89, name: "Muk" }, { id: 53, name: "Persian" },
                { id: 94, name: "Gengar" }, { id: 34, name: "Nidoking" },
                { id: 112, name: "Rhydon" },
            ]
        },
        // Random trainers — normal mix, scales with progression
        trainer: {
            early: [
                { id: 16, name: "Pidgey" }, { id: 19, name: "Rattata" },
                { id: 10, name: "Caterpie" }, { id: 13, name: "Weedle" },
                { id: 21, name: "Spearow" }, { id: 39, name: "Jigglypuff" },
                { id: 27, name: "Sandshrew" }, { id: 43, name: "Oddish" },
            ],
            mid: [
                { id: 17, name: "Pidgeotto" }, { id: 20, name: "Raticate" },
                { id: 25, name: "Pikachu" }, { id: 58, name: "Growlithe" },
                { id: 67, name: "Machoke" }, { id: 77, name: "Ponyta" },
                { id: 61, name: "Poliwhirl" }, { id: 75, name: "Graveler" },
                { id: 64, name: "Kadabra" }, { id: 82, name: "Magneton" },
            ],
            late: [
                { id: 18, name: "Pidgeot" }, { id: 59, name: "Arcanine" },
                { id: 68, name: "Machamp" }, { id: 65, name: "Alakazam" },
                { id: 78, name: "Rapidash" }, { id: 76, name: "Golem" },
                { id: 55, name: "Golduck" }, { id: 91, name: "Cloyster" },
                { id: 103, name: "Exeggutor" }, { id: 128, name: "Tauros" },
            ]
        },
        // Gary/Rival — strong mixed teams
        gary: {
            early: [
                { id: 17, name: "Pidgeotto" }, { id: 20, name: "Raticate" },
                { id: 22, name: "Fearow" }, { id: 58, name: "Growlithe" },
            ],
            mid: [
                { id: 18, name: "Pidgeot" }, { id: 59, name: "Arcanine" },
                { id: 65, name: "Alakazam" }, { id: 130, name: "Gyarados" },
            ],
            late: [
                { id: 59, name: "Arcanine" }, { id: 130, name: "Gyarados" },
                { id: 65, name: "Alakazam" }, { id: 103, name: "Exeggutor" },
                { id: 112, name: "Rhydon" },
            ]
        },
        // Wild dangerous Pokemon (for hazard-type events like Arbok ambush)
        wild_danger: {
            early: [
                { id: 23, name: "Ekans" }, { id: 15, name: "Beedrill" },
                { id: 56, name: "Mankey" },
            ],
            mid: [
                { id: 24, name: "Arbok" }, { id: 57, name: "Primeape" },
                { id: 73, name: "Tentacruel" },
            ],
            late: [
                { id: 24, name: "Arbok" }, { id: 57, name: "Primeape" },
                { id: 94, name: "Gengar" }, { id: 130, name: "Gyarados" },
            ]
        }
    };

    // Pick an opponent from a pool based on current progression
    function pickEventBattleOpponent(poolName, state) {
        let pool;
        const entry = EVENT_BATTLE_OPPONENTS[poolName];
        if (!entry) return null;

        if (Array.isArray(entry)) {
            // Flat pool (jessie_james, giovanni) — pick randomly
            pool = entry;
        } else {
            // Tiered pool — pick by badge count
            const badges = state.badges.filter(b => b !== 'champion').length;
            if (badges >= 6) pool = entry.late;
            else if (badges >= 3) pool = entry.mid;
            else pool = entry.early;
        }

        const pick = state.rng.pick(pool);
        if (!pick) return null;

        const pokemonData = PT.Data.Pokemon.find(p => p.id === pick.id);
        if (!pokemonData) return null;

        return {
            id: pokemonData.id,
            name: pokemonData.name,
            types: pokemonData.types,
            rarity: pokemonData.rarity,
            spriteUrl: PT.Engine.GameState.getSpriteUrl(pokemonData.id)
        };
    }

    // Resolve a 1v1 event battle — returns { won, chance, opponent, battleBonuses }
    function resolveEventBattle(chosen, opponent, state, difficulty) {
        // difficulty: 'easy' (random trainers), 'medium' (rockets), 'hard' (giovanni/gary late)
        const baseChance = difficulty === 'easy' ? 60 : difficulty === 'hard' ? 40 : 50;

        // Type calc
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : ['normal'];

        const weaknesses = {
            normal: { weakTo: ['fighting'], resistedBy: ['rock'], immuneBy: ['ghost'] },
            fire: { weakTo: ['water', 'ground', 'rock'], resistedBy: ['fire', 'grass', 'ice', 'bug'] },
            water: { weakTo: ['electric', 'grass'], resistedBy: ['fire', 'water', 'ice'] },
            electric: { weakTo: ['ground'], resistedBy: ['electric', 'flying'] },
            grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resistedBy: ['water', 'grass', 'electric', 'ground'] },
            ice: { weakTo: ['fire', 'fighting', 'rock'], resistedBy: ['ice'] },
            fighting: { weakTo: ['flying', 'psychic'], resistedBy: ['bug', 'rock'] },
            poison: { weakTo: ['ground', 'psychic'], resistedBy: ['grass', 'fighting', 'poison', 'bug'] },
            ground: { weakTo: ['water', 'grass', 'ice'], resistedBy: ['electric', 'rock', 'poison'], immuneBy: ['electric'] },
            flying: { weakTo: ['electric', 'ice', 'rock'], resistedBy: ['grass', 'fighting', 'bug'] },
            psychic: { weakTo: ['bug'], resistedBy: ['fighting', 'psychic'] },
            bug: { weakTo: ['fire', 'flying', 'rock'], resistedBy: ['grass', 'fighting', 'ground'] },
            rock: { weakTo: ['water', 'grass', 'fighting', 'ground'], resistedBy: ['normal', 'fire', 'poison', 'flying'] },
            ghost: { weakTo: ['ghost'], resistedBy: ['poison', 'bug'], immuneBy: ['normal', 'fighting'] },
            dragon: { weakTo: ['ice', 'dragon'], resistedBy: ['fire', 'water', 'electric', 'grass'] },
            bird: { weakTo: ['electric', 'ice', 'rock'], resistedBy: ['grass', 'fighting', 'bug'] }
        };

        const weakTo = new Set();
        const strongTo = new Set();
        opponentTypes.forEach(t => {
            const info = weaknesses[t];
            if (!info) return;
            info.weakTo.forEach(w => weakTo.add(w));
            if (info.resistedBy) info.resistedBy.forEach(r => strongTo.add(r));
        });

        let chance = baseChance;
        let battleBonuses = [];

        const hasAdvantage = chosen.types.some(t => weakTo.has(t));
        const hasDisadvantage = chosen.types.some(t => strongTo.has(t));
        if (hasAdvantage) { chance += 20; battleBonuses.push('SE +20%'); }
        if (hasDisadvantage) { chance -= 15; battleBonuses.push('NVE -15%'); }

        // Badge bonus
        chance += state.badges.filter(b => b !== 'champion').length * 2;

        // Poison ability: scales with power
        const poisonPower = PT.Engine.GameState.getAbilityPower(state, 'poison');
        if (poisonPower > 0) {
            const poisonBonus = Math.floor(3 * poisonPower);
            chance += poisonBonus;
            battleBonuses.push(`☠️ POISON +${poisonBonus}%`);
        }
        // Intimidate ability: scales with power
        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePower > 0) {
            const intimBonus = Math.floor(3 * intimidatePower);
            chance += intimBonus;
            battleBonuses.push(`😤 INTIMIDATE +${intimBonus}%`);
        }

        // Battle Stars bonus
        const starBonus = PT.Engine.GameState.getStarBonus(chosen);
        if (starBonus.winChanceBonus > 0) {
            chance += starBonus.winChanceBonus;
            battleBonuses.push(`${'★'.repeat(chosen.battleStars || 0)} +${starBonus.winChanceBonus}%`);
        }

        chance = Math.max(15, Math.min(85, chance));

        const won = state.rng.chance(chance);
        const opponentHp = PT.Engine.GameState.getMaxHpForPokemon(opponent);
        const lossDamage = Math.max(1, opponentHp - 1);

        return { won, chance, opponent, lossDamage, battleBonuses, hasAdvantage, hasDisadvantage };
    }

    function rollEvent(state) {
        const route = PT.Engine.GameState.getCurrentRoute(state);
        const availableEvents = PT.Data.Events.filter(event => {
            // One-time check
            if (event.oneTime && state.eventsTriggered.includes(event.id)) return false;
            // Min day check
            if (event.minDay && state.daysElapsed < event.minDay) return false;
            // Min badges check
            if (event.minBadges && state.badges.length < event.minBadges) return false;
            // Min location check
            if (event.minLocation && state.currentLocationIndex < event.minLocation) return false;
            // Location-specific check
            if (event.locationIds && !event.locationIds.includes(route.id)) return false;
            // Terrain check
            if (event.terrainTypes && !event.terrainTypes.includes(route.terrain)) return false;
            // Party size requirement (for sacrifice events that need enough Pokemon)
            if (event.requiresPartySize && PT.Engine.GameState.getAliveParty(state).length < event.requiresPartySize) return false;
            // Route event pool check (if event has no location restriction, it can happen anywhere)
            if (!event.locationIds && !event.terrainTypes && route.eventPool && !route.eventPool.includes(event.id)) {
                // General events can still occur anywhere
                if (event.type === 'combat' || event.type === 'weather' || event.type === 'discovery' || event.type === 'hazard' || event.type === 'story' || event.type === 'legendary' || event.type === 'special') {
                    // Allow general events
                } else {
                    return false;
                }
            }
            return true;
        });

        if (availableEvents.length === 0) return null;

        const event = state.rng.weightedChoice(availableEvents);
        if (!event) return null;

        if (event.oneTime) {
            state.eventsTriggered.push(event.id);
        }

        return event;
    }

    function resolveChoice(event, choiceIndex, state) {
        const choice = event.choices[choiceIndex];
        if (!choice) return { narration: "Nothing happens.", effects: {} };

        // Check for bonus ability outcome
        if (choice.bonusAbility && choice.bonusOutcome && PT.Engine.GameState.hasAbility(state, choice.bonusAbility)) {
            const outcome = choice.bonusOutcome;
            applyEffects(outcome.effects, state);
            return { narration: outcome.narration, effects: outcome.effects, bonusUsed: true };
        }

        // Normal weighted outcome
        const outcome = state.rng.weightedChoice(choice.outcomes);
        if (!outcome) return { narration: "Nothing happens.", effects: {} };

        applyEffects(outcome.effects, state);

        // Track Team Rocket defeats
        if (outcome.trackRocket) {
            state.teamRocketDefeated++;
        }

        return { narration: outcome.narration, effects: outcome.effects };
    }

    function applyEffects(effects, state) {
        if (!effects) return;

        // Resource changes
        const resourceKeys = ['food', 'pokeballs', 'greatballs', 'ultraballs', 'potions', 'superPotions', 'repels', 'rareCandy', 'escapeRope', 'money'];
        resourceKeys.forEach(key => {
            if (effects[key] !== undefined) {
                let amount = effects[key];
                // Pay Day: 50% bonus on positive money gains
                if (key === 'money' && amount > 0) {
                    amount = PT.Engine.GameState.applyPayDay(state, amount);
                }
                state.resources[key] = Math.max(0, state.resources[key] + amount);
            }
        });

        // Party damage (hits random individual Pokemon per point)
        if (effects.partyDamage) {
            for (let i = 0; i < effects.partyDamage; i++) {
                const alive = PT.Engine.GameState.getAliveParty(state);
                if (alive.length === 0) break;
                const victim = state.rng.pick(alive);
                if (victim) {
                    PT.Engine.GameState.damagePokemon(victim, 1, state);
                }
            }
        }

        // Party-wide damage (hits EVERY alive Pokemon)
        if (effects.partyDamageAll) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            alive.forEach(p => {
                PT.Engine.GameState.damagePokemon(p, effects.partyDamageAll, state);
            });
        }

        // Heal all
        if (effects.healAll) {
            state.party.forEach(p => {
                if (p.status !== 'fainted') {
                    p.hp = p.maxHp;
                    p.status = 'healthy';
                }
            });
        }

        // Heal one
        if (effects.healOne) {
            const injured = state.party.filter(p => p.status !== 'fainted' && (p.hp < p.maxHp || p.status !== 'healthy'));
            if (injured.length > 0) {
                const target = state.rng.pick(injured);
                target.hp = target.maxHp;
                target.status = 'healthy';
            }
        }

        // Random status
        if (effects.statusRandom) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            if (alive.length > 0) {
                const victim = state.rng.pick(alive);
                victim.status = effects.statusRandom;
            }
        }

        // Catch Pokemon
        if (effects.catchPokemon) {
            catchFromEffect(effects.catchPokemon, state, effects);
        }
        if (effects.catchPokemon2) {
            catchFromEffect(effects.catchPokemon2, state, effects);
        }

        // See Pokemon
        if (effects.seePokemon) {
            if (!state.pokedexSeen.includes(effects.seePokemon)) {
                state.pokedexSeen.push(effects.seePokemon);
            }
        }

        // Key item
        if (effects.keyItem) {
            if (!state.keyItems.includes(effects.keyItem)) {
                state.keyItems.push(effects.keyItem);
            }
        }

        // Train Pokemon (evolve a random eligible party member)
        if (effects.trainPokemon) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            const canEvolve = alive.filter(p => {
                const d = PT.Data.Pokemon.find(pk => pk.id === p.id);
                return d && d.evolvesTo;
            });
            if (canEvolve.length > 0) {
                const target = state.rng.pick(canEvolve);
                const evoResult = PT.Engine.GameState.evolvePokemon(target, state);
                if (evoResult.evolved) {
                    effects._trainResult = evoResult;
                    PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
                }
            }
        }

        // Boost a random Pokemon's max HP
        if (effects.boostPokemonMaxHp) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            if (alive.length > 0) {
                const target = state.rng.pick(alive);
                const oldMax = target.maxHp;
                target.maxHp = Math.min(target.maxHp + effects.boostPokemonMaxHp, 6);
                target.hp = Math.min(target.hp + effects.boostPokemonMaxHp, target.maxHp);
                effects._boostResult = { name: target.name, oldMax: oldMax, newMax: target.maxHp };
            }
        }

        // Grant Battle Star to a random eligible party member
        if (effects.grantStar) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            const eligible = alive.filter(p => {
                if (!PT.Engine.GameState.isFinalEvolution(p)) return false;
                return (p.battleStars || 0) < 3;
            });
            if (eligible.length > 0) {
                const target = state.rng.pick(eligible);
                target.battleStars = (target.battleStars || 0) + 1;
                effects._starResult = { name: target.name, stars: target.battleStars };
            } else {
                effects._starResult = null; // no eligible mon
            }
        }

        // Reduce a random Pokemon's max HP permanently
        if (effects.reducePokemonMaxHp) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            if (alive.length > 0) {
                const target = state.rng.pick(alive);
                const oldMax = target.maxHp;
                target.maxHp = Math.max(1, target.maxHp - effects.reducePokemonMaxHp);
                target.hp = Math.min(target.hp, target.maxHp);
                effects._reduceResult = { name: target.name, oldMax: oldMax, newMax: target.maxHp };
            }
        }

        // Permanent Pokemon death (supports multi-kill via pokemonDeath2, pokemonDeath3)
        if (effects.pokemonDeath) {
            const deathResult = PT.Engine.GameState.killPokemon(state);
            effects._deathResult = deathResult;
        }
        if (effects.pokemonDeath2) {
            const deathResult2 = PT.Engine.GameState.killPokemon(state);
            effects._deathResult2 = deathResult2;
        }
        if (effects.pokemonDeath3) {
            const deathResult3 = PT.Engine.GameState.killPokemon(state);
            effects._deathResult3 = deathResult3;
        }

        // Pokemon Trade — flag for trade UI in event screen
        // Picks a specific party member the trader wants (prefers weaker/common mons)
        if (effects.pokemonTrade) {
            const tradeId = effects.pokemonTrade;
            if (!state.pokedexSeen.includes(tradeId)) state.pokedexSeen.push(tradeId);
            const data = PT.Data.Pokemon.find(p => p.id === tradeId);
            if (data) {
                effects._tradeIncoming = data;
                // Pick a target from alive party
                const alive = PT.Engine.GameState.getAliveParty(state);
                if (alive.length > 1) {
                    const candidates = alive.map(p => {
                        let w = 10;
                        if (p.rarity === 'common') w = 40;
                        else if (p.rarity === 'uncommon') w = 25;
                        else if (p.rarity === 'rare') w = 10;
                        else if (p.rarity === 'legendary') w = 2;
                        if ((p.battleStars || 0) >= 2) w = Math.max(1, Math.floor(w / 3));
                        return { weight: w, pokemon: p };
                    });
                    const pick = state.rng.weightedChoice(candidates);
                    if (pick) effects._tradeTarget = pick.pokemon;
                }
            }
        }

        // Days lost
        if (effects.daysLost) {
            state.daysElapsed += effects.daysLost;
        }

        // Champion flag
        if (effects.champion) {
            state.hasWon = true;
            if (!state.badges.includes('champion')) {
                state.badges.push('champion');
            }
        }

        // Check all dead
        if (state.party.length === 0) {
            state.isGameOver = true;
            if (!state.gameOverReason) state.gameOverReason = "party_wiped";
        }
    }

    function catchFromEffect(pokemonId, state, effects) {
        if (!state.pokedexCaught.includes(pokemonId)) {
            state.pokedexCaught.push(pokemonId);
        }
        if (!state.pokedexSeen.includes(pokemonId)) {
            state.pokedexSeen.push(pokemonId);
        }
        const data = PT.Data.Pokemon.find(p => p.id === pokemonId);
        if (!data) return;
        if (state.party.length < 6) {
            state.party.push(PT.Engine.GameState.createPartyPokemon(data, state));
        } else if (effects) {
            // Party full — flag for swap UI in event screen
            if (!effects._pendingCatch) effects._pendingCatch = [];
            effects._pendingCatch.push(data);
        }
    }

    function canChoose(choice, state) {
        if (choice.requiresItem && state.resources[choice.requiresItem] <= 0) return false;
        if (choice.requiresMoney && state.resources.money < choice.requiresMoney) return false;
        if (choice.requiresKeyItem && !state.keyItems.includes(choice.requiresKeyItem)) return false;
        if (choice.requiresPartySize && PT.Engine.GameState.getAliveParty(state).length < choice.requiresPartySize) return false;
        return true;
    }

    PT.Engine.EventEngine = { rollEvent, resolveChoice, applyEffects, canChoose, pickEventBattleOpponent, resolveEventBattle };
})();

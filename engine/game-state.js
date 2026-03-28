// Porygon Trail - Game State
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    function createNewGame(trainerName, starterId) {
        const seed = Date.now();
        const starterData = PT.Data.Pokemon.find(p => p.id === starterId);
        const starter = createPartyPokemon(starterData);

        return {
            version: 1,
            trainerName: trainerName || 'RED',
            seed: seed,
            rng: PT.Engine.RNG.createRNG(seed),

            // Travel
            currentLocationIndex: 0,
            distanceTraveled: 0,
            daysElapsed: 0,
            pace: 'steady',
            weather: 'clear',
            starvingDays: 0,

            // Resources
            resources: {
                food: 50,
                pokeballs: 15,
                greatballs: 0,
                ultraballs: 0,
                potions: 5,
                superPotions: 0,
                repels: 3,
                rareCandy: 0,
                escapeRope: 1,
                money: 3000
            },

            // Party
            party: [starter],

            // Progress
            badges: [],
            keyItems: [],
            pokedexCaught: [starterId],
            pokedexSeen: [starterId],

            // Tracking
            eventsTriggered: [],
            teamRocketDefeated: 0,
            gymBattlesWon: 0,
            pokemonLost: 0,
            graveyard: [],
            ballsWasted: 0,

            // Log
            log: [],

            // Status
            isGameOver: false,
            gameOverReason: null,
            hasWon: false,

            // Active repel counter
            repelSteps: 0
        };
    }

    // Per-Pokemon HP overrides (id → HP)
    const HP_OVERRIDES = {
        // Legendaries → 9 HP
        144: 9, 145: 9, 146: 9, 150: 9, 151: 9, 0: 9,
        // Elite rares → 5 HP
        3: 5,                    // Venusaur
        6: 5,                    // Charizard
        9: 5,                    // Blastoise
        68: 5,                   // Machamp
        94: 5,                   // Gengar
        113: 5,                  // Chansey
        115: 5,                  // Kangaskhan
        130: 5,                  // Gyarados
        131: 5,                  // Lapras
        137: 5,                  // Porygon
        142: 5,                  // Aerodactyl
        143: 5,                  // Snorlax
        149: 5,                  // Dragonite
        // Tough uncommons/rares → 4 HP
        12: 4, 15: 4,            // Butterfree, Beedrill
        18: 4,                   // Pidgeot
        24: 4,                   // Arbok
        62: 4,                   // Poliwrath
        76: 4,                   // Golem
        95: 4,                   // Onix
        114: 4,                  // Tangela
        148: 4,                  // Dragonair
        // Downgraded to 3 HP (mid evos, weaker finals, starter base forms)
        1: 3,                    // Bulbasaur
        4: 3,                    // Charmander
        7: 3,                    // Squirtle
        11: 3,                   // Metapod
        14: 3,                   // Kakuna
        17: 3,                   // Pidgeotto
        20: 3,                   // Raticate
        28: 3,                   // Sandslash
        30: 3,                   // Nidorina
        33: 3,                   // Nidorino
        42: 3,                   // Golbat
        44: 3,                   // Gloom
        47: 3,                   // Parasect
        53: 3,                   // Persian
        61: 3,                   // Poliwhirl
        64: 3,                   // Kadabra
        70: 3,                   // Weepinbell
        75: 3,                   // Graveler
        117: 3,                  // Seadra
        119: 3,                  // Seaking
        121: 3,                  // Starmie
        133: 3,                  // Eevee
        138: 3,                  // Omanyte
        140: 3,                  // Kabuto
        147: 3,                  // Dratini
        // Weak base forms → 2 HP
        10: 2,                   // Caterpie
        13: 2,                   // Weedle
        16: 2,                   // Pidgey
        19: 2,                   // Rattata
        21: 2,                   // Spearow
        27: 2,                   // Sandshrew
        29: 2,                   // Nidoran F
        32: 2,                   // Nidoran M
        41: 2,                   // Zubat
        43: 2,                   // Oddish
        46: 2,                   // Paras
        52: 2,                   // Meowth
        60: 2,                   // Poliwag
        63: 2,                   // Abra
        69: 2,                   // Bellsprout
        72: 2,                   // Tentacool
        74: 2,                   // Geodude
        116: 2,                  // Horsea
        118: 2,                  // Goldeen
        120: 2,                  // Staryu
        // Ultra weak → 1 HP
        129: 1                   // Magikarp
    };

    function createPartyPokemon(data, state) {
        const baseHp = data.rarity === 'legendary' ? 6 :
                       data.rarity === 'rare' ? 4 : 3;
        const maxHp = HP_OVERRIDES[data.id] !== undefined ? HP_OVERRIDES[data.id] : baseHp;
        const route = state ? getCurrentRoute(state) : null;
        return {
            id: data.id,
            name: data.name,
            types: data.types,
            rarity: data.rarity,
            hp: maxHp,
            maxHp: maxHp,
            status: 'healthy',
            travelAbility: data.travelAbility,
            spriteUrl: getSpriteUrl(data.id),
            battleWins: 0,
            battleStars: 0,
            lastStarLocation: -1,  // location index where last star was earned
            lastEvoLocation: -1,   // location index where last evolution happened
            caughtAt: route ? route.name : 'Pallet Town',
            caughtDay: state ? state.daysElapsed : 0
        };
    }

    function getSpriteUrl(id) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/${id}.png`;
    }

    function addToLog(state, message) {
        state.log.unshift({ day: state.daysElapsed, text: message });
        if (state.log.length > 50) state.log.pop();
    }

    function healPokemon(pokemon, amount) {
        if (pokemon.status === 'fainted') return false;
        pokemon.hp = Math.min(pokemon.hp + amount, pokemon.maxHp);
        if (pokemon.status === 'poisoned' || pokemon.status === 'paralyzed') {
            pokemon.status = 'healthy';
        }
        return true;
    }

    function damagePokemon(pokemon, amount, state) {
        // Aurora Veil (Articuno) — reduce all incoming damage by 1 (min 0)
        if (state && hasAbility(state, 'aurora_veil') && amount > 0) {
            amount = Math.max(0, amount - 1);
            if (amount === 0) {
                pokemon._auroraBlocked = true; // transient flag for UI
                return false; // damage fully absorbed
            }
        }
        pokemon.hp = Math.max(0, pokemon.hp - amount);
        if (pokemon.hp <= 0) {
            // Battle Stars death avoidance — veteran Pokemon can clutch survive
            const starBonus = getStarBonus(pokemon);
            if (starBonus.deathAvoidChance > 0 && state && state.rng && state.rng.chance(starBonus.deathAvoidChance)) {
                pokemon.hp = 1;
                pokemon.status = 'healthy';
                pokemon._clutched = true; // transient flag for UI
                return false; // survived!
            }
            // Safeguard ability — Chansey saves a Pokemon from death once
            if (state && !pokemon._safeguarded && hasAbility(state, 'safeguard')) {
                pokemon.hp = 1;
                pokemon.status = 'healthy';
                pokemon._safeguarded = true; // permanent flag — can't save this mon again
                pokemon._safeguardSaved = true; // transient flag for UI
                return false; // saved by Chansey!
            }
            // System Restore — Porygon revives from backup (once per game)
            if (state && !state._systemRestoreUsed && hasAbility(state, 'system_restore')) {
                pokemon.hp = 1;
                pokemon.status = 'healthy';
                state._systemRestoreUsed = true;
                pokemon._systemRestored = true; // transient flag for UI
                return false; // restored by Porygon!
            }
            pokemon.hp = 0;
            pokemon.status = 'fainted';
            // Remove fainted Pokemon from party permanently
            if (state) {
                // Record in graveyard
                if (!state.graveyard) state.graveyard = [];
                const route = getCurrentRoute(state);
                state.graveyard.push({
                    name: pokemon.name,
                    id: pokemon.id,
                    spriteUrl: pokemon.spriteUrl,
                    battleStars: pokemon.battleStars || 0,
                    location: route ? route.name : 'Unknown',
                    day: state.daysElapsed
                });
                const idx = state.party.indexOf(pokemon);
                if (idx !== -1) {
                    state.party.splice(idx, 1);
                    state.pokemonLost++;
                }
                // If party is empty, game over
                if (state.party.length === 0) {
                    state.isGameOver = true;
                    state.gameOverReason = 'party_wiped';
                }
            }
            return true; // fainted/died
        }
        return false;
    }

    function getAliveParty(state) {
        return state.party.filter(p => p.status !== 'fainted');
    }

    function hasAbility(state, ability) {
        return getAliveParty(state).some(p => p.travelAbility === ability);
    }

    // Starter Pokemon (Bulbasaur/Charmander/Squirtle lines) get 2x ability effectiveness
    const STARTER_IDS = [1,2,3, 4,5,6, 7,8,9];

    // Ability Power — stacks across party, scales with evolution + stars
    // Each Pokemon contributes: basePower × starMult × starterMult
    //   basePower: stage 1 = 1.0, stage 2 = 1.5, stage 3/single = 2.0
    //   starMult:  +0.25 per battle star
    //   starterMult: ×2 for starter lines (IDs 1-9)
    // Returns total power (0 = no one has it, higher = stronger effect)
    function getAbilityPower(state, ability) {
        const alive = getAliveParty(state);
        let total = 0;
        const mimics = []; // Ditto-like Pokemon with mimic ability
        alive.forEach(p => {
            if (p.travelAbility === 'mimic') {
                mimics.push(p);
                return;
            }
            if (p.travelAbility !== ability) return;
            const stage = getEvoStage(p.id);
            let power = stage === 1 ? 1.0 : stage === 2 ? 1.5 : 2.0;
            power += (p.battleStars || 0) * 0.25;
            if (STARTER_IDS.includes(p.id)) power *= 2;
            total += power;
        });
        // Mimic: if someone else has this ability, Ditto copies it and adds its own power
        if (total > 0 && mimics.length > 0) {
            mimics.forEach(p => {
                const stage = getEvoStage(p.id);
                let power = stage === 1 ? 1.0 : stage === 2 ? 1.5 : 2.0;
                power += (p.battleStars || 0) * 0.25;
                total += power;
            });
        }
        return total;
    }

    // Kept for backward compat — some places just need boolean
    function starterAbilityMult(state, ability) {
        return getAbilityPower(state, ability) || 1;
    }

    // Get the full evolution chain for a pokemon
    function getEvoChain(pokemonId) {
        const allPokemon = PT.Data.Pokemon;
        // Walk backwards to find base form
        let baseId = pokemonId;
        let safety = 10;
        while (safety-- > 0) {
            const prev = allPokemon.find(p => {
                if (!p.evolvesTo) return false;
                if (Array.isArray(p.evolvesTo)) return p.evolvesTo.includes(baseId);
                return p.evolvesTo === baseId;
            });
            if (prev) baseId = prev.id;
            else break;
        }
        // Walk forwards to build chain
        const chain = [];
        let currentId = baseId;
        safety = 10;
        while (currentId && safety-- > 0) {
            const data = allPokemon.find(p => p.id === currentId);
            if (!data) break;
            chain.push(data);
            if (!data.evolvesTo) break;
            currentId = Array.isArray(data.evolvesTo) ? data.evolvesTo[0] : data.evolvesTo;
        }
        return chain;
    }

    // Pay Day ability — scales with power (25% bonus per power point)
    function applyPayDay(state, amount) {
        const power = getAbilityPower(state, 'payday');
        if (power > 0) {
            return Math.floor(amount * (1 + 0.25 * power));
        }
        return amount;
    }

    // Evolution stage: 1 = base, 2 = mid, 3 = final/single-stage
    function getEvoStage(pokemonId) {
        const data = PT.Data.Pokemon.find(p => p.id === pokemonId);
        if (!data) return 3;
        const hasEvo = !!data.evolvesTo;
        const evolvesFrom = PT.Data.Pokemon.some(p => {
            if (!p.evolvesTo) return false;
            if (Array.isArray(p.evolvesTo)) return p.evolvesTo.includes(pokemonId);
            return p.evolvesTo === pokemonId;
        });
        if (!hasEvo && !evolvesFrom) return 3; // single-stage (Snorlax, Kangaskhan)
        if (hasEvo && !evolvesFrom) return 1;  // base form (Charmander)
        if (hasEvo && evolvesFrom) return 2;   // mid evo (Charmeleon)
        return 3;                              // final evo (Charizard)
    }

    // Food consumption per Pokemon based on evo stage
    function getFoodCost(pokemon) {
        return getEvoStage(pokemon.id); // 1, 2, or 3
    }

    function hasType(state, type) {
        return getAliveParty(state).some(p => p.types.includes(type));
    }

    function getCurrentRoute(state) {
        return PT.Data.Routes[state.currentLocationIndex];
    }

    function getNextRoute(state) {
        const next = state.currentLocationIndex + 1;
        if (next >= PT.Data.Routes.length) return null;
        return PT.Data.Routes[next];
    }

    // Evolution System — limited to once per location
    function evolvePokemon(partyMon, state) {
        const data = PT.Data.Pokemon.find(p => p.id === partyMon.id);
        if (!data || !data.evolvesTo) return { evolved: false };

        // Location-based evolution limit
        const currentLoc = state ? state.currentLocationIndex : -1;
        if (currentLoc >= 0 && (partyMon.lastEvoLocation || -1) === currentLoc) {
            return { evolved: false }; // already evolved here
        }
        // Support branching evolution (e.g. Eevee -> [Vaporeon, Jolteon, Flareon])
        let evoId = data.evolvesTo;
        if (Array.isArray(evoId)) {
            evoId = evoId[Math.floor(Math.random() * evoId.length)];
        }
        const evoData = PT.Data.Pokemon.find(p => p.id === evoId);
        if (!evoData) return { evolved: false };

        const oldName = partyMon.name;
        partyMon.id = evoData.id;
        partyMon.name = evoData.name;
        partyMon.types = evoData.types;
        partyMon.rarity = evoData.rarity;
        partyMon.travelAbility = evoData.travelAbility;
        partyMon.spriteUrl = getSpriteUrl(evoData.id);
        // Set new maxHp — use override if exists, otherwise +1 capped at 6
        const evoMaxHp = getMaxHpForPokemon(evoData);
        if (evoMaxHp > partyMon.maxHp) {
            partyMon.maxHp = evoMaxHp;
        } else if (partyMon.maxHp < 6) {
            partyMon.maxHp += 1;
        }
        // Heal 1 HP on evolution
        partyMon.hp = Math.min(partyMon.hp + 1, partyMon.maxHp);
        // Track evolution location
        partyMon.lastEvoLocation = currentLoc;

        // Register evolution in Pokedex
        if (state) {
            if (!state.pokedexSeen.includes(evoData.id)) {
                state.pokedexSeen.push(evoData.id);
            }
            if (!state.pokedexCaught.includes(evoData.id)) {
                state.pokedexCaught.push(evoData.id);
            }
        }

        return { evolved: true, oldName: oldName, newName: evoData.name };
    }

    // Permanent Death
    function killPokemon(state) {
        const alive = getAliveParty(state);
        if (alive.length === 0) return null;
        const victim = state.rng.pick(alive);
        // Battle Stars death avoidance
        const starBonus = getStarBonus(victim);
        if (starBonus.deathAvoidChance > 0 && state.rng.chance(starBonus.deathAvoidChance)) {
            victim.hp = 1;
            return { killed: false, name: victim.name, clutched: true };
        }
        // Safeguard ability — Chansey saves from death once per Pokemon
        if (!victim._safeguarded && hasAbility(state, 'safeguard')) {
            victim.hp = 1;
            victim._safeguarded = true;
            return { killed: false, name: victim.name, safeguarded: true };
        }
        // System Restore — Porygon revives from backup (once per game)
        if (!state._systemRestoreUsed && hasAbility(state, 'system_restore')) {
            victim.hp = 1;
            state._systemRestoreUsed = true;
            return { killed: false, name: victim.name, systemRestored: true };
        }
        const idx = state.party.indexOf(victim);
        if (idx === -1) return null;
        // Record in graveyard before removing
        if (!state.graveyard) state.graveyard = [];
        const route = getCurrentRoute(state);
        state.graveyard.push({
            name: victim.name,
            id: victim.id,
            spriteUrl: victim.spriteUrl,
            battleStars: victim.battleStars || 0,
            location: route ? route.name : 'Unknown',
            day: state.daysElapsed
        });
        state.party.splice(idx, 1);
        state.pokemonLost++;
        // If party is empty, game over
        if (state.party.length === 0) {
            state.isGameOver = true;
            state.gameOverReason = 'party_wiped';
        }
        return { killed: true, name: victim.name };
    }

    // ===== BATTLE STARS =====
    // 1 star per win, cap at 3. Only final evolutions earn stars.
    // The win that triggers evolution does NOT count.
    // Only one star per location.

    // Check if a Pokemon is at its final evolution (no evolvesTo)
    function isFinalEvolution(pokemon) {
        const data = PT.Data.Pokemon.find(p => p.id === pokemon.id);
        return data && !data.evolvesTo;
    }

    // Award a battle win. Returns { earned: bool, reason: string|null, evolved: bool }
    // Call AFTER evolution check — if the mon just evolved this fight, skip the star.
    function addBattleWin(pokemon, state, justEvolved) {
        pokemon.battleWins = (pokemon.battleWins || 0) + 1;

        // Must be final evolution to earn stars
        if (!isFinalEvolution(pokemon)) {
            return { earned: false, reason: 'not_final_evo' };
        }

        // The win that caused evolution doesn't count toward stars
        if (justEvolved) {
            return { earned: false, reason: 'evolution_win' };
        }

        // Already max stars (3)
        if ((pokemon.battleStars || 0) >= 3) {
            return { earned: false, reason: 'max_stars' };
        }

        // Can only earn one star per location
        const currentLoc = state ? state.currentLocationIndex : -1;
        if (pokemon.lastStarLocation === currentLoc && currentLoc >= 0) {
            return { earned: false, reason: 'location_limit' };
        }

        // Award +1 star
        pokemon.battleStars = (pokemon.battleStars || 0) + 1;
        pokemon.lastStarLocation = currentLoc;
        return { earned: true, reason: null };
    }

    function getStarBonus(pokemon) {
        const stars = pokemon.battleStars || 0;
        return {
            winChanceBonus: stars * 3,       // +3% per star, max +9%
            deathAvoidChance: stars * 5      // +5% per star, max +15%
        };
    }

    // Get max HP for a Pokemon data entry (respects overrides)
    // Stage 2+ evolutions get minimum 4 HP; 5 HP reserved for specific overrides & rare finals
    function getMaxHpForPokemon(data) {
        if (HP_OVERRIDES[data.id] !== undefined) return HP_OVERRIDES[data.id];
        let hp = data.rarity === 'legendary' ? 6 : data.rarity === 'rare' ? 4 : 3;
        const stage = getEvoStage(data.id);
        if (stage >= 2 && hp < 4) hp = 4;
        return hp;
    }

    // Convert Pokemon to food (rarity = size = more food)
    function pokemonToFood(rarity) {
        const foodValues = { common: 5, uncommon: 10, rare: 20, legendary: 40 };
        return foodValues[rarity] || 5;
    }

    // ===== SAVE / LOAD =====
    const SAVE_KEY = 'porygonTrail_save';

    function saveGame(state) {
        if (!state || state.isGameOver || state.hasWon) return false;
        try {
            const saveData = Object.assign({}, state);
            // Serialize RNG state (functions can't be stored in JSON)
            saveData._rngSeed = state.rng.getSeed();
            saveData._rngState = state.rng.getState();
            delete saveData.rng;
            // Remove any transient UI fields
            delete saveData._gymWarningShown;
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.warn('Could not save game:', e);
            return false;
        }
    }

    function loadGame() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            // Reconstruct RNG from saved seed + state
            data.rng = PT.Engine.RNG.createRNG(data._rngSeed);
            data.rng.setState(data._rngState);
            delete data._rngSeed;
            delete data._rngState;
            // Rebuild sprite URLs (they aren't stored but party refs need them)
            data.party.forEach(p => {
                p.spriteUrl = getSpriteUrl(p.id);
            });
            return data;
        } catch (e) {
            console.warn('Could not load save:', e);
            return null;
        }
    }

    function hasSaveGame() {
        return localStorage.getItem(SAVE_KEY) !== null;
    }

    function deleteSave() {
        localStorage.removeItem(SAVE_KEY);
    }

    PT.Engine.GameState = {
        createNewGame,
        createPartyPokemon,
        getMaxHpForPokemon,
        getSpriteUrl,
        addToLog,
        healPokemon,
        damagePokemon,
        getAliveParty,
        hasAbility,
        getAbilityPower,
        starterAbilityMult,
        hasType,
        getCurrentRoute,
        getNextRoute,
        evolvePokemon,
        killPokemon,
        addBattleWin,
        getStarBonus,
        isFinalEvolution,
        pokemonToFood,
        applyPayDay,
        getEvoChain,
        getEvoStage,
        getFoodCost,
        saveGame,
        loadGame,
        hasSaveGame,
        deleteSave
    };
})();

// Porygon Trail - Game State
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    // Gym-reward buffs: stacking key items (win/catch/money %) and stacking
    // boosts to travel abilities the player already has active in the party.
    const BUFFABLE_ABILITIES = ["poison", "intimidate", "cut", "fly", "surf", "strength", "flash", "guard", "psychic"];
    const ABILITY_BOOST_UNIT = 0.5; // power added per stack, half a stage-1 Pokemon's worth

    function createDefaultBuffs() {
        const abilities = {};
        BUFFABLE_ABILITIES.forEach(a => { abilities[a] = 0; });
        return {
            keyItems: {
                amuletCoin: 0, sootheBell: 0, muscleBand: 0, hpUp: 0, whiteFlute: 0,
                focusBand: 0, bicycle: 0, silphScope: 0, expShare: 0
            },
            abilities
        };
    }

    function getWinRateBonus(state) {
        return (state.buffs.keyItems.muscleBand || 0) * PT.Data.KeyItems.muscleBand.amount;
    }

    function getCatchRateBonus(state) {
        return (state.buffs.keyItems.sootheBell || 0) * PT.Data.KeyItems.sootheBell.amount;
    }

    function getMoneyMultBonus(state) {
        return (state.buffs.keyItems.amuletCoin || 0) * PT.Data.KeyItems.amuletCoin.amount;
    }

    function getEventRateBonus(state) {
        return (state.buffs.keyItems.whiteFlute || 0) * PT.Data.KeyItems.whiteFlute.amount;
    }

    // White Flute's smaller secondary effect — nudges the separate wild
    // encounter roll up too, so encounters creep up slightly faster than
    // narrative events do as flutes stack.
    const WILD_ENCOUNTER_RATE_UNIT = 3;
    function getWildEncounterRateBonus(state) {
        return (state.buffs.keyItems.whiteFlute || 0) * WILD_ENCOUNTER_RATE_UNIT;
    }

    function getAbilityBoost(state, ability) {
        return (state.buffs.abilities[ability] || 0);
    }

    // Focus Band — stacking chance to survive a would-be-fatal hit at 1 HP,
    // independent of Battle Stars/Safeguard/System Restore.
    function getFocusBandBonus(state) {
        return (state.buffs.keyItems.focusBand || 0) * PT.Data.KeyItems.focusBand.amount;
    }

    // Bicycle — flat bonus travel distance per day, no Pokemon required.
    function getBicycleBonus(state) {
        return (state.buffs.keyItems.bicycle || 0) * PT.Data.KeyItems.bicycle.amount;
    }

    // Silph Scope — weight multiplier applied to Team Rocket / legendary
    // events during the event roll. 1 = no change.
    function getSilphScopeMultiplier(state) {
        return 1 + (state.buffs.keyItems.silphScope || 0) * (PT.Data.KeyItems.silphScope.amount / 100);
    }

    // Whether a key item still has room to stack further (account-wide cap,
    // e.g. White Flute). Items with no maxStacks are uncapped.
    function isKeyItemMaxed(state, itemId) {
        const itemData = PT.Data.KeyItems[itemId];
        if (!itemData || itemData.maxStacks == null) return false;
        return (state.buffs.keyItems[itemId] || 0) >= itemData.maxStacks;
    }

    // Grants one more stack of a key item's buff. No-ops once an item's
    // maxStacks cap (if any) is reached.
    function grantKeyItem(state, itemId) {
        if (!state.buffs.keyItems.hasOwnProperty(itemId)) return;
        if (isKeyItemMaxed(state, itemId)) return;
        state.buffs.keyItems[itemId] = (state.buffs.keyItems[itemId] || 0) + 1;
        if (!state.keyItems.includes(itemId)) state.keyItems.push(itemId);
    }

    // Grants one more stack of an ability boost
    function grantAbilityBuff(state, ability) {
        if (!state.buffs.abilities.hasOwnProperty(ability)) return;
        state.buffs.abilities[ability] = (state.buffs.abilities[ability] || 0) + 1;
    }

    // Whether a specific Pokemon can still take another HP Up stack
    // (per-target cap, separate from any account-wide key item cap).
    function canApplyHpUpBoost(pokemon) {
        return (pokemon.hpBonus || 0) < PT.Data.KeyItems.hpUp.maxStacksPerTarget;
    }

    // HP Up: permanently raises one chosen Pokemon's HP by 1, stacks per
    // Pokemon up to maxStacksPerTarget, and survives evolution (see
    // evolvePokemon's hpBonus handling). No-ops once that Pokemon is capped.
    function applyHpUpBoost(state, pokemon) {
        if (!canApplyHpUpBoost(pokemon)) return;
        pokemon.hpBonus = (pokemon.hpBonus || 0) + 1;
        pokemon.maxHp += 1;
        pokemon.hp += 1;
        grantKeyItem(state, 'hpUp');
    }

    function createNewGame(trainerName, starterId, difficultyLevel) {
        const seed = Date.now();
        const starterData = PT.Data.Pokemon.find(p => p.id === starterId);
        const starter = createPartyPokemon(starterData);

        return {
            version: 1,
            trainerName: trainerName || 'RED',
            runId: (crypto.randomUUID ? crypto.randomUUID() : `${seed}-${Math.random().toString(36).slice(2)}`),
            seed: seed,
            rng: PT.Engine.RNG.createRNG(seed),

            // Difficulty level (1-5, see data/difficulty-levels.js). Defaults
            // to 1 (Casual) whenever an older/other call site omits it.
            difficultyLevel: difficultyLevel || 1,

            // Region — 'kanto' until the post-Elite-Four choice moves it to
            // 'johto'. completedRegions records the Hall-of-Fame-worthy clears.
            region: 'kanto',
            completedRegions: [],

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
            buffs: createDefaultBuffs(),
            pokedexCaught: [starterId],
            pokedexSeen: [starterId],

            // Tracking
            eventsTriggered: [],
            teamRocketDefeated: 0,
            gymBattlesWon: 0,
            pokemonLost: 0,
            graveyard: [],
            ballsWasted: 0,
            // Lake of Rage's Red Gyarados (shiny-flagged encounter-table entry)
            // — a one-of-a-kind catch per run. Set in
            // engine/encounter-engine.js's addPokemonToParty; checked in
            // rollEncounter to drop the shiny entry from the table once true.
            redGyaradosCaught: false,

            // Trail trainer battles (difficulty level 2+, see
            // engine/trainer-engine.js) — location indices that have already
            // rolled a trainer encounter this run, and a running count of
            // trainers actually defeated (feeds scoring.js's breakdown).
            trainerEncounteredLocations: [],
            trainersDefeated: 0,

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
        // Pikachu/Clefairy/Jigglypuff pinned here explicitly: adding the baby
        // evolutions (Pichu/Cleffa/Igglybuff -> these) made getEvoStage() see
        // them as having something evolve INTO them, which flips them from
        // "base form" to "mid evo" and the generic formula's stage>=2 rule
        // silently bumped their HP 3->4 — an unintended side effect of that
        // fix, not a deliberate rebalance. Locking them back to their
        // original Dex-audit-pass tier.
        25: 3,                   // Pikachu
        35: 3,                   // Clefairy
        39: 3,                   // Jigglypuff
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
        129: 1,                  // Magikarp

        // ===== Johto (Gen II) overrides — HP tiers from JOHTO_EXPANSION_SCOPE.md §8.1 =====
        // Legendaries / roaming beasts → 8-9 HP
        243: 8, 244: 8, 245: 8,  // Raikou, Entei, Suicune
        249: 9, 250: 9,          // Lugia, Ho-Oh
        // Pseudo-legendary-tier finals → 6-8 HP
        154: 6,                  // Meganium
        157: 6,                  // Typhlosion
        160: 6,                  // Feraligatr
        208: 6,                  // Steelix
        242: 6,                  // Blissey
        248: 7,                  // Tyranitar
        // Mid-tier evolutions/finals → 5 HP
        153: 5,                  // Bayleef
        156: 5,                  // Quilava
        159: 5,                  // Croconaw
        169: 5,                  // Crobat
        181: 5,                  // Ampharos
        182: 5,                  // Bellossom
        185: 5,                  // Sudowoodo
        186: 5,                  // Politoed
        195: 5,                  // Quagsire
        196: 5,                  // Espeon
        197: 5,                  // Umbreon
        199: 5,                  // Slowking
        202: 5,                  // Wobbuffet
        212: 5,                  // Scizor
        214: 5,                  // Heracross
        217: 5,                  // Ursaring
        219: 5,                  // Magcargo
        221: 5,                  // Piloswine
        227: 5,                  // Skarmory
        229: 5,                  // Houndoom
        230: 5,                  // Kingdra
        232: 5,                  // Donphan
        233: 5,                  // Porygon2
        237: 5,                  // Hitmontop
        241: 5,                  // Miltank
        247: 5,                  // Pupitar
        // Tough uncommons/rares → 4 HP
        164: 4,                  // Noctowl
        171: 4,                  // Lanturn
        176: 4,                  // Togetic (rare default already 4, kept explicit for clarity)
        178: 4,                  // Xatu
        180: 4,                  // Flaaffy
        184: 4,                  // Azumarill
        192: 4,                  // Sunflora
        203: 4,                  // Girafarig
        205: 4,                  // Forretress
        207: 4,                  // Gligar
        210: 4,                  // Granbull
        224: 4,                  // Octillery
        234: 4,                  // Stantler (rare default already 4, kept explicit for clarity)
        // Downgraded to 3 HP
        175: 3,                  // Togepi
        213: 3,                  // Shuckle
        225: 3,                  // Delibird
        236: 3,                  // Tyrogue
        238: 3,                  // Smoochum
        239: 3,                  // Elekid
        240: 3,                  // Magby
        // Weak base forms → 2 HP
        161: 2,                  // Sentret
        163: 2,                  // Hoothoot
        165: 2,                  // Ledyba
        167: 2,                  // Spinarak
        172: 2,                  // Pichu
        173: 2,                  // Cleffa
        174: 2,                  // Igglybuff
        177: 2,                  // Natu
        183: 2,                  // Marill
        188: 2,                  // Skiploom
        191: 2,                  // Sunkern
        201: 2,                  // Unown
        204: 2,                  // Pineco
        223: 2,                  // Remoraid
        235: 2,                  // Smeargle
        // Ultra weak → 1 HP
        187: 1                   // Hoppip
    };

    // `overrides` lets rare events hand back a customized individual (e.g. a
    // renamed, boosted, non-evolving Pokemon) without a new data/pokemon.js entry.
    function createPartyPokemon(data, state, overrides) {
        // Was a separate, duplicated inline formula (rarity tiers + override
        // lookup, no evolution-stage bump) that silently disagreed with
        // getMaxHpForPokemon — the function that computes the HP wild
        // encounters and gym opponents actually display. Any stage>=2 mon
        // with no explicit HP_OVERRIDES entry (e.g. Venomoth: uncommon, no
        // override) showed its correct bumped HP everywhere EXCEPT the
        // moment it actually joined your party, where it silently landed
        // one HP short. Single source of truth now.
        const maxHp = getMaxHpForPokemon(data);
        const route = state ? getCurrentRoute(state) : null;
        // Sprite generation is fixed at catch time from the current region and
        // never re-derived — a mon caught in Kanto keeps Gen I art forever,
        // even if it later evolves or the run crosses into Johto (§4.1).
        const spriteGen = (state && state.region) || 'kanto';
        const shiny = !!(overrides && overrides.shiny);
        const pokemon = {
            id: data.id,
            name: data.name,
            types: data.types,
            rarity: data.rarity,
            hp: maxHp,
            maxHp: maxHp,
            status: 'healthy',
            travelAbility: data.travelAbility,
            spriteGen: spriteGen,
            spriteUrl: getSpriteUrl(data.id, spriteGen, shiny),
            battleWins: 0,
            battleStars: 0,
            hpBonus: 0,  // permanent HP Up stacks — survives evolution, see evolvePokemon
            lastStarLocation: -1,  // location index where last star was earned
            lastEvoLocation: -1,   // location index where last evolution happened
            caughtAt: route ? route.name : 'Pallet Town',
            caughtDay: state ? state.daysElapsed : 0
        };
        if (overrides) Object.assign(pokemon, overrides);
        return pokemon;
    }

    // `source` is the sprite generation to render, keyed off catch-region —
    // 'johto' gets Crystal art, everything else (including undefined, for
    // legacy callers) keeps the original Gen I Red/Blue/Gray art.
    function getSpriteUrl(id, source, shiny) {
        if (id === 0) {
            return 'https://archives.bulbagarden.net/media/upload/9/98/Missingno_RB.png';
        }
        // Shiny art only exists in the Crystal sprite set (Gen I had no shiny
        // mechanic at all) — the Lake of Rage Shiny Gyarados (§10.4) always
        // uses this path regardless of catch-region/id.
        if (shiny) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/shiny/${id}.png`;
        }
        // Gen II species (dex 152+) have no Gen I sprite sheet at all — Crystal
        // art applies regardless of catch-region, since there's no "Kanto art"
        // choice to preserve for a species that never appeared in Gen I. The
        // catch-region rule (source === 'johto') only has anything to decide
        // between for dex 1-151, which exist in both sprite sets.
        if (source === 'johto' || id >= 152) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/${id}.png`;
        }
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
            // Focus Band — stacking held-item death avoidance
            const focusBandChance = state ? getFocusBandBonus(state) : 0;
            if (focusBandChance > 0 && state.rng && state.rng.chance(focusBandChance)) {
                pokemon.hp = 1;
                pokemon.status = 'healthy';
                pokemon._focusBandSaved = true; // transient flag for UI
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

    // Early-game leniency — a new run's opening stretch (before Brock, then
    // before Misty) is the least forgiving part of the game: a thin party
    // with no Battle Stars, key items, or badges yet, up against the same
    // base win chances as the rest of the run. This tops up (never lowers)
    // any battle's base chance up to a floor for that phase, so it only ever
    // helps a fight that would otherwise start below the floor — an event
    // battle's already-generous 'easy' base, for example, is untouched.
    // Badge count is the signal (0 = pre-Brock, 1 = Brock-to-Misty, 2+ =
    // normal difficulty resumes) rather than daysElapsed or location, so it
    // still applies correctly to a run that lingers on Route 1 or backtracks.
    // No effect in Johto — badge count there always starts at 8 (Kanto's
    // full set), so it would never actually apply, but the region check
    // keeps the intent explicit rather than relying on that coincidence.
    function getEarlyGameBaseFloor(state) {
        if (!state || state.region === 'johto') return 0;
        const badgeCount = (state.badges || []).filter(b => b !== 'champion').length;
        if (badgeCount === 0) return 55;  // start of the run, before Brock
        if (badgeCount === 1) return 50;  // Brock cleared, before Misty
        return 0;                         // Misty cleared onward
    }

    // Applies getEarlyGameBaseFloor to an in-progress chance/breakdown pair —
    // shared by every battle screen's win-chance calc so the floor-topping
    // logic and its breakdown row only exist in one place. Returns the
    // (possibly unchanged) chance; mutates breakdown in place like every
    // other bonus in these calcs.
    function applyEarlyGameBaseFloor(state, chance, breakdown) {
        const floor = getEarlyGameBaseFloor(state);
        if (floor > chance) {
            const bonus = floor - chance;
            breakdown.push({ label: 'NEW TRAINER BOOST', value: bonus });
            return chance + bonus;
        }
        return chance;
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
        // Gym-reward ability boosts only amplify an ability the party already
        // has active — a boost with no matching Pokemon stays dormant.
        if (total > 0 && state.buffs) {
            total += getAbilityBoost(state, ability) * ABILITY_BOOST_UNIT;
        }
        return total;
    }

    // Kept for backward compat — some places just need boolean
    function starterAbilityMult(state, ability) {
        return getAbilityPower(state, ability) || 1;
    }

    // How many living party members are directly contributing to a stacked
    // ability's power (Poison/Intimidate) — for battle-outcome UI copy like
    // "INTIMIDATE +8% (3 Pokemon)" so a player can see stacking is happening,
    // not just a bigger number. Deliberately simpler than getAbilityPower:
    // doesn't count Mimic copies (there's nothing else to attribute a Ditto's
    // borrowed power to) or gym-reward boosts (those aren't a "Pokemon").
    function getAbilityContributorCount(state, ability) {
        return getAliveParty(state).filter(p => p.travelAbility === ability).length;
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
    // Splits a money award into its independent sources — the Payday ability
    // (needs a Meowth/Persian etc. actually in the party) and the Amulet Coin
    // key item (a flat +8%-per-stack gym reward, unrelated to any Pokemon) —
    // applied in sequence (Payday first, then Amulet Coin on top), same order
    // applyPayDay always used. Exists so UI can label each bonus correctly
    // instead of crediting an Amulet-Coin-only run's money bump to "Payday"
    // when no Payday Pokemon is present at all.
    function getPayDayBreakdown(state, amount) {
        const power = getAbilityPower(state, 'payday');
        const afterPayday = power > 0 ? amount * (1 + 0.25 * power) : amount;
        const moneyMult = state.buffs ? getMoneyMultBonus(state) : 0;
        const afterAmulet = moneyMult > 0 ? afterPayday * (1 + moneyMult / 100) : afterPayday;
        const finalAmount = Math.floor(afterAmulet);
        const paydayBonus = Math.floor(afterPayday) - amount;
        const amuletBonus = finalAmount - Math.floor(afterPayday);
        return { final: finalAmount, paydayBonus, amuletBonus };
    }

    function applyPayDay(state, amount) {
        return getPayDayBreakdown(state, amount).final;
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

    // Effective travel distance for a route, after the current difficulty
    // level's routeDistanceBonus (data/difficulty-levels.js) is applied.
    // Every read site that compares/uses distance-to-arrive math should go
    // through this rather than reading route.distanceToNext directly, so
    // higher difficulty levels' longer routes are honored everywhere.
    function getRouteDistance(route, state) {
        return route.distanceToNext + PT.Data.getLevelConfig(state).routeDistanceBonus;
    }

    // Evolution System — limited to once per location
    function evolvePokemon(partyMon, state) {
        if (partyMon.noEvolve) return { evolved: false };
        const data = PT.Data.Pokemon.find(p => p.id === partyMon.id);
        if (!data || !data.evolvesTo) return { evolved: false };

        // Location-based evolution limit — at most one evolution per Pokemon
        // per location, period. A Pokemon may not climb multiple evolution
        // stages (e.g. Caterpie -> Metapod -> Butterfree) in one place.
        const currentLoc = state ? state.currentLocationIndex : -1;
        // Plain equality, not `|| -1` — lastEvoLocation is legitimately 0 at the
        // first location (Pallet Town), and `0 || -1` would coerce that to -1,
        // silently disabling this guard there and letting a Pokemon evolve twice.
        if (currentLoc >= 0 && partyMon.lastEvoLocation === currentLoc) {
            return { evolved: false, reason: 'location_limit' }; // already evolved here
        }
        // Support branching evolution (e.g. Eevee -> [Vaporeon, Jolteon, Flareon]).
        // In Johto, Eevee's pool widens to include Espeon/Umbreon (§8.3) — done
        // here rather than in the data file so Kanto keeps the original 3-way
        // split even once Espeon/Umbreon exist in the Pokedex.
        let evoPool = Array.isArray(data.evolvesTo) ? data.evolvesTo : [data.evolvesTo];
        if (data.id === 133 && state && state.region === 'johto') {
            const johtoEeveelutions = [196, 197].filter(id => PT.Data.Pokemon.some(p => p.id === id));
            evoPool = evoPool.concat(johtoEeveelutions);
        }

        // Region-gated evolutions (§8.2): any evolution whose target species is
        // Gen II (national dex 152-251) can't fire until the run has reached
        // Johto — regardless of what item/trade/friendship the original games
        // required, since this engine only has one abstracted evolution trigger.
        // Filtered out BEFORE picking a branch (not after) so a mixed
        // Gen1/Gen2 branching evolution — Gloom->Vileplume/Bellossom,
        // Poliwhirl->Poliwrath/Politoed, Slowpoke->Slowbro/Slowking — reliably
        // takes its available Gen1 branch in Kanto instead of a coin-flip
        // chance of the random pick landing on the locked branch and failing
        // outright even though a valid evolution was available.
        const inJohto = !!(state && state.region === 'johto');
        const reachablePool = inJohto ? evoPool : evoPool.filter(id => !(id >= 152 && id <= 251));
        if (reachablePool.length === 0) {
            return { evolved: false, reason: 'region_locked' };
        }
        const evoId = reachablePool.length > 1 ? reachablePool[Math.floor(Math.random() * reachablePool.length)] : reachablePool[0];
        const evoData = PT.Data.Pokemon.find(p => p.id === evoId);
        if (!evoData) return { evolved: false };

        const oldName = partyMon.name;
        partyMon.id = evoData.id;
        partyMon.name = evoData.name;
        partyMon.types = evoData.types;
        partyMon.rarity = evoData.rarity;
        partyMon.travelAbility = evoData.travelAbility;
        partyMon.spriteUrl = getSpriteUrl(evoData.id, partyMon.spriteGen || 'kanto', partyMon.shiny);
        // Set new maxHp — use override if exists, otherwise +1 capped at 6.
        // HP Up bonus and the 10-win veteran bonus are both tracked
        // separately so they survive being reset by the species-based
        // evolution jump below, then get re-added on top.
        const hpBonus = partyMon.hpBonus || 0;
        const veteranBonus = partyMon.tenWinBonusApplied ? 1 : 0;
        const baseMaxHpBeforeEvo = partyMon.maxHp - hpBonus - veteranBonus;
        const evoMaxHp = getMaxHpForPokemon(evoData);
        let newBaseMaxHp = baseMaxHpBeforeEvo;
        if (evoMaxHp > baseMaxHpBeforeEvo) {
            newBaseMaxHp = evoMaxHp;
        } else if (baseMaxHpBeforeEvo < 6) {
            newBaseMaxHp = baseMaxHpBeforeEvo + 1;
        }
        partyMon.maxHp = newBaseMaxHp + hpBonus + veteranBonus;
        // Fully heal on evolution
        partyMon.hp = partyMon.maxHp;
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
        // Focus Band — stacking held-item death avoidance
        const focusBandChance = getFocusBandBonus(state);
        if (focusBandChance > 0 && state.rng.chance(focusBandChance)) {
            victim.hp = 1;
            return { killed: false, name: victim.name, focusBandSaved: true };
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

    // Check if a Pokemon is at its final evolution (no evolvesTo), or is
    // functionally final for now because its only evolution target is a
    // Gen II species and evolvePokemon() region-gates that until Johto
    // (see its region_locked check below) — e.g. Golbat, Onix, Chansey,
    // Seadra, Scyther, and Porygon can't actually evolve during the whole
    // Kanto leg, so they shouldn't be permanently denied battle stars for
    // an evolution they have no way to trigger yet. `state` is optional;
    // omit it (e.g. a Pokedex species lookup with no live run) to fall
    // back to "not final" for a Gen-II-only evolution target.
    function isFinalEvolution(pokemon, state) {
        if (pokemon.noEvolve) return true;
        const data = PT.Data.Pokemon.find(p => p.id === pokemon.id);
        if (!data) return false;
        if (!data.evolvesTo) return true;
        const evoPool = Array.isArray(data.evolvesTo) ? data.evolvesTo : [data.evolvesTo];
        const allTargetsAreGenTwo = evoPool.every(id => id >= 152 && id <= 251);
        if (allTargetsAreGenTwo && (!state || state.region !== 'johto')) {
            return true;
        }
        return false;
    }

    // Shared star-earning check, used both for the Pokemon that actually won
    // the fight and (via Exp Share) for one teammate riding along on the win.
    function tryEarnStar(pokemon, state) {
        if (!isFinalEvolution(pokemon, state)) {
            return { earned: false, reason: 'not_final_evo' };
        }
        if ((pokemon.battleStars || 0) >= 3) {
            return { earned: false, reason: 'max_stars' };
        }
        const currentLoc = state ? state.currentLocationIndex : -1;
        if (pokemon.lastStarLocation === currentLoc && currentLoc >= 0) {
            return { earned: false, reason: 'location_limit' };
        }
        pokemon.battleStars = (pokemon.battleStars || 0) + 1;
        pokemon.lastStarLocation = currentLoc;
        return { earned: true, reason: null };
    }

    // Award a battle win. Returns { earned: bool, reason: string|null, expShareBonus?: {...}, veteranBonus?: {...} }
    // Call AFTER evolution check — if the mon just evolved this fight, skip the star.
    function addBattleWin(pokemon, state, justEvolved) {
        pokemon.battleWins = (pokemon.battleWins || 0) + 1;

        // The win that caused evolution doesn't count toward stars
        const result = justEvolved
            ? { earned: false, reason: 'evolution_win' }
            : tryEarnStar(pokemon, state);

        // Veteran bonus: a Pokemon's 10th battle win permanently raises its
        // max HP by 1 — a one-time bonus per Pokemon (not every 10 wins), so
        // guard on the flag rather than an exact win count (also lets this
        // apply retroactively to existing saves already past 10 wins the
        // first time they win again after this feature ships). Tracked
        // separately from key-items.js's hpUp/hpBonus stacks (HP Up items)
        // so this never counts against that item's own 3-per-Pokemon cap —
        // see evolvePokemon's hpBonus handling for the same "survives
        // evolution" treatment applied to this bonus too.
        if (!pokemon.tenWinBonusApplied && pokemon.battleWins >= 10) {
            pokemon.tenWinBonusApplied = true;
            pokemon.maxHp += 1;
            pokemon.hp += 1;
            result.veteranBonus = { name: pokemon.name };
        }

        // Exp Share: one other eligible teammate also benefits from this win —
        // a Battle Star if they're already a final evolution, or a shot at
        // evolving in place if they're not (the same once-per-location
        // evolution cap every other evolution trigger already respects, so
        // this can't double up on one route). Picked at random among
        // everyone eligible, not just the first party slot — Array#find
        // used to always return the same teammate in party order.
        if (state && state.buffs && (state.buffs.keyItems.expShare || 0) > 0) {
            const currentLoc = state.currentLocationIndex;
            const candidates = getAliveParty(state).filter(p => p !== pokemon);
            const starCandidates = candidates.filter(p =>
                isFinalEvolution(p, state) &&
                (p.battleStars || 0) < 3 &&
                !(p.lastStarLocation === currentLoc && currentLoc >= 0)
            );
            const evoCandidates = candidates.filter(p =>
                !isFinalEvolution(p, state) &&
                !(p.lastEvoLocation === currentLoc && currentLoc >= 0)
            );
            const pool = starCandidates.concat(evoCandidates);
            if (pool.length > 0 && state.rng) {
                const teammate = state.rng.pick(pool);
                if (starCandidates.includes(teammate)) {
                    const teammateResult = tryEarnStar(teammate, state);
                    if (teammateResult.earned) {
                        result.expShareBonus = { type: 'star', name: teammate.name };
                    }
                } else {
                    const evoResult = evolvePokemon(teammate, state);
                    if (evoResult.evolved) {
                        result.expShareBonus = { type: 'evolution', name: evoResult.oldName, newName: evoResult.newName };
                    }
                }
            }
        }

        return result;
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

    function serializeState(state) {
        const saveData = Object.assign({}, state);
        saveData._rngSeed = state.rng.getSeed();
        saveData._rngState = state.rng.getState();
        delete saveData.rng;
        delete saveData._gymWarningShown;
        return saveData;
    }

    function saveGame(state) {
        if (!state || state.isGameOver || state.hasWon) return false;
        try {
            const saveData = serializeState(state);
            localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));

            // Background cloud sync (fire-and-forget)
            const auth = PT.Engine.Auth;
            if (auth && auth.isLoggedIn()) {
                cloudSave(state).catch(() => {});
            }

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
            // Rebuild sprite URLs (they aren't stored but party refs need them) —
            // each mon's own spriteGen (frozen at catch time) picks its art.
            data.party.forEach(p => {
                p.spriteUrl = getSpriteUrl(p.id, p.spriteGen || 'kanto', p.shiny);
            });
            // Older saves predate the buffs schema — default it in
            if (!data.buffs) data.buffs = createDefaultBuffs();
            // Older saves predate the region/Johto schema — default them to a
            // legacy in-progress Kanto run, ahead of any Johto-aware code (§6.2).
            if (data.region === undefined) data.region = 'kanto';
            if (!data.completedRegions) data.completedRegions = [];
            // Older saves predate difficulty levels / trail trainers — default
            // them to Casual with no trainer history yet.
            if (data.difficultyLevel === undefined) data.difficultyLevel = 1;
            if (!data.trainerEncounteredLocations) data.trainerEncounteredLocations = [];
            if (data.trainersDefeated === undefined) data.trainersDefeated = 0;
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
        // Also clear cloud save (fire-and-forget)
        const auth = PT.Engine.Auth;
        if (auth && auth.isLoggedIn()) {
            deleteCloudSave().catch(() => {});
        }
    }

    // ===== CLOUD SAVE / LOAD =====
    async function cloudSave(state) {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return false;
        const client = auth.getClient();
        if (!client) return false;
        try {
            const saveData = serializeState(state);
            const { error } = await client.from('pt_saves').upsert({
                user_id: auth.getCurrentUser().id,
                save_data: saveData,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });
            return !error;
        } catch (e) {
            console.warn('Cloud save failed:', e);
            return false;
        }
    }

    async function cloudLoad() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return null;
        const client = auth.getClient();
        if (!client) return null;
        try {
            const { data, error } = await client
                .from('pt_saves')
                .select('save_data')
                .eq('user_id', auth.getCurrentUser().id)
                .maybeSingle();
            if (error || !data) return null;

            const saveData = data.save_data;
            saveData.rng = PT.Engine.RNG.createRNG(saveData._rngSeed);
            saveData.rng.setState(saveData._rngState);
            delete saveData._rngSeed;
            delete saveData._rngState;
            (saveData.party || []).forEach(p => { p.spriteUrl = getSpriteUrl(p.id, p.spriteGen || 'kanto', p.shiny); });
            if (!saveData.buffs) saveData.buffs = createDefaultBuffs();
            if (saveData.region === undefined) saveData.region = 'kanto';
            if (!saveData.completedRegions) saveData.completedRegions = [];
            if (saveData.difficultyLevel === undefined) saveData.difficultyLevel = 1;
            if (!saveData.trainerEncounteredLocations) saveData.trainerEncounteredLocations = [];
            if (saveData.trainersDefeated === undefined) saveData.trainersDefeated = 0;
            return saveData;
        } catch (e) {
            console.warn('Cloud load failed:', e);
            return null;
        }
    }

    async function deleteCloudSave() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return;
        const client = auth.getClient();
        if (!client) return;
        try {
            await client.from('pt_saves')
                .delete()
                .eq('user_id', auth.getCurrentUser().id);
        } catch (e) {
            console.warn('Cloud delete failed:', e);
        }
    }

    async function hasCloudSave() {
        const auth = PT.Engine.Auth;
        if (!auth || !auth.isLoggedIn()) return false;
        const client = auth.getClient();
        if (!client) return false;
        try {
            const { data } = await client
                .from('pt_saves')
                .select('user_id')
                .eq('user_id', auth.getCurrentUser().id)
                .maybeSingle();
            return !!data;
        } catch (e) {
            return false;
        }
    }

    PT.Engine.GameState = {
        createNewGame,
        createDefaultBuffs,
        BUFFABLE_ABILITIES,
        getWinRateBonus,
        getCatchRateBonus,
        getMoneyMultBonus,
        getEventRateBonus,
        getWildEncounterRateBonus,
        getFocusBandBonus,
        getBicycleBonus,
        getSilphScopeMultiplier,
        getAbilityBoost,
        grantKeyItem,
        grantAbilityBuff,
        applyHpUpBoost,
        canApplyHpUpBoost,
        isKeyItemMaxed,
        createPartyPokemon,
        getMaxHpForPokemon,
        getSpriteUrl,
        addToLog,
        healPokemon,
        damagePokemon,
        getAliveParty,
        hasAbility,
        getAbilityPower,
        getAbilityContributorCount,
        getEarlyGameBaseFloor,
        applyEarlyGameBaseFloor,
        starterAbilityMult,
        hasType,
        getCurrentRoute,
        getNextRoute,
        getRouteDistance,
        evolvePokemon,
        killPokemon,
        addBattleWin,
        getStarBonus,
        isFinalEvolution,
        pokemonToFood,
        applyPayDay,
        getPayDayBreakdown,
        getEvoChain,
        getEvoStage,
        getFoodCost,
        saveGame,
        loadGame,
        hasSaveGame,
        deleteSave,
        cloudSave,
        cloudLoad,
        deleteCloudSave,
        hasCloudSave
    };
})();

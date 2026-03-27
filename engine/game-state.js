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
        // Legendaries → 6 HP
        144: 6, 145: 6, 146: 6, 150: 6, 151: 6, 0: 6,
        // Tanky/iconic rares → 5 HP
        113: 5,                  // Chansey
        115: 5,                  // Kangaskhan
        131: 5,                  // Lapras
        137: 5,                  // Porygon
        142: 5,                  // Aerodactyl
        143: 5,                  // Snorlax
        149: 5,                  // Dragonite
        // Tough uncommons → 4 HP
        12: 4, 15: 4,            // Butterfree, Beedrill
        18: 4,                   // Pidgeot
        114: 4,                  // Tangela
        148: 4                   // Dragonair
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

    // Pay Day ability — 50% bonus money
    function applyPayDay(state, amount) {
        if (hasAbility(state, 'payday')) {
            return Math.floor(amount * 1.5);
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
        // +1 maxHp on evolution, capped at 6
        if (partyMon.maxHp < 6) partyMon.maxHp += 1;
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
    // 3-star cap. Thresholds: 1 win, 3 wins, 6 wins
    const STAR_THRESHOLDS = [1, 3, 6];

    // Check if a Pokemon is at its final evolution (no evolvesTo)
    function isFinalEvolution(pokemon) {
        const data = PT.Data.Pokemon.find(p => p.id === pokemon.id);
        return data && !data.evolvesTo;
    }

    // Award a battle win. Returns { earned: bool, reason: string|null }
    // Only final evolutions can earn stars, and only once per location.
    function addBattleWin(pokemon, state) {
        pokemon.battleWins = (pokemon.battleWins || 0) + 1;

        // Must be final evolution to earn stars
        if (!isFinalEvolution(pokemon)) {
            return { earned: false, reason: 'not_final_evo' };
        }

        // Already max stars
        if ((pokemon.battleStars || 0) >= 3) {
            return { earned: false, reason: 'max_stars' };
        }

        // Can only earn one star per location
        const currentLoc = state ? state.currentLocationIndex : -1;
        if (pokemon.lastStarLocation === currentLoc && currentLoc >= 0) {
            return { earned: false, reason: 'location_limit' };
        }

        // Check if wins cross the NEXT threshold (only award +1 star at a time)
        const oldStars = pokemon.battleStars || 0;
        const nextThreshold = STAR_THRESHOLDS[oldStars]; // threshold for next star
        if (nextThreshold === undefined || pokemon.battleWins < nextThreshold) {
            return { earned: false, reason: 'no_threshold' };
        }
        const newStars = oldStars + 1;
        pokemon.battleStars = newStars;

        if (newStars > oldStars) {
            pokemon.lastStarLocation = currentLoc;
            return { earned: true, reason: null };
        }
        return { earned: false, reason: 'no_threshold' };
    }

    function getStarBonus(pokemon) {
        const stars = pokemon.battleStars || 0;
        return {
            winChanceBonus: stars * 3,       // +3% per star, max +9%
            deathAvoidChance: stars * 5      // +5% per star, max +15%
        };
    }

    // Get max HP for a Pokemon data entry (respects overrides)
    function getMaxHpForPokemon(data) {
        if (HP_OVERRIDES[data.id] !== undefined) return HP_OVERRIDES[data.id];
        return data.rarity === 'legendary' ? 6 : data.rarity === 'rare' ? 4 : 3;
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

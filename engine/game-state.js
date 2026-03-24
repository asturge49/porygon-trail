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
        // Powerful fully-evolved rares → 5 HP
        3: 5, 6: 5, 9: 5,       // Venusaur, Charizard, Blastoise
        31: 5, 34: 5,            // Nidoqueen, Nidoking
        65: 5, 68: 5,            // Alakazam, Machamp
        59: 5,                   // Arcanine
        94: 5,                   // Gengar
        113: 5, 115: 5,          // Chansey, Kangaskhan
        123: 5, 125: 5, 126: 5, // Scyther, Electabuzz, Magmar
        127: 5,                  // Pinsir
        130: 5, 131: 5,          // Gyarados, Lapras
        137: 5,                  // Porygon
        139: 5, 141: 5,          // Omastar, Kabutops
        142: 5,                  // Aerodactyl
        143: 5,                  // Snorlax
        103: 5,                  // Exeggutor
        149: 5,                  // Dragonite
        // Tough uncommons → 4 HP
        12: 4, 15: 4,            // Butterfree, Beedrill
        18: 4,                   // Pidgeot
        114: 4,                  // Tangela
        148: 4                   // Dragonair
    };

    function createPartyPokemon(data) {
        const baseHp = data.rarity === 'legendary' ? 6 :
                       data.rarity === 'rare' ? 4 : 3;
        const maxHp = HP_OVERRIDES[data.id] !== undefined ? HP_OVERRIDES[data.id] : baseHp;
        return {
            id: data.id,
            name: data.name,
            types: data.types,
            rarity: data.rarity,
            hp: maxHp,
            maxHp: maxHp,
            status: 'healthy',
            travelAbility: data.travelAbility,
            spriteUrl: getSpriteUrl(data.id)
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

    // Evolution System
    function evolvePokemon(partyMon, state) {
        const data = PT.Data.Pokemon.find(p => p.id === partyMon.id);
        if (!data || !data.evolvesTo) return { evolved: false };
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
        pokemonToFood
    };
})();

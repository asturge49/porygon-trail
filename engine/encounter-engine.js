// Porygon Trail - Encounter Engine
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    function rollEncounter(state) {
        const route = PT.Engine.GameState.getCurrentRoute(state);
        if (!route || !route.encounterTable || route.encounterTable.length === 0) return null;

        const entry = state.rng.weightedChoice(route.encounterTable);
        if (!entry) return null;

        const pokemonData = PT.Data.Pokemon.find(p => p.id === entry.pokemonId);
        if (!pokemonData) return null;

        // Level varies around base level
        const levelVariance = state.rng.randInt(-2, 3);
        const level = Math.max(2, pokemonData.baseLevel + levelVariance);

        return {
            id: pokemonData.id,
            name: pokemonData.name,
            types: pokemonData.types,
            rarity: pokemonData.rarity,
            level: level,
            travelAbility: pokemonData.travelAbility,
            spriteUrl: PT.Engine.GameState.getSpriteUrl(pokemonData.id)
        };
    }

    function attemptCatch(pokemon, ballType, state) {
        const baseCatch = { pokeballs: 40, greatballs: 60, ultraballs: 80 };
        const rarityMod = { common: 20, uncommon: 0, rare: -20, legendary: -50 };

        let catchChance = (baseCatch[ballType] || 40) + (rarityMod[pokemon.rarity] || 0);

        // Level difference bonus
        const avgPartyLevel = state.party.reduce((sum, p) => sum + p.level, 0) / state.party.length;
        const levelDiff = Math.max(-20, Math.min(20, (avgPartyLevel - pokemon.level) * 2));
        catchChance += levelDiff;

        // Clamp
        catchChance = Math.max(5, Math.min(95, catchChance));

        // Consume ball
        state.resources[ballType] = Math.max(0, state.resources[ballType] - 1);

        const success = state.rng.chance(catchChance);

        if (!success) {
            state.ballsWasted++;
        }

        return {
            success,
            catchChance: Math.round(catchChance),
            shakes: success ? 3 : state.rng.randInt(0, 2)
        };
    }

    function attemptFlee(state, pokemon) {
        let fleeChance = 80;

        // Dig ability guarantees flee
        if (PT.Engine.GameState.hasAbility(state, 'dig')) {
            return { success: true, message: "Your Ground-type digs an escape tunnel!" };
        }

        // Legendary Pokemon don't chase
        if (pokemon.rarity === 'legendary') {
            return { success: true, message: "The legendary Pokemon watches you leave." };
        }

        // Higher level Pokemon harder to flee from
        const avgLevel = state.party.reduce((sum, p) => sum + p.level, 0) / state.party.length;
        if (pokemon.level > avgLevel + 10) fleeChance -= 20;

        const success = state.rng.chance(fleeChance);
        if (!success) {
            return {
                success: false,
                message: `${pokemon.name} blocks your escape!`
            };
        }
        return { success: true, message: "Got away safely!" };
    }

    function addPokemonToParty(state, pokemon) {
        // Record in pokedex
        if (!state.pokedexCaught.includes(pokemon.id)) {
            state.pokedexCaught.push(pokemon.id);
        }
        if (!state.pokedexSeen.includes(pokemon.id)) {
            state.pokedexSeen.push(pokemon.id);
        }

        // Add to party if space
        if (state.party.length < 6) {
            const pokemonData = PT.Data.Pokemon.find(p => p.id === pokemon.id);
            const partyMember = PT.Engine.GameState.createPartyPokemon(pokemonData, pokemon.level);
            state.party.push(partyMember);
            return { added: true, message: `${pokemon.name} joined your team!` };
        } else {
            return { added: false, message: `${pokemon.name} was caught! But your party is full. Registered in Pokedex.` };
        }
    }

    PT.Engine.EncounterEngine = {
        rollEncounter,
        attemptCatch,
        attemptFlee,
        addPokemonToParty
    };
})();

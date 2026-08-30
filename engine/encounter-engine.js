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
            spriteUrl: PT.Engine.GameState.getSpriteUrl(pokemonData.id, state.region)
        };
    }

    // Roaming legendary beasts (§8.5) — active from the moment the run enters
    // Johto, independent of any route's encounterTable. A small per-day chance
    // per uncaught beast, checked alongside the normal encounter roll.
    const ROAM_CHANCE_PER_BEAST = 4;

    function rollRoamEncounter(state) {
        if (state.region !== 'johto') return null;
        const beasts = PT.Data.Pokemon.filter(p => p.roaming && !state.pokedexCaught.includes(p.id));
        if (beasts.length === 0) return null;
        // Silph Scope boosts legendary-sighting odds elsewhere (event-engine.js) —
        // roaming beasts are exactly that, so the same multiplier applies here.
        const roamChance = ROAM_CHANCE_PER_BEAST * PT.Engine.GameState.getSilphScopeMultiplier(state);
        // Roll every uncaught beast independently, then pick among the hits —
        // Array#find would always check beasts in the same order, biasing
        // toward whichever one happens to sit first in PT.Data.Pokemon.
        const hits = beasts.filter(() => state.rng.chance(roamChance));
        if (hits.length === 0) return null;
        const roamer = state.rng.pick(hits);

        const levelVariance = state.rng.randInt(-2, 3);
        const level = Math.max(2, roamer.baseLevel + levelVariance);

        return {
            id: roamer.id,
            name: roamer.name,
            types: roamer.types,
            rarity: roamer.rarity,
            level: level,
            travelAbility: roamer.travelAbility,
            spriteUrl: PT.Engine.GameState.getSpriteUrl(roamer.id, state.region),
            roaming: true
        };
    }

    function attemptCatch(pokemon, ballType, state) {
        const baseCatch = { pokeballs: 40, greatballs: 60, ultraballs: 80 };
        const rarityMod = { common: 20, uncommon: 0, rare: -20, legendary: -50 };

        let catchChance = (baseCatch[ballType] || 40) + (rarityMod[pokemon.rarity] || 0);

        // Catch Rate buff (Soothe Bell stacks)
        const catchRateBonus = PT.Engine.GameState.getCatchRateBonus(state);
        catchChance += catchRateBonus;

        // Intimidate ability: catch rate bonus scales with power (8% per power point)
        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        const hasIntimidate = intimidatePower > 0;
        if (hasIntimidate) {
            catchChance += Math.floor(8 * intimidatePower);
        }

        // Clamp
        const preClampChance = catchChance;
        catchChance = Math.max(5, Math.min(95, catchChance));
        const maxed = preClampChance !== catchChance;

        // Consume ball
        state.resources[ballType] = Math.max(0, state.resources[ballType] - 1);

        const success = state.rng.chance(catchChance);

        if (!success) {
            state.ballsWasted++;
        }

        return {
            success,
            catchChance: Math.round(catchChance),
            shakes: success ? 3 : state.rng.randInt(0, 2),
            intimidateBonus: hasIntimidate,
            catchRateBonus,
            maxed
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

        // Rare Pokemon harder to flee from
        if (pokemon.rarity === 'rare') fleeChance -= 10;

        // Johto flee/damage tension (§11): escapes are less reliable, and a
        // failed one is far more likely to cost HP than back in Kanto — this
        // punishes over-relying on flee-to-avoid-risk rather than stacking raw
        // encounter danger. hitChance is read by the caller's existing
        // failed-flee damage roll (screens/encounter-screen.js).
        const inJohto = state.region === 'johto';
        if (inJohto) fleeChance -= 20;

        const success = state.rng.chance(fleeChance);
        if (!success) {
            return {
                success: false,
                message: `${pokemon.name} blocks your escape!`,
                hitChance: inJohto ? 85 : 40
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
            const partyMember = PT.Engine.GameState.createPartyPokemon(pokemonData, state);
            state.party.push(partyMember);
            return { added: true, message: `${pokemon.name} joined your team!` };
        } else {
            const pokemonData = PT.Data.Pokemon.find(p => p.id === pokemon.id);
            return { added: false, partyFull: true, pokemonData: pokemonData, message: `${pokemon.name} was caught! But your party is full.` };
        }
    }

    PT.Engine.EncounterEngine = {
        rollEncounter,
        rollRoamEncounter,
        attemptCatch,
        attemptFlee,
        addPokemonToParty
    };
})();

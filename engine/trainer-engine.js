// Porygon Trail - Trainer Engine
// Difficulty-gated trail trainer battles (level 2+, see data/difficulty-levels.js).
// engine/travel-engine.js calls rollTrainerEncounter(state) once per day,
// independently of the existing wild-encounter/event rolls, and attaches a
// non-null result to that day's results.trainerBattle (see the comment above
// that call site for the exact shape). Resolution — win/loss damage, reward
// money, logging — happens later via resolveTrainerBattle, called by
// whatever screen presents the battle to the player.
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const TRAINER_ENCOUNTER_CHANCE = 30; // % — independent roll, gated separately below

    // Kanto tiering: compares the current route index against the indices of
    // the routes whose gymLeader is brock / erika / giovanni (the
    // viridian_city_return entry, Kanto's 2nd Giovanni visit) within
    // PT.Data.Routes. Returns null/undefined for Johto — tiering doesn't
    // apply there (Johto trainer classes have no tierMin/tierMax).
    function getCurrentTier(state) {
        if (!state || state.region !== 'kanto') return null;
        const routes = PT.Data.Routes;
        const brockIdx = routes.findIndex(r => r.gymLeader === 'brock');
        const erikaIdx = routes.findIndex(r => r.gymLeader === 'erika');
        const giovanniIdx = routes.findIndex(r => r.id === 'viridian_city_return');
        const idx = state.currentLocationIndex;
        if (brockIdx === -1 || erikaIdx === -1 || giovanniIdx === -1) return 1;
        if (idx < brockIdx) return 1;
        if (idx < erikaIdx) return 2;
        if (idx < giovanniIdx) return 3;
        return 4;
    }

    // Which trainer classes can appear on the current route, per the match
    // rule in data/trainers.js's header comment: a class matches if the
    // route's id is in its routeIds, OR the route's terrain is in its
    // terrain list. Region and (Kanto-only) tier must also match.
    function getMatchingClasses(state, route) {
        const region = state.region;
        const tier = region === 'kanto' ? getCurrentTier(state) : null;
        return PT.Data.Trainers.filter(cls => {
            if (cls.region !== region) return false;
            if (region === 'kanto') {
                if (cls.tierMin != null && tier < cls.tierMin) return false;
                if (cls.tierMax != null && tier > cls.tierMax) return false;
            }
            const routeMatch = (cls.routeIds || []).includes(route.id);
            const terrainMatch = (cls.terrain || []).includes(route.terrain);
            return routeMatch || terrainMatch;
        });
    }

    // Damage the trainer's Pokemon deals on a player loss. Kanto scales by
    // tier (1-4); Johto is flat regardless of route.
    function rollDamage(state, tier) {
        if (state.region === 'johto') {
            return state.rng.randInt(3, 4);
        }
        switch (tier) {
            case 1: return state.rng.randInt(1, 2);
            case 2: return state.rng.randInt(2, 3);
            case 3: return state.rng.randInt(3, 4);
            default: return 4; // tier 4 — flat
        }
    }

    // Returns null, or a trainer encounter object shaped:
    //   {
    //     trainerClassId, trainerName, spriteKey, region, tier,
    //     pokemon: { id, name, level, ace },
    //     damage, reward
    //   }
    function rollTrainerEncounter(state) {
        const levelConfig = PT.Data.getLevelConfig(state);
        if (!levelConfig.trainersEnabled) return null;

        const route = PT.Engine.GameState.getCurrentRoute(state);
        if (!route || !(route.encounterRate > 0)) return null;

        if (!state.trainerEncounteredLocations) state.trainerEncounteredLocations = [];
        if (state.trainerEncounteredLocations.includes(state.currentLocationIndex)) return null;

        if (!state.rng.chance(TRAINER_ENCOUNTER_CHANCE)) return null;

        const matches = getMatchingClasses(state, route);
        if (matches.length === 0) return null;

        const trainerClass = state.rng.pick(matches);
        const pokemonId = state.rng.pick(trainerClass.pokemonPool);
        const pokemonData = PT.Data.Pokemon.find(p => p.id === pokemonId);
        if (!pokemonData) return null;

        const tier = state.region === 'kanto' ? getCurrentTier(state) : null;
        const damage = rollDamage(state, tier);
        const ace = !!levelConfig.aceTrainers;

        // Level: sane relative to this route's own encounter table levels —
        // reuse the wild encounter table's average baseLevel for this route,
        // falling back to the trainer Pokemon's own baseLevel if the route
        // has no encounter table (e.g. town/city stops with encounterRate 0,
        // which can't reach here anyway since that's gated above).
        let level = pokemonData.baseLevel || 5;
        if (route.encounterTable && route.encounterTable.length > 0) {
            const levels = route.encounterTable
                .map(e => {
                    const d = PT.Data.Pokemon.find(p => p.id === e.pokemonId);
                    return d ? d.baseLevel : null;
                })
                .filter(l => l != null);
            if (levels.length > 0) {
                level = Math.round(levels.reduce((sum, l) => sum + l, 0) / levels.length);
            }
        }

        // Mark this location as used the moment a trainer is actually rolled
        // (win or lose is decided later, in resolveTrainerBattle).
        state.trainerEncounteredLocations.push(state.currentLocationIndex);

        return {
            trainerClassId: trainerClass.id,
            trainerName: trainerClass.name,
            spriteKey: trainerClass.spriteKey,
            region: trainerClass.region,
            tier: tier,
            pokemon: {
                id: pokemonData.id,
                name: pokemonData.name,
                level: level,
                ace: ace
            },
            damage: damage,
            reward: trainerClass.rewardMoney
        };
    }

    // Resolve a trainer battle's outcome. `partyMemberId` is a party
    // Pokemon's dex id (the `id` field on a party member, same convention as
    // every other party lookup in this codebase) — the first alive match is
    // used as the target/winner. On loss, damages that Pokemon the same way
    // engine/event-engine.js's event battles do (PT.Engine.GameState.damagePokemon,
    // which already handles fainting/graveyard). On win, awards the trainer's
    // reward money and increments state.trainersDefeated.
    function resolveTrainerBattle(state, partyMemberId, won, trainerEncounter) {
        const alive = PT.Engine.GameState.getAliveParty(state);
        const pokemon = alive.find(p => p.id === partyMemberId) || alive[0];
        if (!pokemon) return { resolved: false };

        const trainerName = trainerEncounter ? trainerEncounter.trainerName : 'Trainer';
        const opponentName = trainerEncounter && trainerEncounter.pokemon ? trainerEncounter.pokemon.name : 'their Pokemon';

        if (won) {
            const reward = trainerEncounter ? (trainerEncounter.reward || 0) : 0;
            const moneyAwarded = PT.Engine.GameState.applyPayDay(state, reward);
            state.resources.money += moneyAwarded;
            state.trainersDefeated = (state.trainersDefeated || 0) + 1;
            PT.Engine.GameState.addToLog(state, `Defeated ${trainerName}'s ${opponentName}! Got $${moneyAwarded}!`);
            return { resolved: true, won: true, moneyAwarded };
        }

        const damage = trainerEncounter ? (trainerEncounter.damage || 1) : 1;
        const fainted = PT.Engine.GameState.damagePokemon(pokemon, damage, state);
        if (fainted) {
            PT.Engine.GameState.addToLog(state, `Lost to ${trainerName}'s ${opponentName}. ${pokemon.name} was killed!`);
        } else {
            PT.Engine.GameState.addToLog(state, `Lost to ${trainerName}'s ${opponentName}. ${pokemon.name} took ${damage} damage.`);
        }
        return { resolved: true, won: false, fainted: !!fainted, damage };
    }

    PT.Engine.TrainerEngine = { getCurrentTier, rollTrainerEncounter, resolveTrainerBattle };
})();

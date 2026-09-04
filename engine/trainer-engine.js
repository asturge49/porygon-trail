// Porygon Trail - Trainer Engine
// Difficulty-gated trail trainer battles (level 2+, see data/difficulty-levels.js).
// engine/travel-engine.js folds TRAINER_ENCOUNTER_CHANCE into the SAME roll
// as the narrative event chance (mutually exclusive with both a wild
// encounter and a regular event — see that call site) rather than rolling
// for a trainer independently, so a single day never stacks a trainer fight
// on top of something else. isTrainerEligible(state) lets travel-engine
// check eligibility (level, route, one-per-location cap, matching classes)
// before committing to that combined roll; generateTrainerEncounter(state)
// builds the actual encounter once the combined roll has already decided a
// trainer is what happens. Resolution — win/loss damage, reward money,
// logging — happens later via resolveTrainerBattle, called by whatever
// screen presents the battle to the player.
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const TRAINER_ENCOUNTER_CHANCE = 30; // % share of the combined event+trainer roll (see travel-engine.js)

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

    // Everything that has to be true for a trainer to be able to show up
    // here at all, independent of the RNG roll itself: difficulty level,
    // a real route with wild encounters enabled, this location not already
    // having had its one trainer for the visit, and at least one trainer
    // class actually matching the current region/terrain/tier. Doesn't
    // touch state.rng — safe to call speculatively before deciding whether
    // to roll for a trainer at all.
    function isTrainerEligible(state) {
        const levelConfig = PT.Data.getLevelConfig(state);
        if (!levelConfig.trainersEnabled) return false;

        const route = PT.Engine.GameState.getCurrentRoute(state);
        if (!route || !(route.encounterRate > 0)) return false;

        if (!state.trainerEncounteredLocations) state.trainerEncounteredLocations = [];
        if (state.trainerEncounteredLocations.includes(state.currentLocationIndex)) return false;

        return getMatchingClasses(state, route).length > 0;
    }

    // Builds and returns a trainer encounter object, shaped:
    //   {
    //     trainerClassId, trainerName, spriteKey, region, tier,
    //     pokemon: { id, name, level, ace },
    //     damage, reward
    //   }
    // Assumes the caller already confirmed isTrainerEligible(state) and has
    // already decided (via its own roll) that a trainer is what happens
    // today — this function itself never rolls a chance, it just generates
    // the encounter's content. Returns null if eligibility turns out to no
    // longer hold (defensive — state shouldn't change between the two calls
    // in practice, since both happen synchronously within the same day's
    // roll).
    function generateTrainerEncounter(state) {
        if (!isTrainerEligible(state)) return null;
        const levelConfig = PT.Data.getLevelConfig(state);
        const route = PT.Engine.GameState.getCurrentRoute(state);

        const matches = getMatchingClasses(state, route);
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
    // reward money, increments state.trainersDefeated, and — same as every
    // other battle type (gym/event/E4) — gives the winning Pokemon its shot
    // at evolving and, if it doesn't evolve this fight, a battle star.
    // evolvePokemon/tryEarnStar each already enforce their own "once per
    // location" cap (lastEvoLocation/lastStarLocation), so trainer wins
    // naturally respect that same limit without any extra bookkeeping here.
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

            // Try evolution first — the win that causes it doesn't also earn a star.
            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon, state);
            if (evoResult.evolved) {
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            }
            const starResult = PT.Engine.GameState.addBattleWin(pokemon, state, evoResult.evolved);

            return { resolved: true, won: true, moneyAwarded, evolution: evoResult.evolved ? evoResult : null, starResult };
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

    PT.Engine.TrainerEngine = { getCurrentTier, isTrainerEligible, generateTrainerEncounter, resolveTrainerBattle, TRAINER_ENCOUNTER_CHANCE };
})();

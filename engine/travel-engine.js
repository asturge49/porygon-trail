// Porygon Trail - Travel Engine
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const PACE_CONFIG = {
        resting: { distance: 0, foodMult: 0.5, encounterMod: -15, eventMod: -5, healParty: true },
        steady: { distance: 12, foodMult: 1, encounterMod: 0, eventMod: 0 },
        fast: { distance: 17, foodMult: 1.5, encounterMod: 15, eventMod: 8 },
        grueling: { distance: 22, foodMult: 2.5, encounterMod: 25, eventMod: 15, injuryChance: 15 }
    };

    function advanceDay(state) {
        const results = {
            dayNumber: state.daysElapsed + 1,
            messages: [],
            encounter: null,
            event: null,
            arrivedAtLocation: false,
            gameOver: false
        };

        state.daysElapsed++;
        const pace = PACE_CONFIG[state.pace] || PACE_CONFIG.steady;
        const route = PT.Engine.GameState.getCurrentRoute(state);
        const nextRoute = PT.Engine.GameState.getNextRoute(state);

        // --- Distance ---
        if (pace.distance > 0 && nextRoute) {
            const variance = state.rng.randInt(-3, 3);
            const dist = Math.max(0, pace.distance + variance);
            state.distanceTraveled += dist;
            results.messages.push(`Traveled ${dist} miles.`);

            // Check for arrival
            if (state.distanceTraveled >= route.distanceToNext) {
                state.currentLocationIndex++;
                state.distanceTraveled = 0;
                results.arrivedAtLocation = true;
                const newRoute = PT.Engine.GameState.getCurrentRoute(state);
                results.messages.push(`Arrived at ${newRoute.name}!`);
                PT.Engine.GameState.addToLog(state, `Arrived at ${newRoute.name}!`);

                // Check for victory
                if (state.currentLocationIndex >= PT.Data.Routes.length - 1) {
                    results.messages.push("You've reached the Indigo Plateau!");
                }
            }
        }

        // --- Food consumption ---
        const aliveCount = Math.max(1, PT.Engine.GameState.getAliveParty(state).length);
        const foodConsumed = Math.ceil(aliveCount * pace.foodMult);
        state.resources.food = Math.max(0, state.resources.food - foodConsumed);
        results.messages.push(`Party consumed ${foodConsumed} food.`);

        // Fire ability reduces food consumption
        if (PT.Engine.GameState.hasAbility(state, 'fire') && foodConsumed > 1) {
            state.resources.food = Math.min(state.resources.food + 1, 999);
            results.messages.push("Fire-type Pokemon cooked efficiently! (+1 food saved)");
        }

        // --- Starvation check ---
        if (state.resources.food <= 0) {
            state.starvingDays++;
            results.messages.push(`No food! Starving for ${state.starvingDays} day(s)!`);
            if (state.starvingDays >= 3) {
                state.isGameOver = true;
                state.gameOverReason = "starvation";
                results.gameOver = true;
                results.messages.push("Your team has starved...");
                return results;
            }
            // Starvation damage
            const victim = state.rng.pick(PT.Engine.GameState.getAliveParty(state));
            if (victim) {
                PT.Engine.GameState.damagePokemon(victim, 1);
                results.messages.push(`${victim.name} is weakened from hunger!`);
            }
        } else {
            state.starvingDays = 0;
        }

        // --- Healing from rest ---
        if (pace.healParty) {
            PT.Engine.GameState.getAliveParty(state).forEach(p => {
                if (p.hp < p.maxHp) {
                    p.hp = Math.min(p.hp + 1, p.maxHp);
                }
                if (p.status === 'poisoned' || p.status === 'paralyzed') {
                    p.status = 'healthy';
                }
            });
            results.messages.push("Resting... Pokemon recover 1 HP.");
        }

        // --- Heal ability passive ---
        if (PT.Engine.GameState.hasAbility(state, 'heal') && !pace.healParty) {
            const injured = PT.Engine.GameState.getAliveParty(state).filter(p => p.hp < p.maxHp);
            if (injured.length > 0 && state.rng.chance(40)) {
                const healed = state.rng.pick(injured);
                healed.hp = Math.min(healed.hp + 1, healed.maxHp);
                results.messages.push(`${healed.name} was healed by your healer Pokemon!`);
            }
        }

        // --- Grueling pace injury ---
        if (pace.injuryChance && state.rng.chance(pace.injuryChance)) {
            const victim = state.rng.pick(PT.Engine.GameState.getAliveParty(state));
            if (victim) {
                PT.Engine.GameState.damagePokemon(victim, 1);
                results.messages.push(`The grueling pace injured ${victim.name}!`);
            }
        }

        // --- Poison tick ---
        state.party.forEach(p => {
            if (p.status === 'poisoned') {
                const fainted = PT.Engine.GameState.damagePokemon(p, 1);
                results.messages.push(`${p.name} takes poison damage!`);
                if (fainted) {
                    results.messages.push(`${p.name} fainted from poison!`);
                    state.pokemonLost++;
                }
            }
        });

        // --- Passive travel XP ---
        if (pace.distance > 0) {
            const levelUps = PT.Engine.GameState.awardPartyXP(state, 3);
            if (levelUps.length > 0) {
                results.messages.push(PT.Engine.GameState.formatLevelUps(levelUps));
            }
        }

        // --- Check all fainted ---
        if (PT.Engine.GameState.getAliveParty(state).length === 0) {
            state.isGameOver = true;
            state.gameOverReason = "blackout";
            results.gameOver = true;
            results.messages.push("All your Pokemon have fainted...");
            return results;
        }

        // --- Encounter roll ---
        if (!results.arrivedAtLocation && nextRoute) {
            const encounterChance = 30 + (pace.encounterMod || 0);
            if (state.repelSteps > 0) {
                state.repelSteps--;
                results.messages.push(`Repel active (${state.repelSteps} left).`);
            } else if (PT.Engine.GameState.hasAbility(state, 'poison') && state.rng.chance(15)) {
                results.messages.push("Poison-type Pokemon repels wild encounters!");
            } else if (state.rng.chance(encounterChance)) {
                results.encounter = PT.Engine.EncounterEngine.rollEncounter(state);
                if (results.encounter) {
                    results.messages.push(`A wild ${results.encounter.name} appeared!`);
                }
            }
        }

        // --- Event roll ---
        if (!results.encounter && !results.arrivedAtLocation) {
            const eventChance = 25 + (pace.eventMod || 0);
            if (state.rng.chance(eventChance)) {
                results.event = PT.Engine.EventEngine.rollEvent(state);
                if (results.event) {
                    results.messages.push(`Event: ${results.event.name}`);
                }
            }
        }

        // --- Psychic ability: preview ---
        if (PT.Engine.GameState.hasAbility(state, 'psychic') && (results.encounter || results.event)) {
            results.psychicWarning = true;
            results.messages.push("Your Psychic-type senses something ahead...");
        }

        // --- Fly ability: scout ---
        if (PT.Engine.GameState.hasAbility(state, 'fly') && !results.encounter && !results.event && state.rng.chance(20)) {
            results.messages.push("Your Flying-type scouts ahead and reports the path is clear.");
        }

        return results;
    }

    PT.Engine.TravelEngine = { advanceDay, PACE_CONFIG };
})();

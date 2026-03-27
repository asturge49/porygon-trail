// Porygon Trail - Travel Engine
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const PACE_CONFIG = {
        explore: { distance: 0, foodMult: 0.5, encounterMod: 20, eventMod: 25, healParty: true },
        steady: { distance: 12, foodMult: 1, encounterMod: 0, eventMod: 0 },
        push: { distance: 20, foodMult: 2, encounterMod: 10, eventMod: 15, injuryChance: 20 }
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

        // --- Food consumption (weighted by evo stage) ---
        const aliveParty = PT.Engine.GameState.getAliveParty(state);
        const baseFood = aliveParty.length > 0
            ? aliveParty.reduce((sum, p) => sum + PT.Engine.GameState.getFoodCost(p), 0)
            : 1;
        const foodConsumed = Math.ceil(baseFood * pace.foodMult);
        state.resources.food = Math.max(0, state.resources.food - foodConsumed);
        results.messages.push(`Party consumed ${foodConsumed} food.`);

        // Fire ability reduces food consumption
        if (PT.Engine.GameState.hasAbility(state, 'fire') && foodConsumed > 1) {
            state.resources.food = Math.min(state.resources.food + 1, 999);
            results.messages.push("🔥 FIRE ABILITY: Your Fire-type cooked efficiently! (+1 food saved)");
        }

        // Cut ability forages for extra food
        if (PT.Engine.GameState.hasAbility(state, 'cut') && state.rng.chance(25)) {
            const foraged = state.rng.randInt(1, 3);
            state.resources.food += foraged;
            results.messages.push(`🌿 CUT ABILITY: Your Pokemon cut through brush and foraged +${foraged} food!`);
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
            // Starvation damage — hits every party member
            const starving = PT.Engine.GameState.getAliveParty(state);
            starving.forEach(p => {
                PT.Engine.GameState.damagePokemon(p, 1, state);
            });
            if (starving.length > 0) {
                results.messages.push(`All Pokemon are weakened from hunger! (-1 HP each)`);
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
                results.messages.push(`💗 HEAL ABILITY: ${healed.name} was healed by your healer Pokemon!`);
            }
        }

        // --- Guard ability: block grueling pace injuries ---
        // (Handled below in injury section)

        // --- Grueling pace injury ---
        if (pace.injuryChance) {
            let effectiveInjuryChance = pace.injuryChance;
            // Strength ability halves injury chance
            if (PT.Engine.GameState.hasAbility(state, 'strength')) {
                effectiveInjuryChance = Math.floor(effectiveInjuryChance / 2);
                results.messages.push("💪 STRENGTH ABILITY: Your strong Pokemon carries the weaker ones, reducing injury risk!");
            }
            if (state.rng.chance(effectiveInjuryChance)) {
                // Guard ability can block the injury entirely
                if (PT.Engine.GameState.hasAbility(state, 'guard') && state.rng.chance(30)) {
                    results.messages.push("🛡️ GUARD ABILITY: Your defensive Pokemon shielded the party from injury!");
                } else {
                    const victim = state.rng.pick(PT.Engine.GameState.getAliveParty(state));
                    if (victim) {
                        PT.Engine.GameState.damagePokemon(victim, 1, state);
                        results.messages.push(`The grueling pace injured ${victim.name}!`);
                    }
                }
            }
        }

        // --- Poison tick ---
        [...state.party].forEach(p => {
            if (p.status === 'poisoned') {
                const fainted = PT.Engine.GameState.damagePokemon(p, 1, state);
                results.messages.push(`${p.name} takes poison damage!`);
                if (fainted) {
                    results.messages.push(`${p.name} died from poison! 💀`);
                }
            }
        });

        // --- Check all dead ---
        if (state.party.length === 0) {
            state.isGameOver = true;
            if (!state.gameOverReason) state.gameOverReason = "party_wiped";
            results.gameOver = true;
            results.messages.push("All your Pokemon have perished...");
            return results;
        }

        // --- Fly ability: bonus travel distance ---
        if (PT.Engine.GameState.hasAbility(state, 'fly') && pace.distance > 0 && nextRoute && !results.arrivedAtLocation) {
            const flyBonus = 3;
            state.distanceTraveled += flyBonus;
            results.messages.push(`🦅 FLY ABILITY: Your Flying-type scouts shortcuts! (+${flyBonus} miles)`);
            // Re-check arrival after fly bonus
            if (state.distanceTraveled >= route.distanceToNext) {
                state.currentLocationIndex++;
                state.distanceTraveled = 0;
                results.arrivedAtLocation = true;
                const newRoute = PT.Engine.GameState.getCurrentRoute(state);
                results.messages.push(`Arrived at ${newRoute.name}!`);
                PT.Engine.GameState.addToLog(state, `Arrived at ${newRoute.name}!`);
            }
        }

        // --- Surf ability: faster on water routes ---
        if (PT.Engine.GameState.hasAbility(state, 'surf') && pace.distance > 0 && nextRoute && !results.arrivedAtLocation) {
            if (route.terrain === 'water') {
                const surfBonus = 5;
                state.distanceTraveled += surfBonus;
                results.messages.push(`🌊 SURF ABILITY: Your Water-type surfs ahead! (+${surfBonus} miles on water)`);
                if (state.distanceTraveled >= route.distanceToNext) {
                    state.currentLocationIndex++;
                    state.distanceTraveled = 0;
                    results.arrivedAtLocation = true;
                    const newRoute = PT.Engine.GameState.getCurrentRoute(state);
                    results.messages.push(`Arrived at ${newRoute.name}!`);
                    PT.Engine.GameState.addToLog(state, `Arrived at ${newRoute.name}!`);
                }
            }
        }

        // --- Flash ability: find hidden items/money ---
        if (PT.Engine.GameState.hasAbility(state, 'flash') && state.rng.chance(20)) {
            const flashRoll = state.rng.randInt(1, 100);
            if (flashRoll <= 40) {
                const baseMoneyFound = state.rng.randInt(50, 200);
                const moneyFound = PT.Engine.GameState.applyPayDay(state, baseMoneyFound);
                state.resources.money += moneyFound;
                results.messages.push(`⚡ FLASH ABILITY: Your Electric-type illuminated a hidden stash! Found $${moneyFound}!${moneyFound > baseMoneyFound ? ' 💰 PAY DAY!' : ''}`);
            } else if (flashRoll <= 70) {
                state.resources.potions++;
                results.messages.push("⚡ FLASH ABILITY: Your Electric-type lit up a hidden Potion!");
            } else {
                state.resources.pokeballs += 2;
                results.messages.push("⚡ FLASH ABILITY: Your Electric-type found 2 hidden Poke Balls!");
            }
        }

        // --- Encounter roll ---
        if (!results.arrivedAtLocation || pace.distance === 0) {
            const encounterChance = 30 + (pace.encounterMod || 0);
            if (state.repelSteps > 0) {
                state.repelSteps--;
                results.messages.push(`Repel active (${state.repelSteps} left).`);
            } else if (state.rng.chance(encounterChance)) {
                results.encounter = PT.Engine.EncounterEngine.rollEncounter(state);
                if (results.encounter) {
                    results.messages.push(`A wild ${results.encounter.name} appeared!`);
                }
            }
        }

        // --- Event roll ---
        if (!results.encounter && (!results.arrivedAtLocation || pace.distance === 0)) {
            const eventChance = 25 + (pace.eventMod || 0);
            if (state.rng.chance(eventChance)) {
                results.event = PT.Engine.EventEngine.rollEvent(state);
                if (results.event) {
                    results.messages.push(`Event: ${results.event.name}`);
                }
            }
        }

        // --- Psychic ability: foresight (pick between two outcomes) ---
        if (PT.Engine.GameState.hasAbility(state, 'psychic') && state.rng.chance(40)) {
            if (results.encounter) {
                // Roll a second encounter as an alternative
                const alt = PT.Engine.EncounterEngine.rollEncounter(state);
                if (alt && alt.id !== results.encounter.id) {
                    results.psychicChoice = 'encounter';
                    results.psychicAlt = alt;
                    results.messages.push("🔮 PSYCHIC ABILITY: Your Psychic-type foresees two possible encounters!");
                }
            } else if (results.event) {
                // Roll a second event as an alternative
                const alt = PT.Engine.EventEngine.rollEvent(state);
                if (alt && alt.id !== results.event.id) {
                    results.psychicChoice = 'event';
                    results.psychicAlt = alt;
                    results.messages.push("🔮 PSYCHIC ABILITY: Your Psychic-type foresees two possible futures!");
                }
            } else {
                // No encounter or event — psychic forces an encounter choice
                const enc1 = PT.Engine.EncounterEngine.rollEncounter(state);
                const enc2 = PT.Engine.EncounterEngine.rollEncounter(state);
                if (enc1 && enc2 && enc1.id !== enc2.id) {
                    results.encounter = enc1;
                    results.psychicChoice = 'encounter';
                    results.psychicAlt = enc2;
                    results.messages.push("🔮 PSYCHIC ABILITY: Your Psychic-type senses wild Pokemon nearby — choose which to face!");
                } else if (enc1) {
                    results.encounter = enc1;
                    results.messages.push("🔮 PSYCHIC ABILITY: Your Psychic-type detected a wild Pokemon!");
                }
            }
        }

        // --- Glitch ability: MissingNo chaos ---
        if (PT.Engine.GameState.hasAbility(state, 'glitch') && state.rng.chance(15)) {
            const glitchRoll = state.rng.randInt(1, 100);
            if (glitchRoll <= 30) {
                // Duplicate a random item
                const dupeTargets = ['pokeballs', 'greatballs', 'potions', 'superPotions'];
                const dupeKey = state.rng.pick(dupeTargets);
                if (state.resources[dupeKey] > 0) {
                    const duped = Math.min(state.resources[dupeKey], state.rng.randInt(1, 3));
                    state.resources[dupeKey] += duped;
                    const itemName = PT.Data.Items[dupeKey] ? PT.Data.Items[dupeKey].name : dupeKey;
                    results.messages.push(`👾 GLITCH ABILITY: MissingNo. corrupted your bag! +${duped} ${itemName} duplicated!`);
                }
            } else if (glitchRoll <= 50) {
                // Random money glitch
                const baseGlitchMoney = state.rng.randInt(100, 500);
                const glitchMoney = PT.Engine.GameState.applyPayDay(state, baseGlitchMoney);
                state.resources.money += glitchMoney;
                results.messages.push(`👾 GLITCH ABILITY: Memory overflow! +$${glitchMoney} appeared in your wallet!${glitchMoney > baseGlitchMoney ? ' 💰 PAY DAY!' : ''}`);
            } else if (glitchRoll <= 70) {
                // Heal a random party member to full
                const injured = PT.Engine.GameState.getAliveParty(state).filter(p => p.hp < p.maxHp);
                if (injured.length > 0) {
                    const target = state.rng.pick(injured);
                    target.hp = target.maxHp;
                    results.messages.push(`👾 GLITCH ABILITY: Data corruption healed ${target.name} to full HP!`);
                }
            } else {
                // Random damage to a party member (chaotic!)
                const victim = state.rng.pick(PT.Engine.GameState.getAliveParty(state));
                if (victim) {
                    PT.Engine.GameState.damagePokemon(victim, 1, state);
                    results.messages.push(`👾 GLITCH ABILITY: Buffer overflow! ${victim.name} took 1 glitch damage!`);
                }
            }
        }

        return results;
    }

    PT.Engine.TravelEngine = { advanceDay, PACE_CONFIG };
})();

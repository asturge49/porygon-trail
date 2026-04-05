// Porygon Trail - Travel Engine
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    const PACE_CONFIG = {
        explore: { distance: 0, foodMult: 0.5, encounterMod: 20, eventMod: 25, healParty: true },
        steady: { distance: 12, foodMult: 1, encounterMod: 0, eventMod: 0 },
        push: { distance: 20, foodMult: 2, encounterMod: 10, eventMod: 15, injuryChance: 20 }
    };

    // Return the name(s) of alive party members with the given ability
    function abilityHolder(state, ability) {
        const holders = state.party.filter(p => p.status !== 'fainted' && p.travelAbility === ability);
        if (holders.length === 0) return null;
        if (holders.length === 1) return holders[0].name;
        return holders.slice(0, -1).map(p => p.name).join(', ') + ' & ' + holders[holders.length - 1].name;
    }

    // After any damagePokemon() call, check transient save flags and push named messages
    function checkSaveMessages(pokemon, state, results) {
        if (pokemon._safeguardSaved) {
            const savior = abilityHolder(state, 'safeguard') || 'Chansey';
            results.messages.push(`🩹 SAFEGUARD: ${savior} stepped in and saved ${pokemon.name} from fainting! (1 HP)`);
            pokemon._safeguardSaved = false;
        }
        if (pokemon._systemRestored) {
            const savior = abilityHolder(state, 'system_restore') || 'Porygon';
            results.messages.push(`💾 SYSTEM RESTORE: ${savior} restored ${pokemon.name} from backup data! (1 HP)`);
            pokemon._systemRestored = false;
        }
        if (pokemon._clutched) {
            results.messages.push(`⭐ CLUTCH: ${pokemon.name}'s battle experience kicked in — survived at 1 HP!`);
            pokemon._clutched = false;
        }
        if (pokemon._auroraBlocked) {
            const savior = abilityHolder(state, 'aurora_veil') || 'Articuno';
            results.messages.push(`❄️ AURORA VEIL: ${savior} absorbed the hit meant for ${pokemon.name}!`);
            pokemon._auroraBlocked = false;
        }
    }

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
            let dist = Math.max(0, pace.distance + variance);

            // Thunderclap (Zapdos) — double travel distance
            if (PT.Engine.GameState.hasAbility(state, 'thunderclap')) {
                dist *= 2;
                results.messages.push(`⚡ THUNDERCLAP: Zapdos' lightning speed doubles your travel distance!`);
            }

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

        // Sacred Flame (Moltres) — zero food consumption
        const hasSacredFlame = PT.Engine.GameState.hasAbility(state, 'sacred_flame');
        let foodConsumed = 0;
        if (hasSacredFlame) {
            results.messages.push(`🔥 SACRED FLAME: Moltres' legendary fire sustains the party! No food consumed.`);
        } else {
            const baseFood = aliveParty.length > 0
                ? aliveParty.reduce((sum, p) => sum + PT.Engine.GameState.getFoodCost(p), 0)
                : 1;
            foodConsumed = Math.ceil(baseFood * pace.foodMult);
            state.resources.food = Math.max(0, state.resources.food - foodConsumed);
            results.messages.push(`Party consumed ${foodConsumed} food.`);
        }

        // Fire ability reduces food consumption (stacks + scales)
        const firePower = PT.Engine.GameState.getAbilityPower(state, 'fire');
        if (firePower > 0 && foodConsumed > 1) {
            const fireSaved = Math.max(1, Math.floor(firePower));
            state.resources.food = Math.min(state.resources.food + fireSaved, 999);
            const fireName = abilityHolder(state, 'fire');
            results.messages.push(`🔥 ${fireName} cooked efficiently, saving ${fireSaved} food!`);
        }

        // Cut ability forages for extra food (stacks + scales)
        const cutPower = PT.Engine.GameState.getAbilityPower(state, 'cut');
        if (cutPower > 0 && state.rng.chance(25)) {
            const foraged = Math.max(1, Math.floor(state.rng.randInt(1, 3) * cutPower));
            state.resources.food += foraged;
            const cutName = abilityHolder(state, 'cut');
            results.messages.push(`🌿 ${cutName} cut through the brush and foraged +${foraged} food!`);
        }

        // --- Starvation check ---
        if (state.resources.food <= 0) {
            state.starvingDays++;
            results.messages.push(`⚠️ No food! Your Pokemon are starving!`);
            // Starvation damage — hits every alive party member for 1 HP
            const starving = PT.Engine.GameState.getAliveParty(state);
            starving.forEach(p => {
                PT.Engine.GameState.damagePokemon(p, 1, state);
                checkSaveMessages(p, state, results);
            });
            if (starving.length > 0) {
                results.messages.push(`All Pokemon take 1 damage from hunger!`);
            }
            // Game over happens naturally when all Pokemon faint from damagePokemon
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

        // --- Heal ability passive (stacks: higher power = more heals) ---
        const healPower = PT.Engine.GameState.getAbilityPower(state, 'heal');
        if (healPower > 0 && !pace.healParty) {
            const injured = PT.Engine.GameState.getAliveParty(state).filter(p => p.hp < p.maxHp);
            if (injured.length > 0 && state.rng.chance(40)) {
                const healCount = Math.min(injured.length, Math.max(1, Math.floor(healPower)));
                const healerName = abilityHolder(state, 'heal');
                for (let h = 0; h < healCount; h++) {
                    const toHeal = injured.filter(p => p.hp < p.maxHp);
                    if (toHeal.length === 0) break;
                    const healed = state.rng.pick(toHeal);
                    healed.hp = Math.min(healed.hp + 1, healed.maxHp);
                    results.messages.push(`💗 ${healerName} nursed ${healed.name} back to health! (+1 HP)`);
                }
            }
        }

        // --- Guard ability: block grueling pace injuries ---
        // (Handled below in injury section)

        // --- Grueling pace injury ---
        if (pace.injuryChance) {
            let effectiveInjuryChance = pace.injuryChance;
            // Strength ability reduces injury chance (scales with power)
            const strengthPower = PT.Engine.GameState.getAbilityPower(state, 'strength');
            if (strengthPower > 0) {
                const reduction = Math.min(0.8, strengthPower * 0.15); // 15% reduction per power, max 80%
                effectiveInjuryChance = Math.floor(effectiveInjuryChance * (1 - reduction));
                const strengthName = abilityHolder(state, 'strength');
                results.messages.push(`💪 ${strengthName} is carrying the team, reducing injury risk!`);
            }
            if (state.rng.chance(effectiveInjuryChance)) {
                // Guard ability can block the injury entirely (scales with power)
                const guardPower = PT.Engine.GameState.getAbilityPower(state, 'guard');
                const guardChance = guardPower > 0 ? Math.min(70, Math.floor(15 * guardPower)) : 0;
                if (guardPower > 0 && state.rng.chance(guardChance)) {
                    const guardName = abilityHolder(state, 'guard');
                    results.messages.push(`🛡️ ${guardName} shielded the party from injury!`);
                } else {
                    const victim = state.rng.pick(PT.Engine.GameState.getAliveParty(state));
                    if (victim) {
                        PT.Engine.GameState.damagePokemon(victim, 1, state);
                        checkSaveMessages(victim, state, results);
                        results.messages.push(`The grueling pace injured ${victim.name}!`);
                    }
                }
            }
        }

        // --- Poison tick ---
        [...state.party].forEach(p => {
            if (p.status === 'poisoned') {
                const fainted = PT.Engine.GameState.damagePokemon(p, 1, state);
                checkSaveMessages(p, state, results);
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

        // --- Fly ability: bonus travel distance (stacks + scales) ---
        const flyPower = PT.Engine.GameState.getAbilityPower(state, 'fly');
        if (flyPower > 0 && pace.distance > 0 && nextRoute && !results.arrivedAtLocation) {
            const flyBonus = Math.max(1, Math.floor(3 * flyPower));
            state.distanceTraveled += flyBonus;
            const flyName = abilityHolder(state, 'fly');
            results.messages.push(`🦅 ${flyName} scouted a shortcut! (+${flyBonus} miles)`);
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

        // --- Surf ability: faster on water routes (stacks + scales) ---
        const surfPower = PT.Engine.GameState.getAbilityPower(state, 'surf');
        if (surfPower > 0 && pace.distance > 0 && nextRoute && !results.arrivedAtLocation) {
            if (route.terrain === 'water') {
                const surfBonus = Math.max(1, Math.floor(5 * surfPower));
                state.distanceTraveled += surfBonus;
                const surfName = abilityHolder(state, 'surf');
                results.messages.push(`🌊 ${surfName} surfs ahead on the open water! (+${surfBonus} miles)`);
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

        // --- Flash ability: find hidden items/money (stacks + scales) ---
        const flashPower = PT.Engine.GameState.getAbilityPower(state, 'flash');
        if (flashPower > 0 && state.rng.chance(20)) {
            const flashName = abilityHolder(state, 'flash');
            const flashRoll = state.rng.randInt(1, 100);
            if (flashRoll <= 40) {
                const baseMoneyFound = Math.floor(state.rng.randInt(50, 200) * flashPower);
                const moneyFound = PT.Engine.GameState.applyPayDay(state, baseMoneyFound);
                state.resources.money += moneyFound;
                results.messages.push(`⚡ ${flashName} lit up a hidden stash! Found $${moneyFound}!${moneyFound > baseMoneyFound ? ' 💰 PAY DAY!' : ''}`);
            } else if (flashRoll <= 70) {
                state.resources.potions++;
                results.messages.push(`⚡ ${flashName} found a hidden Potion!`);
            } else {
                state.resources.pokeballs += 2;
                results.messages.push(`⚡ ${flashName} found 2 hidden Poke Balls!`);
            }
        }

        // --- Encounter roll ---
        if (!results.arrivedAtLocation || pace.distance === 0) {
            const baseEncounterRate = route.encounterRate !== undefined ? route.encounterRate : 30;
            const encounterChance = baseEncounterRate + (pace.encounterMod || 0);
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

        // --- Psychic ability: foresight (stacks: higher power = higher trigger chance) ---
        const psychicPower = PT.Engine.GameState.getAbilityPower(state, 'psychic');
        const psychicChance = psychicPower > 0 ? Math.min(70, Math.floor(20 * psychicPower)) : 0;
        if (psychicPower > 0 && state.rng.chance(psychicChance)) {
            const psychicName = abilityHolder(state, 'psychic');
            if (results.encounter) {
                // Roll a second encounter as an alternative
                const alt = PT.Engine.EncounterEngine.rollEncounter(state);
                if (alt && alt.id !== results.encounter.id) {
                    results.psychicChoice = 'encounter';
                    results.psychicAlt = alt;
                    results.messages.push(`🔮 ${psychicName} foresees two possible encounters!`);
                }
            } else if (results.event) {
                // Roll a second event as an alternative
                const alt = PT.Engine.EventEngine.rollEvent(state);
                if (alt && alt.id !== results.event.id) {
                    results.psychicChoice = 'event';
                    results.psychicAlt = alt;
                    results.messages.push(`🔮 ${psychicName} foresees two possible futures!`);
                }
            } else {
                // No encounter or event — psychic forces an encounter choice
                const enc1 = PT.Engine.EncounterEngine.rollEncounter(state);
                const enc2 = PT.Engine.EncounterEngine.rollEncounter(state);
                if (enc1 && enc2 && enc1.id !== enc2.id) {
                    results.encounter = enc1;
                    results.psychicChoice = 'encounter';
                    results.psychicAlt = enc2;
                    results.messages.push(`🔮 ${psychicName} senses wild Pokemon nearby — choose which to face!`);
                } else if (enc1) {
                    results.encounter = enc1;
                    results.messages.push(`🔮 ${psychicName} detected a wild Pokemon!`);
                }
            }
        }

        // --- Glitch ability: MissingNo chaos (stacks + scales) ---
        const glitchPower = PT.Engine.GameState.getAbilityPower(state, 'glitch');
        if (glitchPower > 0 && state.rng.chance(15)) {
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
                    checkSaveMessages(victim, state, results);
                    results.messages.push(`👾 GLITCH ABILITY: Buffer overflow! ${victim.name} took 1 glitch damage!`);
                }
            }
        }

        // --- Miracle ability: Mew's daily random bonus (always triggers) ---
        if (PT.Engine.GameState.hasAbility(state, 'miracle')) {
            const miracleRoll = state.rng.randInt(1, 100);
            if (miracleRoll <= 20) {
                // Full party heal
                PT.Engine.GameState.getAliveParty(state).forEach(p => {
                    p.hp = p.maxHp;
                    if (p.status === 'poisoned' || p.status === 'paralyzed') p.status = 'healthy';
                });
                results.messages.push(`✨ MIRACLE: Mew's radiant energy heals the entire party to full HP!`);
            } else if (miracleRoll <= 40) {
                // Free food
                const foodGain = state.rng.randInt(15, 30);
                state.resources.food += foodGain;
                results.messages.push(`✨ MIRACLE: Mew conjures ${foodGain} food from thin air!`);
            } else if (miracleRoll <= 55) {
                // Bonus money
                const moneyGain = PT.Engine.GameState.applyPayDay(state, state.rng.randInt(200, 500));
                state.resources.money += moneyGain;
                results.messages.push(`✨ MIRACLE: Mew manifests $${moneyGain} out of nothing!`);
            } else if (miracleRoll <= 70) {
                // Free items
                const itemRoll = state.rng.randInt(1, 3);
                if (itemRoll === 1) { state.resources.potions += 2; results.messages.push(`✨ MIRACLE: Mew creates 2 Potions!`); }
                else if (itemRoll === 2) { state.resources.superPotions += 1; results.messages.push(`✨ MIRACLE: Mew creates a Super Potion!`); }
                else { state.resources.greatballs += 2; results.messages.push(`✨ MIRACLE: Mew creates 2 Great Balls!`); }
            } else if (miracleRoll <= 85) {
                // Bonus miles
                if (pace.distance > 0 && nextRoute && !results.arrivedAtLocation) {
                    const bonusMiles = state.rng.randInt(5, 15);
                    state.distanceTraveled += bonusMiles;
                    results.messages.push(`✨ MIRACLE: Mew teleports the party forward ${bonusMiles} miles!`);
                    if (state.distanceTraveled >= route.distanceToNext) {
                        state.currentLocationIndex++;
                        state.distanceTraveled = 0;
                        results.arrivedAtLocation = true;
                        const newRoute = PT.Engine.GameState.getCurrentRoute(state);
                        results.messages.push(`Arrived at ${newRoute.name}!`);
                        PT.Engine.GameState.addToLog(state, `Arrived at ${newRoute.name}!`);
                    }
                } else {
                    state.resources.food += 10;
                    results.messages.push(`✨ MIRACLE: Mew creates 10 food!`);
                }
            } else {
                // Battle star on random party member
                const starCandidates = PT.Engine.GameState.getAliveParty(state).filter(p => (p.battleStars || 0) < 3);
                if (starCandidates.length > 0) {
                    const lucky = state.rng.pick(starCandidates);
                    lucky.battleStars = (lucky.battleStars || 0) + 1;
                    results.messages.push(`✨ MIRACLE: Mew bestows a Battle Star on ${lucky.name}! ★`);
                } else {
                    state.resources.food += 10;
                    results.messages.push(`✨ MIRACLE: Mew creates 10 food!`);
                }
            }
        }

        return results;
    }

    PT.Engine.TravelEngine = { advanceDay, PACE_CONFIG };
})();

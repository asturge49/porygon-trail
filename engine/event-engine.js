// Porygon Trail - Event Engine
(function() {
    const PT = window.PorygonTrail;
    PT.Engine = PT.Engine || {};

    function rollEvent(state) {
        const route = PT.Engine.GameState.getCurrentRoute(state);
        const availableEvents = PT.Data.Events.filter(event => {
            // One-time check
            if (event.oneTime && state.eventsTriggered.includes(event.id)) return false;
            // Min day check
            if (event.minDay && state.daysElapsed < event.minDay) return false;
            // Min badges check
            if (event.minBadges && state.badges.length < event.minBadges) return false;
            // Min location check
            if (event.minLocation && state.currentLocationIndex < event.minLocation) return false;
            // Location-specific check
            if (event.locationIds && !event.locationIds.includes(route.id)) return false;
            // Terrain check
            if (event.terrainTypes && !event.terrainTypes.includes(route.terrain)) return false;
            // Route event pool check (if event has no location restriction, it can happen anywhere)
            if (!event.locationIds && !event.terrainTypes && route.eventPool && !route.eventPool.includes(event.id)) {
                // General events can still occur anywhere
                if (event.type === 'combat' || event.type === 'weather' || event.type === 'discovery' || event.type === 'hazard' || event.type === 'story') {
                    // Allow general events
                } else {
                    return false;
                }
            }
            return true;
        });

        if (availableEvents.length === 0) return null;

        const event = state.rng.weightedChoice(availableEvents);
        if (!event) return null;

        if (event.oneTime) {
            state.eventsTriggered.push(event.id);
        }

        return event;
    }

    function resolveChoice(event, choiceIndex, state) {
        const choice = event.choices[choiceIndex];
        if (!choice) return { narration: "Nothing happens.", effects: {} };

        // Check for bonus ability outcome
        if (choice.bonusAbility && choice.bonusOutcome && PT.Engine.GameState.hasAbility(state, choice.bonusAbility)) {
            const outcome = choice.bonusOutcome;
            applyEffects(outcome.effects, state);
            return { narration: outcome.narration, effects: outcome.effects, bonusUsed: true };
        }

        // Normal weighted outcome
        const outcome = state.rng.weightedChoice(choice.outcomes);
        if (!outcome) return { narration: "Nothing happens.", effects: {} };

        applyEffects(outcome.effects, state);

        // Track Team Rocket defeats
        if (outcome.trackRocket) {
            state.teamRocketDefeated++;
        }

        return { narration: outcome.narration, effects: outcome.effects };
    }

    function applyEffects(effects, state) {
        if (!effects) return;

        // Resource changes
        const resourceKeys = ['food', 'pokeballs', 'greatballs', 'ultraballs', 'potions', 'superPotions', 'repels', 'rareCandy', 'escapeRope', 'money'];
        resourceKeys.forEach(key => {
            if (effects[key] !== undefined) {
                state.resources[key] = Math.max(0, state.resources[key] + effects[key]);
            }
        });

        // Party damage
        if (effects.partyDamage) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            for (let i = 0; i < effects.partyDamage && alive.length > 0; i++) {
                const victim = state.rng.pick(alive);
                if (victim) {
                    const fainted = PT.Engine.GameState.damagePokemon(victim, 1);
                    if (fainted) state.pokemonLost++;
                }
            }
        }

        // Heal all
        if (effects.healAll) {
            state.party.forEach(p => {
                if (p.status !== 'fainted') {
                    p.hp = p.maxHp;
                    p.status = 'healthy';
                }
            });
        }

        // Heal one
        if (effects.healOne) {
            const injured = state.party.filter(p => p.status !== 'fainted' && (p.hp < p.maxHp || p.status !== 'healthy'));
            if (injured.length > 0) {
                const target = state.rng.pick(injured);
                target.hp = target.maxHp;
                target.status = 'healthy';
            }
        }

        // Random status
        if (effects.statusRandom) {
            const alive = PT.Engine.GameState.getAliveParty(state);
            if (alive.length > 0) {
                const victim = state.rng.pick(alive);
                victim.status = effects.statusRandom;
            }
        }

        // Catch Pokemon
        if (effects.catchPokemon) {
            catchFromEffect(effects.catchPokemon, state);
        }
        if (effects.catchPokemon2) {
            catchFromEffect(effects.catchPokemon2, state);
        }

        // See Pokemon
        if (effects.seePokemon) {
            if (!state.pokedexSeen.includes(effects.seePokemon)) {
                state.pokedexSeen.push(effects.seePokemon);
            }
        }

        // Key item
        if (effects.keyItem) {
            if (!state.keyItems.includes(effects.keyItem)) {
                state.keyItems.push(effects.keyItem);
            }
        }

        // Permanent Pokemon death
        if (effects.pokemonDeath) {
            const deathResult = PT.Engine.GameState.killPokemon(state);
            effects._deathResult = deathResult;
        }

        // Days lost
        if (effects.daysLost) {
            state.daysElapsed += effects.daysLost;
        }

        // Champion flag
        if (effects.champion) {
            state.hasWon = true;
            if (!state.badges.includes('champion')) {
                state.badges.push('champion');
            }
        }

        // Check all fainted
        if (PT.Engine.GameState.getAliveParty(state).length === 0) {
            state.isGameOver = true;
            state.gameOverReason = "blackout";
        }
    }

    function catchFromEffect(pokemonId, state) {
        if (!state.pokedexCaught.includes(pokemonId)) {
            state.pokedexCaught.push(pokemonId);
        }
        if (!state.pokedexSeen.includes(pokemonId)) {
            state.pokedexSeen.push(pokemonId);
        }
        if (state.party.length < 6) {
            const data = PT.Data.Pokemon.find(p => p.id === pokemonId);
            if (data) {
                state.party.push(PT.Engine.GameState.createPartyPokemon(data));
            }
        }
    }

    function canChoose(choice, state) {
        if (choice.requiresItem && state.resources[choice.requiresItem] <= 0) return false;
        if (choice.requiresMoney && state.resources.money < choice.requiresMoney) return false;
        if (choice.requiresKeyItem && !state.keyItems.includes(choice.requiresKeyItem)) return false;
        if (choice.requiresPartySize && PT.Engine.GameState.getAliveParty(state).length < choice.requiresPartySize) return false;
        return true;
    }

    PT.Engine.EventEngine = { rollEvent, resolveChoice, applyEffects, canChoose };
})();

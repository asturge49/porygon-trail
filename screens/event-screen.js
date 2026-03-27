// Porygon Trail - Event Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.EVENT = {
        render(container, state, params) {
            const event = params.event;
            if (!event) { PT.App.goto('TRAVEL'); return; }

            const div = document.createElement('div');
            div.className = 'screen event-screen';
            div.innerHTML = `
                <div class="event-title">${event.name}</div>
                <div class="event-narrative" id="event-narrative">
                    ${event.description}
                </div>
                <div class="event-choices" id="event-choices">
                    ${event.choices.map((choice, i) => {
                        const canChoose = PT.Engine.EventEngine.canChoose(choice, state);
                        let label = choice.text;
                        if (choice.requiresItem && state.resources[choice.requiresItem] <= 0) {
                            label += ` (No ${choice.requiresItem})`;
                        }
                        if (choice.requiresMoney && state.resources.money < choice.requiresMoney) {
                            label += ` (Need $${choice.requiresMoney})`;
                        }
                        if (choice.requiresKeyItem && !state.keyItems.includes(choice.requiresKeyItem)) {
                            label += ` (Need ${choice.requiresKeyItem})`;
                        }
                        if (choice.requiresPartySize && PT.Engine.GameState.getAliveParty(state).length < choice.requiresPartySize) {
                            label += ` (Need ${choice.requiresPartySize}+ Pokemon)`;
                        }
                        if (choice.bonusAbility && PT.Engine.GameState.hasAbility(state, choice.bonusAbility)) {
                            label += ` [${choice.bonusAbility.toUpperCase()} BONUS!]`;
                        }
                        return `<button class="btn btn-wide ${canChoose ? '' : ''}" data-choice="${i}" ${canChoose ? '' : 'disabled'}>${label}</button>`;
                    }).join('')}
                </div>
            `;
            container.appendChild(div);

            const narrative = document.getElementById('event-narrative');
            const choicesDiv = document.getElementById('event-choices');

            // Typewriter effect for initial event description
            if (PT.Engine.typewriter) {
                narrative.textContent = '';
                PT.Engine.typewriter(narrative, event.description, 20);
            }

            document.querySelectorAll('[data-choice]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const choiceIndex = parseInt(btn.dataset.choice);
                    const choice = event.choices[choiceIndex];

                    // Event battle — show Pokemon picker for 1v1 fight
                    if (choice.eventBattle) {
                        const opponent = PT.Engine.EventEngine.pickEventBattleOpponent(choice.eventBattle.pool, state);
                        if (!opponent) {
                            // Fallback to normal resolution if pool fails
                            handleNormalChoice(event, choiceIndex, state, narrative, choicesDiv);
                            return;
                        }
                        showEventBattlePicker(event, choice, opponent, state, narrative, choicesDiv);
                        return;
                    }

                    // Normal choice resolution
                    handleNormalChoice(event, choiceIndex, state, narrative, choicesDiv);
                });
            });
        }
    };

    function handleNormalChoice(event, choiceIndex, state, narrative, choicesDiv) {
        const result = PT.Engine.EventEngine.resolveChoice(event, choiceIndex, state);
        PT.Engine.GameState.addToLog(state, `${event.name}: ${result.narration.substring(0, 60)}...`);
        narrative.innerHTML = result.narration + buildEffectsSummary(result.effects);
        if (result.bonusUsed) {
            narrative.innerHTML += '<br><br><strong>Your Pokemon\'s ability made the difference!</strong>';
        }
        if (result.effects && result.effects._tradeIncoming) {
            showTradeUI(state, result.effects._tradeIncoming, choicesDiv, narrative);
        } else if (result.effects && result.effects._pendingCatch && result.effects._pendingCatch.length > 0) {
            showEventSwapQueue(state, result.effects._pendingCatch.slice(), choicesDiv, narrative);
        } else {
            showEventContinue(state, choicesDiv);
        }
    }

    function showEventBattlePicker(event, choice, opponent, state, narrative, choicesDiv) {
        const battle = choice.eventBattle;
        const opponentSprite = opponent.spriteUrl;
        const opponentHp = PT.Engine.GameState.getMaxHpForPokemon(opponent);
        const lossDamage = Math.max(1, opponentHp - 1);

        // Type weaknesses for display
        const weaknesses = {
            normal: { weakTo: ['fighting'] }, fire: { weakTo: ['water', 'ground', 'rock'] },
            water: { weakTo: ['electric', 'grass'] }, electric: { weakTo: ['ground'] },
            grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'] },
            ice: { weakTo: ['fire', 'fighting', 'rock'] }, fighting: { weakTo: ['flying', 'psychic'] },
            poison: { weakTo: ['ground', 'psychic'] }, ground: { weakTo: ['water', 'grass', 'ice'] },
            flying: { weakTo: ['electric', 'ice', 'rock'] }, psychic: { weakTo: ['bug'] },
            bug: { weakTo: ['fire', 'flying', 'rock'] },
            rock: { weakTo: ['water', 'grass', 'fighting', 'ground'] },
            ghost: { weakTo: ['ghost'] }, dragon: { weakTo: ['ice', 'dragon'] },
            bird: { weakTo: ['electric', 'ice', 'rock'] }
        };
        const weakTo = new Set();
        opponent.types.forEach(t => { if (weaknesses[t]) weaknesses[t].weakTo.forEach(w => weakTo.add(w)); });

        const trainerLabel = battle.trainerName || 'Opponent';

        narrative.innerHTML = `
            <div style="text-align: center; margin-bottom: 4px;">
                <strong>${trainerLabel} sends out ${opponent.name}!</strong>
                <br><img src="${opponentSprite}" style="width: 48px; height: 48px; image-rendering: pixelated; margin: 4px 0;" onerror="this.style.display='none'">
                <br><span style="font-size: 7px;">${opponent.types.join('/')} | Weak to: ${[...weakTo].join(', ') || 'none'}</span>
                <br><span style="font-size: 6px;">If you lose, your Pokemon takes ${lossDamage} damage.</span>
            </div>
        `;

        const aliveParty = PT.Engine.GameState.getAliveParty(state);
        choicesDiv.innerHTML = `
            <div style="font-size: 7px; margin-bottom: 4px; font-weight: bold;">Choose your Pokemon for a 1v1 battle!</div>
            ${aliveParty.map((p, i) => {
                const hasAdv = p.types.some(t => weakTo.has(t));
                let label = `${p.name} (${p.types.join('/')} | HP:${p.hp}/${p.maxHp})`;
                if (p.battleStars > 0) label += ` ${'★'.repeat(p.battleStars)}`;
                if (hasAdv) label += ' [SE!]';
                return `<button class="btn btn-wide evt-battle-pick" data-eidx="${i}">${label}</button>`;
            }).join('')}
        `;

        document.querySelectorAll('.evt-battle-pick').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.eidx);
                const chosen = aliveParty[idx];
                resolveEventBattleResult(event, choice, chosen, opponent, state, narrative, choicesDiv);
            });
        });
    }

    function resolveEventBattleResult(event, choice, chosen, opponent, state, narrative, choicesDiv) {
        const battle = choice.eventBattle;
        const difficulty = battle.difficulty || 'medium';
        const result = PT.Engine.EventEngine.resolveEventBattle(chosen, opponent, state, difficulty);

        if (result.won) {
            // Victory — apply win effects
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            const winEffects = battle.winEffects || {};
            PT.Engine.EventEngine.applyEffects(winEffects, state);
            PT.Engine.GameState.addToLog(state, `${chosen.name} defeated ${battle.trainerName || 'trainer'}'s ${opponent.name}!`);

            // Track Team Rocket defeats
            const rocketPools = ['rocket_grunt', 'jessie_james', 'giovanni'];
            if (rocketPools.includes(battle.pool)) {
                state.teamRocketDefeated++;
            }

            // Try evolution FIRST
            const evoResult = PT.Engine.GameState.evolvePokemon(chosen, state);
            let evoLine = '';
            if (evoResult.evolved) {
                evoLine = `<br>⬆ ${evoResult.oldName} evolved into ${evoResult.newName}!`;
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            }

            // Award battle star (evolution win doesn't count)
            const starResult = PT.Engine.GameState.addBattleWin(chosen, state, evoResult.evolved);
            let starLine = '';
            if (starResult.earned) {
                starLine = `<br>⭐ ${chosen.name} earned a Battle Star! [${'★'.repeat(chosen.battleStars)}] (${chosen.battleStars}/3)`;
            }

            const winNarration = battle.winNarration || `${chosen.name} won the battle!`;
            narrative.innerHTML = `
                <div style="text-align: center;">
                    <strong>${winNarration}</strong>${evoLine}${starLine}
                    <br><span style="font-size: 6px;">Win chance: ${result.chance}%${result.battleBonuses.length > 0 ? ' (' + result.battleBonuses.join(', ') + ')' : ''}</span>
                </div>
            ` + buildEffectsSummary(winEffects);

            if (winEffects._pendingCatch && winEffects._pendingCatch.length > 0) {
                showEventSwapQueue(state, winEffects._pendingCatch.slice(), choicesDiv, narrative);
            } else {
                showEventContinue(state, choicesDiv);
            }
        } else {
            // Loss — apply loss effects, damage the chosen Pokemon
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();
            const fainted = PT.Engine.GameState.damagePokemon(chosen, result.lossDamage, state);
            const died = fainted || chosen.hp <= 0;

            const lossEffects = battle.lossEffects || {};
            PT.Engine.EventEngine.applyEffects(lossEffects, state);

            if (died) {
                PT.Engine.GameState.addToLog(state, `${chosen.name} was killed by ${opponent.name}! 💀`);
            } else {
                PT.Engine.GameState.addToLog(state, `${chosen.name} lost to ${opponent.name}, took ${result.lossDamage} damage.`);
            }

            const lossNarration = battle.lossNarration || `${chosen.name} lost the battle!`;
            narrative.innerHTML = `
                <div style="text-align: center;">
                    <strong>${lossNarration}</strong>
                    <br>${died
                        ? `💀 ${chosen.name} was killed!`
                        : `💥 ${chosen.name} took ${result.lossDamage} damage! (${chosen.hp}/${chosen.maxHp} HP)`}
                    <br><span style="font-size: 6px;">Win chance: ${result.chance}%${result.battleBonuses.length > 0 ? ' (' + result.battleBonuses.join(', ') + ')' : ''}</span>
                </div>
            ` + buildEffectsSummary(lossEffects);

            if (state.isGameOver || state.party.length === 0) {
                choicesDiv.innerHTML = '<button class="btn btn-wide" id="btn-event-continue">CONTINUE</button>';
                document.getElementById('btn-event-continue').addEventListener('click', () => PT.App.goto('GAMEOVER'));
            } else {
                showEventContinue(state, choicesDiv);
            }
        }
    }

    function buildEffectsSummary(effects) {
        if (!effects) return '';
        const lines = [];

        if (effects.food > 0) lines.push(`+${effects.food} Food`);
        if (effects.food < 0) lines.push(`${effects.food} Food`);
        if (effects.pokeballs > 0) lines.push(`+${effects.pokeballs} Poke Balls`);
        if (effects.pokeballs < 0) lines.push(`${effects.pokeballs} Poke Balls`);
        if (effects.greatballs > 0) lines.push(`+${effects.greatballs} Great Balls`);
        if (effects.ultraballs > 0) lines.push(`+${effects.ultraballs} Ultra Balls`);
        if (effects.money > 0) lines.push(`+$${effects.money}`);
        if (effects.money < 0) lines.push(`-$${Math.abs(effects.money)}`);
        if (effects.potions > 0) lines.push(`+${effects.potions} Potions`);
        if (effects.rareCandy > 0) lines.push(`+${effects.rareCandy} Rare Candy`);
        if (effects.escapeRope > 0) lines.push(`+${effects.escapeRope} Escape Rope`);
        if (effects.escapeRope < 0) lines.push(`-1 Escape Rope`);
        if (effects.partyDamage) lines.push(`Party takes ${effects.partyDamage} damage!`);
        if (effects.healAll) lines.push('All Pokemon healed!');
        if (effects.healOne) lines.push('One Pokemon healed!');
        if (effects.daysLost) lines.push(`Lost ${effects.daysLost} day(s)`);
        if (effects.keyItem) lines.push(`Got ${effects.keyItem}!`);
        if (effects.catchPokemon) {
            const p = PT.Data.Pokemon.find(pk => pk.id === effects.catchPokemon);
            if (p) {
                const pending = effects._pendingCatch && effects._pendingCatch.find(d => d.id === effects.catchPokemon);
                if (pending) {
                    lines.push(`${p.name} wants to join, but your party is full!`);
                } else {
                    lines.push(`${p.name} joined your team!`);
                }
            }
        }
        if (effects.catchPokemon2) {
            const p = PT.Data.Pokemon.find(pk => pk.id === effects.catchPokemon2);
            if (p) {
                const pending = effects._pendingCatch && effects._pendingCatch.find(d => d.id === effects.catchPokemon2);
                if (pending) {
                    lines.push(`${p.name} wants to join, but your party is full!`);
                } else {
                    lines.push(`${p.name} joined your team!`);
                }
            }
        }
        if (effects.trainPokemon && effects._trainResult && effects._trainResult.evolved) {
            lines.push(`⬆ ${effects._trainResult.oldName} evolved into ${effects._trainResult.newName}!`);
        }
        if (effects.boostPokemonMaxHp && effects._boostResult) {
            lines.push(`💪 ${effects._boostResult.name} max HP: ${effects._boostResult.oldMax} → ${effects._boostResult.newMax}!`);
        }
        if (effects.reducePokemonMaxHp && effects._reduceResult) {
            lines.push(`⬇ ${effects._reduceResult.name} max HP: ${effects._reduceResult.oldMax} → ${effects._reduceResult.newMax}!`);
        }
        if (effects.grantStar && effects._starResult) {
            lines.push(`⭐ ${effects._starResult.name} earned a Battle Star! [${'★'.repeat(effects._starResult.stars)}] (${effects._starResult.stars}/3)`);
        }
        if (effects.champion) lines.push('YOU BECAME CHAMPION!');
        // Death lines — collected separately for emphasis
        const deathLines = [];
        if (effects.pokemonDeath && effects._deathResult && effects._deathResult.killed) {
            deathLines.push(`💀 ${effects._deathResult.name} was lost forever!`);
        }
        if (effects.pokemonDeath2 && effects._deathResult2 && effects._deathResult2.killed) {
            deathLines.push(`💀 ${effects._deathResult2.name} was lost forever!`);
        }
        if (effects.pokemonDeath3 && effects._deathResult3 && effects._deathResult3.killed) {
            deathLines.push(`💀 ${effects._deathResult3.name} was lost forever!`);
        }

        if (lines.length === 0 && deathLines.length === 0) return '';
        let html = '<br><br><div style="border-top: 2px solid #0f380f; padding-top: 8px; font-size: 9px;">';
        if (lines.length > 0) html += lines.join('<br>');
        if (deathLines.length > 0) {
            html += (lines.length > 0 ? '<br>' : '') +
                '<div style="font-size: 11px; font-weight: bold; color: #0f380f; margin-top: 4px;">' +
                deathLines.join('<br>') + '</div>';
        }
        html += '</div>';
        return html;
    }

    function showTradeUI(state, incomingData, choicesDiv, narrative) {
        const newPokemon = PT.Engine.GameState.createPartyPokemon(incomingData, state);
        const spriteUrl = PT.Engine.GameState.getSpriteUrl(incomingData.id);
        const aliveParty = PT.Engine.GameState.getAliveParty(state);

        choicesDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 4px;">
                <strong>Trade for ${incomingData.name}?</strong>
                <br><img src="${spriteUrl}" style="width: 48px; height: 48px; image-rendering: pixelated; margin: 4px 0;" onerror="this.style.display='none'">
                <br><span style="font-size: 7px;">${incomingData.types.join('/')} | ${incomingData.rarity} | HP: ${newPokemon.maxHp} | Ability: ${incomingData.travelAbility}</span>
            </div>
            <div style="font-size: 7px; margin-bottom: 4px; font-weight: bold;">Choose a Pokemon to trade away:</div>
            ${aliveParty.map((p, i) => `
                <button class="btn btn-wide trade-pick-btn" data-tidx="${i}">${p.name} (${p.types.join('/')} | HP:${p.hp}/${p.maxHp}${(p.battleStars || 0) > 0 ? ' ' + '★'.repeat(p.battleStars) : ''} | ${p.travelAbility})</button>
            `).join('')}
            <button class="btn btn-wide" id="btn-trade-cancel">CANCEL TRADE</button>
        `;

        document.querySelectorAll('.trade-pick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.tidx);
                const alive = PT.Engine.GameState.getAliveParty(state);
                const traded = alive[idx];
                const tradedName = traded.name;

                // Remove the traded Pokemon
                const partyIdx = state.party.indexOf(traded);
                if (partyIdx !== -1) state.party.splice(partyIdx, 1);

                // Add the new Pokemon
                state.party.push(newPokemon);

                // Register in pokedex
                if (!state.pokedexCaught.includes(incomingData.id)) state.pokedexCaught.push(incomingData.id);

                PT.Engine.GameState.addToLog(state, `Traded ${tradedName} for ${incomingData.name}!`);
                narrative.innerHTML += `<br><strong>Traded ${tradedName} for ${incomingData.name}!</strong>`;

                showEventContinue(state, choicesDiv);
            });
        });

        document.getElementById('btn-trade-cancel').addEventListener('click', () => {
            narrative.innerHTML += '<br><em>You decided not to trade.</em>';
            showEventContinue(state, choicesDiv);
        });
    }

    function showEventContinue(state, choicesDiv) {
        choicesDiv.innerHTML = '<button class="btn btn-wide" id="btn-event-continue">CONTINUE</button>';
        document.getElementById('btn-event-continue').addEventListener('click', () => {
            if (state.isGameOver) { PT.App.goto('GAMEOVER'); return; }
            if (state.hasWon) { PT.App.goto('VICTORY'); return; }
            PT.App.goto('TRAVEL');
        });
    }

    function showEventSwapQueue(state, pendingQueue, choicesDiv, narrative) {
        const pokemonData = pendingQueue.shift();
        if (!pokemonData) {
            showEventContinue(state, choicesDiv);
            return;
        }
        showEventSwapOptions(state, pokemonData, pendingQueue, choicesDiv, narrative);
    }

    function showEventSwapOptions(state, pokemonData, pendingQueue, choicesDiv, narrative) {
        const spriteUrl = PT.Engine.GameState.getSpriteUrl(pokemonData.id);
        const foodAmount = PT.Engine.GameState.pokemonToFood(pokemonData.rarity);

        choicesDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 8px;">
                <img src="${spriteUrl}" alt="${pokemonData.name}" style="width: 40px; height: 40px; image-rendering: pixelated;"
                     onerror="this.style.display='none'">
                <div style="font-size: 7px;">${pokemonData.name} | ${pokemonData.types.join('/')} | ${pokemonData.rarity.toUpperCase()} | HP: ${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)}/${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)}</div>
                <div style="font-size: 7px; margin-top: 4px;">Party full (6/6) — what do you want to do?</div>
            </div>
            <button class="btn btn-small" id="btn-evt-swap">SWAP WITH PARTY</button>
            <button class="btn btn-small" id="btn-evt-butcher">BUTCHER FOR FOOD (+${foodAmount})</button>
            <button class="btn btn-small" id="btn-evt-release">RELEASE</button>
        `;

        // SWAP — show party picker
        document.getElementById('btn-evt-swap').addEventListener('click', () => {
            choicesDiv.innerHTML = `
                <div style="font-size: 7px; margin-bottom: 4px; font-weight: bold;">Replace which Pokemon with ${pokemonData.name} (HP: ${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)}/${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)})?</div>
                <div class="potion-pokemon-list">
                    ${state.party.map((p, i) => `
                        <button class="potion-target-btn" data-idx="${i}">
                            <img class="potion-target-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                 onerror="this.style.display='none'">
                            <div class="potion-target-info">
                                <div style="font-weight: bold;">${p.name}</div>
                                <div>${p.types.join('/')} | HP: ${p.hp}/${p.maxHp}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-small" id="btn-evt-swap-cancel" style="margin-top: 6px; width: 100%;">CANCEL</button>
            `;

            document.querySelectorAll('.potion-target-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.idx);
                    const replaced = state.party[idx];
                    const newMember = PT.Engine.GameState.createPartyPokemon(pokemonData, state);
                    state.party[idx] = newMember;
                    PT.Engine.GameState.addToLog(state, `Swapped ${replaced.name} for ${pokemonData.name}!`);
                    if (PT.Engine.Audio) PT.Engine.Audio.buy();

                    narrative.innerHTML += `<br><strong>${replaced.name}</strong> was released. <strong>${pokemonData.name}</strong> joined your team!`;
                    showEventSwapQueue(state, pendingQueue, choicesDiv, narrative);
                });
            });

            document.getElementById('btn-evt-swap-cancel').addEventListener('click', () => {
                showEventSwapOptions(state, pokemonData, pendingQueue, choicesDiv, narrative);
            });
        });

        // BUTCHER FOR FOOD
        document.getElementById('btn-evt-butcher').addEventListener('click', () => {
            state.resources.food += foodAmount;
            PT.Engine.GameState.addToLog(state, `Butchered ${pokemonData.name} for ${foodAmount} food.`);
            if (PT.Engine.Audio) PT.Engine.Audio.buy();

            narrative.innerHTML += `<br><strong>${pokemonData.name}</strong> was butchered for <strong>${foodAmount} food</strong>.`;
            showEventSwapQueue(state, pendingQueue, choicesDiv, narrative);
        });

        // RELEASE
        document.getElementById('btn-evt-release').addEventListener('click', () => {
            PT.Engine.GameState.addToLog(state, `Released ${pokemonData.name}.`);
            if (PT.Engine.Audio) PT.Engine.Audio.click();

            narrative.innerHTML += `<br><strong>${pokemonData.name}</strong> was released.`;
            showEventSwapQueue(state, pendingQueue, choicesDiv, narrative);
        });
    }
})();

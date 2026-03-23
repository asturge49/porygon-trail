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
                    const result = PT.Engine.EventEngine.resolveChoice(event, choiceIndex, state);

                    PT.Engine.GameState.addToLog(state, `${event.name}: ${result.narration.substring(0, 60)}...`);

                    // Show outcome with effects summary
                    narrative.innerHTML = result.narration + buildEffectsSummary(result.effects);
                    if (result.bonusUsed) {
                        narrative.innerHTML += '<br><br><strong>Your Pokemon\'s ability made the difference!</strong>';
                    }

                    // Check if any Pokemon are waiting to join (party full)
                    if (result.effects && result.effects._pendingCatch && result.effects._pendingCatch.length > 0) {
                        showEventSwapQueue(state, result.effects._pendingCatch.slice(), choicesDiv, narrative);
                    } else {
                        showEventContinue(state, choicesDiv);
                    }
                });
            });
        }
    };

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
        if (effects.champion) lines.push('YOU BECAME CHAMPION!');
        if (effects.pokemonDeath && effects._deathResult && effects._deathResult.killed) {
            lines.push(`💀 ${effects._deathResult.name} was lost forever!`);
        }

        if (lines.length === 0) return '';
        return '<br><br><div style="border-top: 2px solid #0f380f; padding-top: 8px; font-size: 7px;">' +
            lines.join('<br>') + '</div>';
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
                <div style="font-size: 7px;">${pokemonData.name} | ${pokemonData.types.join('/')} | ${pokemonData.rarity.toUpperCase()}</div>
                <div style="font-size: 7px; margin-top: 4px;">Party full (6/6) — what do you want to do?</div>
            </div>
            <button class="btn btn-small" id="btn-evt-swap">SWAP WITH PARTY</button>
            <button class="btn btn-small" id="btn-evt-butcher">BUTCHER FOR FOOD (+${foodAmount})</button>
            <button class="btn btn-small" id="btn-evt-release">RELEASE</button>
        `;

        // SWAP — show party picker
        document.getElementById('btn-evt-swap').addEventListener('click', () => {
            choicesDiv.innerHTML = `
                <div style="font-size: 7px; margin-bottom: 4px; font-weight: bold;">Replace which Pokemon with ${pokemonData.name}?</div>
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
                    const newMember = PT.Engine.GameState.createPartyPokemon(pokemonData);
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

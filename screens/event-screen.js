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

                    choicesDiv.innerHTML = '<button class="btn btn-wide" id="btn-event-continue">CONTINUE</button>';

                    document.getElementById('btn-event-continue').addEventListener('click', () => {
                        // Check for game over from event effects
                        if (state.isGameOver) {
                            PT.App.goto('GAMEOVER');
                            return;
                        }
                        if (state.hasWon) {
                            PT.App.goto('VICTORY');
                            return;
                        }
                        PT.App.goto('TRAVEL');
                    });
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
            if (p) lines.push(`${p.name} joined your team!`);
        }
        if (effects.catchPokemon2) {
            const p = PT.Data.Pokemon.find(pk => pk.id === effects.catchPokemon2);
            if (p) lines.push(`${p.name} joined your team!`);
        }
        if (effects.trainPokemon && effects._trainResult && effects._trainResult.evolved) {
            lines.push(`⬆ ${effects._trainResult.oldName} evolved into ${effects._trainResult.newName}!`);
        }
        if (effects.champion) lines.push('YOU BECAME CHAMPION!');
        if (effects.pokemonDeath && effects._deathResult && effects._deathResult.killed) {
            lines.push(`💀 ${effects._deathResult.name} was lost forever!`);
        }

        if (lines.length === 0) return '';
        return '<br><br><div style="border-top: 2px solid #0f380f; padding-top: 8px; font-size: 7px;">' +
            lines.join('<br>') + '</div>';
    }
})();

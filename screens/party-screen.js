// Porygon Trail - Party Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.PARTY = {
        render(container, state) {
            const div = document.createElement('div');
            div.className = 'screen party-screen';
            div.innerHTML = `
                <div class="panel-header text-center">POKEMON PARTY (${state.party.length}/6)</div>
                <div class="party-grid">
                    ${state.party.map((p, i) => `
                        <div class="party-slot ${p.status === 'fainted' ? 'status-fainted' : ''}">
                            <img class="party-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                 onerror="this.style.display='none'">
                            <div class="party-info">
                                <div class="party-pokemon-name">${p.name}</div>
                                <div>${p.types.join('/')}</div>
                                <div>Ability: ${p.travelAbility}</div>
                                <div>Stars: ${'★'.repeat(p.battleStars || 0)}${'☆'.repeat(3 - (p.battleStars || 0))} <span style="font-size:5px;">(${p.battleWins || 0} wins)${PT.Engine.GameState.isFinalEvolution ? (PT.Engine.GameState.isFinalEvolution(p) ? '' : ' [needs final evo]') : ''}</span></div>
                                <div>Status: ${p.status.toUpperCase()}</div>
                                <div class="hp-bar">
                                    <div class="hp-bar-fill ${p.hp <= 1 && p.hp > 0 ? 'low' : ''}" style="width: ${(p.hp / p.maxHp) * 100}%"></div>
                                </div>
                                <div style="font-size: 6px;">HP: ${p.hp}/${p.maxHp}</div>
                            </div>
                            ${state.party.length > 1 && p.status !== 'fainted' ? `
                                <div style="display: flex; gap: 4px;">
                                    <button class="btn btn-small release-btn" data-index="${i}" style="font-size:6px; padding:3px 6px;">DROP</button>
                                    <button class="btn btn-small butcher-btn" data-index="${i}" style="font-size:6px; padding:3px 6px;">BUTCHER (+${PT.Engine.GameState.pokemonToFood(p.rarity)})</button>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                    ${Array(6 - state.party.length).fill(0).map(() => `
                        <div class="party-slot empty">
                            <span style="font-size: 7px;">EMPTY</span>
                        </div>
                    `).join('')}
                </div>
                <div class="text-box" id="party-message" style="min-height: 30px; font-size: 7px;">
                    ${getAbilitySummary(state)}
                </div>
                <button class="btn btn-wide" id="btn-back">BACK</button>
            `;
            container.appendChild(div);

            // Release Pokemon
            document.querySelectorAll('.release-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    const pokemon = state.party[index];
                    if (state.party.length <= 1) return;
                    const msg = document.getElementById('party-message');
                    if (btn.dataset.confirm === 'true') {
                        state.party.splice(index, 1);
                        PT.Engine.GameState.addToLog(state, `Released ${pokemon.name}. Bye bye!`);
                        PT.App._render();
                    } else {
                        msg.textContent = `Release ${pokemon.name}? Click DROP again to confirm.`;
                        btn.dataset.confirm = 'true';
                        btn.style.background = 'var(--gb-darkest)';
                        btn.style.color = 'var(--gb-lightest)';
                    }
                });
            });

            // Butcher Pokemon for food
            document.querySelectorAll('.butcher-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    const pokemon = state.party[index];
                    if (state.party.length <= 1) return;
                    const msg = document.getElementById('party-message');
                    const foodAmount = PT.Engine.GameState.pokemonToFood(pokemon.rarity);
                    if (btn.dataset.confirm === 'true') {
                        state.party.splice(index, 1);
                        state.resources.food += foodAmount;
                        PT.Engine.GameState.addToLog(state, `Butchered ${pokemon.name} for ${foodAmount} food.`);
                        if (PT.Engine.Audio) PT.Engine.Audio.buy();
                        PT.App._render();
                    } else {
                        msg.textContent = `Butcher ${pokemon.name} for ${foodAmount} food? Click BUTCHER again to confirm.`;
                        btn.dataset.confirm = 'true';
                        btn.style.background = 'var(--gb-darkest)';
                        btn.style.color = 'var(--gb-lightest)';
                    }
                });
            });

            document.getElementById('btn-back').addEventListener('click', () => {
                if (PT.App.screenStack.length > 0) {
                    PT.App.pop();
                } else {
                    PT.App.goto('TRAVEL');
                }
            });
        }
    };

    function getAbilitySummary(state) {
        const abilities = {};
        PT.Engine.GameState.getAliveParty(state).forEach(p => {
            abilities[p.travelAbility] = (abilities[p.travelAbility] || 0) + 1;
        });
        const lines = Object.entries(abilities).map(([ability, count]) => {
            const desc = {
                cut: 'Forage food', surf: 'Water speed', fly: 'Scout shortcuts',
                strength: 'Reduce injury', flash: 'Find items/money', dig: 'Escape encounters',
                fire: 'Save food', heal: 'Passive healing', psychic: 'Foresight: pick encounters/events',
                poison: 'Battle win bonus', guard: 'Block injuries', intimidate: 'Catch rate bonus',
                payday: 'Money bonus', safeguard: 'Save from death once',
                system_restore: 'Revive one lost Pokemon (once per game)', glitch: 'Chaos effects',
                mimic: 'Copies strongest party ability'
            };
            const power = PT.Engine.GameState.getAbilityPower(state, ability);
            return `${ability}: ${desc[ability] || '???'} (x${count} | pwr ${power.toFixed(1)})`;
        });
        return lines.length > 0 ? 'Team Abilities: ' + lines.join(' | ') : 'No abilities active.';
    }
})();

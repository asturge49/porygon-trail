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
                                <div>Status: ${p.status.toUpperCase()}</div>
                                <div class="hp-bar">
                                    <div class="hp-bar-fill ${p.hp <= 1 && p.hp > 0 ? 'low' : ''}" style="width: ${(p.hp / p.maxHp) * 100}%"></div>
                                </div>
                                <div style="font-size: 6px;">HP: ${p.hp}/${p.maxHp}</div>
                            </div>
                            ${state.party.length > 1 && p.status !== 'fainted' ? `<button class="btn btn-small release-btn" data-index="${i}" style="font-size:6px; padding:3px 6px;">DROP</button>` : ''}
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
                cut: 'Clears obstacles', surf: 'Water travel', fly: 'Scouts ahead',
                strength: 'Carry more', flash: 'Cave navigation', dig: 'Escape events',
                fire: 'Efficient cooking', heal: 'Passive healing', psychic: 'Predict events',
                poison: 'Repel encounters', guard: 'Defensive bonus', intimidate: 'Scare threats'
            };
            return `${ability}: ${desc[ability] || '???'} (x${count})`;
        });
        return lines.length > 0 ? 'Team Abilities: ' + lines.join(' | ') : 'No abilities active.';
    }
})();

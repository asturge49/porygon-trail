// Porygon Trail - Inventory Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.INVENTORY = {
        render(container, state) {
            const items = PT.Data.Items;
            const div = document.createElement('div');
            div.className = 'screen inventory-screen';
            div.innerHTML = `
                <div class="panel-header text-center">BAG</div>
                <div class="inventory-grid">
                    ${Object.entries(items).map(([key, item]) => `
                        <div class="inventory-item">
                            <div>
                                <div class="item-name">${item.name}</div>
                                <div style="font-size: 6px; color: var(--gb-dark); margin-top: 2px;">${item.desc}</div>
                            </div>
                            <div class="item-count">${state.resources[key] || 0}</div>
                        </div>
                    `).join('')}
                    <div class="inventory-item">
                        <div>
                            <div class="item-name">Money</div>
                            <div style="font-size: 6px; color: var(--gb-dark); margin-top: 2px;">Pokedollars</div>
                        </div>
                        <div class="item-count">$${state.resources.money}</div>
                    </div>
                </div>
                <div style="font-size: 7px; padding: 4px; border: 2px solid var(--gb-darkest); background: var(--gb-light);">
                    Key Items: ${state.keyItems.length > 0 ? state.keyItems.join(', ') : 'None'}
                </div>
                <div class="btn-row" style="margin-top: 4px;">
                    <button class="btn btn-small flex-1" id="btn-use-potion" ${state.resources.potions <= 0 && state.resources.superPotions <= 0 ? 'disabled' : ''}>USE POTION</button>
                    <button class="btn btn-small flex-1" id="btn-use-candy" ${state.resources.rareCandy <= 0 ? 'disabled' : ''}>USE RARE CANDY</button>
                    <button class="btn btn-small flex-1" id="btn-use-repel" ${state.resources.repels <= 0 || state.repelSteps > 0 ? 'disabled' : ''}>USE REPEL${state.repelSteps > 0 ? ' (' + state.repelSteps + ')' : ''}</button>
                    <button class="btn btn-small flex-1" id="btn-back">BACK</button>
                </div>
                <div class="text-box" id="inv-message" style="min-height: 30px; font-size: 7px;"></div>
            `;
            container.appendChild(div);

            const msg = document.getElementById('inv-message');

            // --- USE POTION: show Pokemon picker ---
            document.getElementById('btn-use-potion').addEventListener('click', () => {
                const injured = state.party.filter(p => p.status !== 'fainted' && p.hp < p.maxHp);
                if (injured.length === 0) {
                    msg.textContent = "No Pokemon need healing!";
                    return;
                }

                // Determine potion type
                const isSuper = state.resources.superPotions > 0;
                const potionName = isSuper ? 'Super Potion' : 'Potion';
                const healAmt = isSuper ? 2 : 1;
                const potionCount = isSuper ? state.resources.superPotions : state.resources.potions;

                // Build picker popup
                msg.innerHTML = `
                    <div class="potion-picker">
                        <div style="margin-bottom: 6px; font-weight: bold;">Use ${potionName} (+${healAmt} HP) on who? <span style="color: var(--gb-dark);">(${potionCount} left)</span></div>
                        <div class="potion-pokemon-list">
                            ${injured.map((p, i) => `
                                <button class="potion-target-btn" data-idx="${state.party.indexOf(p)}">
                                    <img class="potion-target-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                         onerror="this.style.display='none'">
                                    <div class="potion-target-info">
                                        <div style="font-weight: bold;">${p.name}</div>
                                        <div class="hp-bar" style="width: 60px; height: 6px;">
                                            <div class="hp-bar-fill ${p.hp <= 1 ? 'low' : ''}" style="width: ${(p.hp / p.maxHp) * 100}%"></div>
                                        </div>
                                        <div>HP: ${p.hp}/${p.maxHp}</div>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                        <button class="btn btn-small" id="btn-potion-cancel" style="margin-top: 6px; width: 100%;">CANCEL</button>
                    </div>
                `;

                // Bind target buttons
                document.querySelectorAll('.potion-target-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = parseInt(btn.dataset.idx);
                        const target = state.party[idx];
                        if (!target) return;

                        // Use potion
                        if (isSuper) {
                            state.resources.superPotions--;
                        } else {
                            state.resources.potions--;
                        }
                        const oldHp = target.hp;
                        PT.Engine.GameState.healPokemon(target, healAmt);
                        const newHp = target.hp;
                        if (PT.Engine.Audio) PT.Engine.Audio.buy();

                        // Show result popup with OK button
                        msg.innerHTML = `
                            <div class="potion-result">
                                <img class="potion-result-sprite" src="${target.spriteUrl}" alt="${target.name}"
                                     onerror="this.style.display='none'">
                                <div class="potion-result-info">
                                    <div style="font-weight: bold;">${target.name}</div>
                                    <div>${potionName} used! +${newHp - oldHp} HP</div>
                                    <div class="hp-bar" style="width: 80px; height: 8px;">
                                        <div class="hp-bar-fill ${newHp <= 1 ? 'low' : ''}" style="width: ${(newHp / target.maxHp) * 100}%"></div>
                                    </div>
                                    <div>HP: ${oldHp} → ${newHp}/${target.maxHp} ${target.status === 'healthy' ? '✓ Healthy' : ''}</div>
                                </div>
                            </div>
                            <button class="btn btn-small" id="btn-potion-ok" style="margin-top: 6px; width: 100%;">OK</button>
                        `;
                        document.getElementById('btn-potion-ok').addEventListener('click', () => {
                            PT.App._render();
                        });
                    });
                });

                document.getElementById('btn-potion-cancel').addEventListener('click', () => {
                    msg.textContent = '';
                });
            });

            // --- USE RARE CANDY ---
            document.getElementById('btn-use-candy').addEventListener('click', () => {
                if (state.resources.rareCandy <= 0) return;
                const alive = PT.Engine.GameState.getAliveParty(state);
                if (alive.length === 0) { msg.textContent = "No alive Pokemon!"; return; }

                // Find Pokemon that can evolve
                const canEvolve = alive.filter(p => {
                    const data = PT.Data.Pokemon.find(pk => pk.id === p.id);
                    return data && data.evolvesTo;
                });

                if (canEvolve.length === 0) {
                    msg.textContent = "No Pokemon can evolve!";
                    return;
                }

                // Build picker popup
                msg.innerHTML = `
                    <div class="potion-picker">
                        <div style="margin-bottom: 6px; font-weight: bold;">Use Rare Candy on who? <span style="color: var(--gb-dark);">(${state.resources.rareCandy} left)</span></div>
                        <div class="potion-pokemon-list">
                            ${canEvolve.map(p => {
                                const data = PT.Data.Pokemon.find(pk => pk.id === p.id);
                                const evoData = PT.Data.Pokemon.find(pk => pk.id === data.evolvesTo);
                                const evoName = evoData ? evoData.name : '???';
                                return `
                                <button class="potion-target-btn candy-target-btn" data-idx="${state.party.indexOf(p)}">
                                    <img class="potion-target-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                         onerror="this.style.display='none'">
                                    <div class="potion-target-info">
                                        <div style="font-weight: bold;">${p.name}</div>
                                        <div style="font-size: 6px;">→ ${evoName}</div>
                                        <div>HP: ${p.hp}/${p.maxHp}</div>
                                    </div>
                                </button>
                            `}).join('')}
                        </div>
                        <button class="btn btn-small" id="btn-candy-cancel" style="margin-top: 6px; width: 100%;">CANCEL</button>
                    </div>
                `;

                // Bind target buttons
                document.querySelectorAll('.candy-target-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = parseInt(btn.dataset.idx);
                        const target = state.party[idx];
                        if (!target) return;

                        state.resources.rareCandy--;
                        const evoResult = PT.Engine.GameState.evolvePokemon(target, state);
                        if (PT.Engine.Audio) PT.Engine.Audio.buy();

                        if (evoResult.evolved) {
                            PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
                            // Show result
                            msg.innerHTML = `
                                <div class="potion-result">
                                    <img class="potion-result-sprite" src="${target.spriteUrl}" alt="${target.name}"
                                         onerror="this.style.display='none'">
                                    <div class="potion-result-info">
                                        <div style="font-weight: bold;">${evoResult.oldName} evolved into ${evoResult.newName}!</div>
                                    </div>
                                </div>
                                <button class="btn btn-small" id="btn-candy-ok" style="margin-top: 6px; width: 100%;">OK</button>
                            `;
                            document.getElementById('btn-candy-ok').addEventListener('click', () => {
                                PT.App._render();
                            });
                        } else {
                            msg.textContent = `${target.name} couldn't evolve. Rare Candy had no effect!`;
                            state.resources.rareCandy++; // Refund
                            PT.App._render();
                        }
                    });
                });

                document.getElementById('btn-candy-cancel').addEventListener('click', () => {
                    msg.textContent = '';
                });
            });

            // --- USE REPEL ---
            document.getElementById('btn-use-repel').addEventListener('click', () => {
                if (state.resources.repels <= 0 || state.repelSteps > 0) return;
                state.resources.repels--;
                state.repelSteps = 3;
                PT.Engine.GameState.addToLog(state, "Used Repel! Next 3 encounters avoided.");
                if (PT.Engine.Audio) PT.Engine.Audio.buy();
                msg.textContent = "Repel activated! Next 3 encounters will be avoided.";
                PT.App._render();
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
})();

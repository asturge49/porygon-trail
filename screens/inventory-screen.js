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
                    Key Items: ${state.keyItems.length > 0 ? state.keyItems.map(id => {
                        const ki = PT.Data.KeyItems[id];
                        const count = state.buffs.keyItems[id] || 1;
                        return ki ? `${ki.name} x${count}` : id;
                    }).join(', ') : 'None'}
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

            // Item-use pickers (potion target, rare candy target, etc.) render
            // as an overlay popup on top of the screen — like travel-screen.js's
            // day-recap-overlay — instead of appending inline below the item
            // grid. Appending inline pushed #app's scrollable height past the
            // viewport the moment a picker listed more than a couple of party
            // members, forcing a scroll down to even see it. An absolutely
            // positioned overlay doesn't add to the in-flow layout height, so
            // the picker always shows in full immediately, with its own
            // CANCEL/BACK button to close it without taking any action.
            function closePopup() {
                const existing = document.getElementById('inv-popup-overlay');
                if (existing) existing.remove();
            }

            function showPopup(html) {
                closePopup();
                const overlay = document.createElement('div');
                overlay.className = 'day-recap-overlay';
                overlay.id = 'inv-popup-overlay';
                overlay.innerHTML = `<div class="day-recap-popup">${html}</div>`;
                document.querySelector('.inventory-screen').appendChild(overlay);
                return overlay;
            }

            // --- USE POTION: show potion type picker (if needed), then Pokemon picker ---
            document.getElementById('btn-use-potion').addEventListener('click', () => {
                const injured = state.party.filter(p => p.status !== 'fainted' && p.hp < p.maxHp);
                if (injured.length === 0) {
                    msg.textContent = "No Pokemon need healing!";
                    return;
                }

                const hasPotion = state.resources.potions > 0;
                const hasSuper = state.resources.superPotions > 0;

                if (hasPotion && hasSuper) {
                    showPotionTypePicker();
                } else {
                    showPotionTargetPicker(hasSuper, false);
                }
            });

            function showPotionTypePicker() {
                showPopup(`
                    <div class="day-recap-title">Use which item?</div>
                    <div class="potion-pokemon-list">
                        <button class="potion-target-btn" id="btn-pick-potion">
                            <div class="potion-target-info">
                                <div style="font-weight: bold;">Potion (+1 HP)</div>
                                <div>${state.resources.potions} left</div>
                            </div>
                        </button>
                        <button class="potion-target-btn" id="btn-pick-super-potion">
                            <div class="potion-target-info">
                                <div style="font-weight: bold;">Super Potion (+2 HP)</div>
                                <div>${state.resources.superPotions} left</div>
                            </div>
                        </button>
                    </div>
                    <button class="btn btn-small" id="btn-potion-cancel" style="margin-top: 6px; width: 100%;">CANCEL</button>
                `);
                document.getElementById('btn-pick-potion').addEventListener('click', () => showPotionTargetPicker(false, true));
                document.getElementById('btn-pick-super-potion').addEventListener('click', () => showPotionTargetPicker(true, true));
                document.getElementById('btn-potion-cancel').addEventListener('click', closePopup);
            }

            // `canGoBack` is true only when reached from the type picker above
            // (both potion types in stock) — its Cancel then reads BACK and
            // returns there instead of closing the whole flow.
            function showPotionTargetPicker(isSuper, canGoBack) {
                const injured = state.party.filter(p => p.status !== 'fainted' && p.hp < p.maxHp);
                const potionName = isSuper ? 'Super Potion' : 'Potion';
                const healAmt = isSuper ? 2 : 1;
                const potionCount = isSuper ? state.resources.superPotions : state.resources.potions;

                showPopup(`
                    <div class="day-recap-title">Use ${potionName} (+${healAmt} HP) on who? <span style="color: var(--gb-dark); font-weight: normal;">(${potionCount} left)</span></div>
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
                    <button class="btn btn-small" id="btn-potion-cancel" style="margin-top: 6px; width: 100%;">${canGoBack ? 'BACK' : 'CANCEL'}</button>
                `);

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
                        showPopup(`
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
                        `);
                        document.getElementById('btn-potion-ok').addEventListener('click', () => {
                            closePopup();
                            PT.App._render();
                        });
                    });
                });

                document.getElementById('btn-potion-cancel').addEventListener('click', () => {
                    if (canGoBack) {
                        showPotionTypePicker();
                    } else {
                        closePopup();
                    }
                });
            }

            // --- USE RARE CANDY ---
            document.getElementById('btn-use-candy').addEventListener('click', () => {
                if (state.resources.rareCandy <= 0) return;
                const alive = PT.Engine.GameState.getAliveParty(state);
                if (alive.length === 0) { msg.textContent = "No alive Pokemon!"; return; }

                // Find Pokemon that can evolve right now OR can gain a star (final
                // evo — or region-locked from its next evolution until Johto,
                // e.g. Golbat/Onix/Chansey/Seadra/Scyther/Porygon in Kanto — with
                // <3 stars). Region-aware so a Rare Candy doesn't offer a doomed
                // "evolve" attempt on a Gen-II-locked Pokemon before Johto.
                const candidates = alive.filter(p => {
                    if (!PT.Engine.GameState.isFinalEvolution(p, state)) return true; // can evolve
                    if ((p.battleStars || 0) < 3) return true; // can gain star
                    return false;
                });

                if (candidates.length === 0) {
                    msg.textContent = "No Pokemon can evolve or gain stars!";
                    return;
                }

                // Build picker popup
                showPopup(`
                    <div class="day-recap-title">Use Rare Candy on who? <span style="color: var(--gb-dark); font-weight: normal;">(${state.resources.rareCandy} left)</span></div>
                    <div class="potion-pokemon-list">
                        ${candidates.map(p => {
                            const data = PT.Data.Pokemon.find(pk => pk.id === p.id);
                            const canEvolve = !PT.Engine.GameState.isFinalEvolution(p, state);
                            let actionText;
                            if (canEvolve) {
                                const evoTarget = Array.isArray(data.evolvesTo) ? data.evolvesTo[0] : data.evolvesTo;
                                const evoData = PT.Data.Pokemon.find(pk => pk.id === evoTarget);
                                actionText = `→ ${evoData ? evoData.name : '???'}`;
                            } else {
                                actionText = `★ ${(p.battleStars || 0)} → ${(p.battleStars || 0) + 1} star${(p.battleStars || 0) + 1 !== 1 ? 's' : ''}`;
                            }
                            return `
                            <button class="potion-target-btn candy-target-btn" data-idx="${state.party.indexOf(p)}">
                                <img class="potion-target-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                     onerror="this.style.display='none'">
                                <div class="potion-target-info">
                                    <div style="font-weight: bold;">${p.name}</div>
                                    <div style="font-size: 6px;">${actionText}</div>
                                    <div>HP: ${p.hp}/${p.maxHp}</div>
                                </div>
                            </button>
                        `}).join('')}
                    </div>
                    <button class="btn btn-small" id="btn-candy-cancel" style="margin-top: 6px; width: 100%;">CANCEL</button>
                `);

                // Bind target buttons
                document.querySelectorAll('.candy-target-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = parseInt(btn.dataset.idx);
                        const target = state.party[idx];
                        if (!target) return;

                        const data = PT.Data.Pokemon.find(pk => pk.id === target.id);
                        const canEvolve = data && data.evolvesTo;

                        state.resources.rareCandy--;
                        if (PT.Engine.Audio) PT.Engine.Audio.buy();

                        if (canEvolve) {
                            // Evolve the Pokemon
                            const evoResult = PT.Engine.GameState.evolvePokemon(target, state);
                            if (evoResult.evolved) {
                                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
                                showPopup(`
                                    <div class="potion-result">
                                        <img class="potion-result-sprite" src="${target.spriteUrl}" alt="${target.name}"
                                             onerror="this.style.display='none'">
                                        <div class="potion-result-info">
                                            <div style="font-weight: bold;">${evoResult.oldName} evolved into ${evoResult.newName}!</div>
                                        </div>
                                    </div>
                                    <button class="btn btn-small" id="btn-candy-ok" style="margin-top: 6px; width: 100%;">OK</button>
                                `);
                                document.getElementById('btn-candy-ok').addEventListener('click', () => {
                                    closePopup();
                                    PT.App._render();
                                });
                            } else {
                                state.resources.rareCandy++; // Refund
                                closePopup();
                                msg.textContent = `${target.name} couldn't evolve. Rare Candy had no effect!`;
                                PT.App._render();
                            }
                        } else {
                            // Add a battle star
                            target.battleStars = (target.battleStars || 0) + 1;
                            PT.Engine.GameState.addToLog(state, `${target.name} gained a battle star! (★${target.battleStars})`);
                            showPopup(`
                                <div class="potion-result">
                                    <img class="potion-result-sprite" src="${target.spriteUrl}" alt="${target.name}"
                                         onerror="this.style.display='none'">
                                    <div class="potion-result-info">
                                        <div style="font-weight: bold;">${target.name} gained a battle star!</div>
                                        <div style="font-size: 7px;">★${target.battleStars}/3 — Abilities & combat boosted</div>
                                    </div>
                                </div>
                                <button class="btn btn-small" id="btn-candy-ok" style="margin-top: 6px; width: 100%;">OK</button>
                            `);
                            document.getElementById('btn-candy-ok').addEventListener('click', () => {
                                closePopup();
                                PT.App._render();
                            });
                        }
                    });
                });

                document.getElementById('btn-candy-cancel').addEventListener('click', closePopup);
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

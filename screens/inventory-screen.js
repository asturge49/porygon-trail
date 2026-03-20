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
                <div class="panel-header text-center">INVENTORY</div>
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
                    <button class="btn btn-small flex-1" id="btn-back">BACK</button>
                </div>
                <div class="text-box" id="inv-message" style="min-height: 30px; font-size: 7px;"></div>
            `;
            container.appendChild(div);

            const msg = document.getElementById('inv-message');

            document.getElementById('btn-use-potion').addEventListener('click', () => {
                const injured = state.party.filter(p => p.status !== 'fainted' && p.hp < p.maxHp);
                if (injured.length === 0) {
                    msg.textContent = "No Pokemon need healing!";
                    return;
                }
                const target = injured[0];
                if (state.resources.superPotions > 0) {
                    state.resources.superPotions--;
                    PT.Engine.GameState.healPokemon(target, 2);
                    msg.textContent = `Used Super Potion on ${target.name}! +2 HP`;
                } else {
                    state.resources.potions--;
                    PT.Engine.GameState.healPokemon(target, 1);
                    msg.textContent = `Used Potion on ${target.name}! +1 HP`;
                }
                // Re-render without clearing the screen stack
                PT.App._render();
            });

            document.getElementById('btn-use-candy').addEventListener('click', () => {
                if (state.resources.rareCandy <= 0) return;
                const alive = PT.Engine.GameState.getAliveParty(state);
                if (alive.length === 0) { msg.textContent = "No alive Pokemon!"; return; }
                // Find first Pokemon that can evolve
                let target = null;
                for (const p of alive) {
                    const data = PT.Data.Pokemon.find(pk => pk.id === p.id);
                    if (data && data.evolvesTo) { target = p; break; }
                }
                if (!target) {
                    msg.textContent = "No Pokemon can evolve!";
                    return;
                }
                state.resources.rareCandy--;
                const evoResult = PT.Engine.GameState.evolvePokemon(target);
                if (evoResult.evolved) {
                    msg.textContent = `${evoResult.oldName} evolved into ${evoResult.newName}!`;
                    PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
                } else {
                    msg.textContent = `${target.name} couldn't evolve. Rare Candy had no effect!`;
                    state.resources.rareCandy++; // Refund
                }
                if (PT.Engine.Audio) PT.Engine.Audio.buy();
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

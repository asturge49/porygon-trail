// Porygon Trail - Shop Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.SHOP = {
        render(container, state) {
            const tier = PT.Data.getShopTier(state.currentLocationIndex);
            const available = PT.Data.ShopInventory[tier];
            const items = PT.Data.Items;
            const route = PT.Engine.GameState.getCurrentRoute(state);

            const div = document.createElement('div');
            div.className = 'screen shop-screen';
            div.innerHTML = `
                <div class="panel-header text-center">${route.name} POKE MART</div>
                <div class="money-display">Money: $${state.resources.money}</div>
                <div class="shop-grid">
                    ${available.map(key => {
                        const item = items[key];
                        const canAfford = state.resources.money >= item.price;
                        return `
                            <div class="shop-item">
                                <div class="shop-item-info">
                                    <div class="shop-item-name">${item.name}</div>
                                    <div class="shop-item-desc">${item.desc} | Have: ${state.resources[key] || 0}</div>
                                </div>
                                <div class="shop-item-price">$${item.price}</div>
                                <button class="btn btn-small buy-btn" data-item="${key}" ${canAfford ? '' : 'disabled'}>BUY</button>
                                <button class="btn btn-small buy-5-btn" data-item="${key}" ${state.resources.money >= item.price * 5 ? '' : 'disabled'}>x5</button>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="text-box" id="shop-message" style="min-height: 30px; font-size: 7px;">
                    Welcome! What would you like to buy?
                </div>
                <button class="btn btn-wide" id="btn-back">LEAVE SHOP</button>
            `;
            container.appendChild(div);

            const msg = document.getElementById('shop-message');

            // Buy single
            document.querySelectorAll('.buy-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.item;
                    const item = items[key];
                    if (state.resources.money >= item.price) {
                        state.resources.money -= item.price;
                        state.resources[key] = (state.resources[key] || 0) + (key === 'food' ? 10 : 1);
                        msg.textContent = `Bought ${item.name}! ${key === 'food' ? '(+10 rations)' : ''}`;
                        if (PT.Engine.Audio) PT.Engine.Audio.buy();
                        PT.App._render();
                    }
                });
            });

            // Buy 5
            document.querySelectorAll('.buy-5-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.item;
                    const item = items[key];
                    const cost = item.price * 5;
                    if (state.resources.money >= cost) {
                        state.resources.money -= cost;
                        state.resources[key] = (state.resources[key] || 0) + (key === 'food' ? 50 : 5);
                        msg.textContent = `Bought 5x ${item.name}!`;
                        PT.App._render();
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
})();

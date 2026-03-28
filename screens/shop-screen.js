// Porygon Trail - Shop Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    let currentTab = 'buy';

    function getSellPrice(key) {
        const item = PT.Data.Items[key];
        if (!item) return 0;
        // Food sells per 10 rations (same as buy unit)
        return Math.floor(item.price / 2);
    }

    function getSellableItems(state) {
        const sellable = [];
        const items = PT.Data.Items;
        Object.keys(items).forEach(key => {
            const qty = state.resources[key] || 0;
            // Food: sellable in units of 10
            if (key === 'food') {
                if (qty >= 10) sellable.push({ key, qty, sellQty: Math.floor(qty / 10), unitLabel: '10 rations' });
            } else if (qty > 0) {
                sellable.push({ key, qty, sellQty: qty, unitLabel: '1' });
            }
        });
        return sellable;
    }

    PT.Screens.SHOP = {
        render(container, state) {
            const tier = PT.Data.getShopTier(state.currentLocationIndex);
            const available = PT.Data.ShopInventory[tier];
            const items = PT.Data.Items;
            const route = PT.Engine.GameState.getCurrentRoute(state);

            const div = document.createElement('div');
            div.className = 'screen shop-screen';

            function renderShop() {
                const sellable = getSellableItems(state);

                div.innerHTML = `
                    <div class="panel-header text-center">${route.name} POKE MART</div>
                    <div class="money-display">Money: $${state.resources.money}</div>
                    <div style="display:flex; gap:4px; margin-bottom:6px;">
                        <button class="btn btn-small tab-btn" data-tab="buy" style="flex:1; ${currentTab === 'buy' ? 'background:#4a5' : 'opacity:0.6'}">BUY</button>
                        <button class="btn btn-small tab-btn" data-tab="sell" style="flex:1; ${currentTab === 'sell' ? 'background:#c54' : 'opacity:0.6'}">SELL</button>
                    </div>
                    ${currentTab === 'buy' ? `
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
                    ` : `
                        <div class="shop-grid">
                            ${sellable.length > 0 ? sellable.map(s => {
                                const item = items[s.key];
                                const sellPrice = getSellPrice(s.key);
                                return `
                                    <div class="shop-item">
                                        <div class="shop-item-info">
                                            <div class="shop-item-name">${item.name}</div>
                                            <div class="shop-item-desc">Have: ${s.qty}${s.key === 'food' ? ' rations' : ''}</div>
                                        </div>
                                        <div class="shop-item-price" style="color:#c54;">$${sellPrice}</div>
                                        <button class="btn btn-small sell-btn" data-item="${s.key}">SELL</button>
                                        <button class="btn btn-small sell-5-btn" data-item="${s.key}" ${(s.key === 'food' ? s.qty >= 50 : s.qty >= 5) ? '' : 'disabled'}>x5</button>
                                    </div>
                                `;
                            }).join('') : '<div style="text-align:center; padding:10px; opacity:0.6;">Nothing to sell!</div>'}
                        </div>
                    `}
                    <div class="text-box" id="shop-message" style="min-height: 30px; font-size: 7px;">
                        ${currentTab === 'buy' ? 'Welcome! What would you like to buy?' : 'Sell items for half their buy price.'}
                    </div>
                    <button class="btn btn-wide" id="btn-back">LEAVE SHOP</button>
                `;

                // Tab switching
                div.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        currentTab = btn.dataset.tab;
                        renderShop();
                    });
                });

                const msg = div.querySelector('#shop-message');

                // Buy single
                div.querySelectorAll('.buy-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const key = btn.dataset.item;
                        const item = items[key];
                        if (state.resources.money >= item.price) {
                            state.resources.money -= item.price;
                            state.resources[key] = (state.resources[key] || 0) + (key === 'food' ? 10 : 1);
                            msg.textContent = `Bought ${item.name}! ${key === 'food' ? '(+10 rations)' : ''}`;
                            if (PT.Engine.Audio) PT.Engine.Audio.buy();
                            renderShop();
                        }
                    });
                });

                // Buy 5
                div.querySelectorAll('.buy-5-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const key = btn.dataset.item;
                        const item = items[key];
                        const cost = item.price * 5;
                        if (state.resources.money >= cost) {
                            state.resources.money -= cost;
                            state.resources[key] = (state.resources[key] || 0) + (key === 'food' ? 50 : 5);
                            msg.textContent = `Bought 5x ${item.name}!`;
                            renderShop();
                        }
                    });
                });

                // Sell single
                div.querySelectorAll('.sell-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const key = btn.dataset.item;
                        const sellPrice = getSellPrice(key);
                        const sellUnit = key === 'food' ? 10 : 1;
                        if ((state.resources[key] || 0) >= sellUnit) {
                            state.resources[key] -= sellUnit;
                            state.resources.money += sellPrice;
                            const item = items[key];
                            msg.textContent = `Sold ${item.name} for $${sellPrice}!${key === 'food' ? ' (-10 rations)' : ''}`;
                            renderShop();
                        }
                    });
                });

                // Sell 5
                div.querySelectorAll('.sell-5-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const key = btn.dataset.item;
                        const sellPrice = getSellPrice(key);
                        const sellUnit = key === 'food' ? 10 : 1;
                        const totalUnit = sellUnit * 5;
                        if ((state.resources[key] || 0) >= totalUnit) {
                            state.resources[key] -= totalUnit;
                            state.resources.money += sellPrice * 5;
                            const item = items[key];
                            msg.textContent = `Sold 5x ${item.name} for $${sellPrice * 5}!`;
                            renderShop();
                        }
                    });
                });

                div.querySelector('#btn-back').addEventListener('click', () => {
                    currentTab = 'buy';
                    if (PT.App.screenStack.length > 0) {
                        PT.App.pop();
                    } else {
                        PT.App.goto('TRAVEL');
                    }
                });
            }

            container.appendChild(div);
            renderShop();
        }
    };
})();

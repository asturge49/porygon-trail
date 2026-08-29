// Porygon Trail - Gym Reward Screen
// Shown after a gym victory: recap money earned, then two "pick 1 of 3"
// steps — a key item (stackable win/catch/money buff) and an ability buff
// (stacks a boost onto a travel ability already in the party).
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    function statCardHtml(item, stacks) {
        return `
            <button class="reward-card" data-item="${item.id}">
                <img src="${item.icon}" alt="${item.name}" class="reward-card-icon" onerror="this.style.display='none'">
                <div class="reward-card-body">
                    <div class="reward-card-name">${item.name}${stacks > 0 ? ` <span class="reward-card-owned">(owned x${stacks})</span>` : ''}</div>
                    <div class="reward-card-desc">${item.desc}</div>
                    <div class="reward-card-buff">${item.buffLabel}</div>
                </div>
            </button>`;
    }

    function abilityCardHtml(abilityId, stacks, active) {
        const info = PT.Data.AbilityBuffs[abilityId];
        return `
            <button class="reward-card" data-ability="${abilityId}">
                <div class="reward-card-emoji">${info.emoji}</div>
                <div class="reward-card-body">
                    <div class="reward-card-name">${info.name} Boost${stacks > 0 ? ` <span class="reward-card-owned">(x${stacks})</span>` : ''}</div>
                    <div class="reward-card-desc">${info.desc}</div>
                    <div class="reward-card-buff">${active ? '✓ active in your party' : '⚠ dormant — no Pokemon with this ability yet'}</div>
                </div>
            </button>`;
    }

    PT.Screens.GYM_REWARD = {
        render(container, state, params) {
            const { leaderId, moneyReward } = params || {};
            const leader = PT.Data.GymLeaders[leaderId];

            const div = document.createElement('div');
            div.className = 'screen';
            div.style.cssText = 'padding: 14px; overflow-y: auto; gap: 10px; display: flex; flex-direction: column;';

            function renderStep() {
                const step = div.dataset.step || 'item';

                if (step === 'item') {
                    div.innerHTML = `
                        <div class="event-title">GYM REWARDS</div>
                        <div class="text-box" style="font-size: 7px; text-align: center;">
                            ${leader ? `Defeated ${leader.name}! ` : ''}Earned <strong>$${moneyReward || 0}</strong>.
                            <br>Choose a key item to keep — its bonus stacks every time you pick it.
                        </div>
                        <div class="event-choices">
                            ${PT.Data.KeyItemOrder.map(id => statCardHtml(PT.Data.KeyItems[id], state.buffs.keyItems[id] || 0)).join('')}
                        </div>
                    `;
                    div.querySelectorAll('[data-item]').forEach(btn => {
                        btn.addEventListener('click', () => {
                            PT.Engine.GameState.grantKeyItem(state, btn.dataset.item);
                            div.dataset.step = 'ability';
                            renderStep();
                        });
                    });
                } else if (step === 'ability') {
                    if (!div.dataset.abilityChoices) {
                        const pool = state.rng.shuffle([...PT.Data.AbilityBuffOrder]).slice(0, 3);
                        div.dataset.abilityChoices = JSON.stringify(pool);
                    }
                    const choices = JSON.parse(div.dataset.abilityChoices);

                    div.innerHTML = `
                        <div class="event-title">CHOOSE A BOOST</div>
                        <div class="text-box" style="font-size: 7px; text-align: center;">
                            Pick one ability to boost. Boosts stack, but only help while a party Pokemon has that ability.
                        </div>
                        <div class="event-choices">
                            ${choices.map(id => abilityCardHtml(id, state.buffs.abilities[id] || 0, PT.Engine.GameState.hasAbility(state, id))).join('')}
                        </div>
                    `;
                    div.querySelectorAll('[data-ability]').forEach(btn => {
                        btn.addEventListener('click', () => {
                            PT.Engine.GameState.grantAbilityBuff(state, btn.dataset.ability);
                            div.dataset.step = 'done';
                            renderStep();
                        });
                    });
                } else {
                    div.innerHTML = `
                        <div class="event-title">ONWARD!</div>
                        <div class="text-box" style="font-size: 7px; text-align: center;">
                            Your rewards are locked in. Check your STATS screen anytime to see how your buffs are adding up.
                        </div>
                        <button class="btn btn-wide" id="btn-reward-continue">CONTINUE</button>
                    `;
                    document.getElementById('btn-reward-continue').addEventListener('click', () => {
                        PT.Engine.GameState.saveGame(state);
                        PT.App.goto('TRAVEL');
                    });
                }
            }

            div.dataset.step = 'item';
            container.appendChild(div);
            renderStep();
        }
    };
})();

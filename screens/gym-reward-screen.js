// Porygon Trail - Gym Reward Screen
// Shown after a gym victory: recap money earned, then two "pick 1 of 3"
// steps — a key item (stackable buff, 3 sampled from the key item pool each
// gym, weighted so rarer items like Exp. Share show up less often) and an
// ability buff (stacks a boost onto a travel ability already in the party).
// HP Up additionally asks which Pokemon should get it.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Weighted sample without replacement — used so rarer key items
    // (lower pickWeight, e.g. Exp. Share) show up less often than the rest.
    function weightedSample(rng, ids, weightFn, count) {
        const pool = ids.slice();
        const picked = [];
        while (pool.length > 0 && picked.length < count) {
            const weighted = pool.map(id => ({ id, weight: weightFn(id) }));
            const chosen = rng.weightedChoice(weighted);
            if (!chosen) break;
            picked.push(chosen.id);
            pool.splice(pool.indexOf(chosen.id), 1);
        }
        return picked;
    }

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
                <div class="reward-card-body">
                    <div class="reward-card-name">${info.name} Boost${stacks > 0 ? ` <span class="reward-card-owned">(x${stacks})</span>` : ''}</div>
                    <div class="reward-card-desc">${info.desc}</div>
                    <div class="reward-card-buff">${active ? '✓ active in your party' : 'dormant — no Pokemon with this ability yet'}</div>
                </div>
            </button>`;
    }

    function hpTargetCardHtml(pokemon, index) {
        const canBoost = PT.Engine.GameState.canApplyHpUpBoost(pokemon);
        return `
            <button class="reward-card" data-target="${index}" ${canBoost ? '' : 'disabled'} style="${canBoost ? '' : 'opacity: 0.5; cursor: default;'}">
                <img src="${pokemon.spriteUrl}" alt="${pokemon.name}" class="reward-card-icon" onerror="this.style.display='none'">
                <div class="reward-card-body">
                    <div class="reward-card-name">${pokemon.name}${pokemon.hpBonus > 0 ? ` <span class="reward-card-owned">(+${pokemon.hpBonus} HP Up)</span>` : ''}</div>
                    <div class="reward-card-buff">${canBoost ? `HP ${pokemon.hp}/${pokemon.maxHp} → ${pokemon.hp + 1}/${pokemon.maxHp + 1}` : `MAXED OUT (+${pokemon.hpBonus} is the cap)`}</div>
                </div>
            </button>`;
    }

    PT.Screens.GYM_REWARD = {
        render(container, state, params) {
            const { leaderId, moneyReward, paydayBonus, amuletBonus } = params || {};
            const leader = PT.Data.GymLeaders[leaderId];
            // Line items only appear when their source actually contributed —
            // hidden entirely for a run with no Payday Pokemon / no Amulet Coin.
            const moneyBreakdownHtml = [
                paydayBonus > 0 ? `<div>+$${paydayBonus} from Payday</div>` : '',
                amuletBonus > 0 ? `<div>+$${amuletBonus} from Amulet Coin</div>` : ''
            ].join('');

            const div = document.createElement('div');
            div.className = 'screen';
            div.style.cssText = 'padding: 14px; overflow-y: auto; gap: 10px; display: flex; flex-direction: column;';

            function renderStep() {
                const step = div.dataset.step || 'item';

                if (step === 'item') {
                    if (!div.dataset.itemChoices) {
                        const alive = PT.Engine.GameState.getAliveParty(state);
                        const eligible = PT.Data.KeyItemOrder.filter(id => {
                            if (id === 'hpUp') return alive.some(p => PT.Engine.GameState.canApplyHpUpBoost(p));
                            return !PT.Engine.GameState.isKeyItemMaxed(state, id);
                        });
                        const sampled = weightedSample(state.rng, eligible, id => PT.Data.KeyItems[id].pickWeight || 3, 3);
                        // Keep the fixed relative order for whichever 3 got picked
                        const ordered = PT.Data.KeyItemOrder.filter(id => sampled.includes(id));
                        div.dataset.itemChoices = JSON.stringify(ordered);
                    }
                    const choices = JSON.parse(div.dataset.itemChoices);

                    div.innerHTML = `
                        <div class="event-title">GYM REWARDS</div>
                        <div class="text-box" style="font-size: 7px; text-align: center;">
                            ${leader ? `Defeated ${leader.name}! ` : ''}Earned <strong>$${moneyReward || 0}</strong>.
                            ${moneyBreakdownHtml ? `<div style="font-size: 6px; color: var(--gb-dark); margin-top: 2px;">${moneyBreakdownHtml}</div>` : ''}
                            <br>Choose a key item to keep — its bonus stacks every time you pick it.
                        </div>
                        <div class="event-choices">
                            ${choices.map(id => statCardHtml(PT.Data.KeyItems[id], state.buffs.keyItems[id] || 0)).join('')}
                        </div>
                    `;
                    div.querySelectorAll('[data-item]').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const item = PT.Data.KeyItems[btn.dataset.item];
                            if (item.targeted) {
                                div.dataset.step = 'hpTarget';
                            } else {
                                PT.Engine.GameState.grantKeyItem(state, btn.dataset.item);
                                div.dataset.step = 'ability';
                            }
                            renderStep();
                        });
                    });
                } else if (step === 'hpTarget') {
                    const alive = PT.Engine.GameState.getAliveParty(state);

                    div.innerHTML = `
                        <div class="event-title">USE HP UP ON WHO?</div>
                        <div class="text-box" style="font-size: 7px; text-align: center;">
                            Pick a Pokemon to permanently raise its HP by 1. It'll keep this bonus through evolution.
                        </div>
                        <div class="event-choices">
                            ${alive.map((p, i) => hpTargetCardHtml(p, i)).join('')}
                        </div>
                    `;
                    div.querySelectorAll('[data-target]').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const pokemon = alive[parseInt(btn.dataset.target)];
                            PT.Engine.GameState.applyHpUpBoost(state, pokemon);
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

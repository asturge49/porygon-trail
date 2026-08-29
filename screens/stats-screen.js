// Porygon Trail - Trainer Stats Screen
// A running scorecard of the buffs picked from gym rewards. Replaces the
// old manual SAVE button on the travel screen — the game already
// autosaves after every meaningful action, so this slot is free for
// something the player actually wants to check mid-run.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    function statRow(label, value, sub) {
        return `
            <div class="profile-row" style="display: flex; justify-content: space-between; align-items: baseline;">
                <span class="profile-label">${label}</span>
                <span style="text-align: right;">${value}${sub ? `<div class="profile-hint">${sub}</div>` : ''}</span>
            </div>`;
    }

    function abilityRow(abilityId, stacks, active) {
        const info = PT.Data.AbilityBuffs[abilityId];
        return `
            <div class="profile-row" style="display: flex; justify-content: space-between; align-items: baseline; opacity: ${stacks > 0 ? '1' : '0.55'};">
                <span>${info.name}</span>
                <span style="text-align: right;">
                    ${stacks > 0 ? `x${stacks}` : '—'}
                    <div class="profile-hint">${stacks === 0 ? 'not boosted' : (active ? 'active' : 'dormant — no matching Pokemon')}</div>
                </span>
            </div>`;
    }

    PT.Screens.STATS = {
        render(container, state) {
            const winBonus = PT.Engine.GameState.getWinRateBonus(state);
            const catchBonus = PT.Engine.GameState.getCatchRateBonus(state);
            const moneyBonus = PT.Engine.GameState.getMoneyMultBonus(state);
            const eventBonus = PT.Engine.GameState.getEventRateBonus(state);
            const ki = state.buffs.keyItems;
            const totalHpUp = state.party.reduce((sum, p) => sum + (p.hpBonus || 0), 0);

            const div = document.createElement('div');
            div.className = 'screen';
            div.style.cssText = 'padding: 14px; overflow-y: auto;';
            div.innerHTML = `
                <div class="event-title">TRAINER STATS</div>

                <div class="profile-section" style="margin-top: 8px;">
                    <div class="profile-row" style="font-size: 8px; font-weight: bold; margin-bottom: 2px;">KEY ITEMS</div>
                    ${statRow('Win Rate Bonus', `+${winBonus}%`, ki.muscleBand > 0 ? `${ki.muscleBand}x Muscle Band` : 'No Muscle Band yet')}
                    ${statRow('Catch Rate Bonus', `+${catchBonus}%`, ki.sootheBell > 0 ? `${ki.sootheBell}x Soothe Bell` : 'No Soothe Bell yet')}
                    ${statRow('Money Multiplier', `+${moneyBonus}%`, ki.amuletCoin > 0 ? `${ki.amuletCoin}x Amulet Coin` : 'No Amulet Coin yet')}
                    ${statRow('Event Rate Bonus', `+${eventBonus}%`, ki.whiteFlute > 0 ? `${ki.whiteFlute}x White Flute${PT.Engine.GameState.isKeyItemMaxed(state, 'whiteFlute') ? ' — MAXED OUT' : ''}` : 'No White Flute yet')}
                    ${statRow('HP Up Used', `${totalHpUp}`, ki.hpUp > 0 ? `${ki.hpUp}x across your party (max +${PT.Data.KeyItems.hpUp.maxStacksPerTarget}/Pokemon)` : 'No HP Up yet')}
                </div>

                <div class="profile-section" style="margin-top: 8px;">
                    <div class="profile-row" style="font-size: 8px; font-weight: bold; margin-bottom: 2px;">ABILITY BOOSTS</div>
                    ${PT.Data.AbilityBuffOrder.map(id => abilityRow(id, state.buffs.abilities[id] || 0, PT.Engine.GameState.hasAbility(state, id))).join('')}
                </div>

                <div class="text-box" style="font-size: 6px; margin-top: 6px;">
                    Win/catch bonuses are clamped in battle — you'll see ⚠️ MAXED OUT there once you can't push them any higher.
                </div>

                <button class="btn btn-wide" id="btn-stats-back" style="margin-top: 8px;">BACK</button>
            `;
            container.appendChild(div);

            document.getElementById('btn-stats-back').addEventListener('click', () => {
                PT.App.pop();
            });
        }
    };
})();

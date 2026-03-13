// Porygon Trail - Gym Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.GYM = {
        render(container, state, params) {
            const leaderId = params.gymLeader;
            const leader = PT.Data.GymLeaders[leaderId];
            if (!leader) { PT.App.goto('TRAVEL'); return; }

            const div = document.createElement('div');
            div.className = 'screen gym-screen';
            div.innerHTML = `
                <div class="event-title">${leader.name}'s GYM</div>
                <div class="gym-leader-area">
                    <div class="gym-leader-name">${leader.name}</div>
                    <div class="gym-badge-name">${leader.title}</div>
                    <div style="font-size: 8px; margin-top: 4px;">Type: ${leader.type.toUpperCase()} | Badge: ${leader.badge}</div>
                    <div class="gym-challenge-text">${leader.challengeText}</div>
                </div>
                <div class="text-box" style="font-size: 7px;">
                    Choose a Pokemon to face the challenge! Type advantages matter.
                    <br>Strong vs: ${leader.strongAgainst.join(', ')} | Weak vs: ${leader.weakAgainst.join(', ')}
                </div>
                <div class="event-choices" id="gym-choices">
                    ${PT.Engine.GameState.getAliveParty(state).map((p, i) => {
                        const hasAdvantage = p.types.some(t => leader.weakAgainst.includes(t));
                        const hasDisadvantage = p.types.some(t => leader.strongAgainst.includes(t));
                        let label = `${p.name} Lv.${p.level} (${p.types.join('/')})`;
                        if (hasAdvantage) label += ' [SUPER EFFECTIVE!]';
                        if (hasDisadvantage) label += ' [NOT VERY EFFECTIVE...]';
                        return `<button class="btn btn-wide" data-index="${i}">${label}</button>`;
                    }).join('')}
                    <button class="btn btn-wide" id="btn-leave-gym">LEAVE GYM</button>
                </div>
            `;
            container.appendChild(div);

            // Pokemon selection
            document.querySelectorAll('[data-index]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    const alive = PT.Engine.GameState.getAliveParty(state);
                    const chosen = alive[index];
                    resolveGymBattle(chosen, leader, leaderId, state, container);
                });
            });

            document.getElementById('btn-leave-gym').addEventListener('click', () => {
                PT.App.goto('TRAVEL');
            });
        }
    };

    function resolveGymBattle(pokemon, leader, leaderId, state, container) {
        // Calculate success chance
        let chance = 50;

        // Type advantage
        const hasAdvantage = pokemon.types.some(t => leader.weakAgainst.includes(t));
        const hasDisadvantage = pokemon.types.some(t => leader.strongAgainst.includes(t));
        if (hasAdvantage) chance += 25;
        if (hasDisadvantage) chance -= 25;

        // Level bonus
        const levelDiff = pokemon.level - leader.level;
        chance += Math.max(-15, Math.min(15, levelDiff));

        // Badge count bonus
        chance += state.badges.length * 2;

        // Clamp
        chance = Math.max(10, Math.min(90, chance));

        const won = state.rng.chance(chance);

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';

        if (won) {
            state.badges.push(leader.badge);
            state.gymBattlesWon++;
            state.resources.money += leader.reward.money;
            PT.Engine.GameState.addToLog(state, `Defeated ${leader.name}! Got ${leader.badge}!`);
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            // Award gym victory XP to the chosen Pokemon
            const gymXP = 50 + (leader.level * 3);
            const xpResult = PT.Engine.GameState.awardXP(pokemon, gymXP);
            let xpLine = `${pokemon.name} gained ${gymXP} XP!`;
            if (xpResult.leveled) xpLine += ` ${pokemon.name} grew to Lv.${xpResult.newLevel}!`;

            div.innerHTML = `
                <div class="event-title">VICTORY!</div>
                <div class="gym-leader-area">
                    <div class="gym-leader-name"><span class="badge-earned">${leader.badge}</span></div>
                    <div class="gym-challenge-text">${leader.victoryText}</div>
                    <div style="font-size: 8px; margin-top: 12px;">
                        Earned: <span class="badge-earned">${leader.badge}</span> + $${leader.reward.money}
                        <br>${xpLine}
                        <br>Win chance was ${chance}%
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-continue">CONTINUE</button>
            `;
        } else {
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();
            PT.Engine.GameState.damagePokemon(pokemon, 2);
            if (pokemon.hp <= 0) state.pokemonLost++;
            PT.Engine.GameState.addToLog(state, `Lost to ${leader.name}. ${pokemon.name} was hurt.`);

            // Award small consolation XP on loss
            const lossXP = 10;
            const lossXpResult = PT.Engine.GameState.awardXP(pokemon, lossXP);
            let lossXpLine = `${pokemon.name} gained ${lossXP} XP.`;
            if (lossXpResult.leveled) lossXpLine += ` ${pokemon.name} grew to Lv.${lossXpResult.newLevel}!`;

            div.innerHTML = `
                <div class="event-title">DEFEAT...</div>
                <div class="gym-leader-area">
                    <div class="gym-leader-name">${leader.name} wins</div>
                    <div class="gym-challenge-text">${leader.defeatText}</div>
                    <div style="font-size: 8px; margin-top: 12px;">
                        ${pokemon.name} takes 2 damage!
                        <br>${lossXpLine}
                        <br>Win chance was ${chance}%
                        <br>You can try again next time you visit.
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-continue">CONTINUE</button>
            `;
        }
        container.appendChild(div);

        document.getElementById('btn-continue').addEventListener('click', () => {
            if (state.isGameOver || PT.Engine.GameState.getAliveParty(state).length === 0) {
                state.isGameOver = true;
                state.gameOverReason = 'blackout';
                PT.App.goto('GAMEOVER');
            } else {
                PT.App.goto('TRAVEL');
            }
        });
    }
})();

// Porygon Trail - Gym Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.GYM = {
        render(container, state, params) {
            const leaderId = params.gymLeader;
            const leader = PT.Data.GymLeaders[leaderId];
            if (!leader) { PT.App.goto('TRAVEL'); return; }

            // Pick a random Pokemon from the leader's pool
            const opponent = state.rng.pick(leader.pokemon);
            const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);
            const isAce = !!opponent.ace;

            const div = document.createElement('div');
            div.className = 'screen gym-screen';
            div.innerHTML = `
                <div class="event-title">${leader.name}'s GYM</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites">
                        <div class="gym-leader-portrait">
                            <img src="${leader.spriteUrl}" alt="${leader.name}"
                                 style="width: 56px; height: 56px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'">
                            <div class="gym-portrait-label">${leader.name}</div>
                            <div style="font-size: 6px;">${leader.title}</div>
                            <div style="font-size: 7px; margin-top: 2px;">${leader.type.toUpperCase()} TYPE</div>
                        </div>
                        <div style="font-size: 14px; align-self: center; font-weight: bold;">VS</div>
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 80px; height: 80px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'; this.parentElement.querySelector('.gym-opponent-name').style.marginTop='40px';">
                            <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${opponent.name}</div>
                            ${isAce ? '<div style="font-size: 7px; color: var(--gb-darkest);">⭐ ACE POKEMON</div>' : ''}
                        </div>
                    </div>
                    <div class="gym-challenge-text">${leader.name} sends out ${opponent.name}!</div>
                </div>
                <div class="text-box" style="font-size: 7px;">
                    Choose your Pokemon! Type advantages matter.
                    <br>Strong vs: ${leader.strongAgainst.join(', ')} | Weak vs: ${leader.weakAgainst.join(', ')}
                </div>
                <div class="event-choices" id="gym-choices">
                    ${PT.Engine.GameState.getAliveParty(state).map((p, i) => {
                        const hasAdvantage = p.types.some(t => leader.weakAgainst.includes(t));
                        const hasDisadvantage = p.types.some(t => leader.strongAgainst.includes(t));
                        let label = `${p.name} (${p.types.join('/')})`;
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
                    resolveGymBattle(chosen, leader, leaderId, state, container, opponent);
                });
            });

            document.getElementById('btn-leave-gym').addEventListener('click', () => {
                PT.App.goto('TRAVEL');
            });
        }
    };

    function resolveGymBattle(pokemon, leader, leaderId, state, container, opponent) {
        const isAce = !!opponent.ace;
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);

        // Calculate success chance
        let chance = 50;

        // Type advantage
        const hasAdvantage = pokemon.types.some(t => leader.weakAgainst.includes(t));
        const hasDisadvantage = pokemon.types.some(t => leader.strongAgainst.includes(t));
        if (hasAdvantage) chance += 25;
        if (hasDisadvantage) chance -= 25;

        // Badge count bonus
        chance += state.badges.length * 3;

        // Party size bonus
        const aliveCount = PT.Engine.GameState.getAliveParty(state).length;
        chance += aliveCount * 2;

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
            PT.Engine.GameState.addToLog(state, `Defeated ${leader.name}'s ${opponent.name}! Got ${leader.badge}!`);
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            // Try to evolve the chosen Pokemon after gym victory
            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon);
            let evoLine = '';
            if (evoResult.evolved) {
                evoLine = `<br>${evoResult.oldName} evolved into ${evoResult.newName}!`;
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            }

            div.innerHTML = `
                <div class="event-title">VICTORY!</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites" style="justify-content: center;">
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 64px; height: 64px; image-rendering: pixelated; opacity: 0.4;"
                                 onerror="this.style.display='none'">
                            <div style="font-size: 8px; text-decoration: line-through;">${opponent.name}</div>
                        </div>
                    </div>
                    <div class="gym-leader-name"><span class="badge-earned">${leader.badge}</span></div>
                    <div class="gym-challenge-text">${leader.victoryText}</div>
                    <div style="font-size: 8px; margin-top: 8px;">
                        ${pokemon.name} defeated ${leader.name}'s ${opponent.name}!
                        <br>Earned: <span class="badge-earned">${leader.badge}</span> + $${leader.reward.money}${evoLine}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%</span>
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-continue">CONTINUE</button>
            `;
        } else {
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();

            // Ace Pokemon: 60% death chance, non-ace: 30%
            const deathChance = isAce ? 60 : 30;
            const damage = isAce ? 3 : 2;

            let gymKilled = false;
            let gymFainted = false;
            if (state.rng.chance(deathChance)) {
                const idx = state.party.indexOf(pokemon);
                if (idx !== -1) {
                    state.party.splice(idx, 1);
                    state.pokemonLost++;
                    gymKilled = true;
                }
            } else {
                gymFainted = PT.Engine.GameState.damagePokemon(pokemon, damage, state);
            }

            const died = gymKilled || gymFainted;
            if (died) {
                PT.Engine.GameState.addToLog(state, `Lost to ${leader.name}'s ${opponent.name}. ${pokemon.name} was killed! 💀`);
            } else {
                PT.Engine.GameState.addToLog(state, `Lost to ${leader.name}'s ${opponent.name}. ${pokemon.name} was badly hurt.`);
            }

            div.innerHTML = `
                <div class="event-title">DEFEAT...</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites" style="justify-content: center;">
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 64px; height: 64px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'">
                            <div style="font-size: 8px; font-weight: bold;">${opponent.name}${isAce ? ' ⭐' : ''}</div>
                        </div>
                    </div>
                    <div class="gym-leader-name">${leader.name} wins</div>
                    <div class="gym-challenge-text">${leader.defeatText}</div>
                    <div style="font-size: 8px; margin-top: 8px;">
                        ${died
                            ? `💀 ${pokemon.name} was killed by ${opponent.name}!`
                            : `${pokemon.name} takes ${damage} damage from ${opponent.name}!`}
                        ${isAce ? '<br><span style="font-size: 6px;">Ace Pokemon are more dangerous!</span>' : ''}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%</span>
                        ${died ? '' : '<br>You can try again next time you visit.'}
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-continue">CONTINUE</button>
            `;
        }
        container.appendChild(div);

        document.getElementById('btn-continue').addEventListener('click', () => {
            if (state.isGameOver || state.party.length === 0) {
                state.isGameOver = true;
                if (!state.gameOverReason) state.gameOverReason = 'party_wiped';
                PT.App.goto('GAMEOVER');
            } else {
                PT.App.goto('TRAVEL');
            }
        });
    }
})();

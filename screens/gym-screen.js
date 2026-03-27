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

            // Look up opponent Pokemon's actual types
            const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
            const opponentTypes = opponentData ? opponentData.types : [leader.type];

            // Build type effectiveness lookup based on opponent's types
            const typeChart = getTypeWeaknesses(opponentTypes);

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
                            <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                            ${isAce ? '<div style="font-size: 7px; color: var(--gb-darkest);">⭐ ACE POKEMON</div>' : ''}
                        </div>
                    </div>
                    <div class="gym-challenge-text">${leader.name} sends out ${opponent.name}!</div>
                </div>
                <div class="text-box" style="font-size: 7px;">
                    Choose your Pokemon! ${opponent.name} is ${opponentTypes.join('/')}-type.
                    <br>Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
                </div>
                <div class="event-choices" id="gym-choices">
                    ${PT.Engine.GameState.getAliveParty(state).map((p, i) => {
                        const hasAdvantage = p.types.some(t => typeChart.weakTo.includes(t));
                        const hasDisadvantage = p.types.some(t => typeChart.strongTo.includes(t));
                        let label = `${p.name} (${p.types.join('/')})`;
                        if (p.battleStars > 0) label += ` ${'★'.repeat(p.battleStars)}`;
                        if (hasAdvantage) label += ' [SE!]';
                        if (hasDisadvantage) label += ' [NVE]';
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

    // Gen 1 type chart — returns what types the given types are weak to and resist
    function getTypeWeaknesses(types) {
        const weaknesses = {
            normal:   { weakTo: ['fighting'], resistedBy: ['rock'], immuneBy: ['ghost'] },
            fire:     { weakTo: ['water', 'ground', 'rock'], resistedBy: ['fire', 'grass', 'ice', 'bug'] },
            water:    { weakTo: ['electric', 'grass'], resistedBy: ['fire', 'water', 'ice'] },
            electric: { weakTo: ['ground'], resistedBy: ['electric', 'flying'] },
            grass:    { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'], resistedBy: ['water', 'grass', 'electric', 'ground'] },
            ice:      { weakTo: ['fire', 'fighting', 'rock'], resistedBy: ['ice'] },
            fighting: { weakTo: ['flying', 'psychic'], resistedBy: ['bug', 'rock'] },
            poison:   { weakTo: ['ground', 'psychic', 'bug'], resistedBy: ['grass', 'fighting', 'poison'] },
            ground:   { weakTo: ['water', 'grass', 'ice'], resistedBy: ['poison', 'rock'], immuneBy: ['electric'] },
            flying:   { weakTo: ['electric', 'ice', 'rock'], resistedBy: ['grass', 'fighting', 'bug'], immuneBy: ['ground'] },
            psychic:  { weakTo: ['bug'], resistedBy: ['fighting', 'psychic'] },
            bug:      { weakTo: ['fire', 'flying', 'rock'], resistedBy: ['grass', 'fighting', 'ground'] },
            rock:     { weakTo: ['water', 'grass', 'fighting', 'ground'], resistedBy: ['normal', 'fire', 'poison', 'flying'] },
            ghost:    { weakTo: ['ghost'], resistedBy: ['poison', 'bug'], immuneBy: ['normal', 'fighting'] },
            dragon:   { weakTo: ['ice', 'dragon'], resistedBy: ['fire', 'water', 'electric', 'grass'] }
        };

        const weakTo = new Set();
        const strongTo = new Set();

        types.forEach(type => {
            const entry = weaknesses[type.toLowerCase()];
            if (!entry) return;
            entry.weakTo.forEach(t => weakTo.add(t));
            (entry.resistedBy || []).forEach(t => strongTo.add(t));
        });

        // Remove types that appear in both (dual-type cancellation)
        return {
            weakTo: [...weakTo].filter(t => !strongTo.has(t)),
            strongTo: [...strongTo].filter(t => !weakTo.has(t))
        };
    }

    function resolveGymBattle(pokemon, leader, leaderId, state, container, opponent) {
        const isAce = !!opponent.ace;
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);

        // Look up opponent Pokemon's actual types for battle calc
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [leader.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Calculate success chance
        let chance = 45;
        let battleBonuses = [];

        // Type advantage based on opponent Pokemon's types
        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) chance += 20;
        if (hasDisadvantage) chance -= 20;

        // Badge count bonus
        chance += state.badges.length * 2;

        // Party size bonus
        const aliveCount = PT.Engine.GameState.getAliveParty(state).length;
        chance += aliveCount * 2;

        // Poison ability: +5% win chance
        if (PT.Engine.GameState.hasAbility(state, 'poison')) {
            chance += 5;
            battleBonuses.push('☠️ POISON +5%');
        }

        // Intimidate ability: +5% win chance
        if (PT.Engine.GameState.hasAbility(state, 'intimidate')) {
            chance += 5;
            battleBonuses.push('😤 INTIMIDATE +5%');
        }

        // Battle Stars bonus
        const starBonus = PT.Engine.GameState.getStarBonus(pokemon);
        if (starBonus.winChanceBonus > 0) {
            chance += starBonus.winChanceBonus;
            battleBonuses.push(`${'★'.repeat(pokemon.battleStars || 0)} +${starBonus.winChanceBonus}%`);
        }

        // Gym progressive scaling — later gyms expect battle-hardened Pokemon
        // Scales from 0 (1st gym) to -9% (8th gym, Giovanni), matching max 3-star bonus
        const badgeCount = state.badges.filter(b => b !== 'champion').length;
        const gymScaling = Math.floor((badgeCount / 7) * 9); // 0,1,2,3,5,6,7,9
        if (gymScaling > 0) chance -= gymScaling;

        // Clamp
        chance = Math.max(10, Math.min(80, chance));

        const won = state.rng.chance(chance);

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';

        if (won) {
            state.badges.push(leader.badge);
            state.gymBattlesWon++;
            state.resources.money += leader.reward.money;

            // Award battle star
            const starResult = PT.Engine.GameState.addBattleWin(pokemon, state);
            let starLine = '';
            if (starResult.earned) {
                starLine = `<br>⭐ ${pokemon.name} earned a Battle Star! [${'★'.repeat(pokemon.battleStars)}] (${pokemon.battleStars}/3)`;
            }

            PT.Engine.GameState.addToLog(state, `Defeated ${leader.name}'s ${opponent.name}! Got ${leader.badge}!`);
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            // Try to evolve the chosen Pokemon after gym victory
            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon, state);
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
                        <br>Earned: <span class="badge-earned">${leader.badge}</span> + $${leader.reward.money}${evoLine}${starLine}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%${battleBonuses.length > 0 ? ' (' + battleBonuses.join(', ') + ')' : ''}</span>
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
                // Ace Pokemon kills bypass Battle Star death avoidance
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
                        ${isAce ? '<br><span style="font-size: 6px;">⚠️ Ace Pokemon ignore Battle Star protection!</span>' : ''}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%${battleBonuses.length > 0 ? ' (' + battleBonuses.join(', ') + ')' : ''}</span>
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

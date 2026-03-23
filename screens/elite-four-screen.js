// Porygon Trail - Elite Four Gauntlet Screen
// v2 - force redeploy
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Gen 1 type chart (duplicated from gym-screen for independence)
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

        return {
            weakTo: [...weakTo].filter(t => !strongTo.has(t)),
            strongTo: [...strongTo].filter(t => !weakTo.has(t))
        };
    }

    PT.Screens.ELITEFOUR = {
        render(container, state, params) {
            // Initialize E4 state on first entry
            if (!params || params.e4Index === undefined) {
                // Snapshot the full party before the gauntlet starts
                state.e4EntryParty = state.party.map(p => ({
                    name: p.name,
                    id: p.id,
                    spriteUrl: p.spriteUrl,
                    types: p.types ? [...p.types] : ['normal'],
                    hp: p.hp,
                    maxHp: p.maxHp,
                    rarity: p.rarity
                }));

                // Pre-roll opponents for all 5 trainers
                const opponents = PT.Data.EliteFour.map(trainer =>
                    state.rng.pick(trainer.pokemon)
                );

                // Show intro screen
                renderIntro(container, state, opponents);
                return;
            }

            // Battle select screen for current E4 member
            renderBattleSelect(container, state, params);
        }
    };

    function renderIntro(container, state, opponents) {
        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title">THE ELITE FOUR</div>
            <div class="text-box text-center" style="font-size: 8px;">
                You've reached the Indigo Plateau.<br>
                Five trainers stand between you and the Hall of Fame.<br>
                <strong>Once you enter, there is no turning back.</strong>
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 8px 0;">
                ${PT.Data.EliteFour.map((trainer, i) => `
                    <div style="text-align: center; font-size: 7px; min-width: 55px;">
                        <img src="${PT.Engine.GameState.getSpriteUrl(opponents[i].id)}"
                             style="width: 40px; height: 40px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div style="font-weight: bold;">${trainer.name}</div>
                        <div>${trainer.title}</div>
                    </div>
                `).join('')}
            </div>
            <div class="text-box text-center" style="font-size: 7px;">
                Your party: ${state.party.map(p => p.name).join(', ')}<br>
                ${state.party.length} Pokemon ready for battle.
            </div>
            <div class="event-choices">
                <button class="btn btn-wide" id="btn-begin-e4">BEGIN THE GAUNTLET</button>
                <button class="btn btn-wide" id="btn-leave-e4">NOT YET...</button>
            </div>
        `;
        container.appendChild(div);

        document.getElementById('btn-begin-e4').addEventListener('click', () => {
            PT.App.goto('ELITEFOUR', {
                e4Index: 0,
                opponents: opponents
            });
        });

        document.getElementById('btn-leave-e4').addEventListener('click', () => {
            PT.App.goto('TRAVEL');
        });
    }

    function renderBattleSelect(container, state, params) {
        const { e4Index, opponents } = params;
        const trainer = PT.Data.EliteFour[e4Index];
        const opponent = opponents[e4Index];
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);

        // Get opponent types
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [trainer.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        const alive = PT.Engine.GameState.getAliveParty(state);

        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title" style="font-size: 10px;">ELITE FOUR — BATTLE ${e4Index + 1} of 5</div>
            <div class="gym-battle-area">
                <div class="gym-battle-sprites">
                    <div class="gym-leader-portrait">
                        <div class="gym-portrait-label">${trainer.name}</div>
                        <div style="font-size: 6px;">${trainer.title}</div>
                        <div style="font-size: 7px; margin-top: 2px;">${trainer.type.toUpperCase()} TYPE</div>
                    </div>
                    <div style="font-size: 14px; align-self: center; font-weight: bold;">VS</div>
                    <div class="gym-opponent-pokemon">
                        <img src="${opponentSprite}" alt="${opponent.name}"
                             style="width: 80px; height: 80px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${opponent.name}</div>
                        <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                        <div style="font-size: 7px; color: var(--gb-darkest);">⭐ ELITE POKEMON</div>
                    </div>
                </div>
                <div class="gym-challenge-text" style="font-size: 7px;">${trainer.introText}</div>
            </div>
            <div class="text-box" style="font-size: 7px;">
                ${trainer.name} sends out ${opponent.name}! (${opponentTypes.join('/')}-type)
                <br>Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
            </div>
            <div class="event-choices" id="e4-choices">
                ${alive.map((p, i) => {
                    const hasAdvantage = p.types.some(t => typeChart.weakTo.includes(t));
                    const hasDisadvantage = p.types.some(t => typeChart.strongTo.includes(t));
                    let label = `${p.name} (${p.types.join('/')}) HP:${p.hp}/${p.maxHp}`;
                    if (hasAdvantage) label += ' [SE!]';
                    if (hasDisadvantage) label += ' [NVE]';
                    return `<button class="btn btn-wide" data-index="${i}">${label}</button>`;
                }).join('')}
            </div>
        `;
        container.appendChild(div);

        // No leave button — you're committed

        document.querySelectorAll('[data-index]').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const alive = PT.Engine.GameState.getAliveParty(state);
                const chosen = alive[index];
                resolveE4Battle(chosen, trainer, state, container, params);
            });
        });
    }

    function resolveE4Battle(pokemon, trainer, state, container, params) {
        const { e4Index, opponents } = params;
        const opponent = opponents[e4Index];
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);

        // Get opponent types for battle calc
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [trainer.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Calculate success chance — HARDER than gyms
        let chance = 35; // Base 35% (gym is 45%)

        // Type advantage (smaller bonus than gyms)
        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) chance += 15;
        if (hasDisadvantage) chance -= 15;

        // Badge bonus (smaller than gym)
        chance += state.badges.filter(b => b !== 'champion').length * 2;

        // Party size bonus
        const aliveCount = PT.Engine.GameState.getAliveParty(state).length;
        chance += aliveCount * 2;

        // Lower ceiling than gyms
        chance = Math.max(10, Math.min(65, chance));

        const won = state.rng.chance(chance);

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';

        if (won) {
            // Victory against this E4 member
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();
            PT.Engine.GameState.addToLog(state, `Defeated ${trainer.name}'s ${opponent.name} in the Elite Four!`);

            // Try evolution
            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon);
            let evoLine = '';
            if (evoResult.evolved) {
                evoLine = `<br>${evoResult.oldName} evolved into ${evoResult.newName}!`;
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            }

            const isLastBattle = e4Index >= PT.Data.EliteFour.length - 1;

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
                    <div class="gym-challenge-text" style="font-size: 7px;">${trainer.defeatText}</div>
                    <div style="font-size: 8px; margin-top: 8px;">
                        ${pokemon.name} defeated ${trainer.name}'s ${opponent.name}!${evoLine}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%</span>
                        ${isLastBattle
                            ? '<br><strong>You\'ve defeated all five! You are the CHAMPION!</strong>'
                            : `<br>Next up: ${PT.Data.EliteFour[e4Index + 1].name}...`}
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-e4-next">
                    ${isLastBattle ? 'ENTER THE HALL OF FAME' : `FACE ${PT.Data.EliteFour[e4Index + 1].name.toUpperCase()}`}
                </button>
            `;
            container.appendChild(div);

            document.getElementById('btn-e4-next').addEventListener('click', () => {
                if (isLastBattle) {
                    // Champion! Set victory flags and go to Hall of Fame
                    state.hasWon = true;
                    if (!state.badges.includes('champion')) {
                        state.badges.push('champion');
                    }
                    state.resources.money += 5000;
                    PT.Engine.GameState.addToLog(state, 'Became the Pokemon Champion!');
                    PT.App.goto('VICTORY');
                } else {
                    // Next E4 battle
                    PT.App.goto('ELITEFOUR', {
                        e4Index: e4Index + 1,
                        opponents: opponents
                    });
                }
            });

        } else {
            // Loss — Pokemon takes heavy damage, high death chance
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();

            const damage = 3;
            // Low HP mons (1-2 HP) have 80% death chance, otherwise 60%
            const deathChance = pokemon.hp <= 2 ? 80 : 60;

            let killed = false;
            let fainted = false;
            if (state.rng.chance(deathChance)) {
                const idx = state.party.indexOf(pokemon);
                if (idx !== -1) {
                    state.party.splice(idx, 1);
                    state.pokemonLost++;
                    killed = true;
                }
            } else {
                fainted = PT.Engine.GameState.damagePokemon(pokemon, damage, state);
            }

            const died = killed || fainted;
            if (died) {
                PT.Engine.GameState.addToLog(state, `${pokemon.name} was killed by ${trainer.name}'s ${opponent.name}! 💀`);
            } else {
                PT.Engine.GameState.addToLog(state, `${pokemon.name} was badly hurt by ${trainer.name}'s ${opponent.name}.`);
            }

            const aliveAfter = PT.Engine.GameState.getAliveParty(state);
            const partyWiped = aliveAfter.length === 0;

            div.innerHTML = `
                <div class="event-title">DEFEAT...</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites" style="justify-content: center;">
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 64px; height: 64px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'">
                            <div style="font-size: 8px; font-weight: bold;">${opponent.name} ⭐</div>
                        </div>
                    </div>
                    <div class="gym-leader-name">${trainer.name} wins</div>
                    <div style="font-size: 8px; margin-top: 8px;">
                        ${died
                            ? `💀 ${pokemon.name} was killed by ${opponent.name}!`
                            : `${pokemon.name} takes ${damage} damage from ${opponent.name}!`}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%${pokemon.hp <= 2 && !died ? ' | Low HP = higher death risk!' : ''}</span>
                        ${partyWiped
                            ? '<br><strong>All your Pokemon have fallen...</strong>'
                            : `<br>You must defeat ${trainer.name}'s ${opponent.name} to advance.`}
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-e4-continue">
                    ${partyWiped ? 'GAME OVER' : 'CHOOSE ANOTHER POKEMON'}
                </button>
            `;
            container.appendChild(div);

            document.getElementById('btn-e4-continue').addEventListener('click', () => {
                if (partyWiped) {
                    state.isGameOver = true;
                    if (!state.gameOverReason) state.gameOverReason = 'party_wiped';
                    PT.App.goto('GAMEOVER');
                } else {
                    // Re-render battle select for the same trainer
                    PT.App.goto('ELITEFOUR', {
                        e4Index: e4Index,
                        opponents: opponents
                    });
                }
            });
        }
    }
})();

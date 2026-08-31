// Porygon Trail - Red Capstone Battle Screen (§9.3)
//
// The true ending of a Johto run. Reached after clearing the Johto Elite
// Four rematch (screens/elite-four-screen.js) and walking Route 28/Mt.
// Silver. Fixed 6-Pokemon roster (all aces), presented in random order
// each run. Scoring is partial-credit (engine/scoring.js's
// calculateRedCapstoneBonus), not binary — reaching and engaging Red at
// all should register as a real accomplishment even on a partial clear.
// Only defeating all 6 sets state.hasWon and routes to VICTORY; anything
// else (party wiped, or the player banks their score early) ends the run
// for real via GAMEOVER, per "only beating Red at the capstone is the
// real ending."
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Duplicated from gym-screen.js/elite-four-screen.js for independence
    // (existing convention in this codebase — see elite-four-screen.js's
    // own comment on this).
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
            dragon:   { weakTo: ['ice', 'dragon'], resistedBy: ['fire', 'water', 'electric', 'grass'] },
            steel:    { weakTo: ['fire', 'fighting', 'ground'], resistedBy: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel'], immuneBy: ['poison'] },
            dark:     { weakTo: ['bug', 'fighting'], resistedBy: ['ghost', 'dark'], immuneBy: ['psychic'] }
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

    PT.Screens.REDCAPSTONE = {
        render(container, state, params) {
            // Initialize capstone state on first entry
            if (!params || params.redIndex === undefined) {
                // Fresh shuffle of Red's roster every run (§9.3: "presented
                // in random order each run").
                const order = state.rng.shuffle([...PT.Data.RedCapstone.pokemon]);
                state.redOrder = order;
                state.redIndex = 0;
                state.redMonsDefeated = state.redMonsDefeated || 0;

                renderIntro(container, state, order);
                return;
            }

            renderBattleSelect(container, state, params);
        }
    };

    function renderIntro(container, state, order) {
        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title">MT. SILVER — ???</div>
            <div class="text-box text-center" style="font-size: 8px;">
                At the peak of Mt. Silver, a lone trainer in a weathered cap turns to face you.
                <br>${PT.Data.RedCapstone.introText}
                <br><br><strong>This is it. No badges, no items — just your team against his.</strong>
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 8px 0;">
                ${order.map(mon => `
                    <div style="text-align: center; font-size: 7px; min-width: 55px;">
                        <img src="${PT.Engine.GameState.getSpriteUrl(mon.id)}"
                             style="width: 40px; height: 40px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div style="font-weight: bold;">${mon.name}</div>
                    </div>
                `).join('')}
            </div>
            <div class="text-box text-center" style="font-size: 7px;">
                Your party: ${state.party.map(p => p.name).join(', ')}<br>
                ${state.party.length} Pokemon ready for battle.
            </div>
            <div class="event-choices">
                <button class="btn btn-wide" id="btn-begin-red">CHALLENGE RED</button>
            </div>
        `;
        container.appendChild(div);

        document.getElementById('btn-begin-red').addEventListener('click', () => {
            PT.App.goto('REDCAPSTONE', { redIndex: 0 });
        });
    }

    function renderBattleSelect(container, state, params) {
        const { redIndex } = params;
        const order = state.redOrder;
        const opponent = order[redIndex];
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);

        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : ['normal'];
        const typeChart = getTypeWeaknesses(opponentTypes);

        const alive = PT.Engine.GameState.getAliveParty(state);
        const defeated = state.redMonsDefeated || 0;

        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title" style="font-size: 10px;">RED — POKEMON ${redIndex + 1} of ${order.length}</div>
            <div class="gym-battle-area">
                <div class="gym-battle-sprites">
                    <div class="gym-leader-portrait">
                        <div class="gym-portrait-label">Red</div>
                        <div style="font-size: 6px;">${PT.Data.RedCapstone.title}</div>
                    </div>
                    <div class="gym-opponent-pokemon">
                        <img src="${opponentSprite}" alt="${opponent.name}"
                             style="width: 80px; height: 80px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${opponent.name}</div>
                        <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                        <div style="font-size: 7px; color: var(--gb-darkest);">⭐ RED'S ACE</div>
                    </div>
                </div>
            </div>
            <div class="text-box" style="font-size: 7px;">
                Red sends out ${opponent.name}! (${opponentTypes.join('/')}-type)
                <br>Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
                <br><span style="font-size: 6px;">⚠️ Battle Stars do NOT protect against Red's Pokemon!</span>
                ${defeated > 0 ? `<br><span style="font-size: 6px;">Defeated so far: ${defeated}/6</span>` : ''}
            </div>
            <div class="event-choices" id="red-choices">
                ${alive.map((p, i) => {
                    const hasAdvantage = p.types.some(t => typeChart.weakTo.includes(t));
                    const hasDisadvantage = p.types.some(t => typeChart.strongTo.includes(t));
                    let label = `${p.name} (${p.types.join('/')}) HP:${p.hp}/${p.maxHp}`;
                    if (p.battleStars > 0) label += ` ${'★'.repeat(p.battleStars)}`;
                    if (hasAdvantage) label += ' [SE!]';
                    if (hasDisadvantage) label += ' [NVE]';
                    return `<button class="btn btn-wide" data-index="${i}">${label}</button>`;
                }).join('')}
            </div>
        `;
        container.appendChild(div);

        document.querySelectorAll('[data-index]').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const alive = PT.Engine.GameState.getAliveParty(state);
                const chosen = alive[index];
                resolveRedBattle(chosen, state, container, params);
            });
        });
    }

    function resolveRedBattle(pokemon, state, container, params) {
        const { redIndex } = params;
        const order = state.redOrder;
        const opponent = order[redIndex];
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);

        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : ['normal'];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Calculate success chance — the hardest fight in the game.
        let chance = 20; // Lower base than the E4's 25% — this is the true final boss
        let battleBonuses = [];

        // Progressive difficulty across Red's 6 Pokemon
        const progressionPenalty = redIndex * 3; // 0%,-3%,-6%,-9%,-12%,-15%
        chance -= progressionPenalty;
        if (progressionPenalty > 0) battleBonuses.push(`📈 Pokemon ${redIndex + 1} penalty -${progressionPenalty}%`);

        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) chance += 25;
        if (hasDisadvantage) chance -= 25;

        // Badge bonus (all badges earned across both regions count)
        chance += state.badges.filter(b => b !== 'champion').length * 1;

        if (pokemon.travelAbility === 'poison') {
            const stage = PT.Engine.GameState.getEvoStage(pokemon.id);
            let power = stage === 1 ? 1.0 : stage === 2 ? 1.5 : 2.0;
            power += (pokemon.battleStars || 0) * 0.25;
            const poisonBonus = Math.max(1, Math.floor(0.5 * power));
            chance += poisonBonus;
            battleBonuses.push(`☠️ POISON +${poisonBonus}%`);
        }

        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePower > 0) {
            const intimBonus = Math.max(1, Math.floor(1.5 * intimidatePower));
            chance += intimBonus;
            battleBonuses.push(`😤 INTIMIDATE +${intimBonus}%`);
        }

        if (PT.Engine.GameState.hasAbility(state, 'psychic_dominance')) {
            chance += 25;
            battleBonuses.push(`🧠 PSYCHIC DOMINANCE +25%`);
        }

        const stars = pokemon.battleStars || 0;
        if (stars > 0) {
            const starWinBonus = Math.floor(stars * 1.5);
            chance += starWinBonus;
            battleBonuses.push(`${'★'.repeat(stars)} +${starWinBonus}%`);
        }

        // Hard ceiling — tighter than the E4's, and tightens further per Pokemon
        const capByRound = [50, 49, 47, 45, 43, 40];
        const cap = capByRound[redIndex] || 40;
        chance = Math.max(6, Math.min(cap, chance));

        const won = state.rng.chance(chance);

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';

        if (won) {
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            state.redMonsDefeated = (state.redMonsDefeated || 0) + 1;
            PT.Engine.GameState.addToLog(state, `Defeated Red's ${opponent.name}! (${state.redMonsDefeated}/6)`);

            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon, state);
            let evoLine = '';
            if (evoResult.evolved) {
                evoLine = `<br>${evoResult.oldName} evolved into ${evoResult.newName}!`;
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            } else if (evoResult.reason === 'location_limit') {
                evoLine = `<br><span style="font-size: 6px;">(${pokemon.name} already evolved at this location — no further evolution here.)</span>`;
            }

            const starResult = PT.Engine.GameState.addBattleWin(pokemon, state, evoResult.evolved);
            let starLine = '';
            if (starResult.earned) {
                starLine = `<br>⭐ ${pokemon.name} earned a Battle Star! [${'★'.repeat(pokemon.battleStars)}] (${pokemon.battleStars}/3)`;
            }
            if (starResult.expShareBonus) {
                starLine += starResult.expShareBonus.type === 'evolution'
                    ? `<br>🎓 EXP. SHARE: ${starResult.expShareBonus.name} also evolved into ${starResult.expShareBonus.newName}!`
                    : `<br>🎓 EXP. SHARE: ${starResult.expShareBonus.name} also earned a Battle Star!`;
            }

            const isLastBattle = redIndex >= order.length - 1;

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
                    <div style="font-size: 8px; margin-top: 8px;">
                        ${pokemon.name} defeated Red's ${opponent.name}!${evoLine}${starLine}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%${battleBonuses.length > 0 ? ' (' + battleBonuses.join(', ') + ')' : ''}</span>
                        ${isLastBattle
                            ? `<br><strong>Red's entire team has fallen. You are the true Champion of both regions!</strong>`
                            : `<br>Red's ${order[redIndex + 1].name} is up next... (${state.redMonsDefeated}/6 beaten)`}
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-red-next">
                    ${isLastBattle ? 'CLAIM VICTORY' : `FACE ${order[redIndex + 1].name.toUpperCase()}`}
                </button>
            `;
            container.appendChild(div);
            PT.Engine.GameState.saveGame(state);

            document.getElementById('btn-red-next').addEventListener('click', () => {
                if (isLastBattle) {
                    // The real ending (§9.3/§6): only a full Red clear sets
                    // hasWon and ends the run via Hall of Fame.
                    if (!state.completedRegions.includes('johto')) {
                        state.completedRegions.push('johto');
                    }
                    state.hasWon = true;
                    PT.Engine.Telemetry.logCapstoneResult(state, 6);
                    PT.App.goto('VICTORY');
                } else {
                    PT.App.goto('REDCAPSTONE', { redIndex: redIndex + 1 });
                }
            });

        } else {
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();

            // Red's Pokemon hit harder than the E4's — this is the final boss.
            const RED_LOSS_DAMAGE = 5;
            pokemon.hp = Math.max(0, pokemon.hp - RED_LOSS_DAMAGE);
            const killed = pokemon.hp <= 0;

            if (killed) {
                pokemon.status = 'fainted';
                if (!state.graveyard) state.graveyard = [];
                const route = PT.Engine.GameState.getCurrentRoute(state);
                state.graveyard.push({
                    name: pokemon.name, id: pokemon.id, spriteUrl: pokemon.spriteUrl,
                    battleStars: pokemon.battleStars || 0,
                    location: route ? route.name : 'Mt. Silver', day: state.daysElapsed
                });
                const idx = state.party.indexOf(pokemon);
                if (idx !== -1) {
                    state.party.splice(idx, 1);
                    state.pokemonLost++;
                }
            }

            const dmgMsg = killed
                ? `${pokemon.name} was killed by Red's ${opponent.name}! 💀`
                : `${pokemon.name} took ${RED_LOSS_DAMAGE} damage from Red's ${opponent.name}! (${pokemon.hp}/${pokemon.maxHp} HP)`;
            PT.Engine.GameState.addToLog(state, dmgMsg);

            const aliveAfter = PT.Engine.GameState.getAliveParty(state);
            const partyWiped = aliveAfter.length === 0;

            const statusMsg = killed
                ? `💀 ${pokemon.name} was killed by ${opponent.name}!`
                : `💥 ${pokemon.name} took ${RED_LOSS_DAMAGE} damage! (${pokemon.hp}/${pokemon.maxHp} HP remaining)`;

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
                    <div class="gym-leader-name">Red wins</div>
                    <div style="font-size: 8px; margin-top: 8px;">
                        ${statusMsg}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%${battleBonuses.length > 0 ? ' (' + battleBonuses.join(', ') + ')' : ''}</span>
                        <br><span style="font-size: 6px;">⚠️ Red's Pokemon ignore Battle Star protection!</span>
                        ${partyWiped
                            ? `<br><strong>All your Pokemon have fallen. You defeated ${state.redMonsDefeated || 0}/6 of Red's team.</strong>`
                            : `<br>You must defeat Red's ${opponent.name} to advance.`}
                    </div>
                </div>
                <button class="btn btn-wide" id="btn-red-continue">
                    ${partyWiped ? 'END RUN' : 'CHOOSE ANOTHER POKEMON'}
                </button>
            `;
            container.appendChild(div);
            PT.Engine.GameState.saveGame(state);

            document.getElementById('btn-red-continue').addEventListener('click', () => {
                if (partyWiped) {
                    state.isGameOver = true;
                    if (!state.gameOverReason) state.gameOverReason = 'capstone_partial';
                    PT.Engine.Telemetry.logCapstoneResult(state, state.redMonsDefeated || 0);
                    PT.App.goto('GAMEOVER');
                } else {
                    PT.App.goto('REDCAPSTONE', { redIndex: redIndex });
                }
            });
        }
    }
})();

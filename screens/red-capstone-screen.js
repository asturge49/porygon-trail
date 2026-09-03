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

    // One row of the rewards/outcome list — see gym-screen.js's identical
    // helper for why this isn't folded into engine/battle-outcome-ui.js.
    function rewardRow(label, value) {
        return `
            <div class="battle-breakdown-row">
                <span class="battle-breakdown-label">${label}</span>
                <span class="battle-breakdown-value">${value}</span>
            </div>`;
    }

    PT.Screens.REDCAPSTONE = {
        render(container, state, params) {
            // Initialize capstone state on first entry
            if (!params || params.redIndex === undefined) {
                // Snapshot the party that's actually about to face Red — the
                // party can differ from state.e4EntryParty (last taken at
                // Johto's E4 rematch) after the Route 28/Mt. Silver walk, so
                // Hall of Fame/victory-screen.js need their own snapshot here
                // to show who really beat Red, not just who beat Johto's E4.
                state.redEntryParty = state.party.map(p => ({
                    name: p.name,
                    id: p.id,
                    spriteUrl: p.spriteUrl,
                    types: p.types ? [...p.types] : ['normal'],
                    hp: p.hp,
                    maxHp: p.maxHp,
                    rarity: p.rarity,
                    battleStars: p.battleStars || 0
                }));

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
                        <img src="${PT.Engine.GameState.getSpriteUrl(mon.id, 'johto')}"
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
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id, 'johto');

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
                        <img src="${PT.Data.RedCapstone.spriteUrl}" alt="Red"
                             style="width: 56px; height: 56px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-portrait-label">Red</div>
                        <div style="font-size: 6px;">${PT.Data.RedCapstone.title}</div>
                    </div>
                    <div class="gym-opponent-pokemon">
                        <img src="${opponentSprite}" alt="${opponent.name}"
                             style="width: 80px; height: 80px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${opponent.name}</div>
                        <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                        <div style="font-size: 7px; color: var(--gb-darkest);">★ RED'S ACE</div>
                    </div>
                </div>
            </div>
            <div class="text-box" style="font-size: 7px;">
                Red sends out ${opponent.name}! (${opponentTypes.join('/')}-type)
                <br>Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
                <br><span style="font-size: 6px;">If you lose, your Pokemon takes 5 damage. Battle Stars do NOT protect against Red's Pokemon!</span>
                ${defeated > 0 ? `<br><span style="font-size: 6px;">Defeated so far: ${defeated}/6</span>` : ''}
            </div>
            <div class="event-choices" id="red-choices">
                ${alive.map((p, i) => {
                    const hasAdvantage = p.types.some(t => typeChart.weakTo.includes(t));
                    const hasDisadvantage = p.types.some(t => typeChart.strongTo.includes(t));
                    return `
                    <button class="btn roster-pick-card" data-index="${i}">
                        <img class="roster-pick-sprite" src="${p.spriteUrl}" alt="${p.name}" onerror="this.style.display='none'">
                        <span class="roster-pick-info">
                            <span class="roster-pick-name">${p.name}</span>
                            <span class="roster-pick-meta">${p.types.join('/')} | HP:${p.hp}/${p.maxHp}</span>
                        </span>
                        <span class="roster-pick-badges">
                            ${p.battleStars > 0 ? `<span class="roster-badge roster-badge-star">${'★'.repeat(p.battleStars)}</span>` : ''}
                            ${hasAdvantage ? '<span class="roster-badge roster-badge-se">SE!</span>' : ''}
                            ${hasDisadvantage ? '<span class="roster-badge roster-badge-nve">NVE</span>' : ''}
                        </span>
                    </button>
                `;
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
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id, 'johto');

        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : ['normal'];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Calculate success chance — the hardest fight in the game.
        // `breakdown` mirrors this math for engine/battle-outcome-ui.js's panel.
        let chance = 20; // Lower base than the E4's 25% — this is the true final boss
        let breakdown = [{ label: 'BASE CHANCE', value: 20 }];

        // Progressive difficulty across Red's 6 Pokemon — starts at -5% on
        // the first Pokemon, then +3% per round: -5%,-8%,-11%,-14%,-17%,-20%.
        const progressionPenalty = 5 + redIndex * 3;
        chance -= progressionPenalty;
        breakdown.push({ label: `POKEMON ${redIndex + 1} PENALTY`, value: -progressionPenalty });

        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) {
            chance += 25;
            breakdown.push({ label: 'TYPE MATCHUP (SE)', value: 25 });
        } else if (hasDisadvantage) {
            chance -= 25;
            breakdown.push({ label: 'TYPE MATCHUP (NVE)', value: -25 });
        } else {
            breakdown.push({ label: 'TYPE MATCHUP', value: 0 });
        }

        // Badge bonus (all badges earned across both regions count)
        const badgeCount = state.badges.filter(b => b !== 'champion').length;
        chance += badgeCount * 1;
        breakdown.push({ label: `BADGES (${badgeCount})`, value: badgeCount });

        // Poison ability: scales with power, party-wide, same as Intimidate below.
        const poisonPower = PT.Engine.GameState.getAbilityPower(state, 'poison');
        if (poisonPower > 0) {
            const poisonBonus = Math.max(1, Math.floor(0.5 * poisonPower));
            chance += poisonBonus;
            const poisonN = PT.Engine.GameState.getAbilityContributorCount(state, 'poison');
            breakdown.push({ label: poisonN > 1 ? `POISON (${poisonN} POKEMON)` : 'POISON', value: poisonBonus });
        }

        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePower > 0) {
            const intimBonus = Math.max(1, Math.floor(1.5 * intimidatePower));
            chance += intimBonus;
            const intimN = PT.Engine.GameState.getAbilityContributorCount(state, 'intimidate');
            breakdown.push({ label: intimN > 1 ? `INTIMIDATE (${intimN} POKEMON)` : 'INTIMIDATE', value: intimBonus });
        }

        if (PT.Engine.GameState.hasAbility(state, 'psychic_dominance')) {
            chance += 25;
            breakdown.push({ label: 'PSYCHIC DOMINANCE', value: 25 });
        }

        const stars = pokemon.battleStars || 0;
        if (stars > 0) {
            const starWinBonus = Math.floor(stars * 1.5);
            chance += starWinBonus;
            breakdown.push({ label: `BATTLE STARS (${'★'.repeat(stars)})`, value: starWinBonus });
        }

        // Hard ceiling — tighter than the E4's, and tightens further per Pokemon
        const capByRound = [50, 49, 47, 45, 43, 40];
        const cap = capByRound[redIndex] || 40;
        const preClampChance = chance;
        chance = Math.max(6, Math.min(cap, chance));
        const maxed = preClampChance !== chance ? (chance === cap ? 'capped' : 'floored') : null;

        // Muscle Band has no effect on Red — same as E4 — surfaced only if owned.
        const notApplicable = [];
        if ((state.buffs.keyItems.muscleBand || 0) > 0) notApplicable.push('MUSCLE BAND');

        const won = PT.Engine.DebugPanel.resolveOutcome(chance, state.rng);

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

            const isLastBattle = redIndex >= order.length - 1;

            let rewardRows = rewardRow('STATUS', isLastBattle
                ? 'Red\'s entire team has fallen — Champion of both regions!'
                : `${order[redIndex + 1].name} is up next (${state.redMonsDefeated}/6 beaten)`);
            if (evoResult.evolved) {
                rewardRows += rewardRow('EVOLVED', `${evoResult.oldName} → ${evoResult.newName}`);
            } else if (evoResult.reason === 'location_limit') {
                rewardRows += rewardRow('EVOLUTION', 'blocked (already evolved here)');
            }
            if (starResult.earned) {
                rewardRows += rewardRow('BATTLE STAR EARNED', `${'★'.repeat(pokemon.battleStars)} (${pokemon.battleStars}/3)`);
            }
            if (starResult.expShareBonus) {
                rewardRows += rewardRow('EXP. SHARE',
                    starResult.expShareBonus.type === 'evolution'
                        ? `${starResult.expShareBonus.name} also evolved into ${starResult.expShareBonus.newName}!`
                        : `${starResult.expShareBonus.name} also earned a Battle Star!`);
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
                    <div style="font-size: 8px; margin-top: 4px;">${pokemon.name} defeated Red's ${opponent.name}!</div>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${rewardRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                        chance, maxed, rows: breakdown, notApplicable, quote: null
                    })}
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
                ? `${pokemon.name} was killed by Red's ${opponent.name}!`
                : `${pokemon.name} took ${RED_LOSS_DAMAGE} damage from Red's ${opponent.name}! (${pokemon.hp}/${pokemon.maxHp} HP)`;
            PT.Engine.GameState.addToLog(state, dmgMsg);

            const aliveAfter = PT.Engine.GameState.getAliveParty(state);
            const partyWiped = aliveAfter.length === 0;

            // Same as E4 — Red's damage bypasses Battle Stars, Focus Band,
            // Safeguard, and System Restore (direct HP subtraction, not
            // damagePokemon()). Only flag items the player actually owns.
            const lossNotApplicable = [];
            if ((state.buffs.keyItems.focusBand || 0) > 0) lossNotApplicable.push('FOCUS BAND');

            let lossRows = rewardRow('RESULT', killed ? `${pokemon.name} was killed` : `${pokemon.name} took ${RED_LOSS_DAMAGE} damage`);
            lossRows += rewardRow('BATTLE STARS', 'ignored by Red\'s Pokemon');
            lossRows += rewardRow('STATUS', partyWiped
                ? `all Pokemon have fallen — ${state.redMonsDefeated || 0}/6 of Red's team beaten`
                : `must defeat ${opponent.name} to advance`);

            div.innerHTML = `
                <div class="event-title">DEFEAT...</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites" style="justify-content: center;">
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 64px; height: 64px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'">
                            <div style="font-size: 8px; font-weight: bold;">${opponent.name} ★</div>
                        </div>
                    </div>
                    <div class="gym-leader-name">Red wins</div>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${lossRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                        chance, maxed, rows: breakdown, notApplicable: notApplicable.concat(lossNotApplicable), quote: null
                    })}
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

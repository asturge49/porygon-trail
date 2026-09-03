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

    // Which Elite Four pool is active — the Johto E4 rematch (§9.2) is a
    // separate diversified pool from Kanto's, selected purely off
    // state.region so this screen doesn't depend on how the calling route
    // was wired.
    function getPool(state) {
        return state.region === 'johto' ? PT.Data.JohtoEliteFour : PT.Data.EliteFour;
    }

    PT.Screens.ELITEFOUR = {
        render(container, state, params) {
            const pool = getPool(state);

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

                // Pre-roll opponents for all trainers in the active pool
                const opponents = pool.map(trainer =>
                    state.rng.pick(trainer.pokemon)
                );

                // Show intro screen
                renderIntro(container, state, opponents, pool);
                return;
            }

            // Battle select screen for current E4 member
            renderBattleSelect(container, state, params, pool);
        }
    };

    function renderIntro(container, state, opponents, pool) {
        const isJohto = state.region === 'johto';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title">${isJohto ? 'THE ELITE FOUR — JOHTO REMATCH' : 'THE ELITE FOUR'}</div>
            <div class="text-box text-center" style="font-size: 8px;">
                You've reached the Indigo Plateau.<br>
                ${pool.length} trainers stand between you and ${isJohto ? 'the Johto capstone' : 'the Hall of Fame'}.<br>
                <strong>Once you enter, there is no turning back.</strong>
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 8px 0;">
                ${pool.map((trainer, i) => `
                    <div style="text-align: center; font-size: 7px; min-width: 55px;">
                        <img src="${PT.Engine.GameState.getSpriteUrl(opponents[i].id, isJohto ? 'johto' : undefined)}"
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
            </div>
        `;
        container.appendChild(div);

        document.getElementById('btn-begin-e4').addEventListener('click', () => {
            PT.App.goto('ELITEFOUR', {
                e4Index: 0,
                opponents: opponents
            });
        });
    }

    function renderBattleSelect(container, state, params, pool) {
        pool = pool || getPool(state);
        const { e4Index, opponents } = params;
        const trainer = pool[e4Index];
        const opponent = opponents[e4Index];
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id, state.region === 'johto' ? 'johto' : undefined);

        // Get opponent types
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [trainer.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        const alive = PT.Engine.GameState.getAliveParty(state);

        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title" style="font-size: 10px;">ELITE FOUR — BATTLE ${e4Index + 1} of ${pool.length}</div>
            <div class="gym-battle-area">
                <div class="gym-battle-sprites">
                    <div class="gym-leader-portrait">
                        <img src="${trainer.spriteUrl}" alt="${trainer.name}"
                             style="width: 56px; height: 56px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-portrait-label">${trainer.name}</div>
                        <div style="font-size: 6px;">${trainer.title}</div>
                        <div style="font-size: 7px; margin-top: 2px;">${trainer.type.toUpperCase()} TYPE</div>
                    </div>
                    <div class="gym-opponent-pokemon">
                        <img src="${opponentSprite}" alt="${opponent.name}"
                             style="width: 80px; height: 80px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${opponent.name}</div>
                        <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                        <div style="font-size: 7px; color: var(--gb-darkest);">★ ELITE POKEMON</div>
                    </div>
                </div>
                <div class="gym-challenge-text" style="font-size: 7px;">${trainer.introText}</div>
            </div>
            <div class="text-box" style="font-size: 7px;">
                ${trainer.name} sends out ${opponent.name}! (${opponentTypes.join('/')}-type)
                <br>Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
                <br><span style="font-size: 6px;">If you lose, your Pokemon takes 4 damage. Battle Stars do NOT protect against E4 kills!</span>
            </div>
            <div class="event-choices" id="e4-choices">
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

        // No leave button — you're committed

        document.querySelectorAll('[data-index]').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const alive = PT.Engine.GameState.getAliveParty(state);
                const chosen = alive[index];
                resolveE4Battle(chosen, trainer, state, container, params, pool);
            });
        });
    }

    function resolveE4Battle(pokemon, trainer, state, container, params, pool) {
        pool = pool || getPool(state);
        const { e4Index, opponents } = params;
        const opponent = opponents[e4Index];
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id, state.region === 'johto' ? 'johto' : undefined);

        // Get opponent types for battle calc
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [trainer.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Calculate success chance — BRUTAL Elite Four. `breakdown` mirrors
        // this math for engine/battle-outcome-ui.js's panel — one row per
        // lever, even at 0, so a trainer can see every term that applies
        // here (and, via `notApplicable` below, the ones that don't).
        let chance = 25; // Base 25% — the elite are ELITE
        let breakdown = [{ label: 'BASE CHANCE', value: 25 }];

        // Progressive difficulty — each fight is harder than the last
        const progressionPenalty = e4Index * 3; // 0%, -3%, -6%, -9%, -12%
        chance -= progressionPenalty;
        breakdown.push({ label: `ROUND ${e4Index + 1} PENALTY`, value: progressionPenalty > 0 ? -progressionPenalty : 0 });

        // Type advantage (smaller bonus than gyms)
        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) {
            chance += 25; // SE matchups are your lifeline
            breakdown.push({ label: 'TYPE MATCHUP (SE)', value: 25 });
        } else if (hasDisadvantage) {
            chance -= 25; // NVE is near-suicide
            breakdown.push({ label: 'TYPE MATCHUP (NVE)', value: -25 });
        } else {
            breakdown.push({ label: 'TYPE MATCHUP', value: 0 });
        }

        // Badge bonus (minimal)
        const badgeCount = state.badges.filter(b => b !== 'champion').length;
        chance += badgeCount * 1;
        breakdown.push({ label: `BADGES (${badgeCount})`, value: badgeCount });

        // Poison ability: scales with power, party-wide (halved in E4, same as
        // Intimidate below — see engine/game-state.js's getAbilityPower)
        const poisonPower = PT.Engine.GameState.getAbilityPower(state, 'poison');
        if (poisonPower > 0) {
            const poisonBonus = Math.max(1, Math.floor(0.5 * poisonPower));
            chance += poisonBonus;
            const poisonN = PT.Engine.GameState.getAbilityContributorCount(state, 'poison');
            breakdown.push({ label: poisonN > 1 ? `POISON (${poisonN} POKEMON)` : 'POISON', value: poisonBonus });
        }

        // Intimidate ability: scales with power (halved in E4)
        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePower > 0) {
            const intimBonus = Math.max(1, Math.floor(1.5 * intimidatePower));
            chance += intimBonus;
            const intimN = PT.Engine.GameState.getAbilityContributorCount(state, 'intimidate');
            breakdown.push({ label: intimN > 1 ? `INTIMIDATE (${intimN} POKEMON)` : 'INTIMIDATE', value: intimBonus });
        }

        // Psychic Dominance (Mewtwo) — reduced in E4 (from +50% to +25%)
        if (PT.Engine.GameState.hasAbility(state, 'psychic_dominance')) {
            chance += 25;
            breakdown.push({ label: 'PSYCHIC DOMINANCE', value: 25 });
        }

        // Battle Stars bonus (halved in E4: +1.5% per star instead of +3%)
        const stars = pokemon.battleStars || 0;
        if (stars > 0) {
            const starWinBonus = Math.floor(stars * 1.5);
            chance += starWinBonus;
            breakdown.push({ label: `BATTLE STARS (${'★'.repeat(stars)})`, value: starWinBonus });
        }

        // Hard ceiling — staggered cap, gets tighter each round
        const capByRound = [55, 54, 53, 51, 50];
        const cap = capByRound[e4Index] || 50;
        const preClampChance = chance;
        chance = Math.max(8, Math.min(cap, chance));
        const maxed = preClampChance !== chance ? (chance === cap ? 'capped' : 'floored') : null;

        // Items that exist elsewhere in the game but have no effect here —
        // surfaced so a trainer doesn't wonder why stacking Muscle Band isn't
        // moving this number, instead of leaving it silently unused.
        const notApplicable = [];
        if ((state.buffs.keyItems.muscleBand || 0) > 0) notApplicable.push('MUSCLE BAND');

        const won = PT.Engine.DebugPanel.resolveOutcome(chance, state.rng);

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';

        if (won) {
            // Victory against this E4 member
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            PT.Engine.GameState.addToLog(state, `Defeated ${trainer.name}'s ${opponent.name} in the Elite Four!`);

            // Try evolution FIRST
            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon, state);
            let evoLine = '';
            if (evoResult.evolved) {
                evoLine = `<br>${evoResult.oldName} evolved into ${evoResult.newName}!`;
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            } else if (evoResult.reason === 'location_limit') {
                evoLine = `<br><span style="font-size: 6px;">(${pokemon.name} already evolved at this location — no further evolution here.)</span>`;
            }

            // Award battle star (evolution win doesn't count)
            const starResult = PT.Engine.GameState.addBattleWin(pokemon, state, evoResult.evolved);

            const isLastBattle = e4Index >= pool.length - 1;

            let rewardRows = rewardRow('STATUS', isLastBattle ? `defeated all ${pool.length}! CHAMPION!` : `next up: ${pool[e4Index + 1].name}`);
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
                    <div style="font-size: 8px; margin-top: 4px;">${pokemon.name} defeated ${trainer.name}'s ${opponent.name}!</div>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${rewardRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                        chance, maxed, rows: breakdown, notApplicable, quote: trainer.defeatText
                    })}
                </div>
                <button class="btn btn-wide" id="btn-e4-next">
                    ${isLastBattle ? 'CONTINUE' : `FACE ${pool[e4Index + 1].name.toUpperCase()}`}
                </button>
            `;
            container.appendChild(div);
            PT.Engine.GameState.saveGame(state);

            document.getElementById('btn-e4-next').addEventListener('click', () => {
                if (isLastBattle) {
                    // Champion!
                    if (!state.badges.includes('champion')) {
                        state.badges.push('champion');
                    }

                    // §9's Johto E4 gauntlet is NOT the same event as Kanto's:
                    // clearing it unlocks the Route 28/Mt. Silver capstone
                    // stretch, it does not end the run. Only the Red capstone
                    // battle (screens/red-capstone-screen.js) may ever set
                    // state.hasWon / route to VICTORY from here on. This
                    // branch must run BEFORE the region==='kanto' branch below
                    // so a Johto win can never fall through to the old
                    // straight-to-Hall-of-Fame behavior.
                    if (state.region === 'johto') {
                        // §9.4: Johto E4 clear money reward — matches Kanto's
                        // ($5000), still bigger than any mid-run Johto gym
                        // reward (up to $3200), sized to matter at the Indigo
                        // Plateau (Johto) restock stop (§9.5) before the
                        // ~100-distance Mt. Silver stretch, without stacking
                        // on top of Kanto's reward to feel excessive.
                        const JOHTO_E4_MONEY_REWARD = 5000;
                        const e4MoneyReward = PT.Engine.GameState.applyPayDay(state, JOHTO_E4_MONEY_REWARD);
                        state.resources.money += e4MoneyReward;
                        state.johtoE4Cleared = true;
                        // Snapshot Johto's completion bonus now, symmetric to
                        // Kanto's below — see calculateJohtoSnapshotBonus in
                        // engine/scoring.js.
                        state.johtoScoreSnapshot = PT.Engine.Scoring.calculateJohtoSnapshotBonus(state);
                        // Champion snapshot (§ champions leaderboard/records) —
                        // symmetric to state.kantoChampionIds below: a Johto
                        // E4 clear earns champion credit for the party as it
                        // stands right now, even if Red is never reached or
                        // the run is lost on Mt. Silver afterward.
                        state.johtoChampionIds = PT.Engine.Scoring.getChampionIdsFromParty(state.party);
                        PT.Engine.GameState.addToLog(state, `Defeated the Johto Elite Four rematch! Earned $${e4MoneyReward} to restock before Mt. Silver.`);

                        // Telemetry (§13.3) — funnel: what fraction of Johto
                        // entrants reach the second E4?
                        PT.Engine.Telemetry.logEvent('johto_elite_four_cleared', {
                            party_size: state.party.length,
                            party_ids: state.party.map(p => p.id),
                            badge_count: state.badges.filter(b => b !== 'champion').length,
                            days_elapsed: state.daysElapsed,
                            days_elapsed_johto: (typeof state.daysElapsedAtJohtoEntry === 'number')
                                ? Math.max(0, state.daysElapsed - state.daysElapsedAtJohtoEntry)
                                : null
                        });
                        PT.Engine.GameState.saveGame(state);
                        // Back to normal travel — the player walks on to
                        // Route 28/Mt. Silver and the Red capstone battle,
                        // not straight to Victory.
                        PT.App.goto('TRAVEL');
                        return;
                    }

                    const e4MoneyReward = PT.Engine.GameState.applyPayDay(state, 5000);
                    state.resources.money += e4MoneyReward;
                    PT.Engine.GameState.addToLog(state, 'Became the Pokemon Champion!');

                    // Post-victory hook (§6): the first Kanto E4 clear doesn't
                    // end the run — it offers Johto. Record the region as
                    // cleared and let the player choose whether to continue.
                    if (state.region === 'kanto' && !state.completedRegions.includes('kanto')) {
                        state.completedRegions.push('kanto');
                        // Snapshot Kanto's completion bonus now, at the exact
                        // moment of clearing it — see calculateKantoSnapshotBonus
                        // in engine/scoring.js for why this can't just be
                        // recomputed from final state later.
                        state.kantoScoreSnapshot = PT.Engine.Scoring.calculateKantoSnapshotBonus(state);
                        // Champion snapshot (§ champions leaderboard/records) —
                        // the party as it stands right now, before it's
                        // touched by anything in Johto, so a Kanto-clearing
                        // run still gets champion credit even without beating
                        // Red (see screens/gameover-screen.js).
                        state.kantoChampionIds = PT.Engine.Scoring.getChampionIdsFromParty(state.party);
                        PT.Engine.GameState.saveGame(state);
                        PT.App.goto('POSTVICTORY');
                        return;
                    }

                    state.hasWon = true;
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
            // Loss — the fighting Pokemon takes 4 HP damage
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();

            // E4 damage bypasses Battle Star death avoidance
            const E4_LOSS_DAMAGE = 4;
            const oldHp = pokemon.hp;
            pokemon.hp = Math.max(0, pokemon.hp - E4_LOSS_DAMAGE);
            const killed = pokemon.hp <= 0;

            if (killed) {
                // Mark fainted first — getAliveParty() (which drives the next
                // battle's Pokemon picker) filters on this, not array membership,
                // so this must be set regardless of whether the splice below finds it.
                pokemon.status = 'fainted';
                if (!state.graveyard) state.graveyard = [];
                const route = PT.Engine.GameState.getCurrentRoute(state);
                state.graveyard.push({
                    name: pokemon.name, id: pokemon.id, spriteUrl: pokemon.spriteUrl,
                    battleStars: pokemon.battleStars || 0,
                    location: route ? route.name : 'Unknown', day: state.daysElapsed
                });
                const idx = state.party.indexOf(pokemon);
                if (idx !== -1) {
                    state.party.splice(idx, 1);
                    state.pokemonLost++;
                }
            }

            const dmgMsg = killed
                ? `${pokemon.name} was killed by ${trainer.name}'s ${opponent.name}!`
                : `${pokemon.name} took ${E4_LOSS_DAMAGE} damage from ${trainer.name}'s ${opponent.name}! (${pokemon.hp}/${pokemon.maxHp} HP)`;
            PT.Engine.GameState.addToLog(state, dmgMsg);

            const aliveAfter = PT.Engine.GameState.getAliveParty(state);
            const partyWiped = aliveAfter.length === 0;

            // Elite Four damage bypasses ALL held-item/ability death-avoidance
            // (Battle Stars, Focus Band, Safeguard, System Restore) — it's a
            // direct HP subtraction, not the shared damagePokemon() every
            // other loss goes through. Only call out items the player
            // actually owns, so this doesn't clutter a fight where it's moot.
            const lossNotApplicable = [];
            if ((state.buffs.keyItems.focusBand || 0) > 0) lossNotApplicable.push('FOCUS BAND');

            let lossRows = rewardRow('RESULT', killed ? `${pokemon.name} was killed` : `${pokemon.name} took ${E4_LOSS_DAMAGE} damage`);
            lossRows += rewardRow('BATTLE STARS', 'ignored on Elite Four kills');
            lossRows += rewardRow('STATUS', partyWiped ? 'all Pokemon have fallen' : `must defeat ${opponent.name} to advance`);

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
                    <div class="gym-leader-name">${trainer.name} wins</div>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${lossRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                        chance, maxed, rows: breakdown, notApplicable: notApplicable.concat(lossNotApplicable), quote: null
                    })}
                </div>
                <button class="btn btn-wide" id="btn-e4-continue">
                    ${partyWiped ? 'GAME OVER' : 'CHOOSE ANOTHER POKEMON'}
                </button>
            `;
            container.appendChild(div);
            PT.Engine.GameState.saveGame(state);

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

// Porygon Trail - Gym Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Johto gyms (§9, revised): a full 3-on-3 gauntlet like the Elite Four,
    // not a single random pick from the leader's roster — beat all three
    // Pokemon back-to-back, in roster order (ace last), to earn the badge.
    // Losing any single battle ends the attempt; the player must walk back
    // in and restart the gauntlet from the first Pokemon. Kanto gyms are
    // untouched below this check.
    function isJohtoLeader(leaderId) {
        return PT.Data.GymOrder.indexOf(leaderId) >= 8;
    }

    PT.Screens.GYM = {
        render(container, state, params) {
            const leaderId = params.gymLeader;
            const leader = PT.Data.GymLeaders[leaderId];
            if (!leader) { PT.App.goto('TRAVEL'); return; }

            if (isJohtoLeader(leaderId)) {
                if (params.gymRound === undefined) {
                    renderGauntletIntro(container, state, leader, leaderId);
                } else {
                    renderGauntletBattleSelect(container, state, leader, leaderId, params.gymRound);
                }
                return;
            }

            // Lock in opponent on first visit — prevents leaving and re-rolling
            if (!state._gymLockedOpponent || state._gymLockedOpponent.leaderId !== leaderId) {
                state._gymLockedOpponent = {
                    leaderId: leaderId,
                    opponent: state.rng.pick(leader.pokemon)
                };
            }
            const opponent = state._gymLockedOpponent.opponent;
            const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);
            const isAce = !!opponent.ace;

            // Look up opponent Pokemon's actual types
            const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
            const opponentTypes = opponentData ? opponentData.types : [leader.type];

            // Build type effectiveness lookup based on opponent's types
            const typeChart = getTypeWeaknesses(opponentTypes);

            // Loss damage preview — same formula resolveGymBattle uses on an
            // actual loss (Sabrina-onward gyms hit harder, aces hit hardest),
            // computed here too so the player can see the cost before picking.
            const previewGymIndex = PT.Data.GymOrder.indexOf(leaderId);
            const previewIsLateGym = previewGymIndex >= 4;
            const previewBaseDamage = previewIsLateGym ? 3 : 2;
            const lossDamage = isAce ? previewBaseDamage + 1 : previewBaseDamage;

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
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 80px; height: 80px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'; this.parentElement.querySelector('.gym-opponent-name').style.marginTop='40px';">
                            <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${opponent.name}</div>
                            <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                            ${isAce ? '<div style="font-size: 7px; color: var(--gb-darkest);">★ ACE POKEMON</div>' : ''}
                        </div>
                    </div>
                    <div class="gym-challenge-text">${leader.name} sends out ${opponent.name}!</div>
                </div>
                <div class="text-box" style="font-size: 7px;">
                    Choose your Pokemon! ${opponent.name} is ${opponentTypes.join('/')}-type.
                    <br>Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
                    <br><span style="font-size: 6px;">If you lose, your Pokemon takes ${lossDamage} damage.</span>
                </div>
                <div class="event-choices" id="gym-choices">
                    ${PT.Engine.GameState.getAliveParty(state).map((p, i) => {
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

            // Pokemon selection
            document.querySelectorAll('[data-index]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index);
                    const alive = PT.Engine.GameState.getAliveParty(state);
                    const chosen = alive[index];
                    resolveGymBattle(chosen, leader, leaderId, state, container, opponent);
                });
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

        // Remove types that appear in both (dual-type cancellation)
        return {
            weakTo: [...weakTo].filter(t => !strongTo.has(t)),
            strongTo: [...strongTo].filter(t => !weakTo.has(t))
        };
    }

    // One row of the rewards/outcome list (money, badge, evolution, battle
    // star, ...) — same visual language as engine/battle-outcome-ui.js's
    // win-chance breakdown rows (.battle-breakdown-row), just for non-%
    // values. Kept local rather than folded into that module since the
    // shape of "what happened" differs too much per context (gym has a
    // badge, wild/event don't, ...) to be worth a shared function for.
    function rewardRow(label, value) {
        return `
            <div class="battle-breakdown-row">
                <span class="battle-breakdown-label">${label}</span>
                <span class="battle-breakdown-value">${value}</span>
            </div>`;
    }

    function resolveGymBattle(pokemon, leader, leaderId, state, container, opponent) {
        // Clear locked opponent now that battle is committed
        delete state._gymLockedOpponent;

        const isAce = !!opponent.ace;
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id);

        // Look up opponent Pokemon's actual types for battle calc
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [leader.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Calculate success chance. `breakdown` mirrors the math below one
        // row per lever, feeding engine/battle-outcome-ui.js's panel — every
        // term that touches `chance` gets a row, including when it's 0, so a
        // trainer can see e.g. "TYPE MATCHUP +0%" and know that lever just
        // didn't apply this fight rather than wondering if it was skipped.
        let chance = 45;
        let breakdown = [{ label: 'BASE CHANCE', value: 45 }];

        // Type advantage based on opponent Pokemon's types
        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) {
            chance += 20;
            breakdown.push({ label: 'TYPE MATCHUP (SE)', value: 20 });
        } else if (hasDisadvantage) {
            chance -= 20;
            breakdown.push({ label: 'TYPE MATCHUP (NVE)', value: -20 });
        } else {
            breakdown.push({ label: 'TYPE MATCHUP', value: 0 });
        }

        // Win Rate buff (Muscle Band stacks)
        const winRateBonus = PT.Engine.GameState.getWinRateBonus(state);
        if (winRateBonus > 0) {
            chance += winRateBonus;
            breakdown.push({ label: 'MUSCLE BAND', value: winRateBonus });
        }

        // Party size bonus
        const aliveCount = PT.Engine.GameState.getAliveParty(state).length;
        const partySizeBonus = aliveCount * 2;
        chance += partySizeBonus;
        breakdown.push({ label: 'PARTY SIZE', value: partySizeBonus });

        // Poison ability: scales with power (party-wide, same as Intimidate)
        const poisonPower = PT.Engine.GameState.getAbilityPower(state, 'poison');
        if (poisonPower > 0) {
            const poisonBonus = Math.floor(1 * poisonPower);
            chance += poisonBonus;
            const poisonN = PT.Engine.GameState.getAbilityContributorCount(state, 'poison');
            breakdown.push({ label: poisonN > 1 ? `POISON (${poisonN} POKEMON)` : 'POISON', value: poisonBonus });
        }

        // Intimidate ability: scales with power
        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePower > 0) {
            const intimBonus = Math.floor(3 * intimidatePower);
            chance += intimBonus;
            const intimN = PT.Engine.GameState.getAbilityContributorCount(state, 'intimidate');
            breakdown.push({ label: intimN > 1 ? `INTIMIDATE (${intimN} POKEMON)` : 'INTIMIDATE', value: intimBonus });
        }

        // Psychic Dominance (Mewtwo) — +50% win chance on all battles
        if (PT.Engine.GameState.hasAbility(state, 'psychic_dominance')) {
            chance += 50;
            breakdown.push({ label: 'PSYCHIC DOMINANCE', value: 50 });
        }

        // Battle Stars bonus
        const starBonus = PT.Engine.GameState.getStarBonus(pokemon);
        if (starBonus.winChanceBonus > 0) {
            chance += starBonus.winChanceBonus;
            breakdown.push({ label: `BATTLE STARS (${'★'.repeat(pokemon.battleStars || 0)})`, value: starBonus.winChanceBonus });
        }

        // Gym progressive scaling — later gyms expect battle-hardened Pokemon
        // Scales from 0 (1st gym) to -9% (8th gym, Giovanni), matching max 3-star bonus
        const badgeCount = state.badges.filter(b => b !== 'champion').length;
        const gymScaling = Math.floor((badgeCount / 7) * 9); // 0,1,2,3,5,6,7,9
        if (gymScaling > 0) chance -= gymScaling;
        breakdown.push({ label: `GYM PROGRESSION (${badgeCount} BADGES)`, value: gymScaling > 0 ? -gymScaling : 0 });

        // Clamp
        const preClampChance = chance;
        chance = Math.max(10, Math.min(80, chance));
        const maxed = preClampChance !== chance ? (chance === 80 ? 'capped' : 'floored') : null;

        const won = state.rng.chance(chance);
        let gymMoneyReward = 0;

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';

        if (won) {
            state.badges.push(leader.badge);
            state.gymBattlesWon++;
            gymMoneyReward = PT.Engine.GameState.applyPayDay(state, leader.reward.money);
            state.resources.money += gymMoneyReward;

            PT.Engine.GameState.addToLog(state, `Defeated ${leader.name}'s ${opponent.name}! Got ${leader.badge}!`);
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            // Telemetry (§13.3) — Johto gym difficulty/pass-rate curve.
            if (state.region === 'johto') {
                PT.Engine.Telemetry.logEvent('johto_gym_cleared', {
                    leader_id: leaderId,
                    badge: leader.badge,
                    pokemon_id: pokemon.id,
                    win_chance: chance,
                    party_size: state.party.length,
                    badge_count: state.badges.filter(b => b !== 'champion').length,
                    days_elapsed: state.daysElapsed
                });
            }

            // Try to evolve FIRST
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
            let rewardRows = rewardRow('BADGE EARNED', leader.badge);
            rewardRows += rewardRow('MONEY', `+$${gymMoneyReward}${gymMoneyReward > leader.reward.money ? ' (BONUS)' : ''}`);
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
                    <div style="font-size: 8px; margin-top: 4px;">${pokemon.name} defeated ${leader.name}'s ${opponent.name}!</div>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${rewardRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                        chance, maxed, rows: breakdown, notApplicable: [], quote: leader.victoryText
                    })}
                </div>
                <button class="btn btn-wide" id="btn-continue">CONTINUE</button>
            `;
        } else {
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();

            // Ace Pokemon: 60% death chance, non-ace: 30%
            const deathChance = isAce ? 60 : 30;
            // Loss damage steps up for the back-half gyms (Sabrina onward, by
            // route-encounter order) — ace Pokemon always hit for the top of
            // that tier's range.
            const gymIndex = PT.Data.GymOrder.indexOf(leaderId);
            const isLateGym = gymIndex >= 4;
            const baseDamage = isLateGym ? 3 : 2;
            const damage = isAce ? baseDamage + 1 : baseDamage;

            let gymKilled = false;
            let gymFainted = false;
            let focusBandSaved = false;
            if (state.rng.chance(deathChance)) {
                // Focus Band gets a chance to intercept the instant-kill roll
                // itself — this is the one death vector Battle Stars don't
                // reach ("Ace Pokemon ignore Battle Star protection" below).
                const focusBandChance = PT.Engine.GameState.getFocusBandBonus(state);
                if (focusBandChance > 0 && state.rng.chance(focusBandChance)) {
                    focusBandSaved = true;
                    gymFainted = PT.Engine.GameState.damagePokemon(pokemon, damage, state);
                } else {
                    // Mark fainted first — getAliveParty() filters on this, not array
                    // membership, so this must be set regardless of the splice below.
                    pokemon.status = 'fainted';
                    const idx = state.party.indexOf(pokemon);
                    if (idx !== -1) {
                        if (!state.graveyard) state.graveyard = [];
                        const route = PT.Engine.GameState.getCurrentRoute(state);
                        state.graveyard.push({
                            name: pokemon.name, id: pokemon.id, spriteUrl: pokemon.spriteUrl,
                            battleStars: pokemon.battleStars || 0,
                            location: route ? route.name : 'Unknown', day: state.daysElapsed
                        });
                        state.party.splice(idx, 1);
                        state.pokemonLost++;
                        gymKilled = true;
                    }
                }
            } else {
                gymFainted = PT.Engine.GameState.damagePokemon(pokemon, damage, state);
            }

            const died = gymKilled || gymFainted;
            if (died) {
                PT.Engine.GameState.addToLog(state, `Lost to ${leader.name}'s ${opponent.name}. ${pokemon.name} was killed!`);
            } else {
                PT.Engine.GameState.addToLog(state, `Lost to ${leader.name}'s ${opponent.name}. ${pokemon.name} was badly hurt.`);
            }

            let lossRows = rewardRow('RESULT', died ? `${pokemon.name} was killed` : `${pokemon.name} took ${damage} damage`);
            if (focusBandSaved) lossRows += rewardRow('FOCUS BAND', `${pokemon.name} held on!`);
            if (isAce) lossRows += rewardRow('ACE POKEMON', 'ignores Battle Star protection');
            if (!died) lossRows += rewardRow('NEXT STEPS', 'try again next visit');

            div.innerHTML = `
                <div class="event-title">DEFEAT...</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites" style="justify-content: center;">
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 64px; height: 64px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'">
                            <div style="font-size: 8px; font-weight: bold;">${opponent.name}${isAce ? ' ★' : ''}</div>
                        </div>
                    </div>
                    <div class="gym-leader-name">${leader.name} wins</div>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${lossRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                        chance, maxed, rows: breakdown, notApplicable: [], quote: leader.defeatText
                    })}
                </div>
                <button class="btn btn-wide" id="btn-continue">CONTINUE</button>
            `;
        }
        container.appendChild(div);
        PT.Engine.GameState.saveGame(state);

        document.getElementById('btn-continue').addEventListener('click', () => {
            if (state.isGameOver || state.party.length === 0) {
                state.isGameOver = true;
                if (!state.gameOverReason) state.gameOverReason = 'party_wiped';
                PT.App.goto('GAMEOVER');
            } else if (won) {
                PT.App.goto('GYM_REWARD', { leaderId, moneyReward: gymMoneyReward });
            } else {
                PT.App.goto('TRAVEL');
            }
        });
    }

    // ===== Johto gauntlet (3-on-3, back-to-back) =====

    function renderGauntletIntro(container, state, leader, leaderId) {
        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title">${leader.name}'s GYM</div>
            <div class="text-box text-center" style="font-size: 8px;">
                ${leader.name} battles the full team — beat all three Pokemon
                back-to-back to earn the ${leader.badge}.
                <br><strong>A loss costs you that Pokemon, but the gauntlet continues — you'll need alive Pokemon left to keep going.</strong>
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 8px 0;">
                ${leader.pokemon.map(mon => `
                    <div style="text-align: center; font-size: 7px; min-width: 55px;">
                        <img src="${PT.Engine.GameState.getSpriteUrl(mon.id, 'johto')}" alt="${mon.name}"
                             style="width: 40px; height: 40px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div style="font-weight: bold;">${mon.name}${mon.ace ? ' ★' : ''}</div>
                    </div>
                `).join('')}
            </div>
            <div class="text-box text-center" style="font-size: 7px;">
                Your party: ${state.party.map(p => p.name).join(', ')}<br>
                ${state.party.length} Pokemon ready for battle.
            </div>
            <button class="btn btn-wide" id="btn-begin-gauntlet">BEGIN THE GAUNTLET</button>
        `;
        container.appendChild(div);

        document.getElementById('btn-begin-gauntlet').addEventListener('click', () => {
            PT.App.goto('GYM', { gymLeader: leaderId, gymRound: 0 });
        });
    }

    function renderGauntletBattleSelect(container, state, leader, leaderId, round) {
        const opponent = leader.pokemon[round];
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id, 'johto');
        const isAce = !!opponent.ace;

        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [leader.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Loss damage preview — same formula the loss branch below uses.
        const previewGymIndex = PT.Data.GymOrder.indexOf(leaderId);
        const previewIsLateGym = previewGymIndex >= 4;
        const previewBaseDamage = previewIsLateGym ? 3 : 2;
        const lossDamage = isAce ? previewBaseDamage + 1 : previewBaseDamage;

        const div = document.createElement('div');
        div.className = 'screen gym-screen';
        div.innerHTML = `
            <div class="event-title" style="font-size: 10px;">${leader.name.toUpperCase()} — POKEMON ${round + 1} of ${leader.pokemon.length}</div>
            <div class="gym-battle-area">
                <div class="gym-battle-sprites">
                    <div class="gym-leader-portrait">
                        <img src="${leader.spriteUrl}" alt="${leader.name}"
                             style="width: 56px; height: 56px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-portrait-label">${leader.name}</div>
                        <div style="font-size: 6px;">${leader.title}</div>
                    </div>
                    <div class="gym-opponent-pokemon">
                        <img src="${opponentSprite}" alt="${opponent.name}"
                             style="width: 80px; height: 80px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${opponent.name}</div>
                        <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                        ${isAce ? '<div style="font-size: 7px; color: var(--gb-darkest);">★ ACE POKEMON</div>' : ''}
                    </div>
                </div>
                <div class="gym-challenge-text">${leader.name} sends out ${opponent.name}!</div>
            </div>
            <div class="text-box" style="font-size: 7px;">
                Choose your Pokemon! ${opponent.name} is ${opponentTypes.join('/')}-type.
                <br>Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
                <br><span style="font-size: 6px;">If you lose, your Pokemon takes ${lossDamage} damage.</span>
                ${round > 0 ? `<br><span style="font-size: 6px;">Defeated so far: ${round}/${leader.pokemon.length}</span>` : ''}
            </div>
            <div class="event-choices" id="gym-choices">
                ${PT.Engine.GameState.getAliveParty(state).map((p, i) => {
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
                resolveGauntletBattle(chosen, leader, leaderId, state, container, opponent, round);
            });
        });
    }

    function resolveGauntletBattle(pokemon, leader, leaderId, state, container, opponent, round) {
        const isAce = !!opponent.ace;
        // Johto gym rosters mix in Kanto-origin species (Clefairy, Magneton,
        // Dragonite, ...) — always render them with Crystal art here so the
        // whole gauntlet reads as Johto, not just the Gen II-only members.
        const opponentSprite = PT.Engine.GameState.getSpriteUrl(opponent.id, 'johto');
        const opponentData = PT.Data.Pokemon.find(p => p.id === opponent.id);
        const opponentTypes = opponentData ? opponentData.types : [leader.type];
        const typeChart = getTypeWeaknesses(opponentTypes);

        // Same win-chance formula as the Kanto single-battle path — the
        // difficulty jump comes from needing to clear three of these in a
        // row, not from a harsher per-battle formula.
        let chance = 45;
        let breakdown = [{ label: 'BASE CHANCE', value: 45 }];
        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) {
            chance += 20;
            breakdown.push({ label: 'TYPE MATCHUP (SE)', value: 20 });
        } else if (hasDisadvantage) {
            chance -= 20;
            breakdown.push({ label: 'TYPE MATCHUP (NVE)', value: -20 });
        } else {
            breakdown.push({ label: 'TYPE MATCHUP', value: 0 });
        }
        const winRateBonus = PT.Engine.GameState.getWinRateBonus(state);
        if (winRateBonus > 0) { chance += winRateBonus; breakdown.push({ label: 'MUSCLE BAND', value: winRateBonus }); }
        const aliveCount = PT.Engine.GameState.getAliveParty(state).length;
        const partySizeBonus = aliveCount * 2;
        chance += partySizeBonus;
        breakdown.push({ label: 'PARTY SIZE', value: partySizeBonus });
        const poisonPower = PT.Engine.GameState.getAbilityPower(state, 'poison');
        if (poisonPower > 0) {
            const poisonBonus = Math.floor(1 * poisonPower);
            chance += poisonBonus;
            const poisonN = PT.Engine.GameState.getAbilityContributorCount(state, 'poison');
            breakdown.push({ label: poisonN > 1 ? `POISON (${poisonN} POKEMON)` : 'POISON', value: poisonBonus });
        }
        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePower > 0) {
            const intimBonus = Math.floor(3 * intimidatePower);
            chance += intimBonus;
            const intimN = PT.Engine.GameState.getAbilityContributorCount(state, 'intimidate');
            breakdown.push({ label: intimN > 1 ? `INTIMIDATE (${intimN} POKEMON)` : 'INTIMIDATE', value: intimBonus });
        }
        if (PT.Engine.GameState.hasAbility(state, 'psychic_dominance')) { chance += 50; breakdown.push({ label: 'PSYCHIC DOMINANCE', value: 50 }); }
        const starBonus = PT.Engine.GameState.getStarBonus(pokemon);
        if (starBonus.winChanceBonus > 0) {
            chance += starBonus.winChanceBonus;
            breakdown.push({ label: `BATTLE STARS (${'★'.repeat(pokemon.battleStars || 0)})`, value: starBonus.winChanceBonus });
        }
        const badgeCount = state.badges.filter(b => b !== 'champion').length;
        const gymScaling = Math.floor((badgeCount / 7) * 9);
        if (gymScaling > 0) chance -= gymScaling;
        breakdown.push({ label: `GYM PROGRESSION (${badgeCount} BADGES)`, value: gymScaling > 0 ? -gymScaling : 0 });
        const preClampChance = chance;
        chance = Math.max(10, Math.min(80, chance));
        const maxed = preClampChance !== chance ? (chance === 80 ? 'capped' : 'floored') : null;

        const won = state.rng.chance(chance);
        const isLastRound = round >= leader.pokemon.length - 1;

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen gym-screen';

        if (won) {
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();
            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon, state);
            let evoLine = '';
            if (evoResult.evolved) {
                evoLine = `<br>${evoResult.oldName} evolved into ${evoResult.newName}!`;
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            } else if (evoResult.reason === 'location_limit') {
                evoLine = `<br><span style="font-size: 6px;">(${pokemon.name} already evolved at this location — no further evolution here.)</span>`;
            }
            const starResult = PT.Engine.GameState.addBattleWin(pokemon, state, evoResult.evolved);

            let gymMoneyReward = 0;
            if (isLastRound) {
                state.badges.push(leader.badge);
                state.gymBattlesWon++;
                gymMoneyReward = PT.Engine.GameState.applyPayDay(state, leader.reward.money);
                state.resources.money += gymMoneyReward;
                PT.Engine.GameState.addToLog(state, `Swept ${leader.name}'s gym! Got ${leader.badge}!`);
                PT.Engine.Telemetry.logEvent('johto_gym_cleared', {
                    leader_id: leaderId, badge: leader.badge, pokemon_id: pokemon.id,
                    win_chance: chance, party_size: state.party.length,
                    badge_count: state.badges.filter(b => b !== 'champion').length,
                    days_elapsed: state.daysElapsed
                });
            } else {
                PT.Engine.GameState.addToLog(state, `Defeated ${leader.name}'s ${opponent.name}! (${round + 1}/${leader.pokemon.length})`);
            }

            let rewardRows = isLastRound
                ? rewardRow('BADGE EARNED', leader.badge) + rewardRow('MONEY', `+$${gymMoneyReward}${gymMoneyReward > leader.reward.money ? ' (BONUS)' : ''}`)
                : rewardRow('POKEMON LEFT', `${leader.pokemon.length - round - 1}`);
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
                <div class="event-title">${isLastRound ? 'VICTORY!' : 'ONE DOWN!'}</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites" style="justify-content: center;">
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${opponent.name}"
                                 style="width: 64px; height: 64px; image-rendering: pixelated; opacity: 0.4;"
                                 onerror="this.style.display='none'">
                            <div style="font-size: 8px; text-decoration: line-through;">${opponent.name}</div>
                        </div>
                    </div>
                    ${isLastRound ? `<div class="gym-leader-name"><span class="badge-earned">${leader.badge}</span></div>` : ''}
                    <div style="font-size: 8px; margin-top: 4px;">${pokemon.name} defeated ${leader.name}'s ${opponent.name}!</div>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${rewardRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                        chance, maxed, rows: breakdown, notApplicable: [], quote: isLastRound ? leader.victoryText : null
                    })}
                </div>
                <button class="btn btn-wide" id="btn-gauntlet-continue">${isLastRound ? 'CONTINUE' : `FACE ${leader.pokemon[round + 1].name.toUpperCase()}`}</button>
            `;
            container.appendChild(div);
            PT.Engine.GameState.saveGame(state);

            document.getElementById('btn-gauntlet-continue').addEventListener('click', () => {
                if (isLastRound) {
                    PT.App.goto('GYM_REWARD', { leaderId, moneyReward: gymMoneyReward });
                } else {
                    PT.App.goto('GYM', { gymLeader: leaderId, gymRound: round + 1 });
                }
            });
            return;
        }

        // Loss — same death/damage mechanic as Kanto's single battle. Unlike
        // the old reset-to-round-0 behavior, this mirrors the Elite Four:
        // losing doesn't end the attempt, it just costs a Pokemon and lets
        // the player send in another against this SAME opponent. Only a full
        // party wipe ends the gauntlet (and the run).
        if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();
        // Johto gauntlet ace death chance was matched to Kanto's single-battle
        // 60% — but every Johto gym mon is now an ace (every mon is ace across
        // both regions), and stacked across a 3-on-3 gauntlet that compounds
        // into near-guaranteed deaths. Dialed back to 45% for Johto only —
        // still meant to hurt, not a near-certain kill. Kanto's single-battle
        // ace rate (line ~295, resolveGymBattle) is untouched.
        const deathChance = isAce ? 45 : 30;
        const gymIndex = PT.Data.GymOrder.indexOf(leaderId);
        const isLateGym = gymIndex >= 4;
        const baseDamage = isLateGym ? 3 : 2;
        const damage = isAce ? baseDamage + 1 : baseDamage;

        let gymKilled = false;
        let gymFainted = false;
        let focusBandSaved = false;
        if (state.rng.chance(deathChance)) {
            const focusBandChance = PT.Engine.GameState.getFocusBandBonus(state);
            if (focusBandChance > 0 && state.rng.chance(focusBandChance)) {
                focusBandSaved = true;
                gymFainted = PT.Engine.GameState.damagePokemon(pokemon, damage, state);
            } else {
                pokemon.status = 'fainted';
                const idx = state.party.indexOf(pokemon);
                if (idx !== -1) {
                    if (!state.graveyard) state.graveyard = [];
                    const route = PT.Engine.GameState.getCurrentRoute(state);
                    state.graveyard.push({
                        name: pokemon.name, id: pokemon.id, spriteUrl: pokemon.spriteUrl,
                        battleStars: pokemon.battleStars || 0,
                        location: route ? route.name : 'Unknown', day: state.daysElapsed
                    });
                    state.party.splice(idx, 1);
                    state.pokemonLost++;
                    gymKilled = true;
                }
            }
        } else {
            gymFainted = PT.Engine.GameState.damagePokemon(pokemon, damage, state);
        }

        const died = gymKilled || gymFainted;
        if (died) {
            PT.Engine.GameState.addToLog(state, `Lost to ${leader.name}'s ${opponent.name}. ${pokemon.name} was killed!`);
        } else {
            PT.Engine.GameState.addToLog(state, `Lost to ${leader.name}'s ${opponent.name}. ${pokemon.name} was badly hurt.`);
        }

        const aliveAfter = PT.Engine.GameState.getAliveParty(state);
        const partyWiped = aliveAfter.length === 0;

        let lossRows = rewardRow('RESULT', died ? `${pokemon.name} was killed` : `${pokemon.name} took ${damage} damage`);
        if (focusBandSaved) lossRows += rewardRow('FOCUS BAND', `${pokemon.name} held on!`);
        if (isAce) lossRows += rewardRow('ACE POKEMON', 'ignores Battle Star protection');
        lossRows += rewardRow('STATUS', partyWiped ? 'all Pokemon have fallen' : `must defeat ${opponent.name} to advance`);

        div.innerHTML = `
            <div class="event-title">DEFEAT...</div>
            <div class="gym-battle-area">
                <div class="gym-battle-sprites" style="justify-content: center;">
                    <div class="gym-opponent-pokemon">
                        <img src="${opponentSprite}" alt="${opponent.name}"
                             style="width: 64px; height: 64px; image-rendering: pixelated;"
                             onerror="this.style.display='none'">
                        <div style="font-size: 8px; font-weight: bold;">${opponent.name}${isAce ? ' ★' : ''}</div>
                    </div>
                </div>
                <div class="gym-leader-name">${leader.name} wins</div>
                <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${lossRows}</div>
                ${PT.Engine.BattleOutcomeUI.renderBreakdown({
                    chance, maxed, rows: breakdown, notApplicable: [], quote: leader.defeatText
                })}
            </div>
            <button class="btn btn-wide" id="btn-gauntlet-continue">${partyWiped ? 'GAME OVER' : 'CHOOSE ANOTHER POKEMON'}</button>
        `;
        container.appendChild(div);
        PT.Engine.GameState.saveGame(state);

        document.getElementById('btn-gauntlet-continue').addEventListener('click', () => {
            if (partyWiped) {
                state.isGameOver = true;
                if (!state.gameOverReason) state.gameOverReason = 'party_wiped';
                PT.App.goto('GAMEOVER');
            } else {
                // Same opponent, same round — pick another alive Pokemon.
                PT.App.goto('GYM', { gymLeader: leaderId, gymRound: round });
            }
        });
    }
})();

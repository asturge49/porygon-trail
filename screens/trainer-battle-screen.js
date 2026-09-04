// Porygon Trail - Trainer Battle Screen (difficulty levels 2+)
//
// Pushed from travel-screen.js when a day's `results.trainerBattle` is
// non-null (independent of, and may coexist with, `results.encounter` /
// `results.event`). Unlike narrative event battles (event-screen.js's
// showEventBattlePicker), a trainer battle is not optional — there's no
// decline/walk-away choice, so this screen goes straight into the VS
// picker. Modeled directly on showEventBattlePicker's structure/CSS
// rather than inventing new UI (per the plan).
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Same flat type-weakness lookup event-screen.js's showEventBattlePicker
    // uses (duplicated per this codebase's "small helpers stay independent"
    // convention — see red-capstone-screen.js's own copy/comment on this).
    const WEAKNESSES = {
        normal: { weakTo: ['fighting'] }, fire: { weakTo: ['water', 'ground', 'rock'] },
        water: { weakTo: ['electric', 'grass'] }, electric: { weakTo: ['ground'] },
        grass: { weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'] },
        ice: { weakTo: ['fire', 'fighting', 'rock'] }, fighting: { weakTo: ['flying', 'psychic'] },
        poison: { weakTo: ['ground', 'psychic'] }, ground: { weakTo: ['water', 'grass', 'ice'] },
        flying: { weakTo: ['electric', 'ice', 'rock'] }, psychic: { weakTo: ['bug'] },
        bug: { weakTo: ['fire', 'flying', 'rock'] },
        rock: { weakTo: ['water', 'grass', 'fighting', 'ground'] },
        ghost: { weakTo: ['ghost'] }, dragon: { weakTo: ['ice', 'dragon'] },
        bird: { weakTo: ['electric', 'ice', 'rock'] }
    };

    function rewardRow(label, value) {
        return `
            <div class="battle-breakdown-row">
                <span class="battle-breakdown-label">${label}</span>
                <span class="battle-breakdown-value">${value}</span>
            </div>`;
    }

    PT.Screens.TRAINER_BATTLE = {
        render(container, state, params) {
            const battle = params;
            if (!battle || !battle.pokemon) { PT.App.goto('TRAVEL'); return; }

            const opponentData = PT.Data.Pokemon.find(p => p.id === battle.pokemon.id);
            const opponentTypes = opponentData ? opponentData.types : ['normal'];
            const opponentSprite = PT.Engine.GameState.getSpriteUrl(battle.pokemon.id, battle.region === 'johto' ? 'johto' : 'kanto');
            const trainerSprite = `assets/trainers/${battle.spriteKey}.png`;

            const weakTo = new Set();
            opponentTypes.forEach(t => { if (WEAKNESSES[t]) WEAKNESSES[t].weakTo.forEach(w => weakTo.add(w)); });

            const alive = PT.Engine.GameState.getAliveParty(state);

            const div = document.createElement('div');
            div.className = 'screen event-screen';
            div.innerHTML = `
                <div class="event-title">TRAINER BATTLE</div>
                <div class="gym-battle-area">
                    <div class="gym-battle-sprites">
                        <div class="gym-leader-portrait">
                            <img src="${trainerSprite}" alt="${battle.trainerName}"
                                 style="width: 80px; height: 80px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'">
                            <div class="gym-portrait-label">${battle.trainerName}</div>
                            <div style="font-size: 6px;">${(battle.trainerClassId || '').toString().replace(/_/g, ' ').toUpperCase()}</div>
                        </div>
                        <div class="gym-opponent-pokemon">
                            <img src="${opponentSprite}" alt="${battle.pokemon.name}"
                                 style="width: 80px; height: 80px; image-rendering: pixelated;"
                                 onerror="this.style.display='none'">
                            <div class="gym-opponent-name" style="font-size: 9px; font-weight: bold;">${battle.pokemon.name}</div>
                            <div style="font-size: 6px;">${opponentTypes.join('/').toUpperCase()}</div>
                            <div style="font-size: 7px;">LV ${battle.pokemon.level}</div>
                            ${battle.pokemon.ace ? '<div style="font-size: 7px; color: var(--gb-darkest);">★ ACE POKEMON</div>' : ''}
                        </div>
                    </div>
                    <div class="gym-challenge-text">${battle.trainerName} wants to battle! ${battle.trainerName} sends out ${battle.pokemon.name}!</div>
                </div>
                <div class="text-box" style="font-size: 7px;">
                    Choose your Pokemon! ${battle.pokemon.name} is ${opponentTypes.join('/')}-type.
                    <br>Weak to: ${[...weakTo].join(', ') || 'none'}
                    <br><span style="font-size: 6px;">If you lose, your Pokemon takes ${battle.damage != null ? battle.damage : 2} damage.</span>
                </div>
                <div class="event-choices" id="trainer-battle-choices">
                    ${alive.map((p, i) => {
                        const hasAdv = p.types.some(t => weakTo.has(t));
                        return `
                        <button class="btn roster-pick-card" data-index="${i}">
                            <img class="roster-pick-sprite" src="${p.spriteUrl}" alt="${p.name}" onerror="this.style.display='none'">
                            <span class="roster-pick-info">
                                <span class="roster-pick-name">${p.name}</span>
                                <span class="roster-pick-meta">${p.types.join('/')} | HP:${p.hp}/${p.maxHp}</span>
                            </span>
                            <span class="roster-pick-badges">
                                ${p.battleStars > 0 ? `<span class="roster-badge roster-badge-star">${'★'.repeat(p.battleStars)}</span>` : ''}
                                ${hasAdv ? '<span class="roster-badge roster-badge-se">SE!</span>' : ''}
                            </span>
                        </button>
                    `;
                    }).join('')}
                </div>
            `;
            container.appendChild(div);

            document.querySelectorAll('#trainer-battle-choices [data-index]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.index, 10);
                    const chosen = alive[index];
                    resolveTrainerBattle(chosen, opponentTypes, weakTo, battle, state, container);
                });
            });
        }
    };

    function resolveTrainerBattle(pokemon, opponentTypes, weakTo, battle, state, container) {
        // Win-chance math, following the same shape as gym-screen.js /
        // event-screen.js's battle resolution (base + type matchup + badges
        // + relevant abilities + battle stars, clamped) — feeding into the
        // shared PT.Engine.BattleOutcomeUI.renderBreakdown panel.
        let chance = battle.tier === 'ace' || (battle.pokemon && battle.pokemon.ace) ? 35 : 45;
        const breakdown = [{ label: 'BASE CHANCE', value: chance }];

        const hasAdvantage = pokemon.types.some(t => weakTo.has(t));
        const strongTo = new Set();
        opponentTypes.forEach(t => {
            Object.keys(WEAKNESSES).forEach(defType => {
                if (WEAKNESSES[defType].weakTo.includes(t)) strongTo.add(defType);
            });
        });
        const hasDisadvantage = pokemon.types.some(t => strongTo.has(t) && !weakTo.has(t));

        if (hasAdvantage) {
            chance += 20;
            breakdown.push({ label: 'TYPE MATCHUP (SE)', value: 20 });
        } else if (hasDisadvantage) {
            chance -= 15;
            breakdown.push({ label: 'TYPE MATCHUP (NVE)', value: -15 });
        } else {
            breakdown.push({ label: 'TYPE MATCHUP', value: 0 });
        }

        const badgeCount = state.badges.filter(b => b !== 'champion').length;
        chance += badgeCount;
        breakdown.push({ label: `BADGES (${badgeCount})`, value: badgeCount });

        const poisonPower = PT.Engine.GameState.getAbilityPower ? PT.Engine.GameState.getAbilityPower(state, 'poison') : 0;
        if (poisonPower > 0) {
            const poisonBonus = Math.floor(1 * poisonPower);
            chance += poisonBonus;
            const poisonN = PT.Engine.GameState.getAbilityContributorCount(state, 'poison');
            breakdown.push({ label: poisonN > 1 ? `POISON (${poisonN} POKEMON)` : 'POISON', value: poisonBonus });
        }

        const intimidatePower = PT.Engine.GameState.getAbilityPower ? PT.Engine.GameState.getAbilityPower(state, 'intimidate') : 0;
        if (intimidatePower > 0) {
            const intimBonus = Math.max(1, Math.floor(1.5 * intimidatePower));
            chance += intimBonus;
            breakdown.push({ label: 'INTIMIDATE', value: intimBonus });
        }

        const stars = pokemon.battleStars || 0;
        if (stars > 0) {
            const starBonus = Math.floor(stars * 1.5);
            chance += starBonus;
            breakdown.push({ label: `BATTLE STARS (${'★'.repeat(stars)})`, value: starBonus });
        }

        const preClampChance = chance;
        chance = Math.max(5, Math.min(90, chance));
        const maxed = preClampChance !== chance ? (chance === 90 ? 'capped' : 'floored') : null;

        const won = PT.Engine.DebugPanel && PT.Engine.DebugPanel.resolveOutcome
            ? PT.Engine.DebugPanel.resolveOutcome(chance, state.rng)
            : state.rng.chance(chance);

        // partyMemberId is the chosen Pokemon's dex id — TrainerEngine
        // resolves it against the first alive party member with that id
        // (species ids can repeat, but this matches every other party
        // lookup convention in the codebase).
        const partyMemberId = pokemon.id;
        // Captured before resolveTrainerBattle runs, since a win may evolve
        // `pokemon` in place — the result text should credit whoever actually
        // fought, not the form they turned into mid-sentence.
        const pokemonNameBeforeBattle = pokemon.name;

        let engineResult = null;
        if (PT.Engine.TrainerEngine && PT.Engine.TrainerEngine.resolveTrainerBattle) {
            engineResult = PT.Engine.TrainerEngine.resolveTrainerBattle(state, partyMemberId, won, battle);
        }

        if (PT.Engine.Audio) won ? PT.Engine.Audio.gymVictory() : PT.Engine.Audio.gymDefeat();

        container.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'screen event-screen';

        let resultRows;
        let title;
        if (won) {
            title = 'VICTORY!';
            // Prefer the engine's actual awarded amount (Pay Day-style abilities
            // can boost it above the trainer's base reward) — fall back to the
            // base reward if TrainerEngine wasn't available to resolve it.
            const awarded = (engineResult && engineResult.moneyAwarded != null) ? engineResult.moneyAwarded : battle.reward;
            resultRows = rewardRow('RESULT', `${pokemonNameBeforeBattle} defeated ${battle.trainerName}'s ${battle.pokemon.name}!`);
            if (awarded) resultRows += rewardRow('REWARD', `+$${awarded}`);
            const evo = engineResult && engineResult.evolution;
            const starResult = engineResult && engineResult.starResult;
            if (evo) resultRows += rewardRow('EVOLVED', `${evo.oldName} → ${evo.newName}`);
            if (starResult && starResult.earned) resultRows += rewardRow('BATTLE STAR EARNED', `${'★'.repeat(pokemon.battleStars)} (${pokemon.battleStars}/3)`);
            if (starResult && starResult.expShareBonus) {
                resultRows += rewardRow('EXP. SHARE',
                    starResult.expShareBonus.type === 'evolution'
                        ? `${starResult.expShareBonus.name} also evolved into ${starResult.expShareBonus.newName}!`
                        : `${starResult.expShareBonus.name} also earned a Battle Star!`);
            }
        } else {
            title = 'DEFEAT...';
            const dmg = battle.damage != null ? battle.damage : 2;
            resultRows = rewardRow('RESULT', `${pokemon.name} took ${dmg} damage from ${battle.trainerName}'s ${battle.pokemon.name}!`);
        }

        // Logging is handled by PT.Engine.TrainerEngine.resolveTrainerBattle
        // above (it has the reward/damage amounts) — don't double-log here.

        div.innerHTML = `
            <div class="event-title">${title}</div>
            <div class="gym-battle-area">
                <div class="gym-battle-sprites" style="justify-content: center;">
                    <div class="gym-opponent-pokemon">
                        <img src="${PT.Engine.GameState.getSpriteUrl(battle.pokemon.id, battle.region === 'johto' ? 'johto' : 'kanto')}" alt="${battle.pokemon.name}"
                             style="width: 64px; height: 64px; image-rendering: pixelated; ${won ? 'opacity: 0.4;' : ''}"
                             onerror="this.style.display='none'">
                        <div style="font-size: 8px; ${won ? 'text-decoration: line-through;' : 'font-weight: bold;'}">${battle.pokemon.name}</div>
                    </div>
                </div>
                <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${resultRows}</div>
                ${PT.Engine.BattleOutcomeUI.renderBreakdown({ chance, maxed, rows: breakdown, notApplicable: [], quote: null })}
            </div>
            <button class="btn btn-wide" id="btn-trainer-battle-continue">CONTINUE</button>
        `;
        container.appendChild(div);
        PT.Engine.GameState.saveGame(state);

        document.getElementById('btn-trainer-battle-continue').addEventListener('click', () => {
            if (state.isGameOver || state.party.length === 0) { PT.App.goto('GAMEOVER'); return; }
            if (state.hasWon) { PT.App.goto('VICTORY'); return; }
            // travel-screen.js threads whatever it would have done next
            // (wild encounter / event / arrival / plain continue) through
            // as battle.onComplete when a day carries both a trainer battle
            // AND one of those — call it so the rest of the day still plays
            // out. Falls back to a plain TRAVEL goto if this screen was
            // reached some other way (e.g. onComplete missing).
            if (typeof battle.onComplete === 'function') {
                battle.onComplete();
            } else {
                PT.App.goto('TRAVEL');
            }
        });
    }
})();

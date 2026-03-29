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
                <br><span style="font-size: 6px;">⚠️ Battle Stars do NOT protect against E4 kills!</span>
            </div>
            <div class="event-choices" id="e4-choices">
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

        // Calculate success chance — BRUTAL Elite Four
        let chance = 25; // Base 25% — the elite are ELITE
        let battleBonuses = [];

        // Progressive difficulty — each fight is harder than the last
        const progressionPenalty = e4Index * 3; // 0%, -3%, -6%, -9%, -12%
        chance -= progressionPenalty;
        if (progressionPenalty > 0) battleBonuses.push(`📈 Round ${e4Index + 1} penalty -${progressionPenalty}%`);

        // Type advantage (smaller bonus than gyms)
        const hasAdvantage = pokemon.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = pokemon.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) chance += 25; // SE matchups are your lifeline
        if (hasDisadvantage) chance -= 25; // NVE is near-suicide

        // Badge bonus (minimal)
        chance += state.badges.filter(b => b !== 'champion').length * 1;

        // Poison ability: only applies if the fighting Pokemon has poison (halved in E4)
        if (pokemon.travelAbility === 'poison') {
            const stage = PT.Engine.GameState.getEvoStage(pokemon.id);
            let power = stage === 1 ? 1.0 : stage === 2 ? 1.5 : 2.0;
            power += (pokemon.battleStars || 0) * 0.25;
            const poisonBonus = Math.max(1, Math.floor(0.5 * power));
            chance += poisonBonus;
            battleBonuses.push(`☠️ POISON +${poisonBonus}%`);
        }

        // Intimidate ability: scales with power (halved in E4)
        const intimidatePower = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePower > 0) {
            const intimBonus = Math.max(1, Math.floor(1.5 * intimidatePower));
            chance += intimBonus;
            battleBonuses.push(`😤 INTIMIDATE +${intimBonus}%`);
        }

        // Psychic Dominance (Mewtwo) — reduced in E4 (from +50% to +25%)
        if (PT.Engine.GameState.hasAbility(state, 'psychic_dominance')) {
            chance += 25;
            battleBonuses.push(`🧠 PSYCHIC DOMINANCE +25%`);
        }

        // Battle Stars bonus (halved in E4: +1.5% per star instead of +3%)
        const stars = pokemon.battleStars || 0;
        if (stars > 0) {
            const starWinBonus = Math.floor(stars * 1.5);
            chance += starWinBonus;
            battleBonuses.push(`${'★'.repeat(stars)} +${starWinBonus}%`);
        }

        // Hard ceiling — staggered cap, gets tighter each round
        const capByRound = [55, 54, 53, 51, 50];
        const cap = capByRound[e4Index] || 50;
        chance = Math.max(8, Math.min(cap, chance));

        const won = state.rng.chance(chance);

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
            }

            // Award battle star (evolution win doesn't count)
            const starResult = PT.Engine.GameState.addBattleWin(pokemon, state, evoResult.evolved);
            let starLine = '';
            if (starResult.earned) {
                starLine = `<br>⭐ ${pokemon.name} earned a Battle Star! [${'★'.repeat(pokemon.battleStars)}] (${pokemon.battleStars}/3)`;
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
                        ${pokemon.name} defeated ${trainer.name}'s ${opponent.name}!${evoLine}${starLine}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%${battleBonuses.length > 0 ? ' (' + battleBonuses.join(', ') + ')' : ''}</span>
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
                    const e4MoneyReward = PT.Engine.GameState.applyPayDay(state, 5000);
                    state.resources.money += e4MoneyReward;
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
            // Loss — the fighting Pokemon takes 4 HP damage
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();

            // E4 damage bypasses Battle Star death avoidance
            const E4_LOSS_DAMAGE = 4;
            const oldHp = pokemon.hp;
            pokemon.hp = Math.max(0, pokemon.hp - E4_LOSS_DAMAGE);
            const killed = pokemon.hp <= 0;

            if (killed) {
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
                ? `${pokemon.name} was killed by ${trainer.name}'s ${opponent.name}! 💀`
                : `${pokemon.name} took ${E4_LOSS_DAMAGE} damage from ${trainer.name}'s ${opponent.name}! (${pokemon.hp}/${pokemon.maxHp} HP)`;
            PT.Engine.GameState.addToLog(state, dmgMsg);

            const aliveAfter = PT.Engine.GameState.getAliveParty(state);
            const partyWiped = aliveAfter.length === 0;

            const statusMsg = killed
                ? `💀 ${pokemon.name} was killed by ${opponent.name}!`
                : `💥 ${pokemon.name} took ${E4_LOSS_DAMAGE} damage! (${pokemon.hp}/${pokemon.maxHp} HP remaining)`;

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
                        ${statusMsg}
                        <br><span style="font-size: 6px;">Win chance was ${chance}%${battleBonuses.length > 0 ? ' (' + battleBonuses.join(', ') + ')' : ''}</span>
                        <br><span style="font-size: 6px;">⚠️ Elite Four ignores Battle Star protection!</span>
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

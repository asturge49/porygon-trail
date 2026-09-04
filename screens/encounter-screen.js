// Porygon Trail - Encounter Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.ENCOUNTER = {
        render(container, state, params) {
            const pokemon = params.pokemon;
            if (!pokemon) { PT.App.goto('TRAVEL'); return; }

            // Track seen
            if (!state.pokedexSeen.includes(pokemon.id)) {
                state.pokedexSeen.push(pokemon.id);
            }

            // Telemetry (§13.3) — is the §8.5 roaming mechanic actually being
            // encountered at a reasonable rate?
            if (pokemon.roaming) {
                const _route = PT.Engine.GameState.getCurrentRoute(state);
                PT.Engine.Telemetry.logEvent('legendary_roam_encountered', {
                    beast_id: pokemon.id,
                    beast_name: pokemon.name,
                    route: _route ? _route.name : null,
                    day: state.daysElapsed
                });
            }

            const totalBalls = state.resources.pokeballs + state.resources.greatballs + state.resources.ultraballs;

            const dex = PT.Engine.Scoring.getGlobalPokedex();
            const isCaught = dex.caught.includes(pokemon.id);
            const isChampion = dex.champions.includes(pokemon.id);

            const div = document.createElement('div');
            div.className = 'screen encounter-screen';
            div.innerHTML = `
                <div class="encounter-header">
                    Wild ${pokemon.name} appeared!
                </div>
                <div class="encounter-sprite-area">
                    ${isCaught || isChampion ? `
                        <div class="encounter-status-tag" title="${[isCaught ? 'Caught' : '', isChampion ? 'Champion' : ''].filter(Boolean).join(' & ')}">
                            ${isCaught ? '<div class="encounter-tag-ball"></div>' : ''}
                            ${isChampion ? '<div class="encounter-tag-star">&#9733;</div>' : ''}
                        </div>
                    ` : ''}
                    <div style="text-align: center;">
                        <img class="encounter-sprite" src="${pokemon.spriteUrl}" alt="${pokemon.name}"
                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'font-size:48px; padding:20px;\\'>?</div>'">
                        <div style="font-size: 8px; margin-top: 8px;">
                            ${pokemon.types.join('/')} | ${pokemon.rarity.toUpperCase()} | HP ${PT.Engine.GameState.getMaxHpForPokemon(pokemon)}/${PT.Engine.GameState.getMaxHpForPokemon(pokemon)}
                        </div>
                    </div>
                </div>
                <div class="encounter-info">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Balls: ${totalBalls}</span>
                        <span>Party: ${state.party.length}/6</span>
                        <span>Ability: ${pokemon.travelAbility}</span>
                    </div>
                </div>
                <div class="text-box" id="encounter-message" style="min-height: 50px;">
                    What will you do?
                </div>
                <div class="encounter-actions" id="encounter-actions">
                    <button class="btn btn-small" id="btn-pokeball" ${state.resources.pokeballs <= 0 ? 'disabled' : ''}>
                        POKE BALL (${state.resources.pokeballs})
                    </button>
                    <button class="btn btn-small" id="btn-greatball" ${state.resources.greatballs <= 0 ? 'disabled' : ''}>
                        GREAT BALL (${state.resources.greatballs})
                    </button>
                    <button class="btn btn-small" id="btn-ultraball" ${state.resources.ultraballs <= 0 ? 'disabled' : ''}>
                        ULTRA BALL (${state.resources.ultraballs})
                    </button>
                    <button class="btn btn-small" id="btn-battle">BATTLE</button>
                    <button class="btn btn-small" id="btn-flee">FLEE</button>
                    <button class="btn btn-small" id="btn-use-item" ${state.resources.potions + state.resources.superPotions <= 0 ? 'disabled' : ''}>
                        USE POTION
                    </button>
                    <button class="btn btn-small" id="btn-party">PARTY</button>
                </div>
            `;
            container.appendChild(div);

            const messageBox = document.getElementById('encounter-message');
            const actionsDiv = document.getElementById('encounter-actions');

            function showResult(text, callback) {
                messageBox.textContent = text;
                PT.Engine.GameState.saveGame(state);
                actionsDiv.innerHTML = '<button class="btn btn-wide" id="btn-continue">CONTINUE</button>';
                document.getElementById('btn-continue').addEventListener('click', callback || (() => {
                    if (state.isGameOver || state.party.length === 0) {
                        state.isGameOver = true;
                        if (!state.gameOverReason) state.gameOverReason = 'party_wiped';
                        PT.App.goto('GAMEOVER');
                    } else {
                        PT.App.goto('TRAVEL');
                    }
                }));
            }

            // Update ball button text and disabled state immediately
            function updateBallButtons() {
                const pokeBtn = document.getElementById('btn-pokeball');
                const greatBtn = document.getElementById('btn-greatball');
                const ultraBtn = document.getElementById('btn-ultraball');
                if (pokeBtn) {
                    pokeBtn.textContent = `POKE BALL (${state.resources.pokeballs})`;
                    pokeBtn.disabled = state.resources.pokeballs <= 0;
                }
                if (greatBtn) {
                    greatBtn.textContent = `GREAT BALL (${state.resources.greatballs})`;
                    greatBtn.disabled = state.resources.greatballs <= 0;
                }
                if (ultraBtn) {
                    ultraBtn.textContent = `ULTRA BALL (${state.resources.ultraballs})`;
                    ultraBtn.disabled = state.resources.ultraballs <= 0;
                }
                const infoDiv = document.querySelector('.encounter-info');
                if (infoDiv) {
                    const newTotal = state.resources.pokeballs + state.resources.greatballs + state.resources.ultraballs;
                    const span = infoDiv.querySelector('span');
                    if (span) span.textContent = `Balls: ${newTotal}`;
                }
            }

            // Throw Poke Ball
            document.getElementById('btn-pokeball').addEventListener('click', () => {
                if (state.resources.pokeballs <= 0) return;
                const result = PT.Engine.EncounterEngine.attemptCatch(pokemon, 'pokeballs', state);
                updateBallButtons();
                handleCatchResult(result, pokemon, state, showResult);
            });

            // Throw Great Ball
            document.getElementById('btn-greatball').addEventListener('click', () => {
                if (state.resources.greatballs <= 0) return;
                const result = PT.Engine.EncounterEngine.attemptCatch(pokemon, 'greatballs', state);
                updateBallButtons();
                handleCatchResult(result, pokemon, state, showResult);
            });

            // Throw Ultra Ball
            document.getElementById('btn-ultraball').addEventListener('click', () => {
                if (state.resources.ultraballs <= 0) return;
                const result = PT.Engine.EncounterEngine.attemptCatch(pokemon, 'ultraballs', state);
                updateBallButtons();
                handleCatchResult(result, pokemon, state, showResult);
            });

            // Battle — show party picker like a gym battle
            document.getElementById('btn-battle').addEventListener('click', () => {
                const pokemonData = PT.Data.Pokemon.find(p => p.id === pokemon.id);
                const opponentTypes = pokemonData ? pokemonData.types : pokemon.types;
                const typeChart = getWildTypeWeaknesses(opponentTypes);
                const wildHp = PT.Engine.GameState.getMaxHpForPokemon(pokemon);
                const lossDamage = Math.max(1, wildHp - 1);

                messageBox.innerHTML = `
                    <div style="font-size: 7px;">
                        Choose a Pokemon to battle wild ${pokemon.name}!
                        <br>${pokemon.types.join('/')}-type | Weak to: ${typeChart.weakTo.join(', ') || 'none'} | Resists: ${typeChart.strongTo.join(', ') || 'none'}
                        <br><span style="font-size: 6px;">If you lose, your Pokemon takes ${lossDamage} damage.</span>
                    </div>
                `;

                const aliveParty = PT.Engine.GameState.getAliveParty(state);
                actionsDiv.innerHTML = `
                    <div class="roster-pick-list">
                        ${aliveParty.map((p, i) => {
                            const hasAdvantage = p.types.some(t => typeChart.weakTo.includes(t));
                            const hasDisadvantage = p.types.some(t => typeChart.strongTo.includes(t));
                            return `
                            <button class="btn roster-pick-card battle-pick-btn" data-battle-idx="${i}">
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
                        <button class="btn btn-wide" id="btn-battle-cancel">CANCEL</button>
                    </div>
                `;

                document.querySelectorAll('.battle-pick-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = parseInt(btn.dataset.battleIdx);
                        const chosen = aliveParty[idx];
                        resolveWildBattle(chosen, pokemon, state, messageBox, actionsDiv, showResult);
                    });
                });

                document.getElementById('btn-battle-cancel').addEventListener('click', () => {
                    PT.App.goto('ENCOUNTER', { pokemon });
                });
            });

            // Flee
            document.getElementById('btn-flee').addEventListener('click', () => {
                const result = PT.Engine.EncounterEngine.attemptFlee(state, pokemon);
                if (result.success) {
                    PT.Engine.GameState.addToLog(state, result.message);
                    showResult(result.message);
                } else {
                    messageBox.textContent = result.message + " Try again!";
                    // Wild Pokemon attacks
                    const victim = state.rng.pick(PT.Engine.GameState.getAliveParty(state));
                    if (victim && state.rng.chance(result.hitChance || 40)) {
                        const fainted = PT.Engine.GameState.damagePokemon(victim, 1, state);
                        messageBox.textContent += fainted
                            ? ` ${pokemon.name} killed ${victim.name}!`
                            : ` ${pokemon.name} attacks ${victim.name}!`;
                    }
                }
            });

            // Use Potion
            document.getElementById('btn-use-item').addEventListener('click', () => {
                const injured = state.party.filter(p => p.status !== 'fainted' && p.hp < p.maxHp);
                if (injured.length === 0) {
                    messageBox.textContent = "No Pokemon need healing!";
                    return;
                }
                if (state.resources.superPotions > 0) {
                    state.resources.superPotions--;
                    const target = injured[0];
                    PT.Engine.GameState.healPokemon(target, 2);
                    messageBox.textContent = `Used Super Potion on ${target.name}! HP restored.`;
                } else if (state.resources.potions > 0) {
                    state.resources.potions--;
                    const target = injured[0];
                    PT.Engine.GameState.healPokemon(target, 1);
                    messageBox.textContent = `Used Potion on ${target.name}! +1 HP.`;
                }
            });

            // View party
            document.getElementById('btn-party').addEventListener('click', () => {
                PT.App.push('PARTY');
            });
        }
    };

    function showPartyFullOptions(state, pokemon, addResult, msgEl, actionsDiv) {
        const pokemonData = addResult.pokemonData;
        const foodAmount = PT.Engine.GameState.pokemonToFood(pokemon.rarity);
        const spriteUrl = PT.Engine.GameState.getSpriteUrl(pokemon.id, state.region);

        msgEl.innerHTML = `
            <div style="text-align: center; margin-bottom: 4px;">
                <strong>Gotcha! ${pokemon.name} was caught!</strong>
                <br>But your party is full (6/6).
            </div>
        `;

        actionsDiv.innerHTML = `
            <div class="roster-pick-list">
                <div style="text-align: center; margin-bottom: 8px;">
                    <img src="${spriteUrl}" alt="${pokemon.name}" style="width: 40px; height: 40px; image-rendering: pixelated;"
                         onerror="this.style.display='none'">
                    <div style="font-size: 7px;">${pokemon.name} | ${pokemon.types.join('/')} | ${pokemon.rarity.toUpperCase()} | HP: ${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)}/${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)}</div>
                </div>
                <button class="btn btn-small" id="btn-swap">SWAP WITH PARTY</button>
                <button class="btn btn-small" id="btn-butcher-catch">BUTCHER FOR FOOD (+${foodAmount})</button>
                <button class="btn btn-small" id="btn-release-catch">RELEASE</button>
            </div>
        `;

        // SWAP — show party picker. Each existing member can be swapped out
        // either as a plain release or butchered for food, same choice the
        // newly-caught Pokemon gets below.
        document.getElementById('btn-swap').addEventListener('click', () => {
            actionsDiv.innerHTML = `
                <div class="roster-pick-list">
                    <div style="font-size: 7px; margin-bottom: 4px; font-weight: bold;">Replace which Pokemon with ${pokemon.name} (HP: ${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)}/${PT.Engine.GameState.getMaxHpForPokemon(pokemonData)})?</div>
                    <div class="potion-pokemon-list">
                        ${state.party.map((p, i) => {
                            const stars = p.battleStars || 0;
                            const outFood = PT.Engine.GameState.pokemonToFood(p.rarity);
                            return `
                            <div class="potion-target-btn potion-target-btn--split">
                                <img class="potion-target-sprite" src="${p.spriteUrl}" alt="${p.name}"
                                     onerror="this.style.display='none'">
                                <div class="potion-target-info">
                                    <div class="potion-target-name">${p.name}${stars > 0 ? ` <span style="color: #b8860b;">${'★'.repeat(stars)}</span>` : ''}</div>
                                    <div>${p.types.join('/')} | HP: ${p.hp}/${p.maxHp}</div>
                                </div>
                                <div class="potion-target-actions">
                                    <button class="btn btn-small potion-swap-release" data-idx="${i}">SWAP</button>
                                    <button class="btn btn-small potion-swap-butcher" data-idx="${i}">BUTCHER (+${outFood})</button>
                                </div>
                            </div>
                        `;
                        }).join('')}
                    </div>
                    <button class="btn btn-small" id="btn-swap-cancel" style="margin-top: 6px; width: 100%;">CANCEL</button>
                </div>
            `;

            function doSwap(idx, butcher) {
                const replaced = state.party[idx];
                const newMember = PT.Engine.GameState.createPartyPokemon(pokemonData, state);
                state.party[idx] = newMember;
                if (PT.Engine.Audio) PT.Engine.Audio.buy();

                if (butcher) {
                    const outFood = PT.Engine.GameState.pokemonToFood(replaced.rarity);
                    state.resources.food += outFood;
                    PT.Engine.GameState.addToLog(state, `Butchered ${replaced.name} for ${outFood} food. ${pokemon.name} joined the team!`);
                    msgEl.innerHTML = `<strong>${replaced.name}</strong> was butchered for <strong>${outFood} food</strong>. <strong>${pokemon.name}</strong> joined your team!`;
                } else {
                    PT.Engine.GameState.addToLog(state, `Swapped ${replaced.name} for ${pokemon.name}!`);
                    msgEl.innerHTML = `<strong>${replaced.name}</strong> was released. <strong>${pokemon.name}</strong> joined your team!`;
                }
                actionsDiv.innerHTML = '<button class="btn btn-wide" id="btn-continue">CONTINUE</button>';
                document.getElementById('btn-continue').addEventListener('click', () => PT.App.goto('TRAVEL'));
            }

            document.querySelectorAll('.potion-swap-release').forEach(btn => {
                btn.addEventListener('click', () => doSwap(parseInt(btn.dataset.idx), false));
            });
            document.querySelectorAll('.potion-swap-butcher').forEach(btn => {
                btn.addEventListener('click', () => doSwap(parseInt(btn.dataset.idx), true));
            });

            document.getElementById('btn-swap-cancel').addEventListener('click', () => {
                showPartyFullOptions(state, pokemon, addResult, msgEl, actionsDiv);
            });
        });

        // BUTCHER FOR FOOD
        document.getElementById('btn-butcher-catch').addEventListener('click', () => {
            state.resources.food += foodAmount;
            PT.Engine.GameState.addToLog(state, `Butchered ${pokemon.name} for ${foodAmount} food.`);
            if (PT.Engine.Audio) PT.Engine.Audio.buy();

            msgEl.innerHTML = `<strong>${pokemon.name}</strong> was butchered for <strong>${foodAmount} food</strong>. Registered in Pokedex.`;
            actionsDiv.innerHTML = '<button class="btn btn-wide" id="btn-continue">CONTINUE</button>';
            document.getElementById('btn-continue').addEventListener('click', () => PT.App.goto('TRAVEL'));
        });

        // RELEASE
        document.getElementById('btn-release-catch').addEventListener('click', () => {
            PT.Engine.GameState.addToLog(state, `Released ${pokemon.name}. Registered in Pokedex.`);

            msgEl.innerHTML = `<strong>${pokemon.name}</strong> was released. Registered in Pokedex.`;
            actionsDiv.innerHTML = '<button class="btn btn-wide" id="btn-continue">CONTINUE</button>';
            document.getElementById('btn-continue').addEventListener('click', () => PT.App.goto('TRAVEL'));
        });
    }

    function handleCatchResult(result, pokemon, state, showResult) {
        const A = PT.Engine.Audio;
        const msgEl = document.getElementById('encounter-message');
        const actionsDiv = document.getElementById('encounter-actions');
        const sprite = document.querySelector('.encounter-sprite');

        // Disable actions during animation
        actionsDiv.querySelectorAll('button').forEach(b => b.disabled = true);

        // Ball shake animation sequence
        let shakeCount = 0;
        msgEl.innerHTML = '<span class="ball-shake">●</span> ...';
        if (A) A.ballShake();

        const shakeInterval = setInterval(() => {
            shakeCount++;
            if (shakeCount <= result.shakes) {
                msgEl.innerHTML = '<span class="ball-shake">●</span> ' + 'shake... '.repeat(shakeCount);
                if (A) A.ballShake();
            } else {
                clearInterval(shakeInterval);
                if (result.success) {
                    const addResult = PT.Engine.EncounterEngine.addPokemonToParty(state, pokemon);
                    const intLabel = result.intimidateBonus ? ' INTIMIDATE +15%' : '';
                    const maxedLabel = result.maxed ? ' CATCH RATE MAXED OUT' : '';
                    PT.Engine.GameState.addToLog(state, `Caught ${pokemon.name}! (${result.catchChance}% chance)`);
                    if (A) A.catchSuccess();
                    if (sprite) sprite.classList.add('catch-sparkle');

                    // Telemetry (§13.3) — roaming-beast catch rate.
                    if (pokemon.roaming) {
                        const _route = PT.Engine.GameState.getCurrentRoute(state);
                        PT.Engine.Telemetry.logEvent('legendary_roam_caught', {
                            beast_id: pokemon.id,
                            beast_name: pokemon.name,
                            route: _route ? _route.name : null,
                            day: state.daysElapsed
                        });
                    }

                    if (addResult.partyFull) {
                        // Party full — show swap/food/release options
                        showPartyFullOptions(state, pokemon, addResult, msgEl, actionsDiv);
                    } else {
                        showResult(`${'shake... '.repeat(result.shakes)}CLICK!\n\nGotcha! ${pokemon.name} was caught!${intLabel}${maxedLabel} ${addResult.message}`);
                    }
                } else {
                    if (A) A.catchFail();
                    if (sprite) sprite.classList.add('damage-flash');
                    const intLabel = result.intimidateBonus ? ' INTIMIDATE +15%' : '';
                    const maxedLabel = result.maxed ? ' CATCH RATE MAXED OUT' : '';
                    msgEl.textContent = `${'shake... '.repeat(result.shakes)}Oh no! ${pokemon.name} broke free! (${result.catchChance}% chance)${intLabel}${maxedLabel}`;

                    // Update ball counts and re-enable actions
                    const pokeBtn = actionsDiv.querySelector('#btn-pokeball');
                    const greatBtn = actionsDiv.querySelector('#btn-greatball');
                    const ultraBtn = actionsDiv.querySelector('#btn-ultraball');
                    if (pokeBtn) {
                        pokeBtn.textContent = `POKE BALL (${state.resources.pokeballs})`;
                        pokeBtn.disabled = state.resources.pokeballs <= 0;
                    }
                    if (greatBtn) {
                        greatBtn.textContent = `GREAT BALL (${state.resources.greatballs})`;
                        greatBtn.disabled = state.resources.greatballs <= 0;
                    }
                    if (ultraBtn) {
                        ultraBtn.textContent = `ULTRA BALL (${state.resources.ultraballs})`;
                        ultraBtn.disabled = state.resources.ultraballs <= 0;
                    }
                    // Re-enable non-ball buttons
                    const otherBtns = actionsDiv.querySelectorAll('#btn-battle, #btn-flee, #btn-use-item');
                    otherBtns.forEach(b => b.disabled = false);

                    // Update ball total in info bar
                    const infoDiv = document.querySelector('.encounter-info');
                    if (infoDiv) {
                        const newTotal = state.resources.pokeballs + state.resources.greatballs + state.resources.ultraballs;
                        infoDiv.querySelector('span').textContent = `Balls: ${newTotal}`;
                    }

                    // Pokemon might flee — roaming legendaries (§8.5) are
                    // notably more likely to bolt on a failed catch, since
                    // "roaming" means hard to pin down, not just rare.
                    if (state.rng.chance(pokemon.roaming ? 65 : 30)) {
                        PT.Engine.GameState.addToLog(state, `${pokemon.name} fled after breaking free.`);
                        showResult(`${pokemon.name} broke free and fled!`);
                    }
                }
            }
        }, 500);
    }

    // Type chart for wild battles (same as gym-screen)
    function getWildTypeWeaknesses(types) {
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
            dark:     { weakTo: ['bug', 'fighting'], resistedBy: ['ghost', 'dark'], immuneBy: ['psychic'] },
            bird:     { weakTo: ['electric', 'ice', 'rock'], resistedBy: ['grass', 'fighting', 'bug'] }
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

    function resolveWildBattle(chosen, pokemon, state, msgEl, actionsDiv, showResult) {
        const pokemonData = PT.Data.Pokemon.find(p => p.id === pokemon.id);
        const opponentTypes = pokemonData ? pokemonData.types : pokemon.types;
        const typeChart = getWildTypeWeaknesses(opponentTypes);

        // Calculate win chance — wild battles are easier than gyms.
        // `breakdown` mirrors this math for engine/battle-outcome-ui.js's panel.
        let chance = 50;
        let breakdown = [{ label: 'BASE CHANCE', value: 50 }];

        // Type advantage
        const hasAdvantage = chosen.types.some(t => typeChart.weakTo.includes(t));
        const hasDisadvantage = chosen.types.some(t => typeChart.strongTo.includes(t));
        if (hasAdvantage) {
            chance += 20;
            breakdown.push({ label: 'TYPE MATCHUP (SE)', value: 20 });
        } else if (hasDisadvantage) {
            chance -= 20;
            breakdown.push({ label: 'TYPE MATCHUP (NVE)', value: -20 });
        } else {
            breakdown.push({ label: 'TYPE MATCHUP', value: 0 });
        }

        // Rarity of wild Pokemon affects difficulty
        const rarityPenalty = pokemon.rarity === 'legendary' ? 15 : pokemon.rarity === 'rare' ? 5 : 0;
        if (rarityPenalty > 0) chance -= rarityPenalty;
        breakdown.push({ label: `RARITY (${pokemon.rarity.toUpperCase()})`, value: rarityPenalty > 0 ? -rarityPenalty : 0 });

        // Progressive scaling — mirrors the gym-battle formula (gym-screen.js)
        // so wild encounters stop being trivial farming fodder as the run goes
        // on. Scales from 0 (no badges) to -18% across all 16 badges (Kanto +
        // Johto), so late-game grinding on early low-rarity routes still carries risk.
        const totalBadgeCount = state.badges.filter(b => b !== 'champion').length;
        const wildScaling = Math.floor((totalBadgeCount / 16) * 18);
        if (wildScaling > 0) chance -= wildScaling;
        breakdown.push({ label: `PROGRESSION (${totalBadgeCount} BADGES)`, value: wildScaling > 0 ? -wildScaling : 0 });

        // Johto wild Pokemon hit back harder — matches the flee-chance and
        // gym-loss-damage regional bump already applied elsewhere.
        if (state.region === 'johto') {
            chance -= 10;
            breakdown.push({ label: 'JOHTO REGION', value: -10 });
        }

        // Win Rate buff (Muscle Band stacks)
        const winRateBonus = PT.Engine.GameState.getWinRateBonus(state);
        if (winRateBonus > 0) {
            chance += winRateBonus;
            breakdown.push({ label: 'MUSCLE BAND', value: winRateBonus });
        }

        // Poison ability: scales with power, party-wide (same as Intimidate below)
        const poisonPowerBattle = PT.Engine.GameState.getAbilityPower(state, 'poison');
        if (poisonPowerBattle > 0) {
            const poisonBonus = Math.floor(1 * poisonPowerBattle);
            chance += poisonBonus;
            const poisonN = PT.Engine.GameState.getAbilityContributorCount(state, 'poison');
            breakdown.push({ label: poisonN > 1 ? `POISON (${poisonN} POKEMON)` : 'POISON', value: poisonBonus });
        }

        // Intimidate ability: scales with power
        const intimidatePowerBattle = PT.Engine.GameState.getAbilityPower(state, 'intimidate');
        if (intimidatePowerBattle > 0) {
            const intimBonus = Math.floor(3 * intimidatePowerBattle);
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
        const starBonus = PT.Engine.GameState.getStarBonus(chosen);
        if (starBonus.winChanceBonus > 0) {
            chance += starBonus.winChanceBonus;
            breakdown.push({ label: `BATTLE STARS (${'★'.repeat(chosen.battleStars || 0)})`, value: starBonus.winChanceBonus });
        }

        // Clamp
        const preClampChance = chance;
        chance = Math.max(15, Math.min(85, chance));
        const maxed = preClampChance !== chance ? (chance === 85 ? 'capped' : 'floored') : null;

        const won = PT.Engine.DebugPanel.resolveOutcome(chance, state.rng);
        const wildHp = PT.Engine.GameState.getMaxHpForPokemon(pokemon);
        const lossDamage = Math.max(1, wildHp - 1);

        if (won) {
            if (PT.Engine.Audio) PT.Engine.Audio.gymVictory();

            PT.Engine.GameState.addToLog(state, `${chosen.name} defeated wild ${pokemon.name}!`);

            // Try to evolve the battler FIRST
            const evoResult = PT.Engine.GameState.evolvePokemon(chosen, state);
            let evoLine = '';
            if (evoResult.evolved) {
                evoLine = `<br>${evoResult.oldName} evolved into ${evoResult.newName}!`;
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            }

            // Award battle star (evolution win doesn't count)
            const starResult = PT.Engine.GameState.addBattleWin(chosen, state, evoResult.evolved);

            // Reward: small money bounty
            const baseMoneyReward = pokemon.rarity === 'legendary' ? 500 : pokemon.rarity === 'rare' ? 200 : pokemon.rarity === 'uncommon' ? 100 : 50;
            const moneyReward = PT.Engine.GameState.applyPayDay(state, baseMoneyReward);
            state.resources.money += moneyReward;

            let rewardRows = rewardRow('MONEY', `+$${moneyReward}${moneyReward > baseMoneyReward ? ' (BONUS)' : ''}`);
            if (evoResult.evolved) {
                rewardRows += rewardRow('EVOLVED', `${evoResult.oldName} → ${evoResult.newName}`);
            }
            if (starResult.earned) {
                rewardRows += rewardRow('BATTLE STAR EARNED', `${'★'.repeat(chosen.battleStars)} (${chosen.battleStars}/3)`);
            }
            if (starResult.expShareBonus) {
                rewardRows += rewardRow('EXP. SHARE',
                    starResult.expShareBonus.type === 'evolution'
                        ? `${starResult.expShareBonus.name} also evolved into ${starResult.expShareBonus.newName}!`
                        : `${starResult.expShareBonus.name} also earned a Battle Star!`);
            }

            msgEl.innerHTML = `
                <div style="text-align: center;">
                    <strong>${chosen.name} defeated wild ${pokemon.name}!</strong>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${rewardRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({ chance, maxed, rows: breakdown, notApplicable: [], quote: null })}
                </div>
            `;
            PT.Engine.GameState.saveGame(state);
            actionsDiv.innerHTML = '<button class="btn btn-wide" id="btn-continue">CONTINUE</button>';
            document.getElementById('btn-continue').addEventListener('click', () => {
                if (state.isGameOver || state.party.length === 0) {
                    state.isGameOver = true;
                    if (!state.gameOverReason) state.gameOverReason = 'party_wiped';
                    PT.App.goto('GAMEOVER');
                } else {
                    PT.App.goto('TRAVEL');
                }
            });
        } else {
            if (PT.Engine.Audio) PT.Engine.Audio.gymDefeat();

            // Loss: damage = wild Pokemon's HP - 1
            const fainted = PT.Engine.GameState.damagePokemon(chosen, lossDamage, state);
            const died = fainted || chosen.hp <= 0;

            if (died) {
                PT.Engine.GameState.addToLog(state, `${chosen.name} was killed by wild ${pokemon.name}!`);
            } else {
                PT.Engine.GameState.addToLog(state, `${chosen.name} took ${lossDamage} damage from wild ${pokemon.name}.`);
            }

            let lossRows = rewardRow('RESULT', died ? `${chosen.name} was killed` : `${chosen.name} took ${lossDamage} damage`);
            lossRows += rewardRow(`WILD ${pokemon.name.toUpperCase()} HP`, wildHp);

            msgEl.innerHTML = `
                <div style="text-align: center;">
                    <strong>${chosen.name} lost to wild ${pokemon.name}!</strong>
                    <div class="battle-breakdown-list" style="max-width: 380px; margin: 4px auto 0;">${lossRows}</div>
                    ${PT.Engine.BattleOutcomeUI.renderBreakdown({ chance, maxed, rows: breakdown, notApplicable: [], quote: null })}
                </div>
            `;
            PT.Engine.GameState.saveGame(state);
            actionsDiv.innerHTML = '<button class="btn btn-wide" id="btn-continue">CONTINUE</button>';
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
    }
})();

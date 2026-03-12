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

            const totalBalls = state.resources.pokeballs + state.resources.greatballs + state.resources.ultraballs;

            const div = document.createElement('div');
            div.className = 'screen encounter-screen';
            div.innerHTML = `
                <div class="encounter-header">
                    Wild ${pokemon.name} appeared!
                </div>
                <div class="encounter-sprite-area">
                    <div style="text-align: center;">
                        <img class="encounter-sprite" src="${pokemon.spriteUrl}" alt="${pokemon.name}"
                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'font-size:48px; padding:20px;\\'>?</div>'">
                        <div style="font-size: 8px; margin-top: 8px;">
                            Lv.${pokemon.level} | ${pokemon.types.join('/')} | ${pokemon.rarity.toUpperCase()}
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
                    <button class="btn btn-small" id="btn-observe">OBSERVE</button>
                    <button class="btn btn-small" id="btn-flee">FLEE</button>
                    <button class="btn btn-small" id="btn-use-item" ${state.resources.potions + state.resources.superPotions <= 0 ? 'disabled' : ''}>
                        USE POTION
                    </button>
                </div>
            `;
            container.appendChild(div);

            const messageBox = document.getElementById('encounter-message');
            const actionsDiv = document.getElementById('encounter-actions');

            function showResult(text, callback) {
                messageBox.textContent = text;
                actionsDiv.innerHTML = '<button class="btn btn-wide" id="btn-continue">CONTINUE</button>';
                document.getElementById('btn-continue').addEventListener('click', callback || (() => PT.App.goto('TRAVEL')));
            }

            // Throw Poke Ball
            document.getElementById('btn-pokeball').addEventListener('click', () => {
                const result = PT.Engine.EncounterEngine.attemptCatch(pokemon, 'pokeballs', state);
                handleCatchResult(result, pokemon, state, showResult);
            });

            // Throw Great Ball
            document.getElementById('btn-greatball').addEventListener('click', () => {
                const result = PT.Engine.EncounterEngine.attemptCatch(pokemon, 'greatballs', state);
                handleCatchResult(result, pokemon, state, showResult);
            });

            // Throw Ultra Ball
            document.getElementById('btn-ultraball').addEventListener('click', () => {
                const result = PT.Engine.EncounterEngine.attemptCatch(pokemon, 'ultraballs', state);
                handleCatchResult(result, pokemon, state, showResult);
            });

            // Observe
            document.getElementById('btn-observe').addEventListener('click', () => {
                PT.Engine.GameState.addToLog(state, `Observed wild ${pokemon.name}.`);
                showResult(`You carefully observe the wild ${pokemon.name}. Its travel ability is "${pokemon.travelAbility}". ${pokemon.name} wanders away.`);
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
                    if (victim && state.rng.chance(40)) {
                        PT.Engine.GameState.damagePokemon(victim, 1);
                        messageBox.textContent += ` ${pokemon.name} attacks ${victim.name}!`;
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
        }
    };

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
                    PT.Engine.GameState.addToLog(state, `Caught ${pokemon.name}! (${result.catchChance}% chance)`);
                    if (A) A.catchSuccess();
                    if (sprite) sprite.classList.add('catch-sparkle');
                    showResult(`${'shake... '.repeat(result.shakes)}CLICK!\n\nGotcha! ${pokemon.name} was caught! ${addResult.message}`);
                } else {
                    if (A) A.catchFail();
                    if (sprite) sprite.classList.add('damage-flash');
                    msgEl.textContent = `${'shake... '.repeat(result.shakes)}Oh no! ${pokemon.name} broke free! (${result.catchChance}% chance)`;

                    // Re-enable actions
                    actionsDiv.querySelectorAll('button').forEach(b => b.disabled = false);

                    // Pokemon might flee
                    if (state.rng.chance(30)) {
                        PT.Engine.GameState.addToLog(state, `${pokemon.name} fled after breaking free.`);
                        showResult(`${pokemon.name} broke free and fled!`);
                    }
                }
            }
        }, 500);
    }
})();

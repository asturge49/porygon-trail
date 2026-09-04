// Porygon Trail - Starter Selection Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Ability name/description are looked up live from data/pokemon.js and
    // the shared PT.Data.AbilityDescriptions (data/ability-buffs.js) rather
    // than hand-written per starter — hand-written copy is exactly what went
    // stale here before (advertised "Surf ability" after Squirtle's ability
    // changed to Strength).
    const STARTERS = [
        { id: 1, name: "Bulbasaur", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/1.png" },
        { id: 4, name: "Charmander", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/4.png" },
        { id: 7, name: "Squirtle", sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/7.png" }
    ];

    // Most abilities only have a display name in PT.Data.AbilityBuffs
    // (the 9 buffable ones) — "fire" (Charmander's) isn't buffable and has
    // no entry there, so fall back to title-casing the raw key.
    function abilityDisplayName(key) {
        const buff = PT.Data.AbilityBuffs && PT.Data.AbilityBuffs[key];
        if (buff && buff.name) return buff.name;
        return key.charAt(0).toUpperCase() + key.slice(1);
    }

    let selectedStarter = null;

    PT.Screens.STARTER = {
        render(container, state, params) {
            selectedStarter = null;
            const difficultyLevel = (params && params.difficultyLevel) || 1;
            const auth = PT.Engine.Auth;
            const loggedInUsername = auth && auth.isLoggedIn() ? auth.getCurrentUsername() : null;

            const div = document.createElement('div');
            div.className = 'screen starter-screen';
            div.innerHTML = `
                <div class="text-box">
                    <p>PROF. OAK: Hello there! Welcome to the world of POKEMON!</p>
                    <p style="margin-top: 8px;">${loggedInUsername ? `Good to see you, ${loggedInUsername}!` : 'What is your name, trainer?'}</p>
                </div>
                ${loggedInUsername ? '' : `
                <div class="name-input-area">
                    <input type="text" class="name-input" id="trainer-name" maxlength="10" placeholder="RED" value="">
                </div>`}
                <div class="text-box" style="min-height: auto; padding: 8px 16px;">
                    Now choose your partner Pokemon!
                </div>
                <div class="starter-choices" id="starter-choices">
                    ${STARTERS.map(s => {
                        const data = PT.Data.Pokemon.find(p => p.id === s.id);
                        const ability = data ? data.travelAbility : null;
                        const abilityName = ability ? abilityDisplayName(ability) : 'Unknown';
                        const abilityDesc = ability && PT.Data.AbilityDescriptions ? PT.Data.AbilityDescriptions[ability] : '';
                        return `
                        <div class="starter-card" data-id="${s.id}">
                            <div class="starter-name">${s.name}</div>
                            <img class="starter-sprite" src="${s.sprite}" alt="${s.name}">
                            <div class="starter-bonus">
                                <strong>${abilityName}</strong>${abilityDesc ? `<br>${abilityDesc}` : ''}
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>
                <button class="btn btn-wide" id="btn-start" disabled>BEGIN YOUR JOURNEY</button>
            `;
            container.appendChild(div);

            // Starter selection
            document.querySelectorAll('.starter-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelectorAll('.starter-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    selectedStarter = parseInt(card.dataset.id);
                    document.getElementById('btn-start').disabled = false;
                });
            });

            // Start game
            document.getElementById('btn-start').addEventListener('click', () => {
                if (!selectedStarter) return;
                const nameInput = document.getElementById('trainer-name');
                const name = loggedInUsername || (nameInput.value.trim().toUpperCase() || 'RED');
                const starterData = STARTERS.find(s => s.id === selectedStarter);
                PT.State = PT.Engine.GameState.createNewGame(name, selectedStarter, difficultyLevel);
                PT.Engine.GameState.addToLog(PT.State, `${name} set out from Pallet Town with ${starterData.name}!`);
                PT.Engine.Telemetry.logEvent('game_start', {
                    trainer_name: name,
                    starter_id: selectedStarter,
                    starter_name: starterData.name
                });
                PT.App.goto('TRAVEL');
            });

            // Focus name input
            if (!loggedInUsername) {
                setTimeout(() => document.getElementById('trainer-name').focus(), 100);
            }
        }
    };
})();

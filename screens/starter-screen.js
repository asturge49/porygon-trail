// Porygon Trail - Starter Selection Screen
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    const STARTERS = [
        {
            id: 1, name: "Bulbasaur",
            bonuses: ["Better healing on the trail", "Grass events easier", "Cut ability clears obstacles"],
            sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/1.png"
        },
        {
            id: 4, name: "Charmander",
            bonuses: ["Efficient cooking saves food", "Better in caves & mountains", "Fire scares wild Pokemon"],
            sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/4.png"
        },
        {
            id: 7, name: "Squirtle",
            bonuses: ["Safe water travel", "Surf ability for sea routes", "Better fishing encounters"],
            sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/7.png"
        }
    ];

    let selectedStarter = null;

    PT.Screens.STARTER = {
        render(container) {
            selectedStarter = null;
            const div = document.createElement('div');
            div.className = 'screen starter-screen';
            div.innerHTML = `
                <div class="text-box">
                    <p>PROF. OAK: Hello there! Welcome to the world of POKEMON!</p>
                    <p style="margin-top: 8px;">What is your name, trainer?</p>
                </div>
                <div class="name-input-area">
                    <input type="text" class="name-input" id="trainer-name" maxlength="10" placeholder="RED" value="">
                </div>
                <div class="text-box" style="min-height: auto; padding: 8px 16px;">
                    Now choose your partner Pokemon!
                </div>
                <div class="starter-choices" id="starter-choices">
                    ${STARTERS.map(s => `
                        <div class="starter-card" data-id="${s.id}">
                            <div class="starter-name">${s.name}</div>
                            <img class="starter-sprite" src="${s.sprite}" alt="${s.name}">
                            <div class="starter-bonus">${s.bonuses.map(b => `> ${b}`).join('<br>')}</div>
                        </div>
                    `).join('')}
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
                const name = document.getElementById('trainer-name').value.trim().toUpperCase() || 'RED';
                const starterData = STARTERS.find(s => s.id === selectedStarter);
                PT.State = PT.Engine.GameState.createNewGame(name, selectedStarter);
                PT.Engine.GameState.addToLog(PT.State, `${name} set out from Pallet Town with ${starterData.name}!`);
                PT.Engine.Telemetry.logEvent('game_start', {
                    trainer_name: name,
                    starter_id: selectedStarter,
                    starter_name: starterData.name
                });
                PT.App.goto('TRAVEL');
            });

            // Focus name input
            setTimeout(() => document.getElementById('trainer-name').focus(), 100);
        }
    };
})();

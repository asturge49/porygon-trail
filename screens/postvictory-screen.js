// Porygon Trail - Post-Victory Screen (Kanto Champion choice)
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.POSTVICTORY = {
        render(container, state) {
            const div = document.createElement('div');
            div.className = 'screen postvictory-screen';
            div.innerHTML = `
                <div class="victory-title">CHAMPION!</div>
                <div class="text-box text-center" style="font-size: 8px;">
                    ${state.trainerName} has defeated the Kanto Elite Four and become Champion!
                    <br><br>A call comes in from Prof. Oak: Congratulations! My colleague would
                    like to meet you. Your journey isn't over yet!
                </div>
                <button class="btn btn-wide" id="btn-continue-johto" style="max-width: 500px; margin-top: 12px;">CONTINUE TO JOHTO</button>
            `;
            container.appendChild(div);

            document.getElementById('btn-continue-johto').addEventListener('click', () => {
                // state.region flips to 'johto' inside enterJohto() (johto-starter-
                // screen.js), together with the currentLocationIndex advance past
                // pokemon_league — not here. Flipping it here left a save that could
                // be closed mid-transition (region already 'johto', but still
                // parked on Kanto's E4 route and never given a starter) with no
                // way to tell TRAVEL apart from a genuine Johto E4 rematch — see
                // the safeguard in travel-screen.js's pokemon_league branch.
                PT.Engine.GameState.addToLog(state, 'Set off for the Johto region!');
                PT.Engine.GameState.saveGame(state);
                PT.App.goto('ELMSTARTER');
            });
        }
    };
})();

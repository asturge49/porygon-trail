// Porygon Trail - Professor Elm's Johto Starter Event (§6.1)
// One-time, fires on first entering Johto. Requires an open party slot —
// no bonus 7th slot — so a full party must release a mon before Elm's offer
// can be accepted. This mirrors screens/starter-screen.js's pattern with a
// Johto pool and new narration.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // National dex 152/155/158 — added by the Johto Pokedex content pass.
    const JOHTO_STARTER_IDS = [152, 155, 158];

    let selectedStarter = null;

    PT.Screens.ELMSTARTER = {
        render(container, state) {
            selectedStarter = null;
            const partyFull = state.party.length >= 6;

            if (partyFull) {
                renderMakeRoom(container, state);
            } else {
                renderStarterChoice(container, state);
            }
        }
    };

    function renderMakeRoom(container, state) {
        const div = document.createElement('div');
        div.className = 'screen starter-screen';
        div.innerHTML = `
            <div class="text-box">
                <p>PROF. ELM: I'd love to give you a Johto partner, but your party
                is full (6/6)!</p>
                <p style="margin-top: 8px;">Make room for your Johto starter? Release
                one of your Pokemon to accept Elm's offer.</p>
            </div>
            <div class="party-grid" id="elm-release-grid">
                ${state.party.map((p, i) => `
                    <div class="party-slot">
                        <img class="party-sprite" src="${p.spriteUrl}" alt="${p.name}"
                             onerror="this.style.display='none'">
                        <div class="party-info">
                            <div class="party-pokemon-name">${p.name}</div>
                            <div>${p.types.join('/')}</div>
                        </div>
                        <button class="btn btn-small release-btn" data-index="${i}" style="font-size:6px; padding:3px 6px;">RELEASE</button>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(div);

        document.querySelectorAll('#elm-release-grid .release-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const pokemon = state.party[index];
                if (btn.dataset.confirm === 'true') {
                    state.party.splice(index, 1);
                    PT.Engine.GameState.addToLog(state, `Released ${pokemon.name} to make room for a Johto starter.`);
                    PT.App.goto('ELMSTARTER');
                } else {
                    btn.textContent = 'CONFIRM?';
                    btn.dataset.confirm = 'true';
                    btn.classList.add('btn-confirm-danger');
                }
            });
        });
    }

    function renderStarterChoice(container, state) {
        const starters = JOHTO_STARTER_IDS
            .map(id => PT.Data.Pokemon.find(p => p.id === id))
            .filter(Boolean);

        const div = document.createElement('div');
        div.className = 'screen starter-screen';

        if (starters.length < 3) {
            // Johto Pokedex content hasn't landed yet — nothing to offer.
            div.innerHTML = `
                <div class="text-box">
                    <p>PROF. ELM: My Johto starters aren't ready yet — check back soon!</p>
                </div>
                <button class="btn btn-wide" id="btn-elm-skip">CONTINUE TO JOHTO</button>
            `;
            container.appendChild(div);
            document.getElementById('btn-elm-skip').addEventListener('click', () => enterJohto(state));
            return;
        }

        div.innerHTML = `
            <div class="text-box">
                <p>PROF. ELM: Welcome to Johto, ${state.trainerName}! I study Pokemon
                evolution here in New Bark Town.</p>
                <p style="margin-top: 8px;">Every trainer who passes through gets to
                choose a partner. Which will it be?</p>
            </div>
            <div class="starter-choices" id="starter-choices">
                ${starters.map(s => `
                    <div class="starter-card" data-id="${s.id}">
                        <div class="starter-name">${s.name}</div>
                        <img class="starter-sprite" src="${PT.Engine.GameState.getSpriteUrl(s.id, 'johto')}" alt="${s.name}">
                    </div>
                `).join('')}
            </div>
            <button class="btn btn-wide" id="btn-elm-start" disabled>CHOOSE PARTNER</button>
        `;
        container.appendChild(div);

        document.querySelectorAll('.starter-card').forEach(card => {
            card.addEventListener('click', () => {
                document.querySelectorAll('.starter-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedStarter = parseInt(card.dataset.id);
                document.getElementById('btn-elm-start').disabled = false;
            });
        });

        document.getElementById('btn-elm-start').addEventListener('click', () => {
            if (!selectedStarter) return;
            const starterData = PT.Data.Pokemon.find(p => p.id === selectedStarter);
            const partyMember = PT.Engine.GameState.createPartyPokemon(starterData, state);
            state.party.push(partyMember);
            if (!state.pokedexCaught.includes(starterData.id)) state.pokedexCaught.push(starterData.id);
            if (!state.pokedexSeen.includes(starterData.id)) state.pokedexSeen.push(starterData.id);
            PT.Engine.GameState.addToLog(state, `Received ${starterData.name} from Prof. Elm!`);
            // Send-off supplies — Elm stocks you up for the road out of New Bark Town.
            const ELM_FOOD_GIFT = 50;
            state.resources.food += ELM_FOOD_GIFT;
            PT.Engine.GameState.addToLog(state, `Prof. Elm gave you ${ELM_FOOD_GIFT} food for the road!`);
            enterJohto(state);
        });
    }

    function enterJohto(state) {
        // Stamped once so the leaderboard/telemetry layer (engine/scoring.js's
        // getJohtoLeaderboardFields, §13.1-13.2) can later compute "days spent
        // in Johto" as a delta from the run's total daysElapsed.
        if (typeof state.daysElapsedAtJohtoEntry !== 'number') {
            state.daysElapsedAtJohtoEntry = state.daysElapsed;
        }

        const legendaryIds = new Set(PT.Data.Pokemon.filter(p => p.rarity === 'legendary').map(p => p.id));
        PT.Engine.Telemetry.logEvent('johto_entered', {
            party_size: state.party.length,
            party_ids: state.party.map(p => p.id),
            battle_star_total: state.party.reduce((sum, p) => sum + (p.battleStars || 0), 0),
            badge_count: state.badges.filter(b => b !== 'champion').length,
            legendary_in_party: state.party.filter(p => legendaryIds.has(p.id)).length,
            days_elapsed_kanto: state.daysElapsed
        });

        // Route onto the next entry in Routes — the Johto World/Routes content
        // pass appends New Bark Town onward directly after Kanto's final route.
        state.currentLocationIndex++;
        state.distanceTraveled = 0;
        PT.Engine.GameState.saveGame(state);
        PT.App.goto('TRAVEL');
    }
})();

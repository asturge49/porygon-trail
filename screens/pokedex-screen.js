// Porygon Trail - Global Pokedex Screen (persists across playthroughs)
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // §13.2 Kanto/Johto Pokedex toggle — split on National Dex number, same
    // split the games themselves use (Kanto: #1-151, Johto: #152-251). This is
    // independent of §4.1's catch-region sprite rule (a Gen I species caught in
    // Johto still counts as a Kanto dex entry here) — it's just which entries
    // are shown, not how they're drawn.
    let currentRegion = 'all';

    function isJohtoDex(id) {
        return id >= 152 && id <= 251;
    }

    // Region-scoped Seen/Caught/Champions counts for the top tracker —
    // recomputed whenever the region filter changes, not just once at render.
    function computeCounts(dex, allPokemon, region) {
        const inRegion = id => region === 'kanto' ? !isJohtoDex(id) : region === 'johto' ? isJohtoDex(id) : true;
        const totalPokemon = allPokemon.filter(p => inRegion(p.id)).length;
        // MissingNo (id 0) is always Kanto-side, so it only ever counts under ALL/KANTO.
        const hasMissingNo = region !== 'johto' && (dex.seen.includes(0) || dex.caught.includes(0));
        return {
            seenCount: dex.seen.filter(inRegion).length,
            caughtCount: dex.caught.filter(inRegion).length,
            championCount: dex.champions.filter(inRegion).length,
            totalPokemon,
            hasMissingNo
        };
    }

    function renderStats(dex, allPokemon, region) {
        const { seenCount, caughtCount, championCount, totalPokemon, hasMissingNo } = computeCounts(dex, allPokemon, region);
        return `
            <span>Seen: ${seenCount}/${totalPokemon + (hasMissingNo ? 1 : 0)}</span> |
            <span>Caught: ${caughtCount}/${totalPokemon}</span> |
            <span>Champions: ${championCount}</span>
        `;
    }

    PT.Screens.POKEDEX = {
        render(container) {
            currentRegion = 'all';
            const dex = PT.Engine.Scoring.getGlobalPokedex();
            const allPokemon = PT.Data.Pokemon.filter(p => p.id > 0).sort((a, b) => a.id - b.id);
            const hasJohtoDex = allPokemon.some(p => isJohtoDex(p.id));

            const div = document.createElement('div');
            div.className = 'screen pokedex-screen';
            div.innerHTML = `
                <div class="event-title">POKÉDEX</div>
                <div class="pokedex-stats" id="pokedex-stats" style="text-align: center; font-size: 8px; margin-top: 10px; margin-bottom: 6px;">
                    ${renderStats(dex, allPokemon, currentRegion)}
                </div>
                <div class="pokedex-legend" style="text-align: center; font-size: 6px; margin-bottom: 8px;">
                    <span style="opacity: 0.3;">? = Unknown</span> &nbsp;
                    <span>S = Seen</span> &nbsp;
                    <span style="color: var(--gb-darkest);">&#10003; = Caught</span> &nbsp;
                    <span>&#9733; = Champion</span>
                </div>
                ${hasJohtoDex ? `
                <div class="pokedex-filter" style="text-align: center; margin-bottom: 6px;">
                    <button class="btn btn-small pokedex-region-btn active" data-region="all">ALL</button>
                    <button class="btn btn-small pokedex-region-btn" data-region="kanto">KANTO</button>
                    <button class="btn btn-small pokedex-region-btn" data-region="johto">JOHTO</button>
                </div>
                ` : ''}
                <div class="pokedex-grid" id="pokedex-grid">
                    ${renderGrid(allPokemon, dex, currentRegion)}
                </div>
                <div style="text-align: center; margin-top: 8px;">
                    <button class="btn btn-wide" id="btn-pokedex-back">BACK</button>
                </div>
            `;
            container.appendChild(div);

            function refresh() {
                document.getElementById('pokedex-grid').innerHTML = renderGrid(allPokemon, dex, currentRegion);
                document.getElementById('pokedex-stats').innerHTML = renderStats(dex, allPokemon, currentRegion);
            }

            // Kanto/Johto region toggle (§13.2)
            document.querySelectorAll('.pokedex-region-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.pokedex-region-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentRegion = btn.dataset.region;
                    refresh();
                });
            });

            document.getElementById('btn-pokedex-back').addEventListener('click', () => {
                if (PT.App.screenStack.length > 0) {
                    PT.App.pop();
                } else {
                    PT.App.goto('TITLE');
                }
            });
        }
    };

    function renderGrid(allPokemon, dex, region) {
        // Include MissingNo if seen (always Kanto-side, so hide it under a Johto filter)
        let pokemon = [...allPokemon];
        if ((dex.seen.includes(0) || dex.caught.includes(0)) && region !== 'johto') {
            const missingNo = PT.Data.Pokemon.find(p => p.id === 0);
            if (missingNo) pokemon.push(missingNo);
        }

        if (region === 'kanto') pokemon = pokemon.filter(p => !isJohtoDex(p.id));
        if (region === 'johto') pokemon = pokemon.filter(p => isJohtoDex(p.id));

        return pokemon.map(p => {
            const isSeen = dex.seen.includes(p.id);
            const isCaught = dex.caught.includes(p.id);
            const isChampion = dex.champions.includes(p.id);

            const spriteUrl = PT.Engine.GameState.getSpriteUrl(p.id);
            const statusIcon = isChampion ? '&#9733;' : isCaught ? '&#10003;' : isSeen ? 'S' : '?';
            const known = isSeen || isCaught;

            return `
                <div class="pokedex-entry ${isChampion ? 'champion' : isCaught ? 'caught' : isSeen ? 'seen' : 'unknown'}" title="${known ? p.name : '???'} #${p.id === 0 ? '???' : p.id}">
                    ${known
                        ? `<img class="pokedex-sprite" src="${spriteUrl}" alt="${p.name}" onerror="this.style.display='none'">`
                        : `<div class="pokedex-sprite-unknown">?</div>`
                    }
                    <div class="pokedex-entry-name">${known ? p.name : '???'}</div>
                    <div class="pokedex-entry-num">#${p.id === 0 ? '???' : String(p.id).padStart(3, '0')}</div>
                    <div class="pokedex-entry-status">${statusIcon}</div>
                </div>
            `;
        }).join('');
    }
})();

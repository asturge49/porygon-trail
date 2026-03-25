// Porygon Trail - Global Pokedex Screen (persists across playthroughs)
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    PT.Screens.POKEDEX = {
        render(container) {
            const dex = PT.Engine.Scoring.getGlobalPokedex();
            const allPokemon = PT.Data.Pokemon.filter(p => p.id > 0).sort((a, b) => a.id - b.id);

            const seenCount = dex.seen.length;
            const caughtCount = dex.caught.length;
            const championCount = dex.champions.length;
            const totalPokemon = allPokemon.length; // 151 (excluding MissingNo id:0)

            // Check if MissingNo is seen/caught
            const hasMissingNo = dex.seen.includes(0) || dex.caught.includes(0);

            const div = document.createElement('div');
            div.className = 'screen pokedex-screen';
            div.innerHTML = `
                <div class="event-title">POKÉDEX</div>
                <div class="pokedex-stats" style="text-align: center; font-size: 8px; margin-bottom: 6px;">
                    <span>Seen: ${seenCount}/${totalPokemon + (hasMissingNo ? 1 : 0)}</span> |
                    <span>Caught: ${caughtCount}/${totalPokemon}</span> |
                    <span>Champions: ${championCount}</span>
                </div>
                <div class="pokedex-legend" style="text-align: center; font-size: 6px; margin-bottom: 8px;">
                    <span style="opacity: 0.3;">? = Unknown</span> &nbsp;
                    <span>&#128065; = Seen</span> &nbsp;
                    <span style="color: var(--gb-darkest);">&#9679; = Caught</span> &nbsp;
                    <span>&#9733; = Champion</span>
                </div>
                <div class="pokedex-filter" style="text-align: center; margin-bottom: 6px;">
                    <button class="btn btn-small pokedex-filter-btn active" data-filter="all">ALL</button>
                    <button class="btn btn-small pokedex-filter-btn" data-filter="seen">SEEN</button>
                    <button class="btn btn-small pokedex-filter-btn" data-filter="caught">CAUGHT</button>
                    <button class="btn btn-small pokedex-filter-btn" data-filter="champion">CHAMPS</button>
                    <button class="btn btn-small pokedex-filter-btn" data-filter="unknown">UNKNOWN</button>
                </div>
                <div class="pokedex-grid" id="pokedex-grid">
                    ${renderGrid(allPokemon, dex, 'all')}
                </div>
                <div style="text-align: center; margin-top: 8px;">
                    <button class="btn btn-wide" id="btn-pokedex-back">BACK</button>
                </div>
            `;
            container.appendChild(div);

            // Filter buttons
            document.querySelectorAll('.pokedex-filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.pokedex-filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    document.getElementById('pokedex-grid').innerHTML = renderGrid(allPokemon, dex, btn.dataset.filter);
                });
            });

            document.getElementById('btn-pokedex-back').addEventListener('click', () => {
                PT.App.goto('TITLE');
            });
        }
    };

    function renderGrid(allPokemon, dex, filter) {
        // Include MissingNo if seen
        let pokemon = [...allPokemon];
        if (dex.seen.includes(0) || dex.caught.includes(0)) {
            const missingNo = PT.Data.Pokemon.find(p => p.id === 0);
            if (missingNo) pokemon.push(missingNo);
        }

        return pokemon.map(p => {
            const isSeen = dex.seen.includes(p.id);
            const isCaught = dex.caught.includes(p.id);
            const isChampion = dex.champions.includes(p.id);

            // Apply filter
            if (filter === 'seen' && !isSeen) return '';
            if (filter === 'caught' && !isCaught) return '';
            if (filter === 'champion' && !isChampion) return '';
            if (filter === 'unknown' && (isSeen || isCaught)) return '';

            const spriteUrl = PT.Engine.GameState.getSpriteUrl(p.id);
            const statusIcon = isChampion ? '&#9733;' : isCaught ? '&#9679;' : isSeen ? '&#128065;' : '?';
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

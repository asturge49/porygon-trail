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

            document.getElementById('pokedex-grid').addEventListener('click', (e) => {
                const entry = e.target.closest('.pokedex-entry[data-known="true"]');
                if (!entry) return;
                const data = PT.Data.Pokemon.find(p => p.id === parseInt(entry.dataset.id, 10));
                if (data) showPokedexProfile(data, dex);
            });
        }
    };

    // Species-level profile popup for a Pokedex entry — same visual language
    // as travel-screen.js's showPokemonProfile (party member profile), but
    // for a species aggregated across every playthrough rather than one live
    // party instance, so there's no HP/status/battle record/caught-location
    // to show and no potion/candy/butcher actions to take. Ability, rarity,
    // evolution chain, and food cost are all fixed per species and safe to
    // read straight off PT.Data.Pokemon.
    function showPokedexProfile(data, dex) {
        const abilityDesc = {
            cut: 'Forages extra food while traveling',
            surf: 'Bonus miles on water routes',
            fly: 'Scouts shortcuts for bonus miles',
            strength: 'Reduces injury chance on risky travel',
            flash: 'Finds hidden money and items',
            dig: 'Guarantees escape from wild encounters',
            fire: 'Efficient cooking saves food',
            heal: 'Passively heals injured party members',
            psychic: 'Foresight: choose between encounters/events',
            poison: 'Battle win bonus',
            guard: 'Chance to block injuries entirely',
            intimidate: 'Catch rate bonus + battle win bonus',
            payday: 'Bonus money on all rewards',
            safeguard: 'Saves a Pokemon from death once',
            system_restore: 'Revive one lost Pokemon (once per game)',
            glitch: 'Unpredictable chaos effects',
            mimic: 'Copies the strongest ability in your party',
            aurora_veil: 'All party damage reduced by 1',
            thunderclap: 'Double travel distance on all paces',
            sacred_flame: 'Zero food consumption',
            psychic_dominance: '+50% win chance on all battles',
            miracle: 'Random powerful bonus effect every day'
        };

        const isSeen = dex.seen.includes(data.id);
        const isCaught = dex.caught.includes(data.id);
        const isChampion = dex.champions.includes(data.id);

        const evoChain = PT.Engine.GameState.getEvoChain(data.id);
        const evoStage = evoChain.findIndex(e => e.id === data.id) + 1;
        const evoChainDisplay = evoChain.map(e =>
            e.id === data.id ? `<strong>[${e.name}]</strong>` : e.name
        ).join(' → ');
        const isFinal = PT.Engine.GameState.isFinalEvolution(data);
        const foodCost = PT.Engine.GameState.getFoodCost ? PT.Engine.GameState.getFoodCost(data) : '?';
        const spriteUrl = PT.Engine.GameState.getSpriteUrl(data.id);

        const overlay = document.createElement('div');
        overlay.className = 'day-recap-overlay';
        overlay.innerHTML = `
            <div class="pokemon-profile-popup">
                <div class="profile-header">
                    <img class="profile-sprite" src="${spriteUrl}" alt="${data.name}"
                         onerror="this.style.display='none'">
                    <div class="profile-header-info">
                        <div class="profile-name">${data.name}</div>
                        <div class="profile-types">${data.types.join(' / ')} | ${data.rarity.toUpperCase()}</div>
                        <div class="profile-status">${isChampion ? '★ CHAMPION' : isCaught ? '✓ CAUGHT' : 'SEEN'}</div>
                    </div>
                </div>

                <div class="profile-section">
                    <div class="profile-row"><span class="profile-label">Ability:</span> <span>${data.travelAbility || 'none'}</span> <span class="profile-desc">${abilityDesc[data.travelAbility] || ''}</span></div>
                    <div class="profile-row"><span class="profile-label">Evolution:</span> ${evoChainDisplay} ${isFinal ? '✓ Final' : `(${evoStage}/${evoChain.length})`}</div>
                    <div class="profile-row"><span class="profile-label">Food/day:</span> ${foodCost} ration${foodCost !== 1 ? 's' : ''}</div>
                </div>

                <div class="profile-actions" style="grid-template-columns: 1fr;">
                    <button class="btn btn-small profile-action-btn" id="pokedex-profile-close">CLOSE</button>
                </div>
            </div>
        `;
        document.querySelector('.pokedex-screen').appendChild(overlay);

        document.getElementById('pokedex-profile-close').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
    }

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
            const clickable = known && p.id !== 0;

            return `
                <div class="pokedex-entry ${isChampion ? 'champion' : isCaught ? 'caught' : isSeen ? 'seen' : 'unknown'}" title="${known ? p.name : '???'} #${p.id === 0 ? '???' : p.id}" data-id="${p.id}" data-known="${clickable}" style="${clickable ? 'cursor: pointer;' : ''}">
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

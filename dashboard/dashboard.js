// Porygon Trail - Ops Dex
// Read-only internal reporting dashboard. Queries the PRODUCTION Supabase project
// directly with the public anon key (same key already shipped in engine/config.js) —
// pt_leaderboard, pt_profiles and pt_events all carry "select using (true)" RLS
// policies (see supabase/schema.sql), so no service-role secret is needed here.
// Static site, no build step, matches the main game's conventions.
(function() {
    const SUPABASE_URL = 'https://anxkyksrmvtsmhdaktrq.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFueGt5a3NybXZ0c21oZGFrdHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTMxODksImV4cCI6MjEwMzE4OTE4OX0.U2QcSjNMGqRvg82rbG1oHrQOr-i_Lfb-oeBLRJmP-2k';

    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const CHART_COLORS = ['#33ff8c', '#ffb020', '#d21a1a', '#7fe6ff', '#c78bff', '#ff8bcb', '#6ba585'];

    // Progression order of every location, id/name/region only (mirrors data/routes.js
    // array order 1:1 — index here === state.currentLocationIndex === payload.route_index
    // in a game_over event). Kept as a compact copy rather than loading the full
    // routes.js (which also carries encounter tables/event pools this dashboard has
    // no use for) — this project's Vercel deploy root is dashboard/, so a file outside
    // it isn't reachable at runtime anyway.
    const ROUTE_ORDER = [
        ["pallet_town", "Pallet Town", "kanto"], ["route_1", "Route 1", "kanto"],
        ["viridian_city", "Viridian City", "kanto"], ["viridian_forest", "Viridian Forest", "kanto"],
        ["pewter_city", "Pewter City", "kanto"], ["mt_moon", "Mt. Moon", "kanto"],
        ["cerulean_city", "Cerulean City", "kanto"], ["route_5", "Route 5", "kanto"],
        ["route_6", "Route 6", "kanto"], ["vermilion_city", "Vermilion City", "kanto"],
        ["route_8", "Route 8", "kanto"], ["rock_tunnel", "Rock Tunnel", "kanto"],
        ["lavender_town", "Lavender Town", "kanto"], ["route_8_celadon", "Route 7", "kanto"],
        ["celadon_city", "Celadon City", "kanto"], ["saffron_city", "Saffron City", "kanto"],
        ["cycling_road", "Cycling Road", "kanto"], ["fuchsia_city", "Fuchsia City", "kanto"],
        ["sea_route_19", "Sea Route 19", "kanto"], ["sea_route_20", "Sea Route 20", "kanto"],
        ["seafoam_islands", "Seafoam Islands", "kanto"], ["cinnabar_island", "Cinnabar Island", "kanto"],
        ["route_21", "Route 21", "kanto"], ["viridian_city_return", "Viridian City (Return Trip)", "kanto"],
        ["route_22", "Route 22", "kanto"], ["route_23", "Route 23", "kanto"],
        ["victory_road", "Victory Road", "kanto"], ["indigo_plateau", "Indigo Plateau", "kanto"],
        ["pokemon_league", "Pokemon League (Kanto E4)", "kanto"],
        ["new_bark_town", "New Bark Town", "johto"], ["route_29", "Route 29", "johto"],
        ["cherrygrove_city", "Cherrygrove City", "johto"], ["route_30", "Route 30", "johto"],
        ["route_31", "Route 31", "johto"], ["violet_city", "Violet City", "johto"],
        ["route_32", "Route 32", "johto"], ["union_cave", "Union Cave", "johto"],
        ["route_33", "Route 33", "johto"], ["azalea_town", "Azalea Town", "johto"],
        ["slowpoke_well", "Slowpoke Well", "johto"], ["route_34", "Route 34", "johto"],
        ["goldenrod_city", "Goldenrod City", "johto"], ["route_35", "Route 35", "johto"],
        ["national_park", "National Park", "johto"], ["route_36", "Route 36", "johto"],
        ["route_37", "Route 37", "johto"], ["ecruteak_city", "Ecruteak City", "johto"],
        ["route_38", "Route 38", "johto"], ["route_39", "Route 39", "johto"],
        ["olivine_city", "Olivine City", "johto"], ["route_40", "Route 40", "johto"],
        ["route_41", "Route 41", "johto"], ["cianwood_city", "Cianwood City", "johto"],
        ["route_42", "Route 42", "johto"], ["mt_mortar", "Mt. Mortar", "johto"],
        ["mahogany_town", "Mahogany Town", "johto"], ["lake_of_rage", "Lake of Rage", "johto"],
        ["route_44", "Route 44", "johto"], ["ice_path", "Ice Path", "johto"],
        ["blackthorn_city", "Blackthorn City", "johto"], ["dragons_den", "Dragon's Den", "johto"],
        ["victory_road_johto", "Victory Road (Johto)", "johto"],
        ["indigo_plateau_johto", "Indigo Plateau (Johto E4)", "johto"],
        ["route_28_mt_silver", "Route 28 / Mt. Silver", "johto"]
    ].map(([id, name, region]) => ({ id, name, region }));

    // id -> [name, travelAbility], compact copy of data/pokemon.js (name +
    // travelAbility only — the rest of that file, moveset/encounter tables
    // etc., has no use here). Same "can't reach files outside dashboard/'s
    // Vercel deploy root" reasoning as ROUTE_ORDER above.
    const POKEMON_INFO = Object.fromEntries([
        [1,"Bulbasaur","cut"],[2,"Ivysaur","cut"],[3,"Venusaur","cut"],[4,"Charmander","fire"],[5,"Charmeleon","fire"],
        [6,"Charizard","fire"],[7,"Squirtle","surf"],[8,"Wartortle","surf"],[9,"Blastoise","surf"],[10,"Caterpie","cut"],
        [11,"Metapod","guard"],[12,"Butterfree","fly"],[13,"Weedle","poison"],[14,"Kakuna","guard"],[15,"Beedrill","poison"],
        [16,"Pidgey","fly"],[17,"Pidgeotto","fly"],[18,"Pidgeot","fly"],[19,"Rattata","dig"],[20,"Raticate","dig"],
        [21,"Spearow","fly"],[22,"Fearow","fly"],[23,"Ekans","poison"],[24,"Arbok","intimidate"],[25,"Pikachu","flash"],
        [26,"Raichu","flash"],[27,"Sandshrew","dig"],[28,"Sandslash","dig"],[29,"Nidoran F","poison"],[30,"Nidorina","poison"],
        [31,"Nidoqueen","strength"],[32,"Nidoran M","poison"],[33,"Nidorino","poison"],[34,"Nidoking","strength"],[35,"Clefairy","heal"],
        [36,"Clefable","heal"],[37,"Vulpix","fire"],[38,"Ninetales","fire"],[39,"Jigglypuff","heal"],[40,"Wigglytuff","heal"],
        [41,"Zubat","fly"],[42,"Golbat","fly"],[43,"Oddish","cut"],[44,"Gloom","poison"],[45,"Vileplume","poison"],
        [46,"Paras","cut"],[47,"Parasect","cut"],[48,"Venonat","poison"],[49,"Venomoth","psychic"],[50,"Diglett","dig"],
        [51,"Dugtrio","dig"],[52,"Meowth","payday"],[53,"Persian","payday"],[54,"Psyduck","surf"],[55,"Golduck","surf"],
        [56,"Mankey","strength"],[57,"Primeape","strength"],[58,"Growlithe","fire"],[59,"Arcanine","intimidate"],[60,"Poliwag","surf"],
        [61,"Poliwhirl","surf"],[62,"Poliwrath","strength"],[63,"Abra","psychic"],[64,"Kadabra","psychic"],[65,"Alakazam","psychic"],
        [66,"Machop","strength"],[67,"Machoke","strength"],[68,"Machamp","strength"],[69,"Bellsprout","cut"],[70,"Weepinbell","cut"],
        [71,"Victreebel","cut"],[72,"Tentacool","surf"],[73,"Tentacruel","surf"],[74,"Geodude","guard"],[75,"Graveler","guard"],
        [76,"Golem","guard"],[77,"Ponyta","fire"],[78,"Rapidash","fire"],[79,"Slowpoke","psychic"],[80,"Slowbro","psychic"],
        [81,"Magnemite","flash"],[82,"Magneton","flash"],[83,"Farfetchd","cut"],[84,"Doduo","fly"],[85,"Dodrio","fly"],
        [86,"Seel","surf"],[87,"Dewgong","surf"],[88,"Grimer","poison"],[89,"Muk","poison"],[90,"Shellder","guard"],
        [91,"Cloyster","guard"],[92,"Gastly","psychic"],[93,"Haunter","psychic"],[94,"Gengar","psychic"],[95,"Onix","strength"],
        [96,"Drowzee","psychic"],[97,"Hypno","psychic"],[98,"Krabby","surf"],[99,"Kingler","strength"],[100,"Voltorb","flash"],
        [101,"Electrode","flash"],[102,"Exeggcute","psychic"],[103,"Exeggutor","psychic"],[104,"Cubone","dig"],[105,"Marowak","dig"],
        [106,"Hitmonlee","strength"],[107,"Hitmonchan","strength"],[108,"Lickitung","heal"],[109,"Koffing","poison"],[110,"Weezing","poison"],
        [111,"Rhyhorn","guard"],[112,"Rhydon","guard"],[113,"Chansey","safeguard"],[114,"Tangela","cut"],[115,"Kangaskhan","strength"],
        [116,"Horsea","surf"],[117,"Seadra","surf"],[118,"Goldeen","surf"],[119,"Seaking","surf"],[120,"Staryu","flash"],
        [121,"Starmie","flash"],[122,"Mr. Mime","psychic"],[123,"Scyther","cut"],[124,"Jynx","psychic"],[125,"Electabuzz","flash"],
        [126,"Magmar","fire"],[127,"Pinsir","strength"],[128,"Tauros","intimidate"],[129,"Magikarp","surf"],[130,"Gyarados","intimidate"],
        [131,"Lapras","surf"],[132,"Ditto","mimic"],[133,"Eevee","heal"],[134,"Vaporeon","surf"],[135,"Jolteon","flash"],
        [136,"Flareon","fire"],[137,"Porygon","system_restore"],[138,"Omanyte","surf"],[139,"Omastar","guard"],[140,"Kabuto","guard"],
        [141,"Kabutops","cut"],[142,"Aerodactyl","fly"],[143,"Snorlax","guard"],[144,"Articuno","aurora_veil"],[145,"Zapdos","thunderclap"],
        [146,"Moltres","sacred_flame"],[147,"Dratini","surf"],[148,"Dragonair","surf"],[149,"Dragonite","fly"],[150,"Mewtwo","psychic_dominance"],
        [151,"Mew","miracle"],[152,"Chikorita","cut"],[153,"Bayleef","cut"],[154,"Meganium","heal"],[155,"Cyndaquil","fire"],
        [156,"Quilava","fire"],[157,"Typhlosion","fire"],[158,"Totodile","strength"],[159,"Croconaw","strength"],[160,"Feraligatr","strength"],
        [161,"Sentret","dig"],[162,"Furret","dig"],[163,"Hoothoot","fly"],[164,"Noctowl","psychic"],[165,"Ledyba","cut"],
        [166,"Ledian","cut"],[167,"Spinarak","poison"],[168,"Ariados","poison"],[169,"Crobat","fly"],[170,"Chinchou","flash"],
        [171,"Lanturn","flash"],[172,"Pichu","flash"],[173,"Cleffa","miracle"],[174,"Igglybuff","heal"],[175,"Togepi","miracle"],
        [176,"Togetic","miracle"],[177,"Natu","psychic"],[178,"Xatu","psychic"],[179,"Mareep","flash"],[180,"Flaaffy","flash"],
        [181,"Ampharos","flash"],[182,"Bellossom","heal"],[183,"Marill","surf"],[184,"Azumarill","surf"],[185,"Sudowoodo","strength"],
        [186,"Politoed","surf"],[187,"Hoppip","fly"],[188,"Skiploom","fly"],[189,"Jumpluff","fly"],[190,"Aipom","dig"],
        [191,"Sunkern","heal"],[192,"Sunflora","heal"],[193,"Yanma","fly"],[194,"Wooper","surf"],[195,"Quagsire","surf"],
        [196,"Espeon","psychic"],[197,"Umbreon","intimidate"],[198,"Murkrow","flash"],[199,"Slowking","psychic"],[200,"Misdreavus","flash"],
        [201,"Unown","mimic"],[202,"Wobbuffet","guard"],[203,"Girafarig","psychic"],[204,"Pineco","guard"],[205,"Forretress","guard"],
        [206,"Dunsparce","dig"],[207,"Gligar","fly"],[208,"Steelix","guard"],[209,"Snubbull","intimidate"],[210,"Granbull","intimidate"],
        [211,"Qwilfish","poison"],[212,"Scizor","intimidate"],[213,"Shuckle","guard"],[214,"Heracross","strength"],[215,"Sneasel","flash"],
        [216,"Teddiursa","strength"],[217,"Ursaring","strength"],[218,"Slugma","fire"],[219,"Magcargo","fire"],[220,"Swinub","dig"],
        [221,"Piloswine","strength"],[222,"Corsola","surf"],[223,"Remoraid","surf"],[224,"Octillery","surf"],[225,"Delibird","fly"],
        [226,"Mantine","surf"],[227,"Skarmory","fly"],[228,"Houndour","intimidate"],[229,"Houndoom","intimidate"],[230,"Kingdra","surf"],
        [231,"Phanpy","strength"],[232,"Donphan","strength"],[233,"Porygon2","system_restore"],[234,"Stantler","psychic"],[235,"Smeargle","mimic"],
        [236,"Tyrogue","strength"],[237,"Hitmontop","strength"],[238,"Smoochum","psychic"],[239,"Elekid","flash"],[240,"Magby","fire"],
        [241,"Miltank","heal"],[242,"Blissey","heal"],[243,"Raikou","thunderclap"],[244,"Entei","sacred_flame"],[245,"Suicune","safeguard"],
        [246,"Larvitar","strength"],[247,"Pupitar","strength"],[248,"Tyranitar","intimidate"],[249,"Lugia","psychic_dominance"],[250,"Ho-Oh","sacred_flame"],
        [0,"MissingNo.","glitch"]
    ].map(([id, name, ability]) => [id, { name, ability }]));

    function pokemonName(id) {
        return (POKEMON_INFO[id] && POKEMON_INFO[id].name) || `#${id}`;
    }

    function pokemonAbility(id) {
        return (POKEMON_INFO[id] && POKEMON_INFO[id].ability) || 'unknown';
    }

    // id -> next evolution id, or [ids] for a branching evolution (Gloom, Poliwhirl,
    // Slowpoke, Eevee, Tyrogue) — compact copy of data/pokemon.js's evolvesTo field,
    // same reasoning as ROUTE_ORDER/POKEMON_INFO above.
    const EVOLVES_TO = {
        1:2, 2:3, 4:5, 5:6, 7:8, 8:9, 10:11, 11:12, 13:14, 14:15, 16:17, 17:18, 19:20,
        21:22, 23:24, 25:26, 27:28, 29:30, 30:31, 32:33, 33:34, 35:36, 37:38, 39:40,
        41:42, 42:169, 43:44, 44:[45,182], 46:47, 48:49, 50:51, 52:53, 54:55, 56:57,
        58:59, 60:61, 61:[62,186], 63:64, 64:65, 66:67, 67:68, 69:70, 70:71, 72:73,
        74:75, 75:76, 77:78, 79:[80,199], 81:82, 84:85, 86:87, 88:89, 90:91, 92:93,
        93:94, 95:208, 96:97, 98:99, 100:101, 102:103, 104:105, 109:110, 111:112,
        113:242, 116:117, 117:230, 118:119, 120:121, 123:212, 129:130, 133:[134,135,136],
        137:233, 138:139, 140:141, 147:148, 148:149, 152:153, 153:154, 155:156, 156:157,
        158:159, 159:160, 161:162, 163:164, 165:166, 167:168, 170:171, 172:25, 173:35,
        174:39, 175:176, 177:178, 179:180, 180:181, 183:184, 187:188, 188:189, 191:192,
        194:195, 204:205, 209:210, 216:217, 218:219, 220:221, 223:224, 228:229, 231:232,
        236:[106,107,237], 238:124, 239:125, 240:126, 246:247, 247:248
    };

    // Given one run's champion_ids (a lineage's base form plus every pre-evolution
    // padded in for Pokedex credit — see getChampionIdsFromParty in
    // engine/scoring.js), keeps only the highest-stage form actually present: an id
    // is dropped if any of its own evolution targets is also in the same set, since
    // that means a later stage of the same mon was the one actually on the team.
    function highestFormsInSet(ids) {
        const set = new Set(ids);
        return ids.filter(id => {
            const next = EVOLVES_TO[id];
            if (next === undefined) return true;
            const targets = Array.isArray(next) ? next : [next];
            return !targets.some(t => set.has(t));
        });
    }

    const app = document.getElementById('app');
    const refreshEl = document.getElementById('last-refresh');

    // Fetches every row of a table page-by-page (Supabase REST caps at 1000/request).
    async function fetchAll(table, columns) {
        const PAGE = 1000;
        let from = 0;
        let rows = [];
        while (true) {
            const { data, error } = await client.from(table).select(columns).range(from, from + PAGE - 1);
            if (error) throw new Error(`${table}: ${error.message}`);
            rows = rows.concat(data);
            if (data.length < PAGE) break;
            from += PAGE;
        }
        return rows;
    }

    function pct(n, d) {
        if (!d) return '0%';
        return `${Math.round((n / d) * 100)}%`;
    }

    function avg(nums) {
        if (!nums.length) return 0;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    function dayKey(dateStr) {
        return new Date(dateStr).toISOString().slice(0, 10);
    }

    // dayKey of N days before today (UTC, matching dayKey's own toISOString basis).
    function daysAgoKey(n) {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - n);
        return dayKey(d);
    }

    // The set of dayKeys covering today and the (n-1) days before it.
    function keySetForLastNDays(n) {
        const set = new Set();
        for (let i = 0; i < n; i++) set.add(daysAgoKey(i));
        return set;
    }

    function statCard(label, value, cls) {
        return `<div class="stat-card">
            <div class="stat-label">${label}</div>
            <div class="stat-value${cls ? ' ' + cls : ''}">${value}</div>
        </div>`;
    }

    function buildLineChart(canvasId, labels, series) {
        return new Chart(document.getElementById(canvasId), {
            type: 'line',
            data: { labels, datasets: series },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: '#c9ffdd', font: { family: 'VT323', size: 14 } } } },
                scales: {
                    x: { ticks: { color: '#6ba585' }, grid: { color: '#1d4a2c' } },
                    y: { ticks: { color: '#6ba585' }, grid: { color: '#1d4a2c' }, beginAtZero: true }
                }
            }
        });
    }

    function buildBarChart(canvasId, labels, data, label) {
        new Chart(document.getElementById(canvasId), {
            type: 'bar',
            data: {
                labels,
                datasets: [{ label, data, backgroundColor: CHART_COLORS }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#6ba585' }, grid: { display: false } },
                    y: { ticks: { color: '#6ba585' }, grid: { color: '#1d4a2c' }, beginAtZero: true }
                }
            }
        });
    }

    function buildHBarChart(canvasId, labels, data, label, xStepSize) {
        return new Chart(document.getElementById(canvasId), {
            type: 'bar',
            data: {
                labels,
                datasets: [{ label, data, backgroundColor: CHART_COLORS[0] }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#6ba585', stepSize: xStepSize }, grid: { color: '#1d4a2c' }, beginAtZero: true },
                    y: { ticks: { color: '#6ba585' }, grid: { display: false } }
                }
            }
        });
    }

    function buildDoughnut(canvasId, labels, data) {
        new Chart(document.getElementById(canvasId), {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: CHART_COLORS }] },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom', labels: { color: '#c9ffdd', font: { family: 'VT323', size: 14 } } } }
            }
        });
    }

    function topN(counts, n) {
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
    }

    function allSorted(counts) {
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }

    // Height (px) for a horizontal bar chart tall enough to fit every row legibly.
    function tallChartHeight(rowCount) {
        return Math.max(280, rowCount * 20);
    }

    const SEE_MORE_STEP = 10;

    // Wires a "See More" button that reveals SEE_MORE_STEP more rows of a horizontal
    // bar chart per click, growing its container to match. entries is the FULL
    // [label, value] list; the chart itself is created already showing the first page.
    function setupSeeMore(btnId, wrapId, chart, entries, itemLabel) {
        itemLabel = itemLabel || 'TRAINERS';
        const btn = document.getElementById(btnId);
        const wrap = document.getElementById(wrapId);
        if (!btn) return;
        if (entries.length <= SEE_MORE_STEP) {
            btn.style.display = 'none';
            return;
        }
        let shown = SEE_MORE_STEP;
        btn.addEventListener('click', () => {
            shown = Math.min(entries.length, shown + SEE_MORE_STEP);
            const page = entries.slice(0, shown);
            chart.data.labels = page.map(x => x[0]);
            chart.data.datasets[0].data = page.map(x => x[1]);
            wrap.style.height = `${tallChartHeight(shown)}px`;
            chart.resize();
            chart.update();
            if (shown >= entries.length) {
                btn.textContent = `ALL ${itemLabel} SHOWN`;
                btn.disabled = true;
            } else {
                btn.textContent = `SEE MORE ▼ (${shown}/${entries.length})`;
            }
        });
        btn.textContent = `SEE MORE ▼ (${shown}/${entries.length})`;
    }

    // Creates a horizontal bar chart pre-loaded with just the first SEE_MORE_STEP
    // rows of `sortedEntries` ([label, value], already sorted desc) and wires its
    // See More button. Bundles the "build the initial page + wire the button"
    // pair used by every top-N-with-See-More chart on this dashboard.
    function buildTopNWithSeeMore(canvasId, wrapId, btnId, sortedEntries, xLabel, itemLabel, xStepSize) {
        const page = sortedEntries.slice(0, SEE_MORE_STEP);
        const chart = buildHBarChart(canvasId, page.map(x => x[0]), page.map(x => x[1]), xLabel, xStepSize);
        setupSeeMore(btnId, wrapId, chart, sortedEntries, itemLabel);
        return chart;
    }

    // Wires the day-range toggle buttons (7d/30d) for a line chart, re-slicing from
    // the FULL (unsliced) day-labels/values arrays.
    function setupRangeToggle(groupSelector, chart, fullLabels, fullData) {
        const buttons = document.querySelectorAll(`${groupSelector} .range-btn`);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const range = parseInt(btn.dataset.range, 10);
                chart.data.labels = fullLabels.slice(-range);
                chart.data.datasets[0].data = fullData.slice(-range);
                chart.update();
            });
        });
    }

    // Each session_heartbeat fires every HEARTBEAT_MS (30s) while the tab is
    // foregrounded — see engine/telemetry.js. So 1 heartbeat = 0.5 minutes.
    const MINUTES_PER_HEARTBEAT = 30000 / 60000;

    function render(profiles, leaderboard, events) {
        const profilesCount = profiles.length;
        const usernameById = {};
        profiles.forEach(p => { usernameById[p.id] = p.username; });
        const nameFor = (userId) => usernameById[userId] || (userId ? `Unknown (${userId.slice(0, 8)})` : 'Unknown');

        const totalRuns = leaderboard.length;
        const completedRuns = leaderboard.filter(r => r.status !== 'in_progress');
        const e4Clears = leaderboard.filter(r => r.kanto_e4_cleared).length;
        const johtoEntries = leaderboard.filter(r => r.johto_completed === true).length;

        // ----- Date windows (UTC) for the recency stat groups below -----
        const todayKey = daysAgoKey(0);
        const yesterdayKey = daysAgoKey(1);
        const last7Keys = keySetForLastNDays(7);
        const last30Keys = keySetForLastNDays(30);

        // ----- New trainers / runs logged, by recency window -----
        const newTrainersLast30 = profiles.filter(p => last30Keys.has(dayKey(p.created_at))).length;
        const newTrainersLast7 = profiles.filter(p => last7Keys.has(dayKey(p.created_at))).length;
        const newTrainersYesterday = profiles.filter(p => dayKey(p.created_at) === yesterdayKey).length;
        const newTrainersToday = profiles.filter(p => dayKey(p.created_at) === todayKey).length;

        const runsLoggedLast30 = leaderboard.filter(r => last30Keys.has(dayKey(r.created_at))).length;
        const runsLoggedLast7 = leaderboard.filter(r => last7Keys.has(dayKey(r.created_at))).length;
        const runsLoggedYesterday = leaderboard.filter(r => dayKey(r.created_at) === yesterdayKey).length;
        const runsLoggedToday = leaderboard.filter(r => dayKey(r.created_at) === todayKey).length;

        // ----- Red capstone battle: challenged vs. won -----
        // capstone_result fires exactly once per run that reaches Red and resolves
        // the fight — red_mons_defeated === 6 on a full clear (see
        // screens/red-capstone-screen.js), anything less on a party-wipe loss.
        const capstoneResults = events.filter(e => e.event_type === 'capstone_result');
        const redChallenges = capstoneResults.length;
        const redWins = capstoneResults.filter(e => e.payload && e.payload.red_mons_defeated === 6).length;

        // ----- Runs per day (last 30 days with data) -----
        // Bucketed by created_at, not the `date` column — that's a locale-formatted
        // string (e.g. "29/8/2026" vs "29.08.2026" for the same day) and fragments
        // a single day across multiple labels.
        const runsByDay = {};
        leaderboard.forEach(r => {
            const k = dayKey(r.created_at);
            runsByDay[k] = (runsByDay[k] || 0) + 1;
        });
        const dayLabels = Object.keys(runsByDay).sort().slice(-30);
        const dayCounts = dayLabels.map(d => runsByDay[d]);

        // ----- Starter popularity (from game_start events) -----
        const starterCounts = {};
        events.filter(e => e.event_type === 'game_start').forEach(e => {
            const name = (e.payload && e.payload.starter_name) || 'Unknown';
            starterCounts[name] = (starterCounts[name] || 0) + 1;
        });
        const starterTop = topN(starterCounts, 8);

        // ----- Game over reasons -----
        const reasonCounts = {};
        events.filter(e => e.event_type === 'game_over').forEach(e => {
            const reason = (e.payload && e.payload.reason) || 'unknown';
            reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        });

        // ----- Score buckets -----
        const buckets = [0, 200, 400, 600, 800, 1000, 1500, 2000];
        const bucketLabels = buckets.map((b, i) => i < buckets.length - 1 ? `${b}-${buckets[i + 1]}` : `${b}+`);
        const bucketCounts = new Array(buckets.length).fill(0);
        leaderboard.forEach(r => {
            let idx = buckets.findIndex((b, i) => r.score >= b && (i === buckets.length - 1 || r.score < buckets[i + 1]));
            if (idx < 0) idx = buckets.length - 1;
            bucketCounts[idx]++;
        });

        // ----- Accounts created per day (last 30 days with data) -----
        const accountsByDay = {};
        profiles.forEach(p => {
            const k = dayKey(p.created_at);
            accountsByDay[k] = (accountsByDay[k] || 0) + 1;
        });
        const accountDayLabels = Object.keys(accountsByDay).sort().slice(-30);
        const accountDayCounts = accountDayLabels.map(d => accountsByDay[d]);

        // ----- Top scores table -----
        const topScores = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 15);

        // ----- Heartbeats: time-on-page (session_heartbeat, 1 beat = 0.5 min) -----
        const heartbeats = events.filter(e => e.event_type === 'session_heartbeat');

        const heartbeatsByUserAllTime = {};
        const heartbeatsByUserToday = {};
        const heartbeatsByUserYesterday = {};
        const heartbeatsByUserLast7 = {};
        const heartbeatsByDay = {};
        heartbeats.forEach(e => {
            heartbeatsByUserAllTime[e.user_id] = (heartbeatsByUserAllTime[e.user_id] || 0) + 1;
            const d = dayKey(e.created_at);
            heartbeatsByDay[d] = (heartbeatsByDay[d] || 0) + 1;
            if (d === todayKey) heartbeatsByUserToday[e.user_id] = (heartbeatsByUserToday[e.user_id] || 0) + 1;
            if (d === yesterdayKey) heartbeatsByUserYesterday[e.user_id] = (heartbeatsByUserYesterday[e.user_id] || 0) + 1;
            if (last7Keys.has(d)) heartbeatsByUserLast7[e.user_id] = (heartbeatsByUserLast7[e.user_id] || 0) + 1;
        });

        // ----- Trainers over hour-played thresholds, by recency window -----
        const HOUR_THRESHOLDS = [1, 3, 5, 10];
        function countsAboveHourThresholds(heartbeatCountsByUser) {
            const hours = Object.values(heartbeatCountsByUser).map(c => (c * MINUTES_PER_HEARTBEAT) / 60);
            return HOUR_THRESHOLDS.map(t => hours.filter(h => h > t).length);
        }
        const [allTimeOver1h, allTimeOver3h, allTimeOver5h, allTimeOver10h] = countsAboveHourThresholds(heartbeatsByUserAllTime);
        const [last7Over1h, last7Over3h, last7Over5h, last7Over10h] = countsAboveHourThresholds(heartbeatsByUserLast7);
        const [yesterdayOver1h, yesterdayOver3h, yesterdayOver5h, yesterdayOver10h] = countsAboveHourThresholds(heartbeatsByUserYesterday);
        const [todayOver1h, todayOver3h, todayOver5h, todayOver10h] = countsAboveHourThresholds(heartbeatsByUserToday);

        // Total hours on the trail: all heartbeats, and the subset logged by users
        // who have at least one completed run (status !== 'in_progress') — excludes
        // time from users who only ever loaded the page or abandoned mid-run.
        const completedUserIds = new Set(completedRuns.map(r => r.user_id));
        const totalHoursAll = (heartbeats.length * MINUTES_PER_HEARTBEAT) / 60;
        const totalHoursCompletedUsers = (heartbeats.filter(e => completedUserIds.has(e.user_id)).length * MINUTES_PER_HEARTBEAT) / 60;
        const avgHoursPerCompletedTrainer = completedUserIds.size ? totalHoursCompletedUsers / completedUserIds.size : 0;
        const avgRunsPerCompletedTrainer = completedUserIds.size ? completedRuns.length / completedUserIds.size : 0;

        const topHeartbeatUsersAllTime = allSorted(heartbeatsByUserAllTime)
            .map(([userId, count]) => [nameFor(userId), +(count * MINUTES_PER_HEARTBEAT).toFixed(1)]);
        const topHeartbeatUsersToday = allSorted(heartbeatsByUserToday)
            .map(([userId, count]) => [nameFor(userId), +(count * MINUTES_PER_HEARTBEAT).toFixed(1)]);

        const heartbeatDayLabelsAll = Object.keys(heartbeatsByDay).sort();
        const heartbeatDayMinutesAll = heartbeatDayLabelsAll.map(d => +(heartbeatsByDay[d] * MINUTES_PER_HEARTBEAT).toFixed(1));
        const heartbeatDayLabels = heartbeatDayLabelsAll.slice(-30);
        const heartbeatDayMinutes = heartbeatDayMinutesAll.slice(-30);

        // ----- Death locations, in game-progression order (Pallet Town -> Mt. Silver) -----
        // Keyed by payload.route_index rather than the route name — several names repeat
        // (Viridian City, Victory Road, Indigo Plateau) between a first pass and a Johto
        // revisit, so name alone can't tell a Kanto death from a Johto one. route_index
        // matches state.currentLocationIndex 1:1 against ROUTE_ORDER above. (johto_run_ended
        // is a duplicate event for the same death, so it's excluded to avoid double-counting.)
        const deathCountsByIndex = new Array(ROUTE_ORDER.length).fill(0);
        let deathsWithUnknownLocation = 0;
        events.filter(e => e.event_type === 'game_over').forEach(e => {
            const idx = e.payload && e.payload.route_index;
            if (Number.isInteger(idx) && idx >= 0 && idx < ROUTE_ORDER.length) {
                deathCountsByIndex[idx]++;
            } else {
                deathsWithUnknownLocation++;
            }
        });
        const deathLocationLabels = ROUTE_ORDER.map(r => r.name);
        const deathLocationCounts = deathCountsByIndex.slice();
        if (deathsWithUnknownLocation > 0) {
            deathLocationLabels.push('Unknown Location');
            deathLocationCounts.push(deathsWithUnknownLocation);
        }

        // ----- Death context: gym battle vs. E4 battle vs. everything else -----
        // gameOverReason itself doesn't distinguish battle context (it's always
        // "party_wiped" whether that happened in a gym, an E4 battle, or a wild
        // encounter — see screens/gym-screen.js, elite-four-screen.js, and
        // encounter-screen.js), so this classifies by WHERE the death happened
        // instead, using the same route_index as the death-location chart above.
        // Indices below are hasGym cities / E4 locations, read straight off
        // data/routes.js in ROUTE_ORDER's index order. "Route deaths" is
        // everything else — plain routes/caves and non-gym cities, both regions.
        const KANTO_GYM_INDICES = [4, 6, 9, 14, 15, 17, 21, 23];
        const JOHTO_GYM_INDICES = [34, 38, 41, 46, 49, 52, 55, 59];
        const KANTO_E4_INDEX = 28;
        const JOHTO_E4_INDEX = 62;
        const sumIndices = (arr, indices) => indices.reduce((sum, i) => sum + (arr[i] || 0), 0);

        const kantoGymDeaths = sumIndices(deathCountsByIndex, KANTO_GYM_INDICES);
        const johtoGymDeaths = sumIndices(deathCountsByIndex, JOHTO_GYM_INDICES);
        const kantoE4Deaths = deathCountsByIndex[KANTO_E4_INDEX] || 0;
        const johtoE4Deaths = deathCountsByIndex[JOHTO_E4_INDEX] || 0;
        const totalDeaths = deathCountsByIndex.reduce((a, b) => a + b, 0) + deathsWithUnknownLocation;
        const routeDeaths = totalDeaths - kantoGymDeaths - johtoGymDeaths - kantoE4Deaths - johtoE4Deaths;

        // ----- Pokemon team composition: parties that WON the E4 battle -----
        // Johto: the johto_elite_four_cleared event logs the exact living party
        // (state.party.map(p => p.id)) at clear time — clean, single-region.
        // Kanto has no equivalent event, so this falls back to the leaderboard's
        // champion_ids — but that field (see engine/scoring.js's
        // getChampionIdsFromParty) adds every pre-evolution of each living party
        // member too, for Pokedex-credit purposes, not just the 6 that were
        // actually on the team. Scoped to kanto_e4_cleared && !johto_completed
        // rows so it isn't also carrying Johto's ids mixed in (those two arrays
        // get concatenated onto the same column for a run that clears both).
        // highestFormsInSet strips the padded-in pre-evolutions back out per row
        // (a Magikarp entry only survives if no Gyarados is also in that same
        // row's set) so the counts reflect the actual team, not the full lineage.
        const kantoPartyPool = leaderboard
            .filter(r => r.kanto_e4_cleared && !r.johto_completed)
            .flatMap(r => highestFormsInSet(r.champion_ids || []));
        const johtoPartyPool = events
            .filter(e => e.event_type === 'johto_elite_four_cleared')
            .flatMap(e => (e.payload && e.payload.party_ids) || []);

        function countBy(ids, mapper) {
            const counts = {};
            ids.forEach(id => {
                const key = mapper(id);
                counts[key] = (counts[key] || 0) + 1;
            });
            return counts;
        }

        const kantoTeamSorted = allSorted(countBy(kantoPartyPool, pokemonName));
        const johtoTeamSorted = allSorted(countBy(johtoPartyPool, pokemonName));
        const kantoAbilitySorted = allSorted(countBy(kantoPartyPool, pokemonAbility));
        const johtoAbilitySorted = allSorted(countBy(johtoPartyPool, pokemonAbility));

        app.innerHTML = `
            <section class="dex-section">
                <h2>&gt; Overview</h2>
                <div class="stat-grid">
                    ${statCard('Trainers Registered', profilesCount)}
                    ${statCard('Trainers With Completed Run', `${completedUserIds.size} / ${profilesCount}`)}
                    ${statCard('Avg Runs Per Completed-Run Trainer', avgRunsPerCompletedTrainer.toFixed(1))}
                    ${statCard('Avg Score', Math.round(avg(leaderboard.map(r => r.score))))}
                    ${statCard('Total Runs Logged', totalRuns)}
                    ${statCard('Total Hours On Trail', totalHoursAll.toFixed(1))}
                    ${statCard('Total Hours (Completed-Run Trainers)', totalHoursCompletedUsers.toFixed(1))}
                    ${statCard('Avg Hours Per Completed-Run Trainer', avgHoursPerCompletedTrainer.toFixed(1))}
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Activity</h2>
                <div class="stat-subheading">New Registered Trainers</div>
                <div class="stat-grid">
                    ${statCard('Last 30 Days', newTrainersLast30)}
                    ${statCard('Last 7 Days', newTrainersLast7)}
                    ${statCard('Yesterday', newTrainersYesterday)}
                    ${statCard('Today', newTrainersToday)}
                </div>
                <div class="stat-subheading">Runs Logged</div>
                <div class="stat-grid">
                    ${statCard('Last 30 Days', runsLoggedLast30)}
                    ${statCard('Last 7 Days', runsLoggedLast7)}
                    ${statCard('Yesterday', runsLoggedYesterday)}
                    ${statCard('Today', runsLoggedToday)}
                </div>
                <div class="panel-grid" style="margin-top: 16px;">
                    <div class="panel">
                        <h3>Runs Logged Per Day</h3>
                        <canvas id="chart-runs-day"></canvas>
                    </div>
                    <div class="panel">
                        <h3>Accounts Created Per Day</h3>
                        <canvas id="chart-accounts-day"></canvas>
                    </div>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Time On Trail (Heartbeats, 1 beat = 30s)</h2>
                <div class="stat-subheading">Trainers Over Hour-Played Thresholds — All-Time</div>
                <div class="stat-grid">
                    ${statCard('> 1 Hour', allTimeOver1h)}
                    ${statCard('> 3 Hours', allTimeOver3h)}
                    ${statCard('> 5 Hours', allTimeOver5h)}
                    ${statCard('> 10 Hours', allTimeOver10h)}
                </div>
                <div class="stat-subheading">Last 7 Days</div>
                <div class="stat-grid">
                    ${statCard('> 1 Hour', last7Over1h)}
                    ${statCard('> 3 Hours', last7Over3h)}
                    ${statCard('> 5 Hours', last7Over5h)}
                    ${statCard('> 10 Hours', last7Over10h)}
                </div>
                <div class="stat-subheading">Yesterday</div>
                <div class="stat-grid">
                    ${statCard('> 1 Hour', yesterdayOver1h)}
                    ${statCard('> 3 Hours', yesterdayOver3h)}
                    ${statCard('> 5 Hours', yesterdayOver5h)}
                    ${statCard('> 10 Hours', yesterdayOver10h)}
                </div>
                <div class="stat-subheading">Today</div>
                <div class="stat-grid">
                    ${statCard('> 1 Hour', todayOver1h)}
                    ${statCard('> 3 Hours', todayOver3h)}
                    ${statCard('> 5 Hours', todayOver5h)}
                    ${statCard('> 10 Hours', todayOver10h)}
                </div>
                <div class="panel" id="group-heartbeat-day" style="margin-top: 16px;">
                    <div class="panel-header-row">
                        <h3>Minutes-On-Page Per Day, All Trainers</h3>
                        <div class="range-toggle">
                            <button class="range-btn active" data-range="30">30 DAYS</button>
                            <button class="range-btn" data-range="7">7 DAYS</button>
                        </div>
                    </div>
                    <canvas id="chart-heartbeat-day"></canvas>
                </div>
                <div class="panel wide" style="margin-top: 16px;">
                    <h3>Top Trainers By Time On Page (All-Time)</h3>
                    <div class="chart-tall" id="wrap-heartbeat-alltime" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, topHeartbeatUsersAllTime.length))}px;">
                        <canvas id="chart-heartbeat-alltime"></canvas>
                    </div>
                    <button class="see-more-btn" id="btn-heartbeat-alltime">SEE MORE ▼</button>
                </div>
                <div class="panel wide" style="margin-top: 16px;">
                    <h3>Top Trainers By Time On Page (Today)</h3>
                    <div class="chart-tall" id="wrap-heartbeat-today" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, topHeartbeatUsersToday.length))}px;">
                        <canvas id="chart-heartbeat-today"></canvas>
                    </div>
                    <button class="see-more-btn" id="btn-heartbeat-today">SEE MORE ▼</button>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Player Behavior</h2>
                <div class="stat-grid">
                    ${statCard('Total Runs Completed', completedRuns.length)}
                    ${statCard('Kanto Gym Deaths', kantoGymDeaths)}
                    ${statCard('Johto Gym Deaths', johtoGymDeaths)}
                    ${statCard('Route Deaths', routeDeaths)}
                    ${statCard('Kanto E4 Deaths', kantoE4Deaths)}
                    ${statCard('Kanto E4 Defeated', e4Clears)}
                    ${statCard('Johto E4 Deaths', johtoE4Deaths)}
                    ${statCard('Johto E4 Defeated', johtoEntries)}
                    ${statCard('Red Challenged', redChallenges)}
                    ${statCard('Red Defeated', `${redWins} (${pct(redWins, redChallenges)})`)}
                </div>
                <div class="panel-grid" style="margin-top: 16px;">
                    <div class="panel">
                        <h3>Starter Popularity</h3>
                        <canvas id="chart-starters"></canvas>
                    </div>
                    <div class="panel">
                        <h3>Game Over Reasons</h3>
                        <canvas id="chart-reasons"></canvas>
                    </div>
                    <div class="panel">
                        <h3>Score Distribution</h3>
                        <canvas id="chart-scores"></canvas>
                    </div>
                    <div class="panel wide">
                        <h3>Where Trainers Die Most Often</h3>
                        <div class="chart-tall" style="height: ${tallChartHeight(deathLocationLabels.length)}px;">
                            <canvas id="chart-deaths"></canvas>
                        </div>
                    </div>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Pokemon Team Composition (E4-Winning Parties)</h2>
                <div class="panel-grid">
                    <div class="panel">
                        <h3>Kanto E4 Team Composition</h3>
                        <p class="panel-note">Reduced to each lineage's highest form actually on the team (a Magikarp only counts if that run's Gyarados hadn't evolved yet) — Kanto has no exact per-team snapshot like Johto's, so this is reconstructed from champion_ids.</p>
                        <div class="chart-tall" id="wrap-kanto-team" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, kantoTeamSorted.length))}px;">
                            <canvas id="chart-kanto-team"></canvas>
                        </div>
                        <button class="see-more-btn" id="btn-kanto-team">SEE MORE ▼</button>
                    </div>
                    <div class="panel">
                        <h3>Johto E4 Team Composition</h3>
                        <div class="chart-tall" id="wrap-johto-team" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, johtoTeamSorted.length))}px;">
                            <canvas id="chart-johto-team"></canvas>
                        </div>
                        <button class="see-more-btn" id="btn-johto-team">SEE MORE ▼</button>
                    </div>
                    <div class="panel">
                        <h3>Kanto E4 Ability Composition</h3>
                        <p class="panel-note">Same reconstructed-from-champion_ids caveat as team composition above.</p>
                        <div class="chart-tall" id="wrap-kanto-ability" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, kantoAbilitySorted.length))}px;">
                            <canvas id="chart-kanto-ability"></canvas>
                        </div>
                        <button class="see-more-btn" id="btn-kanto-ability">SEE MORE ▼</button>
                    </div>
                    <div class="panel">
                        <h3>Johto E4 Ability Composition</h3>
                        <div class="chart-tall" id="wrap-johto-ability" style="height: ${tallChartHeight(Math.min(SEE_MORE_STEP, johtoAbilitySorted.length))}px;">
                            <canvas id="chart-johto-ability"></canvas>
                        </div>
                        <button class="see-more-btn" id="btn-johto-ability">SEE MORE ▼</button>
                    </div>
                </div>
            </section>

            <section class="dex-section">
                <h2>&gt; Top Runs</h2>
                <div class="panel table-scroll">
                    <table class="dex-table">
                        <thead>
                            <tr><th>#</th><th>Trainer</th><th>Score</th><th>Days</th><th>Badges</th><th>Dex</th><th>Result</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                            ${topScores.map((r, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${r.username}</td>
                                    <td>${r.score}</td>
                                    <td>${r.days_elapsed}</td>
                                    <td>${r.badges}</td>
                                    <td>${r.pokedex_count}</td>
                                    <td><span class="pill ${r.won ? 'win' : 'loss'}">${r.won ? 'WON' : (r.kanto_e4_cleared ? 'E4' : '—')}</span></td>
                                    <td>${r.date || ''}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </section>

            <footer>OPS·DEX — READ-ONLY — PRODUCTION SUPABASE — ${new Date().getFullYear()}</footer>
        `;

        buildLineChart('chart-runs-day', dayLabels, [{
            label: 'Runs',
            data: dayCounts,
            borderColor: '#33ff8c',
            backgroundColor: 'rgba(51,255,140,0.15)',
            fill: true,
            tension: 0.25
        }]);

        buildLineChart('chart-accounts-day', accountDayLabels, [{
            label: 'Accounts Created',
            data: accountDayCounts,
            borderColor: '#33ff8c',
            backgroundColor: 'rgba(51,255,140,0.15)',
            fill: true,
            tension: 0.25
        }]);

        buildBarChart('chart-starters', starterTop.map(x => x[0]), starterTop.map(x => x[1]), 'Runs');
        buildDoughnut('chart-reasons', Object.keys(reasonCounts), Object.values(reasonCounts));
        buildBarChart('chart-scores', bucketLabels, bucketCounts, 'Runs');

        buildTopNWithSeeMore('chart-heartbeat-alltime', 'wrap-heartbeat-alltime', 'btn-heartbeat-alltime', topHeartbeatUsersAllTime, 'Minutes', 'TRAINERS', 60);
        buildTopNWithSeeMore('chart-heartbeat-today', 'wrap-heartbeat-today', 'btn-heartbeat-today', topHeartbeatUsersToday, 'Minutes', 'TRAINERS', 60);

        const chartHeartbeatDay = buildLineChart('chart-heartbeat-day', heartbeatDayLabels, [{
            label: 'Minutes on page (all trainers)',
            data: heartbeatDayMinutes,
            borderColor: '#ffb020',
            backgroundColor: 'rgba(255,176,32,0.15)',
            fill: true,
            tension: 0.25
        }]);
        setupRangeToggle('#group-heartbeat-day', chartHeartbeatDay, heartbeatDayLabelsAll, heartbeatDayMinutesAll);

        buildHBarChart('chart-deaths', deathLocationLabels, deathLocationCounts, 'Deaths');

        buildTopNWithSeeMore('chart-kanto-team', 'wrap-kanto-team', 'btn-kanto-team', kantoTeamSorted, 'Runs', 'POKEMON');
        buildTopNWithSeeMore('chart-johto-team', 'wrap-johto-team', 'btn-johto-team', johtoTeamSorted, 'Runs', 'POKEMON');
        buildTopNWithSeeMore('chart-kanto-ability', 'wrap-kanto-ability', 'btn-kanto-ability', kantoAbilitySorted, 'Runs', 'ABILITIES');
        buildTopNWithSeeMore('chart-johto-ability', 'wrap-johto-ability', 'btn-johto-ability', johtoAbilitySorted, 'Runs', 'ABILITIES');
    }

    async function main() {
        try {
            const [profiles, leaderboard, events] = await Promise.all([
                fetchAll('pt_profiles', 'id, username, created_at'),
                fetchAll('pt_leaderboard', 'user_id, username, score, pokedex_count, badges, days_elapsed, won, date, status, kanto_e4_cleared, johto_completed, legendary_count, created_at, champion_ids'),
                fetchAll('pt_events', 'event_type, payload, created_at, user_id')
            ]);
            render(profiles, leaderboard, events);
            refreshEl.textContent = `SYNCED ${new Date().toLocaleTimeString()}`;
        } catch (err) {
            app.innerHTML = `<div class="error-row">UPLINK FAILED: ${err.message}</div>`;
            refreshEl.textContent = 'SYNC ERROR';
        }
    }

    main();
})();

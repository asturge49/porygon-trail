// Porygon Trail - Per-Location Scene Definitions
// Unique ASCII art for each Kanto location
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

    // Monochrome GB palette for every landmark building — no accent
    // colors, only shape (peaked roof = house-like, flat roof = civic)
    // and grid size distinguish one landmark from another.
    const BUILDING_COLORS = { R: 'var(--gb-darkest)', W: 'var(--gb-white)', D: 'var(--gb-dark)' };

    // Bigger than a house (~36x20px), peaked roof — Professor Oak's Lab
    const LAB_SHAPE = [
        '.........RRR.........',
        '.......RRRRRRR.......',
        '....RRRRRRRRRRRRR....',
        'RRRRRRRRRRRRRRRRRRRRR',
        'RWWWDDWWWWWWWWWDDWWWR',
        'RWWWDDWWWWWWWWWDDWWWR',
        'RWWWWWWWWWWWWWWWWWWWR',
        'RWWWWWWWWDDDWWWWWWWWR',
        'RWWWWWWWWDDDWWWWWWWWR',
        'RWWWWWWWWWWWWWWWWWWWR',
        'RRRRRRRRRRRRRRRRRRRRR'
    ];

    // Slightly bigger than the Lab (~46x24px), flat roof, two floors — a Gym
    const GYM_SHAPE = [
        '.RRRRRRRRRRRRRRRRRRRRR.',
        'RRRRRRRRRRRRRRRRRRRRRRR',
        'RRRRRRRRRRRRRRRRRRRRRRR',
        'RWWWWDDWWWWWWWWWDDWWWWR',
        'RWWWWDDWWWWWWWWWDDWWWWR',
        'RWWWWWWWWWWWWWWWWWWWWWR',
        'RWWWWDDWWWWWWWWWDDWWWWR',
        'RWWWWDDWWWWWWWWWDDWWWWR',
        'RWWWWWWWWWWWWWWWWWWWWWR',
        'RWWWWWWWWWDDDWWWWWWWWWR',
        'RWWWWWWWWWDDDWWWWWWWWWR',
        'RRRRRRRRRRRRRRRRRRRRRRR'
    ];

    // The tallest of them all (~22x44px) — Silph Co.'s skyscraper
    const SILPH_SHAPE = [
        '.....R.....',
        '.....R.....',
        '.RRRRRRRRR.',
        'RRRRRRRRRRR',
        'RWWDWWWDWWR',
        'RWWDWWWDWWR',
        'RWWWWWWWWWR',
        'RWWDWWWDWWR',
        'RWWDWWWDWWR',
        'RWWWWWWWWWR',
        'RWWDWWWDWWR',
        'RWWDWWWDWWR',
        'RWWWWWWWWWR',
        'RWWDWWWDWWR',
        'RWWDWWWDWWR',
        'RWWWWWWWWWR',
        'RWWDWWWDWWR',
        'RWWDWWWDWWR',
        'RWWWWWWWWWR',
        'RWWWDDDWWWR',
        'RWWWDDDWWWR',
        'RRRRRRRRRRR'
    ];

    // Pokemon Center — flat roof, cross emblem in the wall
    const CENTER_SHAPE = [
        '.RRRRRRRRRRRRR.',
        'RRRRRRRRRRRRRRR',
        'RRRRRRRRRRRRRRR',
        'RWWWWWWDWWWWWWR',
        'RWWWWDDDDDWWWWR',
        'RWWWWWWDWWWWWWR',
        'RWWWWWWWWWWWWWR',
        'RWWWWWDDDWWWWWR',
        'RWWWWWDDDWWWWWR',
        'RRRRRRRRRRRRRRR'
    ];

    // Mart — same footprint as a Center, diamond emblem instead of a cross
    const MART_SHAPE = [
        '.RRRRRRRRRRRRR.',
        'RRRRRRRRRRRRRRR',
        'RRRRRRRRRRRRRRR',
        'RWWWWWWDWWWWWWR',
        'RWWWWWDWDWWWWWR',
        'RWWWWWWDWWWWWWR',
        'RWWWWWWWWWWWWWR',
        'RWWWWWDDDWWWWWR',
        'RWWWWWDDDWWWWWR',
        'RRRRRRRRRRRRRRR'
    ];

    // Generic small building for unlabeled/filler shopfronts
    const SHOP_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 15, floors: 1, roof: 'flat' });

    // Wide single-story hall — Pewter Museum
    const MUSEUM_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 27, floors: 1, roof: 'flat' });

    // Wide and multi-floor — Celadon Dept. Store
    const DEPT_STORE_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 23, floors: 3, roof: 'flat' });

    // The grandest building in Kanto — Pokemon League HQ
    const LEAGUE_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 27, floors: 2, doorWidth: 5, roof: 'flat' });

    // Same height tier as Silph Co., single center slit per floor
    // (pagoda/crypt silhouette) — Pokemon Tower
    const POKEMON_TOWER_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 11, floors: 5, roof: 'flat', windowStyle: 'center' });

    // --- Johto-only landmark shapes ---
    // Ecruteak's Bell Tower — taller pagoda than Kanto's Pokemon Tower
    const BELL_TOWER_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 11, floors: 7, roof: 'flat', windowStyle: 'center' });
    // Violet City's Sprout Tower — shorter, squatter pagoda
    const SPROUT_TOWER_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 13, floors: 3, roof: 'flat', windowStyle: 'center' });
    // Goldenrod's Radio Tower — antenna, mid-height
    const RADIO_TOWER_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 9, floors: 5, roof: 'flat', antenna: true, windowStyle: 'center' });
    // Olivine's Lighthouse (Glitter Lighthouse) — narrow and very tall
    const LIGHTHOUSE_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 7, floors: 8, roof: 'flat', antenna: true, windowStyle: 'center' });
    // Blackthorn's Dragon's Den shrine — squat, peaked-roof shrine
    const DRAGON_SHRINE_SHAPE = PT.Engine.PixelArt.civicBuilding({ width: 13, floors: 2, roof: 'peak', doorWidth: 5 });

    function landmark(shape, style) {
        return PT.Engine.PixelArt.buildingDiv(shape, BUILDING_COLORS, style);
    }

    PT.Data.LocationScenes = {
        // Pallet Town — Oak's Lab, two small houses, starter garden
        pallet_town: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene town-scene">
                <div class="pixel-cloud" style="top:10px;left:20%;">~~~</div>
                <div class="pixel-cloud" style="top:18px;left:70%;">~~</div>
                <div class="pixel-house" style="left:8%;font-size:9px;">_[]_<br>|__|</div>
                <div class="pixel-house" style="left:28%;font-size:9px;">_[]_<br>|__|</div>
                <div class="pixel-tree" style="left:48%;">&Delta;<br>|</div>
                ${landmark(LAB_SHAPE, 'left:58%;bottom:5px;')}
                <div class="pixel-grass" style="left:82%;bottom:5px;">vvv</div>
                <div class="pixel-grass" style="left:90%;bottom:8px;">vv</div>
                <div class="pixel-fence" style="left:5%;bottom:2px;">--.--.--.--</div>
            </div>`
        },

        // Viridian City — Mart, Center, forest entrance to the north
        viridian_city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:8px;left:50%;">~~~</div>
                ${landmark(CENTER_SHAPE, 'left:10%;bottom:5px;')}
                ${landmark(MART_SHAPE, 'left:32%;bottom:5px;')}
                <div class="pixel-tree" style="left:55%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:63%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:71%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:79%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:87%;">&Delta;<br>|</div>
                <div class="pixel-npc" style="left:46%;bottom:8px;">.</div>
            </div>`
        },

        // Pewter City — Museum, Brock's Gym, rocky terrain
        pewter_city: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                ${landmark(MUSEUM_SHAPE, 'left:5%;bottom:5px;')}
                <div class="pixel-rock" style="left:38%;bottom:5px;">^^</div>
                ${landmark(GYM_SHAPE, 'left:50%;bottom:5px;')}
                <div class="pixel-rock" style="left:75%;bottom:8px;">^</div>
                <div class="pixel-rock" style="left:85%;bottom:5px;">^^</div>
                <div class="pixel-mountain" style="left:70%;top:8px;font-size:8px;">/\\</div>
                <div class="pixel-mountain" style="left:85%;top:12px;font-size:8px;">/\\</div>
            </div>`
        },

        // Mt. Moon — Dark cave, moonstone glow, Clefairy, fossils
        mt_moon: {
            sky: '#0f380f', ground: '#0f380f',
            art: `<div class="pixel-scene cave-scene">
                <div class="pixel-stalactite" style="left:10%;">V V</div>
                <div class="pixel-stalactite" style="left:35%;">V</div>
                <div class="pixel-stalactite" style="left:55%;">V V V</div>
                <div class="pixel-stalactite" style="left:85%;">V V</div>
                <div class="pixel-glow" style="left:45%;top:25%;font-size:16px;">(*)</div>
                <div class="pixel-rock" style="left:10%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:30%;bottom:8px;">^</div>
                <div class="pixel-fossil" style="left:70%;bottom:12px;font-size:7px;">@</div>
                <div class="pixel-fossil" style="left:78%;bottom:8px;font-size:7px;">@</div>
                <div class="pixel-rock" style="left:60%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:88%;bottom:5px;">^</div>
                <div class="pixel-npc" style="left:50%;bottom:18px;font-size:6px;">o</div>
            </div>`
        },

        // Cerulean City — River, Nugget Bridge, Misty's water gym
        cerulean_city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:6px;left:15%;">~~</div>
                ${landmark(CENTER_SHAPE, 'left:5%;bottom:5px;')}
                ${landmark(SHOP_SHAPE, 'left:25%;bottom:5px;')}
                <div class="pixel-wave" style="bottom:30px;font-size:6px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:24px;font-size:6px;">~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-bridge" style="left:65%;bottom:22px;font-size:6px;">|=|=|=|</div>
                <div class="pixel-tree" style="left:88%;">&Delta;<br>|</div>
                <div class="pixel-waterfall" style="left:50%;bottom:18px;font-size:6px;">|<br>|<br>~</div>
            </div>`
        },

        // Vermilion City — Harbor, S.S. Anne, Lt. Surge's gym
        vermilion_city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:6px;left:25%;">~~~</div>
                <div class="pixel-seagull" style="top:15px;left:60%;">&gt;</div>
                <div class="pixel-seagull" style="top:10px;left:72%;">&gt;</div>
                ${landmark(SHOP_SHAPE, 'left:5%;bottom:5px;')}
                ${landmark(SHOP_SHAPE, 'left:22%;bottom:5px;')}
                <div class="pixel-crane" style="left:42%;top:20px;font-size:6px;">/--o</div>
                <div class="pixel-ship" style="left:55%;bottom:5px;font-size:6px;">__|===|__<br>&nbsp;&nbsp;|_T_|</div>
                <div class="pixel-dock" style="left:50%;bottom:2px;font-size:6px;">|||&nbsp;|||&nbsp;|||</div>
            </div>`
        },

        // Lavender Town — Pokemon Tower, gravestones, ghosts, fog
        lavender_town: {
            sky: '#306230', ground: '#0f380f',
            art: `<div class="pixel-scene lavender-scene">
                ${landmark(POKEMON_TOWER_SHAPE, 'left:40%;bottom:5px;')}
                <div class="pixel-gravestone" style="left:10%;bottom:5px;">+</div>
                <div class="pixel-gravestone" style="left:18%;bottom:8px;">+</div>
                <div class="pixel-gravestone" style="left:25%;bottom:5px;">+</div>
                <div class="pixel-gravestone" style="left:70%;bottom:8px;">+</div>
                <div class="pixel-gravestone" style="left:78%;bottom:5px;">+</div>
                <div class="pixel-gravestone" style="left:85%;bottom:8px;">+</div>
                <div class="pixel-ghost" style="left:20%;top:30px;">o<br>~</div>
                <div class="pixel-ghost" style="left:75%;top:40px;">o<br>~</div>
                <div class="pixel-fog"></div>
            </div>`
        },

        // Celadon City — Department Store, Game Corner, Erika's gym
        celadon_city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:5px;left:60%;">~~</div>
                ${landmark(DEPT_STORE_SHAPE, 'left:5%;bottom:5px;')}
                ${landmark(MART_SHAPE, 'left:28%;bottom:5px;')}
                ${landmark(GYM_SHAPE, 'left:48%;bottom:5px;')}
                ${landmark(SHOP_SHAPE, 'left:68%;bottom:5px;')}
                <div class="pixel-tree" style="left:85%;bottom:5px;font-size:10px;">&Delta;<br>|</div>
                <div class="pixel-flower" style="left:88%;bottom:5px;font-size:6px;">*</div>
                <div class="pixel-flower" style="left:92%;bottom:8px;font-size:6px;">*</div>
            </div>`
        },

        // Saffron City — Silph Co. tower, Fighting Dojo, Sabrina's gym
        saffron_city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                ${landmark(SHOP_SHAPE, 'left:8%;bottom:5px;')}
                ${landmark(SILPH_SHAPE, 'left:30%;bottom:5px;')}
                ${landmark(GYM_SHAPE, 'left:55%;bottom:5px;')}
                ${landmark(SHOP_SHAPE, 'left:75%;bottom:5px;')}
                <div class="pixel-helicopter" style="top:8px;left:65%;font-size:5px;">=+=&gt;</div>
            </div>`
        },

        // Fuchsia City — Safari Zone gate, Koga's invisible gym
        fuchsia_city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:8px;left:30%;">~~~</div>
                <div class="pixel-gate" style="left:20%;bottom:5px;font-size:6px;">|&nbsp;SAFARI&nbsp;|<br>|==||==|</div>
                <div class="pixel-fence" style="left:5%;bottom:18px;">------</div>
                <div class="pixel-fence" style="left:60%;bottom:18px;">------</div>
                ${landmark(GYM_SHAPE, 'left:70%;bottom:5px;opacity:0.6;')}
                <div class="pixel-grass" style="left:5%;bottom:5px;">vVvVv</div>
                <div class="pixel-grass" style="left:85%;bottom:8px;">VvV</div>
                <div class="pixel-tree" style="left:92%;">&Delta;<br>|</div>
            </div>`
        },

        // Seafoam Islands — Ice cave + ocean, icicles, Articuno silhouette
        seafoam_islands: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene water-scene">
                <div class="pixel-icicle" style="left:10%;top:0;">Y Y</div>
                <div class="pixel-icicle" style="left:35%;top:0;">Y</div>
                <div class="pixel-icicle" style="left:60%;top:0;">Y Y Y</div>
                <div class="pixel-icicle" style="left:85%;top:0;">Y Y</div>
                <div class="pixel-glow" style="left:80%;top:18%;font-size:10px;">*</div>
                <div class="pixel-bird" style="left:78%;top:12%;font-size:8px;">&gt;V&lt;</div>
                <div class="pixel-ice" style="left:20%;bottom:20px;font-size:7px;">&lt;&gt;</div>
                <div class="pixel-ice" style="left:45%;bottom:25px;font-size:7px;">{}</div>
                <div class="pixel-wave" style="bottom:12px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:5px;">~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-snow-particle"></div>
            </div>`
        },

        // Cinnabar Island — Volcano, Pokemon Mansion ruins, Blaine's gym
        cinnabar_island: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene cinnabar-scene">
                <div class="pixel-smoke" style="left:42%;top:2px;">~~~</div>
                <div class="pixel-smoke" style="left:45%;top:8px;">~~</div>
                <div class="pixel-volcano" style="left:35%;bottom:5px;font-size:10px;">&nbsp;&nbsp;/\\<br>&nbsp;/&nbsp;&nbsp;\\<br>/&nbsp;&nbsp;&nbsp;&nbsp;\\</div>
                <div class="pixel-glow cinnabar-glow" style="left:42%;bottom:8px;font-size:8px;">*</div>
                ${landmark(LAB_SHAPE, 'left:5%;bottom:5px;')}
                ${landmark(GYM_SHAPE, 'left:75%;bottom:5px;')}
                <div class="pixel-wave" style="bottom:0px;font-size:6px;">~~~~~~~~~~~~~~~~~~~~~</div>
            </div>`
        },

        // Viridian City Return — Giovanni's gym open, Team Rocket flags
        viridian_city_return: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:10px;left:45%;">~~</div>
                ${landmark(CENTER_SHAPE, 'left:10%;bottom:5px;')}
                ${landmark(GYM_SHAPE, 'left:35%;bottom:5px;')}
                <div class="pixel-tree" style="left:60%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:75%;">&Delta;<br>|</div>
                ${landmark(MART_SHAPE, 'left:85%;bottom:5px;')}
            </div>`
        },

        // Indigo Plateau — Victory Road cave, Pokemon League building, grand staircase
        indigo_plateau: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene mountain-scene">
                <div class="pixel-cloud" style="top:3px;left:15%;">~~</div>
                <div class="pixel-mountain" style="left:0%;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                <div class="pixel-mountain" style="left:20%;font-size:8px;">/\\</div>
                ${landmark(LEAGUE_SHAPE, 'left:50%;bottom:5px;')}
                <div class="pixel-stairs" style="left:55%;bottom:3px;font-size:5px;">/___/___/</div>
                <div class="pixel-rock" style="left:80%;bottom:8px;">^^</div>
                <div class="pixel-mountain" style="left:85%;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                <div class="pixel-torch" style="left:48%;bottom:25px;">*</div>
                <div class="pixel-torch" style="left:72%;bottom:25px;">*</div>
            </div>`
        },

        // ===== JOHTO (GSC palette shift — see .johto-scene in style.css) =====

        // New Bark Town — Elm's Lab, two houses, the "town that time forgot"
        new_bark_town: {
            sky: 'var(--gsc-light)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene town-scene">
                <div class="pixel-cloud" style="top:10px;left:20%;">~~~</div>
                <div class="pixel-cloud" style="top:18px;left:68%;">~~</div>
                ${landmark(LAB_SHAPE, 'left:12%;bottom:5px;')}
                <div class="pixel-house" style="left:50%;font-size:9px;">_[]_<br>|__|</div>
                <div class="pixel-tree" style="left:66%;">&Delta;<br>|</div>
                <div class="pixel-grass" style="left:80%;bottom:5px;">vvv</div>
                <div class="pixel-grass" style="left:90%;bottom:8px;">vv</div>
                <div class="pixel-fence" style="left:5%;bottom:2px;">--.--.--.--</div>
                <div class="pixel-npc" style="left:45%;bottom:8px;">.</div>
            </div>`
        },

        // Cherrygrove City — flower beds, Guide Gent gate, first Center/Mart
        cherrygrove_city: {
            sky: 'var(--gsc-light)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene town-scene">
                <div class="pixel-cloud" style="top:8px;left:45%;">~~~</div>
                ${landmark(CENTER_SHAPE, 'left:10%;bottom:5px;')}
                ${landmark(MART_SHAPE, 'left:32%;bottom:5px;')}
                <div class="pixel-gate" style="left:55%;bottom:5px;font-size:6px;">|&nbsp;WELCOME&nbsp;|<br>|==||==|</div>
                <div class="pixel-flower" style="left:75%;bottom:5px;font-size:6px;">*</div>
                <div class="pixel-flower" style="left:80%;bottom:8px;font-size:6px;">*</div>
                <div class="pixel-flower" style="left:85%;bottom:5px;font-size:6px;">*</div>
                <div class="pixel-tree" style="left:92%;">&Delta;<br>|</div>
            </div>`
        },

        // Violet City — Sprout Tower, Falkner's Gym, hilltop overlook
        violet_city: {
            sky: 'var(--gsc-lightest)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene city-scene">
                <div class="pixel-cloud" style="top:5px;left:30%;">~~</div>
                <div class="pixel-bird" style="top:12px;left:60%;font-size:7px;">&gt;</div>
                ${landmark(SPROUT_TOWER_SHAPE, 'left:8%;bottom:5px;')}
                ${landmark(GYM_SHAPE, 'left:45%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:78%;bottom:5px;')}
                <div class="pixel-mountain" style="left:0%;top:2px;font-size:8px;">/\\</div>
            </div>`
        },

        // Union Cave — long damp cave, dripping water, Onix territory
        union_cave: {
            sky: 'var(--gsc-darkest)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene cave-scene">
                <div class="pixel-stalactite" style="left:8%;">V V</div>
                <div class="pixel-stalactite" style="left:30%;">V</div>
                <div class="pixel-stalactite" style="left:52%;">V V V</div>
                <div class="pixel-stalactite" style="left:80%;">V V</div>
                <div class="pixel-glow" style="left:40%;top:22%;font-size:14px;">(*)</div>
                <div class="pixel-rock" style="left:12%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:35%;bottom:8px;">^</div>
                <div class="pixel-waterfall" style="left:60%;bottom:14px;font-size:6px;">|<br>|<br>~</div>
                <div class="pixel-rock" style="left:70%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:88%;bottom:5px;">^</div>
                <div class="pixel-fossil" style="left:22%;bottom:10px;font-size:7px;">@</div>
            </div>`
        },

        // Azalea Town — Kurt's shop, Bugsy's Gym, the well nearby
        azalea_town: {
            sky: 'var(--gsc-light)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene city-scene">
                <div class="pixel-cloud" style="top:8px;left:55%;">~~</div>
                ${landmark(GYM_SHAPE, 'left:8%;bottom:5px;')}
                ${landmark(SHOP_SHAPE, 'left:40%;bottom:5px;')}
                <div class="pixel-gate" style="left:62%;bottom:3px;font-size:6px;">o&nbsp;WELL&nbsp;o<br>|===|</div>
                <div class="pixel-tree" style="left:80%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:90%;">&Delta;<br>|</div>
            </div>`
        },

        // Slowpoke Well — shallow cave shaft, sleepy Slowpoke, Team Rocket graffiti
        slowpoke_well: {
            sky: 'var(--gsc-darkest)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene cave-scene">
                <div class="pixel-stalactite" style="left:20%;">V</div>
                <div class="pixel-stalactite" style="left:65%;">V V</div>
                <div class="pixel-glow" style="left:50%;top:30%;font-size:12px;">(*)</div>
                <div class="pixel-rock" style="left:15%;bottom:5px;">^</div>
                <div class="pixel-rock" style="left:75%;bottom:8px;">^^</div>
                <div class="pixel-npc" style="left:40%;bottom:5px;font-size:9px;">o</div>
                <div class="pixel-npc" style="left:55%;bottom:6px;font-size:9px;">o</div>
                <div class="pixel-waterfall" style="left:30%;bottom:12px;font-size:6px;">|<br>~</div>
            </div>`
        },

        // Goldenrod City — the region's biggest hub: Dept. Store, Radio Tower, Whitney's Gym
        goldenrod_city: {
            sky: 'var(--gsc-lightest)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene city-scene">
                <div class="pixel-cloud" style="top:6px;left:60%;">~~~</div>
                ${landmark(DEPT_STORE_SHAPE, 'left:4%;bottom:5px;')}
                ${landmark(RADIO_TOWER_SHAPE, 'left:28%;bottom:5px;')}
                ${landmark(GYM_SHAPE, 'left:44%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:68%;bottom:5px;')}
                ${landmark(MART_SHAPE, 'left:85%;bottom:5px;')}
            </div>`
        },

        // Route 35 / National Park — flowerbeds, bug-catching-contest grasses
        national_park: {
            sky: 'var(--gsc-light)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene route-scene">
                <div class="pixel-cloud" style="top:10px;left:25%;">~~</div>
                <div class="pixel-tree" style="left:8%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:20%;">&Delta;<br>|</div>
                <div class="pixel-flower" style="left:35%;bottom:5px;font-size:6px;">*</div>
                <div class="pixel-flower" style="left:40%;bottom:8px;font-size:6px;">*</div>
                <div class="pixel-flower" style="left:45%;bottom:5px;font-size:6px;">*</div>
                <div class="pixel-grass" style="left:55%;bottom:5px;">vVvVv</div>
                <div class="pixel-bird" style="top:20px;left:65%;font-size:7px;">&gt;&gt;</div>
                <div class="pixel-grass" style="left:75%;bottom:8px;">VvV</div>
                <div class="pixel-tree" style="left:90%;">&Delta;<br>|</div>
            </div>`
        },

        // Route 36/37 — quiet forest path toward Ecruteak; Sudowoodo's fake tree lurks
        route_37: {
            sky: 'var(--gsc-dark)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene route-scene">
                <div class="pixel-tree" style="left:10%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:22%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:60%;font-size:12px;animation:none;color:var(--gb-darkest);">&Delta;<br>|</div>
                <div class="pixel-rock" style="left:38%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:75%;bottom:8px;">^</div>
                <div class="pixel-ghost" style="left:82%;top:15px;font-size:7px;">o</div>
                <div class="pixel-fog"></div>
            </div>`
        },

        // Ecruteak City — Bell Tower, Tin Tower silhouette, Morty's Gym, ghost mist
        ecruteak_city: {
            sky: 'var(--gsc-dark)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene city-scene">
                ${landmark(BELL_TOWER_SHAPE, 'left:8%;bottom:5px;')}
                <div class="pixel-mountain" style="left:34%;top:4px;font-size:9px;">/\\<br>/&nbsp;&nbsp;\\</div>
                ${landmark(GYM_SHAPE, 'left:52%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:80%;bottom:5px;')}
                <div class="pixel-ghost" style="left:20%;top:25px;">o<br>~</div>
                <div class="pixel-fog"></div>
            </div>`
        },

        // Olivine City — Glitter Lighthouse, harbor, Jasmine's Gym
        olivine_city: {
            sky: 'var(--gsc-light)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene city-scene">
                <div class="pixel-seagull" style="top:10px;left:55%;">&gt;</div>
                ${landmark(LIGHTHOUSE_SHAPE, 'left:8%;bottom:5px;')}
                <div class="pixel-glow" style="left:11%;bottom:60px;font-size:10px;">*</div>
                ${landmark(GYM_SHAPE, 'left:30%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:58%;bottom:5px;')}
                <div class="pixel-wave" style="bottom:5px;font-size:6px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-dock" style="left:75%;bottom:2px;font-size:6px;">|||&nbsp;|||</div>
                <div class="pixel-ship" style="left:80%;bottom:8px;font-size:6px;">__|===|__<br>&nbsp;&nbsp;|_T_|</div>
            </div>`
        },

        // Route 40/41 — open sea ferry crossing to Cianwood
        route_41: {
            sky: 'var(--gsc-lightest)', ground: 'var(--gsc-bg)',
            art: `<div class="pixel-scene johto-scene water-scene">
                <div class="pixel-cloud" style="top:8px;left:20%;">~~~</div>
                <div class="pixel-seagull" style="top:14px;left:40%;">&gt;</div>
                <div class="pixel-seagull" style="top:20px;left:65%;">&gt;</div>
                <div class="pixel-ship" style="left:45%;bottom:20px;font-size:7px;">__|===|__<br>&nbsp;&nbsp;|_T_|</div>
                <div class="pixel-wave" style="bottom:55px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:45px;">~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:35px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:25px;">~~~~~~~~~~~~~~~~~~~</div>
            </div>`
        },

        // Cianwood City — remote island city, Chuck's Gym, seaside cliffs
        cianwood_city: {
            sky: 'var(--gsc-lightest)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene city-scene">
                <div class="pixel-cloud" style="top:8px;left:35%;">~~</div>
                <div class="pixel-rock" style="left:5%;bottom:5px;">^^</div>
                ${landmark(GYM_SHAPE, 'left:20%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:55%;bottom:5px;')}
                <div class="pixel-tree" style="left:82%;font-size:11px;">&Delta;<br>|</div>
                <div class="pixel-wave" style="bottom:5px;font-size:6px;">~~~~~~~~~~~~~~~~~~~~~</div>
            </div>`
        },

        // Route 42 / Mt. Mortar — steep cave-mountain, hot spring glow
        mt_mortar: {
            sky: 'var(--gsc-darkest)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene cave-scene">
                <div class="pixel-mountain" style="left:5%;top:0;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                <div class="pixel-stalactite" style="left:30%;">V V</div>
                <div class="pixel-stalactite" style="left:55%;">V</div>
                <div class="pixel-rock" style="left:20%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:68%;bottom:8px;">^</div>
                <div class="pixel-smoke" style="left:45%;top:15px;">~~</div>
                <div class="pixel-glow" style="left:48%;bottom:10px;font-size:12px;color:var(--gsc-accent);">*</div>
                <div class="pixel-rock" style="left:82%;bottom:5px;">^^</div>
            </div>`
        },

        // Mahogany Town — quiet mountain village, Pryce's Gym, ice country gateway
        mahogany_town: {
            sky: 'var(--gsc-light)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene town-scene">
                <div class="pixel-icicle" style="left:5%;top:2px;">Y</div>
                ${landmark(GYM_SHAPE, 'left:15%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:45%;bottom:5px;')}
                ${landmark(MART_SHAPE, 'left:68%;bottom:5px;')}
                <div class="pixel-mountain" style="left:88%;top:2px;font-size:9px;">/\\</div>
            </div>`
        },

        // Lake of Rage — wide misty lake, angler NPCs, a rumored red Gyarados
        lake_of_rage: {
            sky: 'var(--gsc-dark)', ground: 'var(--gsc-bg)',
            art: `<div class="pixel-scene johto-scene water-scene">
                <div class="pixel-cloud" style="top:6px;left:30%;">~~</div>
                <div class="pixel-npc" style="left:15%;bottom:35px;font-size:7px;">o</div>
                <div class="pixel-wave" style="bottom:50px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:40px;">~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-glow" style="left:65%;bottom:32px;font-size:12px;color:var(--gsc-danger);">*</div>
                <div class="pixel-wave" style="bottom:30px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:20px;">~~~~~~~~~~~~~~~~~~~</div>
            </div>`
        },

        // Route 44 / Ice Path — frozen cave, sheer ice walls, whistling wind
        ice_path: {
            sky: 'var(--gsc-darkest)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene cave-scene">
                <div class="pixel-icicle" style="left:8%;top:0;">Y Y</div>
                <div class="pixel-icicle" style="left:32%;top:0;">Y</div>
                <div class="pixel-icicle" style="left:55%;top:0;">Y Y Y</div>
                <div class="pixel-icicle" style="left:82%;top:0;">Y Y</div>
                <div class="pixel-ice" style="left:20%;bottom:14px;font-size:8px;">&lt;&gt;</div>
                <div class="pixel-ice" style="left:48%;bottom:18px;font-size:8px;">{}</div>
                <div class="pixel-glow" style="left:65%;top:30%;font-size:10px;">*</div>
                <div class="pixel-snow-particle"></div>
            </div>`
        },

        // Blackthorn City — mountain-ringed dragon capital, Clair's Gym
        blackthorn_city: {
            sky: 'var(--gsc-light)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene city-scene">
                <div class="pixel-mountain" style="left:0%;top:2px;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                ${landmark(GYM_SHAPE, 'left:18%;bottom:5px;')}
                ${landmark(DRAGON_SHRINE_SHAPE, 'left:48%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:70%;bottom:5px;')}
                <div class="pixel-mountain" style="left:90%;top:4px;font-size:9px;">/\\</div>
            </div>`
        },

        // Dragon's Den — sacred cave shrine, waterfall pool, dragon spirits
        dragons_den: {
            sky: 'var(--gsc-darkest)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene cave-scene">
                <div class="pixel-stalactite" style="left:12%;">V</div>
                <div class="pixel-stalactite" style="left:70%;">V V</div>
                <div class="pixel-waterfall" style="left:35%;bottom:10px;font-size:7px;">|<br>|<br>~</div>
                <div class="pixel-glow" style="left:55%;top:25%;font-size:14px;color:var(--gsc-accent);">(*)</div>
                <div class="pixel-rock" style="left:20%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:80%;bottom:5px;">^</div>
                <div class="pixel-wave" style="bottom:5px;font-size:6px;">~~~~~~~~~~~~~~~~~~~~~</div>
            </div>`
        },

        // Indigo Plateau (Johto) — rematch league HQ, with a mandatory restock stop
        indigo_plateau_johto: {
            sky: 'var(--gsc-lightest)', ground: 'var(--gsc-dark)',
            art: `<div class="pixel-scene johto-scene mountain-scene">
                <div class="pixel-cloud" style="top:3px;left:15%;">~~</div>
                <div class="pixel-mountain" style="left:0%;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                ${landmark(LEAGUE_SHAPE, 'left:32%;bottom:5px;')}
                ${landmark(CENTER_SHAPE, 'left:62%;bottom:5px;')}
                ${landmark(MART_SHAPE, 'left:80%;bottom:5px;')}
                <div class="pixel-torch" style="left:30%;bottom:25px;">*</div>
                <div class="pixel-torch" style="left:58%;bottom:25px;">*</div>
                <div class="pixel-mountain" style="left:93%;font-size:9px;">/\\</div>
            </div>`
        },

        // Route 28 / Mt. Silver — the longest, harshest stretch in the game;
        // deliberately the densest, most imposing scene of the whole run
        route_28_mt_silver: {
            sky: 'var(--gsc-shadow)', ground: 'var(--gsc-darkest)',
            art: `<div class="pixel-scene johto-scene mountain-scene">
                <div class="pixel-fog"></div>
                <div class="pixel-mountain" style="left:0%;top:0px;font-size:14px;">/\\<br>/&nbsp;&nbsp;\\<br>/&nbsp;&nbsp;&nbsp;&nbsp;\\</div>
                <div class="pixel-mountain" style="left:18%;top:6px;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                <div class="pixel-mountain" style="left:38%;top:-2px;font-size:16px;">/\\<br>/&nbsp;&nbsp;\\<br>/&nbsp;&nbsp;&nbsp;&nbsp;\\<br>/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\\</div>
                <div class="pixel-mountain" style="left:62%;top:4px;font-size:11px;">/\\<br>/&nbsp;&nbsp;\\</div>
                <div class="pixel-mountain" style="left:80%;top:0px;font-size:14px;">/\\<br>/&nbsp;&nbsp;\\<br>/&nbsp;&nbsp;&nbsp;&nbsp;\\</div>
                <div class="pixel-icicle" style="left:10%;top:30px;">Y</div>
                <div class="pixel-icicle" style="left:70%;top:35px;">Y Y</div>
                <div class="pixel-rock" style="left:25%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:50%;bottom:8px;">^</div>
                <div class="pixel-rock" style="left:75%;bottom:5px;">^^</div>
                <div class="pixel-npc" style="left:85%;bottom:10px;font-size:8px;">o</div>
                <div class="pixel-snow-particle"></div>
            </div>`
        },

        // Victory Road (Johto) — a deliberate callback to Kanto's Victory Road
        // cave: plain --gb-* palette (no .johto-scene shift), same dense
        // stalactite/rock/glow "ultimate test" cave layout as the Kanto cave art.
        victory_road_johto: {
            sky: '#0f380f', ground: '#0f380f',
            art: `<div class="pixel-scene cave-scene">
                <div class="pixel-stalactite" style="left:6%;">V V</div>
                <div class="pixel-stalactite" style="left:24%;">V</div>
                <div class="pixel-stalactite" style="left:42%;">V V V</div>
                <div class="pixel-stalactite" style="left:60%;">V</div>
                <div class="pixel-stalactite" style="left:78%;">V V</div>
                <div class="pixel-glow" style="left:48%;top:22%;font-size:16px;">(*)</div>
                <div class="pixel-rock" style="left:10%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:30%;bottom:8px;">^</div>
                <div class="pixel-rock" style="left:55%;bottom:5px;">^^</div>
                <div class="pixel-rock" style="left:72%;bottom:8px;">^</div>
                <div class="pixel-rock" style="left:88%;bottom:5px;">^^</div>
                <div class="pixel-fossil" style="left:20%;bottom:12px;font-size:7px;">@</div>
                <div class="pixel-npc" style="left:50%;bottom:18px;font-size:6px;">o</div>
            </div>`
        }
    };
})();

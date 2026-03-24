// Porygon Trail - Per-Location Scene Definitions
// Unique ASCII art for each Kanto location
(function() {
    const PT = window.PorygonTrail;
    PT.Data = PT.Data || {};

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
                <div class="pixel-building" style="left:58%;height:50px;font-size:7px;">[LAB]<br>[==]<br>[==]</div>
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
                <div class="pixel-building" style="left:10%;height:45px;font-size:7px;">[P+]<br>[==]</div>
                <div class="pixel-building" style="left:32%;height:45px;font-size:7px;">[M]<br>[==]</div>
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
                <div class="pixel-building" style="left:5%;height:55px;font-size:6px;">[####]<br>[MUSEUM]<br>[####]</div>
                <div class="pixel-rock" style="left:38%;bottom:5px;">^^</div>
                <div class="pixel-building" style="left:50%;height:40px;font-size:7px;">[GYM]<br>[==]</div>
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
                <div class="pixel-building" style="left:5%;height:45px;font-size:7px;">[P+]<br>[==]</div>
                <div class="pixel-building" style="left:25%;height:45px;font-size:7px;">[~]<br>[==]</div>
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
                <div class="pixel-building" style="left:5%;height:45px;font-size:7px;">[!]<br>[==]</div>
                <div class="pixel-building" style="left:22%;height:35px;font-size:7px;">[==]<br>[==]</div>
                <div class="pixel-crane" style="left:42%;top:20px;font-size:6px;">/--o</div>
                <div class="pixel-ship" style="left:55%;bottom:5px;font-size:6px;">__|===|__<br>&nbsp;&nbsp;|_T_|</div>
                <div class="pixel-dock" style="left:50%;bottom:2px;font-size:6px;">|||&nbsp;|||&nbsp;|||</div>
            </div>`
        },

        // Lavender Town — Pokemon Tower, gravestones, ghosts, fog
        lavender_town: {
            sky: '#306230', ground: '#0f380f',
            art: `<div class="pixel-scene lavender-scene">
                <div class="pixel-building" style="left:40%;height:80px;font-size:7px;">/-\\<br>[+]<br>[+]<br>[+]<br>[+]</div>
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
                <div class="pixel-building" style="left:5%;height:75px;font-size:6px;">[==]<br>[==]<br>[DEPT]<br>[==]<br>[==]</div>
                <div class="pixel-building" style="left:28%;height:40px;font-size:7px;">[$]<br>[==]</div>
                <div class="pixel-building" style="left:48%;height:45px;font-size:7px;">[*]<br>[==]<br>[==]</div>
                <div class="pixel-building" style="left:68%;height:35px;font-size:7px;">[==]<br>[==]</div>
                <div class="pixel-tree" style="left:85%;bottom:5px;font-size:10px;">&Delta;<br>|</div>
                <div class="pixel-flower" style="left:88%;bottom:5px;font-size:6px;">*</div>
                <div class="pixel-flower" style="left:92%;bottom:8px;font-size:6px;">*</div>
            </div>`
        },

        // Saffron City — Silph Co. tower, Fighting Dojo, Sabrina's gym
        saffron_city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-building" style="left:8%;height:40px;font-size:7px;">[!!]<br>[==]</div>
                <div class="pixel-building" style="left:30%;height:90px;font-size:6px;">T<br>[S]<br>[=]<br>[=]<br>[=]<br>[=]</div>
                <div class="pixel-building" style="left:55%;height:45px;font-size:7px;">[o]<br>[==]<br>[==]</div>
                <div class="pixel-building" style="left:75%;height:55px;font-size:7px;">[=]<br>[=]<br>[=]</div>
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
                <div class="pixel-building" style="left:70%;height:35px;font-size:7px;opacity:0.6;">[GYM]<br>[==]</div>
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
                <div class="pixel-building" style="left:5%;height:45px;font-size:6px;">[##]<br>[/\\]<br>[==]</div>
                <div class="pixel-building" style="left:75%;height:35px;font-size:7px;">[?]<br>[==]</div>
                <div class="pixel-wave" style="bottom:0px;font-size:6px;">~~~~~~~~~~~~~~~~~~~~~</div>
            </div>`
        },

        // Viridian City Return — Giovanni's gym open, Team Rocket flags
        viridian_city_return: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:10px;left:45%;">~~</div>
                <div class="pixel-building" style="left:10%;height:45px;font-size:7px;">[P+]<br>[==]</div>
                <div class="pixel-building" style="left:35%;height:55px;font-size:7px;">R<br>[G]<br>[==]<br>[==]</div>
                <div class="pixel-tree" style="left:60%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:75%;">&Delta;<br>|</div>
                <div class="pixel-building" style="left:85%;height:35px;font-size:7px;">[M]<br>[==]</div>
            </div>`
        },

        // Indigo Plateau — Victory Road cave, Pokemon League building, grand staircase
        indigo_plateau: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene mountain-scene">
                <div class="pixel-cloud" style="top:3px;left:15%;">~~</div>
                <div class="pixel-mountain" style="left:0%;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                <div class="pixel-mountain" style="left:20%;font-size:8px;">/\\</div>
                <div class="pixel-building" style="left:50%;height:65px;font-size:6px;">[===]<br>[POK]<br>[LGE]<br>[===]</div>
                <div class="pixel-stairs" style="left:55%;bottom:3px;font-size:5px;">/___/___/</div>
                <div class="pixel-rock" style="left:80%;bottom:8px;">^^</div>
                <div class="pixel-mountain" style="left:85%;font-size:10px;">/\\<br>/&nbsp;&nbsp;\\</div>
                <div class="pixel-torch" style="left:48%;bottom:25px;">*</div>
                <div class="pixel-torch" style="left:72%;bottom:25px;">*</div>
            </div>`
        }
    };
})();

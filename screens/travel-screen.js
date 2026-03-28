// Porygon Trail - Travel Screen (Main Gameplay)
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Pokemon size categories based on actual game sizes
    // small: ~0-3ft, medium: ~3-6ft, large: 6ft+
    const POKEMON_SIZE = {
        // Small: tiny/baby Pokemon
        10: 's', 11: 's', 13: 's', 14: 's', 16: 's', 19: 's', 21: 's', 23: 's',
        25: 's', 27: 's', 29: 's', 32: 's', 35: 's', 37: 's', 39: 's', 41: 's',
        43: 's', 46: 's', 48: 's', 50: 's', 52: 's', 54: 's', 56: 's', 60: 's',
        63: 's', 66: 's', 69: 's', 72: 's', 74: 's', 77: 's', 79: 's', 81: 's',
        84: 's', 86: 's', 88: 's', 90: 's', 92: 's', 96: 's', 98: 's', 100: 's',
        102: 's', 104: 's', 109: 's', 116: 's', 118: 's', 120: 's', 129: 's',
        132: 's', 133: 's', 138: 's', 140: 's', 147: 's',
        // Medium: mid-size Pokemon
        1: 'm', 2: 'm', 4: 'm', 5: 'm', 7: 'm', 8: 'm', 12: 'm', 15: 'm',
        17: 'm', 20: 'm', 22: 'm', 24: 'm', 26: 'm', 28: 'm', 30: 'm', 33: 'm',
        36: 'm', 38: 'm', 40: 'm', 42: 'm', 44: 'm', 45: 'm', 47: 'm', 49: 'm',
        51: 'm', 53: 'm', 55: 'm', 57: 'm', 58: 'm', 61: 'm', 64: 'm', 67: 'm',
        70: 'm', 71: 'm', 73: 'm', 75: 'm', 78: 'm', 80: 'm', 82: 'm', 83: 'm',
        85: 'm', 87: 'm', 89: 'm', 91: 'm', 93: 'm', 97: 'm', 99: 'm', 101: 'm',
        105: 'm', 106: 'm', 107: 'm', 108: 'm', 110: 'm', 111: 'm', 113: 'm',
        114: 'm', 117: 'm', 119: 'm', 121: 'm', 122: 'm', 123: 'm', 124: 'm',
        125: 'm', 126: 'm', 127: 'm', 128: 'm', 131: 'm', 134: 'm', 135: 'm',
        136: 'm', 137: 'm', 139: 'm', 141: 'm', 142: 'm', 148: 'm', 151: 'm',
        // Large: fully evolved beasts, legendaries
        3: 'l', 6: 'l', 9: 'l', 18: 'l', 31: 'l', 34: 'l', 59: 'l', 62: 'l',
        65: 'l', 68: 'l', 76: 'l', 94: 'l', 95: 'l', 103: 'l', 112: 'l',
        115: 'l', 130: 'l', 143: 'l', 144: 'l', 145: 'l', 146: 'l', 149: 'l',
        150: 'l', 0: 'l'
    };

    function getPokemonSizeClass(pokemonId) {
        const size = POKEMON_SIZE[pokemonId] || 'm';
        return 'poke-size-' + size;
    }

    const TERRAIN_SCENES = {
        town: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene town-scene">
                <div class="pixel-cloud" style="top:12px;left:15%;">~~~</div>
                <div class="pixel-cloud" style="top:20px;left:65%;">~~</div>
                <div class="pixel-house" style="left:15%;">_[]_<br>|__|</div>
                <div class="pixel-house" style="left:55%;">_[]_<br>|__|</div>
                <div class="pixel-tree" style="left:38%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:80%;">&Delta;<br>|</div>
            </div>`
        },
        city: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene city-scene">
                <div class="pixel-cloud" style="top:8px;left:40%;">~~~</div>
                <div class="pixel-building" style="left:10%;height:60px;">[=]<br>[=]<br>[=]</div>
                <div class="pixel-building" style="left:30%;height:45px;">[=]<br>[=]</div>
                <div class="pixel-building" style="left:50%;height:70px;">[P]<br>[=]<br>[=]<br>[=]</div>
                <div class="pixel-building" style="left:70%;height:50px;">[+]<br>[=]<br>[=]</div>
                <div class="pixel-tree" style="left:90%;">&Delta;<br>|</div>
            </div>`
        },
        cave: {
            sky: '#0f380f', ground: '#0f380f',
            art: `<div class="pixel-scene cave-scene">
                <div class="pixel-stalactite" style="left:20%;">V V</div>
                <div class="pixel-stalactite" style="left:60%;">V</div>
                <div class="pixel-stalactite" style="left:80%;">V V V</div>
                <div class="pixel-rock" style="left:15%;bottom:40px;">^</div>
                <div class="pixel-rock" style="left:45%;bottom:40px;">^^</div>
                <div class="pixel-rock" style="left:75%;bottom:40px;">^</div>
                <div class="pixel-glow" style="left:50%;top:40%;">*</div>
            </div>`
        },
        water: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene water-scene">
                <div class="pixel-cloud" style="top:10px;left:30%;">~~~</div>
                <div class="pixel-wave" style="bottom:55px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:45px;">~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-wave" style="bottom:35px;">~~~~~~~~~~~~~~~~~~~~~</div>
                <div class="pixel-island" style="left:60%;bottom:50px;">_/\\_</div>
            </div>`
        },
        mountain: {
            sky: '#8bac0f', ground: '#306230',
            art: `<div class="pixel-scene mountain-scene">
                <div class="pixel-cloud" style="top:5px;left:20%;">~~</div>
                <div class="pixel-mountain" style="left:10%;">/\\<br>/ &nbsp;\\</div>
                <div class="pixel-mountain" style="left:40%;font-size:12px;">/\\<br>/&nbsp;&nbsp;\\<br>/&nbsp;&nbsp;&nbsp;&nbsp;\\</div>
                <div class="pixel-mountain" style="left:70%;">/\\<br>/ &nbsp;\\</div>
                <div class="pixel-rock" style="left:55%;bottom:40px;">^</div>
            </div>`
        },
        route: {
            sky: '#9bbc0f', ground: '#306230',
            art: `<div class="pixel-scene route-scene">
                <div class="pixel-cloud" style="top:15px;left:25%;">~~~</div>
                <div class="pixel-cloud" style="top:10px;left:70%;">~~</div>
                <div class="pixel-tree" style="left:10%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:30%;">&Delta;<br>|</div>
                <div class="pixel-tree" style="left:85%;">&Delta;<br>|</div>
                <div class="pixel-grass" style="left:50%;bottom:42px;">vvv</div>
                <div class="pixel-grass" style="left:65%;bottom:42px;">vv</div>
            </div>`
        }
    };

    // Time-of-day cycle based on days elapsed
    function getTimeOfDay(daysElapsed) {
        const phases = ['morning', 'day', 'evening', 'night'];
        return phases[daysElapsed % 4];
    }

    // Deterministic weather based on day + location (no flicker on re-render)
    function getWeather(state, route) {
        // Caves have no weather
        if (route.terrain === 'cave') return { type: 'clear', html: '' };

        // Seed: combine day and route id for deterministic result
        const seed = state.daysElapsed * 31 + route.id.length * 7;
        const roll = ((seed * 9301 + 49297) % 233280) / 233280; // Simple LCG

        // 30% chance of weather
        if (roll > 0.30) return { type: 'clear', html: '' };

        // Pick weather type based on terrain
        const weatherRoll = ((seed * 7919 + 12345) % 233280) / 233280;
        let weatherType;

        if (route.terrain === 'water' || route.id === 'seafoam_islands') {
            weatherType = weatherRoll < 0.4 ? 'rain' : (weatherRoll < 0.7 ? 'fog' : 'snow');
        } else if (route.terrain === 'mountain') {
            weatherType = weatherRoll < 0.4 ? 'rain' : (weatherRoll < 0.7 ? 'fog' : 'wind');
        } else {
            weatherType = weatherRoll < 0.6 ? 'rain' : 'fog';
        }

        // Seafoam always snows instead of rains
        if (route.id === 'seafoam_islands' && weatherType === 'rain') weatherType = 'snow';

        let html = '';
        if (weatherType === 'rain') {
            let drops = '';
            for (let i = 0; i < 18; i++) {
                const left = (i * 5.5 + 2) % 100;
                const delay = (i * 0.15) % 1.5;
                drops += `<div class="weather-drop" style="left:${left}%;animation-delay:${delay}s;">|</div>`;
            }
            html = `<div class="weather-rain">${drops}</div>`;
        } else if (weatherType === 'fog') {
            html = `<div class="weather-fog"><div class="fog-layer fog-layer-1"></div><div class="fog-layer fog-layer-2"></div></div>`;
        } else if (weatherType === 'wind') {
            let gusts = '';
            for (let i = 0; i < 8; i++) {
                const top = 15 + (i * 10) % 70;
                const delay = (i * 0.3) % 2;
                gusts += `<div class="weather-gust" style="top:${top}%;animation-delay:${delay}s;">~~</div>`;
            }
            html = `<div class="weather-wind">${gusts}</div>`;
        } else if (weatherType === 'snow') {
            let flakes = '';
            for (let i = 0; i < 15; i++) {
                const left = (i * 6.5 + 3) % 100;
                const delay = (i * 0.2) % 2;
                const char = i % 3 === 0 ? '*' : '.';
                flakes += `<div class="weather-flake" style="left:${left}%;animation-delay:${delay}s;">${char}</div>`;
            }
            html = `<div class="weather-snow">${flakes}</div>`;
        }

        return { type: weatherType, html };
    }

    // Time-of-day bonus elements (stars at night, sun glow at morning)
    function getTimeElements(timeOfDay) {
        if (timeOfDay === 'night') {
            return `<div class="time-stars">
                <div class="time-star" style="top:12%;left:15%;">.</div>
                <div class="time-star" style="top:8%;left:45%;">*</div>
                <div class="time-star" style="top:18%;left:75%;">.</div>
                <div class="time-star" style="top:5%;left:88%;">.</div>
                <div class="time-star" style="top:22%;left:32%;">*</div>
            </div>`;
        }
        if (timeOfDay === 'morning') {
            return `<div class="time-sun" style="top:10%;right:10%;">*</div>`;
        }
        return '';
    }

    PT.Screens.TRAVEL = {
        render(container, state) {
            const route = PT.Engine.GameState.getCurrentRoute(state);

            // Pokemon League — show mandatory Pokemon Center heal, then E4
            if (route.id === 'pokemon_league') {
                if (state.hasWon) {
                    PT.App.goto('VICTORY');
                    return;
                }
                showE4PokemonCenter(container, state);
                return;
            }

            const nextRoute = PT.Engine.GameState.getNextRoute(state);
            // Two-tier scene lookup: per-location first, then terrain fallback
            const locationScenes = PT.Data.LocationScenes || {};
            const scene = locationScenes[route.id] || TERRAIN_SCENES[route.terrain] || TERRAIN_SCENES.route;
            const progress = nextRoute ? Math.min(100, (state.distanceTraveled / route.distanceToNext) * 100) : 100;
            const isAtDestination = state.currentLocationIndex >= PT.Data.Routes.length - 1;

            // Dynamic state elements
            const timeOfDay = getTimeOfDay(state.daysElapsed);
            const weather = getWeather(state, route);
            const timeElements = route.terrain !== 'cave' ? getTimeElements(timeOfDay) : '';

            // Trainer sprite leads the party
            const trainerSprite = `<div class="trail-trainer-sprite" title="${state.trainerName}"></div>`;

            // Party Pokemon sprites — all alive members walk in a line, sized by actual Pokemon size
            const aliveParty = state.party.filter(p => p.status !== 'fainted' && p.hp > 0);
            const partySprites = aliveParty.map((p, i) => {
                const spriteUrl = PT.Engine.GameState.getSpriteUrl(p.id);
                const delay = (i + 1) * 0.15; // stagger the bounce, +1 to offset from trainer
                const sizeClass = getPokemonSizeClass(p.id);
                return `<img class="trail-pokemon-sprite ${sizeClass}" src="${spriteUrl}" alt="${p.name}" style="animation-delay:${delay}s;" onerror="this.style.display='none'">`;
            }).join('');
            const trainerHtml = trainerSprite + partySprites;

            // Position party group along the path based on travel progress
            const trainerLeft = Math.max(3, Math.min(75, progress * 0.75 + 3));

            const div = document.createElement('div');
            div.className = 'screen travel-screen';
            div.innerHTML = `
                <div class="travel-header">
                    <span>Day ${state.daysElapsed} | ${state.trainerName}</span>
                    <span>${state.badges.filter(b => b !== 'champion').length} Badges | ${state.pokedexCaught.length} Caught</span>
                    <button class="btn-map" id="btn-map" title="Map">MAP</button>
                </div>

                <div class="travel-scene" data-time="${timeOfDay}" style="background: ${scene.sky}">
                    <div class="scene-terrain">
                        <div class="scene-sky">
                            ${scene.art || ''}
                            ${timeElements}
                        </div>
                        <div class="scene-location-name">${route.name}</div>
                        <div class="scene-ground" style="background: ${scene.ground}">
                            <div class="scene-path"></div>
                            <div class="scene-trainer" id="scene-trainer" style="left:${trainerLeft}%">${trainerHtml}</div>
                        </div>
                    </div>
                    ${weather.html}
                    <div class="time-overlay"></div>
                </div>

                <div class="travel-progress">
                    <div style="display: flex; justify-content: space-between; font-size: 7px; margin-bottom: 2px;">
                        <span>${route.name}</span>
                        <span>${nextRoute ? nextRoute.name : 'VICTORY!'}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-labels">
                        <span>${state.distanceTraveled} / ${route.distanceToNext} mi</span>
                        <span>${nextRoute ? (route.distanceToNext - state.distanceTraveled) + ' mi left' : 'ARRIVED'}</span>
                    </div>
                </div>

                <div class="travel-resources">
                    <div class="resource-item">
                        <div class="resource-label">FOOD</div>
                        <div class="resource-value ${state.resources.food <= 10 ? 'low' : ''}">${state.resources.food}</div>
                    </div>
                    <div class="resource-item">
                        <div class="resource-label">BALLS</div>
                        <div class="resource-value ${state.resources.pokeballs + state.resources.greatballs + state.resources.ultraballs <= 3 ? 'low' : ''}">${state.resources.pokeballs + state.resources.greatballs + state.resources.ultraballs}</div>
                    </div>
                    <div class="resource-item">
                        <div class="resource-label">POTIONS</div>
                        <div class="resource-value">${state.resources.potions + state.resources.superPotions}</div>
                    </div>
                    <div class="resource-item">
                        <div class="resource-label">MONEY</div>
                        <div class="resource-value">$${state.resources.money}</div>
                    </div>
                </div>

                <div class="pace-selector" style="justify-content: center; margin: 4px 0;">
                    ${[
                        { key: 'explore', label: 'EXPLORE', dist: '0 mi', note: 'heal' },
                        { key: 'steady', label: 'STEADY', dist: '~12 mi', note: '' },
                        { key: 'push', label: 'PUSH', dist: '~20 mi', note: 'risky' }
                    ].map(p => `
                        <button class="pace-btn ${state.pace === p.key ? 'active' : ''}" data-pace="${p.key}">
                            ${p.label}<span style="display:block;font-size:6px;opacity:0.8;">${p.dist}${p.note ? ' · ' + p.note : ''}</span>
                        </button>
                    `).join('')}
                </div>

                <div class="travel-actions">
                    <button class="btn btn-small" id="btn-continue">${isAtDestination ? 'FINAL STOP' : 'CONTINUE'}</button>
                    <button class="btn btn-small" id="btn-inventory">BAG</button>
                    ${route.hasShop ? '<button class="btn btn-small" id="btn-shop">MART</button>' : '<button class="btn btn-small" disabled>NO MART</button>'}
                    ${route.hasGym && !state.badges.includes(PT.Data.GymLeaders[route.gymLeader]?.badge)
                            ? `<button class="btn btn-small" id="btn-gym">GYM</button>`
                            : '<button class="btn btn-small" disabled>NO GYM</button>'}
                    ${route.hasCenter ? '<button class="btn btn-small" id="btn-center">CENTER</button>' : '<button class="btn btn-small" disabled>NO CENTER</button>'}
                    <button class="btn btn-small" id="btn-save">SAVE</button>
                </div>

                <div class="travel-party-hp" id="travel-party-hp">
                    ${state.party.map((p, idx) => `
                        <div class="travel-party-member ${p.hp <= 1 ? 'critical' : ''}" data-party-idx="${idx}" style="cursor:pointer;">
                            <img class="travel-party-sprite" src="${p.spriteUrl}" alt="${p.name}" onerror="this.style.display='none'">
                            <div class="travel-party-info">
                                <div class="travel-party-name">${p.name}</div>
                                <div class="travel-hp-bar">
                                    <div class="travel-hp-fill ${p.hp <= 1 ? 'low' : p.hp <= Math.ceil(p.maxHp / 2) ? 'mid' : ''}" style="width:${(p.hp / p.maxHp) * 100}%"></div>
                                </div>
                                <div class="travel-hp-text">HP ${p.hp}/${p.maxHp}${p.status !== 'healthy' ? ' ' + p.status.toUpperCase() : ''}${(p.battleStars || 0) > 0 ? ' <span class="battle-stars">' + '★'.repeat(p.battleStars) + '</span>' : ''}</div>
                            </div>
                        </div>
                    `).join('')}
                    ${state.party.length === 0 ? '<div style="text-align:center;font-size:7px;">No Pokemon!</div>' : ''}
                </div>
            `;
            container.appendChild(div);

            // Pace buttons
            document.querySelectorAll('.pace-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.pace = btn.dataset.pace;
                    document.querySelectorAll('.pace-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            // Continue button
            function proceedWithDay() {
                const results = PT.Engine.TravelEngine.advanceDay(state);
                results.messages.forEach(msg => PT.Engine.GameState.addToLog(state, msg));

                if (results.gameOver) {
                    PT.App.goto('GAMEOVER');
                    return;
                }

                // Psychic choice — show picker instead of going straight to encounter/event
                if (results.psychicChoice && results.psychicAlt) {
                    const nextAfterPick = () => {
                        if (results.psychicChoice === 'encounter') {
                            showPsychicPicker(results, state);
                        } else {
                            showPsychicEventPicker(results, state);
                        }
                    };
                    showDayRecap(results.messages, nextAfterPick, null, null, null);
                    return;
                }

                // Determine what happens next after the popup
                let nextAction;
                if (results.encounter) {
                    nextAction = () => PT.App.goto('ENCOUNTER', { pokemon: results.encounter });
                } else if (results.event) {
                    nextAction = () => PT.App.goto('EVENT', { event: results.event });
                } else if (results.arrivedAtLocation) {
                    nextAction = () => {
                        state._gymWarningShown = null;
                        handleArrival(state);
                    };
                } else {
                    nextAction = () => PT.App.goto('TRAVEL');
                }

                // Show day recap popup
                showDayRecap(results.messages, nextAction, results.encounter, results.event, results.arrivedAtLocation ? PT.Engine.GameState.getCurrentRoute(state) : null);
            }

            function showDayRecap(messages, nextAction, encounter, event, arrivedRoute) {
                // Build recap lines
                const lines = messages.length > 0
                    ? messages.map(m => `<div class="recap-line">${m}</div>`).join('')
                    : '<div class="recap-line">Nothing eventful happened.</div>';

                // Hint about what's coming next
                let nextHint = '';
                if (encounter) {
                    const pokeName = encounter.name || 'a wild Pokemon';
                    nextHint = `<div class="recap-next">⚡ A wild ${pokeName} appeared!</div>`;
                } else if (event) {
                    nextHint = `<div class="recap-next">❗ Something is happening ahead...</div>`;
                } else if (arrivedRoute) {
                    nextHint = `<div class="recap-next">📍 Arrived at ${arrivedRoute.name}!</div>`;
                }

                // Create overlay
                const overlay = document.createElement('div');
                overlay.className = 'day-recap-overlay';
                overlay.innerHTML = `
                    <div class="day-recap-popup">
                        <div class="day-recap-title">Day ${state.daysElapsed} Report</div>
                        <div class="day-recap-body">
                            ${lines}
                            ${nextHint}
                        </div>
                        <button class="btn btn-small day-recap-btn" id="btn-recap-ok">OK</button>
                    </div>
                `;
                document.querySelector('.travel-screen').appendChild(overlay);

                // Update party HP display in real-time behind the popup
                const hpPanel = document.getElementById('travel-party-hp');
                if (hpPanel) {
                    hpPanel.innerHTML = state.party.map((p, idx) => `
                        <div class="travel-party-member ${p.hp <= 1 ? 'critical' : ''}" data-party-idx="${idx}" style="cursor:pointer;">
                            <img class="travel-party-sprite" src="${p.spriteUrl}" alt="${p.name}" onerror="this.style.display='none'">
                            <div class="travel-party-info">
                                <div class="travel-party-name">${p.name}</div>
                                <div class="travel-hp-bar">
                                    <div class="travel-hp-fill ${p.hp <= 1 ? 'low' : p.hp <= Math.ceil(p.maxHp / 2) ? 'mid' : ''}" style="width:${(p.hp / p.maxHp) * 100}%"></div>
                                </div>
                                <div class="travel-hp-text">HP ${p.hp}/${p.maxHp}${p.status !== 'healthy' ? ' ' + p.status.toUpperCase() : ''}${(p.battleStars || 0) > 0 ? ' <span class="battle-stars">' + '★'.repeat(p.battleStars) + '</span>' : ''}</div>
                            </div>
                        </div>
                    `).join('');
                    bindPartyClicks(state);
                }

                document.getElementById('btn-recap-ok').addEventListener('click', () => {
                    overlay.remove();
                    nextAction();
                });
            }

            // Psychic encounter picker — choose between two wild Pokemon
            function showPsychicPicker(results, state) {
                const enc1 = results.encounter;
                const enc2 = results.psychicAlt;
                const overlay = document.createElement('div');
                overlay.className = 'day-recap-overlay';
                overlay.innerHTML = `
                    <div class="day-recap-popup" style="max-width: 90%;">
                        <div class="day-recap-title">🔮 PSYCHIC FORESIGHT</div>
                        <div class="day-recap-body" style="font-size: 7px; text-align: center;">
                            Your Psychic-type senses two wild Pokemon nearby. Choose which to face!
                        </div>
                        <div style="display: flex; gap: 8px; justify-content: center; margin: 8px 0;">
                            <button class="btn btn-small psychic-pick" data-pick="1" style="flex: 1; padding: 8px 4px;">
                                <img src="${enc1.spriteUrl}" style="width: 40px; height: 40px; image-rendering: pixelated; display: block; margin: 0 auto 4px;" onerror="this.style.display='none'">
                                <div style="font-size: 7px;">${enc1.name}</div>
                                <div style="font-size: 6px;">${enc1.types.join('/')} | ${enc1.rarity}</div>
                            </button>
                            <button class="btn btn-small psychic-pick" data-pick="2" style="flex: 1; padding: 8px 4px;">
                                <img src="${enc2.spriteUrl}" style="width: 40px; height: 40px; image-rendering: pixelated; display: block; margin: 0 auto 4px;" onerror="this.style.display='none'">
                                <div style="font-size: 7px;">${enc2.name}</div>
                                <div style="font-size: 6px;">${enc2.types.join('/')} | ${enc2.rarity}</div>
                            </button>
                        </div>
                    </div>
                `;
                document.querySelector('.travel-screen').appendChild(overlay);

                overlay.querySelectorAll('.psychic-pick').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const pick = btn.dataset.pick;
                        const chosen = pick === '1' ? enc1 : enc2;
                        overlay.remove();
                        PT.App.goto('ENCOUNTER', { pokemon: chosen });
                    });
                });
            }

            // Psychic event picker — choose between two events
            function showPsychicEventPicker(results, state) {
                const evt1 = results.event;
                const evt2 = results.psychicAlt;
                const overlay = document.createElement('div');
                overlay.className = 'day-recap-overlay';
                overlay.innerHTML = `
                    <div class="day-recap-popup" style="max-width: 90%;">
                        <div class="day-recap-title">🔮 PSYCHIC FORESIGHT</div>
                        <div class="day-recap-body" style="font-size: 7px; text-align: center;">
                            Your Psychic-type foresees two possible futures. Choose your path!
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 6px; margin: 8px 0;">
                            <button class="btn btn-small psychic-evt-pick" data-pick="1" style="padding: 8px; text-align: left;">
                                <div style="font-size: 8px; font-weight: bold;">🔮 ${evt1.name}</div>
                                <div style="font-size: 6px; margin-top: 2px;">${evt1.description.substring(0, 80)}...</div>
                            </button>
                            <button class="btn btn-small psychic-evt-pick" data-pick="2" style="padding: 8px; text-align: left;">
                                <div style="font-size: 8px; font-weight: bold;">🔮 ${evt2.name}</div>
                                <div style="font-size: 6px; margin-top: 2px;">${evt2.description.substring(0, 80)}...</div>
                            </button>
                        </div>
                    </div>
                `;
                document.querySelector('.travel-screen').appendChild(overlay);

                overlay.querySelectorAll('.psychic-evt-pick').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const pick = btn.dataset.pick;
                        const chosen = pick === '1' ? evt1 : evt2;
                        overlay.remove();
                        PT.App.goto('EVENT', { event: chosen });
                    });
                });
            }

            document.getElementById('btn-continue').addEventListener('click', () => {
                if (isAtDestination) {
                    handleArrival(state);
                    return;
                }

                // Gym departure warning — only trigger when this CONTINUE would cause departure
                const gymLeaderData = route.hasGym ? PT.Data.GymLeaders[route.gymLeader] : null;
                const hasUnbeatenGym = gymLeaderData && !state.badges.includes(gymLeaderData.badge);
                const wouldProgress = state.pace !== 'explore';

                if (hasUnbeatenGym && wouldProgress && state._gymWarningShown !== route.id) {
                    // Estimate if this step would cause arrival
                    const paceConfig = PT.Engine.TravelEngine.PACE_CONFIG[state.pace] || PT.Engine.TravelEngine.PACE_CONFIG.steady;
                    const remaining = route.distanceToNext - state.distanceTraveled;
                    // Use max possible travel (pace + variance + fly bonus + surf bonus) to predict
                    const maxPossibleTravel = paceConfig.distance + 3 + 3 + (route.terrain === 'water' ? 5 : 0);

                    if (remaining <= maxPossibleTravel) {
                        // This continue could be the last — show gym warning
                        state._gymWarningShown = route.id;
                        // Show gym warning as overlay popup
                        const gymOverlay = document.createElement('div');
                        gymOverlay.className = 'day-recap-overlay';
                        gymOverlay.innerHTML = `
                            <div class="day-recap-popup">
                                <div class="day-recap-title">⚠️ GYM ALERT</div>
                                <div class="day-recap-body">
                                    <div class="recap-line">${gymLeaderData.name} awaits at the ${gymLeaderData.badge} gym.</div>
                                    <div class="recap-line">You're about to leave — are you sure?</div>
                                </div>
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button class="btn btn-small" id="btn-gym-warn-stay">FIGHT GYM</button>
                                    <button class="btn btn-small" id="btn-gym-warn-leave">LEAVE ANYWAY</button>
                                </div>
                            </div>
                        `;
                        document.querySelector('.travel-screen').appendChild(gymOverlay);
                        document.getElementById('btn-gym-warn-stay').addEventListener('click', () => {
                            gymOverlay.remove();
                            PT.App.goto('GYM', { gymLeader: route.gymLeader });
                        });
                        document.getElementById('btn-gym-warn-leave').addEventListener('click', () => {
                            gymOverlay.remove();
                            proceedWithDay();
                        });
                        return;
                    }
                }

                proceedWithDay();
            });

            // Inventory button
            document.getElementById('btn-inventory').addEventListener('click', () => {
                PT.App.push('INVENTORY');
            });

            // Shop button
            const shopBtn = document.getElementById('btn-shop');
            if (shopBtn) {
                shopBtn.addEventListener('click', () => {
                    PT.App.push('SHOP');
                });
            }

            // Gym button
            const gymBtn = document.getElementById('btn-gym');
            if (gymBtn) {
                gymBtn.addEventListener('click', () => {
                    PT.App.goto('GYM', { gymLeader: route.gymLeader });
                });
            }

            // Pokemon Center button
            const centerBtn = document.getElementById('btn-center');
            if (centerBtn) {
                centerBtn.addEventListener('click', () => {
                    // Full heal all party Pokemon
                    const alive = PT.Engine.GameState.getAliveParty(state);
                    let healed = 0;
                    alive.forEach(p => {
                        if (p.hp < p.maxHp || p.status !== 'healthy') {
                            p.hp = p.maxHp;
                            p.status = 'healthy';
                            healed++;
                        }
                    });
                    if (PT.Engine.Audio) PT.Engine.Audio.buy();

                    const centerOverlay = document.createElement('div');
                    centerOverlay.className = 'day-recap-overlay';
                    centerOverlay.innerHTML = `
                        <div class="day-recap-popup">
                            <div class="day-recap-title">🏥 POKEMON CENTER</div>
                            <div class="day-recap-body">
                                <div class="recap-line">${healed > 0 ? `Your Pokemon have been fully healed! (${healed} restored)` : 'Your Pokemon are already healthy!'}</div>
                            </div>
                            <button class="btn btn-small day-recap-btn" id="btn-center-ok">OK</button>
                        </div>
                    `;
                    document.querySelector('.travel-screen').appendChild(centerOverlay);
                    document.getElementById('btn-center-ok').addEventListener('click', () => {
                        centerOverlay.remove();
                        PT.App._render();
                    });
                });
            }

            // Save button
            document.getElementById('btn-save').addEventListener('click', () => {
                const saved = PT.Engine.GameState.saveGame(state);
                const saveOverlay = document.createElement('div');
                saveOverlay.className = 'day-recap-overlay';
                saveOverlay.innerHTML = `
                    <div class="day-recap-popup">
                        <div class="day-recap-title">${saved ? '💾 SAVED' : '⚠️ ERROR'}</div>
                        <div class="day-recap-body">
                            <div class="recap-line">${saved ? 'Game saved successfully!' : 'Could not save game.'}</div>
                        </div>
                        <button class="btn btn-small day-recap-btn" id="btn-save-ok">OK</button>
                    </div>
                `;
                document.querySelector('.travel-screen').appendChild(saveOverlay);
                document.getElementById('btn-save-ok').addEventListener('click', () => saveOverlay.remove());
            });

            // Map button
            document.getElementById('btn-map').addEventListener('click', () => {
                showMapOverlay(state);
            });

            // Party member click → profile popup
            bindPartyClicks(state);
        }
    };

    function showMapOverlay(state) {
        const routes = PT.Data.Routes;
        const currentIdx = state.currentLocationIndex;

        const rows = routes.map((r, i) => {
            const isCurrent = i === currentIdx;
            const isVisited = i < currentIdx;
            const isFuture = i > currentIdx;

            // Icons for amenities
            const icons = [];
            if (r.hasCenter) icons.push('🏥');
            if (r.hasShop) icons.push('🛒');
            if (r.hasGym) icons.push('⚔️');

            // Distance label
            const dist = r.distanceToNext > 0 ? `${r.distanceToNext} mi` : '—';

            // Progress on current location
            let progressText = '';
            if (isCurrent && r.distanceToNext > 0) {
                const pct = Math.floor((state.distanceTraveled / r.distanceToNext) * 100);
                progressText = ` <span style="color:var(--gb-darkest);font-weight:bold;">(${pct}%)</span>`;
            }

            const style = isCurrent
                ? 'background:var(--gb-light);font-weight:bold;'
                : isVisited
                    ? 'opacity:0.5;'
                    : '';

            return `<div style="display:flex;align-items:center;gap:4px;padding:3px 6px;font-size:8px;border-bottom:1px solid var(--gb-light);${style}">
                <span style="width:12px;text-align:center;">${isCurrent ? '▶' : isVisited ? '✓' : '·'}</span>
                <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name}</span>
                <span style="font-size:7px;min-width:36px;text-align:right;">${icons.join('')}</span>
                <span style="font-size:7px;min-width:32px;text-align:right;">${dist}${progressText}</span>
            </div>`;
        }).join('');

        const overlay = document.createElement('div');
        overlay.className = 'day-recap-overlay';
        overlay.innerHTML = `
            <div class="day-recap-popup" style="max-height:80vh;overflow-y:auto;min-width:260px;">
                <div class="day-recap-title">🗺️ KANTO MAP</div>
                <div style="font-size:7px;text-align:center;margin-bottom:4px;color:var(--gb-dark);">
                    🏥 Center &nbsp; 🛒 Mart &nbsp; ⚔️ Gym
                </div>
                <div style="border:1px solid var(--gb-dark);border-radius:2px;overflow:hidden;">
                    ${rows}
                </div>
                <button class="btn btn-small day-recap-btn" id="btn-map-close" style="margin-top:8px;">CLOSE</button>
            </div>
        `;
        document.querySelector('.travel-screen').appendChild(overlay);
        document.getElementById('btn-map-close').addEventListener('click', () => overlay.remove());
    }

    function showE4PokemonCenter(container, state) {
        // Full heal all alive party members
        PT.Engine.GameState.getAliveParty(state).forEach(p => {
            p.hp = p.maxHp;
            p.status = 'healthy';
        });

        const partyHtml = state.party.map(p => {
            return `<div style="display:flex; align-items:center; gap:6px; margin:4px 0;">
                <img src="${p.spriteUrl}" style="width:28px;height:28px;image-rendering:pixelated;" onerror="this.style.display='none'">
                <span style="font-size:9px;">${p.name}</span>
                <span style="font-size:8px;color:var(--gb-dark);">HP ${p.hp}/${p.maxHp} ✔️</span>
            </div>`;
        }).join('');

        container.innerHTML = `
            <div class="screen travel-screen" style="text-align:center;">
                <div class="event-title" style="font-size:12px;">🏥 POKEMON CENTER</div>
                <div style="font-size:9px;margin:6px 0;">Welcome to the Indigo Plateau Pokemon Center!</div>
                <div style="font-size:8px;margin:4px 0;color:var(--gb-dark);">
                    Nurse Joy: "Your Pokemon are fighting fit! Good luck against the Elite Four!"
                </div>
                <div style="border:1px solid var(--gb-dark);padding:8px;margin:8px auto;max-width:220px;text-align:left;">
                    <div style="font-size:8px;font-weight:bold;margin-bottom:4px;">All Pokemon fully healed!</div>
                    ${partyHtml}
                </div>
                <div style="font-size:7px;color:var(--gb-dark);margin:8px 0;">
                    ⚠️ There is no turning back. The Elite Four gauntlet begins now.
                </div>
                <button class="btn btn-wide" id="btn-e4-begin">ENTER THE ELITE FOUR</button>
            </div>
        `;
        document.getElementById('btn-e4-begin').addEventListener('click', () => {
            PT.App.goto('ELITEFOUR');
        });
    }

    function bindPartyClicks(state) {
        document.querySelectorAll('.travel-party-member[data-party-idx]').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.partyIdx);
                const pokemon = state.party[idx];
                if (pokemon) showPokemonProfile(pokemon, idx, state);
            });
        });
    }

    function showPokemonProfile(pokemon, partyIndex, state) {
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
            mimic: 'Copies the strongest ability in your party'
        };

        // Evolution chain
        const evoChain = PT.Engine.GameState.getEvoChain(pokemon.id);
        const evoStage = evoChain.findIndex(e => e.id === pokemon.id) + 1;
        const evoChainDisplay = evoChain.map(e =>
            e.id === pokemon.id ? `<strong>[${e.name}]</strong>` : e.name
        ).join(' → ');
        const isFinal = PT.Engine.GameState.isFinalEvolution(pokemon);

        // Stars display
        const stars = pokemon.battleStars || 0;
        const starsDisplay = stars > 0 ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆';
        const canEarnMore = isFinal && stars < 3;

        // Food cost
        const foodCost = PT.Engine.GameState.getFoodCost ? PT.Engine.GameState.getFoodCost(pokemon) : '?';

        // Potion info
        const hasPotion = state.resources.potions > 0 || state.resources.superPotions > 0;
        const isSuper = state.resources.superPotions > 0;
        const potionLabel = isSuper ? 'SUPER POTION (+2)' : 'POTION (+1)';
        const potionCount = isSuper ? state.resources.superPotions : state.resources.potions;
        const needsHeal = pokemon.hp < pokemon.maxHp;

        // Rare candy
        const hasCandy = state.resources.rareCandy > 0;
        const data = PT.Data.Pokemon.find(p => p.id === pokemon.id);
        const canEvolve = data && data.evolvesTo;

        // Food amount from butcher
        const foodAmount = PT.Engine.GameState.pokemonToFood(pokemon.rarity);

        const overlay = document.createElement('div');
        overlay.className = 'day-recap-overlay';
        overlay.innerHTML = `
            <div class="pokemon-profile-popup">
                <div class="profile-header">
                    <img class="profile-sprite" src="${pokemon.spriteUrl}" alt="${pokemon.name}"
                         onerror="this.style.display='none'">
                    <div class="profile-header-info">
                        <div class="profile-name">${pokemon.name}</div>
                        <div class="profile-types">${pokemon.types.join(' / ')} | ${pokemon.rarity.toUpperCase()}</div>
                        <div class="profile-hp-row">
                            <div class="profile-hp-bar">
                                <div class="profile-hp-fill ${pokemon.hp <= 1 ? 'low' : pokemon.hp <= Math.ceil(pokemon.maxHp / 2) ? 'mid' : ''}" style="width:${(pokemon.hp / pokemon.maxHp) * 100}%"></div>
                            </div>
                            <span class="profile-hp-text">HP ${pokemon.hp}/${pokemon.maxHp}</span>
                        </div>
                        ${pokemon.status !== 'healthy' ? `<div class="profile-status">${pokemon.status.toUpperCase()}</div>` : ''}
                    </div>
                </div>

                <div class="profile-section">
                    <div class="profile-row"><span class="profile-label">Ability:</span> <span>${pokemon.travelAbility || 'none'}</span> <span class="profile-desc">${abilityDesc[pokemon.travelAbility] || ''}</span>${[1,2,3,4,5,6,7,8,9].includes(pokemon.id) ? ' <span class="profile-hint" style="color:var(--gb-darkest);font-weight:bold;">⭐ 3x Starter</span>' : ''}</div>
                    <div class="profile-row"><span class="profile-label">Caught:</span> ${pokemon.caughtAt || 'Unknown'} (Day ${pokemon.caughtDay || 0})</div>
                    <div class="profile-row"><span class="profile-label">Evolution:</span> ${evoChainDisplay} ${isFinal ? '✓ Final' : `(${evoStage}/${evoChain.length})`}</div>
                    <div class="profile-row"><span class="profile-label">Food/day:</span> ${foodCost} ration${foodCost !== 1 ? 's' : ''}</div>
                </div>

                <div class="profile-section">
                    <div class="profile-row"><span class="profile-label">Battle Record:</span> ${pokemon.battleWins || 0} win${(pokemon.battleWins || 0) !== 1 ? 's' : ''}</div>
                    <div class="profile-row"><span class="profile-label">Stars:</span> <span class="battle-stars profile-stars">${starsDisplay}</span> (${stars}/3)${!isFinal ? ' <span class="profile-hint">needs final evo</span>' : canEarnMore ? ' <span class="profile-hint">next win = next star</span>' : stars >= 3 ? ' <span class="profile-hint">MAX</span>' : ''}</div>
                    ${pokemon._safeguarded ? '<div class="profile-row"><span class="profile-label">Safeguard:</span> <span class="profile-hint">Already saved once — no more protection</span></div>' : ''}
                </div>

                <div class="profile-actions">
                    <button class="btn btn-small profile-action-btn" id="profile-potion" ${!hasPotion || !needsHeal ? 'disabled' : ''}>${potionLabel} (${potionCount})</button>
                    <button class="btn btn-small profile-action-btn" id="profile-candy" ${!hasCandy || !canEvolve ? 'disabled' : ''}>RARE CANDY (${state.resources.rareCandy})</button>
                    <button class="btn btn-small profile-action-btn profile-danger-btn" id="profile-butcher" ${state.party.length <= 1 ? 'disabled' : ''}>BUTCHER (+${foodAmount} food)</button>
                    <button class="btn btn-small profile-action-btn" id="profile-close">CLOSE</button>
                </div>
            </div>
        `;
        document.querySelector('.travel-screen').appendChild(overlay);

        // Close
        document.getElementById('profile-close').addEventListener('click', () => overlay.remove());

        // Use Potion
        document.getElementById('profile-potion').addEventListener('click', () => {
            if (!hasPotion || !needsHeal) return;
            const useSuper = state.resources.superPotions > 0;
            const healAmt = useSuper ? 2 : 1;
            if (useSuper) state.resources.superPotions--;
            else state.resources.potions--;
            const oldHp = pokemon.hp;
            PT.Engine.GameState.healPokemon(pokemon, healAmt);
            if (PT.Engine.Audio) PT.Engine.Audio.buy();
            PT.Engine.GameState.addToLog(state, `Used ${useSuper ? 'Super Potion' : 'Potion'} on ${pokemon.name}. HP: ${oldHp} → ${pokemon.hp}`);
            overlay.remove();
            PT.App._render();
        });

        // Use Rare Candy
        document.getElementById('profile-candy').addEventListener('click', () => {
            if (state.resources.rareCandy <= 0 || !canEvolve) return;
            state.resources.rareCandy--;
            const evoResult = PT.Engine.GameState.evolvePokemon(pokemon, state);
            if (PT.Engine.Audio) PT.Engine.Audio.buy();
            if (evoResult.evolved) {
                PT.Engine.GameState.addToLog(state, `${evoResult.oldName} evolved into ${evoResult.newName}!`);
            } else {
                state.resources.rareCandy++; // refund
            }
            overlay.remove();
            PT.App._render();
        });

        // Butcher
        const butcherBtn = document.getElementById('profile-butcher');
        butcherBtn.addEventListener('click', () => {
            if (state.party.length <= 1) return;
            if (butcherBtn.dataset.confirm === 'true') {
                state.party.splice(partyIndex, 1);
                state.resources.food += foodAmount;
                PT.Engine.GameState.addToLog(state, `Butchered ${pokemon.name} for ${foodAmount} food.`);
                if (PT.Engine.Audio) PT.Engine.Audio.buy();
                overlay.remove();
                PT.App._render();
            } else {
                butcherBtn.textContent = `CONFIRM BUTCHER ${pokemon.name}?`;
                butcherBtn.dataset.confirm = 'true';
                butcherBtn.style.background = 'var(--gb-darkest)';
                butcherBtn.style.color = 'var(--gb-lightest)';
            }
        });
    }

    function handleArrival(state) {
        const route = PT.Engine.GameState.getCurrentRoute(state);

        // Pokemon League — handled by render via showE4PokemonCenter
        if (route.id === 'pokemon_league') {
            return;
        }

        // Check for location-specific events
        const locationEvent = PT.Engine.EventEngine.rollEvent(state);
        if (locationEvent) {
            PT.App.goto('EVENT', { event: locationEvent });
            return;
        }

        // Otherwise just re-render
        PT.App.goto('TRAVEL');
    }
})();

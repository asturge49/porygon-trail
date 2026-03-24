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

            // Pokemon League — never show travel screen, go straight to E4
            if (route.id === 'pokemon_league') {
                if (state.hasWon) {
                    PT.App.goto('VICTORY');
                } else {
                    PT.App.goto('ELITEFOUR');
                }
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

            // Party Pokemon sprites — all alive members walk in a line, sized by actual Pokemon size
            const aliveParty = state.party.filter(p => p.status !== 'fainted' && p.hp > 0);
            const partySprites = aliveParty.map((p, i) => {
                const spriteUrl = PT.Engine.GameState.getSpriteUrl(p.id);
                const delay = i * 0.15; // stagger the bounce
                const sizeClass = getPokemonSizeClass(p.id);
                return `<img class="trail-pokemon-sprite ${sizeClass}" src="${spriteUrl}" alt="${p.name}" style="animation-delay:${delay}s;" onerror="this.style.display='none'">`;
            }).join('');
            const trainerHtml = partySprites || '&#9658;';

            // Position party group along the path based on travel progress
            const trainerLeft = Math.max(3, Math.min(75, progress * 0.75 + 3));

            const div = document.createElement('div');
            div.className = 'screen travel-screen';
            div.innerHTML = `
                <div class="travel-header">
                    <span>Day ${state.daysElapsed} | ${state.trainerName}</span>
                    <span>${state.badges.filter(b => b !== 'champion').length} Badges | ${state.pokedexCaught.length} Caught</span>
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
                        <span>Pace: ${state.pace.toUpperCase()}</span>
                        <span>${nextRoute ? Math.floor(progress) + '%' : 'ARRIVED'}</span>
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
                    ${['explore', 'steady', 'push'].map(p => `
                        <button class="pace-btn ${state.pace === p ? 'active' : ''}" data-pace="${p}">${p.toUpperCase()}</button>
                    `).join('')}
                </div>

                <div class="travel-actions">
                    <button class="btn btn-small" id="btn-continue">${isAtDestination ? 'FINAL STOP' : 'CONTINUE'}</button>
                    <button class="btn btn-small" id="btn-party">PARTY (${state.party.length})</button>
                    <button class="btn btn-small" id="btn-inventory">ITEMS</button>
                    ${route.hasShop ? '<button class="btn btn-small" id="btn-shop">SHOP</button>' : '<button class="btn btn-small" disabled>NO SHOP</button>'}
                    ${route.hasGym && !state.badges.includes(PT.Data.GymLeaders[route.gymLeader]?.badge)
                            ? `<button class="btn btn-small" id="btn-gym">GYM</button>`
                            : '<button class="btn btn-small" disabled>NO GYM</button>'}
                    <button class="btn btn-small" id="btn-use-repel" ${state.resources.repels <= 0 || state.repelSteps > 0 ? 'disabled' : ''}>REPEL${state.repelSteps > 0 ? ` (${state.repelSteps})` : ''}</button>
                </div>

                <div class="travel-log" id="travel-log">
                    ${state.log.slice(0, 8).map(entry => `
                        <div class="log-entry">Day ${entry.day}: ${entry.text}</div>
                    `).join('')}
                    ${state.log.length === 0 ? '<div class="log-entry">Your journey begins!</div>' : ''}
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

                if (results.encounter) {
                    PT.App.goto('ENCOUNTER', { pokemon: results.encounter });
                    return;
                }

                if (results.event) {
                    PT.App.goto('EVENT', { event: results.event });
                    return;
                }

                if (results.arrivedAtLocation) {
                    state._gymWarningShown = null; // Reset gym warning for new location
                    handleArrival(state);
                    return;
                }

                // Re-render travel screen
                PT.App.goto('TRAVEL');
            }

            document.getElementById('btn-continue').addEventListener('click', () => {
                if (isAtDestination) {
                    handleArrival(state);
                    return;
                }

                // Gym departure warning — only when pace would move you (not explore)
                const gymLeaderData = route.hasGym ? PT.Data.GymLeaders[route.gymLeader] : null;
                const hasUnbeatenGym = gymLeaderData && !state.badges.includes(gymLeaderData.badge);
                const wouldProgress = state.pace !== 'explore';

                if (hasUnbeatenGym && wouldProgress && state._gymWarningShown !== route.id) {
                    state._gymWarningShown = route.id;
                    const logDiv = document.getElementById('travel-log');
                    if (logDiv) {
                        logDiv.innerHTML = `
                            <div style="text-align: center; padding: 8px;">
                                <div style="font-weight: bold; margin-bottom: 6px;">⚠️ There's a GYM here you haven't beaten!</div>
                                <div style="font-size: 7px; margin-bottom: 8px;">${gymLeaderData.name} awaits at the ${gymLeaderData.badge} gym. Are you sure you want to leave?</div>
                                <div style="display: flex; gap: 8px; justify-content: center;">
                                    <button class="btn btn-small" id="btn-gym-warn-stay">FIGHT GYM</button>
                                    <button class="btn btn-small" id="btn-gym-warn-leave">LEAVE ANYWAY</button>
                                </div>
                            </div>
                        `;
                        document.getElementById('btn-gym-warn-stay').addEventListener('click', () => {
                            PT.App.goto('GYM', { gymLeader: route.gymLeader });
                        });
                        document.getElementById('btn-gym-warn-leave').addEventListener('click', () => {
                            proceedWithDay();
                        });
                    }
                    return;
                }

                proceedWithDay();
            });

            // Party button
            document.getElementById('btn-party').addEventListener('click', () => {
                PT.App.push('PARTY');
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

            // Repel button
            document.getElementById('btn-use-repel').addEventListener('click', () => {
                if (state.resources.repels > 0 && state.repelSteps <= 0) {
                    state.resources.repels--;
                    state.repelSteps = 3;
                    PT.Engine.GameState.addToLog(state, "Used Repel! Next 3 encounters avoided.");
                    PT.App.goto('TRAVEL');
                }
            });
        }
    };

    function handleArrival(state) {
        const route = PT.Engine.GameState.getCurrentRoute(state);

        // Pokemon League — skip everything, go straight to E4 gauntlet
        if (route.id === 'pokemon_league') {
            if (state.hasWon) {
                PT.App.goto('VICTORY');
                return;
            }
            PT.App.goto('ELITEFOUR');
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

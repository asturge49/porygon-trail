// Porygon Trail - Travel Screen (Main Gameplay)
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

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

    PT.Screens.TRAVEL = {
        render(container, state) {
            const route = PT.Engine.GameState.getCurrentRoute(state);
            const nextRoute = PT.Engine.GameState.getNextRoute(state);
            const scene = TERRAIN_SCENES[route.terrain] || TERRAIN_SCENES.route;
            const progress = nextRoute ? Math.min(100, (state.distanceTraveled / route.distanceToNext) * 100) : 100;
            const isAtDestination = state.currentLocationIndex >= PT.Data.Routes.length - 1;

            const div = document.createElement('div');
            div.className = 'screen travel-screen';
            div.innerHTML = `
                <div class="travel-header">
                    <span>Day ${state.daysElapsed} | ${state.trainerName}</span>
                    <span>${state.badges.filter(b => b !== 'champion').length} Badges | ${state.pokedexCaught.length} Caught</span>
                </div>

                <div class="travel-scene" style="background: ${scene.sky}">
                    <div class="scene-terrain">
                        <div class="scene-sky">
                            ${scene.art || ''}
                        </div>
                        <div class="scene-location-name">${route.name}</div>
                        <div class="scene-ground" style="background: ${scene.ground}">
                            <div class="scene-path"></div>
                            <div class="scene-trainer" id="scene-trainer">&#9658;</div>
                        </div>
                    </div>
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
                    ${route.hasGym && !state.badges.includes(PT.Data.GymLeaders[route.gymLeader]?.badge) ? `<button class="btn btn-small" id="btn-gym">GYM</button>` : '<button class="btn btn-small" disabled>NO GYM</button>'}
                    ${route.id === 'indigo_plateau' && !state.hasWon ? `<button class="btn btn-small" id="btn-elite-four" style="font-weight: bold;">ELITE 4</button>` : ''}
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

            // Elite Four button
            const e4Btn = document.getElementById('btn-elite-four');
            if (e4Btn) {
                e4Btn.addEventListener('click', () => {
                    PT.App.goto('ELITEFOUR');
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

        // Check for location-specific events
        const locationEvent = PT.Engine.EventEngine.rollEvent(state);
        if (locationEvent) {
            PT.App.goto('EVENT', { event: locationEvent });
            return;
        }

        // Final destination - only go to victory if champion
        if (state.currentLocationIndex >= PT.Data.Routes.length - 1) {
            if (state.hasWon) {
                PT.App.goto('VICTORY');
                return;
            }
            // Not champion yet — keep rolling events (Elite Four, etc.)
            // If no events triggered, just re-render travel
            PT.App.goto('TRAVEL');
            return;
        }

        // Otherwise just re-render
        PT.App.goto('TRAVEL');
    }
})();

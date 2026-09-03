// Porygon Trail - Difficulty Level Select Screen
//
// Sits between TITLE's "NEW GAME" button and STARTER. Lets the player pick
// one of 5 difficulty levels before naming their trainer / picking a
// starter. Levels above the account's highest-unlocked level (tracked via
// PT.Engine.LeaderboardAPI.getHighestUnlockedLevel, based on Red-win
// history across all levels) are shown locked. A brand-new/logged-out
// account is capped at level 1.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Short flavor text per level — mirrors PT.Data.DifficultyLevels'
    // config (scoreMultiplier, trainersEnabled, gymGauntlet, aceTrainers,
    // routeDistanceBonus, shopPriceMultiplier) if that data is available;
    // falls back to this hardcoded copy otherwise so the screen still
    // renders correctly before/without the engine-layer data landing.
    const LEVEL_FLAVOR = {
        1: 'The base game. No trainer battles — just wild Pokemon, routes, and the gyms.',
        2: 'Trainer battles are now active on the trail alongside wild encounters.',
        3: 'Gyms become a full 3-on-3 gauntlet, and routes stretch longer.',
        4: 'Trainers now field ace Pokemon — tougher fights, bigger risk.',
        5: 'Routes stretch even longer and the Mart charges a premium. The hardest run.'
    };

    function getLevelConfigs() {
        // PT.Data.DifficultyLevels is 1-indexed (index 0 is null, so
        // DifficultyLevels[state.difficultyLevel] reads naturally) — filter
        // that placeholder out before rendering.
        const data = PT.Data && PT.Data.DifficultyLevels;
        if (Array.isArray(data)) {
            const configs = data.filter(Boolean);
            if (configs.length > 0) return configs;
        }
        // Fallback synthetic configs — used only if the engine-layer data
        // module hasn't landed yet. Shape mirrors the documented contract.
        return [1, 2, 3, 4, 5].map(level => ({ level }));
    }

    PT.Screens.LEVEL_SELECT = {
        render(container, state, params) {
            const levels = getLevelConfigs();

            const div = document.createElement('div');
            div.className = 'screen starter-screen';
            div.innerHTML = `
                <div class="text-box">
                    <p>PROF. OAK: Before you set out, choose your difficulty!</p>
                    <p style="margin-top: 8px;">Higher levels unlock as you beat Red on the ones before them.</p>
                </div>
                <div id="level-select-loading" style="text-align:center; font-size: 8px; margin: 12px 0;">
                    Checking unlocked levels...
                </div>
                <div id="level-select-body" style="display:none;">
                    <div class="starter-choices" id="level-choices" style="flex-wrap: wrap; gap: 8px;">
                        ${levels.map(lv => `
                            <div class="starter-card level-card" data-level="${lv.level}" style="width: 150px; opacity: 0.4; cursor: default; position: relative;">
                                <div class="starter-name">LEVEL ${lv.level}</div>
                                <div class="starter-bonus" style="min-height: 32px;">${LEVEL_FLAVOR[lv.level] || ''}</div>
                                <div class="level-lock-reason" style="font-size: 6px; margin-top: 6px; color: var(--gb-dark);"></div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="btn btn-wide" id="btn-level-confirm" style="margin-top: 12px;" disabled>BEGIN AT LEVEL &mdash;</button>
                </div>
            `;
            container.appendChild(div);

            let selectedLevel = null;

            function selectLevel(level, cardEl) {
                selectedLevel = level;
                document.querySelectorAll('.level-card').forEach(c => c.classList.remove('selected'));
                cardEl.classList.add('selected');
                const confirmBtn = document.getElementById('btn-level-confirm');
                confirmBtn.disabled = false;
                confirmBtn.textContent = `BEGIN AT LEVEL ${level}`;
            }

            function renderUnlocked(highestUnlocked) {
                const unlocked = Math.max(1, Math.min(5, parseInt(highestUnlocked, 10) || 1));

                document.getElementById('level-select-loading').style.display = 'none';
                document.getElementById('level-select-body').style.display = '';

                document.querySelectorAll('.level-card').forEach(card => {
                    const level = parseInt(card.dataset.level, 10);
                    const isUnlocked = level <= unlocked;
                    const reasonEl = card.querySelector('.level-lock-reason');

                    if (isUnlocked) {
                        card.style.opacity = '1';
                        card.style.cursor = 'pointer';
                        if (reasonEl) reasonEl.textContent = '';
                        card.addEventListener('click', () => selectLevel(level, card));
                    } else {
                        card.style.opacity = '0.4';
                        card.style.cursor = 'not-allowed';
                        if (reasonEl) reasonEl.textContent = `Beat Red on Level ${level - 1} to unlock`;
                    }
                });

                // Default the highlighted/pre-selected level to the highest unlocked one
                const defaultCard = document.querySelector(`.level-card[data-level="${unlocked}"]`);
                if (defaultCard) selectLevel(unlocked, defaultCard);
            }

            // getHighestUnlockedLevel may return a Promise or a plain number
            // (contract note — match whatever the real implementation does).
            // Wrapping in Promise.resolve() handles either case identically,
            // same as this screen would if it awaited it directly.
            let highestUnlockedResult = 1;
            try {
                const auth = PT.Engine.Auth;
                const accountContext = auth && auth.isLoggedIn() ? auth.getCurrentUser() : null;
                highestUnlockedResult = PT.Engine.LeaderboardAPI && PT.Engine.LeaderboardAPI.getHighestUnlockedLevel
                    ? PT.Engine.LeaderboardAPI.getHighestUnlockedLevel(accountContext)
                    : 1;
            } catch (e) {
                highestUnlockedResult = 1;
            }

            Promise.resolve(highestUnlockedResult).then(renderUnlocked).catch(() => renderUnlocked(1));

            document.getElementById('btn-level-confirm').addEventListener('click', () => {
                if (!selectedLevel) return;
                PT.App.goto('STARTER', { difficultyLevel: selectedLevel });
            });
        }
    };
})();

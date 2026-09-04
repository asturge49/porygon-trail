// Porygon Trail - Difficulty Level Select Screen
//
// Sits between TITLE's "NEW GAME" button and STARTER. Lets the player pick
// one of 5 difficulty levels before naming their trainer / picking a
// starter. Levels above the account's highest-unlocked level (tracked via
// PT.Engine.LeaderboardAPI.getHighestUnlockedLevel, based on Red-win
// history across all levels) are locked — and deliberately show no
// description at all, so a future level stays a surprise rather than a
// spoiler. A single banner strip (not a grid of cards) shows all 5 levels
// at once; selecting an unlocked level builds up a cumulative list below
// it of everything from Level 1 up through the one selected, since each
// level's changes stack on top of the ones before it.
(function() {
    const PT = window.PorygonTrail;
    PT.Screens = PT.Screens || {};

    // Each level's OWN addition only — the cumulative list shown below the
    // banner stacks these together, it doesn't restate them per level.
    const LEVEL_FLAVOR = {
        1: 'Base game',
        2: 'Trainers added to routes',
        3: 'Kanto Gym revamp + longer routes',
        4: 'Trainer pokemon upgraded',
        5: 'Longer routes + mart prices increased'
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
        return [1, 2, 3, 4, 5].map(level => ({ level, scoreMultiplier: 1 }));
    }

    PT.Screens.LEVEL_SELECT = {
        render(container, state, params) {
            const levels = getLevelConfigs();

            const div = document.createElement('div');
            div.className = 'screen level-select-screen';
            div.innerHTML = `
                <div class="text-box">
                    <p>PROF. OAK: Before you set out, choose your difficulty!</p>
                    <p style="margin-top: 8px;">Higher levels unlock as you beat Red on the ones before them.</p>
                </div>
                <div id="level-select-loading" style="text-align:center; font-size: 8px; margin: 12px 0;">
                    Checking unlocked levels...
                </div>
                <div id="level-select-body" style="display:none;">
                    <div class="level-banner" id="level-banner">
                        ${levels.map(lv => `
                            <div class="level-banner-item" data-level="${lv.level}">
                                <span class="level-banner-num">${lv.level}</span>
                                <span class="level-banner-sub">&nbsp;</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="level-details" id="level-details"></div>
                    <button class="btn btn-wide" id="btn-level-confirm" style="margin-top: 12px;" disabled>BEGIN AT LEVEL &mdash;</button>
                </div>
            `;
            container.appendChild(div);

            let selectedLevel = null;
            let highestUnlocked = 1;

            function renderDetails(level) {
                const detailsEl = document.getElementById('level-details');
                const lines = levels
                    .filter(lv => lv.level <= level)
                    .map(lv => `
                        <div class="level-detail-line">
                            <span class="level-detail-badge">LV ${lv.level}</span>
                            <span>${LEVEL_FLAVOR[lv.level] || ''}</span>
                        </div>
                    `).join('');
                const currentConfig = levels.find(lv => lv.level === level);
                const multText = currentConfig && currentConfig.scoreMultiplier
                    ? `<div class="level-detail-mult" style="text-align:center; margin-top:6px;">SCORE MULTIPLIER: ${currentConfig.scoreMultiplier}&times;</div>`
                    : '';
                detailsEl.innerHTML = `
                    <div class="level-details-title">WHAT LEVEL ${level} INCLUDES</div>
                    ${lines}
                    ${multText}
                `;
            }

            function selectLevel(level) {
                selectedLevel = level;
                document.querySelectorAll('.level-banner-item').forEach(item => {
                    item.classList.toggle('selected', parseInt(item.dataset.level, 10) === level);
                });
                renderDetails(level);
                const confirmBtn = document.getElementById('btn-level-confirm');
                confirmBtn.disabled = false;
                confirmBtn.textContent = `BEGIN AT LEVEL ${level}`;
            }

            function renderUnlocked(unlockedResult) {
                highestUnlocked = Math.max(1, Math.min(5, parseInt(unlockedResult, 10) || 1));

                document.getElementById('level-select-loading').style.display = 'none';
                document.getElementById('level-select-body').style.display = '';

                document.querySelectorAll('.level-banner-item').forEach(item => {
                    const level = parseInt(item.dataset.level, 10);
                    const isUnlocked = level <= highestUnlocked;
                    const subEl = item.querySelector('.level-banner-sub');

                    if (isUnlocked) {
                        item.classList.remove('locked');
                        if (subEl) subEl.textContent = ' '; // keep row height consistent, no spoiler text
                        item.addEventListener('click', () => selectLevel(level));
                    } else {
                        item.classList.add('locked');
                        if (subEl) subEl.textContent = 'LOCKED';
                        // Deliberately no click handler and no description —
                        // a locked level shows nothing about what it changes.
                    }
                });

                // Default the highlighted/pre-selected level to the highest unlocked one
                selectLevel(highestUnlocked);
            }

            // Staging test-environment bypass: same !PT.Config.isProd +
            // ?debug=1 gate as the rest of the debug harness (title-screen.js,
            // debug-panel-screen.js) — unlocks every level with no need to
            // actually beat Red first, so a tester can jump straight to any
            // level. Never true on prod regardless of query string.
            const debugRequested = new URLSearchParams(window.location.search).get('debug') === '1';
            const unlockAllForTesting = PT.Config && !PT.Config.isProd && debugRequested;

            // getHighestUnlockedLevel may return a Promise or a plain number
            // (contract note — match whatever the real implementation does).
            // Wrapping in Promise.resolve() handles either case identically,
            // same as this screen would if it awaited it directly.
            let highestUnlockedResult = 1;
            try {
                if (unlockAllForTesting) {
                    highestUnlockedResult = 5;
                } else {
                    const auth = PT.Engine.Auth;
                    const accountContext = auth && auth.isLoggedIn() ? auth.getCurrentUser() : null;
                    highestUnlockedResult = PT.Engine.LeaderboardAPI && PT.Engine.LeaderboardAPI.getHighestUnlockedLevel
                        ? PT.Engine.LeaderboardAPI.getHighestUnlockedLevel(accountContext)
                        : 1;
                }
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

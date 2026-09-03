// Regression guard for the staging-only battle debug panel (see
// screens/debug-panel-screen.js / engine/debug-panel.js). The panel must
// never render once PT.Config.isProd is true, even with ?debug=1 in the URL
// — that's the only thing standing between "force win/lose" and a real
// player's save.
//
// This deliberately does NOT try to fake the real prod hostname end-to-end:
// on a genuine prod domain, engine/auth.js's real Supabase login screen
// blocks navigation before TITLE ever renders (no guest bypass in prod), so
// a test that only checked "is the button on the page" after loading a faked
// prod URL would pass even if the title-screen gate were deleted — the login
// wall would be hiding the bug, not the gate. Instead we drive through TITLE
// for real on the local dev server (guest mode, no prod hostname needed),
// confirm the panel *can* show at all, then flip PT.Config.isProd — the
// exact flag production sets — and re-render, asserting it disappears.
const { test, expect } = require('@playwright/test');

test('battle debug panel disappears the moment PT.Config.isProd is true', async ({ page }) => {
    await page.goto('/?debug=1');

    const guestButton = page.locator('button:has-text("PLAY AS GUEST")');
    if (await guestButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await guestButton.click();
    }

    // Sanity check: with isProd false (local dev) and ?debug=1, the panel is reachable.
    // If this fails, the test below isn't proving anything.
    await expect(page.locator('#btn-debug-panel')).toBeVisible({ timeout: 10000 });

    // Flip the exact flag production sets, then re-render TITLE the same way the
    // app does on any navigation — no page reload, so ?debug=1 is still in the URL.
    await page.evaluate(() => {
        window.PorygonTrail.Config.isProd = true;
        window.PorygonTrail.App.goto('TITLE');
    });

    await expect(page.locator('#btn-debug-panel')).toHaveCount(0);
    await expect(page.locator('#btn-johto-debug')).toHaveCount(0);
});

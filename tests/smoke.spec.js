// Golden-path smoke test: title -> new game -> pick starter -> begin journey -> advance a day.
// Deliberately avoids asserting on cloud/auth state — CI and local runs may or may not
// have a configured Supabase project, and encounters/events are RNG-driven per run.
const { test, expect } = require('@playwright/test');

test('can start a new run and survive the first day on the trail', async ({ page }) => {
    await page.goto('/');

    // Checkouts with no Supabase config land straight on TITLE (dev mode); a configured
    // staging/prod environment requires a real account first. Sign up a disposable one —
    // this only ever runs against the staging project, never prod.
    const loginUsername = page.locator('#input-username');
    if (await loginUsername.isVisible({ timeout: 5000 }).catch(() => false)) {
        await page.click('#btn-toggle'); // switch to "create account" mode
        const testUsername = `t${Date.now().toString(36)}`.slice(0, 12);
        await loginUsername.fill(testUsername);
        await page.locator('#input-pin').fill('123456');
        await page.click('#btn-submit');
        await expect(page.locator('#login-error')).not.toBeVisible({ timeout: 10000 });
    }

    await expect(page.locator('#btn-new-game')).toBeVisible({ timeout: 10000 });
    await page.click('#btn-new-game');

    // Starter selection
    await expect(page.locator('.starter-card').first()).toBeVisible();
    const nameInput = page.locator('#trainer-name');
    if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('ASH');
    }
    await page.locator('.starter-card').first().click();
    await expect(page.locator('#btn-start')).toBeEnabled();
    await page.click('#btn-start');

    // Travel screen loaded with a party
    await expect(page.locator('.travel-screen')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#btn-continue')).toBeVisible();

    // First-ever visit shows a spotlight tutorial that intercepts clicks — skip it.
    const tutSkip = page.locator('#tut-skip');
    if (await tutSkip.isVisible({ timeout: 3000 }).catch(() => false)) {
        await tutSkip.click();
    }

    // Advance one day. This may trigger an encounter, a narrative event modal, or a
    // day-recap overlay — handle whichever shows up rather than asserting a specific one.
    await page.click('#btn-continue');

    const fleeButton = page.locator('#btn-flee');
    const recapOk = page.locator('#btn-recap-ok');
    const eventContinue = page.locator('#btn-continue');
    if (await fleeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await fleeButton.click();
    }
    if (await recapOk.isVisible({ timeout: 5000 }).catch(() => false)) {
        await recapOk.click();
    }
    if (await eventContinue.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await eventContinue.first().click();
    }

    // Whatever happened, we should be back on a live screen with no uncaught error state.
    await expect(page.locator('#app')).not.toBeEmpty();
});

import { test, expect } from '@playwright/test';
import { ContentActivationApp } from './pages/helpers';

/**
 * Content Activation Code App — Playwright E2E
 *
 * Tests the React Code App (Fluent UI v9) hosted on Power Platform.
 * Validates navigation, dashboard rendering, and core user flows.
 * Runs headless in CI after solution import.
 */

test.describe('Code App — Navigation', () => {
  let app: ContentActivationApp;

  test.beforeEach(async ({ page }) => {
    app = new ContentActivationApp(page);
  });

  test('app loads without errors', async ({ page }) => {
    await app.navigate();
    // Verify the app shell renders
    await expect(page.locator('body')).not.toBeEmpty();
    // Check no JavaScript errors in console
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForTimeout(2000);
    // Filter out known benign errors (CORS, third-party scripts)
    const criticalErrors = errors.filter(
      (e) => !e.includes('CORS') && !e.includes('favicon')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('can navigate to Dashboard', async ({ page }) => {
    await app.navigate();
    await app.goToDashboard();
    await expect(page).toHaveURL(/dashboard/i);
  });

  test('can navigate to Ideas', async ({ page }) => {
    await app.navigate();
    await app.goToIdeas();
    await expect(page).toHaveURL(/ideas/i);
  });

  test('can navigate to Review', async ({ page }) => {
    await app.navigate();
    await app.goToReview();
    await expect(page).toHaveURL(/review/i);
  });

  test('can navigate to Schedule', async ({ page }) => {
    await app.navigate();
    await app.goToSchedule();
    await expect(page).toHaveURL(/schedule/i);
  });

  test('can navigate to Platforms', async ({ page }) => {
    await app.navigate();
    await app.goToPlatforms();
    await expect(page).toHaveURL(/platforms/i);
  });

  test('can navigate to History', async ({ page }) => {
    await app.navigate();
    await app.goToHistory();
    await expect(page).toHaveURL(/history/i);
  });
});

test.describe('Code App — Dashboard', () => {
  let app: ContentActivationApp;

  test.beforeEach(async ({ page }) => {
    app = new ContentActivationApp(page);
    await app.navigate();
    await app.goToDashboard();
  });

  test('dashboard displays pipeline stats', async ({ page }) => {
    // Verify stat cards are rendered
    const statCards = page.locator('[data-testid="stat-card"]');
    const count = await statCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('dashboard loads without loading spinner stuck', async ({ page }) => {
    // Wait for loading to complete
    const spinner = page.locator('[role="progressbar"]');
    if (await spinner.isVisible()) {
      await expect(spinner).toBeHidden({ timeout: 30000 });
    }
  });
});

test.describe('Code App — Accessibility', () => {
  test('all interactive elements have accessible labels', async ({ page }) => {
    const app = new ContentActivationApp(page);
    await app.navigate();

    // Check buttons have accessible names
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();
    for (let i = 0; i < buttonCount; i++) {
      const name = await buttons.nth(i).getAttribute('aria-label') ||
                   await buttons.nth(i).textContent();
      expect(name, `Button at index ${i} should have an accessible name`).toBeTruthy();
    }
  });

  test('page has proper heading structure', async ({ page }) => {
    const app = new ContentActivationApp(page);
    await app.navigate();

    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
  });
});

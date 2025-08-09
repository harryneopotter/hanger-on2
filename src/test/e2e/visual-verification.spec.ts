import { test, expect } from '@playwright/test';

test.describe('Visual Verification', () => {
  test('should take screenshot of main page', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Take a screenshot
    await page.screenshot({ path: 'visual-verification.png', fullPage: true });

    // Just verify the page loaded successfully
    await expect(page.locator('body')).toBeVisible();
  });
});

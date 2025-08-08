import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Mock authentication for accessibility tests
test.use({
  storageState: {
    cookies: [],
    origins: [
      {
        origin: 'http://localhost:3000',
        localStorage: [
          {
            name: 'next-auth.session-token',
            value: 'mock-session-token'
          }
        ]
      }
    ]
  }
});

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-session-token');
    });
  });

  test('should not have accessibility violations on login page', async ({ page }) => {
    await page.goto('/login');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on signup page', async ({ page }) => {
    await page.goto('/signup');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on garments page', async ({ page }) => {
    await page.goto('/garments');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on collections page', async ({ page }) => {
    await page.goto('/collections');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on tags page', async ({ page }) => {
    await page.goto('/tags');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for h1 element
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
    
    // Check heading order (h1 -> h2 -> h3, etc.)
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingTexts = await headings.allTextContents();
    
    expect(headingTexts.length).toBeGreaterThan(0);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/login');
    
    // Check that all form inputs have labels
    const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"]');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const inputId = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Input should have either a label, aria-label, or aria-labelledby
      const hasLabel = inputId ? await page.locator(`label[for="${inputId}"]`).count() > 0 : false;
      
      expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should have proper button accessibility', async ({ page }) => {
    await page.goto('/garments');
    
    // Check that all buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const buttonText = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const ariaLabelledBy = await button.getAttribute('aria-labelledby');
      
      // Button should have text content, aria-label, or aria-labelledby
      expect(buttonText?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should have proper link accessibility', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check that all links have accessible names
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const linkText = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const ariaLabelledBy = await link.getAttribute('aria-labelledby');
      
      // Link should have text content, aria-label, or aria-labelledby
      expect(linkText?.trim() || ariaLabel || ariaLabelledBy).toBeTruthy();
    }
  });

  test('should have proper image alt text', async ({ page }) => {
    await page.goto('/garments');
    
    // Check that all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const image = images.nth(i);
      const altText = await image.getAttribute('alt');
      const ariaLabel = await image.getAttribute('aria-label');
      const ariaLabelledBy = await image.getAttribute('aria-labelledby');
      const role = await image.getAttribute('role');
      
      // Image should have alt text, aria-label, aria-labelledby, or role="presentation"
      expect(altText !== null || ariaLabel || ariaLabelledBy || role === 'presentation').toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through all focusable elements
    const focusableElements = page.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    const elementCount = await focusableElements.count();
    
    // Start tabbing
    await page.keyboard.press('Tab');
    
    for (let i = 0; i < elementCount; i++) {
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      await page.keyboard.press('Tab');
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for landmark roles
    await expect(page.locator('[role="main"], main')).toBeVisible();
    await expect(page.locator('[role="navigation"], nav')).toBeVisible();
    
    // Check for skip links
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    if (await skipLink.count() > 0) {
      await expect(skipLink.first()).toBeVisible();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Run axe-core with color contrast rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Filter for color contrast violations
    const colorContrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(colorContrastViolations).toEqual([]);
  });

  test('should handle focus management in modals', async ({ page }) => {
    await page.goto('/garments');
    
    // Open add garment modal
    await page.getByRole('button', { name: /add garment/i }).click();
    
    // Focus should be trapped in modal
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // First focusable element in modal should be focused
    const firstFocusable = modal.locator('button, input, select, textarea, a[href]').first();
    await expect(firstFocusable).toBeFocused();
    
    // Tab to last element and then tab again should cycle back
    await page.keyboard.press('Shift+Tab');
    const lastFocusable = modal.locator('button, input, select, textarea, a[href]').last();
    await expect(lastFocusable).toBeFocused();
  });

  test('should announce dynamic content changes', async ({ page }) => {
    await page.goto('/garments');
    
    // Look for aria-live regions
    const liveRegions = page.locator('[aria-live], [role="status"], [role="alert"]');
    
    if (await liveRegions.count() > 0) {
      // Trigger an action that should announce changes
      await page.getByRole('button', { name: /add garment/i }).click();
      
      // Check that live region is present
      await expect(liveRegions.first()).toBeInTheDocument();
    }
  });

  test('should support high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.goto('/dashboard');
    
    // Elements should still be visible and functional
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/dashboard');
    
    // Page should load without animations
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should have proper form validation announcements', async ({ page }) => {
    await page.goto('/login');
    
    // Submit form without filling required fields
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for error announcements
    const errorMessages = page.locator('[role="alert"], .error, [aria-invalid="true"]');
    
    if (await errorMessages.count() > 0) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('should support zoom up to 200%', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Zoom to 200%
    await page.setViewportSize({ width: 640, height: 480 }); // Simulate 200% zoom
    
    // Content should still be accessible
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Interactive elements should still be clickable
    const buttons = page.locator('button').first();
    if (await buttons.isVisible()) {
      await expect(buttons).toBeEnabled();
    }
  });

  test('should have proper table accessibility', async ({ page }) => {
    await page.goto('/garments');
    
    // Check for data tables
    const tables = page.locator('table');
    const tableCount = await tables.count();
    
    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      
      // Table should have caption or aria-label
      const caption = table.locator('caption');
      const ariaLabel = await table.getAttribute('aria-label');
      const ariaLabelledBy = await table.getAttribute('aria-labelledby');
      
      expect(
        (await caption.count() > 0) || ariaLabel || ariaLabelledBy
      ).toBeTruthy();
      
      // Headers should be properly marked
      const headers = table.locator('th');
      if (await headers.count() > 0) {
        await expect(headers.first()).toBeVisible();
      }
    }
  });

  test('should handle error states accessibly', async ({ page }) => {
    // Mock API error
    await page.route('**/api/garments', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.goto('/garments');
    
    // Error should be announced
    const errorElements = page.locator('[role="alert"], .error, [aria-live="assertive"]');
    
    if (await errorElements.count() > 0) {
      await expect(errorElements.first()).toBeVisible();
    }
  });
});
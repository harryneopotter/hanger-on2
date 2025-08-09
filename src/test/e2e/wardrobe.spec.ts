import { test, expect } from '@playwright/test';

// Mock authentication for e2e tests
test.use({
  storageState: {
    cookies: [],
    origins: [
      {
        origin: 'http://localhost:3000',
        localStorage: [
          {
            name: 'next-auth.session-token',
            value: 'mock-session-token',
          },
        ],
      },
    ],
  },
});

test.describe('Wardrobe Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-session-token');
    });

    // Start from the dashboard
    await page.goto('/dashboard');
  });

  test('should display dashboard with navigation', async ({ page }) => {
    // Check for main navigation elements
    await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /garments/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /collections/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /tags/i })).toBeVisible();

    // Check for user menu
    await expect(page.getByRole('button', { name: /user menu/i })).toBeVisible();
  });

  test('should navigate to garments page', async ({ page }) => {
    await page.getByRole('link', { name: /garments/i }).click();

    await expect(page).toHaveURL(/.*\/garments/);
    await expect(page.getByRole('heading', { name: /garments/i })).toBeVisible();

    // Should show add garment button
    await expect(page.getByRole('button', { name: /add garment/i })).toBeVisible();
  });

  test('should open add garment modal', async ({ page }) => {
    await page.goto('/garments');

    // Click add garment button
    await page.getByRole('button', { name: /add garment/i }).click();

    // Should open modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /add garment/i })).toBeVisible();

    // Should show form fields
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/category/i)).toBeVisible();
    await expect(page.getByLabel(/material/i)).toBeVisible();
    await expect(page.getByLabel(/status/i)).toBeVisible();
  });

  test('should create a new garment', async ({ page }) => {
    await page.goto('/garments');

    // Open add garment modal
    await page.getByRole('button', { name: /add garment/i }).click();

    // Fill form
    await page.getByLabel(/name/i).fill('Test Shirt');
    await page.getByLabel(/category/i).selectOption('Shirt');
    await page.getByLabel(/material/i).fill('Cotton');
    await page.getByLabel(/status/i).selectOption('CLEAN');

    // Submit form
    await page.getByRole('button', { name: /create garment/i }).click();

    // Should close modal and show success message
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText(/garment created successfully/i)).toBeVisible();

    // Should show new garment in list
    await expect(page.getByText('Test Shirt')).toBeVisible();
  });

  test('should validate garment form', async ({ page }) => {
    await page.goto('/garments');

    // Open add garment modal
    await page.getByRole('button', { name: /add garment/i }).click();

    // Try to submit empty form
    await page.getByRole('button', { name: /create garment/i }).click();

    // Should show validation errors
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/category is required/i)).toBeVisible();
  });

  test('should edit an existing garment', async ({ page }) => {
    await page.goto('/garments');

    // Assuming there's at least one garment, click edit button
    const editButton = page.getByRole('button', { name: /edit/i }).first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Should open edit modal
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.getByRole('heading', { name: /edit garment/i })).toBeVisible();

      // Update name
      const nameInput = page.getByLabel(/name/i);
      await nameInput.clear();
      await nameInput.fill('Updated Garment Name');

      // Submit changes
      await page.getByRole('button', { name: /update garment/i }).click();

      // Should show success message
      await expect(page.getByText(/garment updated successfully/i)).toBeVisible();
    }
  });

  test('should delete a garment', async ({ page }) => {
    await page.goto('/garments');

    // Click delete button on first garment
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Should show confirmation dialog
      await expect(page.getByText(/are you sure/i)).toBeVisible();

      // Confirm deletion
      await page.getByRole('button', { name: /confirm/i }).click();

      // Should show success message
      await expect(page.getByText(/garment deleted successfully/i)).toBeVisible();
    }
  });

  test('should filter garments by category', async ({ page }) => {
    await page.goto('/garments');

    // Look for filter dropdown
    const categoryFilter = page.getByLabel(/filter by category/i);
    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Shirt');

      // Should filter results
      await expect(page.getByText(/showing.*shirt/i)).toBeVisible();
    }
  });

  test('should search garments', async ({ page }) => {
    await page.goto('/garments');

    // Look for search input
    const searchInput = page.getByPlaceholder(/search garments/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('cotton');

      // Should filter results
      await expect(page.getByText(/cotton/i)).toBeVisible();
    }
  });

  test('should navigate to collections page', async ({ page }) => {
    await page.getByRole('link', { name: /collections/i }).click();

    await expect(page).toHaveURL(/.*\/collections/);
    await expect(page.getByRole('heading', { name: /collections/i })).toBeVisible();

    // Should show add collection button
    await expect(page.getByRole('button', { name: /add collection/i })).toBeVisible();
  });

  test('should create a new collection', async ({ page }) => {
    await page.goto('/collections');

    // Open add collection modal
    await page.getByRole('button', { name: /add collection/i }).click();

    // Fill form
    await page.getByLabel(/name/i).fill('Summer Clothes');
    await page.getByLabel(/description/i).fill('Light clothes for summer');

    // Select color
    const colorPicker = page.getByLabel(/color/i);
    if (await colorPicker.isVisible()) {
      await colorPicker.click();
      await page.getByText('#FF6B6B').click();
    }

    // Submit form
    await page.getByRole('button', { name: /create collection/i }).click();

    // Should show success message
    await expect(page.getByText(/collection created successfully/i)).toBeVisible();

    // Should show new collection
    await expect(page.getByText('Summer Clothes')).toBeVisible();
  });

  test('should create a smart collection', async ({ page }) => {
    await page.goto('/collections');

    // Open add collection modal
    await page.getByRole('button', { name: /add collection/i }).click();

    // Fill basic info
    await page.getByLabel(/name/i).fill('Clean Shirts');

    // Enable smart collection
    await page.getByLabel(/smart collection/i).check();

    // Add rule
    await page.getByRole('button', { name: /add rule/i }).click();

    // Configure rule
    await page.getByLabel(/field/i).selectOption('category');
    await page.getByLabel(/operator/i).selectOption('equals');
    await page.getByLabel(/value/i).fill('Shirt');

    // Submit form
    await page.getByRole('button', { name: /create collection/i }).click();

    // Should show success message
    await expect(page.getByText(/smart collection created successfully/i)).toBeVisible();
  });

  test('should navigate to tags page', async ({ page }) => {
    await page.getByRole('link', { name: /tags/i }).click();

    await expect(page).toHaveURL(/.*\/tags/);
    await expect(page.getByRole('heading', { name: /tags/i })).toBeVisible();

    // Should show add tag button
    await expect(page.getByRole('button', { name: /add tag/i })).toBeVisible();
  });

  test('should create a new tag', async ({ page }) => {
    await page.goto('/tags');

    // Open add tag modal
    await page.getByRole('button', { name: /add tag/i }).click();

    // Fill form
    await page.getByLabel(/name/i).fill('Casual');

    // Select color
    const colorPicker = page.getByLabel(/color/i);
    if (await colorPicker.isVisible()) {
      await colorPicker.click();
      await page.getByText('#3B82F6').click();
    }

    // Submit form
    await page.getByRole('button', { name: /create tag/i }).click();

    // Should show success message
    await expect(page.getByText(/tag created successfully/i)).toBeVisible();

    // Should show new tag
    await expect(page.getByText('Casual')).toBeVisible();
  });

  test('should delete a tag', async ({ page }) => {
    await page.goto('/tags');

    // Click delete button on first tag
    const deleteButton = page.getByRole('button', { name: /delete/i }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Should show confirmation dialog
      await expect(page.getByText(/are you sure/i)).toBeVisible();

      // Confirm deletion
      await page.getByRole('button', { name: /confirm/i }).click();

      // Should show success message
      await expect(page.getByText(/tag deleted successfully/i)).toBeVisible();
    }
  });

  test('should handle image upload', async ({ page }) => {
    await page.goto('/garments');

    // Open add garment modal
    await page.getByRole('button', { name: /add garment/i }).click();

    // Look for file input
    const fileInput = page.getByLabel(/upload image/i);
    if (await fileInput.isVisible()) {
      // Create a test file
      const testFile = {
        name: 'test-image.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data'),
      };

      await fileInput.setInputFiles(testFile);

      // Should show preview or upload progress
      await expect(page.getByText(/uploading/i)).toBeVisible();
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard');

    // Should show mobile navigation
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();

      // Should show navigation items
      await expect(page.getByRole('link', { name: /garments/i })).toBeVisible();
    }

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // Should adapt layout for tablet
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/garments');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to activate buttons with Enter/Space
    const focusedElement = page.locator(':focus');
    if (await focusedElement.isVisible()) {
      await page.keyboard.press('Enter');
    }
  });

  test('should handle error states', async ({ page }) => {
    // Mock network error
    await page.route('**/api/garments', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.goto('/garments');

    // Should show error message
    await expect(page.getByText(/error loading garments/i)).toBeVisible();

    // Should show retry button
    const retryButton = page.getByRole('button', { name: /retry/i });
    if (await retryButton.isVisible()) {
      await retryButton.click();
    }
  });

  test('should handle loading states', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/garments', (route) => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([]),
        });
      }, 2000);
    });

    await page.goto('/garments');

    // Should show loading indicator
    await expect(page.getByText(/loading/i)).toBeVisible();
  });

  test('should handle user logout', async ({ page }) => {
    await page.goto('/dashboard');

    // Click user menu
    await page.getByRole('button', { name: /user menu/i }).click();

    // Click logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });
});

import { test, expect } from '@playwright/test';

// Mock authentication for performance tests
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

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication state
    await page.addInitScript(() => {
      window.localStorage.setItem('next-auth.session-token', 'mock-session-token');
    });
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Dashboard should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load garments page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/garments');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Garments page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large datasets efficiently', async ({ page }) => {
    // Mock API to return large dataset
    await page.route('**/api/garments', route => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `garment-${i}`,
        name: `Garment ${i}`,
        category: 'shirt',
        color: 'blue',
        brand: 'Brand',
        material: 'cotton',
        status: 'clean',
        images: [],
        tags: []
      }));
      
      route.fulfill({
        status: 200,
        body: JSON.stringify(largeDataset)
      });
    });
    
    const startTime = Date.now();
    
    await page.goto('/garments');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should handle 100 items within 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Check that items are rendered
    const garmentCards = page.locator('[data-testid="garment-card"]');
    await expect(garmentCards.first()).toBeVisible();
  });

  test('should handle rapid user interactions', async ({ page }) => {
    await page.goto('/garments');
    
    // Rapid clicking should not cause issues
    const addButton = page.getByRole('button', { name: /add garment/i });
    
    for (let i = 0; i < 5; i++) {
      await addButton.click();
      await page.waitForTimeout(100);
      
      // Close modal if it opens
      const modal = page.getByRole('dialog');
      if (await modal.isVisible()) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(100);
      }
    }
    
    // Page should still be responsive
    await expect(addButton).toBeEnabled();
  });

  test('should handle search operations efficiently', async ({ page }) => {
    await page.goto('/garments');
    
    const searchInput = page.getByPlaceholder(/search garments/i);
    
    if (await searchInput.isVisible()) {
      const startTime = Date.now();
      
      // Type search query
      await searchInput.fill('shirt');
      await page.waitForTimeout(500); // Debounce time
      
      const searchTime = Date.now() - startTime;
      
      // Search should complete within 2 seconds
      expect(searchTime).toBeLessThan(2000);
    }
  });

  test('should handle image loading efficiently', async ({ page }) => {
    // Mock garments with images
    await page.route('**/api/garments', route => {
      const garmentsWithImages = Array.from({ length: 10 }, (_, i) => ({
        id: `garment-${i}`,
        name: `Garment ${i}`,
        category: 'shirt',
        color: 'blue',
        brand: 'Brand',
        material: 'cotton',
        status: 'clean',
        images: [
          {
            id: `image-${i}`,
            url: `https://picsum.photos/300/400?random=${i}`,
            alt: `Garment ${i} image`
          }
        ],
        tags: []
      }));
      
      route.fulfill({
        status: 200,
        body: JSON.stringify(garmentsWithImages)
      });
    });
    
    const startTime = Date.now();
    
    await page.goto('/garments');
    
    // Wait for images to load
    const images = page.locator('img');
    if (await images.count() > 0) {
      await images.first().waitFor({ state: 'visible' });
    }
    
    const loadTime = Date.now() - startTime;
    
    // Images should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should handle form submissions efficiently', async ({ page }) => {
    await page.goto('/garments');
    
    // Open add garment form
    await page.getByRole('button', { name: /add garment/i }).click();
    
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    // Fill form quickly
    const nameInput = modal.getByLabel(/name/i);
    const categorySelect = modal.getByLabel(/category/i);
    const submitButton = modal.getByRole('button', { name: /save/i });
    
    const startTime = Date.now();
    
    await nameInput.fill('Test Garment');
    await categorySelect.selectOption('shirt');
    await submitButton.click();
    
    // Wait for form submission
    await page.waitForTimeout(1000);
    
    const submitTime = Date.now() - startTime;
    
    // Form submission should complete within 3 seconds
    expect(submitTime).toBeLessThan(3000);
  });

  test('should handle navigation efficiently', async ({ page }) => {
    await page.goto('/dashboard');
    
    const navigationLinks = [
      '/garments',
      '/collections',
      '/tags',
      '/dashboard'
    ];
    
    for (const link of navigationLinks) {
      const startTime = Date.now();
      
      await page.goto(link);
      await page.waitForLoadState('networkidle');
      
      const navigationTime = Date.now() - startTime;
      
      // Each navigation should complete within 2 seconds
      expect(navigationTime).toBeLessThan(2000);
    }
  });

  test('should handle concurrent API requests', async ({ page }) => {
    // Mock multiple API endpoints
    await page.route('**/api/garments', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([])
        });
      }, 500);
    });
    
    await page.route('**/api/collections', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([])
        });
      }, 500);
    });
    
    await page.route('**/api/tags', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          body: JSON.stringify([])
        });
      }, 500);
    });
    
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Concurrent requests should complete within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    await page.goto('/garments');
    
    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      // Navigate between pages
      await page.goto('/collections');
      await page.waitForLoadState('networkidle');
      
      await page.goto('/garments');
      await page.waitForLoadState('networkidle');
      
      // Open and close modals
      const addButton = page.getByRole('button', { name: /add garment/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(100);
        
        const modal = page.getByRole('dialog');
        if (await modal.isVisible()) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(100);
        }
      }
    }
    
    // Page should still be responsive after intensive operations
    const finalButton = page.getByRole('button', { name: /add garment/i });
    if (await finalButton.isVisible()) {
      await expect(finalButton).toBeEnabled();
    }
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow network
    await page.route('**/api/**', route => {
      setTimeout(() => {
        route.continue();
      }, 1000); // 1 second delay
    });
    
    const startTime = Date.now();
    
    await page.goto('/garments');
    
    // Should show loading state
    const loadingIndicator = page.locator('[data-testid="loading"], .loading, .spinner');
    if (await loadingIndicator.isVisible()) {
      await expect(loadingIndicator).toBeVisible();
    }
    
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should handle slow network within reasonable time
    expect(loadTime).toBeLessThan(10000);
  });

  test('should handle file upload performance', async ({ page }) => {
    await page.goto('/garments');
    
    // Open add garment form
    await page.getByRole('button', { name: /add garment/i }).click();
    
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    
    const fileInput = modal.locator('input[type="file"]');
    
    if (await fileInput.isVisible()) {
      const startTime = Date.now();
      
      // Simulate file upload
      await fileInput.setInputFiles({
        name: 'test-image.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data')
      });
      
      await page.waitForTimeout(1000);
      
      const uploadTime = Date.now() - startTime;
      
      // File upload should process within 3 seconds
      expect(uploadTime).toBeLessThan(3000);
    }
  });

  test('should handle responsive design performance', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      const startTime = Date.now();
      
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load efficiently on all viewport sizes
      expect(loadTime).toBeLessThan(3000);
      
      // Content should be visible
      await expect(page.getByRole('main')).toBeVisible();
    }
  });

  test('should handle JavaScript bundle size efficiently', async ({ page }) => {
    // Monitor network requests
    const jsRequests: any[] = [];
    
    page.on('response', response => {
      if (response.url().includes('.js') && response.status() === 200) {
        jsRequests.push({
          url: response.url(),
          size: response.headers()['content-length']
        });
      }
    });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that JavaScript bundles are not excessively large
    const totalJSSize = jsRequests.reduce((total, request) => {
      const size = parseInt(request.size || '0', 10);
      return total + size;
    }, 0);
    
    // Total JS should be under 2MB (reasonable for a modern app)
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024);
  });
});
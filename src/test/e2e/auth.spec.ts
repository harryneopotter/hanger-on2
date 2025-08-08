import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Should show login form
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
  });

  test('should show login form elements', async ({ page }) => {
    await page.goto('/login');
    
    // Check for email input
    await expect(page.getByLabel(/email/i)).toBeVisible();
    
    // Check for password input
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Check for sign in button
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    
    // Check for Google sign in button
    await expect(page.getByRole('button', { name: /sign in with google/i })).toBeVisible();
    
    // Check for sign up link
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login');
    
    // Click sign up link
    await page.getByRole('link', { name: /sign up/i }).click();
    
    // Should navigate to signup page
    await expect(page).toHaveURL(/.*\/signup/);
    
    // Should show signup form
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
  });

  test('should show signup form elements', async ({ page }) => {
    await page.goto('/signup');
    
    // Check for name input
    await expect(page.getByLabel(/name/i)).toBeVisible();
    
    // Check for email input
    await expect(page.getByLabel(/email/i)).toBeVisible();
    
    // Check for password input
    await expect(page.getByLabel(/password/i)).toBeVisible();
    
    // Check for confirm password input
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    
    // Check for sign up button
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    
    // Check for sign in link
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('should validate required fields on login', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without filling fields
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show validation messages
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should validate email format on login', async ({ page }) => {
    await page.goto('/login');
    
    // Enter invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show email validation message
    await expect(page.getByText(/invalid email format/i)).toBeVisible();
  });

  test('should validate required fields on signup', async ({ page }) => {
    await page.goto('/signup');
    
    // Try to submit without filling fields
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show validation messages
    await expect(page.getByText(/name is required/i)).toBeVisible();
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should validate password confirmation on signup', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill form with mismatched passwords
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('different-password');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show password mismatch message
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should handle login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should handle signup with existing email', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill form with existing email
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('existing@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show error message
    await expect(page.getByText(/email already exists/i)).toBeVisible();
  });

  test('should show loading state during authentication', async ({ page }) => {
    await page.goto('/login');
    
    // Fill valid credentials
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Click sign in and check for loading state
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show loading indicator
    await expect(page.getByText(/signing in/i)).toBeVisible();
  });

  test('should handle Google OAuth flow', async ({ page }) => {
    await page.goto('/login');
    
    // Click Google sign in button
    await page.getByRole('button', { name: /sign in with google/i }).click();
    
    // Should redirect to Google OAuth (or show mock OAuth flow)
    // Note: In a real test, you might mock the OAuth flow
    await expect(page).toHaveURL(/.*google.*|.*oauth.*/);
  });

  test('should remember user preference for login method', async ({ page }) => {
    await page.goto('/login');
    
    // Check if there's a "Remember me" checkbox
    const rememberCheckbox = page.getByLabel(/remember me/i);
    if (await rememberCheckbox.isVisible()) {
      await rememberCheckbox.check();
      await expect(rememberCheckbox).toBeChecked();
    }
  });

  test('should handle password visibility toggle', async ({ page }) => {
    await page.goto('/login');
    
    const passwordInput = page.getByLabel(/password/i);
    const toggleButton = page.getByRole('button', { name: /show password/i });
    
    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to show password
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to hide password
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/password/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused();
  });

  test('should handle form submission with Enter key', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('password123');
    
    // Press Enter to submit
    await page.getByLabel(/password/i).press('Enter');
    
    // Should attempt to sign in
    await expect(page.getByText(/signing in/i)).toBeVisible();
  });
});
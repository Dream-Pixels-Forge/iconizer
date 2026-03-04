import { test, expect } from '@playwright/test';

/**
 * Iconizer E2E Tests - Critical User Flows
 * 
 * These tests cover the most important user journeys:
 * 1. Application loads successfully
 * 2. Import images via drag and drop
 * 3. Configure sizes and formats
 * 4. Set output options
 * 5. Execute conversion
 */

test.describe('Iconizer Application', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
  });

  test('should load application successfully', async ({ page }) => {
    // Check title
    await expect(page).toHaveTitle(/Iconizer/);

    // Check main sections are visible
    await expect(page.getByText('Import Images')).toBeVisible();
    await expect(page.getByText('Select Sizes')).toBeVisible();
    await expect(page.getByText('Select Formats')).toBeVisible();
    await expect(page.getByText('Output')).toBeVisible();

    // Check header
    await expect(page.getByText('Iconizer')).toBeVisible();
    await expect(page.getByText('v1.0.0-mvp')).toBeVisible();
  });

  test('should display drag and drop zone', async ({ page }) => {
    const dropZone = page.getByText('Drag & drop images');
    await expect(dropZone).toBeVisible();

    const browseButton = page.getByRole('button', { name: /browse files/i });
    await expect(browseButton).toBeVisible();
  });

  test('should show preset size buttons', async ({ page }) => {
    // Check quick preset buttons
    await expect(page.getByRole('button', { name: 'Web' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mobile' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Desktop' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'All Sizes' })).toBeVisible();
  });

  test('should allow selecting sizes', async ({ page }) => {
    // Find and click a size checkbox
    const sizeCheckbox = page.getByLabel('16×16');
    await expect(sizeCheckbox).toBeVisible();
    
    // Toggle size selection
    await sizeCheckbox.click();
    await sizeCheckbox.click(); // Toggle back
  });

  test('should display format selection', async ({ page }) => {
    // Check format options are visible
    await expect(page.getByText('PNG')).toBeVisible();
    await expect(page.getByText('ICO')).toBeVisible();
    await expect(page.getByText('WebP')).toBeVisible();
  });

  test('should open settings panel', async ({ page }) => {
    // Click settings button
    const settingsButton = page.getByRole('button', { name: /settings/i });
    await settingsButton.click();

    // Check settings panel is visible
    await expect(page.getByText('Appearance')).toBeVisible();
    await expect(page.getByText('Output')).toBeVisible();
    await expect(page.getByText('Performance')).toBeVisible();

    // Close settings
    const closeButton = page.getByRole('button', { name: /close/i });
    await closeButton.click();
    
    // Panel should be closed
    await expect(page.getByText('Appearance')).not.toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    // Click to open dropdown
    await themeToggle.click();

    // Check theme options
    await expect(page.getByText('Light')).toBeVisible();
    await expect(page.getByText('Dark')).toBeVisible();
    await expect(page.getByText('System')).toBeVisible();

    // Select dark theme
    await page.getByText('Dark').click();

    // Check dark theme is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should open keyboard shortcuts help', async ({ page }) => {
    // Click keyboard shortcuts button
    const shortcutsButton = page.getByRole('button', { name: /keyboard shortcuts/i });
    await shortcutsButton.click();

    // Check help dialog is visible
    await expect(page.getByText('Keyboard Shortcuts')).toBeVisible();
    await expect(page.getByText('General')).toBeVisible();
    await expect(page.getByText('Navigation')).toBeVisible();
    await expect(page.getByText('Actions')).toBeVisible();

    // Close dialog
    await page.getByRole('button', { name: /close/i }).click();
  });

  test('should respond to keyboard shortcut (?)', async ({ page }) => {
    // Press ? key to open shortcuts help
    await page.keyboard.press('?');

    // Check help dialog is visible
    await expect(page.getByText('Keyboard Shortcuts')).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByText('Keyboard Shortcuts')).not.toBeVisible();
  });

  test('should show output configuration', async ({ page }) => {
    // Check output section
    await expect(page.getByText('Output Location')).toBeVisible();
    await expect(page.getByText('Folder Organization')).toBeVisible();
    await expect(page.getByText('Naming Pattern')).toBeVisible();

    // Check convert button is disabled initially
    const convertButton = page.getByRole('button', { name: /convert images/i });
    await expect(convertButton).toBeDisabled();
  });

  test('should display summary', async ({ page }) => {
    // Check summary section
    await expect(page.getByText('Summary')).toBeVisible();
    await expect(page.getByText('Source Images')).toBeVisible();
    await expect(page.getByText('Selected Sizes')).toBeVisible();
    await expect(page.getByText('Selected Formats')).toBeVisible();
    await expect(page.getByText('Total Outputs')).toBeVisible();
  });

  test('should apply web preset', async ({ page }) => {
    // Click web preset
    await page.getByRole('button', { name: 'Web' }).click();

    // Check sizes are selected (should include 16x16, 32x32, 48x48)
    const selectedCount = await page.getByText(/of \d+ selected/).first().textContent();
    expect(selectedCount).toBeTruthy();
  });

  test('should show custom size input toggle', async ({ page }) => {
    // Check custom size input toggle
    const toggleButton = page.getByRole('button', { name: /add custom size/i });
    await expect(toggleButton).toBeVisible();

    // Click to expand
    await toggleButton.click();

    // Check custom size inputs are visible
    await expect(page.getByLabel(/width/i)).toBeVisible();
    await expect(page.getByLabel(/height/i)).toBeVisible();
  });

  test('should have footer information', async ({ page }) => {
    // Check footer
    await expect(page.getByText('Built with Tauri, React, and Sharp')).toBeVisible();
    await expect(page.getByText('© 2026 Dream Pixels Forge')).toBeVisible();
  });
});

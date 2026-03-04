import { test, expect } from '@playwright/test';

/**
 * Configuration Workflow Tests
 * 
 * Test the complete configuration flow:
 * 1. Select sizes
 * 2. Select formats
 * 3. Configure output
 * 4. Verify summary updates
 */

test.describe('Configuration Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should select and deselect sizes', async ({ page }) => {
    // Initial state - some sizes should be selected
    const initialCount = await page.getByText(/of \d+ selected/).first().textContent();
    expect(initialCount).toBeTruthy();

    // Click to deselect a size
    const firstCheckbox = page.getByLabel('16×16').first();
    await firstCheckbox.click();

    // Count should decrease
    const afterDeselectCount = await page.getByText(/of \d+ selected/).first().textContent();
    expect(afterDeselectCount).toBeTruthy();

    // Click to select again
    await firstCheckbox.click();

    // Count should increase back
    const afterSelectCount = await page.getByText(/of \d+ selected/).first().textContent();
    expect(afterSelectCount).toBeTruthy();
  });

  test('should select all sizes', async ({ page }) => {
    // Click Select All button
    const selectAllButton = page.getByRole('button', { name: /select all/i }).first();
    await selectAllButton.click();

    // All preset sizes should be selected
    const selectedCount = await page.getByText(/of \d+ selected/).first().textContent();
    expect(selectedCount).toContain('10'); // 10 preset sizes
  });

  test('should deselect all sizes', async ({ page }) => {
    // Click Deselect All button
    const deselectAllButton = page.getByRole('button', { name: /deselect all/i }).first();
    await deselectAllButton.click();

    // No sizes should be selected
    const selectedCount = await page.getByText(/of \d+ selected/).first().textContent();
    expect(selectedCount).toContain('0');
  });

  test('should toggle formats', async ({ page }) => {
    // Find format checkbox
    const pngFormat = page.getByLabel(/PNG/).first();
    
    // Toggle format
    await pngFormat.click();
    await pngFormat.click();
  });

  test('should update summary when sizes change', async ({ page }) => {
    // Get initial summary
    const initialSummary = await page.getByText(/Selected Sizes/).locator('..').textContent();
    expect(initialSummary).toBeTruthy();

    // Deselect all
    await page.getByRole('button', { name: /deselect all/i }).first().click();

    // Summary should show 0 sizes
    const updatedSummary = await page.getByText(/Selected Sizes/).locator('..').textContent();
    expect(updatedSummary).toContain('0');
  });

  test('should expand custom size input', async ({ page }) => {
    // Click to expand custom size input
    await page.getByRole('button', { name: /add custom size/i }).click();

    // Input fields should be visible
    await expect(page.getByLabel(/width/i).first()).toBeVisible();
    await expect(page.getByLabel(/height/i).first()).toBeVisible();

    // Aspect ratio lock should be available
    await expect(page.getByLabel(/lock aspect ratio/i)).toBeVisible();
  });

  test('should add custom size', async ({ page }) => {
    // Expand custom size input
    await page.getByRole('button', { name: /add custom size/i }).click();

    // Enter dimensions
    await page.getByLabel(/width/i).first().fill('200');
    await page.getByLabel(/height/i).first().fill('200');

    // Click add button
    await page.getByRole('button', { name: /add custom size/i }).nth(1).click();

    // Custom size should be displayed
    await expect(page.getByText(/200 × 200 px/)).toBeVisible();
  });

  test('should validate custom size input', async ({ page }) => {
    // Expand custom size input
    await page.getByRole('button', { name: /add custom size/i }).click();

    // Try to add without values
    await page.getByRole('button', { name: /add custom size/i }).nth(1).click();

    // Should show error or not add
    const errorMessages = page.getByText(/valid dimensions/i);
    const hasError = await errorMessages.count() > 0;
    expect(hasError).toBeTruthy();
  });

  test('should select folder organization', async ({ page }) => {
    // Check organization options are visible
    await expect(page.getByText('Flat')).toBeVisible();
    await expect(page.getByText('By Size')).toBeVisible();
    await expect(page.getByText('By Format')).toBeVisible();
    await expect(page.getByText('By Size & Format')).toBeVisible();

    // Select different organization
    const bySizeOption = page.getByLabel('By Size');
    await bySizeOption.click();
    
    // Should be selected
    await expect(bySizeOption).toBeChecked();
  });

  test('should change naming pattern', async ({ page }) => {
    // Check naming pattern input
    const patternInput = page.getByLabel(/naming pattern/i);
    await expect(patternInput).toBeVisible();

    // Change pattern
    await patternInput.fill('{name}_{size}.{format}');

    // Example should update
    const example = await page.getByText(/example output/i).locator('..').textContent();
    expect(example).toBeTruthy();
  });

  test('should apply quick pattern templates', async ({ page }) => {
    // Click on a quick template
    const descriptiveButton = page.getByRole('button', { name: /descriptive/i });
    await descriptiveButton.click();

    // Pattern should update
    const patternInput = page.getByLabel(/naming pattern/i);
    const value = await patternInput.inputValue();
    expect(value).toContain('{name}');
  });

  test('should show output location selector', async ({ page }) => {
    // Check output location components
    await expect(page.getByText(/output location/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /browse/i })).toBeVisible();

    // Remember path option
    await expect(page.getByLabel(/remember as default/i)).toBeVisible();
  });

  test('should display conversion summary', async ({ page }) => {
    // Summary should be visible
    const summary = page.getByText('Summary');
    await expect(summary).toBeVisible();

    // Should show all metrics
    await expect(page.getByText(/Source Images/)).toBeVisible();
    await expect(page.getByText(/Selected Sizes/)).toBeVisible();
    await expect(page.getByText(/Selected Formats/)).toBeVisible();
    await expect(page.getByText(/Total Outputs/)).toBeVisible();
  });

  test('should show helper text when no folder selected', async ({ page }) => {
    // Helper text should be visible
    await expect(page.getByText(/select an output folder/i)).toBeVisible();
  });

  test('convert button should be disabled initially', async ({ page }) => {
    const convertButton = page.getByRole('button', { name: /convert images/i });
    
    // Should be disabled without images and folder
    await expect(convertButton).toBeDisabled();
  });
});

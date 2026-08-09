import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page has no detectable WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('skip link is focusable and targets main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.locator('.skip-link');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toHaveAttribute('href', '#main-content');
});

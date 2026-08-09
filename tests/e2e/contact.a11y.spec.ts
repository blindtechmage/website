import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('contact page has no detectable WCAG 2.2 AA violations', async ({ page }) => {
  await page.goto('/contact');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});

test('submit button remains enabled with an empty form', async ({ page }) => {
  await page.goto('/contact');
  const submit = page.getByRole('button', { name: 'Send message' });
  await expect(submit).toBeEnabled();
});

test('submitting an empty form shows inline errors and focuses the first invalid field', async ({
  page,
}) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message' }).click();

  await expect(page.locator('#name-error')).toHaveText('Please enter your name.');
  await expect(page.locator('#name')).toBeFocused();
});

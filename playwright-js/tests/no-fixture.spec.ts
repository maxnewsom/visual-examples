import { test, expect } from '@playwright/test';
import { sauceVisualCheck } from '@saucelabs/visual-playwright';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);
})

test('loads the login page', async ({ page }, testInfo) => {
    await sauceVisualCheck(page, testInfo, "Before Login");
});

test('should be able to login with standard user', async ({ page }, testInfo) => {
    await page.getByTestId('username').fill(process.env.VISUAL_CHECK ? 'visual_user' : 'standard_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    await page.waitForURL('**\/inventory.html', { waitUntil: 'networkidle' });

    await sauceVisualCheck(page, testInfo, "Inventory Page with ignored elements", {
        captureDom: true,
        diffingOptions: {
            content: false,
            dimensions: true,
            position: true,
            structure: true,
            style: true,
            visual: true,
        },
        ignoreRegions: [
            //'.header_container', // Example: Ignores the entire header
            '.shopping_cart_container',
            '[data-test="inventory-item-price"]',
        ]
    });
    await sauceVisualCheck(page, testInfo, "clipped element", {
        captureDom: true,
        clipSelector: '[data-test="add-to-cart-sauce-labs-backpack"]',
    });
});

test('should not be able to login with a locked user', async ({ page }, testInfo) => {
    await page.getByTestId('username').fill('locked_out_user');
    await page.getByTestId('password').fill('secret_sauce');
    await page.getByTestId('login-button').click();

    expect(page.url()).toMatch(/.*\/$/);
    await expect(page.getByTestId('error')).toContainText('Sorry, this user has been locked out.');

    await sauceVisualCheck(page, testInfo, "Locked User Error Message", {
        screenshotOptions: {
            fullPage: false,
        }
    });
});

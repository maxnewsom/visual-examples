import { FullConfig } from '@playwright/test';
import { sauceVisualSetup } from "@saucelabs/visual-playwright";


export default async function globalSetup(config: FullConfig){
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Credentials check:');
        console.log('  SAUCE_USERNAME is ' + (process.env.SAUCE_USERNAME ? 'set' : 'NOT set'));
        console.log('  SAUCE_ACCESS_KEY is ' + (process.env.SAUCE_ACCESS_KEY ? 'set' : 'NOT set'));
    }
    await sauceVisualSetup();
}

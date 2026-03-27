const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const fileUrl = 'file:///G:/Mon%20Drive/Appli_poker_equite/poker_equite_calculateur/poker_analyser/index.html';
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    await page.waitForSelector('#heroMatrix .range-cell');

    // Find KK
    const kkCell = await page.$('[data-hand="KK"]');
    if (!kkCell) {
        console.log('KK cell not found.');
        await browser.close();
        return;
    }

    await kkCell.click();

    let classesAfterClick = await page.evaluate(el => el.className, kkCell);
    console.log('Classes after click KK:', classesAfterClick);

    // Click Clear button
    const clearBtn = await page.$('.clear-btn');
    if (clearBtn) {
        await clearBtn.click();
    }

    await new Promise(r => setTimeout(r, 200));

    let classesAfterClear = await page.evaluate(el => el.className, kkCell);
    console.log('Classes after clear KK:', classesAfterClear);

    await browser.close();
})();

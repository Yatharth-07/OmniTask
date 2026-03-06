import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    page.on('requestfailed', request =>
        console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
    );

    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    // Get the contents of the body
    const bodyHTML = await page.evaluate(() => document.body.innerHTML);
    console.log('--- BODY HTML ---');
    console.log(bodyHTML.substring(0, 1000));
    console.log('-----------------');

    await browser.close();
})();

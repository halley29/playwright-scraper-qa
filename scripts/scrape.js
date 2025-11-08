const { chromium } = require('playwright');

async function scrape(url) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle" });

    // Extract all numbers inside *any* table cell
    const numbers = await page.$$eval("table td", cells =>
        cells
            .map(c => parseFloat(c.textContent.trim()))
            .filter(n => !isNaN(n))
    );

    const sum = numbers.reduce((a, b) => a + b, 0);

    await browser.close();
    return sum;
}

(async () => {
    const seeds = Array.from({ length: 10 }, (_, i) => 47 + i);
    let grandTotal = 0;

    for (const seed of seeds) {
        const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
        console.log(`Scraping seed ${seed}: ${url}`);

        try {
            const s = await scrape(url);
            console.log(`Sum for seed ${seed}: ${s}`);
            grandTotal += s;
        } catch (err) {
            console.log(`Error scraping seed ${seed}:`, err);
        }
    }

    console.log("FINAL TOTAL:", grandTotal);
})();

// api/scrape.js
const chromium = require('@sparticuz/chromium');
// Dynamically require the appropriate Puppeteer package
const puppeteer = process.env.NODE_ENV === 'production' ? require('puppeteer-core') : require('puppeteer');


module.exports = async (req, res) => {
    const url = req.query.url; // Get the URL to scrape from the query parameters

    if (!url) {
        res.status(400).send('Please provide a URL to scrape');
        return;
    }

    const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    let browser = null;
    try {
        const launchOptions = process.env.NODE_ENV === 'production' ? {
                args: chromium.args,
                executablePath: await chromium.executablePath(),
                headless: true,
            } : {};
    
        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' }); // wait until page load
        const content = await page.content(); // get page content
        await browser.close();
    
        res.status(200).send(content);
    } catch (error) {
        console.error("An error occurred during data extraction", error);
        if (browser !== null) await browser.close();
        res.status(500).json({ error: "Failed to fetch data" });
    }
};

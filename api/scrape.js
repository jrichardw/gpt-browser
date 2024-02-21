// api/scrape.js
const puppeteer = require('puppeteer');

module.exports = async (req, res) => {
    const url = req.query.url; // Get the URL to scrape from the query parameters

    if (!url) {
        res.status(400).send('Please provide a URL to scrape');
        return;
    }

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' }); // wait until page load
    const content = await page.content(); // get page content
    await browser.close();

    res.status(200).send(content);
};

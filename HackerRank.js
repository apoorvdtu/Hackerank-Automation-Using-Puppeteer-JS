let config = {
    username: "EMAIL HERE"
    , password: "PASSWORD HERE"
    , moderator:
        ["jaani", "udyanojha", "arpit2911011", "swatibhatia1809", "chauhantarun264", "adwaitkulkarni21", "pravinmudaliyar1"]
};
let url = "https://www.hackerrank.com";
let puppeteer = require("puppeteer");
(async function () {
    let browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto(url);
    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");
    await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
    await page.click("a[href='https://www.hackerrank.com/login']");
    await page.waitForSelector("input[name='username']");
    await page.click("input[name='username']");
    await page.keyboard.type(config.username);
    await page.waitForSelector("input[name='password']");
    await page.click("input[name='password']");
    await page.keyboard.type(config.password);
    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");
    await page.waitForSelector("a[data-analytics='NavBarContests']");
    await page.click("a[data-analytics='NavBarContests']");
    await page.waitForSelector("a.text-link.filter-item");
    await page.click("a.text-link.filter-item");
    await page.waitForSelector('[data-attr1="Last"]');
    let allctabs = await page.$eval('[data-attr1="Last"]', function (ctablength) {
        return ctablength.getAttribute('data-attr8');
    })
    allctabs = parseInt(allctabs);
    for (let i = 0; i < allctabs; i++) {
        await getAllContestsofOnePage("a.backbone.block-center", page, browser);
        await page.waitFor(1000);
        await page.waitForSelector('[data-attr1="Right"]');
        await page.click('[data-attr1="Right"]');
    }
})();
async function getAllContestsofOnePage(selector, page, browser) {
    await page.waitForSelector(selector);
    let curls = await page.$$eval("a.backbone.block-center", function (atags) {
        let urls = [];
        for (let i = 0; i < atags.length; i++) {
            let url1 = atags[i].getAttribute('href');
            url1 = "https://www.hackerrank.com" + url1;
            urls.push(url1);
        }
        return urls;
    });
    for (let i = 0; i < curls.length; i++) {
        let ctab = await browser.newPage();
        await ctab.bringToFront();
        await addModerator1Contest(curls[i], ctab);
        await ctab.close();
        await page.waitFor(1000);
    }
};
async function addModerator1Contest(link, ctab) {
    await ctab.goto(link);
    await ctab.waitFor(2000);
    await ctab.waitForSelector('[data-tab="moderators"]');
    await ctab.click('[data-tab="moderators"]');
    for (let i = 0; i < config.moderator.length; i++) {
        await ctab.waitForSelector('input[id="moderator"]');
        await ctab.click('input[id="moderator"]');
        await ctab.keyboard.type(config.moderator[i]);
        await ctab.keyboard.press("Tab");
        await ctab.keyboard.press("Enter");
    }
}
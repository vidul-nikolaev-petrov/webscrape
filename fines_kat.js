const puppeteer = require("puppeteer");
const driverID = process.argv[2];
const driverEGN = process.argv[3];
const timeout = 1024;

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const url = "https://e-uslugi.mvr.bg/services/kat-obligations";
    const inputIdentity = "#byIdentity";
    const inputDriverID = "#drivingLicenceNumber";
    const inputDriverEGN = "#obligedPersonIdent";
    const inputSearch = "div.right-side > button.btn.btn-primary";
    const resSelector = "div.alert.alert-warning.mt-0.mb-4";

    await page.goto(url);
    await page.waitForSelector(inputIdentity);

    if (!(await (await (await page.$(inputIdentity)).getProperty("checked")).jsonValue())) {
        await page.click(inputIdentity);
    }

    await page.waitForSelector(inputDriverID);
    await page.waitForSelector(inputDriverEGN);
    await page.type(inputDriverID, driverID);
    await page.type(inputDriverEGN, driverEGN);
    
    await page.waitForSelector(inputSearch);
    await page.click(inputSearch);

    await page.waitForSelector(resSelector, { timeout });

    console.log(await page.$$eval(resSelector, (e) => e.map((e) => e.innerText)));

    await browser.close();
})();

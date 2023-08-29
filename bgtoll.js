const puppeteer = require("puppeteer");
const plate = process.argv[2];
const timeout = 2048;
const plateRegex = /^[\p{L}]{1,3}\d{4,8}[\p{L}]{1,3}$/u;

// exclude spoiled personalities
if (!plateRegex.test(plate)) {
    console.warn("Липсва регистрационен номер!");
    process.exit();
}

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const url = "https://check.bgtoll.bg/#/";
    const inputSelector = "input.form-control.form-control-sm";
    const searchSelector = "button.btn.btn-success.btn-sm";
    const resultSelector = "div.CheckResult.container > div > table > tbody";
    const errorSelector = "div.fade.alert.alert-warning.show";

    await page.goto(url);
    await page.waitForSelector(inputSelector);
    await page.waitForSelector(searchSelector);
    await page.type(inputSelector, plate);
    await page.click(searchSelector);

    try {
        const textSelector = await page.waitForSelector(resultSelector, { timeout });
        const result = await textSelector?.evaluate((el) => el.innerText);
        console.log(result.split("\t"));
    } catch (e) {
        if (e instanceof puppeteer.TimeoutError) {
            try {
                const textSelector = await page.waitForSelector(errorSelector, { timeout });
                const result = await textSelector?.evaluate((el) => el.innerText);
                console.log(result);
            } catch (e) {
                console.warn("Няма резултат!");
            }
        }
    }

    await browser.close();
})();

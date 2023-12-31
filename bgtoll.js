const puppeteer = require("puppeteer");
const plate = process.argv[2];
const timeout = 1024;
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
    const fuzzyErrorSelector = "div.fade.alert.alert-success.show";

    await page.goto(url);
    await page.waitForSelector(inputSelector);
    await page.waitForSelector(searchSelector);
    await page.type(inputSelector, plate);
    await page.click(searchSelector);

    try {
        console.log((await getResult(resultSelector)).split("\t"));
    } catch (e) {
        if (e instanceof puppeteer.TimeoutError) {
            try {
                console.log(await getResult(errorSelector));
            } catch (e) {
                try {
                    console.log(await getResult(fuzzyErrorSelector));
                } catch (e) {
                    console.warn("Няма резултат!");
                }
            }
        }
    }

    await browser.close();

    async function getResult(selector) {
        const textSelector = await page.waitForSelector(selector, { timeout });
        const result = await textSelector?.evaluate((el) => el.innerText);

        return result;
    }
})();
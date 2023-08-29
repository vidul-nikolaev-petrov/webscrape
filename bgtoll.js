const puppeteer = require("puppeteer");
const plate = process.argv[2];
const plateRegex = /^[\p{L}]{1,3}\d{4,8}[\p{L}]{1,3}$/u;

// exclude spoiled personalities
if (!plateRegex.test(plate)) {
    console.warn("Липсва регистрационен номер!");
    process.exit();
}

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const data = { url: "https://check.bgtoll.bg/#/", plate };
    const inputSelector = "input.form-control.form-control-sm";
    const searchSelector = "button.btn.btn-success.btn-sm";
    const resultSelector = "div.CheckResult.container > div > table > tbody";

    await page.goto(data.url);
    await page.waitForSelector(inputSelector);
    await page.waitForSelector(searchSelector);
    await page.type(inputSelector, data.plate);
    await page.click(searchSelector);

    const textSelector = await page.waitForSelector(resultSelector);
    const result = await textSelector?.evaluate((el) => el.innerText);

    console.log(result.split("\t"));

    await browser.close();
})();

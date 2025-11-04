const fetch = require("node-fetch");
const { program } = require("commander");
const url = new URL("https://e-uslugi.mvr.bg/api/Obligations/AND");

program
    .name("node fines_kat.js")
    .description("команден скрипт за проверка на задължения към КАТ")
    .requiredOption("--egn <number>", "или ЕГН, или ЛНЧ, или ЛН")
    .option("--licence <number>", "лицензен номер на шофьора")
    .option("--plate <string>", "регистрационен номер на МПС")
    .helpOption("--help", "показва тази помощна информация")
    .parse();

const { egn, licence, plate } = program.opts();

// Enforce "licence OR plate must be provided"
if (!licence && !plate) {
    console.error(
        "Необходим е или лицензен номер на шофьора, или регистрационен номер на МПС."
    );
    console.error(
        "Употреба: node fines_kat.js --egn <number> --licence <number>"
    );
    console.error(
        "     или: node fines_kat.js --egn <number> --plate <string>"
    );
    process.exit(1);
}

url.searchParams.set("obligatedPersonType", "1");
url.searchParams.set("mode", "1");
url.searchParams.set("obligedPersonIdent", egn);

if (licence) {
    url.searchParams.set("additinalDataForObligatedPersonType", "1");
    url.searchParams.append("drivingLicenceNumber", licence);
} else {
    url.searchParams.append("additinalDataForObligatedPersonType", "3");
    url.searchParams.set("foreignVehicleNumber", plate);
}

checkObligations()
    .then((data) => console.log(formatObligation(data)))
    .catch((err) => console.error(err));

async function checkObligations() {
    const res = await fetch(url, {
        headers: {
            Referer: "https://e-uslugi.mvr.bg/services/obligations",
            Accept: "application/json",
        },
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    return await res.json();
}

function formatObligation(data) {
    const obligations = data.obligationsData[0].obligations;

    if (obligations.length === 0) {
        return "Няма неплатени глоби.";
    }

    return JSON.stringify(obligations, null, 2);
}

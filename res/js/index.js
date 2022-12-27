//const url = "https://my.api.mockaroo.com"; // change accordingly
const url = "/res";
const file = "data.json";
const apiKey = "ef3aaf90";

const table = document.querySelector(".table");
const ageCanvas = document.querySelector("#age-chart");
const genderCanvas = document.querySelector("#gender-chart");

async function getData() {
    const response = await (await fetch(`${url}/${file}`, {
        headers: {
            "X-API-Key": apiKey
        }
    })).json();

    return response;
}

function beautifyKey(key) {
    let string = "";

    for (let word of key.split("_")) {
        string += word.toUpperCase() + " ";
    }

    return string;
}

function createTable(data) {
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    for (let key of Object.keys(data[0])) {
        let header = document.createElement("th");
        header.innerText = beautifyKey(key);

        thead.appendChild(header);
    }

    for (let entry of data) {
        let tr = document.createElement("tr");
        for (let key of Object.keys(entry)) {
            let td = document.createElement("th");
            td.innerText = entry[key];

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    document.querySelector("#loading-text").remove();
}

function createAgeChart(rawData) {
    let ageRangeGen = [
        14, 16, 18, 20, 22,
        25, 30, 40, 50, 60,
        65
    ];

    let ageDivision = [];
    let ageLabels = [];
    let ageColors = [];

    for (let i = 0; i < ageRangeGen.length - 1; i += 2) {
        let from = ageRangeGen[i];
        let to = ageRangeGen[i + 1] - 1;

        ageLabels.push(`${from} - ${to}`);
        ageDivision.push({ from, to });

        let r = Math.floor(255.0 * (Math.sin((2 * i) / 2.0) * 0.5 + 0.25));
        let g = Math.floor(255.0 * (Math.sin((2 * i) / 4.0) * 0.5 + 0.35));
        let b = Math.floor(255.0 * (Math.sin((2 * i) / 6.0) * 0.5 + 0.45));

        ageColors.push(
            `rgb(${r}, ${g}, ${b})`
        );

        from = ageRangeGen[i + 1];
        to = ageRangeGen[i + 2] - 1;

        ageLabels.push(`${from} - ${to}`);
        ageDivision.push({ from, to });

        r = Math.floor(255.0 * (Math.sin((2 * i + 1) / 2.0) * 0.5 + 0.25));
        g = Math.floor(255.0 * (Math.sin((2 * i + 1) / 8.0) * 0.5 + 0.35));
        b = Math.floor(255.0 * (Math.sin((2 * i + 1) / 16.0) * 0.5 + 0.45));

        ageColors.push(
            `rgb(${r}, ${g}, ${b})`
        );
    }
    
    let ageData = [];
    for (let i = 0; i < ageDivision.length; i++)
        ageData.push(0);

    for (let i = 0; i < rawData.length; i++) {
        const entry = rawData[i];
        for (let j = 0; j < ageDivision.length; j++) {
            const range = ageDivision[j];
            if (entry.age >= range.from && entry.age <= range.to) {
                ageData[j]++;
                break;
            }
        }
    }

    const data = {
        labels: ageLabels,
        datasets: [{
            label: "Count",
            data: ageData,
            backgroundColor: ageColors,
            hoverOffset: 4
        }]
    };

    new Chart(ageCanvas, {
        type: "doughnut",
        data: data
    });

    ageCanvas.style.display = "inline";
}

function createGenderChart(rawData) {
    let genderLabels = [];
    let genderData = [];
    let genderColors = [];

    for (let i = 0; i < rawData.length; i++)
        genderLabels.push(rawData[i].gender);
    
    genderLabels = genderLabels.filter((v, i, s) => s.indexOf(v) == i);

    for (let i = 0; i < genderLabels.length; i++) {
        genderData.push(0);

        let r = Math.floor(255.0 * (Math.sin((2 * i) / 2.0) * 0.5 + 0.25));
        let g = Math.floor(255.0 * (Math.sin((2 * i) / 4.0) * 0.5 + 0.35));
        let b = Math.floor(255.0 * (Math.sin((2 * i) / 6.0) * 0.5 + 0.45));

        genderColors.push(
            `rgb(${r}, ${g}, ${b})`
        );
    }

    for (let i = 0; i < rawData.length; i++) {
        const entry = rawData[i];
    
        genderData[genderLabels.indexOf(entry.gender)]++;
    }

    const data = {
        labels: genderLabels,
        datasets: [{
            label: "Count",
            data: genderData,
            backgroundColor: genderColors,
            hoverOffset: 4
        }]
    };

    new Chart(genderCanvas, {
        type: "doughnut",
        data: data
    });

    genderCanvas.style.display = "inline";
}

async function start() {
    const data = await getData();
    createTable(data);
    createAgeChart(data);
    createGenderChart(data);
}

start();
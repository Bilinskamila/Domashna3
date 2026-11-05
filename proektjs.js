console.log("My first Formula 1 game");

let drivers = [
    {
        name: "Russell",
        team: "Mercedes",
        bspeed: 93,
        skill: 95,
        totalTime: 0,
        tires: "letni",
        PitLap: 5,
        status: true
    },
    {
        name: "Leclerc",
        team: "Ferrari",
        bspeed: 94,
        skill: 98,
        totalTime: 0,
        tires: "letni",
        PitLap: 6,
        status: true
    },
    {
        name: "Verstappen",
        team: "Red Bull",
        bspeed: 93,
        skill: 96,
        totalTime: 0,
        tires: "zimski",
        PitLap: 5,
        status: true
    },
    {
        name: "Norris",
        team: "McLaren",
        bspeed: 90,
        skill: 95,
        totalTime: 0,
        tires: "letni",
        PitLap: 5,
        status: true
    },
    {
        name: "Lawson",
        team: "Bulls",
        bspeed: 90,
        skill: 93,
        totalTime: 0,
        tires: "zimski",
        PitLap: 3,
        status: true
    },
    {
        name: "Hamilton",
        team: "Ferrari",
        bspeed: 97,
        skill: 98,
        totalTime: 0,
        tires: "zimski",
        PitLap: 4,
        status: true
    },
    {
        name: "Bearman",
        team: "Haas",
        bspeed: 92,
        skill: 94,
        totalTime: 0,
        tires: "letni",
        PitLap: 6,
        status: true
    },
    {
        name: "Hulkenberg",
        team: "Audi",
        bspeed: 95,
        skill: 96,
        totalTime: 0,
        tires: "zimski",
        PitLap: 4,
        status: true
    },
    {
        name: "Sainz",
        team: "Williams",
        bspeed: 93,
        skill: 95,
        totalTime: 0,
        tires: "letni",
        PitLap: 5,
        status: true
    },
    {
        name: "Alonso",
        team: "Aston Martin",
        bspeed: 95,
        skill: 98,
        totalTime: 0,
        tires: "letni",
        PitLap: 4,
        status: true
    }
];

let totalLaps = 10;


let startingDrivers = drivers.map(driver => ({ ...driver }));

function ResetRace() {
    drivers = [];

    for (let i = 0; i < startingDrivers.length; i++) {
        let driver = { ...startingDrivers[i] };

        driver.completedLaps = 0;
        driver.pitStops = 0;
        driver.retiredLap = 0;
        driver.events = [];

        drivers.push(driver);
    }

    document.getElementById("results").innerHTML = "";
    document.getElementById("winner").textContent = "";
}

function LapTime(driver) {
    let t = 120 - (driver.bspeed * 0.3) - (driver.skill * 0.1);

    if (driver.tires === "letni") {
        t -= 2;
    } else {
        t += 1;
    }

    return t;
}

function PitStop(driver) {
    if (driver.tires === "letni") {
        driver.tires = "zimski";
    } else {
        driver.tires = "letni";
    }

    driver.totalTime += 20;
    driver.pitStops++;

    driver.events.push("Pit stop +20 s → " + driver.tires);
}

function Spin(driver) {
    let chance = (100 - driver.skill) / 100;

    if (Math.random() < chance) {
        driver.totalTime += 5;
        driver.events.push("Spin +5 s");
    }
}

function DNF(driver) {
    let chance = 0.02;

    if (Math.random() < chance) {
        driver.status = false;
        driver.events.push("DNF — retired");
    }
}

function SafetyCar() {
    let chance = 0.10;

    if (Math.random() < chance) {
        return true;
    }

    return false;
}

function Sortiraj(drivers) {
    drivers.sort((a, b) => {
        if (a.status === false && b.status === true) {
            return 1;
        }

        if (a.status === true && b.status === false) {
            return -1;
        }

        if (a.status === false && b.status === false) {
            if (a.completedLaps !== b.completedLaps) {
                return b.completedLaps - a.completedLaps;
            }
        }

        return a.totalTime - b.totalTime;
    });
}

function Standing(drivers, title, safetyCar = false) {
    let html = '<section class="standings">';

    html += "<h2>" + title + "</h2>";

    if (safetyCar === true) {
        html += '<p class="safety-car">SAFETY CAR! +15 s for drivers completing this lap.</p>';
    }

    html += '<div class="table-container">';
    html += "<table>";
    html += "<thead><tr>";
    html += '<th scope="col">Position</th>';
    html += '<th scope="col">Driver</th>';
    html += '<th scope="col">Team</th>';
    html += '<th scope="col">Laps</th>';
    html += '<th scope="col">Time (s)</th>';
    html += '<th scope="col">Tires</th>';
    html += '<th scope="col">Pit stops</th>';
    html += '<th scope="col">Status / lap events</th>';
    html += "</tr></thead><tbody>";

    for (let i = 0; i < drivers.length; i++) {
        let driver = drivers[i];
        let position = i + 1;
        let rowClass = "";
        let eventText = driver.events.join("; ");

        if (driver.status === false) {
            position = "DNF";
            rowClass = "dnf";

            if (eventText === "") {
                eventText = "Izletal " + driver.retiredLap;
            }
        } else if (eventText === "") {
            eventText = driver.completedLaps === 0 ? "Ready" : "Running";
        }

        html += '<tr class="' + rowClass + '">';
        html += "<td>" + position + "</td>";
        html += "<td>" + driver.name + "</td>";
        html += "<td>" + driver.team + "</td>";
        html += "<td>" + driver.completedLaps + "/" + totalLaps + "</td>";
        html += "<td>" + driver.totalTime.toFixed(2) + "</td>";
        html += "<td>" + driver.tires + "</td>";
        html += "<td>" + driver.pitStops + "</td>";
        html += "<td>" + eventText + "</td>";
        html += "</tr>";
    }

    html += "</tbody></table></div></section>";

    document.getElementById("results").innerHTML += html;
}

function StartRace() {
    ResetRace();

    Standing(drivers, "Starting Standings");

    for (let i = 0; i < totalLaps; i++) {
        let s = SafetyCar();

        for (let j = 0; j < drivers.length; j++) {
            let driver = drivers[j];

            driver.events = [];

            if (driver.status === false) {
                continue;
            }

            DNF(driver);

            if (driver.status === false) {
                driver.retiredLap = i + 1;
                continue;
            }

            driver.totalTime += LapTime(driver);

            Spin(driver);

            if (s === true) {
                driver.totalTime += 15;
                driver.events.push("Safety Car +15 s");
            }

            if (i + 1 === driver.PitLap && driver.pitStops === 0) {
                PitStop(driver);
            }

            driver.completedLaps++;
        }

        Sortiraj(drivers);

        let title = "Standings After Lap " + (i + 1);

        if (i + 1 === totalLaps) {
            title = "Final Standings — Lap 10";
        }

        Standing(drivers, title, s);
    }

    let winner = document.getElementById("winner");

    if (drivers[0].status === true) {
        winner.textContent =
            "Winner: " + drivers[0].name +
            " (" + drivers[0].team + ")" +
            " — " + drivers[0].totalTime.toFixed(2) + " s";
    } else {
        winner.textContent = "No winner — all drivers retired (DNF).";
    }

    document.getElementById("raceStatus").textContent =
        "Race finished! All 10 laps have been simulated.";

    document.getElementById("startButton").textContent = "New Race";
}


document.getElementById("startButton").addEventListener("click", StartRace);

ResetRace();
Standing(drivers, "Starting Standings");
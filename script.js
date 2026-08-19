/* =========================================================
   PRANSTAMBH FRONTEND ENGINE
========================================================= */


/* =========================================================
   MOCK DATA
   ---------------------------------------------------------
   Later replace these functions with:
   Firebase
   REST API
   WebSocket
   Real YOLO/Luckfox data
========================================================= */
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    query,
    orderBy
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBu29z1q7JNyUg3eJG8THzmdPbcqx3UFd4",
    authDomain: "pransthambh-ai.firebaseapp.com",
    projectId: "pransthambh-ai",
    storageBucket: "pransthambh-ai.firebasestorage.app",
    messagingSenderId: "84757631456",
    appId: "1:84757631456:web:7bd2d1facfdaca88289b85",
    measurementId: "G-J8X592V2N2"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);




/* =========================================================
   API SERVICE LAYER
   ---------------------------------------------------------
   These functions are intentionally separated from UI.
   Later replace their contents with real API/Firebase calls.
========================================================= */

// =====================================
// FIREBASE LIVE DETECTION
// =====================================

const detectionQuery = query(
    collection(db, "detections"),
    orderBy("timestamp", "desc")
);


onSnapshot(detectionQuery, (snapshot) => {

    snapshot.docChanges().forEach((change) => {

        if (change.type === "added") {

            const data = change.doc.data();

            console.log("🔥 NEW LIVE DATA:", data);


            // =========================
            // ANIMAL
            // =========================

            const bigAnimal =
                document.getElementById("bigAnimal");

            if (bigAnimal) {
                bigAnimal.textContent =
                    data.animal || "UNKNOWN";
            }


            // =========================
            // CONFIDENCE
            // =========================

            const bigConf =
                document.getElementById("bigConf");

            const bigConfidence =
                document.getElementById("bigConfidence");

            const confidenceNumber =
                document.getElementById("confidenceNumber");


            if (bigConf) {
                bigConf.textContent =
                    `${data.confidence || 0}%`;
            }

            if (bigConfidence) {
                bigConfidence.textContent =
                    `${data.confidence || 0}%`;
            }

            if (confidenceNumber) {
                confidenceNumber.textContent =
                    `${data.confidence || 0}%`;
            }


            // =========================
            // DISTANCE
            // =========================

            const bigDistance =
                document.getElementById("bigDistance");

            const liveDistance =
                document.getElementById("liveDistance");


            if (bigDistance) {
                bigDistance.textContent =
                    `${data.distance || 0}m`;
            }

            if (liveDistance) {
                liveDistance.textContent =
                    `${data.distance || 0}m`;
            }


            // =========================
            // RISK
            // =========================

            console.log(
                "Risk:",
                data.risk
            );


            // =========================
            // LOCATION
            // =========================

            console.log(
                "Location:",
                data.location
            );

        }

    });

});

/* =========================================================
   DOM
========================================================= */

const landingPage =
    document.getElementById("landingPage");

const dashboardApp =
    document.getElementById("dashboardApp");

const pageTitle =
    document.getElementById("pageTitle");


/* =========================================================
   LANDING → DASHBOARD
========================================================= */
window.launchDashboard = function () {

    landingPage.classList.add("hidden");

    dashboardApp.classList.remove("hidden");

    document.body.style.overflowX = "hidden";

    setTimeout(() => {

        try {
            initializeMap();
        } catch (error) {
            console.warn("Map initialization skipped:", error);
        }

        try {
            renderHistory();
        } catch (error) {
            console.warn("History rendering skipped:", error);
        }

        try {
            setDetectionStatus(false, "STANDBY");
        } catch (error) {
            console.warn("Detection status skipped:", error);
        }

        try {
            showToast(
                "PRANSTAMBH ONLINE",
                "Dashboard ready."
            );
        } catch (error) {
            console.warn("Toast skipped:", error);
        }

    }, 100);

};

function exitDashboard() {

    dashboardApp.classList.add("hidden");

    landingPage.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   SIDEBAR
========================================================= */

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const page =
            item.dataset.page;

        navigateTo(page);

    });

});


function navigateTo(page) {

    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.page === page
        );

    });


    pages.forEach(currentPage => {

        currentPage.classList.remove(
            "active-page"
        );

    });


    const selected =
        document.getElementById(
            `page-${page}`
        );

    if (selected) {

        selected.classList.add(
            "active-page"
        );

    }


    const titles = {

        dashboard: "Dashboard",

        detection: "Live Detection",

        alerts: "Alert Management",

        analytics: "Wildlife Analytics",

        map: "Hotspot Map",

        water: "Water Harvesting",

        health: "System Health",

        settings: "Settings"

    };


    pageTitle.textContent =
        titles[page] || "Dashboard";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (page === "map") {

        setTimeout(() => {

            if (map) {

                map.invalidateSize();

            }

        }, 300);

    }


    closeSidebar();

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList.toggle("open");

}


function closeSidebar() {

    document
        .getElementById("sidebar")
        .classList.remove("open");

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        );

    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    const clock =
        document.getElementById("clock");

    const dateElement =
        document.getElementById("date");


    if (clock) {
        clock.textContent = time;
    }

    if (dateElement) {
        dateElement.textContent = date;
    }

}


updateClock();

setInterval(
    updateClock,
    1000
);


/* =========================================================
   HISTORY TABLE
========================================================= */

function renderHistory(
    data = detectionHistory
) {

    const body =
        document.getElementById(
            "historyBody"
        );

    if (!body) return;

    body.innerHTML = "";


    data.forEach(item => {

        const row =
            document.createElement("tr");


        let riskClass =
            "risk-low";

        if (item.risk === "HIGH") {

            riskClass =
                "risk-high";

        }

        if (item.risk === "MEDIUM") {

            riskClass =
                "risk-medium";

        }


        row.innerHTML = `

            <td>${item.time}</td>

            <td>
                <strong>${item.animal}</strong>
            </td>

            <td>${item.confidence}%</td>

            <td>${item.distance}m</td>

            <td>
                <span class="${riskClass}">
                    ${item.risk}
                </span>
            </td>

            <td>${item.location}</td>

            <td>
                <button
                    class="table-action"
                    onclick="showAlertDetails(
                        '${item.animal}',
                        '${item.location}',
                        '${item.risk}'
                    )">
                    ${item.action}
                </button>
            </td>

        `;


        body.appendChild(row);

    });

}


/* =========================================================
   HISTORY FILTER
========================================================= */

function filterHistory() {

    const search =
        document
            .getElementById("historySearch")
            .value
            .toLowerCase();


    const risk =
        document
            .getElementById("riskFilter")
            .value;


    const filtered =
        detectionHistory.filter(item => {

            const matchesSearch =

                item.animal
                    .toLowerCase()
                    .includes(search)

                ||

                item.location
                    .toLowerCase()
                    .includes(search);


            const matchesRisk =

                !risk ||
                item.risk === risk;


            return (
                matchesSearch &&
                matchesRisk
            );

        });


    renderHistory(filtered);

}


/* =========================================================
   LIVE DETECTION
========================================================= */

let detectionRunning = false;

let detectionInterval = null;


async function startDetection() {

    if (detectionRunning) {

        showToast(
            "DETECTION ALREADY ACTIVE",
            "AI camera is currently monitoring Zone 03."
        );

        return;
    }


    detectionRunning = true;


    setDetectionStatus(
        true,
        "DETECTING"
    );


    showToast(
        "LIVE DETECTION STARTED",
        "AI camera is now monitoring Highway Zone 03."
    );


    updateDetectionUI();




}


function stopDetection() {

    detectionRunning = false;


    


    setDetectionStatus(
        false,
        "STANDBY"
    );


    showToast(
        "DETECTION STOPPED",
        "Live camera monitoring has been paused."
    );

}


function setDetectionStatus(
    active,
    text
) {

    const status =
        document.getElementById(
            "detectionStatus"
        );

    const dot =
        document.getElementById(
            "detectionDot"
        );


    if (!status || !dot) return;


    status.textContent =
        text;


    dot.style.background =
        active
            ? "#16804b"
            : "#aaa";

}


/* =========================================================
   UPDATE DETECTION UI
========================================================= */


/* =========================================================
   DEMO MODE
========================================================= */

let demoRunning = false;


function startDemo() {

    if (demoRunning) {

        showToast(
            "DEMO ALREADY RUNNING",
            "The simulation is currently active."
        );

        return;
    }


    demoRunning = true;


    navigateTo("detection");


    showToast(
        "DEMO MODE STARTED",
        "Simulating AI wildlife detection sequence."
    );


    const steps = [

        {
            delay: 1000,
            title: "CAMERA ACTIVE",
            text:
                "Highway Zone 03 camera connected."
        },

        {
            delay: 3000,
            title: "ANIMAL DETECTED",
            text:
                "Cow detected by AI camera."
        },

        {
            delay: 5000,
            title: "CONFIDENCE",
            text:
                "AI confidence: 94%"
        },

        {
            delay: 7000,
            title: "DISTANCE",
            text:
                "Animal detected at 42 meters."
        },

        {
            delay: 9000,
            title: "RISK MEDIUM",
            text:
                "Animal movement is approaching highway."
        },

        {
            delay: 11000,
            title: "HIGH RISK",
            text:
                "Critical proximity and direction detected."
        },

        {
            delay: 13000,
            title: "WARNING ACTIVATED",
            text:
                "Buzzer ON • RED LED ACTIVE"
        },

        {
            delay: 15000,
            title: "REMOTE ALERT",
            text:
                "Safety notification generated."
        },

        {
            delay: 17000,
            title: "EVENT LOGGED",
            text:
                "Detection added to wildlife history."
        }

    ];


    steps.forEach(step => {

        setTimeout(() => {

            showToast(
                step.title,
                step.text
            );

        }, step.delay);

    });


    setTimeout(() => {

        addDemoDetection();

        updateDashboardStats();

    }, 17000);


    setTimeout(() => {

        demoRunning = false;

        showToast(
            "DEMO COMPLETE",
            "PRANSTAMBH preventive action sequence completed."
        );

    }, 19500);

}


/* =========================================================
   ADD DEMO DETECTION
========================================================= */

function addDemoDetection() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        ).slice(0,5);


    detectionHistory.unshift({

        time: time,

        animal: "Cow",

        confidence: 94,

        distance: 42,

        risk: "HIGH",

        location: "Zone 03",

        action: "Alert"

    });


    renderHistory();

}


/* =========================================================
   DASHBOARD STATS
========================================================= */

function updateDashboardStats() {

    const total =
        document.getElementById(
            "totalDetections"
        );

    const high =
        document.getElementById(
            "highRisk"
        );


    if (total) {

        total.textContent =
            detectionHistory.length;

    }


    const highCount =
        detectionHistory.filter(
            item =>
                item.risk === "HIGH"
        ).length;


    if (high) {

        high.textContent =
            highCount;

    }

}


/* =========================================================
   ALERTS
========================================================= */

function acknowledgeAlert() {

    showToast(
        "ALERT ACKNOWLEDGED",
        "Operator has acknowledged the active wildlife alert."
    );

}


function showAlertDetails(
    animal = "Cow",
    location = "Highway Zone 03",
    risk = "HIGH"
) {

    const modal =
        document.getElementById(
            "modal"
        );

    const title =
        document.getElementById(
            "modalTitle"
        );

    const text =
        document.getElementById(
            "modalText"
        );


    title.textContent =
        `${risk} RISK — ${animal}`;


    text.innerHTML = `

        <strong>Location:</strong>
        ${location}
        <br><br>

        <strong>Confidence:</strong>
        94%
        <br><br>

        <strong>Distance:</strong>
        42m
        <br><br>

        <strong>Direction:</strong>
        Toward highway
        <br><br>

        <strong>Detection duration:</strong>
        4.2 seconds
        <br><br>

        <strong>Warning:</strong>
        Active

    `;


    modal.classList.add("show");

}


function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function showNotifications() {

    showToast(
        "NOTIFICATIONS",
        "3 active system events require attention."
    );

}


function showToast(
    title,
    message
) {

    const container =
        document.getElementById(
            "toastContainer"
        );


    const toast =
        document.createElement("div");


    toast.className =
        "toast";


    toast.innerHTML = `

        <strong>
            ${title}
        </strong>

        <span>
            ${message}
        </span>

    `;


    container.appendChild(
        toast
    );


    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateX(30px)";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 4500);

}


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveSettings() {

    showToast(
        "SETTINGS SAVED",
        "Frontend demo configuration updated."
    );

}


/* =========================================================
   LEAFLET MAP
========================================================= */

let map = null;


function initializeMap() {

    if (map) return;


    const mapElement =
        document.getElementById(
            "map"
        );


    if (!mapElement) return;


    map =
        L.map("map")
        .setView(
            [26.2389, 73.0243],
            7
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    /*
        Demo highway route.

        These coordinates are demonstration data
        and are NOT government/official locations.
    */

    const highwayRoute = [

        [26.2389, 73.0243],

        [26.55, 73.18],

        [26.82, 73.30],

        [27.05, 73.52],

        [27.28, 73.72]

    ];


    L.polyline(
        highwayRoute,
        {
            color: "#111",
            weight: 5
        }
    ).addTo(map);


    const zones = [

        {
            position: [26.55,73.18],
            name: "Zone 01",
            detections: 5,
            color: "green"
        },

        {
            position: [26.82,73.30],
            name: "Zone 02",
            detections: 18,
            color: "#c62828"
        },

        {
            position: [27.05,73.52],
            name: "Zone 03",
            detections: 3,
            color: "#d69d00"
        },

        {
            position: [27.28,73.72],
            name: "Zone 04",
            detections: 8,
            color: "green"
        }

    ];


    zones.forEach(zone => {

        const marker =
            L.circleMarker(
                zone.position,
                {
                    radius: 10,

                    fillColor:
                        zone.color,

                    color:
                        "#fff",

                    weight: 2,

                    opacity: 1,

                    fillOpacity: .9
                }
            ).addTo(map);


        marker.bindPopup(`

            <strong>
                ${zone.name}
            </strong>

            <br>

            ${zone.detections}
            wildlife detections

            <br><br>

            <small>
                Demo Data
            </small>

        `);

    });

}


/* =========================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================================= */

document
    .getElementById("modal")
    ?.addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeModal();

            }

        }
    );


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderHistory();

        console.log(
            "PRANSTAMBH frontend initialized."
        );

        console.log(
            "Mock API layer ready for Firebase/API integration."
        );

    }
);
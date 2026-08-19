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
    query
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
    collection(db, "detections")
);
/*onSnapshot(detectionQuery, (snapshot) => {

    snapshot.docChanges().forEach((change) => {

        if (change.type !== "added") {
            return;
        }

        const data = change.doc.data();

        console.log("🔥 NEW LIVE DETECTION:", data);


        // =========================
        // ANIMAL
        // =========================

        const liveAnimal =
            document.getElementById("liveAnimal");

        if (liveAnimal) {
            liveAnimal.textContent =
                data.animal || "UNKNOWN";
        }


        const liveAnimalTitle =
            document.getElementById("liveAnimalTitle");

        if (liveAnimalTitle) {
            liveAnimalTitle.textContent =
                data.animal
                    ? `${data.animal} Detected`
                    : "Animal Detected";
        }


        // =========================
        // CAMERA
        // =========================

        const liveCamera =
            document.getElementById("liveCamera");

        if (liveCamera) {
            liveCamera.textContent =
                data.camera || "UNKNOWN";
        }


        // =========================
        // CONFIDENCE
        // =========================

        const liveConfidence =
            document.getElementById("liveConfidence");

        if (liveConfidence) {

            liveConfidence.textContent =
                data.confidence !== undefined
                    ? `${data.confidence}%`
                    : "—";

        }


        // =========================
        // DATE
        // =========================

        const liveDate =
            document.getElementById("liveDate");

        if (liveDate) {

            liveDate.textContent =
                data.date || "—";

        }


        // =========================
        // RISK
        // =========================

        const liveRisk =
            document.getElementById("liveRisk");

        if (liveRisk) {

            liveRisk.textContent =
                data.risk || "—";

            liveRisk.className = "";

            if (data.risk) {
                liveRisk.classList.add(
                    `risk-${data.risk.toLowerCase()}`
                );
            }

        }


        // =========================
        // STATUS
        // =========================

        const liveStatus =
            document.getElementById("liveStatus");

        if (liveStatus) {

            liveStatus.textContent =
                data.status || "—";

        }


        // =========================
        // TIME
        // =========================

        const liveTime =
            document.getElementById("liveTime");

        if (liveTime) {

            liveTime.textContent =
                data.time || "—";

        }


        console.log("Animal:", data.animal);
        console.log("Camera:", data.camera);
        console.log("Confidence:", data.confidence);
        console.log("Date:", data.date);
        console.log("Risk:", data.risk);
        console.log("Status:", data.status);
        console.log("Time:", data.time);

    });

});*/

// =====================================
// FIREBASE WILDLIFE HISTORY
// =====================================

let firebaseDetectionHistory = [];
let detectionHistory = [];

onSnapshot(
    detectionQuery,

    (snapshot) => {

        firebaseDetectionHistory = snapshot.docs.map(doc => {

            const data = doc.data();

            return {
                id: doc.id,

                animal: data.animal || "UNKNOWN",

                camera: data.camera || "UNKNOWN",

                confidence:
                    Number(data.confidence) || 0,

                date: data.date || "UNKNOWN",

                risk:
                    String(data.risk || "UNKNOWN").toUpperCase(),

                status: data.status || "UNKNOWN",

                time: data.time || "UNKNOWN",

                distance:
                    Number(data.distance) || 0,

                location:
                    data.location ||
                    data.camera ||
                    "UNKNOWN",

                action:
                    data.action ||
                    (
                        String(data.risk || "")
                            .toUpperCase() === "HIGH"
                            ? "Alert"
                            : "View"
                    )
            };

        });

        // IMPORTANT:
        // Firebase data becomes the main dashboard data
        detectionHistory = [...firebaseDetectionHistory];

        console.log(
            "🔥 FIREBASE DATA:",
            detectionHistory
        );

        // Analytics
        updateWildlifeAnalytics();

        // Dashboard cards
        updateDashboardStats();

        // History table
        renderHistory(detectionHistory);

        // Latest detection
        if (detectionHistory.length > 0) {

            const latest =
                detectionHistory[detectionHistory.length - 1];

            updateLiveDetection(latest);
        }

    },

    (error) => {

        console.error(
            "❌ FIREBASE ERROR:",
            error
        );

        showToast(
            "FIREBASE ERROR",
            error.message || "Unable to load Firebase data."
        );

    }
);

function updateLiveDetection(data) {

    if (!data) return;

    const animal =
        document.getElementById("liveAnimal");

    const camera =
        document.getElementById("liveCamera");

    const confidence =
        document.getElementById("liveConfidence");

    const date =
        document.getElementById("liveDate");

    const risk =
        document.getElementById("liveRisk");

    const status =
        document.getElementById("liveStatus");

    const time =
        document.getElementById("liveTime");


    if (animal)
        animal.textContent =
            data.animal || "UNKNOWN";


    if (camera)
        camera.textContent =
            data.camera || "UNKNOWN";


    if (confidence)
        confidence.textContent =
            data.confidence
                ? `${data.confidence}%`
                : "—";


    if (date)
        date.textContent =
            data.date || "—";


    if (risk) {

        risk.textContent =
            data.risk || "—";

        risk.className = "";

        if (data.risk) {

            risk.classList.add(
                `risk-${data.risk.toLowerCase()}`
            );

        }

    }


    if (status)
        status.textContent =
            data.status || "—";


    if (time)
        time.textContent =
            data.time || "—";


    console.log(
        "🦌 LIVE DETECTION:",
        data
    );
}

// =====================================
// WILDLIFE ANALYTICS
// =====================================

function updateWildlifeAnalytics() {

    const data =
        firebaseDetectionHistory;


    if (!data.length) {

        setAnalyticsText(
            "analyticsTotal",
            "0"
        );

        setAnalyticsText(
            "analyticsAlerts",
            "0"
        );

        setAnalyticsText(
            "analyticsHighRisk",
            "0"
        );

        setAnalyticsText(
            "analyticsMostDetected",
            "—"
        );

        return;
    }


    // =================================
    // TOTAL DETECTIONS
    // =================================

    setAnalyticsText(
        "analyticsTotal",
        data.length
    );


    // =================================
    // TOTAL ALERTS
    // =================================

    const totalAlerts =
        data.filter(item => {

            const status =
                item.status.toLowerCase();

            return (
                status.includes("alert") ||
                status.includes("warning")
            );

        }).length;


    setAnalyticsText(
        "analyticsAlerts",
        totalAlerts
    );


    // =================================
    // HIGH RISK
    // =================================

    const highRisk =
        data.filter(
            item => item.risk === "HIGH"
        ).length;


    setAnalyticsText(
        "analyticsHighRisk",
        highRisk
    );


    // =================================
    // MOST DETECTED ANIMAL
    // =================================

    const animalCounts =
        countValues(
            data,
            "animal"
        );


    const mostDetected =
        getHighestCount(
            animalCounts
        );


    setAnalyticsText(
        "analyticsMostDetected",
        mostDetected.name || "—"
    );


    // =================================
    // ANIMAL DISTRIBUTION
    // =================================

    renderAnalyticsBars(
        "animalAnalytics",
        animalCounts
    );


    // =================================
    // RISK DISTRIBUTION
    // =================================

    const riskCounts =
        countValues(
            data,
            "risk"
        );


    renderAnalyticsBars(
        "riskAnalytics",
        riskCounts,
        true
    );


    // =================================
    // CAMERA DISTRIBUTION
    // =================================

    const cameraCounts =
        countValues(
            data,
            "camera"
        );


    renderAnalyticsBars(
        "cameraAnalytics",
        cameraCounts
    );


    // =================================
    // DATE DISTRIBUTION
    // =================================

    const dateCounts =
        countValues(
            data,
            "date"
        );


    renderAnalyticsBars(
        "dateAnalytics",
        dateCounts
    );


    // =================================
    // PEAK TIME
    // =================================

    updatePeakActivity(data);

}

// =====================================
// COUNT VALUES
// =====================================

function countValues(data, field) {

    const counts = {};

    data.forEach(item => {

        const value =
            item[field] || "UNKNOWN";

        counts[value] =
            (counts[value] || 0) + 1;

    });

    return counts;
}


// =====================================
// HIGHEST COUNT
// =====================================

function getHighestCount(counts) {

    let name = "";
    let count = 0;

    Object.entries(counts).forEach(
        ([key, value]) => {

            if (value > count) {

                name = key;
                count = value;

            }

        }
    );

    return {
        name,
        count
    };

}


// =====================================
// ANALYTICS TEXT
// =====================================

function setAnalyticsText(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}


// =====================================
// ANALYTICS BARS
// =====================================

function renderAnalyticsBars(
    containerId,
    counts,
    percentage = false
) {

    const container =
        document.getElementById(
            containerId
        );

    if (!container) return;


    container.innerHTML = "";


    const entries =
        Object.entries(counts)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    if (!entries.length) {

        container.innerHTML =
            "<p>No detection data available.</p>";

        return;

    }


    const max =
        Math.max(
            ...entries.map(
                item => item[1]
            )
        );


    const total =
        entries.reduce(
            (sum, item) =>
                sum + item[1],
            0
        );


    entries.forEach(
        ([name, count]) => {

            const row =
                document.createElement(
                    "div"
                );


            const width =
                max > 0
                    ? (count / max) * 100
                    : 0;


            const value =
                percentage
                    ? `${(
                        (count / total) *
                        100
                    ).toFixed(1)}%`
                    : count;


            row.innerHTML = `

                <span>
                    ${name}
                </span>

                <div>
                    <i
                        style="
                            width:${width}%
                        "
                    ></i>
                </div>

                <b>
                    ${value}
                </b>

            `;


            container.appendChild(
                row
            );

        }
    );

}

// =====================================
// PEAK WILDLIFE ACTIVITY
// =====================================

function updatePeakActivity(data) {

    const periods = {

        Morning: 0,

        Afternoon: 0,

        Evening: 0,

        Night: 0

    };


    data.forEach(item => {

        const hour =
            getHourFromTime(
                item.time
            );


        if (hour === null) {
            return;
        }


        if (
            hour >= 5 &&
            hour < 12
        ) {

            periods.Morning++;

        }
        else if (
            hour >= 12 &&
            hour < 17
        ) {

            periods.Afternoon++;

        }
        else if (
            hour >= 17 &&
            hour < 21
        ) {

            periods.Evening++;

        }
        else {

            periods.Night++;

        }

    });


    const highest =
        getHighestCount(
            periods
        );


    const peak =
        document.getElementById(
            "peakActivity"
        );


    const text =
        document.getElementById(
            "peakActivityText"
        );


    if (peak) {

        peak.textContent =
            highest.name || "—";

    }


    if (text) {

        text.textContent =
            highest.name
                ? `${highest.count} wildlife detections occurred during the ${highest.name.toLowerCase()} period.`
                : "No valid time data available.";

    }


    updateActivityBar(
        "morningActivity",
        periods.Morning,
        periods
    );

    updateActivityBar(
        "afternoonActivity",
        periods.Afternoon,
        periods
    );

    updateActivityBar(
        "eveningActivity",
        periods.Evening,
        periods
    );

    updateActivityBar(
        "nightActivity",
        periods.Night,
        periods
    );

}


// =====================================
// PARSE TIME
// =====================================

function getHourFromTime(
    timeString
) {

    if (!timeString) {
        return null;
    }


    const match =
        String(timeString).match(
            /(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i
        );


    if (!match) {
        return null;
    }


    let hour =
        Number(match[1]);


    const ampm =
        match[3]
            ? match[3].toUpperCase()
            : null;


    if (ampm === "PM" && hour < 12) {

        hour += 12;

    }


    if (ampm === "AM" && hour === 12) {

        hour = 0;

    }


    return hour;

}


// =====================================
// ACTIVITY BAR
// =====================================

function updateActivityBar(
    id,
    count,
    periods
) {

    const element =
        document.getElementById(id);

    if (!element) return;


    const max =
        Math.max(
            ...Object.values(periods),
            1
        );


    element.style.height =
        `${(count / max) * 100}%`;

}

/* =========================================================
   HOW IT WORKS MODAL
========================================================= */

window.showHowItWorks = function () {

    const modal =
        document.getElementById(
            "howItWorksModal"
        );

    if (!modal) return;

    modal.classList.add("show");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

};

window.showHowItWorks = function () {

    const modal =
        document.getElementById("howItWorksModal");

    if (!modal) return;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
};


window.closeHowItWorks = function () {

    const modal =
        document.getElementById("howItWorksModal");

    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
};


// Click outside popup to close
document.getElementById("howItWorksModal")
    ?.addEventListener("click", function (event) {

        const popup =
            document.querySelector(".how-it-works-box");

        if (
            event.target === this ||
            !popup.contains(event.target)
        ) {
            closeHowItWorks();
        }

    });


window.closeHowItWorks = function () {

    const modal =
        document.getElementById(
            "howItWorksModal"
        );

    if (!modal) return;

    modal.classList.remove("show");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

};


/* Close with ESC */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeHowItWorks();

        }

    }
);


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
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
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

function getCurrentUser() {
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!rawUser) {
        return {};
    }

    try {
        return JSON.parse(rawUser) || {};
    } catch (error) {
        console.error("Failed to parse stored user for navbar:", error);
        return {};
    }
}

function updateStoredUser(nextUser) {
    if (!nextUser || !nextUser.id) {
        return;
    }

    const serializedUser = JSON.stringify(nextUser);

    if (localStorage.getItem("remember") === "true") {
        localStorage.setItem("user", serializedUser);
    }

    sessionStorage.setItem("user", serializedUser);
}

// Script to load the css for the navbar
function loadNavbarCSS() {
    if (!document.querySelector('link[href="/components/Navbar/Navbar.css"]')) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "../../components/Navbar/Navbar.css";

        document.head.appendChild(link);
    }
}


// Script to create navbar
export function createNavbar() {
    const user = getCurrentUser();

    // Create navbar 
    const navbar = document.createElement("nav");

    const currentPoints = Number(user.points ?? 0);

    navbar.classList.add("navbar");

    navbar.innerHTML = `
        <!-- Mobile hamburger -->
        <button class="hamburger-menu" id="hamburger">
            ☰
        </button>


        <!-- Logo -->
        <div class="logo">

            <img src="../../images/logo/logo.png" alt="UniBite Logo" class="logo-image">

            <span class="logo-text">
                UniBite
            </span>

        </div>


        <!-- Navigation links -->
        <ul class="nav-links" id="nav-links">

            <li>
                <a href="../../pages/dashboards/browsePage.html">
                    Browse Offers
                </a>
            </li>

            <li>
                <a href="../../pages/dashboards/createPage.html">
                    Create Offers
                </a>
            </li>

        </ul>


        <!-- User -->
        <div class="user-profile">

            <span class="points">
                🟡 ${currentPoints}
            </span>

            <img id="user-profile" src="../../images/user-profile.png" alt="User Profile" class="profile-image">

            <!-- User profile options-->
            <ul class="user-options" id="user-options">
                <li>
                    <p id="settings-button">SETTINGS</p>
                </li>
                <li>
                    <p id="logout-button">LOGOUT</p>
                </li>
            </ul>
        </div>
    `;

    //Js to add event listeners to the hamburger menu
    // Get elements
    const hamburger = navbar.querySelector("#hamburger");
    const navlinks = navbar.querySelector("#nav-links");

    // Toggle menu
    hamburger.addEventListener("click", (event) => {

        // Prevent the document click listener from immediately closing it
        event.stopPropagation();

        navlinks.classList.toggle("active");

    });

    // Close menu when clicking anywhere else
    document.addEventListener("click", () => {

        navlinks.classList.remove("active");

    });


    // Add event dropdown to the user profile and listeners
    const userProfile = navbar.querySelector("#user-profile");

    const userOptions = navbar.querySelector("#user-options");

    userProfile.addEventListener("click", (event) => {

        // Prevent the document click event from firing
        event.stopPropagation();

        userOptions.classList.toggle("active");

    });

    document.addEventListener("click", (event) => {

        if (!navbar.contains(event.target)) {

            userOptions.classList.remove("active");

        }

    });

    //Add Logout button functionality
    const logoutButton = navbar.querySelector("#logout-button");

    logoutButton.addEventListener("click", () => {
        //Clear remember login
        localStorage.removeItem("user");
        localStorage.removeItem("remember");

        //Clear current session
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("remember");

        //Redirect to login page
        window.location.replace("../../pages/auth/login.html");
    });

    const settingsButton = navbar.querySelector("#settings-button");

    settingsButton.addEventListener("click", async () => {
        // If the popup already exists, just show it again
        let modal = document.getElementById("settings-modal");
        if (modal) {
            modal.style.display = "flex";
            return;
        }

        // Load settings.css if not already present
        if (!document.querySelector('link[href="/css/settings.css"]')) {
            const cssLink = document.createElement("link");
            cssLink.rel = "stylesheet";
            cssLink.href = "/css/settings.css";
            document.head.appendChild(cssLink);
        }

        // Fetch the Settings.html markup
        const response = await fetch("/pages/settings/Settings.html");
        if (!response.ok) {
            console.error("Failed to load Settings.html:", response.status);
            return;
        }
        const htmlText = await response.text();

        // Parse it so we can grab just the form we need
        const doc = new DOMParser().parseFromString(htmlText, "text/html");
        const formContent = doc.getElementById("location-edit");
        if (!formContent) {
            console.error("Could not find #location-edit in fetched Settings.html");
            return;
        }

        // Build the modal shell
        modal = document.createElement("div");
        modal.id = "settings-modal";
        modal.className = "settings-modal-overlay";

        const modalBox = document.createElement("div");
        modalBox.className = "settings-modal-box";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "×";
        closeBtn.className = "settings-modal-close";
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
            document.dispatchEvent(new CustomEvent("settingsModalClosed"));
        });
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none"; // click outside to close
                document.dispatchEvent(new CustomEvent("settingsModalClosed"));
            }
        });

        modalBox.appendChild(closeBtn);
        modalBox.appendChild(formContent);
        modal.appendChild(modalBox);
        document.body.appendChild(modal);

        // Make sure Leaflet is available, then run Settings.js against the injected markup
        await loadLeaflet();
        const script = document.createElement("script");
        script.src = "/js/pages/settings/Settings.js";
        document.body.appendChild(script);
    });

    function loadLeaflet() {
        return new Promise((resolve) => {
            if (window.L) return resolve();

            let cssLoaded = false;
            let jsLoaded = false;

            const tryResolve = () => {
                if (cssLoaded && jsLoaded) resolve();
            };

            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            link.onload = () => { cssLoaded = true; tryResolve(); };
            document.head.appendChild(link);

            const script = document.createElement("script");
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = () => { jsLoaded = true; tryResolve(); };
            document.body.appendChild(script);
        });
    }

    //Load css for the navbar
    loadNavbarCSS();

    return navbar;

}
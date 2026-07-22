//Get user logged in
const user = JSON.parse(
    localStorage.getItem("user")
) || {};

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
    // Create navbar 
    const navbar = document.createElement("nav");

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
                    Create Offer
                </a>
            </li>

        </ul>


        <!-- User -->
        <div class="user-profile">

            <span class="points">
                🟡 ${user.points || 0}
            </span>

            <img id="user-profile" src="../../images/user-profile.png" alt="User Profile" class="profile-image">

            <!-- User profile options-->
            <ul class="user-options" id="user-options">
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
    })

    //Load css for the navbar
    loadNavbarCSS();

    return navbar;

}




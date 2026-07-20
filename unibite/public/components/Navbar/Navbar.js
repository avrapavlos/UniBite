// Script to load the css for the navbar
function loadNavbarCSS(){
    if (!document.querySelector('link[href="/components/Navbar/Navbar.css"]')) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "../../components/Navbar/Navbar.css";

        document.head.appendChild(link);
    }
}


// Script to create navbar
export function createNavbar(){
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
                <a href="../../pages/offers/BrowsePage.html">
                    Browse Offers
                </a>
            </li>

            <li>
                <a href="../../pages/offers/CreatePage.html">
                    Create Offer
                </a>
            </li>

        </ul>


        <!-- User -->
        <div class="user-profile">

            <span class="points">
                🟡 100
            </span>

            <img src="../../images/user-profile.png" alt="User Profile" class="profile-image">

        </div>
    `;


    const hamburger = navbar.querySelector('#hamburger');
    const navlinks = navbar.querySelector('#nav-links');

    hamburger.addEventListener("click", () => {
        navlinks.classList.toggle('active');
    })

    loadNavbarCSS();
    
    return navbar;

}




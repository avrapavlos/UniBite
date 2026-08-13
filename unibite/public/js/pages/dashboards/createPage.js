import { createNavbar } from "../../../components/Navbar/Navbar.js";
import { loadUserOffers } from "../../dataLoaders/userOffers.js";
import { displayUserOffers } from "../../renderers/offersRenderer.js";

// Add create offer button click event listener
function addCreateOfferButtonListener() {
    const createOfferButton = document.getElementById("create-offer-button");
    createOfferButton.addEventListener("click", () => {
        // Redirect to the create offer page
        window.location.href = "/pages/offers/createOffer.html"; 
    });
}

async function init(){
    //Load navbar
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.appendChild(createNavbar());

    // Load the offers data for maybe later use
    const offers = await loadUserOffers();

    displayUserOffers(offers);
    
    // Render the data
    console.log("Offers data loaded:", offers);

    // Add event listener for the create offer button
    addCreateOfferButtonListener();
}

init();
import { createNavbar } from "../../../components/Navbar/Navbar.js";
import { getMap, createMap, addOfferMarkers } from "../../../components/Map/Map.js";
import { showOfferDetails } from "../../../components/OfferDetails/OfferDetailsManager.js";
import { displayOffers } from "../../renderers/offersRenderer.js";
import { loadOffers, loadOffersExcludingUser } from "../../dataLoaders/offers.js";
import { loadUserOffers } from "../../dataLoaders/userOffers.js";

// CLick event listener for the filter button
function setFilterListener() {
    const button = document.querySelector(".filter-button");
    const menu = document.querySelector(".filter-menu");


    button.addEventListener("click", () => {

        menu.classList.toggle("active");

    });
}


// Function that enables map switching in browse page
function setViewToggle() {
    const listButton = document.getElementById("list-view-btn");
    const mapButton = document.getElementById("map-view-btn");

    const listView = document.getElementById("offer-list");
    const mapView = document.getElementById("offer-map");

    listButton.addEventListener("click", () => {
        listButton.classList.add("active");
        mapButton.classList.remove("active");

        listView.style.display = "block";
        mapView.style.display = "none";
    })

    mapButton.addEventListener("click", () => {
        mapButton.classList.add("active");
        listButton.classList.remove("active");

        listView.style.display = "none";
        mapView.style.display = "block";

        const map = getMap();

        setTimeout(() => {
            map.invalidateSize();
        }, 100)
    })
}


async function init() {
    // Load navbar
    const navbarContainer = document.getElementById('navbar-container');
    navbarContainer.appendChild(createNavbar());

    createMap();
    setFilterListener();
    setViewToggle();

    // Load the offers data
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");
    const userId = storedUser?.id;

    let offers = [];

    if (!userId) {
        console.warn("No user logged in; cannot load offers excluding user.");
        offers = await loadOffers(); // fallback: load all offers if no user is logged in
    } else {
        offers = await loadOffersExcludingUser(userId);
    }

    // Render the data
    if (!offers || offers.length === 0) {
        console.warn("No offers available to display.");
    } else {
        displayOffers(offers);
        addOfferMarkers(offers, showOfferDetails);
    }
}

init();
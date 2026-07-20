import { createNavbar } from "../../components/Navbar/Navbar.js";
import { getMap, createMap, addOfferMarkers } from "../../components/Map/Map.js";
import { showOfferDetails } from "../../components/OfferDetails/OfferDetailsManager.js";
import { displayOffers } from "../renderers/offersRenderer.js";
import { loadOffers } from "../dataLoaders/offers.js";



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


// Initializeing function
async function  init() {
    // Load navbar
    const navbarContainer = document.getElementById('navbar-container');
    navbarContainer.appendChild(createNavbar());


    // Load the offers data for maybe later use
    const offers = await loadOffers();
    
    // Render the data
    displayOffers(offers);
    
    createMap();

    addOfferMarkers(offers, showOfferDetails);

    setFilterListener();
    setViewToggle();
}

init();

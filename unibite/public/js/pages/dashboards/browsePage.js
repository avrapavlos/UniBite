import { createNavbar } from "../../../components/Navbar/Navbar.js";
import { getMap, createMap, addOfferMarkers } from "../../../components/Map/Map.js";
import { showOfferDetails } from "../../../components/OfferDetails/OfferDetailsManager.js";
import { displayOffers } from "../../renderers/offersRenderer.js";
import { loadOffersExcludingUser } from "../../dataLoaders/offers.js";
import { calculateDistance } from "../../helperFunctions/mapDistance.js";

let allOffers = [];
let userLocation = null;
let selectedRadius = null;

function getStoredUser() {
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    try {
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        return null;
    }
}

function renderFilteredOffers() {
    const searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
    const filteredOffers = allOffers.filter((offer) => {
        const matchesSearch = !searchTerm
            || offer.title.toLowerCase().includes(searchTerm)
            || offer.description.toLowerCase().includes(searchTerm);
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            Number(offer.latitude),
            Number(offer.longitude)
        );
        offer.distance = distance;
        return matchesSearch && (selectedRadius === null || distance <= selectedRadius);
    });

    displayOffers(filteredOffers);
    addOfferMarkers(filteredOffers, showOfferDetails);
    document.getElementById("offer-results-status").textContent =
        `${filteredOffers.length} offer${filteredOffers.length === 1 ? "" : "s"} within ${selectedRadius ?? "all"} km`;
}

function setDistanceListeners() {
    document.querySelectorAll("input[name=distance]").forEach((input) => {
        input.addEventListener("change", () => {
            selectedRadius = input.value === "" ? null : Number(input.value);
            renderFilteredOffers();
        });
    });

    document.getElementById("search-button").addEventListener("click", renderFilteredOffers);
    document.getElementById("search-input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") renderFilteredOffers();
    });
}

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

    setFilterListener();
    setDistanceListeners();
    setViewToggle();

    // Load the offers data
    const storedUser = getStoredUser();
    const userId = storedUser?.id;
    userLocation = {
        latitude: Number(storedUser?.latitude),
        longitude: Number(storedUser?.longitude)
    };

    if (!userId || !Number.isFinite(userLocation.latitude) || !Number.isFinite(userLocation.longitude)) {
        displayOffers([]);
        document.getElementById("offer-results-status").textContent =
            "Add your location in Settings to browse nearby offers.";
        return;
    }

    createMap([userLocation.latitude, userLocation.longitude]);
    allOffers = await loadOffersExcludingUser(userId);
    renderFilteredOffers();
}

init();
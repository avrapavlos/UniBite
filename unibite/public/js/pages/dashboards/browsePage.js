import { createNavbar } from "../../../components/Navbar/Navbar.js";
import { getMap, createMap, addOfferMarkers, updateUserLocation } from "../../../components/Map/Map.js";
import { showOfferDetails } from "../../../components/OfferDetails/OfferDetailsManager.js";
import { displayOffers } from "../../renderers/offersRenderer.js";
import { loadOffersExcludingUser } from "../../dataLoaders/offers.js";
import { calculateDistance } from "../../helperFunctions/mapDistance.js";
import { ALLERGENS } from "../../helperFunctions/allergens.js";

let allOffers = [];
let userLocation = null;
let selectedRadius = null;
const excludedAllergens = new Set();

function getStoredUser() {
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    try {
        return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        return null;
    }
}

function debounce(fn, delayMs) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delayMs);
    };
}

function offerMatchesSearch(offer, searchWords) {
    if (searchWords.length === 0) return true;

    const haystack = `${offer.title} ${offer.description} ${offer.building_name ?? ""}`.toLowerCase();

    return searchWords.every((word) => haystack.includes(word));
}

function offerHasExcludedAllergen(offer) {
    if (excludedAllergens.size === 0) return false;

    const offerAllergens = Array.isArray(offer.allergens) ? offer.allergens : [];
    return offerAllergens.some((allergen) => excludedAllergens.has(allergen));
}

function renderFilteredOffers() {
    const rawSearch = document.getElementById("search-input").value.trim().toLowerCase();
    const searchWords = rawSearch.split(/\s+/).filter(Boolean);

    const filteredOffers = allOffers.filter((offer) => {
        const matchesSearch = offerMatchesSearch(offer, searchWords);
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            Number(offer.latitude),
            Number(offer.longitude)
        );
        offer.distance = distance;
        return matchesSearch
            && !offerHasExcludedAllergen(offer)
            && (selectedRadius === null || distance <= selectedRadius);
    });

    // Rank offers whose title matches the search above description-only
    // matches, then sort each group by nearest distance
    filteredOffers.sort((a, b) => {
        const aTitleMatch = rawSearch && a.title.toLowerCase().includes(rawSearch) ? 0 : 1;
        const bTitleMatch = rawSearch && b.title.toLowerCase().includes(rawSearch) ? 0 : 1;

        if (aTitleMatch !== bTitleMatch) return aTitleMatch - bTitleMatch;

        return a.distance - b.distance;
    });

    displayOffers(filteredOffers);
    addOfferMarkers(filteredOffers, showOfferDetails);
    document.getElementById("offer-results-status").textContent =
        `${filteredOffers.length} offer${filteredOffers.length === 1 ? "" : "s"} within ${selectedRadius ?? "all"} km`;
}

const debouncedRenderFilteredOffers = debounce(renderFilteredOffers, 250);

function setDistanceListeners() {
    document.querySelectorAll("input[name=distance]").forEach((input) => {
        input.addEventListener("change", () => {
            selectedRadius = input.value === "" ? null : Number(input.value);
            renderFilteredOffers();
        });
    });

    document.getElementById("search-button").addEventListener("click", renderFilteredOffers);
    document.getElementById("search-input").addEventListener("input", debouncedRenderFilteredOffers);
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
 

// Click event listener for the filter menu to close it when clicking outside
document.addEventListener("click", (event) => {
    const button = document.querySelector(".filter-button");
    const menu = document.querySelector(".filter-menu");

    if (!button.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove("active");
    }

});



// Renders the allergen filter chips and wires up toggling
function setupAllergenFilter() {
    const row = document.getElementById("allergen-chip-row");
    if (!row) return;

    ALLERGENS.forEach((allergen) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "allergen-chip";
        chip.dataset.allergen = allergen.value;
        chip.title = `Hide offers containing ${allergen.label}`;
        chip.innerHTML = `
            <span class="allergen-chip-icon">${allergen.icon}</span>
            <span class="allergen-chip-label">${allergen.label}</span>
        `;

        chip.addEventListener("click", () => {
            if (excludedAllergens.has(allergen.value)) {
                excludedAllergens.delete(allergen.value);
                chip.classList.remove("active");
            } else {
                excludedAllergens.add(allergen.value);
                chip.classList.add("active");
            }
            renderFilteredOffers();
        });

        row.appendChild(chip);
    });
}
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

// Re-reads the stored user's location and refreshes the map + offer list
// (respecting whatever search/filter is currently active) without reloading
// the page. Triggered whenever the settings modal closes, in case the
// person just saved a new location.
async function refreshLocationAndOffers() {
    const storedUser = getStoredUser();
    const userId = storedUser?.id;
    const latitude = Number(storedUser?.latitude);
    const longitude = Number(storedUser?.longitude);

    if (!userId || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        // Still no valid location saved, nothing to refresh yet
        return;
    }

    userLocation = { latitude, longitude };

    if (getMap()) {
        // Map already exists, just recenter it and move the user marker
        updateUserLocation(latitude, longitude);
    } else {
        // This is the first time we have a valid location, so the map
        // was never created during init() — create it now
        createMap([latitude, longitude]);
    }

    if (allOffers.length === 0) {
        allOffers = await loadOffersExcludingUser(userId);
        console.log("Allergens per offer:", allOffers.map((offer) => ({ id: offer.id, title: offer.title, allergens: offer.allergens })));
    }

    renderFilteredOffers();
}

document.addEventListener("settingsModalClosed", refreshLocationAndOffers);


async function init() {
    // Load navbar
    const navbarContainer = document.getElementById('navbar-container');
    navbarContainer.appendChild(createNavbar());

    setFilterListener();
    setDistanceListeners();
    setViewToggle();
    setupAllergenFilter();

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
    console.log("Allergens per offer:", allOffers.map((offer) => ({ id: offer.id, title: offer.title, allergens: offer.allergens })));
    renderFilteredOffers();
}

init();
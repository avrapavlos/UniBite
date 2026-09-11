// =========================
// Location Variables
// =========================

let map;
let selectedMarker = null;

// Location DOM Elements
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");
const addressInput = document.getElementById("address");
const searchAddressButton = document.getElementById("search-address-button");


// =========================
// Initialize Map
// =========================

function initializeMap() {

    const defaultLatitude = 39.365;
    const defaultLongitude = 21.921;

    map = L.map("map").setView(
        [defaultLatitude, defaultLongitude],
        15
    );

    // OpenStreetMap Tiles
    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    // Force Leaflet to recalculate its size after layout settles
    setTimeout(() => {
        map.invalidateSize();
    }, 0);

    // =========================
    // Map Click
    // =========================

    map.on("click", function (event) {

        const latitude = event.latlng.lat;
        const longitude = event.latlng.lng;

        // Put coordinates into form
        latitudeInput.value = latitude.toFixed(6);
        longitudeInput.value = longitude.toFixed(6);

        // Remove previous marker
        if (selectedMarker !== null) {
            map.removeLayer(selectedMarker);
        }

        // Create new marker
        selectedMarker = L.marker([latitude, longitude]).addTo(map);

        selectedMarker
            .bindPopup("Offer location")
            .openPopup();
    });
}


// =========================
// Address Search Setup
// =========================

function setupAddressSearch() {

    searchAddressButton.addEventListener("click", searchAddress);

    addressInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchAddress();
        }
    });
}


// =========================
// Search Address
// =========================

async function searchAddress() {

    const address = addressInput.value.trim();

    if (address === "") {
        return;
    }

    searchAddressButton.disabled = true;
    searchAddressButton.textContent = "Searching...";

    try {

        // Nominatim Geocoding
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.length === 0) {
            return;
        }

        // Get coordinates
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        // Update form
        latitudeInput.value = latitude.toFixed(6);
        longitudeInput.value = longitude.toFixed(6);

        // Move map
        map.setView([latitude, longitude], 17);

        // Remove previous marker
        if (selectedMarker !== null) {
            map.removeLayer(selectedMarker);
        }

        // Create marker
        selectedMarker = L.marker([latitude, longitude]).addTo(map);

        selectedMarker
            .bindPopup(data[0].display_name)
            .openPopup();

    } catch (error) {

        console.error("Address search error:", error);

    } finally {

        searchAddressButton.disabled = false;
        searchAddressButton.textContent = "Search";
    }
}


// =========================
// Initialize Location
// =========================

initializeMap();
setupAddressSearch();
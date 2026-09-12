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
const addressSuggestionsList = document.getElementById("address-suggestions");

function debounce(fn, delayMs) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delayMs);
    };
}


// =========================
// Initialize Map
// =========================

function initializeMap() {

    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    let storedUser = null;
    try {
        storedUser = rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        console.error("Could not read stored user location:", error);
    }

    const defaultLatitude = Number(storedUser?.latitude) || 39.365;
    const defaultLongitude = Number(storedUser?.longitude) || 21.921;
    const hasSavedLocation = Number.isFinite(Number(storedUser?.latitude))
        && Number.isFinite(Number(storedUser?.longitude));

    if (hasSavedLocation) {
        latitudeInput.value = defaultLatitude.toFixed(6);
        longitudeInput.value = defaultLongitude.toFixed(6);
    }

    map = L.map("map").setView(
        [defaultLatitude, defaultLongitude],
        hasSavedLocation ? 17 : 15
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

    if (hasSavedLocation) {
        selectedMarker = L.marker([defaultLatitude, defaultLongitude])
            .addTo(map)
            .bindPopup("Saved location");
    }

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

    addressInput.addEventListener("input", debouncedFetchSuggestions);

    document.addEventListener("click", function (event) {
        if (!addressInput.contains(event.target) && !addressSuggestionsList.contains(event.target)) {
            renderSuggestions([]);
        }
    });
}


// =========================
// Address Suggestions (autocomplete)
// =========================

async function fetchAddressSuggestions() {
    const query = addressInput.value.trim();

    if (query === "") {
        renderSuggestions([]);
        return;
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const results = await response.json();
        renderSuggestions(results);

    } catch (error) {
        console.error("Address suggestion error:", error);
        renderSuggestions([]);
    }
}

const debouncedFetchSuggestions = debounce(fetchAddressSuggestions, 400);

function renderSuggestions(results) {
    addressSuggestionsList.innerHTML = "";

    if (results.length === 0) {
        addressSuggestionsList.classList.remove("active");
        return;
    }

    results.forEach((result) => {
        const item = document.createElement("li");
        item.textContent = result.display_name;
        item.addEventListener("click", () => selectSuggestion(result));
        addressSuggestionsList.appendChild(item);
    });

    addressSuggestionsList.classList.add("active");
}

function selectSuggestion(result) {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    addressInput.value = result.display_name;
    latitudeInput.value = latitude.toFixed(6);
    longitudeInput.value = longitude.toFixed(6);

    map.setView([latitude, longitude], 17);

    if (selectedMarker !== null) {
        map.removeLayer(selectedMarker);
    }

    selectedMarker = L.marker([latitude, longitude]).addTo(map);
    selectedMarker.bindPopup(result.display_name).openPopup();

    renderSuggestions([]);
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
// Save Location
// =========================

function setupSaveLocation() {

    const form = document.getElementById("location-edit");
    const saveButton = document.getElementById("save-location-button");

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // stop native page navigation/reload

        const latitude = latitudeInput.value;
        const longitude = longitudeInput.value;

        if (!latitude || !longitude) {
            alert("Please select a location on the map first.");
            return;
        }

        // Get logged-in user's id (adjust to however your app stores it)
        const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;

        if (!user || !user.id) {
            alert("You must be logged in to save your location.");
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        try {
            const response = await fetch("/api/users/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                })
            });

            if (!response.ok) {
                throw new Error("Failed to save location");
            }

            const result = await response.json();
            console.log("Location saved:", result);

            const updatedUser = {
                ...user,
                latitude: result.latitude,
                longitude: result.longitude
            };
            const serializedUser = JSON.stringify(updatedUser);
            if (localStorage.getItem("user")) {
                localStorage.setItem("user", serializedUser);
            }
            if (sessionStorage.getItem("user")) {
                sessionStorage.setItem("user", serializedUser);
            }

            // Close the modal on success
            const modal = document.getElementById("settings-modal");
            if (modal) modal.style.display = "none";

            // Let other parts of the app (e.g. the browse page) know the
            // location changed, so they can refresh without a page reload
            document.dispatchEvent(new CustomEvent("settingsModalClosed"));

        } catch (error) {
            console.error("Error saving location:", error);
            alert("Something went wrong saving your location. Please try again.");
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save Location";
        }
    });
}

// =========================
// Initialize Location
// =========================

initializeMap();
setupAddressSearch();
setupSaveLocation();
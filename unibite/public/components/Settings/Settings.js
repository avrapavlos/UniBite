// Global Variables

let map;
let selectedMarker = null;

const form = document.getElementById("location-edit");

// Location

const latitudeInput = document.getElementById("latitude");

const longitudeInput = document.getElementById("longtitude");

const addressInput = document.getElementById("address");

const searchAddressButton = document.getElementById("search-address-button");

function getLoggedInUser() {
    const storedUserSources = [
        localStorage.getItem("user"),
        sessionStorage.getItem("user")
    ];

    for (const rawUser of storedUserSources) {
        if (!rawUser) continue;

        try {
            const parsedUser = JSON.parse(rawUser);
            if (parsedUser && parsedUser.id) {
                return parsedUser;
            }
        } catch (error) {
            console.error("Failed to parse stored user:", error);
        }
    }

    return null;
}

// Setup form
function setupForm() {

    form.addEventListener(
        "submit",
        handleFormSubmit
    );
}

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    initializeMap();
    setupAddressSearch();
    setupForm();
});

// =========================
// Initialize Map
// =========================

function initializeMap() {

    /*
        Default location.

        Later we can replace this with
        the user's current location.
    */

    const defaultLatitude = 39.365;
    const defaultLongitude = 21.921;


    map = L.map("map").setView(
        [
            defaultLatitude,
            defaultLongitude
        ],
        15
    );


    // =========================
    // OpenStreetMap Tiles
    // =========================

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);


    // =========================
    // Map Click
    // =========================

    map.on("click", function (event) {

        const latitude =
            event.latlng.lat;

        const longitude =
            event.latlng.lng;


        // Put coordinates into form

        latitudeInput.value =
            latitude.toFixed(6);

        longitudeInput.value =
            longitude.toFixed(6);


        // Remove previous marker

        if (selectedMarker !== null) {

            map.removeLayer(
                selectedMarker
            );

        }


        // Create new marker

        selectedMarker = L.marker([
            latitude,
            longitude
        ]).addTo(map);


        selectedMarker
            .bindPopup("Offer location")
            .openPopup();

    });

}


// =========================
// Address Search Setup
// =========================

function setupAddressSearch() {

    // Search button

    searchAddressButton.addEventListener(
        "click",
        searchAddress
    );


    // Press Enter

    addressInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                searchAddress();

            }

        }
    );

}


// =========================
// Search Address
// =========================

function clearMessages() {

    errorMessage.textContent = "";
    errorMessage.classList.remove("active");
    successMessage.textContent = "";
    successMessage.classList.remove("active");
}

async function searchAddress() {
    clearMessages();
    const address =
        addressInput.value.trim();


    // =========================
    // Validate Address
    // =========================

    if (address === "") {

        showError(
            "Please enter an address."
        );

        return;

    }


    clearMessages();


    // Disable button

    searchAddressButton.disabled =
        true;

    searchAddressButton.textContent =
        "Searching...";


    try {

        // =========================
        // Nominatim Request
        // =========================

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
        );


        if (!response.ok) {

            throw new Error(
                "Network response was not ok"
            );

        }


        const data =
            await response.json();


        // =========================
        // No Results
        // =========================

        if (data.length === 0) {

            showError(
                "Address not found. Please try again."
            );

            return;

        }


        // =========================
        // Get Coordinates
        // =========================

        const latitude =
            parseFloat(data[0].lat);

        const longitude =
            parseFloat(data[0].lon);


        // =========================
        // Update Form
        // =========================

        latitudeInput.value =
            latitude.toFixed(6);

        longitudeInput.value =
            longitude.toFixed(6);


        // =========================
        // Move Map
        // =========================

        map.setView(
            [
                latitude,
                longitude
            ],
            17
        );


        // =========================
        // Remove Previous Marker
        // =========================

        if (selectedMarker !== null) {

            map.removeLayer(
                selectedMarker
            );

        }


        // =========================
        // Create Marker
        // =========================

        selectedMarker = L.marker([
            latitude,
            longitude
        ]).addTo(map);


        selectedMarker
            .bindPopup(
                data[0].display_name
            )
            .openPopup();


    } catch (error) {

        console.error(
            "Address search error:",
            error
        );

        showError(
            "Error occurred while searching for address."
        );

    } finally {

        searchAddressButton.disabled =
            false;

        searchAddressButton.textContent =
            "Search";

    }

}

// Handle form submission

async function handleFormSubmit(event) {
    event.preventDefault();
    // =========================
    // Get Form Values
    // =========================

    const latitude =
        parseFloat(latitudeInput.value);

    const longitude =
        parseFloat(longitudeInput.value);

    const buildingName =
        document.getElementById(
            "building_name"
        ).value.trim();

    const roomNumber =
        document.getElementById(
            "room_number"
        ).value.trim();


    // =========================
    // Validate
    // =========================

    if (
        isNaN(latitude) ||
        isNaN(longitude) || !buildingName ||
        !roomNumber
    ) {

        showError(
            "Please fill in all required fields."
        );
        console.log("Error in validation!");
        return;

    }


    // =========================
    // Get User
    // =========================

    const user = getLoggedInUser();
    const userId = user ? user.id : null;

    console.log("User ID:", userId);
    if (!userId) {

        showError(
            "User not logged in."
        );
        console.log("Error in userId!");
        return;

    }


    // =========================
    // Create FormData
    // =========================
    console.log("FormData created");
    const formData =
        new FormData();


    formData.append(
        "id",
        userId
    );

    formData.append(
        "latitude",
        latitude
    );

    formData.append(
        "longitude",
        longitude
    );

    formData.append(
        "building_name",
        buildingName
    );

    formData.append(
        "room_number",
        roomNumber
    );

    console.log("Form submitted");

    //Backend is to be added
}

// Global Variables

let map;
let selectedMarker = null;

// DOM Elements
// Form
const form = document.getElementById(
    "create-offer-form"
);

// Information
const titleInput = document.getElementById(
    "title"
);

const descriptionInput = document.getElementById(
    "description"
);

const priceInput = document.getElementById(
    "pointCost"
);

const quantityInput = document.getElementById(
    "quantity"
);


// Location
const latitudeInput = document.getElementById(
    "latitude"
);

const longitudeInput = document.getElementById(
    "longitude"
);

const addressInput = document.getElementById(
    "address"
);

const searchAddressButton = document.getElementById(
    "search-address-button"
);

// image
const imageInput = document.getElementById(
    "image"
);

const imagePreviewContainer = document.getElementById(
    "image-preview-container"
);

const imagePreview = document.getElementById(
    "image-preview"
);


// Messages
const errorMessage = document.getElementById(
    "create-offer-error"
);

const successMessage = document.getElementById(
    "create-offer-success"
);


// Buttons
const cancelButton = document.getElementById(
    "cancel-button"
);

const createButton = document.getElementById(
    "create-button"
);


// Initialize Page
document.addEventListener("DOMContentLoaded", () => {

    initializeMap();

    setupAddressSearch();
    setupForm();
    setupCancelButton();
    // Add these when you implement them
    
    // setupImagePreview();
    // setupCancelButton();

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

// =========================
// Clear Messages
// =========================

function clearMessages() {

    errorMessage.textContent = "";
    errorMessage.classList.remove("active");
    successMessage.textContent = "";
    successMessage.classList.remove("active");
}

// =========================
// Show Message
// =========================

function showError(message) {

    errorMessage.textContent = message;
    errorMessage.classList.add("active");

}

function showSuccess(message) {

    successMessage.textContent = message;
    successMessage.classList.add("active");

}

// Setup form
function setupForm() {

    form.addEventListener(
        "submit",
        handleFormSubmit
    );
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    // =========================
    // Get Form Values
    // =========================

    const title =
        titleInput.value.trim();

    const description =
        descriptionInput.value.trim();

    const price =
        parseFloat(priceInput.value);

    const quantity =
        parseInt(quantityInput.value);

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

    const imageFile =
        imageInput.files[0];


    // =========================
    // Validate
    // =========================

    if (
        !title ||
        !description ||
        isNaN(price) ||
        isNaN(quantity) ||
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

    const user =
        localStorage.getItem("user");

    const userId =
        user ? JSON.parse(user).id : null;
    
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
        "creator_id",
        userId
    );

    formData.append(
        "title",
        title
    );

    formData.append(
        "description",
        description
    );

    formData.append(
        "price",
        price
    );

    formData.append(
        "quantity",
        quantity
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


    // =========================
    // Add Image
    // =========================

    if (imageFile) {

        formData.append(
            "image",
            imageFile
        );

    }

    console.log("Form submitted");
    // =========================
    // Send Request
    // =========================

    try {

        createButton.disabled = true;

        createButton.textContent =
            "Creating...";


        const response =
            await fetch(
                "/api/offers",
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await response.json();

        console.log(
            "Create offer response:",
            result
        );

        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to create offer."
            );

        }


        showSuccess(
            "Offer created successfully!"
        );


        form.reset();


        if (selectedMarker) {

            map.removeLayer(
                selectedMarker
            );

            selectedMarker = null;

        }

        


    } catch (error) {

        console.error(
            "Create offer error:",
            error
        );

        showError(
            error.message ||
            "An error occurred while creating the offer."
        );

    } finally {

        createButton.disabled = false;

        createButton.textContent =
            "Create Offer";

    }

}

// Setup cancel button
function setupCancelButton() {
    
    cancelButton.addEventListener(
        "click",
        function () {
            window.location.href =
                "../dashboards/browsePage.html";
        }
    );

}
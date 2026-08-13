
// Function to create offer details card purely the html and css
export function createOfferDetails(offer) {
    // Load the css for this to the page
    loadOfferDetailsCSS();

    // Create article container
    const card = document.createElement("article");

    card.classList.add("offer-details-container-wrapper");


    // Generate html
    card.innerHTML = `
        <button class="offer-details-close">
            ✕
        </button>

        <div class="offer-details-image-wrapper">
            <img src="${offer.image}" alt="${offer.title}">
        </div>

        <h3 class="offer-details-title">
            ${offer.title}
        </h3>

        <p class="offer-details-description">
            ${offer.description}
        </p>

        <div class="offer-details-location">
            <p>${offer.building_name}</p>
            <p>${offer.room_number}</p>
        </div>

        <div class="offer-details-claim-button-wrapper">
            <button class="offer-details-claim-button">
                CLAIM FOR 🟡${offer.price}
            </button>
        </div>
    `;


    // Return the html for the offer
    return card;
}

// Load component CSS once
function loadOfferDetailsCSS() {
    if (!document.querySelector('link[href="../../components/OfferDetails/OfferDetails.css"]')) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "../../components/OfferDetails/OfferDetails.css";

        document.head.appendChild(link);
    }
}


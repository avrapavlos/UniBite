import { getAllergenMeta } from "../../js/helperFunctions/allergens.js";

// Function to create offer details card purely the html and css
export function createOfferDetails(offer) {
    // Load the css for this to the page
    loadOfferDetailsCSS();

    // Create article container
    const card = document.createElement("article");

    card.classList.add("offer-details-container-wrapper");

    const allergenTags = (offer.allergens || []).map((allergenValue) => {
        const meta = getAllergenMeta(allergenValue);
        return `<span class="offer-details-allergen-tag">${meta.icon} ${meta.label}</span>`;
    }).join("");

    const distanceLabel = Number.isFinite(offer.distance)
        ? `<p class="offer-details-distance">📍 ${offer.distance.toFixed(1)} km away</p>`
        : "";


    // Generate html
    card.innerHTML = `
        <button class="offer-details-close">
            ✕
        </button>

        <div class="offer-details-image-wrapper">
            <img src="${offer.path_to_picture || '../../images/default-food.png'}" alt="${offer.title}">
        </div>

        <h3 class="offer-details-title">
            ${offer.title}
        </h3>

        ${distanceLabel}

        <p class="offer-details-description">
            ${offer.description}
        </p>

        ${allergenTags ? `
        <div class="offer-details-allergens">
            <p class="offer-details-allergens-label">Contains</p>
            <div class="offer-details-allergen-list">
                ${allergenTags}
            </div>
        </div>
        ` : ""}

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
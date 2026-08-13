import { showOfferDetails} from "../../components/OfferDetails/OfferDetailsManager.js";

// OfferCard.js
// Load component CSS once
function loadOfferCardCSS() {
    if (!document.querySelector('link[href="/components/OfferCard/OfferCard.css"]')) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "../../components/OfferCard/OfferCard.css";

        document.head.appendChild(link);
    }
}

// Function to create an offer card
export function createOfferCard(offer, onClick) {

    loadOfferCardCSS();

    if(offer.creator_id === JSON.parse(localStorage.getItem("user")).id) {
        // If the offer belongs to the current user, do not create a card
        return null;
    }

    const card = document.createElement("article");

    card.classList.add("offer-card");


    card.innerHTML = `
        <div class="offer-image-container">
            <img class="offer-image" 
                 src="${offer.image || '../../images/sandwich.jpeg'}" 
                 alt="${offer.title}">
        </div>

        <div class="offer-content">
            <h2 class="offer-title">
                ${offer.title}
            </h2>

            <p class="offer-description">
                ${offer.description}
            </p>

            <p class="offer-portions">
                Μερίδες: ${offer.quantity}
            </p>

            <p class="offer-price">
                🟡${offer.price}
            </p>
        </div>
    `;

    // Check to see if it has 0 portions
    if (offer.quantity == 0 || offer.quantity < 0) {

        // GIve it the empty css class
        card.classList.add("empty");

        // Get portions menu
        
        const portionSegment = card.querySelector(".offer-portions");

        // Set portions to sold out
        
        portionSegment.textContent = "Sold out!";

    } 
    // Otherwise if portions exist 
    else {
        // Add open details event button
        card.addEventListener("click", () => {
            showOfferDetails(offer);
        });
    }


    // Return the offer card
    return card;
}
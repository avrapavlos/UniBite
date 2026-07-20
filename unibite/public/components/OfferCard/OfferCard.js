
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

    const card = document.createElement("article");

    card.classList.add("offer-card");


    card.innerHTML = `
        <div class="offer-image-container">
            <img class="offer-image" 
                 src="${offer.image}" 
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
                Μερίδες: ${offer.portions}
            </p>

            <p class="offer-point-cost">
                🟡${offer.pointCost}
            </p>
        </div>
    `;


    if (offer.portions == 0) {

        card.classList.add("empty");

        card.insertAdjacentHTML(
            "afterbegin",
            `
            <span class="sold-out">
                Εξαντλήθηκε
            </span>
            `
        );
    } else {
        card.addEventListener("click", () => {
            onClick(offer);
        });
    }

    return card;
}
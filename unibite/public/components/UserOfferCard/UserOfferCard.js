// User Offer Card component

// Load component CSS once
function loadUserOfferCardCSS() {
    if (!document.querySelector('link[href="/components/UserOfferCard/UserOfferCard.css"]')) {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.href = "../../components/UserOfferCard/UserOfferCard.css";

        document.head.appendChild(link);
    }
}

// Function to create a user offer card
export function createUserOfferCard(offer, onClick) {
    loadUserOfferCardCSS();

    const card = document.createElement("article");

    card.classList.add("user-offer-card");

    card.innerHTML = `
    <div class="user-offer-card">

        <img src="${offer.image}" alt="${offer.title}" class="user-offer-image">
        
        <div class="user-offer-content">
            <div class="user-offer-top">
                <h2 class="user-offer-title">${offer.title}</h2>
                <span class="portions">Portions: ${offer.portions}</span>
            </div>

            <p class="user-offer-description">${offer.description}</p>

            <div class="user-offer-info">
                <span class="user-offer-location">Location: ${offer.location}</span>
                <span class="user-offer-time">Time: ${offer.time}</span>
                <span class="user-offer-point-cost">🟡${offer.pointCost}</span>
            </div>

            <div class="user-offer-actions">
                <button class="edit-button">✏ Edit</button>
                <button class="delete-button">🗑 Delete</button>
            </div>
        </div>
    </div>
    `;  

    //Return card
    return card;
}
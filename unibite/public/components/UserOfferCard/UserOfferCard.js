// UserOfferCard 

function loadUserOfferCardCSS() {
    const cssId = "user-offer-card-css";
    if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href = "/components/UserOfferCard/UserOfferCard.css";
        document.head.appendChild(link);
    }
};

// Function to create user offer card
export function createUserOfferCard(offer, onClick) {

    // Load the OfferCard CSS
    loadUserOfferCardCSS();

    const card = document.createElement("article");

    card.classList.add("user-offer-card");

    card.innerHTML = `
        <article class="user-offer-card" data-id="${offer.id}">
            <div class="user-offer-image-wrap">
                <img src="${offer.image || '../../images/default-food.png'}" alt="${offer.title}" class="user-offer-image">
            </div>

            <div class="user-offer-content">
                <span class="user-offer-badge">Your listing</span>

                <div class="user-offer-top">
                    <h2 class="user-offer-title">${offer.title}</h2>
                    <span class="user-offer-point-cost">🟡 ${offer.price}</span>
                </div>

                <div class="user-offer-meta-row">
                    <span class="user-offer-portions">${offer.quantity} portions</span>
                    <span class="user-offer-date">${new Date(offer.date_posted).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit"
                    })}</span>
                </div>

                <p class="user-offer-description">${offer.description}</p>

                <div class="user-offer-info">
                    <span class="user-location-tag">
                        <strong>Location:</strong> ${offer.building_name}
                    </span>
                    <span class="user-room-number">Room ${offer.room_number}</span>
                </div>

                <div class="user-offer-actions">
                    <button class="edit-button" type="button">✏️ Edit</button>
                    <button class="delete-button" type="button">🗑️ Delete</button>
                </div>
            </div>
        </article>
    `;

    // Add event listeners for the edit and delete buttons
    const editButton = card.querySelector(".edit-button");
    const deleteButton = card.querySelector(".delete-button");


    // Edit button event listener on click
    editButton.addEventListener("click", () => {
        onClick("edit", offer);
    });

    // Delete button event listener on click
    deleteButton.addEventListener("click", () => {
        onClick("delete", offer);
    });

    return card;
}
// UserOfferCard 

// Function to create user offer card
export function createUserOfferCard(offer, onClick) {
    
    // Load the OfferCard CSS
    loadOfferCardCSS();

    const card = document.createElement("article");

    card.classList.add("user-offer-card");

    card.innerHTML = `
        <article class="user-offer-card" data-id="${offer.id}">
            <img src="${offer.image}" alt="${offer.title}" class="user-offer-image">

            <div class="user-offer-content">
                <div class="user-offer-top">
                    <h2 class="user-offer-title">
                        ${offer.title}
                    </h2>

                    <span class="user-offer-portions">
                        Μερίδες: ${offer.portions}
                    </span>

                    <span class="user-offer-point-cost">
                        🟡${offer.pointCost}
                    </span>
                </div>

                <p class="user-offer-description">
                    ${offer.description}
                </p>

                <div class="user-offer-info">
                    <span class="user-building-name">
                        ${offer.buildingName}
                    </span>

                    <span class="user-offer-date">
                        ${offer.date}
                    </span>
                </div>

                <div class="user-offer-actions">
                    <button class="edit-button">Edit</button>
                    <button class="delete-button">Delete</button>
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
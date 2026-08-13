import { showOfferDetails } from "../../components/OfferDetails/OfferDetailsManager.js";
import { createOfferCard } from "../../components/OfferCard/OfferCard.js";
import { createUserOfferCard } from "../../components/UserOfferCard/UserOfferCard.js";

// Function that is used to render data
export function displayOffers(data) {
    
    // Get the container for the browse page
    const container = document.querySelector(".offer-list");


    // If cant find container exit with error log
    if (!container) {
        console.error("Offer list container not found");
        return;
    }


    // Make sure inner html is empty
    container.innerHTML = "";

    console.log("Rendering offers:", data);

    if (!data || data.length === 0) {
        const noOffersMessage = document.createElement("p");
        noOffersMessage.textContent = "No offers available.";
        container.appendChild(noOffersMessage);
        return;
    }
    
    // Iterate all offers and create card and add showOfferDetails on click event
    data.forEach(offer => {

        const card = createOfferCard(
            offer,
            showOfferDetails
        );


        // Append the card to the container
        if (card) {
            container.appendChild(card);
        } else {
            console.warn("Offer card not created for offer:", offer);
        }

    });
}

export function displayUserOffers(data) {
    // Get the container for the browse page
    const container = document.querySelector(".offers-section");

    // If cant find container exit with error log
    if (!container) {
        console.error("User offer list container not found");
        return;
    }

    // Make sure inner html is empty
    container.innerHTML = "";

    console.log("Rendering user offers:", data);

    if (!data || data.length === 0) {
        const noOffersMessage = document.createElement("p");
        noOffersMessage.textContent = "No user offers available.";
        container.appendChild(noOffersMessage);
        return;
    }

    // Iterate all offers and create card and add showOfferDetails on click event
    data.forEach(offer => {

        const card = createUserOfferCard(
            offer,
            showOfferDetails
        );

        // Append the card to the container
        if (card) {
            container.appendChild(card);
        } else {
            console.warn("User offer card not created for offer:", offer);
        }

    });
}
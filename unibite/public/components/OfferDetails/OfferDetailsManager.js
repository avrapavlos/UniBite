// OfferDetailsManager.js

import { createOfferDetails } from "./OfferDetails.js";


let currentOfferDetails = null;


// Get the offer details container of the page and show the offer clicked
export function showOfferDetails(offer) {
    if (offer.quantity > 0) {
        // Gets container
        const container = document.getElementById(
            "offer-details-container"
        );

        // Sets to active
        container.classList.add("active");

        // Test
        console.log("Details container found: ", container);

        // Remove previous offer if still existing
        if (currentOfferDetails) {
            currentOfferDetails.remove();
        }


        // Create new offer with createOfferDetails and get the generated html file and store it in current Offer
        currentOfferDetails = createOfferDetails(offer);

        // Add to container of page
        container.appendChild(currentOfferDetails);


        //Get Close button
        const closeButton = currentOfferDetails.querySelector(
            ".offer-details-close"
        );

        // Add the event listener which hides the offer details
        closeButton.addEventListener("click", () => {
            hideOfferDetails();

            // Remove visibility class
            container.classList.remove("active");
        });
    } else return;
}


// Helper function to hide offer details when x is clicked
function hideOfferDetails() {

    // If exists
    if (currentOfferDetails) {

        // Remove it from memory 
        currentOfferDetails.remove();

        // Set to null
        currentOfferDetails = null;
    }
}
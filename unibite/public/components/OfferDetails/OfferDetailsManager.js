// OfferDetailsManager.js

import { createOfferDetails } from "./OfferDetails.js";


let currentOfferDetails = null;


export function showOfferDetails(offer) {

    const container = document.getElementById(
        "offer-details-container"
    );

    container.classList.add("active");

    console.log("Details container found: ");

    // Remove previous offer
    if (currentOfferDetails) {
        currentOfferDetails.remove();
    }


    // Create new one
    currentOfferDetails = createOfferDetails(offer);


    container.appendChild(currentOfferDetails);


    // Close button
    const closeButton = currentOfferDetails.querySelector(
        ".offer-details-close"
    );


    closeButton.addEventListener("click", () => {
        hideOfferDetails();
        container.classList.remove("active");
    });
}



export function hideOfferDetails() {

    if (currentOfferDetails) {

        currentOfferDetails.remove();

        currentOfferDetails = null;
    }
}
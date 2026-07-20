import { createOfferCard } from "../components/OfferCard/OfferCard.js";
import { showOfferDetails } from "../components/OfferDetails/OfferDetailsManager.js";

export async function loadOffers() {

    try {

        const response = await fetch("../../data/offers.json");


        if (!response.ok) {
            throw new Error("Failed to load offers");
        }


        const offers = await response.json();


        displayOffers(offers);


        return offers; 

    } catch (error) {

        console.error("Error loading offers:", error);

    }

}



function displayOffers(data) {
    
    const container = document.querySelector(".offer-list");


    if (!container) {
        console.error("Offer list container not found");
        return;
    }


    container.innerHTML = "";


    data.forEach(offer => {

        const card = createOfferCard(
            offer,
            showOfferDetails
        );


        container.appendChild(card);

    });
}
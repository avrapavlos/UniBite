import { createOfferCard } from "../components/OfferCard/OfferCard.js";


export async function loadOffers() {

    try {

        const response = await fetch("../../data/offers.json");


        if (!response.ok) {
            throw new Error("Failed to load offers");
        }


        const offers = await response.json();


        displayOffers(offers);


        return offers; // useful later for map/filtering

    } catch (error) {

        console.error("Error loading offers:", error);

    }

}



function displayOffers(data) {


    const container = document.querySelector(".offer-list");


    container.innerHTML = "";


    data.forEach(offer => {


        const card = createOfferCard(offer);


        container.appendChild(card);


    });

}
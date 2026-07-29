import { createOfferCard } from "../../components/OfferCard/OfferCard.js";
import { showOfferDetails } from "../../components/OfferDetails/OfferDetailsManager.js";

export async function loadOffers() {

    try {

        // Fetch data from json later will fetch form database
        const response = await fetch("http://localhost:3000/api/offers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });


        if (!response.ok) {
            throw new Error("Failed to load offers");
        }


        const offers = await response.json();


        // Return the offers data
        return offers; 

    } catch (error) {

        console.error("Error loading offers:", error);

    }

}


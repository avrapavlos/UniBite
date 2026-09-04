// OfferDetailsManager.js

import { createOfferDetails } from "./OfferDetails.js";

let currentOfferDetails = null;

async function handleClaimOffer(offer) {
    const currentUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

    if (!currentUser) {
        alert("Please log in to claim an offer.");
        return;
    }

    if (Number(offer.creator_id) === Number(currentUser.id)) {
        alert("You cannot claim your own offer.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/offers/${offer.id}/claims`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUser.id, claimedPortions: 1 })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to claim this offer.");
        }

        const claimButton = currentOfferDetails?.querySelector(".offer-details-claim-button");
        if (claimButton) {
            claimButton.disabled = true;
            claimButton.textContent = "CLAIM SENT";
        }

        alert("Your claim has been created and is waiting for the creator to accept it.");
    } catch (error) {
        console.error(error);
        alert(error.message || "Unable to submit claim.");
    }
}

export function showOfferDetails(offer) {
    console.log("Showing offer details for:", offer);
    if (offer.quantity > 0) {
        const container = document.getElementById("offer-details-container");
        container.classList.add("active");

        if (currentOfferDetails) {
            currentOfferDetails.remove();
        }

        currentOfferDetails = createOfferDetails(offer);
        container.appendChild(currentOfferDetails);

        const closeButton = currentOfferDetails.querySelector(".offer-details-close");
        closeButton.addEventListener("click", () => {
            hideOfferDetails();
            container.classList.remove("active");
        });

        const claimButton = currentOfferDetails.querySelector(".offer-details-claim-button");
        if (claimButton) {
            claimButton.addEventListener("click", () => handleClaimOffer(offer));
        }
    } else return;
}

function hideOfferDetails() {
    if (currentOfferDetails) {
        currentOfferDetails.remove();
        currentOfferDetails = null;
    }
}
// OfferDetailsManager.js

import { createOfferDetails } from "./OfferDetails.js";
import { showNotification } from "../Notification/Notification.js";

let currentOfferDetails = null;

async function handleClaimOffer(offer) {
    const currentUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");

    if (!currentUser) {
        showNotification("Please log in to claim an offer.", "error");
        return;
    }

    if (Number(offer.creator_id) === Number(currentUser.id)) {
        showNotification("You cannot claim your own offer.", "error");
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

        showNotification("Your claim has been created and is waiting for the creator to accept it.", "info");
    } catch (error) {
        console.error(error);
        showNotification(error.message || "Unable to submit claim.", "error");
    }
}

export function showOfferDetails(offer) {
    console.log("Showing offer details for:", offer);

    if (offer.quantity <= 0) {
        showNotification("This offer is no longer available.", "error");
        return;
    }

    const container = document.getElementById("offer-details-container");

    // Remove any existing panel before creating a new one
    if (currentOfferDetails) {
        currentOfferDetails.remove();
    }

    currentOfferDetails = createOfferDetails(offer);
    container.appendChild(currentOfferDetails);

    // Trigger the slide-in animation on the next frame
    requestAnimationFrame(() => {
        container.classList.add("active");
    });

    document.body.classList.add("offer-details-open");

    const closeButton = currentOfferDetails.querySelector(".offer-details-close");
    closeButton.addEventListener("click", () => {
        hideOfferDetails();
    });

    // Click on the backdrop (container itself, outside the panel) closes it too
    container.addEventListener("click", (e) => {
        if (e.target === container) {
            hideOfferDetails();
        }
    });

    const claimButton = currentOfferDetails.querySelector(".offer-details-claim-button");
    if (claimButton) {
        claimButton.addEventListener("click", () => handleClaimOffer(offer));
    }
}

export function hideOfferDetails() {
    const container = document.getElementById("offer-details-container");
    container.classList.remove("active");
    document.body.classList.remove("offer-details-open");

    setTimeout(() => {
        if (currentOfferDetails) {
            currentOfferDetails.remove();
            currentOfferDetails = null;
        }
    }, 350); // matches CSS transition duration
}
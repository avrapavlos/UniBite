// UserOfferCard

import { getAllergenMeta } from "../../js/helperFunctions/allergens.js";

function loadUserOfferCardCSS() {
    const cssId = "user-offer-card-css";
    if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href = "/components/UserOfferCard/UserOfferCard.css";
        document.head.appendChild(link);
    }
}

export function shouldShowRatingForClaim(claim, currentUserId) {
    if (!claim || !currentUserId) {
        return false;
    }

    return String(claim.status || "").toUpperCase() === "ACCEPTED" && Number(claim.con_id) === Number(currentUserId);
}

export function createUserOfferCard(offer, onClick) {
    loadUserOfferCardCSS();

    const card = document.createElement("article");
    card.classList.add("user-offer-card");

    const currentUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
    const currentUserId = currentUser?.id ?? null;
    const claims = Array.isArray(offer.claims) ? offer.claims : [];
    const claimMarkup = claims.length
        ? `<div class="user-offer-claims">
            <h3>Claims</h3>
            ${claims.map((claim) => {
                const claimStatus = claim.status || "PENDING";
                const isPending = claimStatus === "PENDING";
                const shouldShowRating = shouldShowRatingForClaim(claim, currentUserId);
                const starButtons = shouldShowRating
                    ? `<div class="claim-rating-row">
                        <span>Rate creator</span>
                        ${[1,2,3,4,5].map((star) => `<button type="button" class="rating-star" data-score="${star}">★</button>`).join("")}
                    </div>`
                    : "";

                return `
                    <div class="user-offer-claim">
                        <div class="user-offer-claim-top">
                            <span><strong>${claim.claimant_name || "Student"}</strong></span>
                            <span class="claim-status ${claimStatus.toLowerCase()}">${claimStatus}</span>
                        </div>
                        <div class="user-offer-claim-meta">
                            <span>${claim.claimed_portions || 1} portion(s)</span>
                        </div>
                        ${isPending ? `
                            <div class="claim-action-row">
                                <button type="button" class="accept-claim-button" data-request-id="${claim.request_id}">Accept</button>
                                <button type="button" class="reject-claim-button" data-request-id="${claim.request_id}">Reject</button>
                            </div>
                        ` : ""}
                        ${claimStatus === "ACCEPTED" && claim.state_of_delivery !== "MISSED" ? `
                            <button type="button" class="missed-claim-button" data-request-id="${claim.request_id}">
                                Mark as not picked up
                            </button>
                        ` : ""}
                        ${starButtons}
                    </div>
                `;
            }).join("")}
        </div>`
        : `<div class="user-offer-claims empty"><p>No claims yet.</p></div>`;

    const allergenTags = (offer.allergens || []).map((allergenValue) => {
        const meta = getAllergenMeta(allergenValue);
        return `<span class="user-offer-allergen-tag" title="Contains ${meta.label}">${meta.icon} ${meta.label}</span>`;
    }).join("");

    card.innerHTML = `
        <div class="user-offer-image-wrap">
            <img src="${offer.path_to_picture || '../../images/default-food.png'}" alt="${offer.title}" class="user-offer-image">
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

            ${allergenTags ? `<div class="user-offer-allergens">${allergenTags}</div>` : ""}

            <div class="user-offer-info">
                <span class="user-location-tag"><strong>Location:</strong> ${offer.building_name}</span>
                <span class="user-room-number">Room ${offer.room_number}</span>
            </div>

            ${claimMarkup}

            <div class="user-offer-actions">
                <button class="edit-button" type="button">✏️ Edit</button>
                <button class="delete-button" type="button">🗑️ Delete</button>
            </div>
        </div>
    `;

    const editButton = card.querySelector(".edit-button");
    const deleteButton = card.querySelector(".delete-button");

    editButton.addEventListener("click", () => onClick("edit", offer));
    deleteButton.addEventListener("click", () => onClick("delete", offer));

    card.querySelectorAll(".accept-claim-button").forEach((button) => {
        button.addEventListener("click", () => {
            const requestId = Number(button.dataset.requestId);
            const matchedClaim = claims.find((claim) => Number(claim.request_id) === requestId);
            onClick("accept-claim", offer, matchedClaim);
        });
    });

    card.querySelectorAll(".reject-claim-button").forEach((button) => {
        button.addEventListener("click", () => {
            const requestId = Number(button.dataset.requestId);
            const matchedClaim = claims.find((claim) => Number(claim.request_id) === requestId);
            onClick("reject-claim", offer, matchedClaim);
        });
    });

    card.querySelectorAll(".missed-claim-button").forEach((button) => {
        button.addEventListener("click", () => {
            const requestId = Number(button.dataset.requestId);
            const matchedClaim = claims.find((claim) => Number(claim.request_id) === requestId);
            onClick("missed-claim", offer, matchedClaim);
        });
    });

    card.querySelectorAll(".rating-star").forEach((button) => {
        button.addEventListener("click", () => {
            const requestId = Number(button.closest(".user-offer-claim")?.querySelector("[data-request-id]")?.dataset.requestId || 0);
            const matchedClaim = claims.find((claim) => Number(claim.request_id) === requestId);
            onClick("rate-claim", offer, matchedClaim, Number(button.dataset.score));
        });
    });

    return card;
}
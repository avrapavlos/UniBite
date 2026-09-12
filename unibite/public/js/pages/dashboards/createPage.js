import { createNavbar } from "../../../components/Navbar/Navbar.js";
import { loadUserOffers } from "../../dataLoaders/userOffers.js";
import { displayUserOffers } from "../../renderers/offersRenderer.js";
import { showNotification } from "../../../components/Notification/Notification.js";
import { showConfirmation } from "../../../components/Confirmation/Confirmation.js";
import { ALLERGENS } from "../../helperFunctions/allergens.js";


function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
    return user?.id ?? null;
}

// Builds the same allergy chip markup used on the Create Offer page
function buildAllergyOptionsMarkup() {
    return ALLERGENS.map((allergen) => `
        <label>
            <input type="checkbox" name="edit-allergies" value="${allergen.value}">
            <span class="allergy-icon">${allergen.icon}</span>
            <span class="allergy-text">${allergen.label}</span>
        </label>
    `).join("");
}

function createEditModal() {
    const modal = document.createElement("div");
    modal.id = "edit-offer-modal";
    modal.className = "modal-backdrop hidden";
    modal.innerHTML = `
        <div class="modal-card">
            <div class="modal-header">
                <h2>Edit Offer</h2>
                <button type="button" class="modal-close" id="close-edit-modal" aria-label="Close">×</button>
            </div>

            <form id="edit-offer-form" class="edit-offer-form">
                <input type="hidden" id="edit-offer-id" name="offerId" />

                <div class="modal-field">
                    <label for="edit-title">Title</label>
                    <input id="edit-title" name="title" type="text" required />
                </div>

                <div class="modal-field">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description" name="description" rows="4" required></textarea>
                </div>

                <div class="modal-grid">
                    <div class="modal-field">
                        <label for="edit-price">Price (🟡)</label>
                        <input id="edit-price" name="price" type="number" min="0" step="0.01" required />
                    </div>

                    <div class="modal-field">
                        <label for="edit-quantity">Quantity</label>
                        <input id="edit-quantity" name="quantity" type="number" min="0" step="1" required />
                    </div>
                </div>

                <div class="modal-grid">
                    <div class="modal-field">
                        <label for="edit-building-name">Building</label>
                        <input id="edit-building-name" name="building_name" type="text" required />
                    </div>

                    <div class="modal-field">
                        <label for="edit-room-number">Room</label>
                        <input id="edit-room-number" name="room_number" type="text" required />
                    </div>
                </div>

                <div class="modal-field">
                    <label>Allergies</label>
                    <div class="allergy-options" id="edit-allergy-options">
                        ${buildAllergyOptionsMarkup()}
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="secondary-button" id="cancel-edit-button">Cancel</button>
                    <button type="submit" class="primary-button">Save Changes</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.add("hidden");
        }
    });

    document.getElementById("close-edit-modal").addEventListener("click", () => modal.classList.add("hidden"));
    document.getElementById("cancel-edit-button").addEventListener("click", () => modal.classList.add("hidden"));

    document.getElementById("edit-offer-form").addEventListener("submit", async (event) => {
        event.preventDefault();
        const id = document.getElementById("edit-offer-id").value;
        const userId = getCurrentUserId();

        if (!id || !userId) {
            return;
        }

        const selectedAllergies = Array.from(
            document.querySelectorAll('#edit-allergy-options input[name="edit-allergies"]:checked')
        ).map((checkbox) => checkbox.value);

        const payload = {
            userId,
            title: document.getElementById("edit-title").value.trim(),
            description: document.getElementById("edit-description").value.trim(),
            price: Number(document.getElementById("edit-price").value),
            latitude: 39.365,
            longitude: 21.921,
            quantity: Number(document.getElementById("edit-quantity").value),
            building_name: document.getElementById("edit-building-name").value.trim(),
            room_number: document.getElementById("edit-room-number").value.trim(),
            allergies: selectedAllergies
        };

        const response = await fetch(`http://localhost:3000/api/offers/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        modal.classList.add("hidden");

        if (!response.ok) {
            showNotification(result.message || "Failed to update offer.", "error");
            return;
        }

        showNotification("Offer updated successfully.", "info");
        refreshOffers();
    });

    return modal;
}

function openEditModal(offer) {
    const modal = document.getElementById("edit-offer-modal");
    if (!modal) {
        return;
    }

    document.getElementById("edit-offer-id").value = offer.id;
    document.getElementById("edit-title").value = offer.title || "";
    document.getElementById("edit-description").value = offer.description || "";
    document.getElementById("edit-price").value = offer.price ?? 0;
    document.getElementById("edit-quantity").value = offer.quantity ?? 0;
    document.getElementById("edit-building-name").value = offer.building_name || "";
    document.getElementById("edit-room-number").value = offer.room_number || "";

    // Prefill the allergy chips based on this offer's current allergens
    const currentAllergens = Array.isArray(offer.allergens) ? offer.allergens : [];
    document.querySelectorAll('#edit-allergy-options input[name="edit-allergies"]').forEach((checkbox) => {
        checkbox.checked = currentAllergens.includes(checkbox.value);
    });

    modal.classList.remove("hidden");
}

async function deleteOffer(offer) {
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification("You need to be logged in to delete an offer.", "error");
        return;
    }

    const confirmed = await showConfirmation(
        `Delete "${offer.title}"? This action cannot be undone.`,
        { title: "Delete Offer", confirmText: "Delete", danger: true }
    );

    if (!confirmed) return;

    try {
        const response = await fetch(`http://localhost:3000/api/offers/${offer.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to delete offer.");
        }

        showNotification("Offer deleted successfully.", "info");
        refreshOffers();
    } catch (error) {
        console.error(error);
        showNotification(error.message || "Failed to delete offer.", "error");
    }
}

function createClaimedOfferCard(offer, onRate) {
    const article = document.createElement("article");
    article.className = "claimed-offer-card";

    const status = String(offer.status || "PENDING").toUpperCase();
    const isAccepted = status === "ACCEPTED";
    const wasMissed = String(offer.state_of_delivery || "").toUpperCase() === "MISSED";
    const ratingScore = Number(offer.rating_score || 0);
    const isRated = ratingScore >= 1 && ratingScore <= 5;

    article.innerHTML = `
        <div class="claimed-offer-top">
            <h3>${offer.title || "Offer"}</h3>
            <span class="claim-status ${wasMissed ? "missed" : status.toLowerCase()}">${wasMissed ? "NOT PICKED UP" : status}</span>
        </div>

        <div class="claimed-offer-meta">
            <span>By ${offer.creator_name || "creator"}</span>
            <span>${offer.claimed_portions || 1} portion(s)</span>
        </div>

        <p>${offer.description || "No description."}</p>

        <div class="claimed-offer-meta">
            <span>${offer.building || "Campus"}</span>
            <span>Room ${offer.room || "TBA"}</span>
        </div>

        ${isAccepted && !wasMissed && isRated ? `
            <div class="claim-rating-row saved-rating" aria-label="Your rating: ${ratingScore} out of 5 stars">
                <span>Your rating</span>
                <span class="rating-stars" aria-hidden="true">
                    ${[1, 2, 3, 4, 5].map((star) => `<span class="rating-star-display ${star <= ratingScore ? "highlighted" : ""}">★</span>`).join("")}
                </span>
            </div>
        ` : isAccepted && !wasMissed ? `
            <div class="claim-rating-row">
                <span>Rate creator</span>
                ${[1, 2, 3, 4, 5].map((star) => `<button type="button" class="rating-star" data-score="${star}">★</button>`).join("")}
            </div>
        ` : ""}
    `;

    if (isAccepted) {
        article.querySelectorAll(".rating-star").forEach((button) => {
            button.addEventListener("click", () => onRate(offer, Number(button.dataset.score)));
        });
    }

    return article;
}

async function refreshClaimedOffers() {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
        document.querySelector("#claimed-offers-grid").innerHTML = '<p class="empty-state">Log in to see your claimed offers.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/users/${currentUserId}/claimed-offers`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Failed to load claimed offers");
        }

        const claimedOffers = await response.json();
        const container = document.querySelector("#claimed-offers-grid");

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!claimedOffers.length) {
            container.innerHTML = '<p class="empty-state">You have not claimed any offers yet.</p>';
            return;
        }

        claimedOffers.forEach((offer) => {
            const card = createClaimedOfferCard(offer, (selectedOffer, score) => {
                rateClaim(selectedOffer, { request_id: selectedOffer.request_id }, score);
            });
            container.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        const container = document.querySelector("#claimed-offers-grid");
        if (container) {
            container.innerHTML = '<p class="empty-state">Unable to load your claimed offers.</p>';
        }
    }
}

async function refreshOffers() {
    const offers = await loadUserOffers();
    displayUserOffers(offers, {
        onEdit: openEditModal,
        onDelete: deleteOffer,
        onAcceptClaim: acceptClaim,
        onRejectClaim: rejectClaim,
        onMissedClaim: markClaimMissed,
        onRateClaim: rateClaim
    });
}

async function markClaimMissed(offer, claim) {
    const userId = getCurrentUserId();
    if (!userId || !claim?.request_id) {
        showNotification("No claim selected.", "error");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/offers/${offer.id}/claims/${claim.request_id}/missed`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to mark claim as missed.");
        }

        showNotification("Claim marked as not picked up.", "info");
        refreshOffers();
    } catch (error) {
        console.error(error);
        showNotification(error.message || "Unable to mark claim as missed.", "error");
    }
}

async function acceptClaim(offer, claim) {
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification("You need to be logged in to accept a claim.", "error");
        return;
    }

    if (!claim?.request_id) {
        showNotification("No claim selected.", "error");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/offers/${offer.id}/claims/${claim.request_id}/accept`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to accept claim.");
        }

        showNotification("Claim accepted.", "info");
        refreshOffers();
    } catch (error) {
        console.error(error);
        showNotification(error.message || "Unable to accept claim.", "error");
    }
}

async function rejectClaim(offer, claim) {
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification("You need to be logged in to reject a claim.", "error");
        return;
    }

    if (!claim?.request_id) {
        showNotification("No claim selected.", "error");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/offers/${offer.id}/claims/${claim.request_id}/reject`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to reject claim.");
        }

        showNotification("Claim rejected.", "info");
        refreshOffers();
    } catch (error) {
        console.error(error);
        showNotification(error.message || "Unable to reject claim.", "error");
    }
}

async function rateClaim(offer, claim, score) {
    const userId = getCurrentUserId();
    if (!userId) {
        showNotification("You need to be logged in to rate a claim.", "error");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/requests/${claim.request_id}/rate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ raterId: userId, score, comment: "" })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to rate claim.");
        }

        showNotification("Thanks for rating this exchange.", "info");
        await Promise.all([refreshOffers(), refreshClaimedOffers()]);
    } catch (error) {
        console.error(error);
        showNotification(error.message || "Unable to rate claim.", "error");
    }
}

// Add create offer button click event listener
function addCreateOfferButtonListener() {
    const createOfferButton = document.getElementById("create-offer-button");

    if (!createOfferButton) {
        console.error("Create offer button not found.");
        return;
    }

    createOfferButton.addEventListener("click", () => {
        window.location.href = "../offers/createOffer.html";
    });
}

async function init() {
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.appendChild(createNavbar());

    createEditModal();
    addCreateOfferButtonListener();
    refreshOffers();
    refreshClaimedOffers();
}

init();
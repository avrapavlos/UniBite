import { createNavbar } from "../../../components/Navbar/Navbar.js";
import { loadUserOffers } from "../../dataLoaders/userOffers.js";
import { displayUserOffers } from "../../renderers/offersRenderer.js";

function getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
    return user?.id ?? null;
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

        const payload = {
            userId,
            title: document.getElementById("edit-title").value.trim(),
            description: document.getElementById("edit-description").value.trim(),
            price: Number(document.getElementById("edit-price").value),
            latitude: 39.365,
            longitude: 21.921,
            quantity: Number(document.getElementById("edit-quantity").value),
            building_name: document.getElementById("edit-building-name").value.trim(),
            room_number: document.getElementById("edit-room-number").value.trim()
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
            alert(result.message || "Failed to update offer.");
            return;
        }

        alert("Offer updated successfully.");
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

    modal.classList.remove("hidden");
}

async function deleteOffer(offer) {
    const userId = getCurrentUserId();
    if (!userId) {
        alert("You need to be logged in to delete an offer.");
        return;
    }

    const confirmed = window.confirm(`Delete \"${offer.title}\"? This action cannot be undone.`);
    if (!confirmed) {
        return;
    }

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

        alert("Offer deleted successfully.");
        refreshOffers();
    } catch (error) {
        console.error(error);
        alert(error.message || "Failed to delete offer.");
    }
}

function createClaimedOfferCard(offer, onRate) {
    const article = document.createElement("article");
    article.className = "claimed-offer-card";

    const status = String(offer.status || "PENDING").toUpperCase();
    const isAccepted = status === "ACCEPTED";
    const isRated = false;

    article.innerHTML = `
        <div class="claimed-offer-top">
            <h3>${offer.title || "Offer"}</h3>
            <span class="claim-status ${status.toLowerCase()}">${status}</span>
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

        ${isAccepted ? `
            <div class="claim-rating-row">
                <span>Rate creator</span>
                ${[1,2,3,4,5].map((star) => `<button type="button" class="rating-star" data-score="${star}">★</button>`).join("")}
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
        onRateClaim: rateClaim
    });
}

async function acceptClaim(offer, claim) {
    const userId = getCurrentUserId();
    if (!userId) {
        alert("You need to be logged in to accept a claim.");
        return;
    }

    if (!claim?.request_id) {
        alert("No claim selected.");
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

        alert("Claim accepted.");
        refreshOffers();
    } catch (error) {
        console.error(error);
        alert(error.message || "Unable to accept claim.");
    }
}

async function rejectClaim(offer, claim) {
    const userId = getCurrentUserId();
    if (!userId) {
        alert("You need to be logged in to reject a claim.");
        return;
    }

    if (!claim?.request_id) {
        alert("No claim selected.");
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

        alert("Claim rejected.");
        refreshOffers();
    } catch (error) {
        console.error(error);
        alert(error.message || "Unable to reject claim.");
    }
}

async function rateClaim(offer, claim, score) {
    const userId = getCurrentUserId();
    if (!userId) {
        alert("You need to be logged in to rate a claim.");
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

        const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "null");
        if (storedUser && Number(storedUser.id) === Number(userId)) {
            const updatedUser = {
                ...storedUser,
                points: Number(storedUser.points || 0) + Number(score) * 5
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            sessionStorage.setItem("user", JSON.stringify(updatedUser));
        }

        alert("Thanks for rating this exchange.");
        refreshOffers();
    } catch (error) {
        console.error(error);
        alert(error.message || "Unable to rate claim.");
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

async function init(){
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.appendChild(createNavbar());

    createEditModal();
    addCreateOfferButtonListener();
    refreshOffers();
    refreshClaimedOffers();
}

init();
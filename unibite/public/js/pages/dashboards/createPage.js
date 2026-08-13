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

async function refreshOffers() {
    const offers = await loadUserOffers();
    displayUserOffers(offers, {
        onEdit: openEditModal,
        onDelete: deleteOffer
    });
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
}

init();
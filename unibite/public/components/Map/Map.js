let map;
let offerMarkers = [];
let offerClusterGroup = null;
let userMarker = null;

function createPinIcon(fillColor, strokeColor) {
    return L.divIcon({
        className: "custom-pin-icon",
        html: `
            <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 0C6.7 0 0 6.7 0 15c0 11 15 27 15 27s15-16 15-27C30 6.7 23.3 0 15 0z"
                    fill="${fillColor}" stroke="${strokeColor}" stroke-width="1.5" />
                <circle cx="15" cy="15" r="6" fill="white" />
            </svg>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -36]
    });
}

const offerIcon = createPinIcon("#4CAF50", "#2E7D32");
const userIcon = createPinIcon("#e53935", "#b71c1c");


export function createMap(userLocation = [39.365, 21.921]) {

    map = L.map("offer-map").setView(
        userLocation,
        14
    );


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);

    userMarker = L.marker(userLocation, { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup("You are here");

    offerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 40,
        iconCreateFunction: (cluster) => L.divIcon({
            html: `<div class="offer-cluster-badge">${cluster.getChildCount()}</div>`,
            className: "custom-pin-icon",
            iconSize: [34, 34]
        })
    });
    map.addLayer(offerClusterGroup);

}

export function addOfferMarkers(offers, onClick) {

    clearOfferMarkers();

    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

    offers.forEach(offer => {

        if (currentUserId !== null && offer.creator_id === currentUserId) {
            // If the offer belongs to the current user, do not create a marker
            return;
        }

        const lat = Number(offer.latitude);
        const lng = Number(offer.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            console.warn("Skipping offer with invalid coordinates:", offer);
            return;
        }

        const marker = L.marker([lat, lng], { icon: offerIcon });


        offerClusterGroup.addLayer(marker);
        offerMarkers.push(marker);


        marker.bindPopup(`
            <div class="food-popup">
                <img class="food-popup-image"
                    src="${offer.image ? `/uploads/${offer.image}` : '/images/default-food.png'}"
                    alt="${offer.title}">

                <div class="food-popup-content">
                    <h3>${offer.title}</h3>

                    <div class="food-popup-content-details">
                        <div class="food-popup-portions">
                            🍽 <span>${offer.quantity}</span> Portions
                        </div>

                        <div class="food-popup-points">
                            ⭐ <span>${offer.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        `);

        marker.on("popupopen", (e) => {

            const popup = e.popup.getElement();


            popup.addEventListener("click", () => {

                onClick(offer);

            });

        });
    });




}

export function clearOfferMarkers() {
    if (offerClusterGroup) {
        offerClusterGroup.clearLayers();
    }
    offerMarkers = [];
}

export function updateUserLocation(lat, lng) {
    if (!map) return;

    const latlng = [lat, lng];

    if (userMarker) {
        userMarker.setLatLng(latlng);
    } else {
        userMarker = L.marker(latlng, { icon: userIcon, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup("You are here");
    }

    map.setView(latlng, map.getZoom());
}

export function getMap() {
    return map;
}
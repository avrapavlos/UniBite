let map;


export function createMap() {

    map = L.map("offer-map").setView(
        [39.365, 21.921],
        14
    );


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


}

export function addOfferMarkers(offers, onClick) {

    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser).id : null;

    offers.forEach(offer => {

        if (currentUserId !== null && offer.creator_id === currentUserId) {
            // If the offer belongs to the current user, do not create a marker
            return;
        }
        const marker = L.marker([
            offer.latitude,
            offer.longitude
        ]);


        marker.addTo(map);


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

export function getMap() {
    return map;
}
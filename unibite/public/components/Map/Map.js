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


    offers.forEach(offer => {


        const marker = L.marker([
            offer.location.lat,
            offer.location.lng
        ]);


        marker.addTo(map);


        marker.bindPopup(`
            <div class="food-popup">
                <img class="food-popup-image"
                    src="${offer.image}"
                    alt="${offer.title}">

                <div class="food-popup-content">
                    <!-- Title for the popup --> 
                    <h3>${offer.title}</h3>

                    <!-- Portions and points -->
                    <div class="food-popup-content-details">
                        <div class="food-popup-portions">
                            🍽 <span>${offer.portions}</span> Portions
                        </div>

                        <div class="food-popup-points">
                            ⭐ <span>${offer.pointCost}</span>
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
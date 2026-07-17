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

export function addOfferMarkers(offers) {


    offers.forEach(offer => {


        const marker = L.marker([
            offer.location.lat,
            offer.location.lng
        ]);


        marker.addTo(map);


        marker.bindPopup(`

            <h3>${offer.title}</h3>

            <p>${offer.description}</p>

            <p>
            Portions:
            ${offer.portions}
            </p>

        `);


    });


}

export function getMap(){
    return map;
}
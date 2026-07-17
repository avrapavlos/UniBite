let offers = [];


fetch("../../data/offers.json")
.then(response => response.json())
.then(data => {

    offers = data;

    displayOffers(offers);
});

function displayOffers(data){

    const container = document.querySelector(".offer-list");

    container.innerHTML = "";


    data.forEach(offer => {


        const card = document.createElement("article");

        card.classList.add("offer-card");


        // αν δεν υπάρχουν μερίδες
        if(offer.portions === 0){
            card.classList.add("empty");
        }


        card.innerHTML = `
            <img src="${offer.image}" alt="${offer.title}">
            <h2>${offer.title}</h2>
            <p>${offer.description}</p>
            <p>
                Μερίδες: ${offer.portions}
            </p>
        `;


        container.appendChild(card);

    });

}
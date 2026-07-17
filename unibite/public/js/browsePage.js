import { loadOffers } from "./offers.js";
import { loadNavbar } from "./components.js";
import { getMap, createMap, addOfferMarkers } from "../components/Map/Map.js";

// CLick event listener for the filter button
function setFilterListener() {
    const button = document.querySelector(".filter-button");
    const menu = document.querySelector(".filter-menu");


    button.addEventListener("click", () => {

        menu.classList.toggle("active");

    });
}


function setViewToggle() {
    const listButton = document.getElementById("list-view-btn");
    const mapButton = document.getElementById("map-view-btn");

    const listView = document.getElementById("offer-list");
    const mapView = document.getElementById("offer-map");

    listButton.addEventListener("click", () => {
        listButton.classList.add("active");
        mapButton.classList.remove("active");

        listView.style.display = "block";
        mapView.style.display = "none";
    })

    mapButton.addEventListener("click", () => {
        mapButton.classList.add("active");
        listButton.classList.remove("active");

        listView.style.display = "none";
        mapView.style.display = "block";

        const map = getMap();

        setTimeout(() => {
            map.invalidateSize();
        }, 100)
    })
}
async function  init() {
    await loadNavbar();

    const offers = await loadOffers();
    
    createMap();

    addOfferMarkers(offers);

    setFilterListener();
    setViewToggle();
}

init();

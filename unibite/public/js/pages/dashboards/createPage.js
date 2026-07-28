import { createNavbar } from "../../../components/Navbar/Navbar.js";

async function init(){
    //Load navbar
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.appendChild(createNavbar());
}

init();
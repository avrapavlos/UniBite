import { setUpNavbar } from "../components/Navbar/Navbar.js";


export async function loadNavbar() {

  try {

    const response = await fetch(
      "../../components/Navbar/Navbar.html"
    );


    if (!response.ok) {

      throw new Error("Navbar failed to load");

    }


    const data = await response.text();


    document.getElementById("navbar-container").innerHTML = data;



    // Load Navbar CSS

    const link = document.createElement("link");

    link.rel = "stylesheet";

    link.href = "../../components/Navbar/Navbar.css";

    document.head.appendChild(link);



    // Setup navbar functionality

    setUpNavbar();


  } catch (error) {

    console.error(error);

  }

}
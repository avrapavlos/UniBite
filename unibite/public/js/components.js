// Navbar loading for browse and create
import { setUpNavbar } from '../components/Navbar/Navbar.js';

fetch("../../components/Navbar/Navbar.html")
  .then(response => {
    if (!response.ok) {
      throw new Error("Navbar failed to load");
    }
    return response.text();
  })
  .then(data => {
    document.getElementById("navbar-container").innerHTML = data;
    
    // Load Css
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../components/Navbar/Navbar.css";
    document.head.appendChild(link);
    
    // Set up the toggle active
    setUpNavbar();
  })
  .catch(error => console.error(error));
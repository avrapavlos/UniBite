// Navbar loading 
fetch('../components/navbar.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;
    
    //Navbar functionality
    setupNavbar();
})
  .catch(error => {
    console.error('Error loading navbar:', error);
  });

function setupNavbar() {
    // Get the Hamburger menu and navigation links
    const hamburger = document.getElementById("hamburger");
    const navLink = document.getElementById("navLinks");    

    // Add event listener to the hamburger menu
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLink.classList.toggle("active");
        });
    }
}
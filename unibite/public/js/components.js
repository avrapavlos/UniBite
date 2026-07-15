// Navbar loading 
fetch('/components/navbar.html')
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
    const hamburger = document.getElementById("hamburger");
    const navLink = document.getElementById("navLinks");    

    if (hamburger) {
        
    }
}
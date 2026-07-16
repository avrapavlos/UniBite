// Script to open and close the navbar menu on mobile devices
export function setUpNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        console.log('Hamburger clicked');
        navLinks.classList.toggle('active');
    });
}
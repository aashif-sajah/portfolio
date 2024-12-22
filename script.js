let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

let sections = document.querySelectorAll('section'); // Fixed the selector
let navLinks = document.querySelectorAll('header nav a');

// Toggle menu for mobile view
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

// Scroll behavior for nav links
window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
            });

            // Safely add active class
            let currentLink = document.querySelector(`header nav a[href*="${id}"]`);
            if (currentLink) {
                currentLink.classList.add('active');
            }
        }
    });
};

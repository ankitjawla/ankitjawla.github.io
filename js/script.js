// Main JavaScript file for Ankit Kumar Jawla's Resume Website

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });
    
    // Contact form submission handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, this would send data to a server
            // For now, we'll just show a success message
            
            // Create success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <h3>Thank you for your message, ${name}!</h3>
                <p>I'll get back to you as soon as possible.</p>
            `;
            
            // Replace form with success message
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
            
            // Style the success message
            successMessage.style.textAlign = 'center';
            successMessage.style.padding = '20px';
            successMessage.style.color = '#2c3e50';
        });
    }
    
    // Add animation to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to handle scroll animation
    function handleScrollAnimation() {
        timelineItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('animate');
            }
        });
    }
    
    // Add animation class to timeline items when they come into view
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Initial check for elements in viewport
    handleScrollAnimation();
    
    // Add skill bar animation
    const skillLists = document.querySelectorAll('.skill-list li');
    
    skillLists.forEach(skill => {
        skill.addEventListener('mouseenter', function() {
            this.classList.add('highlight');
        });
        
        skill.addEventListener('mouseleave', function() {
            this.classList.remove('highlight');
        });
    });
    
    // Add print resume functionality
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Resume';
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Add the print button to the about section
    const aboutSection = document.querySelector('#about .container');
    if (aboutSection) {
        aboutSection.appendChild(printButton);
    }
});

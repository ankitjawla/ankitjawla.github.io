// Main JavaScript file for Ankit Kumar Jawla's Resume Website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize image loading animations
    initImageLoading();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize form handling
    initFormHandling();
    
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
    
    // Timeline animation removed
    
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

    // Initialize theme toggle
    initThemeToggle();

    // Initialize skills matrix
    createSkillsMatrix();
    
    // Initialize smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Smooth scrolling implementation
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Image loading animations
function initImageLoading() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Form handling
function initFormHandling() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateForm(data)) {
                // Show success message
                showFormMessage('Message sent successfully!', 'success');
                form.reset();
            }
        });
    }
}

// Form validation
function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Use module.exports.showFormMessage if available (for testing), otherwise global showFormMessage
    const messageFunc = (typeof module !== 'undefined' && module.exports && module.exports.showFormMessage)
                        ? module.exports.showFormMessage
                        : showFormMessage;

    if (!data.name || data.name.length < 2) {
        messageFunc('Please enter a valid name', 'error');
        return false;
    }
    
    if (!emailRegex.test(data.email)) {
        messageFunc('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!data.message || data.message.length < 10) {
        messageFunc('Please enter a message (minimum 10 characters)', 'error');
        return false;
    }
    
    return true;
}

// Show form message
function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    if (form) { // Check if form exists
        form.appendChild(messageDiv);
    
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    } else {
        // Optionally log an error or handle the case where the form is not found
        // console.error("Contact form not found for showFormMessage");
    }
}

// Update active navigation based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 60) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Theme Switching
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    // Update theme when system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Export functions for testing if module system is available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        showFormMessage
        // Add other functions here if they need to be tested and are suitable for unit tests
        // For now, only exporting validateForm and showFormMessage as per requirements.
    };
}

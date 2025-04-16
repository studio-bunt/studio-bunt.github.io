// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // Nav menu toggle for mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Scroll detection for header styling
    const header = document.querySelector('header');
    
    // Smooth scrolling for nav links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    // Mobile Navigation Toggle
    function toggleNav() {
        // Toggle nav
        nav.classList.toggle('nav-active');
        
        // Animate links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger animation
        burger.classList.toggle('toggle');
    }
    
    if (burger) {
        burger.addEventListener('click', toggleNav);
    }
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                toggleNav();
            }
        });
    });
    
    // Custom cursor movement
    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.top = e.clientY + 'px';
            cursor.style.left = e.clientX + 'px';
            
            cursorFollower.style.top = e.clientY + 'px';
            cursorFollower.style.left = e.clientX + 'px';
        });
        
        // Hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .art-item, .news-item');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorFollower.style.borderColor = 'transparent';
                cursor.style.backgroundColor = 'rgba(240, 98, 146, 0.8)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorFollower.style.borderColor = '#f06292';
                cursor.style.backgroundColor = 'rgba(240, 98, 146, 0.5)';
            });
        });
        
        // Fix cursor disappearing when leaving the viewport
        document.addEventListener('mouseout', () => {
            cursor.style.display = 'none';
            cursorFollower.style.display = 'none';
        });
        
        document.addEventListener('mouseover', () => {
            cursor.style.display = 'block';
            cursorFollower.style.display = 'block';
        });
    }
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const topOffset = targetElement.getBoundingClientRect().top + window.scrollY;
                const headerHeight = header.offsetHeight;
                
                window.scrollTo({
                    top: topOffset - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.gallery-grid > div, .news-item, .about-content p, .section-title');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // Add CSS class for animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            animation: fadeIn 1s ease forwards;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .toggle .line2 {
            opacity: 0;
        }
        
        .toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);
    
    // Initialize scroll animation
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you would normally send the form data to your server
            // For now, we'll just show a success message
            const formElements = contactForm.elements;
            const formData = {};
            
            for (let i = 0; i < formElements.length; i++) {
                const element = formElements[i];
                if (element.name) {
                    formData[element.name] = element.value;
                }
            }
            
            // Reset the form
            contactForm.reset();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
            successMessage.style.color = '#28a745';
            successMessage.style.marginTop = '1rem';
            successMessage.style.fontWeight = 'bold';
            
            contactForm.appendChild(successMessage);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Similar to contact form
            newsletterForm.reset();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for subscribing to our newsletter!';
            successMessage.style.color = 'white';
            successMessage.style.marginTop = '1rem';
            successMessage.style.fontWeight = 'bold';
            
            newsletterForm.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }
});
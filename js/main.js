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
            cursorFollower.style
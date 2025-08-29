// DOM Content Loaded resume-section-item
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeCarousel();
    initializeScrollAnimations();
    initializeFormSubmission();
    initializeSmoothScrolling();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Carousel functionality
function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;

    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        // Reset animations for slide text
        const slideText = slides[index].querySelector('.slide-text');
        const h1 = slideText.querySelector('h1');
        const p = slideText.querySelector('p');
        const buttons = slideText.querySelector('.slide-buttons');

        // Reset animations
        [h1, p, buttons].forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = null;
        });
    }

    // Function to go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto advance slides
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    // Stop slideshow
    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlideshow();
            startSlideshow(); // Restart timer
        });
    });

    // Pause on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopSlideshow);
    carouselContainer.addEventListener('mouseleave', startSlideshow);

    // Start the slideshow
    startSlideshow();

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
            showSlide(currentSlide);
            stopSlideshow();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        }
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements and observe them
    const animateElements = [
        '.service-card',
        '.course-card',
        '.product-category',
        '.contact-item',
        '.about-text',
        '.about-image',
        '.stat'
    ];

    animateElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('fade-in');
            element.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(element);
        });
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation function
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/\d/g, '');
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 50);
}

// Form submission
function initializeFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
    `;

    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        updateActiveNavLink(currentSection);
    });
}

// Update active navigation link
function updateActiveNavLink(activeSection) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${activeSection}`) {
            link.classList.add('active');
        }
    });
}

// Service card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Product category click handlers
document.addEventListener('DOMContentLoaded', function() {
    const productCategories = document.querySelectorAll('.product-category');
    
    productCategories.forEach(category => {
        category.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            showNotification(`Interested in ${categoryName}? please contact for more info!`, 'info');
        });
    });
});

// Course card interactions
document.addEventListener('DOMContentLoaded', function() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('click', function() {
            const courseName = this.querySelector('h3').textContent;
            showNotification(`Interested in ${courseName}? please contact for more info!`, 'info');
        });
        
        card.style.cursor = 'pointer';
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.slide-bg');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Form validation
function initializeFormValidation() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearError(e);
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = 'var(--error-color)';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: var(--error-color);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: block;
        `;
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearError(e) {
    const field = e.target;
    field.style.borderColor = 'var(--border-color)';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFormValidation);

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add any loading completion effects here
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
    }
});

// Handle resize events
window.addEventListener('resize', function() {
    // Close mobile menu on resize
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Prevent form submission on Enter key in input fields (except textarea)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
        e.preventDefault();
        
        // Move to next input field
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        const currentIndex = inputs.indexOf(e.target);
        
        if (currentIndex > -1 && currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].focus();
        }
    }
});

// Touch gestures for mobile carousel
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const carousel = document.querySelector('.carousel-container');
    
    if (!carousel.contains(document.elementFromPoint(touchStartX, 100))) {
        return;
    }
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        const nextBtn = document.querySelector('.carousel-next');
        if (nextBtn) nextBtn.click();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        const prevBtn = document.querySelector('.carousel-prev');
        if (prevBtn) prevBtn.click();
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent || 'Button');
        }
    });
    
    // Add focus visible class for better keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Performance optimization - debounced scroll handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Replace scroll handlers with debounced versions for better performance
const debouncedScrollHandler = debounce(() => {
    // Your scroll-dependent code here
    updateScrollProgress();
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Scroll progress indicator
function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / scrollable) * 100;
    
    // Update progress bar if it exists
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
}

{/* scroll to top */}
document.addEventListener("DOMContentLoaded", () => {
    const scrollBtn = document.getElementById("scroll-to-top-btn");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});



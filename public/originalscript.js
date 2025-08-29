// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initCarousel();
    initFormValidation();
    initPasswordToggles();
});

// Navigation Functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link (mobile)
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Carousel Functionality
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current slide and activate indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    // Add click events to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
            stopCarousel();
            startCarousel(); // Restart the timer
        });
    });

    // Pause carousel on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopCarousel);
    carouselContainer.addEventListener('mouseleave', startCarousel);

    // Start the carousel
    startCarousel();
}

// Password Toggle Functionality
function initPasswordToggles() {
    const passwordToggle = document.getElementById('passwordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    passwordToggle.addEventListener('click', function() {
        togglePasswordVisibility(passwordInput, passwordToggle);
    });

    confirmPasswordToggle.addEventListener('click', function() {
        togglePasswordVisibility(confirmPasswordInput, confirmPasswordToggle);
    });
}

function togglePasswordVisibility(input, toggle) {
    const icon = toggle.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required]');

    // Add real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(input);
        });
        
        input.addEventListener('input', function() {
            clearError(input);
        });
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            handleFormSubmission();
        }
    });
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous validation state
    clearError(field);

    switch (fieldName) {
        case 'fullName':
            if (value.length < 2) {
                errorMessage = 'Full name must be at least 2 characters long';
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                errorMessage = 'Full name should only contain letters and spaces';
                isValid = false;
            }
            break;

        case 'contact':
            if (!/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
                errorMessage = 'Please enter a valid contact number';
                isValid = false;
            }
            break;

        case 'email':
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'password':
            if (value.length < 8) {
                errorMessage = 'Password must be at least 8 characters long';
                isValid = false;
            } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                isValid = false;
            }
            break;

        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (value !== password) {
                errorMessage = 'Passwords do not match';
                isValid = false;
            }
            break;

        case 'terms':
            if (!field.checked) {
                errorMessage = 'You must agree to the terms and conditions';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showError(field, errorMessage);
    } else {
        showSuccess(field);
    }

    return isValid;
}

function validateForm() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input[required]');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function showError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function showSuccess(field) {
    const formGroup = field.closest('.form-group');
    
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
}

function clearError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error', 'success');
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Form Submission Handler
function handleFormSubmission() {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessModal();
        
        // Reset form
        document.getElementById('registrationForm').reset();
        
        // Clear all validation states
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        });
        
    }, 2000);
}

function showSuccessModal() {
    // Create and show a simple success modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            max-width: 400px;
            margin: 1rem;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
            animation: slideIn 0.3s ease;
        ">
            <div style="
                width: 60px;
                height: 60px;
                background: #10b981;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
                color: white;
                font-size: 1.5rem;
            ">
                <i class="fas fa-check"></i>
            </div>
            <h3 style="color: #1f2937; margin-bottom: 0.5rem;">Registration Successful!</h3>
            <p style="color: #6b7280; margin-bottom: 1.5rem;">
                Welcome to Mackachila Computer College! Check your email for further instructions.
            </p>
            <button onclick="this.closest('.modal').remove()" style="
                background: #6366f1;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='#6366f1'">
                Continue
            </button>
        </div>
    `;
    
    modal.classList.add('modal');
    document.body.appendChild(modal);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: translateY(-20px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 5000);
}

// Smooth scrolling for anchor links
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

// Add loading animation to page
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Add fade-in animation to main elements
    const animatedElements = document.querySelectorAll('.form-container, .carousel-container');
    animatedElements.forEach(element => {
        element.classList.add('fade-in-up');
    });
});

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }, 250);
});

// // Add scroll effect to navbar
// let lastScrollTop = 0;
// window.addEventListener('scroll', function() {
//     const navbar = document.querySelector('.navbar');
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
//     if (scrollTop > lastScrollTop && scrollTop > 100) {
//         // Scrolling down
//         navbar.style.transform = 'translateY(-100%)';
//     } else {
//         // Scrolling up
//         navbar.style.transform = 'translateY(0)';
//     }
    
//     lastScrollTop = scrollTop;
// });
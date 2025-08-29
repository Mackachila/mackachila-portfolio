
// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');

    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show corresponding content section
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Unit registration functionality
    const unitCheckboxes = document.querySelectorAll('.unit-checkbox');
    const selectedCountSpan = document.getElementById('selectedCount');
    const totalCreditsSpan = document.getElementById('totalCredits');

    // Unit credits mapping
    const unitCredits = {
        'unit1': 3,
        'unit2': 4,
        'unit3': 3
    };

    function updateRegistrationSummary() {
        let selectedCount = 0;
        let totalCredits = 0;

        unitCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCount++;
                totalCredits += unitCredits[checkbox.id] || 0;
            }
        });

        if (selectedCountSpan) selectedCountSpan.textContent = selectedCount;
        if (totalCreditsSpan) totalCreditsSpan.textContent = totalCredits;
    }

    unitCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateRegistrationSummary);
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const courseCards = document.querySelectorAll('.course-card');

            courseCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Course filter functionality
    const filterSelect = document.querySelector('.filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            const selectedCategory = this.value.toLowerCase();
            const courseCards = document.querySelectorAll('.course-card');

            courseCards.forEach(card => {
                if (selectedCategory === 'all categories') {
                    card.style.display = 'block';
                } else {
                    const title = card.querySelector('h4').textContent.toLowerCase();
                    if (title.includes(selectedCategory.replace(' development', '')) || 
                        title.includes(selectedCategory.replace(' ', ''))) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    }

    // Smooth animations for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards for animation
    const cards = document.querySelectorAll('.stat-card, .course-card, .dashboard-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // // Form validation
    // const forms = document.querySelectorAll('form');
    // forms.forEach(form => {
    //     form.addEventListener('submit', function(e) {
    //         e.preventDefault();
            
    //         // Basic form validation
    //         const inputs = form.querySelectorAll('input[required], select[required]');
    //         let isValid = true;

    //         inputs.forEach(input => {
    //             if (!input.value.trim()) {
    //                 isValid = false;
    //                 input.style.borderColor = 'var(--error-color)';
    //             } else {
    //                 input.style.borderColor = 'var(--border-color)';
    //             }
    //         });

    //         if (isValid) {
    //             // Show success message (replace with actual form submission)
    //             alert('Form submitted successfully!');
    //         } else {
    //             alert('Please fill in all required fields.');
    //         }
    //     });
    // });

    // Enrollment buttons
    const enrollButtons = document.querySelectorAll('.course-card .btn-primary');
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const courseTitle = this.closest('.course-card').querySelector('h4').textContent;
            
            // Simulate enrollment process
            this.textContent = 'Enrolling...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Enrolled';
                this.style.background = 'var(--success-color)';
                alert(`Successfully enrolled in ${courseTitle}!`);
            }, 2000);
        });
    });

    // // Payment form handling
    // const paymentForm = document.querySelector('.payment-form form');
    // if (paymentForm) {
    //     paymentForm.addEventListener('submit', function(e) {
    //         e.preventDefault();
            
    //         const submitBtn = this.querySelector('.btn-primary');
    //         const originalText = submitBtn.textContent;
            
    //         submitBtn.textContent = 'Processing...';
    //         submitBtn.disabled = true;
            
    //         setTimeout(() => {
    //             submitBtn.textContent = 'Payment Successful';
    //             submitBtn.style.background = 'var(--success-color)';
    //             alert('Payment processed successfully!');
                
    //             setTimeout(() => {
    //                 submitBtn.textContent = originalText;
    //                 submitBtn.disabled = false;
    //                 submitBtn.style.background = 'var(--primary-color)';
    //             }, 3000);
    //         }, 3000);
    //     });
    // }

    // Unit registration form handling Form submitted successfully!
    const registrationBtn = document.querySelector('.registration-summary .btn-primary');
    if (registrationBtn) {
        registrationBtn.addEventListener('click', function() {
            const selectedUnits = document.querySelectorAll('.unit-checkbox:checked');
            
            if (selectedUnits.length === 0) {
                alert('Please select at least one unit to register.');
                return;
            }
            
            this.textContent = 'Registering...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Registration Complete';
                this.style.background = 'var(--success-color)';
                alert(`Successfully registered for ${selectedUnits.length} units!`);
                
                // Reset checkboxes
                selectedUnits.forEach(checkbox => {
                    checkbox.checked = false;
                });
                updateRegistrationSummary();
                
                setTimeout(() => {
                    this.textContent = 'Register Selected Units';
                    this.disabled = false;
                    this.style.background = 'var(--primary-color)';
                }, 3000);
            }, 2000);
        });
    }

    // Responsive handling
    function handleResize() {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
        }
    }

    window.addEventListener('resize', handleResize);

    // Initialize tooltips (if needed)
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Add tooltip functionality if needed
        });
    });

    // Add loading states for better UX
    function addLoadingState(element) {
        element.style.opacity = '0.7';
        element.style.pointerEvents = 'none';
    }

    function removeLoadingState(element) {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
    }

    // Notification system (basic)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            padding: '1rem 1.5rem',
            backgroundColor: type === 'success' ? 'var(--success-color)' : 
                           type === 'error' ? 'var(--error-color)' : 'var(--primary-color)',
            color: 'white',
            borderRadius: '0.75rem',
            boxShadow: 'var(--shadow-lg)',
            zIndex: '1100',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Initialize the application
    console.log('Student Portal initialized successfully!');
});


const toggleBtn = document.querySelector('.dropdown-toggle');
const dropdownMenu = document.querySelector('.profile-dropdown');

toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation(); // prevent the click from triggering document listener
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown-toggle') && !e.target.closest('.profile-dropdown')) {
        dropdownMenu.style.display = 'none';
    }
});


// // Activities
// document.addEventListener('DOMContentLoaded', async () => {
//     const activityList = document.querySelector('.activity-list');

//     function timeAgo(dateString) {
//         const now = new Date();
//         const past = new Date(dateString);
//         const diff = Math.floor((now - past) / 1000); // seconds

//         if (diff < 60) return "just now";
//         if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
//         if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
//         if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
//         return past.toLocaleDateString();
//     }

//     function getIcon(type) {
//         switch(type) {
//             case 'enrollment': return '<i class="fas fa-book text-primary"></i>';
//             case 'completion': return '<i class="fas fa-check-circle text-success"></i>';
//             case 'payment': return '<i class="fas fa-credit-card text-accent"></i>';
//             case 'login': return '<i class="fas fa-sign-in-alt text-info"></i>';
//             case 'profile_update': return '<i class="fas fa-user-edit text-warning"></i>';
//             default: return '<i class="fas fa-info-circle text-secondary"></i>';
//         }
//     }

//     try {
//         const response = await fetch('/student/activities');
//         const activities = await response.json();

//         activityList.innerHTML = ""; // Clear placeholder

//         activities.forEach(activity => {
//             const item = document.createElement('div');
//             item.classList.add('activity-item');

//             item.innerHTML = `
//                 ${getIcon(activity.activity_type)}
//                 <div>
//                     <p>${activity.description}</p>
//                     <span>${timeAgo(activity.created_at)}</span>
//                 </div>
//             `;

//             activityList.appendChild(item);
//         });

//     } catch (err) {
//         console.error('Error fetching activities:', err);
//         activityList.innerHTML = `<p style="color:red;">Failed to load activities.</p>`;
//     }
// });

// Activities
document.addEventListener('DOMContentLoaded', async () => {
    const activityList = document.querySelector('.activity-list');

    function timeAgo(dateString) {
        const now = new Date();
        const past = new Date(dateString);
        const diff = Math.floor((now - past) / 1000); // seconds

        if (diff < 60) return "just now";
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
        return past.toLocaleDateString();
    }

    function getIcon(type) {
        switch(type) {
            case 'enrollment': return '<i class="fas fa-book text-primary" style = "color:green"></i>';
            case 'completion': return '<i class="fas fa-check-circle text-success"  style = "color:green"></i>';
            case 'payment': return '<i class="fas fa-credit-card text-accent" style = "color:green"></i>';
            case 'login': return '<i class="fas fa-sign-in-alt text-info" style = "color:green"></i>';
            case 'profile_update': return '<i class="fas fa-user-edit text-warning" style = "color:green"></i>';
            default: return '<i class="fas fa-info-circle text-secondary" style = "color:green"></i>';
        }
    }

    try {
        const response = await fetch('/student/activities');
        const activities = await response.json();

        activityList.innerHTML = ""; // Clear placeholder

        if (activities.length === 0) {
            activityList.innerHTML = `<p class="no-activity">No recent activity</p>`;
            return;
        }

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.classList.add('activity-item');

            item.innerHTML = `
                ${getIcon(activity.activity_type)}
                <div>
                    <p>${activity.description}</p>
                    <span>${timeAgo(activity.created_at)}</span>
                </div>
            `;

            activityList.appendChild(item);
        });

    } catch (err) {
        console.error('Error fetching activities:', err);
        activityList.innerHTML = `<p style="color:red;">Failed to load activities.</p>`;
    }
});


    
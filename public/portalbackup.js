// Student Portal JavaScript

class StudentPortal {
   constructor() {
    this.studentData = {
        name: 'Mackachila',
        id: 'STU-2024-001',
        program: 'Computer Science',
        email: 'bebosstech@gmail.com',
        phone: '+254704684936',
        semester: 6,
        gpa: 3.8,
        feeBalance: 2500
    };

    this.init();           // ✅ Now safe to use studentData
    this.bindEvents();
}


    init() {
        // Initialize sidebar state
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.modal = document.getElementById('modalOverlay');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        
        // Load student data
        this.loadStudentData();
    }

    bindEvents() {
        // Mobile menu toggle
        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Modal close events
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Navigation links
        document.querySelectorAll('[data-modal]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const modalType = link.getAttribute('data-modal');
                this.openModal(modalType);
            });
        });

        // Logout button
        document.querySelector('.logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !this.sidebar.contains(e.target) && 
                !this.mobileMenuToggle.contains(e.target) &&
                this.sidebar.classList.contains('active')) {
                this.toggleSidebar();
            }
        });
    }

    loadStudentData() {
        document.getElementById('studentName').textContent = this.studentData.name;
        document.getElementById('studentId').textContent = `ID: ${this.studentData.id}`;
        document.getElementById('studentProgram').textContent = this.studentData.program;
        document.getElementById('headerName').textContent = this.studentData.name.split(' ')[0];
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('active');
    }

    openModal(modalType) {
        this.modalTitle.textContent = this.getModalTitle(modalType);
        this.modalBody.innerHTML = this.getModalContent(modalType);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Bind modal-specific events
        this.bindModalEvents(modalType);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    getModalTitle(modalType) {
        const titles = {
            'profile': 'Edit Profile',
            'unit-registration': 'Unit Registration',
            'semester-activation': 'Semester Activation',
            'timetable': 'My Timetable',
            'grades': 'Grades & Results',
            'assignments': 'Assignments',
            'fee-payment': 'Fee Payment',
            'fee-statement': 'Fee Statement',
            'scholarships': 'Scholarships',
            'library': 'Library Services',
            'resources': 'Academic Resources',
            'e-books': 'E-Books',
            'announcements': 'Announcements',
            'messages': 'Messages',
            'support': 'Support Center',
            'settings': 'Settings'
        };
        return titles[modalType] || 'Information';
    }

    getModalContent(modalType) {
        switch(modalType) {
            case 'profile':
                return this.getProfileContent();
            case 'unit-registration':
                return this.getUnitRegistrationContent();
            case 'semester-activation':
                return this.getSemesterActivationContent();
            case 'timetable':
                return this.getTimetableContent();
            case 'grades':
                return this.getGradesContent();
            case 'assignments':
                return this.getAssignmentsContent();
            case 'fee-payment':
                return this.getFeePaymentContent();
            case 'fee-statement':
                return this.getFeeStatementContent();
            case 'scholarships':
                return this.getScholarshipsContent();
            case 'library':
                return this.getLibraryContent();
            case 'resources':
                return this.getResourcesContent();
            case 'e-books':
                return this.getEBooksContent();
            case 'announcements':
                return this.getAnnouncementsContent();
            case 'messages':
                return this.getMessagesContent();
            case 'support':
                return this.getSupportContent();
            case 'settings':
                return this.getSettingsContent();
            default:
                return '<p>Content not available.</p>';
        }
    }

    getProfileContent() {
        return `
            <form id="profileForm">
                <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" value="${this.studentData.name}" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" value="${this.studentData.email}" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" value="${this.studentData.phone}" required>
                </div>
                <div class="form-group">
                    <label for="program">Program</label>
                    <input type="text" id="program" value="${this.studentData.program}" readonly>
                </div>
                <div class="form-group">
                    <label for="studentId">Student ID</label>
                    <input type="text" id="studentId" value="${this.studentData.id}" readonly>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </form>
        `;
    }

    getUnitRegistrationContent() {
        return `
            <div class="mb-3">
                <h4>Available Units for Semester ${this.studentData.semester + 1}</h4>
                <p class="text-secondary">Select units to register for the upcoming semester.</p>
            </div>
            <form id="unitRegistrationForm">
                <div class="form-group">
                    <label>
                        <input type="checkbox" value="CS401" checked> CS 401 - Software Engineering (4 Credits)
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" value="CS402"> CS 402 - Database Systems (3 Credits)
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" value="CS403"> CS 403 - Computer Networks (3 Credits)
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" value="CS404"> CS 404 - Artificial Intelligence (4 Credits)
                    </label>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" value="CS405"> CS 405 - Mobile App Development (3 Credits)
                    </label>
                </div>
                <div class="form-group">
                    <p><strong>Total Credits Selected: <span id="totalCredits">4</span></strong></p>
                    <p class="text-secondary">Maximum: 18 credits per semester</p>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Register Units</button>
                </div>
            </form>
        `;
    }

    getSemesterActivationContent() {
        return `
            <div class="mb-3">
                <h4>Semester Activation</h4>
                <p class="text-secondary">Activate your semester to access course materials and assignments.</p>
            </div>
            <div class="mb-3">
                <div class="stat-card">
                    <div class="stat-content">
                        <h3>Current Semester</h3>
                        <p>Semester ${this.studentData.semester} - Active</p>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <div class="stat-card">
                    <div class="stat-content">
                        <h3>Next Semester</h3>
                        <p>Semester ${this.studentData.semester + 1} - Pending Activation</p>
                    </div>
                </div>
            </div>
            <form id="semesterActivationForm">
                <div class="form-group">
                    <label for="activationCode">Activation Code</label>
                    <input type="text" id="activationCode" placeholder="Enter activation code" required>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Activate Semester</button>
                </div>
            </form>
        `;
    }

    getTimetableContent() {
        return `
            <div class="mb-3">
                <h4>Weekly Timetable - Semester ${this.studentData.semester}</h4>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>8:00 AM</td>
                        <td>CS 301<br><small>Room A101</small></td>
                        <td>-</td>
                        <td>CS 301<br><small>Room A101</small></td>
                        <td>-</td>
                        <td>CS 205<br><small>Room B205</small></td>
                    </tr>
                    <tr>
                        <td>10:00 AM</td>
                        <td>CS 205<br><small>Room B205</small></td>
                        <td>CS 401<br><small>Room C301</small></td>
                        <td>-</td>
                        <td>CS 401<br><small>Room C301</small></td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>2:00 PM</td>
                        <td>-</td>
                        <td>Lab CS 301<br><small>Lab 1</small></td>
                        <td>CS 205<br><small>Room B205</small></td>
                        <td>Lab CS 401<br><small>Lab 2</small></td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
                <button type="button" class="btn btn-primary">Download PDF</button>
            </div>
        `;
    }

    getGradesContent() {
        return `
            <div class="mb-3">
                <h4>Academic Performance</h4>
                <p class="text-secondary">Your grades and academic progress</p>
            </div>
            <div class="mb-3">
                <div class="stat-card">
                    <div class="stat-content">
                        <h3>Current GPA</h3>
                        <p>${this.studentData.gpa}</p>
                    </div>
                </div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Credits</th>
                        <th>Grade</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>CS 301 - Database Design</td>
                        <td>4</td>
                        <td>A</td>
                        <td><span class="badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                        <td>CS 205 - Web Development</td>
                        <td>3</td>
                        <td>A-</td>
                        <td><span class="badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                        <td>CS 401 - Software Engineering</td>
                        <td>4</td>
                        <td>B+</td>
                        <td><span class="badge badge-warning">In Progress</span></td>
                    </tr>
                    <tr>
                        <td>CS 302 - Data Structures</td>
                        <td>3</td>
                        <td>A</td>
                        <td><span class="badge badge-success">Completed</span></td>
                    </tr>
                </tbody>
            </table>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
                <button type="button" class="btn btn-primary">Download Transcript</button>
            </div>
        `;
    }

    getAssignmentsContent() {
        return `
            <div class="mb-3">
                <h4>Current Assignments</h4>
                <p class="text-secondary">Manage your assignments and submissions</p>
            </div>
            <div class="assignment-list">
                <div class="assignment-item">
                    <h5>Database Design Project</h5>
                    <p>CS 301 - Due: July 25, 2025</p>
                    <p class="text-secondary">Create a comprehensive database design for an e-commerce system.</p>
                    <div class="btn-group">
                        <button class="btn btn-secondary">View Details</button>
                        <button class="btn btn-success">Submit</button>
                    </div>
                </div>
                <div class="assignment-item">
                    <h5>Web Application Development</h5>
                    <p>CS 205 - Due: July 30, 2025</p>
                    <p class="text-secondary">Build a responsive web application using modern frameworks.</p>
                    <div class="btn-group">
                        <button class="btn btn-secondary">View Details</button>
                        <button class="btn btn-primary">Start</button>
                    </div>
                </div>
                <div class="assignment-item">
                    <h5>Software Testing Report</h5>
                    <p>CS 401 - Due: August 5, 2025</p>
                    <p class="text-secondary">Analyze and report on software testing methodologies.</p>
                    <div class="btn-group">
                        <button class="btn btn-secondary">View Details</button>
                        <button class="btn btn-primary">Start</button>
                    </div>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
            </div>
        `;
    }

    getFeePaymentContent() {
        return `
            <div class="mb-3">
                <h4>Fee Payment</h4>
                <p class="text-secondary">Pay your semester fees securely</p>
            </div>
            <div class="mb-3">
                <div class="stat-card">
                    <div class="stat-content">
                        <h3>Outstanding Balance</h3>
                        <p>${this.studentData.feeBalance.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            <form id="feePaymentForm">
                <div class="form-group">
                    <label for="paymentAmount">Payment Amount</label>
                    <input type="number" id="paymentAmount" placeholder="Enter amount" min="1" max="${this.studentData.feeBalance}" required>
                </div>
                <div class="form-group">
                    <label for="paymentMethod">Payment Method</label>
                    <select id="paymentMethod" required>
                        <option value="">Select Payment Method</option>
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="mobile-money">Mobile Money</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="paymentNote">Payment Note (Optional)</label>
                    <textarea id="paymentNote" rows="3" placeholder="Add a note for this payment"></textarea>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Proceed to Payment</button>
                </div>
            </form>
        `;
    }

    getFeeStatementContent() {
        return `
            <div class="mb-3">
                <h4>Fee Statement</h4>
                <p class="text-secondary">View your fee history and balance</p>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>July 15, 2025</td>
                        <td>Semester 6 Tuition</td>
                        <td>$5,000</td>
                        <td><span class="badge badge-warning">Pending</span></td>
                    </tr>
                    <tr>
                        <td>July 10, 2025</td>
                        <td>Payment Received</td>
                        <td>-$2,500</td>
                        <td><span class="badge badge-success">Completed</span></td>
                    </tr>
                    <tr>
                        <td>June 20, 2025</td>
                        <td>Lab Fee</td>
                        <td>$300</td>
                        <td><span class="badge badge-success">Paid</span></td>
                    </tr>
                    <tr>
                        <td>June 15, 2025</td>
                        <td>Library Fee</td>
                        <td>$200</td>
                        <td><span class="badge badge-success">Paid</span></td>
                    </tr>
                </tbody>
            </table>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
                <button type="button" class="btn btn-primary">Download Statement</button>
            </div>
        `;
    }

    getScholarshipsContent() {
        return `
            <div class="mb-3">
                <h4>Scholarships & Financial Aid</h4>
                <p class="text-secondary">Available scholarships and your applications</p>
            </div>
            <div class="scholarship-list">
                <div class="scholarship-item">
                    <h5>Academic Excellence Scholarship</h5>
                    <p>Merit-based scholarship for high-achieving students</p>
                    <p><strong>Award:</strong> $3,000 per semester</p>
                    <p><strong>Eligibility:</strong> GPA 3.5 or higher</p>
                    <p><strong>Status:</strong> <span class="badge badge-success">Eligible</span></p>
                    <button class="btn btn-primary">Apply Now</button>
                </div>
                <div class="scholarship-item">
                    <h5>Need-Based Financial Aid</h5>
                    <p>Financial assistance for students demonstrating financial need</p>
                    <p><strong>Award:</strong> Up to $5,000 per semester</p>
                    <p><strong>Status:</strong> <span class="badge badge-warning">Application Pending</span></p>
                    <button class="btn btn-secondary">View Status</button>
                </div>
                <div class="scholarship-item">
                    <h5>Technology Innovation Grant</h5>
                    <p>For students working on innovative technology projects</p>
                    <p><strong>Award:</strong> $2,000 per project</p>
                    <p><strong>Deadline:</strong> August 15, 2025</p>
                    <button class="btn btn-primary">Learn More</button>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
            </div>
        `;
    }

    getLibraryContent() {
        return `
            <div class="mb-3">
                <h4>Library Services</h4>
                <p class="text-secondary">Access library resources and services</p>
            </div>
            <div class="library-services">
                <div class="service-item">
                    <h5><i class="fas fa-search"></i> Catalog Search</h5>
                    <p>Search for books, journals, and digital resources</p>
                    <button class="btn btn-primary">Search Catalog</button>
                </div>
                <div class="service-item">
                    <h5><i class="fas fa-book"></i> My Borrowed Books</h5>
                    <p>View your current borrowed books and due dates</p>
                    <button class="btn btn-secondary">View Books</button>
                </div>
                <div class="service-item">
                    <h5><i class="fas fa-bookmark"></i> Reservations</h5>
                    <p>Reserve books and study rooms</p>
                    <button class="btn btn-secondary">Make Reservation</button>
                </div>
                <div class="service-item">
                    <h5><i class="fas fa-clock"></i> Library Hours</h5>
                    <p>Monday - Friday: 8:00 AM - 10:00 PM<br>
                       Saturday: 10:00 AM - 6:00 PM<br>
                       Sunday: 2:00 PM - 8:00 PM</p>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
            </div>
        `;
    }

    getResourcesContent() {
        return `
            <div class="mb-3">
                <h4>Academic Resources</h4>
                <p class="text-secondary">Download course materials and resources</p>
            </div>
            <div class="resources-list">
                <div class="resource-category">
                    <h5>CS 301 - Database Design</h5>
                    <ul>
                        <li><a href="#" class="resource-link"><i class="fas fa-file-pdf"></i> Lecture Notes - Week 1-4</a></li>
                        <li><a href="#" class="resource-link"><i class="fas fa-file-pdf"></i> Assignment Guidelines</a></li>
                        <li><a href="#" class="resource-link"><i class="fas fa-video"></i> Video Tutorials</a></li>
                    </ul>
                </div>
                <div class="resource-category">
                    <h5>CS 205 - Web Development</h5>
                    <ul>
                        <li><a href="#" class="resource-link"><i class="fas fa-file-pdf"></i> HTML/CSS Reference</a></li>
                        <li><a href="#" class="resource-link"><i class="fas fa-file-code"></i> Sample Code</a></li>
                        <li><a href="#" class="resource-link"><i class="fas fa-external-link-alt"></i> Online Resources</a></li>
                    </ul>
                </div>
                <div class="resource-category">
                    <h5>CS 401 - Software Engineering</h5>
                    <ul>
                        <li><a href="#" class="resource-link"><i class="fas fa-file-pdf"></i> UML Diagrams Guide</a></li>
                        <li><a href="#" class="resource-link"><i class="fas fa-file-pdf"></i> Testing Methodologies</a></li>
                        <li><a href="#" class="resource-link"><i class="fas fa-tools"></i> Development Tools</a></li>
                    </ul>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
            </div>
        `;
    }

    getEBooksContent() {
        return `
            <div class="mb-3">
                <h4>E-Books Library</h4>
                <p class="text-secondary">Access digital textbooks and references</p>
            </div>
            <div class="search-bar mb-3">
                <input type="text" placeholder="Search e-books..." class="form-control">
                <button class="btn btn-primary">Search</button>
            </div>
            <div class="ebooks-list">
                <div class="ebook-item">
                    <div class="ebook-cover">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="ebook-info">
                        <h5>Database System Concepts</h5>
                        <p>By Abraham Silberschatz</p>
                        <p class="text-secondary">7th Edition</p>
                        <button class="btn btn-primary">Read Online</button>
                    </div>
                </div>
                <div class="ebook-item">
                    <div class="ebook-cover">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="ebook-info">
                        <h5>JavaScript: The Definitive Guide</h5>
                        <p>By David Flanagan</p>
                        <p class="text-secondary">7th Edition</p>
                        <button class="btn btn-primary">Read Online</button>
                    </div>
                </div>
                <div class="ebook-item">
                    <div class="ebook-cover">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="ebook-info">
                        <h5>Software Engineering</h5>
                        <p>By Ian Sommerville</p>
                        <p class="text-secondary">10th Edition</p>
                        <button class="btn btn-primary">Read Online</button>
                    </div>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
            </div>
        `;
    }

    getAnnouncementsContent() {
        return `
            <div class="mb-3">
                <h4>Announcements</h4>
                <p class="text-secondary">Latest news and updates from the college</p>
            </div>
            <div class="announcements-list">
                <div class="announcement-item">
                    <div class="announcement-header">
                        <h5>Mid-term Exam Schedule Released</h5>
                        <span class="announcement-date">July 18, 2025</span>
                    </div>
                    <p>The mid-term examination schedule for Semester 6 has been released. Please check your timetable for specific dates and times.</p>
                    <div class="announcement-actions">
                        <button class="btn btn-primary">View Schedule</button>
                    </div>
                </div>
                <div class="announcement-item">
                    <div class="announcement-header">
                        <h5>Library Extended Hours</h5>
                        <span class="announcement-date">July 16, 2025</span>
                    </div>
                    <p>The library will be open 24/7 during the exam period (July 25 - August 5) to accommodate student study needs.</p>
                </div>
                <div class="announcement-item">
                    <div class="announcement-header">
                        <h5>New Scholarship Applications Open</h5>
                        <span class="announcement-date">July 15, 2025</span>
                    </div>
                    <p>Applications for the Academic Excellence Scholarship and Need-Based Financial Aid are now open. Deadline: August 15, 2025.</p>
                    <div class="announcement-actions">
                        <button class="btn btn-primary">Apply Now</button>
                    </div>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
            </div>
        `;
    }

    getMessagesContent() {
        return `
            <div class="mb-3">
                <h4>Messages</h4>
                <p class="text-secondary">View and manage your messages</p>
            </div>
            <div class="messages-list">
                <div class="message-item">
                    <div class="message-header">
                        <h5>Dr. Smith - Database Design Course</h5>
                        <span class="message-date">July 17, 2025</span>
                    </div>
                    <p>Your project submission has been received. Great work on the database normalization section!</p>
                    <div class="message-actions">
                        <button class="btn btn-primary">Reply</button>
                        <button class="btn btn-secondary">Mark as Read</button>
                    </div>
                </div>
                <div class="message-item">
                    <div class="message-header">
                        <h5>Academic Office</h5>
                        <span class="message-date">July 16, 2025</span>
                    </div>
                    <p>Reminder: Fee payment deadline is July 30, 2025. Please ensure your payment is processed before the deadline.</p>
                    <div class="message-actions">
                        <button class="btn btn-primary">View Details</button>
                    </div>
                </div>
                <div class="message-item">
                    <div class="message-header">
                        <h5>Library Services</h5>
                        <span class="message-date">July 15, 2025</span>
                    </div>
                    <p>Your reserved book "JavaScript: The Definitive Guide" is now available for pickup.</p>
                    <div class="message-actions">
                        <button class="btn btn-primary">Reserve Another</button>
                    </div>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
                <button type="button" class="btn btn-primary">Compose Message</button>
            </div>
        `;
    }

    getSupportContent() {
        return `
            <div class="mb-3">
                <h4>Support Center</h4>
                <p class="text-secondary">Get help with technical issues and academic support</p>
            </div>
            <div class="support-options">
                <div class="support-item">
                    <h5><i class="fas fa-question-circle"></i> FAQ</h5>
                    <p>Find answers to commonly asked questions</p>
                    <button class="btn btn-primary">View FAQ</button>
                </div>
                <div class="support-item">
                    <h5><i class="fas fa-ticket-alt"></i> Submit Ticket</h5>
                    <p>Report technical issues or request assistance</p>
                    <button class="btn btn-primary">Create Ticket</button>
                </div>
                <div class="support-item">
                    <h5><i class="fas fa-phone"></i> Contact Support</h5>
                    <p>Phone: +1 (555) 123-HELP<br>
                       Email: support@college.edu<br>
                       Hours: Mon-Fri 8AM-6PM</p>
                </div>
                <div class="support-item">
                    <h5><i class="fas fa-graduation-cap"></i> Academic Advisor</h5>
                    <p>Schedule a meeting with your academic advisor</p>
                    <button class="btn btn-primary">Schedule Meeting</button>
                </div>
            </div>
            <div class="btn-group mt-3">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Close</button>
            </div>
        `;
    }

    getSettingsContent() {
        return `
            <div class="mb-3">
                <h4>Settings</h4>
                <p class="text-secondary">Manage your account preferences and settings</p>
            </div>
            <form id="settingsForm">
                <div class="settings-section">
                    <h5>Notification Preferences</h5>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" checked> Email notifications for assignments
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" checked> SMS notifications for important updates
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox"> Push notifications for grades
                        </label>
                    </div>
                </div>
                <div class="settings-section">
                    <h5>Privacy Settings</h5>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" checked> Make profile visible to classmates
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox"> Allow direct messages from instructors
                        </label>
                    </div>
                </div>
                <div class="settings-section">
                    <h5>Security</h5>
                    <div class="form-group">
                        <button type="button" class="btn btn-secondary">Change Password</button>
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn-secondary">Enable Two-Factor Authentication</button>
                    </div>
                </div>
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Save Settings</button>
                </div>
            </form>
        `;
    }

    bindModalEvents(modalType) {
        // Handle form submissions and modal-specific events
        switch(modalType) {
            case 'profile':
                this.bindProfileEvents();
                break;
            case 'unit-registration':
                this.bindUnitRegistrationEvents();
                break;
            case 'semester-activation':
                this.bindSemesterActivationEvents();
                break;
            case 'fee-payment':
                this.bindFeePaymentEvents();
                break;
            case 'settings':
                this.bindSettingsEvents();
                break;
        }
    }

    bindProfileEvents() {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate();
            });
        }
    }

    bindUnitRegistrationEvents() {
        const form = document.getElementById('unitRegistrationForm');
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        const totalCreditsSpan = document.getElementById('totalCredits');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateTotalCredits(checkboxes, totalCreditsSpan);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleUnitRegistration();
        });
    }

    bindSemesterActivationEvents() {
        const form = document.getElementById('semesterActivationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSemesterActivation();
            });
        }
    }

    bindFeePaymentEvents() {
        const form = document.getElementById('feePaymentForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFeePayment();
            });
        }
    }

    bindSettingsEvents() {
        const form = document.getElementById('settingsForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSettingsUpdate();
            });
        }
    }

    updateTotalCredits(checkboxes, totalCreditsSpan) {
        const creditMap = {
            'CS401': 4,
            'CS402': 3,
            'CS403': 3,
            'CS404': 4,
            'CS405': 3
        };

        let totalCredits = 0;
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                totalCredits += creditMap[checkbox.value] || 0;
            }
        });

        totalCreditsSpan.textContent = totalCredits;
    }

    handleProfileUpdate() {
        const formData = new FormData(document.getElementById('profileForm'));
        const updatedData = {
            name: formData.get('fullName') || document.getElementById('fullName').value,
            email: formData.get('email') || document.getElementById('email').value,
            phone: formData.get('phone') || document.getElementById('phone').value
        };

        // Update student data
        this.studentData.name = updatedData.name;
        this.studentData.email = updatedData.email;
        this.studentData.phone = updatedData.phone;

        // Update UI
        this.loadStudentData();

        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
        this.closeModal();
    }

    handleUnitRegistration() {
        const form = document.getElementById('unitRegistrationForm');
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        const selectedUnits = Array.from(checkboxes).map(cb => cb.value);

        if (selectedUnits.length === 0) {
            this.showNotification('Please select at least one unit to register.', 'error');
            return;
        }

        // Simulate unit registration
        this.showNotification(`Successfully registered for ${selectedUnits.length} units!`, 'success');
        this.closeModal();
    }

    handleSemesterActivation() {
        const activationCode = document.getElementById('activationCode').value;
        
        if (!activationCode) {
            this.showNotification('Please enter an activation code.', 'error');
            return;
        }

        // Simulate activation
        if (activationCode === 'ACTIVATE2025') {
            this.studentData.semester += 1;
            this.showNotification('Semester activated successfully!', 'success');
            this.closeModal();
        } else {
            this.showNotification('Invalid activation code. Please try again.', 'error');
        }
    }

    handleFeePayment() {
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        const paymentMethod = document.getElementById('paymentMethod').value;

        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid payment amount.', 'error');
            return;
        }

        if (!paymentMethod) {
            this.showNotification('Please select a payment method.', 'error');
            return;
        }

        if (amount > this.studentData.feeBalance) {
            this.showNotification('Payment amount cannot exceed outstanding balance.', 'error');
            return;
        }

        // Simulate payment processing
        this.studentData.feeBalance -= amount;
        this.showNotification(`Payment of $${amount.toLocaleString()} processed successfully!`, 'success');
        this.closeModal();
    }

    handleSettingsUpdate() {
        this.showNotification('Settings updated successfully!', 'success');
        this.closeModal();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);

        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Simulate logout
            this.showNotification('Logging out...', 'info');
            
            // In a real application, you would redirect to login page
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
        }
    }
}

// Initialize the portal when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portal = new StudentPortal();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }
});




const add_course_form = document.getElementById("add_course_form");

add_course_form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const course_name = document.getElementById("course_name").value.trim();
  const course_description = document.getElementById("course_description").value.trim();
  const course_duration = document.getElementById("course_duration").value.trim();
  const course_fees = document.getElementById("course_fees").value.trim();
  const course_qualification = document.getElementById("course_qualification").value;
  
  // Send data to server
  try {
    const response = await fetch('/addcourse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_name: course_name,        
        course_description: course_description,
        course_duration: course_duration,
        course_fees: course_fees,
        course_qualification: course_qualification
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
    alert("Course added successfully!");
    } else {
      alert("Failed to add course")
    }

  } catch (error) {
alert('An error occurred. Please try again later.');}
  
});



 
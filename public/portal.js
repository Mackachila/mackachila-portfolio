//enroll Now
class StudentPortal {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.modal = document.getElementById('modalOverlay');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
    }

    bindEvents() {
        // Toggle sidebar on mobile menu button click
        this.mobileMenuToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Close modal on close button click
        this.modalClose.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside the modal content
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Open modal when clicking elements with data-modal attribute
        document.querySelectorAll('[data-modal]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const modalType = link.getAttribute('data-modal');
                this.openModal(modalType);
            });
        });

        // Auto-close sidebar on outside click (mobile only)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                !this.sidebar.contains(e.target) &&
                !this.mobileMenuToggle.contains(e.target) &&
                this.sidebar.classList.contains('active')) {
                this.toggleSidebar();
            }
        });

        document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'addcoursebtn1') {
        e.preventDefault();
        this.modalTitle.textContent = this.getModalTitle('addcourse');
        this.modalBody.innerHTML = this.getModalContent('addcourse');
        this.openModal('addcourse');
    }

    if (e.target && e.target.id === 'editcoursebtn') {
        e.preventDefault();
        this.modalTitle.textContent = this.getModalTitle('editcourse');
        this.modalBody.innerHTML = this.getModalContent('editcourse');
        this.openModal('editcourse');
    }

    if (e.target && e.target.id === 'deletecoursebtn') {
        e.preventDefault();
        this.modalTitle.textContent = this.getModalTitle('deletecourse');
        this.modalBody.innerHTML = this.getModalContent('deletecourse');
        this.openModal('deletecourse');
    }
});
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('active');
    }

    openModal(modalType) {
    this.modalTitle.textContent = this.getModalTitle(modalType);
    this.modalBody.innerHTML = this.getModalContent(modalType); // inject form
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    
    if (modalType === 'addcourse') {
    const form = document.getElementById("add_course_form");
    const loadingOverlay = document.getElementById("loading-overlay");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const addcoursebtn = document.getElementById('addcoursebtn');
            const originalText = addcoursebtn.innerHTML;
            addcoursebtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
            addcoursebtn.disabled = true;

            const formData = new FormData(form); // Automatically grabs all fields including file

            try {
                const response = await fetch('/addcourse', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                addcoursebtn.innerHTML = originalText;
                addcoursebtn.disabled = false;

                if (response.ok) {
                    displayFloatingCard(result.message, 'success');
                    // Optionally: portal.closeModal();
                } else {
                    displayFloatingCard(result.error, 'error');
                }
            } catch (error) {
                addcoursebtn.innerHTML = originalText;
                addcoursebtn.disabled = false;
                displayFloatingCard('An unknown error occurred. Please try again later.', 'error');
            }
        });
    }
}


    if (modalType === 'editcourse') {
    const searchForm = document.getElementById('search_course_form');
    const editFormWrapper = document.getElementById('edit_course_fields');
    const editForm = document.getElementById('edit_course_form');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseName = document.getElementById('search_course_name').value.trim();
                const searcheditbtn = document.getElementById('searcheditbtn');
                const originalText = searcheditbtn.innerHTML;
                searcheditbtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
                searcheditbtn.disabled = true;

        try {
            const response = await fetch(`/courses/${encodeURIComponent(courseName)}`);
            const result = await response.json();

            if (response.ok) {
                 searcheditbtn.innerHTML = originalText;
                searcheditbtn.disabled = false;
                // Show form and pre-fill it
                editFormWrapper.style.display = 'block';
                document.getElementById('edit_course_name').value = result.course_name;
                document.getElementById('edit_course_category').value = result.category;
                document.getElementById('edit_course_description').value = result.description;
                document.getElementById('edit_course_duration').value = result.duration_weeks;
                document.getElementById('edit_course_fees').value = result.fee;
                document.getElementById('edit_course_qualification').value = result.qualification;

                
            } else {
                 searcheditbtn.innerHTML = originalText;
                searcheditbtn.disabled = false;
                displayFloatingCard(result.error || 'Course not found', 'error');
            }
        } catch (err) {
                searcheditbtn.innerHTML = originalText;
                searcheditbtn.disabled = false;
            displayFloatingCard('An error occurred during search.', 'error');
        }
    });


    editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatecoursebtn = document.getElementById('updatecoursebtn');
    const originalText = updatecoursebtn.innerHTML;
    updatecoursebtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
    updatecoursebtn.disabled = true;

    const originalName = document.getElementById('search_course_name').value.trim();
    const formData = new FormData(editForm);
    formData.append('original_name', originalName); // Needed to find the course in DB

    try {
        const response = await fetch(`/editcourse/${encodeURIComponent(originalName)}`, {
            method: 'PUT',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            displayFloatingCard(result.message, 'success');
        } else {
            displayFloatingCard(result.error, 'error');
        }
    } catch (error) {
        displayFloatingCard('Failed to update course. Try again later.', 'error');
    }

    updatecoursebtn.innerHTML = originalText;
    updatecoursebtn.disabled = false;
});
    }
//course_qualification

    if (modalType === 'deletecourse') {
    const searchForm = document.getElementById('searchdelete_course_form');
    const editFormWrapper = document.getElementById('delete_course_fields');
    const editForm = document.getElementById('delete_course_form');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const courseName = document.getElementById('searchdelete_course_name').value.trim();
        const searchdeletebtn = document.getElementById('searchdeletebtn');
                const originalText = searchdeletebtn.innerHTML;
                searchdeletebtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
                searchdeletebtn.disabled = true;
                // coursedeletebtn
        try {
            const response = await fetch(`/courses/${encodeURIComponent(courseName)}`);
            const result = await response.json();

            if (response.ok) {
                searchdeletebtn.innerHTML = originalText;
                searchdeletebtn.disabled = false;
                // Show form and pre-fill it
                editFormWrapper.style.display = 'block';
                document.getElementById('delete_course_name').value = result.course_name;
                document.getElementById('delete_course_description').value = result.description;
                document.getElementById('delete_course_duration').value = result.duration_weeks;
                document.getElementById('delete_course_fees').value = result.fee;
                document.getElementById('delete_course_qualification').value = result.qualification;
            } else {
                searchdeletebtn.innerHTML = originalText;
                searchdeletebtn.disabled = false;
                displayFloatingCard(result.error || 'Course not found', 'error');
            }
        } catch (err) {
            searchdeletebtn.innerHTML = originalText;
            searchdeletebtn.disabled = false;
            displayFloatingCard('An error occurred during search.', 'error');
        }
    });

    editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const courseToDelete = document.getElementById('delete_course_name').value.trim();
         const coursedeletebtn = document.getElementById('coursedeletebtn');
                const originalText = coursedeletebtn.innerHTML;
                coursedeletebtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
                coursedeletebtn.disabled = true;
             
    try {
        const response = await fetch(`/deletecourse/${encodeURIComponent(courseToDelete)}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (response.ok) {
            coursedeletebtn.innerHTML = originalText;
            coursedeletebtn.disabled = false;
            displayFloatingCard(result.message, 'success');
            // Hide the delete form and reset search
            editFormWrapper.style.display = 'none';
            searchForm.reset();
        } else {
            coursedeletebtn.innerHTML = originalText;
            coursedeletebtn.disabled = false;
            displayFloatingCard(result.error, 'error');
        }
    } catch (error) {
        coursedeletebtn.innerHTML = originalText;
        coursedeletebtn.disabled = false;
        displayFloatingCard('Failed to delete course. Try again later.', 'error');
    }
});

    }
}

                

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    getModalTitle(modalType) {
        const titles = {
            'courseaction': 'Chose what to do',
            'addcourse': 'Add new course',
            'editcourse': 'Edit course',   
            'deletecourse': 'Delete course',            
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
///editcourse
    getModalContent(modalType) {
        switch(modalType) {
            case 'courseaction':
                return this.getcourseactionContent();
            case 'addcourse':
                return this.getaddcourseContent();
            case 'editcourse':
            return this.geteditcourseContent();
            case 'deletecourse':
                return this.getdeletecourseContent();
                
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

    getcourseactionContent() {
        return `
            <form id="choseaction">
                                
                <div class="btn-group">
                    <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
                    <button type="button" id="addcoursebtn1" class="btn btn-primary" onclick="portal.getaddcourseContent()">Add course</button>
                    <button type="button" id="editcoursebtn" class="btn btn-primary">Edit course</button>
                    <button type="button" id="deletecoursebtn" class="btn btn-primary">Delete course</button>
                </div>
            </form>
        `;
        
    }

geteditcourseContent() {
    return `
        <form id="search_course_form" enctype="multipart/form-data">
            <div class="form-group">
                <label for="search_course_name">Which course do you want to edit?</label>
                <input type="text" id="search_course_name" required placeholder="Enter course name">
            </div>
            <div class="btn-group">
                <button type="submit" id="searcheditbtn" class="btn btn-primary">Search</button>
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
            </div>
        </form>
        <div id="edit_course_fields" style="display:none; margin-top: 20px;">
            <form id="edit_course_form" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="edit_course_name">Course Name</label>
                    <input type="text" id="edit_course_name" name="course_name" required>
                </div>
                <div class="form-group">
                    <label for="edit_course_category">Course Category</label>
                    <select name="category" id="edit_course_category" required>
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Computer packages">Computer Packages</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit_course_description">Description</label>
                    <textarea id="edit_course_description" name="course_description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="edit_course_duration">Duration (weeks)</label>
                    <input type="number" id="edit_course_duration" name="course_duration" required>
                </div>
                <div class="form-group">
                    <label for="edit_course_fees">Fees (KES)</label>
                    <input type="number" id="edit_course_fees" name="course_fees" required>
                </div>
                <div class="form-group">
                    <label for="edit_course_qualification">Qualification</label>
                    <input type="text" id="edit_course_qualification" name="course_qualification">
                </div>
                <div class="form-group">
                    <label for="edit_course_image">Replace Image (optional)</label>
                    <input type="file" id="edit_course_image" name="image">
                </div>
                <div class="btn-group">
                    <button type="submit" id="updatecoursebtn" class="btn btn-success">Update Course</button>
                </div>
            </form>
        </div>
    `;
}


getdeletecourseContent() {
    return `
        <form id="searchdelete_course_form">
            <div class="form-group">
                <label for="search_course_name">Which course do you want to delete?</label>
                <input type="text" id="searchdelete_course_name" required placeholder="Enter course name">
            </div>
            <div class="btn-group">
                <button type="submit" id="searchdeletebtn" class="btn btn-primary">Search</button>
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
            </div>
        </form>
        <div id="delete_course_fields" style="display:none; margin-top: 20px;">
            <form id="delete_course_form">
                <div class="form-group">
                    <label for="edit_course_name">Course Name</label>
                    <input type="text" id="delete_course_name" required readonly>
                </div>
                <div class="form-group">
                    <label for="edit_course_description">Description</label>
                    <textarea id="delete_course_description" required readonly></textarea>
                </div>
                <div class="form-group">
                    <label for="edit_course_duration">Duration (weeks)</label>
                    <input type="number" id="delete_course_duration" required readonly>
                </div>
                <div class="form-group">
                    <label for="edit_course_fees">Fees (KES)</label>
                    <input type="number" id="delete_course_fees" required readonly>
                </div>
                <div class="form-group">
                    <label for="edit_course_qualification">Qualification</label>
                    <input type="text" id="delete_course_qualification" readonly>
                </div>
                <div class="btn-group">
                <span style="color:red"> Warning: This action will parmanently delete this course with one click. </span>
                    <button type="submit" id="coursedeletebtn" class="btn btn-success" style="background-color:red">Delete</button>
                </div>
            </form>
        </div>
    `;
}
   
    getaddcourseContent() {
    return `
        <form id="add_course_form" enctype="multipart/form-data">
            <div class="form-group">
                <label for="course_name">Course Name/ Title</label>
                <input type="text" id="course_name" name="course_name" required>
            </div>
            <div class="form-group">
                    <label for="add_course_category">Course Category</label>
                    <select name="addcategory" id="add_course_category" required>
                    <option value="Programming">Programming</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Computer packages">Computer Packages</option>
                    </select>
                </div>
            <div class="form-group">
                <label for="course_description">Course description</label>
                <textarea id="course_description" name="course_description" required></textarea>
            </div>
            <div class="form-group">
                <label for="course_duration">Duration in weeks</label>
                <input type="number" id="course_duration" name="course_duration" required>
            </div>
            <div class="form-group">
                <label for="course_fees">Course fees (KES)</label>
                <input type="number" id="course_fees" name="course_fees" required>
            </div>
            <div class="form-group">
                <label for="course_qualification">Minimum qualification (Optional)</label>
                <input type="text" id="course_qualification" name="course_qualification">
            </div>
            <div class="form-group">
                <label for="course_image">Course Image caption</label>
                <input type="file" id="course_image" name="course_image" accept="image/*" required>
            </div>
            <div class="btn-group">
                <button type="button" class="btn btn-secondary" onclick="portal.closeModal()">Cancel</button>
                <button type="submit" id="addcoursebtn" class="btn btn-primary">Add course</button>
            </div>
        </form>
    `;
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


function displayFloatingCard(message, type) {
  const card = document.createElement('div');
  card.className = `floating-card ${type}`;
  
  const icon = document.createElement('img');
  icon.className = 'card-icon';
  
  if (type === 'error') {
    icon.src = 'error.png';  // Assuming error.png is in the same directory
  } else if (type === 'success') {
    icon.src = 'tick.png';  // Assuming success.png is in the same directory
  }

  const text = document.createElement('span');
  text.className = 'card-message';
  text.textContent = message;

  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => {
    card.remove();
  };

  card.appendChild(icon);
  card.appendChild(text);
  card.appendChild(closeBtn);
  
  document.body.appendChild(card);

  // Automatically remove the card after 3 seconds
  setTimeout(() => {
    card.remove();
  }, 5000);
}
  
// });

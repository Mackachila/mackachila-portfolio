// Your enroll now payment for

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.querySelector('.search-box input');
  const categorySelect = document.querySelector('.filter-select');
  const coursesGrid = document.querySelector('.courses-grid');

  async function fetchCourses(search = '', category = '') {
    try {
        const res = await fetch(`/courses?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
        if (!res.ok) {
            if (res.status === 401) {
                coursesGrid.innerHTML = '<p>Please log in to view available courses.</p>';
                return;
            }
            throw new Error(`HTTP ${res.status}`);
        }
        const courses = await res.json();
        renderCourses(courses);
    } catch (err) {
        console.error('Error fetching courses:', err);
    }
}


function renderCourses(courses) {
    coursesGrid.innerHTML = '';

    if (courses.length === 0) {
        coursesGrid.innerHTML = `<p>No courses found matching your criteria.</p>`;
        return;
    }

    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');

        // Button label and disabled logic
        let buttonLabel = 'Enroll Now';
        let buttonDisabled = false;

        if (course.student_status) {
            if (course.student_status.toLowerCase() === 'active') {
                buttonLabel = 'Enrolled';
                buttonDisabled = true;
            } else {
                buttonLabel = course.student_status.charAt(0).toUpperCase() + course.student_status.slice(1);
            }
        }

        courseCard.innerHTML = `
            <div class="course-image">
                <img src="${course.image_path || 'default-image.jpg'}" alt="Course">
            </div>
            <div class="course-content">
                <h4>${course.course_name}</h4>
                <p>${course.description}</p>
                <b><div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration_weeks} weeks</span>
                    <span>Fees KES. ${course.fee}</span>
                    <span> -- Pay in 3 installments</span>
                </div></b>
                <button class="btn btn-primary enroll-btn" 
                    data-name="${course.course_name}" 
                    data-fee="${course.fee}" 
                    ${buttonDisabled ? 'disabled' : ''}>
                    ${buttonLabel}
                </button>
            </div>
        `;

        coursesGrid.appendChild(courseCard);
    });

    // Bind modal logic only to active enroll buttons
    document.querySelectorAll('.enroll-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            const courseName = btn.dataset.name;
            const courseFee = parseFloat(btn.dataset.fee);
            openPaymentModal(courseName, courseFee);
        });
    });
}


  searchInput.addEventListener('input', () => {
    const search = searchInput.value;
    const category = categorySelect.value;
    fetchCourses(search, category);
  });

  categorySelect.addEventListener('change', () => {
    const search = searchInput.value;
    const category = categorySelect.value;
    fetchCourses(search, category);
  });

  // Initial load
  fetchCourses();
});


// Shared variables for both payment methods
let currentManualCourse = '';
let currentManualMin = 0;
let currentManualMax = 0;

function openPaymentModal(courseName, fee) {
  const userstatus = document.getElementById('userstatus').textContent.trim();
  if (userstatus !== 'Active') {
    displayFloatingCard('You need to be an active student to enroll a course.', 'error');
    return;
  }

  const modal = document.getElementById('payment-modal');
  const courseInput = document.getElementById('selected-course-name');
  const phoneInput = document.getElementById('phone');
  const amountInput = document.getElementById('amount');
  const amountInfo = document.getElementById('amount-info');
  const coursepaid = document.getElementById('coursepaid');

  const minInstallment = Math.ceil(fee / 3); // Round up
  const maxPayment = fee;

  // Store for reuse in manual modal
  currentManualCourse = courseName;
  currentManualMin = minInstallment;
  currentManualMax = maxPayment;

  // Set values in auto-payment modal
  courseInput.value = courseName;
  coursepaid.textContent = courseName;
  amountInput.min = minInstallment;  // ✅ now set min properly
  amountInput.max = maxPayment;
  amountInput.value = minInstallment;
  amountInfo.innerText = `If this is your first deposit for this course, do not pay amount less than KES ${minInstallment}. Paying amount less than the stated amount might lead to parmanent loss of funds`;

  phoneInput.value = '';
  modal.classList.remove('hidden');
}

document.getElementById('cancel-btn').addEventListener('click', () => {
  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('payment-status').style.display = 'none';
});

// Manual payment section
const manualBtn = document.getElementById('manualbtn');
const manualModal = document.getElementById('manual-payment-modal');
const manualCourseName = document.getElementById('manual-course-name');
const manualCancelBtn = document.getElementById('manual-cancel-btn');
const manualForm = document.getElementById('manual-payment-form');
const manualAmountInfo = document.getElementById('manual-amount-info');
const transactionCodeInput = document.getElementById('transaction-code');

manualBtn.addEventListener('click', function (e) {
  e.preventDefault();

  // Hide auto modal, show manual modal
  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('payment-status').style.display = 'none';

  manualCourseName.textContent = currentManualCourse;
  manualAmountInfo.textContent =
    currentManualMin > 0
      ? `If this is your first deposit for this course, do not send amount less than KES ${currentManualMin}. Sending amount less than the stated amount might lead to parmanent loss of funds`
      : `Minimum installment amount not set for this course. Please confirm payment terms.`;

  transactionCodeInput.value = '';
  manualModal.classList.remove('hidden');
});

// Handle manual payment form submit (uses existing IDs / variables)
manualForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const transactionCode = transactionCodeInput.value.trim();
  if (!transactionCode) {
    displayFloatingCard('Please enter a valid transaction code.', 'error');
    return;
  }
          const manualverify = document.getElementById('manual-verify-btn');
            const originalText = manualverify.innerHTML;
            manualverify.innerHTML = '</i> Processing payment... <i class="fas fa-spinner fa-spin">';
            manualverify.disabled = true;
  try {
    const res = await fetch('/manual-payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transactionCode: transactionCode,
        courseName: currentManualCourse,    // course name (unique) — you provided this earlier
        firstDepositMin: currentManualMin   // min computed earlier in openPaymentModal
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      manualverify.innerHTML = originalText;
      manualverify.disabled = false;
      displayFloatingCard(`${data.message} Remaining balance: KES ${data.fee_balance}`, 'success');
      manualModal.classList.add('hidden');
    } else {
      manualverify.innerHTML = originalText;
      manualverify.disabled = false;
      // show server-provided error message (if any)
      displayFloatingCard((data && (data.error || data.message)) || 'Verification failed', 'error');
    }
  } catch (err) {
    console.error(err);
    manualverify.innerHTML = originalText;
      manualverify.disabled = false;
    displayFloatingCard('Unable to reach server. Try again later.', 'error');
  }
});


document.getElementById('manual-cancel-btn').addEventListener('click', () => {
  manualModal.classList.add('hidden');
});


manualCancelBtn.addEventListener('click', () => {
  manualModal.classList.add('hidden');
});


// Fetch and display registered courses
document.addEventListener('DOMContentLoaded', async () => {
    const registeredSection = document.querySelector('#registered');
    const placeholder = registeredSection.querySelector('.placeholder-content');

    // Stats elements
    const registeredEl = document.querySelector('.stat-info h3[data-type="registered"]');
    const inProgressEl = document.querySelector('.stat-info h3[data-type="in-progress"]');
    const completedEl = document.querySelector('.stat-info h3[data-type="completed"]');
    const deferredEl = document.querySelector('.stat-info h3[data-type="deferred"]');

    try {
        const response = await fetch('/student/courses');
        const data = await response.json();

        if (!data.courses || data.courses.length === 0) {
            placeholder.style.display = 'block';
            return;
        }

        placeholder.style.display = 'none';

        // ---- UPDATE COUNTS FROM BACKEND ----
        registeredEl.textContent = data.counts.registered;
        inProgressEl.textContent = data.counts.inProgress;
        completedEl.textContent = data.counts.completed;
        deferredEl.textContent = data.counts.deferred;

        // ---- DISPLAY COURSES ----
        const coursesContainer = document.createElement('div');
        coursesContainer.id = 'registered-courses';

        data.courses.forEach(course => {
            let statusClass = '';
            switch(course.status) {
                case 'active': statusClass = 'status-active'; break;
                case 'completed': statusClass = 'status-completed'; break;
                case 'deferred': statusClass = 'status-deferred'; break;
                case 'withdrawn': statusClass = 'status-withdrawn'; break;
                default: statusClass = 'status-error';
            }

            // Build action buttons
            let actionButtons = '';
            if (course.fee_balance > 0) {
                actionButtons += `<button class="pay-btn" data-course-id="${course.course_id}">Pay Now</button>`;
            }

            if (course.status === 'active') {
                actionButtons += `
                    <button class="withdraw-btn" data-course-id="${course.course_id}">Withdraw</button>
                    <button class="defer-btn" data-course-id="${course.course_id}">Defer</button>
                `;
            } else if (course.status === 'withdrawn') {
                actionButtons += `<button class="enroll-btn" data-course-id="${course.course_id}">Enroll</button>`;
            } else if (course.status === 'deferred') {
                actionButtons += `<button class="resume-btn" data-course-id="${course.course_id}">Resume</button>`;
            }

            const courseCard = document.createElement('div');
            courseCard.classList.add('course-card');

            courseCard.innerHTML = `
                <div class="course-header">
                    <h3>${course.course_name}</h3>
                    <span class="status-badge ${statusClass}">${course.status}</span>
                </div>
                <p class="course-date">📅 Registered on: ${new Date(course.registration_date).toLocaleDateString()}</p>
                <p class="course-fee">
                    💰 Fee Balance: 
                    ${course.fee_balance > 0 
                        ? `<span class="balance-amount">KSh ${Number(course.fee_balance).toFixed(2)}</span>` 
                        : `<span class="fully-paid">Fully Paid</span>`}
                </p>
                <div class="course-actions">${actionButtons}</div>
            `;

            coursesContainer.appendChild(courseCard);
        });

        registeredSection.appendChild(coursesContainer);

        // ---- EVENT LISTENERS ----
        registeredSection.addEventListener('click', (e) => {
            const courseId = e.target.dataset.courseId;

            if (e.target.classList.contains('pay-btn')) {
                alert(`Initiating payment for Course ID: ${courseId}`);
            } else if (e.target.classList.contains('withdraw-btn')) {
                alert(`Withdraw request for Course ID: ${courseId}`);
            } else if (e.target.classList.contains('defer-btn')) {
                alert(`Defer request for Course ID: ${courseId}`);
            } else if (e.target.classList.contains('enroll-btn')) {
                alert(`Re-enrolling in Course ID: ${courseId}`);
            } else if (e.target.classList.contains('resume-btn')) {
                alert(`Resuming Course ID: ${courseId}`);
            }
        });

//         if (course.status === 'active') {
//   actionButtons += `
//     <button class="action-btn withdraw-btn" data-course-id="${course.course_id}">Withdraw</button>
//     <button class="action-btn defer-btn" data-course-id="${course.course_id}">Defer</button>
//   `;
// } else if (course.status === 'withdrawn') {
//   actionButtons += `<button class="action-btn enroll-btn" data-course-id="${course.course_id}">Enroll</button>`;
// } else if (course.status === 'deferred') {
//   actionButtons += `<button class="action-btn resume-btn" data-course-id="${course.course_id}">Resume</button>`;
// }


    } catch (err) {
        console.error('Error fetching courses:', err);
        placeholder.innerHTML = `<p style="color:red;">Failed to load courses.</p>`;
    }
});


// // Fetch and display registered courses
// document.addEventListener('DOMContentLoaded', async () => {
//     const registeredSection = document.querySelector('#registered');
//     const placeholder = registeredSection.querySelector('.placeholder-content');

//     // Stats elements
//     const registeredEl = document.querySelector('.stat-info h3[data-type="registered"]');
//     const inProgressEl = document.querySelector('.stat-info h3[data-type="in-progress"]');
//     const completedEl = document.querySelector('.stat-info h3[data-type="completed"]');
//     const deferredEl = document.querySelector('.stat-info h3[data-type="deferred"]');

//     try {
//         const response = await fetch('/student/courses');
//         const data = await response.json();

//         if (!data.courses || data.courses.length === 0) {
//             placeholder.style.display = 'block';
//             return;
//         }

//         placeholder.style.display = 'none';

//         // ---- UPDATE COUNTS FROM BACKEND ----
//         registeredEl.textContent = data.counts.registered;
//         inProgressEl.textContent = data.counts.inProgress;
//         completedEl.textContent = data.counts.completed;
//         deferredEl.textContent = data.counts.deferred;

//         // ---- DISPLAY COURSES ----
//         const coursesContainer = document.createElement('div');
//         coursesContainer.id = 'registered-courses';

//         data.courses.forEach(course => {
//             let statusClass = '';
//             if (course.status === 'active') {
//                 statusClass = 'status-active';
//             } else if (course.status === 'completed') {
//                 statusClass = 'status-completed';
//             } else if (course.status === 'deferred') {
//                 statusClass = 'status-deferred';
//             } else {
//                 statusClass = 'status-error';
//             }

//             const courseCard = document.createElement('div');
//             courseCard.classList.add('course-card');

//             courseCard.innerHTML = `
//                 <div class="course-header">
//                     <h3>${course.course_name}</h3>
//                     <span class="status-badge ${statusClass}">${course.status}</span>
//                 </div>
//                 <p class="course-date">📅 Registered on: ${new Date(course.registration_date).toLocaleDateString()}</p>
//                 <p class="course-fee">
//                     💰 Fee Balance: 
//                     ${course.fee_balance > 0 
//                         ? `<span class="balance-amount">KSh ${Number(course.fee_balance).toFixed(2)}</span>` 
//                         : `<span class="fully-paid">Fully Paid</span>`}
//                 </p>
//                 ${course.fee_balance > 0 
//                     ? `<button class="pay-btn" data-course-id="${course.course_id}">Pay Now</button>` 
//                     : ''}
//             `;

//             coursesContainer.appendChild(courseCard);
//         });

//         registeredSection.appendChild(coursesContainer);

//         registeredSection.addEventListener('click', (e) => {
//             if (e.target.classList.contains('pay-btn')) {
//                 const courseId = e.target.dataset.courseId;
//                 alert(`Initiating payment for Course ID: ${courseId}`);
//             }
//         });

//     } catch (err) {
//         console.error('Error fetching courses:', err);
//         placeholder.innerHTML = `<p style="color:red;">Failed to load courses.</p>`;
//     }
// });




//Floating card

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
  }, 7000);
}






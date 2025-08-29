
const registrationForm = document.getElementById("registrationForm");
const loadingOverlay = document.getElementById("loading-overlay");
registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fullname = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/;
  const phoneNumberRegex = /^0\d{9}$/;

   
    showLoadingSpinner();

 const submitBtn = document.getElementById('regsubmitbtn');
const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
    submitBtn.disabled = true;
  
  // Basic client-side validation
  if (fullname == "" || email == "" || contact == "" || password == "" || confirmPassword == "") {
    displayFloatingCard('Please fill all the fields', 'error');
    
     submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        hideLoadingSpinner();
    
    return;
  }


  if (!phoneNumberRegex.test(contact)) {
    displayFloatingCard('Please provide a valid phone number.', 'error');
    hideLoadingSpinner();
    submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    return;
  }

  if (!emailRegex.test(email)) {
    displayFloatingCard('Please provide a valid email address.', 'error');
    hideLoadingSpinner();
    submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    return;
  }

  if (!passwordRegex.test(password)) {
    displayFloatingCard('Password must be at least 6 characters.', 'error');
    hideLoadingSpinner();
    submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    return;
  }

  if (password.trim() !== confirmPassword.trim()) {
    displayFloatingCard('Your passwords do not match.', 'error');
    hideLoadingSpinner();
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    return;
  }

  // Send data to server
  try {
    const response = await fetch('/userregistration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname: fullname,
        contact: contact,
        email: email,
        password: password
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      displayFloatingCard(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 6000); // Redirect after 10 seconds
    } else {
      displayFloatingCard(result.error, 'error');
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
   submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  hideLoadingSpinner();
});







// loading spinner

function showLoadingSpinner() {
    loadingOverlay.classList.add('active');
  }
  
  function hideLoadingSpinner() {
    loadingOverlay.classList.remove('active');
  }

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
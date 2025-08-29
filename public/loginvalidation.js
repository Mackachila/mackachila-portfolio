
const loginForm = document.getElementById("loginForm");
const loadingOverlay = document.getElementById("loading-overlay");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const login_email = document.getElementById("email").value;
  const login_password = document.getElementById("password").value;
  
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const submitBtn = document.getElementById('loginbtn');
const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
    submitBtn.disabled = true;


  showLoadingSpinner();
  // Basic client-side validation
  if (login_email == "" || login_password == "") {
    displayFloatingCard('Please fill all the fields', 'error');
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    hideLoadingSpinner();
    return;
  }

  if (!emailRegex.test(login_email)) {
    displayFloatingCard('Please provide a valid email address.', 'error');
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    hideLoadingSpinner();
    return;
  }

  // Send data to server
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login_email: login_email,
        login_password: login_password
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
      displayFloatingCard(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/studentportal';
      }, 2000); // Redirect after 2 seconds
    } else {
      displayFloatingCard(result.error, 'error');

       
  if (result.error === 'Please check your email to activate your account.') {
    document.getElementById("verificationbtn").style.display = "block";
  }
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
  submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  hideLoadingSpinner();
});



// Function to resend activation email
const resendActivationBtn = document.getElementById("verificationbtn");
resendActivationBtn.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    displayFloatingCard('Please enter your registered email address.', 'error');
    return;
  }

  if (!emailRegex.test(email)) {
    displayFloatingCard('Please provide a valid email address.', 'error');
    return;
  }

  showLoadingSpinner();
  
  try {
    const response = await fetch('/resend-activation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    
    if (response.ok) {
      displayFloatingCard(result.message, 'success');
    } else {
      displayFloatingCard(result.error, 'error');
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
  
  hideLoadingSpinner();
});



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

const loginForm = document.getElementById("verifyemail_form");
const loadingOverlay = document.getElementById("loading-overlay");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password_reset_email = document.getElementById("password_reset_email").value;
//   const login_password = document.getElementById("login_password").value;
  
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  showLoadingSpinner();
  // Basic client-side validation
  if (password_reset_email == "") {
    displayFloatingCard('Please fill in your email address', 'error');
    hideLoadingSpinner();
    return;
  }

  if (!emailRegex.test(password_reset_email)) {
    displayFloatingCard('Please provide a valid email address.', 'error');
    hideLoadingSpinner();
    return;
  }
  const resetbtn = document.getElementById('resetbtn');
    const originalText = resetbtn.innerHTML;
 resetbtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';

    // submitBtn.disabled = t;
  // Send data to server
  try {

    const response = await fetch('/passwordreset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password_reset_email: password_reset_email
        
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
        resetbtn.innerHTML = 'Resend code';
      displayFloatingCard(result.message, 'success');
      document.getElementById("verifycode_form").style.display = "block";
      document.getElementById("password_reset_email").style.pointerEvents = "none";
      document.getElementById("password_reset_email").readOnly = true;
    //   setTimeout(() => {
    //     window.location.href = '/account';
    //   }, 2000); // Redirect after 2 seconds
    } else {
      displayFloatingCard(result.error, 'error');
      resetbtn.innerHTML = originalText;
    resetbtn.disabled = false;
      
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
  hideLoadingSpinner();
  resetbtn.innerHTML = originalText;
    resetbtn.disabled = false;
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

  
// code verification

  document.getElementById("verifycode_form").addEventListener("submit", async (event) => {
    // const loadingOverlay = document.getElementById("loading-overlay");
    event.preventDefault();
    const password_reset_email = document.getElementById("password_reset_email").value;
    const reset_code = document.getElementById("reset_code").value;
    
  
    showLoadingSpinner();
    if (reset_code == "") {
        displayFloatingCard('Please fill in the reset code', 'error');
        hideLoadingSpinner();
        return;
      }

      if (password_reset_email == "") {
        displayFloatingCard('Please fill in your email', 'error');
        hideLoadingSpinner();
        return;
      }
    
      if (reset_code.length < 6 ) {
        displayFloatingCard('Code too short.', 'error');
        hideLoadingSpinner();
        return;
      }

      const verifycodebtn = document.getElementById('verifycodebtn');
    const voriginalText = verifycodebtn.innerHTML;
 verifycodebtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
 verifycodebtn.disabled = true;
 
    
  try {
    const response = await fetch('/verifyreset_code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password_reset_email: password_reset_email,
        reset_code: reset_code
      }),
    });

    const result = await response.json();
    
    
    if (response.ok) {
      // displayFloatingCard(result.message, response.ok ? 'success' : 'error');
      displayFloatingCard(result.message, 'success');
      document.getElementById("verifycode_form").style.display = "none";
      document.getElementById("passwordreset_form").style.display = "block";
      document.getElementById("password_reset_email").style.pointerEvents = "none";
      document.getElementById("password_reset_email").readOnly = true;
      verifycodebtn.innerHTML = voriginalText;
    verifycodebtn.disabled = false;
    } else {
      displayFloatingCard(result.error, 'error');
      verifycodebtn.innerHTML = voriginalText;
    verifycodebtn.disabled = false;
    }

  } catch (error) {
    displayFloatingCard('An error occurred. Please try again later.', 'error');
   verifycodebtn.innerHTML = voriginalText;
    verifycodebtn.disabled = false;
  }
  hideLoadingSpinner();
  verifycodebtn.innerHTML = voriginalText;
    verifycodebtn.disabled = false;
});


  
  
  document.getElementById("passwordreset_form").addEventListener("submit", async (event) => {
    // const loadingOverlay = document.getElementById("loading-overlay");
    event.preventDefault();
    const password_reset_email = document.getElementById("password_reset_email").value;
    const new_password = document.getElementById("reset-password").value;
    const confirm_new_password = document.getElementById("confirm-reset-password").value;
    
    
    const passwordRegex = /^.{6,}$/;
    showLoadingSpinner();
   // Basic client-side floating-card
  if (new_password == "" || confirm_new_password == "") {
    displayFloatingCard('Please fill all the fields', 'error');
    hideLoadingSpinner();
    return;
  }

  if (!passwordRegex.test(new_password)) {
    displayFloatingCard('Password must be at least 6 characters.', 'error');
    hideLoadingSpinner();
    return;
  }

  if (new_password.trim() !== confirm_new_password.trim()) {
    displayFloatingCard('Your passwords do not match.', 'error');
    hideLoadingSpinner();
    return;
  }

   const resetpassbtn = document.getElementById('verifycodebtn');
    const resetoriginalText = resetpassbtn.innerHTML;
 resetpassbtn.innerHTML = '</i> Please wait... <i class="fas fa-spinner fa-spin">';
 resetpassbtn.disabled = true;
  try {
    const response = await fetch('/updateresetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password_reset_email: password_reset_email,
        new_password: new_password
        
      }),
    });

    const result = await response.json();
    
    if (response.ok) {
     resetpassbtn.innerHTML = resetoriginalText;
    resetpassbtn.disabled = false;
      displayFloatingCard(result.message, 'success');
      setTimeout(() => {
        window.location.href = '/login';
      }, 6000); // Redirect after 10 seconds
    } else {
        resetpassbtn.innerHTML = resetoriginalText;
    resetpassbtn.disabled = false;
      displayFloatingCard(result.error, 'error');
    }

  } catch (error) {
    resetpassbtn.innerHTML = resetoriginalText;
    resetpassbtn.disabled = false;
    displayFloatingCard('An error occurred. Please try again later.', 'error');
  }
  resetpassbtn.innerHTML = resetoriginalText;
    resetpassbtn.disabled = false;
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
  }, 4000);
}
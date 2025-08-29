// Your manual payment for
          const paymentsubmissionForm = document.getElementById("payment-form");
          paymentsubmissionForm.addEventListener("submit", async (event) => {
            event.preventDefault();
                            
            const phone = document.getElementById("phone").value.trim();
            const amount = parseFloat(document.getElementById('amount').value);
             const course = document.getElementById('coursepaid').textContent.trim();
            console.log("The course is:", course);
           
            const phoneNumberRegex = /^(2547\d{8}|07\d{8}|01\d{8})$/;

            // Basic client-side validation
            if (phone == "" || isNaN(amount) || amount <= 0) {
              document.getElementById("premium_error").style.display = "block";
              document.getElementById("premium_error").style.background = "rgb(240, 190, 190)";
              document.getElementById("premium_error").textContent = "Please fill all the fields";
              document.getElementById("premium_contact").style.outline = "solid red 1pt";
              document.getElementById("premium_error").style.color = "red";
              return;
            } else {
              document.getElementById("premium_error").style.display = "none";
            }
               
            if (!phoneNumberRegex.test(phone)) {
              document.getElementById("premium_error").style.display = "block";
              document.getElementById("premium_error").style.background = "rgb(240, 190, 190)";
              document.getElementById("premium_error").textContent = "Please input correct phone number";
              document.getElementById("premium_contact").style.outline = "solid red 1pt";
              document.getElementById("premium_error").style.color = "red";
              return;
            } else {
              document.getElementById("premium_error").style.display = "none";
            }
        
            document.getElementById("premium_error").style.display = "none";
            const contact = phone.startsWith('0') ? `254${phone.slice(1)}` : phone;
            
            const cancelpaymentbtn = document.getElementById('cancel-btn');
            const manualcancelpaymentbtn = document.getElementById('manualbtn');
            const paymentbtn = document.getElementById('paymentbtn');
            const originalText = paymentbtn.innerHTML;
            paymentbtn.innerHTML = '</i> Processing payment... <i class="fas fa-spinner fa-spin">';
            paymentbtn.disabled = true;

            const canceloriginalText = cancelpaymentbtn.innerHTML;
            cancelpaymentbtn.innerHTML = '</i><i class="fas fa-spinner fa-spin" style="color: green;"></i>';
            cancelpaymentbtn.disabled = true;
            manualcancelpaymentbtn.disabled = true;
            
            try {
              // Format phone number to international format (remove leading 0, add 254)
            //   const formattedPhone = phone.startsWith('0') ? `254${contact.slice(1)}` : contact;
              
              const response = await fetch('/premium-subscription', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  phone: phone,
                  amount: amount,
                  course: course
                  
                }),
              });
        
              const result = await response.json();
              if (response.ok) {
                paymentbtn.innerHTML = originalText;
                paymentbtn.disabled = false;
                cancelpaymentbtn.innerHTML = canceloriginalText;
                cancelpaymentbtn.disabled = false;
                document.getElementById("payment-status").textContent = result.message || 'Payment request submitted successfully. Pleas Check your phone to complete the transaction.';
                document.getElementById("payment-status").style.background = "green";
                document.getElementById("payment-status").style.color = "white";
                document.getElementById("payment-status").style.display = "block";
                // displayFloatingCard(result.message, 'success');
              } else {
                paymentbtn.innerHTML = originalText;
                paymentbtn.disabled = false;
                document.getElementById("payment-status").textContent = result.message || result.error || 'Payment failed';
                document.getElementById("payment-status").style.background = "rgb(240, 190, 190)";
                document.getElementById("payment-status").style.color = "red";
                document.getElementById("payment-status").style.display = "block";
                // displayFloatingCard(result.message || result.error, 'error');
              }
            } catch (error) {
            paymentbtn.innerHTML = originalText;
            paymentbtn.disabled = false;
            cancelpaymentbtn.innerHTML = canceloriginalText;
            cancelpaymentbtn.disabled = false;
            manualcancelpaymentbtn.disabled = false;

            document.getElementById("payment-status").textContent = 'An error occurred while processing your payment';
            document.getElementById("payment-status").style.display = "block";
            document.getElementById("payment-status").style.background = "rgb(240, 190, 190)";
            document.getElementById("payment-status").style.color = "red";

            console.error('Error:', error);
              // displayFloatingCard('An error occurred while processing your payment', 'error');
            }
          paymentbtn.innerHTML = originalText;
          paymentbtn.disabled = false;
          cancelpaymentbtn.innerHTML = canceloriginalText;
          cancelpaymentbtn.disabled = false;
          manualcancelpaymentbtn.disabled = false;

          document.getElementById("payment-status").textContent = 'An error occurred while processing your payment';
          document.getElementById("payment-status").style.display = "block";
          document.getElementById("payment-status").style.background = "rgb(240, 190, 190)";
          document.getElementById("payment-status").style.color = "red";

            // hideLoadingSpinner();
          });


//     document.addEventListener('DOMContentLoaded', () => {
//     // Load current profile data
//     fetch('/profile')
//         .then(res => res.json())
//         .then(data => {
//             document.getElementById('profile-img').src = data.profile_image || '/uploads/default-profile.jpg';
//             document.getElementById('profile-name').textContent = data.full_name;
//             document.getElementById('profile-role').textContent = data.role;
//         });

//     const fileInput = document.getElementById('profile-image-input');
//     const changeBtn = document.getElementById('change-profile-btn');

//     changeBtn.addEventListener('click', () => {
//         fileInput.click();
//     });

//     fileInput.addEventListener('change', () => {
//         const file = fileInput.files[0];
//         if (file) {
//             const formData = new FormData();
//             formData.append('profile_image', file);

//             fetch('/profile/image', {
//                 method: 'POST',
//                 body: formData
//             })
//             .then(res => res.json())
//             .then(data => {
//                 if (data.imagePath) {
//                     document.getElementById('profile-img').src = data.imagePath + '?t=' + new Date().getTime();
//                 } else {
//                     alert(data.error || 'Failed to update profile image');
//                 }
//             })
//             .catch(err => console.error(err));
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    // Load current profile data
    fetch('/profile')
        .then(res => res.json())
        .then(data => {
            const imgPath = data.profile_image || '/uploads/default-profile.jpg';
            document.getElementById('profile-img').src = imgPath;
            document.getElementById('sidebar-profile-img').src = imgPath;
            document.getElementById('profile-name').textContent = data.full_name;
            document.getElementById('profile-role').textContent = data.admission_number;
            document.getElementById('sidebar-profile-name').textContent = data.full_name;
            document.getElementById('username').textContent = data.full_name;
            document.getElementById('sidebar-profile-role').textContent = data.admission_number;
            document.getElementById('userstatus').textContent = data.status;

            if (data.status !== 'Active') {
              
                document.getElementById('activation-info2').style.display = 'block';
                document.getElementById('userstatus').style.color = 'red';
                document.getElementById('userstatus').style.backgroundColor = 'rgb(244, 234, 234)';

            }
        });

    const fileInput = document.getElementById('profile-image-input');
    const profileWrapper = document.querySelector('.profile-image-wrapper');

    // Clicking image or camera opens file input
    profileWrapper.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile_image', file);

            fetch('/profile/image', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.imagePath) {
                    const newImg = data.imagePath + '?t=' + new Date().getTime();
                    document.getElementById('profile-img').src = newImg;
                    document.getElementById('sidebar-profile-img').src = newImg;
                } else {
                    alert(data.error || 'Failed to update profile image');
                }
            })
            .catch(err => console.error(err));
        }
    });
});


//   }
// });

// Admission Number Generation
document.getElementById('generateAdmissionBtn').addEventListener('click', async () => {
  const btn = document.getElementById('generateAdmissionBtn');
  const resultEl = document.getElementById('admissionResult');

  btn.disabled = true;
btn.innerText = 'Please wait a moment... ';
const icon = document.createElement('i');
icon.className = 'fas fa-spinner fa-spin';
btn.appendChild(icon);
  try {
    const res = await fetch('/generate-admission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    // Reset styles before setting new ones
    resultEl.style.padding = '15px';
    resultEl.style.borderRadius = '8px';
    resultEl.style.fontSize = '16px';
    resultEl.style.display = 'block';
    resultEl.style.textAlign = 'center';

    if (res.ok && data.newly_generated) {
      // Green for newly generated admission
      resultEl.style.backgroundColor = '#28a745';
      resultEl.style.color = 'white';
      resultEl.innerHTML = `
        <i class="fas fa-thumbs-up" style="font-size:24px; margin-right:8px;"></i>
        <span style="font-weight:bold; font-size:20px;">Congratulations!</span><br>
        You are now an active student at <strong>BeyBoss</strong>.<br>
        Your admission number is <strong>${data.admission_number}</strong>.
        <p>Reload/Refresh your page to update your status</p>
      `;
      btn.innerText = 'Admission Number Generated';
    } 
    else {
      // Red for errors or already existing
      resultEl.style.backgroundColor = '#dc3545';
      resultEl.style.color = 'white';
      resultEl.innerHTML = `
        ${data.error || 'Looks like you are already an Active student with Admission:'}
        ${data.admission_number ? `<br>(${data.admission_number})` : ''}
      `;
      btn.disabled = data.admission_number ? true : false;
      btn.innerText = data.admission_number ? 'Already Generated' : 'Try Again';
    }

  } catch (err) {
    console.error(err);
    resultEl.style.backgroundColor = '#dc3545';
    resultEl.style.color = 'white';
    resultEl.innerHTML = 'Failed to connect to server.';
    btn.disabled = false;
    btn.innerText = 'Generate Admission Number';
  }
});


// Activation Modal

const activationTrigger = document.getElementById("activation-trigger");
    const activationModal = document.getElementById("activation-modal");
    const activationCancel = document.getElementById("activation-cancel");
    const activationConfirm = document.getElementById("activation-confirm");

    // Show modal on click
    activationTrigger.addEventListener("click", () => {
        activationModal.style.display = "flex";
    });

    // Hide modal on cancel
    activationCancel.addEventListener("click", () => {
        activationModal.style.display = "none";
    });

    //
    // Close modal when clicking outside card
    window.addEventListener("click", (e) => {
        if (e.target === activationModal) {
            activationModal.style.display = "none";
        }
    });


    //Log out logic
    // Confirm button: perform logout action
    document.getElementById('logout-btn').addEventListener('click', async () => {
      
        try {
            const response = await fetch("/logout", { method: "GET" });
            if (response.ok) {
                window.location.href = "/login"; // Redirect on successful logout
            } else {
                console.error("Error during logout:", response.statusText);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    });



    // profile
        
       
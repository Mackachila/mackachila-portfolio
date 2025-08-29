// /login
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../config/db');
const nodemailer = require('nodemailer');
const router = express.Router();


// Generate a secure random key

//  crypto.randomBytes(length).toString('hex');


// const secretKey = generateRandomKey(32);
// SELECT User Data route
router.get('/get-user', (req, res) => {
  const email = req.session.email;
  const query = 'SELECT username, email, contact FROM users WHERE email = ?';

  pool.promise().execute(query, [email])
    .then(([results]) => {
      if (results.length > 0) {
        return res.json(results[0]);
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});


  router.post('/userregistration', async (req, res) => {
    const { fullname, email, contact, password } = req.body;
  
    try {
    
    // Validate contact
      const validateContact = `SELECT * FROM users WHERE contact = ?`;
      const [contactResults] = await pool.promise().execute(validateContact, [contact]);
  
      if (contactResults.length > 0) {
        return res.status(400).json({ error: 'Phone number already registered.' });
      }

      // Check if the email already exists
      const validateEmail = `SELECT * FROM users WHERE email = ?`;
      const [emailResults] = await pool.promise().execute(validateEmail, [email]);
  
      if (emailResults.length > 0) {
        return res.status(400).json({ error: 'Email already registered.' });
      }
  
       
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      
      // Prepare the email
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 60000,
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      const mailOptions = {
        from: 'no-reply@beyboss.com',
        to: email,
        subject: 'BeyBoss Account Verification',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
            <h2 style="color: #007BFF; margin-bottom: 20px;">Welcome to BeyBos.</h2>
            <p style="font-size: 16px;">Please click the button below to verify your email address:</p>
            <a href="http://192.168.1.116:5000/activate/${verificationToken}"
               style="
                 display: inline-block;
                 padding: 10px 20px;
                 margin: 20px auto;
                 color: #fff;
                 background-color: #28a745;
                 text-decoration: none;
                 font-size: 16px;
                 border-radius: 5px;
               ">
              Activate your account
            </a>
            <p style="font-size: 14px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
          </div>
        `,
      };
  
      async function sendEmailWithRetry(mailOptions, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            await transporter.sendMail(mailOptions);
            return;
          } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === retries) throw error;
          }
        }
      }
  
      await sendEmailWithRetry(mailOptions);
  const role = 'student'; // Default role for new users
      // Insert the user into the database
      const insertQuery = `INSERT INTO users (full_name, contact, email, password_hash, role, verification_token) VALUES (?, ?, ?, ?, ?, ?)`;
      await pool.promise().execute(insertQuery, [fullname,contact, email,hashedPassword, role, verificationToken]);
      
    //   // Insert subscription
    //   const insertSubscriptions = `INSERT INTO dietmaster_subscriptions (email) VALUES (?)`;
    //   await pool.promise().execute(insertSubscriptions, [email]);
      
    //   // Add welcome notification
    //   const insertNotification = `INSERT INTO dietmaster_notifications (email, message, notification_type) VALUES (?, ?, ?)`;
    //   await pool.promise().execute(insertNotification, [
    //     email, 
    //     'Thanks for registering to DietMaster! We\'re excited to help you on your health journey.', 
    //     'welcome'
    //   ]);
  
      res.status(200).json({ message: 'Registration successful! Please check your email for an activation link.' });
    } catch (error) {
      console.error('Detailed error during registration:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      res.status(500).json({ error: 'Could not complete registration due to a technical issue. Please try again later.' });
    }
  });


  // Function to resend verification email
  router.post('/resend-activation', async (req, res) => {
    const { email } = req.body;
  
    try {
    
          // Check if the email already exists
      const validateEmailQuery = `SELECT 1 FROM users WHERE email = ? LIMIT 1`;
      const [emailResults] = await pool.promise().execute(validateEmailQuery, [email]);

      if (emailResults.length === 0) {
        return res.status(400).json({
          error: 'Wrong email address. Please provide your registered email.',
        });
      }

// Proceed with updating the verification_token...

      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      
      // Prepare the email
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 60000,
        tls: {
          rejectUnauthorized: false,
        },
      });
  
      const mailOptions = {
        from: 'no-reply@beyboss.com',
        to: email,
        subject: 'BeyBoss Account Verification',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
            <h2 style="color: #007BFF; margin-bottom: 20px;">Welcome to BeyBos.</h2>
            <p style="font-size: 16px;">You resent a verification email. This action has automatically deactivated your account if you have previously activated it. Please click the button below to verify your email address or to reactivate your account:</p>
            <a href="http://192.168.1.183:5000/activate/${verificationToken}"
               style="
                 display: inline-block;
                 padding: 10px 20px;
                 margin: 20px auto;
                 color: #fff;
                 background-color: #28a745;
                 text-decoration: none;
                 font-size: 16px;
                 border-radius: 5px;
               ">
              Activate your account
            </a>
            <p style="font-size: 14px; color: #666;">If you did not resend this email, please reset your password before you activate your account or activate the account and reset your password immediatly.</p>
          </div>
        `,
      };
  
      async function sendEmailWithRetry(mailOptions, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            await transporter.sendMail(mailOptions);
            return;
          } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === retries) throw error;
          }
        }
      }
  
          await sendEmailWithRetry(mailOptions);

          const resetvalue = 0;
      // Update the verification token in the database
          const updateQuery = `
          UPDATE users
          SET verification_token = ?, is_verified = ?
          WHERE email = ?
          `;
      await pool.promise().execute(updateQuery, [verificationToken, resetvalue, email]);
      res.status(200).json({ message: 'Verification email resent successfully! Please check your email for the activation link.' });
        } catch (error) {
      console.error('Detailed error during resending email:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      res.status(500).json({ error: 'Failed to resend verification Email. Please try again.' });
    }
  });
  


  router.get('/activate/:token', async (req, res) => {
    const { token } = req.params;

    console.log("the token is", token);
  
    const findUserQuery = `SELECT * FROM users WHERE verification_token = ?`;
    const [userResults] = await pool.promise().execute(findUserQuery, [token]);
  
    // Logging the verification token from the first result
    console.log("the found token is", userResults[0]?.verification_token);  // Safely access the token

    if (userResults.length === 0) {
      return res.status(400).send(` 
        <html>
          <head><title>Account Activation</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: red;">Error</h1>
            <p>The activation link is invalid or has expired.</p>
            <a href="/login" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px;">Go to Login</a>
          </body>
        </html>
      `);
    }

    // Verify token and activate account
    const updateQuery = `UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?`;
    try {
      await pool.promise().execute(updateQuery, [token]);
  
      // Render the success page
      res.status(200).send(`
        <html>
          <head>
            <title>Account Activated</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin-top: 50px;
              }
              h1 {
                color: green;
              }
              a {
                text-decoration: none;
                color: white;
                background-color: #007bff;
                padding: 10px 20px;
                border-radius: 5px;
              }
              a:hover {
                background-color: #0056b3;
              }
            </style>
          </head>
          <body>
            <h1>You have successfully verified your email</h1>
            <p>You have successfully verified your email and activated your account.</p>
            <a href="/login">Proceed to Login</a>
          </body>
        </html>
      `);
    } catch (error) {
      // Log the error for debugging purposes
      console.error('Activation error:', error);
    
      // Optionally log more details such as the stack trace or specific properties of the error
      console.error('Error message:', error.message);
      console.error('Error stack trace:', error.stack);
    
      // Send the error page to the user
      res.status(500).send(`
        <html>
          <head><title>Activation Error</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: red;">Activation Failed</h1>
            <p>An error occurred while activating your account. Please try again later.</p>
            <a href="/login" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px;">Go to Login</a>
          </body>
        </html>
      `);
    }
});

 
  // //loging handling route
  // router.post('/login', async (req, res) => {
  //   try {
   
  //     const { login_email, login_password } = req.body;
  
  //     // Validate input fields
  //     if (!login_email || !login_password) {
  //       return res.status(400).json({ error: 'Email and password are required.' });
  //     }
  
  //     // Get a database connection
  //     pool.getConnection((err, connection) => {
  //       if (err) {
  //         console.error('Connection error:', err);
  //         return res.status(500).json({ error: 'Database connection error.' });
  //       }
  
  //       // Query the database
  //       const sql = `SELECT * FROM users WHERE email = ? AND role = ? `;
  //       connection.query(sql, [login_email, 'student'], async (err, results) => {
  //       connection.release(); // Ensure connection is released
        

  //         if (err) {
  //           console.error('Query error:', err);
  //           return res.status(500).json({ error: 'Database query error.' });
  //         }
  
  //         if (results.length === 0) {
  //           return res.status(400).json({ error: 'Invalid student credentials.' });
  //         }
  
  //         const user = results[0];
  
  //         // Check email verification
  //         if (!user.is_verified) {
  //           return res.status(400).json({ error: 'Please check your email to activate your account.' });
  //         }
                   
  
  //         // Validate password
  //         const match = await bcrypt.compare(login_password, user.password_hash);
  //         if (!match) {
  //           return res.status(400).json({ error: 'Invalid student credentials.' });
  //         }
  
  //         // Store email in session
  //         req.session.email = user.email;
  //         req.session.role = user.role; // 
  //         // req.session.email = login_email;
           
  //         res.status(200).json({ message: 'Login successful!' });
  //       });
  //     });
  //   } catch (err) {
  //     console.error('Error during login:', err);
  //     res.status(500).json({ error: 'An error occurred during login.' });
  //   }
  // });

  // login handling route
router.post('/login', async (req, res) => {
  try {
    const { login_email, login_password } = req.body;

    // Validate input fields
    if (!login_email || !login_password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Get a database connection
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Connection error:', err);
        return res.status(500).json({ error: 'Database connection error.' });
      }

      // Query the database
      const sql = `SELECT * FROM users WHERE email = ? AND role = ?`;
      connection.query(sql, [login_email, 'student'], async (err, results) => {
        if (err) {
          connection.release();
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Database query error.' });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(400).json({ error: 'Invalid student credentials.' });
        }

        const user = results[0];

        // Check email verification
        if (!user.is_verified) {
          connection.release();
          return res.status(400).json({ error: 'Please check your email to activate your account.' });
        }

        // Validate password
        const match = await bcrypt.compare(login_password, user.password_hash);
        if (!match) {
          connection.release();
          return res.status(400).json({ error: 'Invalid student credentials.' });
        }

        // Store session info
        req.session.email = user.email;
        req.session.role = user.role;

        // Insert login activity into activities table
        const logSql = `
          INSERT INTO activities (user_id, activity_type, description)
          VALUES (?, 'login', ?)
        `;
        const description = `Successful login to your account.`;

        connection.query(logSql, [user.user_id, description], (logErr) => {
          connection.release();
          if (logErr) {
            console.error('Activity log error:', logErr);
            // Do not block login success if log fails
          }

          res.status(200).json({ message: 'Login successful!' });
        });
      });
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred during login.' });
  }
});




// admission generation route
router.post('/generate-admission', (req, res) => {
  try {
    if (!req.session.email || !req.session.role) {
      return res.status(401).json({ error: 'You must be logged in to generate an admission number.' });
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Connection error:', err);
        return res.status(500).json({ error: 'Database connection error.' });
      }

      // Step 1: Fetch user
      const getUserSql = `SELECT * FROM users WHERE email = ?`;
      connection.query(getUserSql, [req.session.email], (err, results) => {
        if (err) {
          connection.release();
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Database query error.' });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ error: 'User not found.' });
        }

        const user = results[0];

        // Step 2: Check if already has admission number
        if (user.admission_number) {
          connection.release();
          return res.status(200).json({
            newly_generated: false,
            admission_number: user.admission_number,
            message: 'Admission number already exists.'
          });
        }

        // Step 3: Generate admission number
        const rolePrefix = (user.role === 'student') ? 'STD' : (user.role === 'tutor' ? 'TTR' : null);
        if (!rolePrefix) {
          connection.release();
          return res.status(400).json({ error: 'Only students and tutors can have admission numbers.' });
        }

        const collegeCode = 'BBS';
        const year = new Date().getFullYear().toString().slice(-2);

        const seqSql = `
          SELECT IFNULL(MAX(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(admission_number, '/', 3), '/', -1) AS UNSIGNED)), 0) + 1 AS next_num
          FROM users
          WHERE role = ? AND admission_number LIKE CONCAT(?, '/', ?, '/%', '/', ?)
        `;
        connection.query(seqSql, [user.role, rolePrefix, collegeCode, year], (err, seqResult) => {
          if (err) {
            connection.release();
            console.error('Sequence query error:', err);
            return res.status(500).json({ error: 'Error generating sequence.' });
          }

          const nextNum = seqResult[0].next_num;
          const admissionNumber = `${rolePrefix}/${collegeCode}/${String(nextNum).padStart(4, '0')}/${year}`;

          // Step 4: Update user and send email
          const updateSql = `UPDATE users SET admission_number = ?, status = 'Active' WHERE user_id = ?`;
          connection.query(updateSql, [admissionNumber, user.user_id], async (err) => {
            connection.release();
            if (err) {
              console.error('Update error:', err);
              return res.status(500).json({ error: 'Error updating admission number.' });
            }

            // Prepare email
            const transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              },
              connectionTimeout: 60000,
              tls: { rejectUnauthorized: false },
            });

            const mailOptions = {
              from: 'no-reply@beyboss.com',
              to: req.session.email,
              subject: 'BeyBoss Student Activation',
              html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
                  <h2 style="color: #007BFF; margin-bottom: 20px;">Welcome to BeyBoss once again ${req.session.email}.</h2>
                  <p style="font-size: 16px;"><b>Congratulations</b> you are now an active student at BeyBoss. You can now enroll in a course to start your tech journey with professionals.<br> Your admission number is: <b>${admissionNumber}</b>.</p>
                  <p style="font-size: 14px; color: #666;">If you didn't activate your account, please contact us immediately via this same email.</p>
                </div>
              `,
            };

            // Try sending email, but don't block success if it fails
            try {
              await transporter.sendMail(mailOptions);
              console.log('Activation email sent successfully');
            } catch (emailError) {
              console.error('Email sending failed:', emailError);
            }

            // Respond success regardless of email outcome
            res.status(200).json({
              newly_generated: true,
              admission_number: admissionNumber,
              message: 'Admission number generated successfully!'
            });
          });
        });
      });
    });
  } catch (err) {
    console.error('Error generating admission:', err);
    res.status(500).json({ error: 'An error occurred.' });
  }
});






// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error logging out.');
    }
    res.redirect('/beybos');
  });
});

module.exports = router;

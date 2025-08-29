//updateresetpassword
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../config/db');
const nodemailer = require('nodemailer');
const router = express.Router();

// Password reset endpoint
router.post('/passwordreset', async (req, res) => {
    const { password_reset_email } = req.body;
  
    try {
        // Check if email exists in the database
        const query = `SELECT * FROM users WHERE email = ? AND role = 'student'`;
        const [result] = await pool.promise().execute(query, [password_reset_email]);
  
        if (result.length === 0) {
          return res.status(400).json({ error: 'Incorrect Email Address.' });
        }
  
        // Generate a 6-digit random code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
        // Store the reset code securely (hashed) in the database
        const hashedResetCode = await bcrypt.hash(resetCode, 10);
        const updateQuery = `UPDATE users SET password_reset = ? WHERE email = ?`;
        await pool.promise().execute(updateQuery, [hashedResetCode, password_reset_email]);
  
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
            from: 'no-reply@yourdomain.com',
            to: password_reset_email,
            subject: 'Beyboss Password Reset',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
                    <h2 style="color: #007BFF;">Password Reset Code</h2>
                    <p>Dear ${password_reset_email}, We recieved a request to reset your password. Your password reset code is:</p>
                    <h3 style="color: #28a745;">${resetCode}</h3>
                    <p style="font-size: 14px; color: #666;">If you didn't send this code, you don't need to do anything. This code will expire after 5 minutes or upon a new code request.</p>
                </div>
            `,
        };
  
        // Send the email
        await transporter.sendMail(mailOptions);
  
        res.status(200).json({ message: 'Password reset code sent successfully. Check your email.' });
        console.log(`Password reset code sent to ${password_reset_email}`);
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'Internal server error occurred. Please try again later.' });
    }
  });
  
  // Password reset verification endpoint
  router.post('/verifyreset_code', async (req, res) => {
    const { password_reset_email, reset_code } = req.body;
    console.log(`Received reset code verification request for email: ${password_reset_email}`);
  
    try {
        // Retrieve the hashed reset code from the database
        const query = `SELECT password_reset FROM users WHERE email = ? AND role = 'student'`;
        const [result] = await pool.promise().execute(query, [password_reset_email]);
  
        if (result.length === 0 || !result[0].password_reset) {
            return res.status(400).json({ error: 'Invalid or expired reset code.' });
        }
  
        const storedHashedCode = result[0].password_reset;
  
        // Compare the provided code with the stored hash
        const isValidCode = await bcrypt.compare(reset_code, storedHashedCode);
  
        if (!isValidCode) {
            return res.status(400).json({ error: 'Invalid reset code.' });
        }
  
        // Clear the reset code after successful verification
        const clearQuery = `UPDATE users SET password_reset = NULL WHERE email = ? AND role = 'student'`;
        await pool.promise().execute(clearQuery, [password_reset_email]);
  
        res.status(200).json({ message: 'Reset code verified. You may now reset your password.' });
    } catch (error) {
        console.error('Error verifying reset code:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
  });
  
  // Password update endpoint
  router.post('/updateresetpassword', async (req, res) => {
    const { password_reset_email, new_password } = req.body;
    if (!password_reset_email) {
      return res.status(400).json({ error: 'Email is required.' });
  }
  
    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(new_password, 10);

         // Update the password in the database
         const updateQuery = `UPDATE users SET password_hash = ? WHERE email = ? AND role = 'student'`;
         await pool.promise().execute(updateQuery, [hashedPassword, password_reset_email]);
   
         
  
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
          from: 'no-reply@yourdomain.com',
          to: password_reset_email,
          subject: 'Beyboss Password Reset successful',
          html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; text-align: center;">
                  <h2 style="color: #007BFF;">Password Reset Susscessful</h2>
                  <p>Dear ${password_reset_email}, Your Beyboss account password reset was successful. If you did not request for this, please contact us on our support email: <b style="color: #007BFF;">beybosstech@gmail.com</b> immediately.
              
              </div>
          `,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Password reset successfully.' });
  
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'An error occurred. Please try again later.' });
    }
  });

  module.exports = router;
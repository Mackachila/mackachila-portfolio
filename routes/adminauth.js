
const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { pool } = require('../config/db');
const nodemailer = require('nodemailer');
const router = express.Router();


//loging handling route
  router.post('/adminlogin', async (req, res) => {
  try {
    const { login_email, login_password } = req.body;

    if (!login_email || !login_password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error('DB connection error:', err);
        return res.status(500).json({ error: 'Database connection error.' });
      }

      const sql = `SELECT * FROM users WHERE email = ? AND role = ?`;
      connection.query(sql, [login_email, 'admin'], async (err, results) => {
        connection.release();

        if (err) {
          console.error('Query error:', err);
          return res.status(500).json({ error: 'Database query error.' });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const user = results[0];
        const match = await bcrypt.compare(login_password, user.password_hash);
        if (!match) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Standard session setup
        req.session.email = user.email;
        req.session.role = user.role; // 

        return res.status(200).json({ message: 'Admin login successful.' });
      });
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


  module.exports = router;
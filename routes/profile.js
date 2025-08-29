// Configure Multer for profile images
const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif/;
        const extname = allowed.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowed.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// 📌 Route: Get profile data
router.get('/profile', async (req, res) => {
    if (!req.session || !req.session.email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const [rows] = await pool.promise().execute(
            'SELECT full_name, admission_number, status, profile_image FROM users WHERE email = ?',
            [req.session.email]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// 📌 Route: Update profile image
router.post('/profile/image', upload.single('profile_image'), async (req, res) => {
    if (!req.session || !req.session.email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    try {
        await pool.promise().execute(
            'UPDATE users SET profile_image = ? WHERE email = ?',
            [imagePath, req.session.email]
        );
        res.json({ message: 'Profile image updated successfully', imagePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error updating profile image' });
    }
});

module.exports = router;
// server/routes/courses.js

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



// Set up upload once
const upload = multer({ storage: storage });


router.post('/addcourse', upload.single('course_image'), async (req, res) => {
    const {
        course_name,
        addcategory,
        course_description,
        course_duration,
        course_fees,
        course_qualification
    } = req.body;

    const created_by_email = req.session.email;
    const created_by_role = req.session.role;

    if (!created_by_email || !created_by_role) {
        return res.status(401).json({ error: 'Unauthorized: Unauthorized user detected' });
    }

    try {
        const [userRows] = await pool.promise().execute(
            'SELECT user_id FROM users WHERE email = ? AND role = "admin"',
            [created_by_email]
        );

        if (userRows.length === 0) {
            return res.status(400).json({ error: 'Unauthorized user detected.' });
        }

        const created_by = userRows[0].user_id;

        const [existingCourse] = await pool.promise().execute(
            'SELECT course_id FROM courses WHERE course_name = ?',
            [course_name]
        );

        if (existingCourse.length > 0) {
            return res.status(409).json({ error: 'This course already exists.' });
        }

        // Handle uploaded file
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const query = `
            INSERT INTO courses (course_name, category, description, duration_weeks, fee, qualification, created_by, image_path)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.promise().execute(query, [
            course_name,
            addcategory,
            course_description,
            course_duration,
            course_fees,
            course_qualification,
            created_by,
            imagePath
        ]);

        res.status(200).json({ message: 'Course added successfully' });
    } catch (error) {
        console.error('Error inserting course:', error);
        res.status(500).json({ error: 'Database error occurred while adding course.' });
    }
});



router.get('/courses/:name', async (req, res) => {
    const courseName = req.params.name;

    try {
        const [rows] = await pool.promise().execute(
            'SELECT * FROM courses WHERE course_name = ?',
            [courseName]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Course not found.' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error during course lookup.' });
    }
});


// router.put('/editcourse/:name', async (req, res) => {
//     const originalName = req.params.name;
//     const { course_name, course_description, course_duration, course_fees, course_qualification } = req.body;

//     try {
//         const [result] = await pool.promise().execute(
//             `UPDATE courses
//              SET course_name = ?, description = ?, duration_weeks = ?, fee = ?, qualification = ?
//              WHERE course_name = ?`,
//             [course_name, course_description, course_duration, course_fees, course_qualification, originalName]
//         );

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'Course not found or no changes made.' });
//         }

//         res.status(200).json({ message: 'Course updated successfully.' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Database error during course update.' });
//     }
// });

router.put('/editcourse/:name', upload.single('image'), async (req, res) => {
    const originalName = req.params.name;
    const {
        course_name,
        category,
        course_description,
        course_duration,
        course_fees,
        course_qualification
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // Update with or without new image
        const query = `
            UPDATE courses SET
                course_name = ?, category = ?, description = ?, duration_weeks = ?, fee = ?, qualification = ?
                ${imagePath ? ', image_path = ?' : ''}
            WHERE course_name = ?
        `;

        const params = imagePath
            ? [course_name, category, course_description, course_duration, course_fees, course_qualification, imagePath, originalName]
            : [course_name, category, course_description, course_duration, course_fees, course_qualification, originalName];

        const [result] = await pool.promise().execute(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found or no changes made.' });
        }

        res.status(200).json({ message: 'Course updated successfully.' });
    } catch (error) {
        console.error('Edit course error:', error);
        res.status(500).json({ error: 'Database error during course update.' });
    }
});


// DELETE endpoint to delete a course by name
router.delete('/deletecourse/:course_name', async (req, res) => {
    const { course_name } = req.params;

    try {
        // Check if course exists
        const [rows] = await pool.promise().execute(
            'SELECT * FROM courses WHERE course_name = ?',
            [course_name]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Delete the course
        await pool.promise().execute(
            'DELETE FROM courses WHERE course_name = ?',
            [course_name]
        );

        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Failed to delete course from database' });
    }
});



module.exports = router;

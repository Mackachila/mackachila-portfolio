const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

router.get('/student/activities', async (req, res) => {
    if (!req.session || !req.session.email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Get user_id
        const [userRows] = await pool.promise().execute(
            'SELECT user_id FROM users WHERE email = ?',
            [req.session.email]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userRows[0].user_id;

        // Fetch 5 latest activities
        const [activities] = await pool.promise().execute(
            `SELECT activity_type, description, created_at 
             FROM activities 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [userId]
        );

        res.json(activities);
    } catch (err) {
        console.error('Error fetching activities:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
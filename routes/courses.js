const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
// const multer = require('multer');
// const path = require('path');

// router.get('/courses', async (req, res) => {
//   const { search = '', category = '' } = req.query;

//   try {
//     let query = `SELECT * FROM courses WHERE 1`;
//     const params = [];

//     if (search) {
//       query += ` AND course_name LIKE ?`;
//       params.push(`%${search}%`);
//     }

//     // if (category && category !== 'All Categories') {
//     //   query += ` AND qualification = ?`;
//     //   params.push(category);
//     // }
//     if (category && category !== 'All Categories') {
//   query += ` AND category = ?`;
//   params.push(category);
// }

//     const [courses] = await pool.promise().execute(query, params);
//     res.json(courses);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Database error during course fetching.' });
//   }
// });

router.get('/courses', async (req, res) => {
    const { search = '', category = '' } = req.query;

    let userId = null;
    if (req.session && req.session.email) {
        // Fetch the user_id from DB using the email in session
        try {
            const [userRows] = await pool.promise().execute(
                'SELECT user_id FROM users WHERE email = ? LIMIT 1',
                [req.session.email]
            );
            if (userRows.length > 0) {
                userId = userRows[0].user_id;
            }
        } catch (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).json({ error: 'Database error fetching user ID.' });
        }
    }

    try {
        let query = `
            SELECT 
                c.course_id,
                c.course_name,
                c.category,
                c.description,
                c.duration_weeks,
                c.fee,
                c.image_path,
                sc.status AS student_status,
                sc.fee_balance
            FROM courses c
            LEFT JOIN student_courses sc 
                ON c.course_id = sc.course_id 
                ${userId ? 'AND sc.student_id = ?' : ''}
            WHERE 1
        `;

        const params = [];
        if (userId) params.push(userId);

        if (search) {
            query += ` AND c.course_name LIKE ?`;
            params.push(`%${search}%`);
        }

        if (category && category !== 'All Categories') {
            query += ` AND c.category = ?`;
            params.push(category);
        }

        const [courses] = await pool.promise().execute(query, params);
        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error during course fetching.' });
    }
});





// POST /manual-payment/verify
router.post('/manual-payment/verify', async (req, res) => {
  if (!req.session || !req.session.email) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { transactionCode, courseName, firstDepositMin } = req.body;

  if (!transactionCode || !courseName) {
    return res.status(400).json({ success: false, error: 'Missing transactionCode or courseName' });
  }

  try {
    // 1) Get student (from session email)
    const [userRows] = await pool.promise().execute(
      'SELECT user_id FROM users WHERE email = ?',
      [req.session.email]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const studentId = userRows[0].user_id;

    // 2) Find payment by receipt_number (transaction code)
    const [paymentRows] = await pool.promise().execute(
      'SELECT payment_id, amount, status FROM payments WHERE receipt_number = ? LIMIT 1',
      [transactionCode]
    );
    if (paymentRows.length === 0) {
      return res.status(400).json({ success: false, error: 'Transaction code not found' });
    }
    const payment = paymentRows[0];
    if (payment.status !== 'unused') {
      return res.status(400).json({ success: false, error: 'Transaction already used or invalid' });
    }
    const paymentAmount = parseFloat(payment.amount);

    // 3) Resolve course by name (you said courseName is unique)
    const [courseRows] = await pool.promise().execute(
      'SELECT course_id, fee FROM courses WHERE course_name = ? LIMIT 1',
      [courseName]
    );
    if (courseRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    const courseId = courseRows[0].course_id;
    const courseFee = parseFloat(courseRows[0].fee || 0);

    // 4) Check if student already enrolled to determine first deposit
    const [enrollRows] = await pool.promise().execute(
      'SELECT id, fee_balance FROM student_courses WHERE student_id = ? AND course_id = ? LIMIT 1',
      [studentId, courseId]
    );
    const isFirstDeposit = enrollRows.length === 0;

    // 5) If first deposit, validate min
    if (isFirstDeposit) {
      if (firstDepositMin === undefined || firstDepositMin === null) {
        return res.status(400).json({ success: false, error: 'firstDepositMin required for first deposit' });
      }
      if (paymentAmount < Number(firstDepositMin)) {
        return res.status(400).json({
          success: false,
          error: `First deposit must be at least KES ${Number(firstDepositMin)}`
        });
      }
    }

    // 6) Use a DB transaction to mark payment used and update/insert student_courses atomically
    const conn = await pool.promise().getConnection();
    try {
      await conn.beginTransaction();

      // mark payment as used and attach to student
      await conn.execute(
        'UPDATE payments SET status = ?, student_id = ? WHERE payment_id = ?',
        ['used', studentId, payment.payment_id]
      );

      let finalBalance = 0;

      if (isFirstDeposit) {
        // Calculate balance = course fee - payment amount (never negative)
        finalBalance = Math.max(0, courseFee - paymentAmount);

        // Insert enrollment. Using status 'active' (your student_courses enum has 'active')
        await conn.execute(
          'INSERT INTO student_courses (student_id, course_id, fee_balance, status) VALUES (?, ?, ?, ?)',
          [studentId, courseId, finalBalance, 'active']
        );
      } else {
        // Subsequent payment: deduct from existing fee_balance (if null, treat as courseFee)
        const currentBalance = enrollRows[0].fee_balance === null
          ? courseFee
          : parseFloat(enrollRows[0].fee_balance);

        finalBalance = Math.max(0, currentBalance - paymentAmount);

        await conn.execute(
          'UPDATE student_courses SET fee_balance = ? WHERE id = ?',
          [finalBalance, enrollRows[0].id]
        );
      }

      await conn.commit();
      conn.release();

      return res.json({
        success: true,
        message: isFirstDeposit
          ? 'First payment verified — student enrolled and fee balance set.'
          : 'Payment verified and fee balance updated.',
        fee_balance: finalBalance
      });

    } catch (txErr) {
      await conn.rollback();
      conn.release();
      console.error('Transaction error:', txErr);
      return res.status(500).json({ success: false, error: 'Database transaction failed' });
    }

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});



router.get('/student/courses', async (req, res) => {
    if (!req.session || !req.session.email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Get the student_id from email
        const [userRows] = await pool.promise().execute(
            'SELECT user_id FROM users WHERE email = ?',
            [req.session.email]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentId = userRows[0].user_id;

        // Fetch the registered courses for this student
        const [courses] = await pool.promise().execute(
            `SELECT 
                sc.id AS student_course_id,
                sc.course_id,
                c.course_name,
                sc.status,
                sc.fee_balance,
                sc.registration_date
             FROM student_courses sc
             JOIN courses c ON sc.course_id = c.course_id
             WHERE sc.student_id = ?
             ORDER BY sc.registration_date DESC`,
            [studentId]
        );

        // ---- COUNT LOGIC ----
        let registeredCount = 0;
        let inProgressCount = 0;
        let completedCount = 0;
        let deferredCount = 0;

        courses.forEach(course => {
            if (course.status !== 'withdrawn') {
                registeredCount++;
            }
            if (course.status === 'active') {
                inProgressCount++;
            } else if (course.status === 'completed') {
                completedCount++;
            } else if (course.status === 'deferred') {
                deferredCount++;
            }
        });

        res.json({
            counts: {
                registered: registeredCount,
                inProgress: inProgressCount,
                completed: completedCount,
                deferred: deferredCount
            },
            courses
        });

    } catch (err) {
        console.error('Error fetching student courses:', err);
        res.status(500).json({ error: 'Database error' });
    }
});


module.exports = router;

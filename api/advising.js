const jwt = require('jsonwebtoken');
const pool = require('./db.js');

const JWT_SECRET = process.env.JWT_SECRET || '9f8a7b6c5d4e3f2g1h0j';

function authenticateToken(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return { error: 'Access denied. No token provided.', status: 401 };
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { user: decoded };
    } catch (err) {
        return { error: 'Invalid or expired token.', status: 403 };
    }
}

module.exports = async (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const auth = authenticateToken(req);
    if (auth.error) {
        return res.status(auth.status).json({ error: auth.error });
    }

    const user_id = auth.user.user_id;
    const { date, start_time, end_time } = req.body;

    if (!date || !start_time || !end_time) {
        return res.status(400).json({
            error: 'Please select a date, start time, and end time for the appointment.'
        });
    }

    try {
        const sql = `
            INSERT INTO advising (user_id, date, start_time, end_time)
            VALUES (?, ?, ?, ?)
        `;

        const values = [user_id, date, start_time, end_time];

        await pool.query(sql, values);

        res.status(201).json({ message: 'Appointment booked successfully!' });

    } catch (error) {
        console.error('Appointment booking error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'The selected time slot is already reserved.' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: 'User not found. Please log in again.' });
        }

        res.status(500).json({ error: 'Failed to record appointment due to a server error.' });
    }
};

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
    const { service_id, event_date, event_time, eventEndTime, guest_count } = req.body;

    if (!service_id || !event_date || !event_time || !eventEndTime || !guest_count) {
        return res.status(400).json({
            error: 'Missing required booking fields (service type, date, start time, end time, and guest count).'
        });
    }

    try {
        const sql = `
            INSERT INTO Bookings (user_id, option_id, guest_count, event_date, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [user_id, service_id, guest_count, event_date, event_time, eventEndTime];

        await pool.query(sql, values);

        res.status(201).json({ message: 'Booking submitted successfully!' });

    } catch (error) {
        console.error('Booking submission error:', error);
        res.status(400).json({ error: 'Database insertion failed. Check your Bookings table.' });
    }
};

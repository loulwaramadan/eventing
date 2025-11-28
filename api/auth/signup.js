const bcrypt = require('bcryptjs');
const pool = require('../db.js');

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

    const { username, email, password, first_name, last_name } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const sql = `
            INSERT INTO loginsignup (username, email, password, first_name, last_name)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [username, email, password_hash, first_name || '', last_name || ''];

        const [result] = await pool.query(sql, values);

        res.status(201).json({ message: 'User registered successfully!', user_id: result.insertId });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            const field = error.sqlMessage.includes('username') ? 'Username' : 'Email';
            return res.status(409).json({ error: `${field} is already in use.` });
        }
        console.error('Sign Up error:', error);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
};

// server.js (Final and Correct Version)

const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('../frontend/public/db.js'); // Correct database import
const path = require("path"); // Correct path import

const JWT_SECRET = '9f8a7b6c5d4e3f2g1h0j'; 
const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors()); 
app.use(express.json()); 
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        
        req.user = decoded; 
        next(); 
    });
};

app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password, first_name, last_name } = req.body;

    if (!username || !email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const sql = `
            INSERT INTO loginsignup (username, email, password, first_name, last_name)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [username, email, password_hash, first_name, last_name];

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
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password.' });
    }

    try {
        const sql = 'SELECT user_id, password FROM loginsignup WHERE username = ? OR email = ?';
        const [rows] = await pool.query(sql, [username, username]);
        const user = rows[0]; 

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password); 

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }

        // JWT Generation
        const token = jwt.sign(
            { user_id: user.user_id },
            JWT_SECRET,    
            { expiresIn: '1h' }        
        );
        
        res.json({
            message: 'Login successful!',
            token: token,
            user_id: user.user_id 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

// -----------------------------------------------------------------
// 📝 POST: Submit a New Booking (Requires Authentication)
// -----------------------------------------------------------------
app.post('/api/bookings', authenticateToken, async (req, res) => {
    const user_id = req.user.user_id; 

    // Retrieve data from the frontend (eventForm.js)
    const { 
        service_id, event_date, event_time, 
        guest_count, location, notes 
    } = req.body;

    // Frontend is sending 'eventStartTime' in event_time, but we need the end time too.
    const event_start_time = req.body.event_time; 
    const event_end_time = req.body.eventEndTime; // Assuming eventForm.js sends this now

    // Validate essential fields
    if (!service_id || !event_date || !event_start_time || !event_end_time || !guest_count) {
         return res.status(400).json({ error: 'Missing required booking fields (service type, date, start time, end time, and guest count).' });
    }

    try {
        
        const sql = `
            INSERT INTO Bookings (user_id, option_id, event_type, guest_count, event_datedate, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const insertionSql = `
            INSERT INTO Bookings (user_id, option_id, guest_count, event_date, start_time, end_time)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            user_id, 
            service_id,
            guest_count, 
            event_date, 
            event_start_time, 
            event_end_time || '23:59:59' 
        ];

        await pool.query(insertionSql, values);
        
        res.status(201).json({ message: 'Booking submitted successfully!' });

    } catch (error) {
        console.error('Booking submission error:', error);
        res.status(400).json({ error: 'Database insertion failed. Check your Bookings table column names and data types.' });
    }
});


app.post('/api/advising', authenticateToken, async (req, res) => {

    const user_id = req.user.user_id; 
    
    
    const { 
        date, start_time, end_time
    } = req.body;

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
        
        // Handle Foreign Key or Duplicate Entry errors
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ error: 'The selected time slot is already reserved.' });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ error: 'User not found. Please log in again.' });
        }
        
        res.status(500).json({ error: 'Failed to record appointment due to a server error.' });
    }
});
// -----------------------------------------------------------------
// 🧪 Test Protected Route (GET /api/test-protected)
// -----------------------------------------------------------------
app.get('/api/test-protected', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Access granted!',
        user_id_from_token: req.user.user_id,
        info: 'JWT verification is working.'
    });
});
/*app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});*/

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

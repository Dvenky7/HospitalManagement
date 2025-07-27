const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// This line imports the database configuration we just created
const pool = require('../config/db.config');

// Controller function to handle user registration
exports.register = async (req, res) => {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    try {
        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert the new user into the database
        const newUser = await pool.query(
            "INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, role",
            [email, passwordHash, fullName, role]
        );

        res.status(201).json({
            message: 'User registered successfully!',
            user: newUser.rows[0],
        });
    } catch (error) {
        console.error(error);
        // Handle cases where the email already exists
        if (error.code === '23505') {
             return res.status(409).json({ message: 'Email already exists.' });
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Controller function to handle user login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const payload = { id: user.id, role: user.role, name: user.full_name };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Logged in successfully!',
            token: token,
            user: payload
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

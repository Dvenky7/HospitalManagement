require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
// Import the routes we just created
const authRoutes = require('./api/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

// This is the crucial line: it tells the server to use our auth routes
// for any URL that starts with "/api/auth"
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Hospital Management API is running...');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});

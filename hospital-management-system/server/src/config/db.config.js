const { Pool } = require('pg');
require('dotenv').config({ path: '../../.env' }); // Looks for .env in the root server folder

// This creates a pool of connections to your PostgreSQL database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = pool;

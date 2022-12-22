const dotenv = require('dotenv');
dotenv.config();

const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY ID ASC', (err, results) => {
        if (err) {
            throw error
        }
        res.status(200).json(results.rows)
    })
};


module.exports = {
    getUsers
};
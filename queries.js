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
    pool.query('SELECT * FROM users ORDER BY ID ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
};


const getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

const createUser = (req, res) => {
    const {first_name, last_name, username, password, email} = req.body;
    pool.query('INSERT INTO users (first_name, last_name, username, password, email) VALUES ($1, $2, $3, $4, $5) RETURNING *', [first_name, last_name, username, password, email], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
};

const updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const {first_name, last_name, username, password, email} = req.body;
    pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, username = $3, password = $4, email = $5 WHERE id = $6',
        [first_name, last_name, username, password, email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`User updated with ID: ${id}.`)
        }
    )
}

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id); 
    pool.query('DELETE FROM users WHERE id=$1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`User deleted with ID: ${id}.`)
    })
}

//creates a gratitude item given a user ID. Will auto populate with the user id given in the url.
const createGratitude = (req, res) => {
    const id_users = parseInt(req.params.id_users)
    const {gratitude_item} = req.body;
    pool.query('INSERT INTO gratitude_items (id_users, date, gratitude_item) VALUES ($1, current_date, $2) RETURNING *', [id_users, gratitude_item], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Gratitude added with ID: ${results.rows[0].id}`)
    })
};


const getGratitudeByUserId = (req, res) => {
    const id_users = parseInt(req.params.id_users);
    pool.query('SELECT gratitude_item FROM gratitude_items WHERE id_users=$1', [id_users], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows);
    })
}

const deleteGratitude = (req, res) => {
    const id = parseInt(req.params.id); 
    pool.query('DELETE FROM gratitude_items WHERE id=$1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Gratitude item deleted with ID: ${id}.`)
    })
}


const updateGratitude = (req, res) => {
    const id = parseInt(req.params.id);
    const {gratitude_item} = req.body;
    pool.query(
        'UPDATE gratitude_items SET gratitude_item = $1 WHERE id = $2',
        [gratitude_item, id],
        (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).send(`Gratitude item updated with ID: ${id}.`)
        }
    )
}


module.exports = {
    getUsers,
    getUserById,
    createUser, 
    updateUser,
    deleteUser,
    createGratitude,
    getGratitudeByUserId,
    deleteGratitude,
    updateGratitude
};
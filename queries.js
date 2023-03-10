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

async function getUserByGoogleId(googleId) {
    try {
        const results = await pool.query('SELECT first_name FROM users WHERE google_id = $1', [googleId]);
        return results.rows[0]['first_name'];
    }
    catch (err) {
        console.log(`Query error!!: ${JSON.stringify(err)}`);
    }
}


async function createUser(user) {
    const {first_name, last_name, username, password, email, google_id} = user;
    try {
        const result = await pool.query('INSERT INTO users (first_name, last_name, username, password, email, google_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
        [first_name, last_name, username, password, email, google_id]);
        return {
            success: true,
            error: null
        };
    }
    catch(error){
        return {
            success: false,
            error: error
        };
    }
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
    pool.query('INSERT INTO gratitude_items (id_users, date, gratitude_item) VALUES ($1, NOW(), $2) RETURNING *', 
    [id_users, gratitude_item], 
    (error, results) => {
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

//add in a column for date updated?

//not sure about this one. Need to find a way to query by the date..will need to then format to how the date looks in the database
const getGratitudeByUserIdAndDate = (req, res) => {
    const id_users = parseInt(req.params.id_users);
    const date = req.params.date;
    pool.query('SELECT gratitude_item FROM gratitude_items WHERE id_users=$1 AND date=$2 ', [id_users, date], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows);
    })
}

//create two new files, users and gratitude and import them here to make it look cleaner.
//set up user sessions
//add authentication/authorization and sanitation
//add unit tests


module.exports = {
    getUsers,
    getUserById,
    createUser, 
    updateUser,
    deleteUser,
    createGratitude,
    getGratitudeByUserId,
    deleteGratitude,
    updateGratitude,
    getGratitudeByUserIdAndDate,
    getUserByGoogleId,
};
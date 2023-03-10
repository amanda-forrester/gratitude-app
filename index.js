const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
require('./auth');
const passport = require('passport');
const port = 3005;
const cors = require('cors');

const app = express();
const db = require('./queries');
const { query } = require('express');

app.use(cors());

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 172800000},
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
    res.send('<a href = "/auth/google">Login with Google</a>');
});

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile']})
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/gratitude',
        failureRedirect: '/auth/failure'
    })
)

app.get('/auth/failure', (req, res) => {
    res.send('Something went wrong');
})

app.get('/gratitude', isLoggedIn, (req, res) => {
    if (req.user.sub) {
        try {
            const results = db.getUserByGoogleId(req.user.sub).then(firstName => {
                if (firstName && firstName != '') {
                    res.send(`<img src= ${req.user.picture} /><br>Hello, ${req.user.displayName}. Welcome to your gratitude page. Here's the query result: ${firstName}`);
                }
                else {
                    const user = {
                        first_name: req.user.given_name,
                        last_name: req.user.family_name,
                        username: null,
                        password: null,
                        email: req.user.email,
                        google_id: req.user.sub
                    };
                    const dbResponse = db.createUser(user).then(result => {
                        res.send(`User successfully created! ${JSON.stringify(result)}`);
                    })
                    .catch(reason => {
                        res.send(`Failed to create new user. ${JSON.stringify(reason)}`);
                    });
                }
            })
            .catch(reason => {
                res.send(`Caught error from the DB: ${JSON.stringify(reason)}`);
            });
        }
        catch (err) {
            res.send(`Caught error from the DB: ${JSON.stringify(err)}`);
        }
    }
    else {
        res.send('User does not exist');
    }
});

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    res.redirect('/login');
    req.session.destroy();
})
});

app.get('/users', db.getUsers);

app.get('/users/:id', db.getUserById);

app.post('/users', db.createUser);

app.put('/users/:id', db.updateUser);

app.delete('/users/:id', db.deleteUser);

app.post('/gratitude/:id_users', db.createGratitude);

app.get('/gratitude/:id_users', db.getGratitudeByUserId);

app.delete('/gratitude/:id', db.deleteGratitude);

app.put('/gratitude/:id', db.updateGratitude);

app.get('/gratitude/:id_users/:date', db.getGratitudeByUserIdAndDate);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})


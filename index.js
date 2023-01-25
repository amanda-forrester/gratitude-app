const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
require('./auth');
const passport = require('passport');
const port = 3005;

const app = express();
const db = require('./queries');


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({
    secret: '673493kj',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
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
    res.send(`Hello, ${req.user.displayName}. Welcome to your gratitude page.`);
})

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    res.redirect('/');
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


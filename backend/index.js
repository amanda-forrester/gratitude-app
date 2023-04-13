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

/*app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: 'http://localhost:3000/success',
        failureRedirect: '/auth/failure'
    })*/

app.get('/auth/google/callback', async (req, res) => {
    try {
        const authorizationCode = req.query.code;
        const response = await axios.post('https://oauth2.googleapis.com/token', {
        code: authorizationCode,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_url:'/auth/google/callback' , //no clue on this one
        grant_type: 'authorization_code'
        });
        const accessToken = response.data.access_token;
        // Do something with the access token, e.g. use it to fetch user data from Google APIs
        res.redirect('http://localhost:3000/success');
    } catch (error) {
        // Handle the error
        console.error(error);
        res.redirect('/auth/failure');
    }
    });
      

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
                    const newUser = {
                        first_name: req.user.given_name,
                        last_name: req.user.family_name,
                        username: null,
                        password: null,
                        email: req.user.email,
                        google_id: req.user.sub
                    };
                    const dbResponse = db.createUser(newUser).then(result => {
                        res.send(`User successfully created! ${JSON.stringify(result)}`);
                    })
                    .catch(reason => {
                        res.send(`Failed to create new user. ${JSON.stringify(reason)}`);
                    });
                }
            })
            const user = {
                id: req.user.sub,
                firstName: req.user.given_name,
                lastName: req.user.family_name,
                email: req.user.email,
                picture: req.user.picture,
              };
            res.json(user)
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

app.get('/api/user', isLoggedIn, (req, res) => {
    const user = {
      id: req.user.sub,
      firstName: req.user.given_name,
      lastName: req.user.family_name,
      email: req.user.email,
      picture: req.user.picture,
    };
    res.json(user);
  });

  

app.get('/users', db.getUsers);

app.get('/users/:id', db.getUserById);

app.post('/users', db.createUser);

app.put('/users/:id', db.updateUser);

app.delete('/users/:id', db.deleteUser);

app.post('/gratitude/assign', db.createGratitudeByGoogleId);

app.post('/gratitude/:id_users', db.createGratitude);

app.get('/gratitude/:id_users', db.getGratitudeByUserId);

app.delete('/gratitude/:id', db.deleteGratitude);

app.put('/gratitude/:id', db.updateGratitude);

app.get('/gratitude/:id_users/:date', db.getGratitudeByUserIdAndDate);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})


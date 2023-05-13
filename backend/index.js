const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const port = 3005;
const cors = require('cors');
const dotenv = require ('dotenv');
dotenv.config()
const {OAuth2Client} = require('google-auth-library');
const app = express();
const db = require('./queries');
const { query } = require('express');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'http://localhost:3005/auth/google/callback'
  });

let userProfile;
let userAccessToken;
//let userIdToken;
//let idToken;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

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

  
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 172800000},
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());



/*The "invalid_grant" error usually means you tried to use the same authorization code to get more than one developer token.  The authorization code is the string returned after you click Accept from the URL provided by the offline credentials example, and you can only use an authorization code once.*/

//There is a problem with this function below. When I add it as middlewear to the /auth/google/callback GET method
// it breaks everything. It then won't get in the try block of that function at all, though it does get the value 
//for "code". If I don't add it as middlewear, maybe it's not even using it? I'm not really sure. Surely it would
//have to, as it appears to be succesfully logging people in via google...

//OK I think the problem is that I'm having google generate an authorization code during the google strategy, and then again
//during the get(/auth/google/callback). You can only have it generate a code once. 

//Need to get the idToken from the passport.use to the app.get callback. Not sure how. Also, now the name, email etc are
//missing from the profile object. It only contains the token info now...

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3005/auth/google/callback", // Use 3000 instead? (was 3005), but I think that'll require updating the settings in Google
    scope: ['openid', 'profile', 'email'],
    passReqToCallback: true
  },
  
  function(request, accessToken, refreshToken, profile, params, done) {
      console.log(`[[[[[CALLED WITH:\n\n  accessToken=${JSON.stringify(accessToken)}\n  refreshToken=${JSON.stringify(refreshToken)}\n  profile=${JSON.stringify(profile)}\n\n]]]]]\n\n`);
      //adding these two lines to see if I can get it from the profile once I'm actually using the middlewear
      const idToken = profile.id_token;
      request.idToken = idToken;
      console.log("ID TOKEN IS: ", idToken);
      userProfile = profile;
      userAccessToken = accessToken;
      const decodedToken = jwt.decode(profile.id_token);
      console.log('DECODED TOKEN: ', decodedToken);

      
      // Check if the user already exists in the database
      db.getUserByGoogleId(decodedToken.sub)
        .then((user) => {
          if (user) {
            // User exists in the database
            return done(null, user);
          } else {
            // User does not exist, create a new user in the database
            const newUser = {
              first_name: decodedToken.given_name,
              last_name: decodedToken.family_name,
              email: decodedToken.email,
              google_id: decodedToken.sub,
            };

            db.createUser(newUser)
            .then((result) => {
                if (result.success) {
                return done(null, newUser);
                } else {
                console.error('Error creating new user:', result.error);
                return done(result.error);
                }
            })
            .catch((error) => {
                console.error('Error creating new user:', error);
                return done(error);
            });

          }
        })
        .catch((error) => {
          console.error('Error checking user:', error);
          return done(error);
        });
    }
  )
)

      /*return done(null, profile);
  }
));*/

  
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/login', (req, res) => {
    res.send('<a href = "/auth/google">Login with Google</a>');
});

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile']})
);


// Verify function to validate the id_token
async function verify(idToken) {
    try {
        console.log("Verifying ID token ", idToken);
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userId = payload.sub;
      return userId;
    } catch (error) {
      console.error('Error verifying id_token:', error);
      throw error;
    }
  }
  
//callback function. This gets the id_token you need to authenticate user
app.get('/auth/google/callback', passport.authenticate('google', {}), async (req, res) => {
    const code = req.query.code;
    console.log("CODE IS: ", code);
    try {
      const idToken = req.idToken; // Access the id_token from the req.user object
      console.log("ID TOKEN IS: ", idToken);
      const userId = await verify(idToken);
      /*const { tokens } = await client.getToken(code);
      const idToken = tokens.id_token;
      console.log("ID TOKEN IS: ", idToken);
      const userId = await verify(idToken)*/
    
      res.redirect(`http://localhost:3000/success?token=${idToken}`); // Redirect to a success page, passing in idToken to front end
    } catch (error) {
      console.error('Error retrieving id_token:', error);
      console.log('Error response:', error.response.data);
      res.redirect('/auth/failure'); // Redirect to an error page
    }
  });
  

app.get('/success', (req, res) => res.send(userProfile));

app.get('/auth/failure', (req, res) => {
    res.send('Something went wrong');
});



//old checkUser function. It is not working..
/*const checkUser = (req, res) => {
    //isLoggedIn();
    if (req.user.sub) {
        try {
            const results = db.getUserByGoogleId(req.user.sub).then(firstName => {
                if (firstName && firstName != '') {
                    res.send('User already exists. Welcome back!');
                }
                else {
                    const user = {
                        first_name: req.user.given_name,
                        last_name: req.user.family_name,
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
};*/


app.post('/gratitude/assign', (req, res) => {
    const authorizationStr = req.headers.authorization;
    console.log(`authorization: ${authorizationStr}`);
    const token = authorizationStr.replace("Bearer: ", "");
    console.log(`token: ${token}`);
    
    verify(token).then((userSub) => {
        // make a DB call using userSub. userSub is a string that contains the sub value from Google. Save it as a field in DB records.
        // This object needs to match what the createGratitudeByGoogleId function is expecting.
        console.log(`VERIFIED! userSub is: ${userSub}.`);

        const gratitudeItemRequest = {
            user_id: userSub,
            gratitude_item: req.body.gratitude_string
        };
        console.log(`Trying to add item:\n${JSON.stringify(gratitudeItemRequest)}`);

        db.createGratitudeByGoogleId(gratitudeItemRequest, res);
        console.log(`made it past the create call`);
    })
    .catch(reason => {
        console.log(`Failed the auth call because: ${JSON.stringify(reason)}`);

        // Bad authentication. Send an error response
        res.status(500).send({ 'success': false, 'reason': 'Failed to create new user.' });
    });
})

app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    res.redirect('http//localhost:3000');
    req.session.destroy();
})
});

app.get('/users', db.getUsers);

app.get('/users/:id', db.getUserById);

app.post('/users', db.createUser);

app.put('/users/:id', db.updateUser);

app.delete('/users/:id', db.deleteUser);

app.get('/gratitude/:id_users', db.getGratitudeByUserId);

app.delete('/gratitude/:id', db.deleteGratitude);

app.put('/gratitude/:id', db.updateGratitude);

app.get('/gratitude/:id_users/:date', db.getGratitudeByUserIdAndDate);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})


const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
//require('./auth');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const port = 3005;
const cors = require('cors');
const dotenv = require ('dotenv');
dotenv.config();
const axios = require('axios');
const qs = require('qs');
const {OAuth2Client} = require('google-auth-library');
const app = express();
const db = require('./queries');
const { query } = require('express');

const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'http://localhost:3005/auth/google/callback'
  });

let userProfile;
let userAccessToken;
let userIdToken;
let idToken;


//Old version. Cut out middle part if going to use again
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3005/auth/google/callback", // Use 3000 instead? (was 3005), but I think that'll require updating the settings in Google
    scope: ['openid', 'profile'],
    passReqToCallback: true
  },

   /*we tried this as a new version, but I don't think the params are correct
   function(accessToken, refreshToken, params, profile, done) {
    console.log(`params is: ${JSON.stringify(params)}\n\n`);
    //console.log(`[[[[[CALLED WITH:\n\n  accessToken=${JSON.stringify(accessToken)}\n  refreshToken=${JSON.stringify(refreshToken)}\n  profile=${JSON.stringify(profile)}\n\n]]]]]\n\n`);

    userProfile = profile;
    userAccessToken = accessToken;
    //userIdToken = params.id_token;
    console.log(`userProfile: ${JSON.stringify(userProfile)}\n\n`);
    console.log(`userAccessToken: ${JSON.stringify(userAccessToken)}\n\n`);
    //console.log(`!!!!!!!userIdToken: ${JSON.stringify(userIdToken)}\n\n`);

    return done(null, profile);
  }*/
  

  function(request, accessToken, refreshToken, profile, done) {
      console.log(`[[[[[CALLED WITH:\n\n  accessToken=${JSON.stringify(accessToken)}\n  refreshToken=${JSON.stringify(refreshToken)}\n  profile=${JSON.stringify(profile)}\n\n]]]]]\n\n`);

      userProfile = profile;
      userAccessToken = accessToken;
      //userIdToken = profile.id_token; broken
      console.log(`userProfile: ${JSON.stringify(userProfile)}\n\n`);
      console.log(`userAccessToken: ${JSON.stringify(userAccessToken)}\n\n`);
      //console.log(`!!!!!!!userIdToken: ${JSON.stringify(userIdToken)}\n\n`);

      return done(null, profile);
  }
)); 

  

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


/* old version. trying something new to manually get the id_token
app.get('/auth/google/callback',
    passport.authenticate('google', {
        //successRedirect: 'http://localhost:3000/success',
        failureRedirect: '/auth/failure'
    }),
    function (req, res) {
        // Successful authentication, redirect success
        idToken = req.query.id_token;
        console.log('req.query: ', req.query);
        console.log('id_token: ', idToken);
        res.redirect(`http://localhost:3000/success?sub=${userProfile.sub}&token=${idToken}`); // used to be token=${userAccessToken} or userIdToken
        //res.redirect(`/success?sub=${userProfile.sub}`);
      }
);*/

//this gets the id_token needed for authentication and to get the user info

// ... Your existing code ...

// Verify function to validate the id_token
async function verify(idToken) {
    try {
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
  

app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
  
    try {
      const { tokens } = await client.getToken(code);
      const idToken = tokens.id_token;
      
      const userId = await verify(idToken)

      // Store or use the id_token as needed
      console.log("ID TOKEN!!!!!!!! ", idToken);
  
      res.redirect(`http://localhost:3000/success?token=${idToken}`); // Redirect to a success page
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

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

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

//Moved this function up in the code before GET auth/google/callback
/*async function verify(idToken) {
    console.log(`called verify. GOOGLE_CLIENT_ID is: ${process.env.GOOGLE_CLIENT_ID}\nAnd token is: ${token}\n\n`);

    console.log(`\n\n\n[[[[[[[[[[[[[[\nuserAccessToken is: ${userAccessToken}\n\n\n\n\n\n\n\n`);


    console.log(`inside verify. userProfile is: ${JSON.stringify(userProfile)}\nAnd userAccessToken is: ${userAccessToken}`);

    console.log(`\n\n\n[[[[[[[[[[[[[[\nuserIdToken is: ${idToken}\n\n\n\n\n\n\n\n`);

    if (token != userIdToken) {
        console.log("NOT EQUAL\n\n");
    }
    else {
        console.log("EQUAL\n\n")
    }

    try {
        // For some unknown reason, this throws
        /*
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        


        // try it the dumb promise way...
        client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        .then((ticket) => {
            console.log(`ticket: ${JSON.stringify(ticket)}`);
            const payload = ticket.getPayload();
            console.log(`payload: ${JSON.stringify(payload)}`);
            const userid = payload['sub'];
            console.log(`userid: ${userid}`);
            return userid;
          })
          .catch((error) => {
            console.log(`error from verify: ${JSON.stringify(error)}`);
            throw error;
          });
    }
    catch (error) {
        console.log(`error from verify: ${JSON.stringify(error)}`);
        throw error;
    }
    
  };

*/


app.post('/gratitude/assign', (req, res) => {
    const authorizationStr = req.headers.authorization;
    console.log(`authorization: ${authorizationStr}`);
    const token = authorizationStr.replace("Bearer: ", "");
    console.log(`token: ${token}`);

    // /THis call is failing. Bypass it, but it means we aren't validating the token at all...
    
    verify(token).then((userSub) => {
        // make a DB call using userSub. userSub is a string that contains the sub value from Google. Save it as a field in your DB records.
        // This object needs to match what the createGratitudeByGoogleId function is expecting.
        console.log(`VERIFIED! userSub is: ${userSub}.`);
        
        /*
        if (!userProfile.sub) {
            throw "something's wrong with userProfile.sub!";
        }
        */

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
    res.redirect('/login');
    req.session.destroy();
})
});

app.get('/users', db.getUsers);

app.get('/users/:id', db.getUserById);

app.post('/users', db.createUser);

app.put('/users/:id', db.updateUser);

app.delete('/users/:id', db.deleteUser);

//the old one
//app.post('/gratitude/assign', db.createGratitudeByGoogleId);

//app.post('/gratitude/:id_users', db.createGratitude);

app.get('/gratitude/:id_users', db.getGratitudeByUserId);

app.delete('/gratitude/:id', db.deleteGratitude);

app.put('/gratitude/:id', db.updateGratitude);

app.get('/gratitude/:id_users/:date', db.getGratitudeByUserIdAndDate);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})


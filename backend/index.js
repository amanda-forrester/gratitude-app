const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
//const port = 3005;
const PORT = process.env.PORT || 3005;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const app = express();
const db = require('./queries');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3005/auth/google/callback',
});

let userProfile;
let userAccessToken;
let userRefreshToken;

passport.serializeUser(function (user, done) {
  done(null, user);
});

app.use(cors());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 30000, expires: new Date(Date.now() + 30000)}
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (!req.session.expires) {
    req.session.expires = new Date(Date.now() + 30000); // Set the expiration time if it doesn't exist
  } else {
    const expirationTime = new Date(req.session.expires).getTime();
    if (Date.now() > expirationTime) {
      req.logout(); // Perform the logout operation
      req.session.destroy(); // Clear the session data
    }
  }
  next();
});

passport.deserializeUser(function (user, done) {
  const expirationTime = user.expires;
  user.expires = expirationTime;
  done(null, user);
});

async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    const { access_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    return {
      access_token,
      expires_at: expiresAt,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

async function refreshTokenIfNeeded(req, res, next) {
  console.log('CHECKING IF REFRESH NEEDED');
  if (!userAccessToken || !userRefreshToken) {
    return next();
  }

  const currentTime = new Date();
  const expirationTime = new Date(userAccessToken.expires_at);

  if (currentTime < expirationTime) {
    return next();
  }

  try {
    const newAccessToken = await refreshAccessToken(userRefreshToken);
    userAccessToken = {
      access_token: newAccessToken,
      expires_at: new Date(Date.now() + 3600 * 1000), // Set new expiration time to 1 hour from now
    };
    console.log('New access token generated:', newAccessToken);
    next();
  } catch (error) {
    console.error('Error refreshing access token:', error);
    res.status(500).send({ success: false, reason: 'Failed to refresh access token.' });
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3005/auth/google/callback',
      scope: ['openid', 'profile', 'email'],
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, params, done) {
      console.log(
        `[[[[[CALLED WITH:\n\n  accessToken=${JSON.stringify(
          accessToken
        )}\n  refreshToken=${JSON.stringify(
          refreshToken
        )}\n  profile=${JSON.stringify(profile)}\n\n]]]]]\n\n`
      );
      const idToken = profile.id_token;
      request.idToken = idToken;
      request.session.refreshToken = refreshToken;
      console.log('ID TOKEN IS: ', idToken);
      userProfile = profile;
      userAccessToken = {
        access_token: accessToken,
        expires_at: new Date(Date.now() + params.expires_in * 1000),
      };
      userRefreshToken = refreshToken;
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
);

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.get('/login', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile', 'openid'], accessType: 'offline', prompt: 'consent' }));

async function verify(idToken) {
  try {
    console.log('Verifying ID token ', idToken);
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

app.get('/auth/google/callback', passport.authenticate('google', {}), async (req, res) => {
  const code = req.query.code;
  console.log('CODE IS: ', code);
  try {
    const idToken = req.idToken;
    console.log('ID TOKEN IS: ', idToken);
    const userId = await verify(idToken);

    res.redirect(`http://localhost:3000/success?token=${idToken}`);
  } catch (error) {
    console.error('Error retrieving id_token:', error);
    console.log('Error response:', error.response.data);
    res.redirect('/auth/failure');
  }
});

app.get('/success', (req, res) => res.send(userProfile));

app.get('/auth/failure', (req, res) => {
  res.send('Something went wrong');
});

app.post('/gratitude/assign', refreshTokenIfNeeded, (req, res) => {
  const authorizationStr = req.headers.authorization;
  console.log(`authorization: ${authorizationStr}`);
  const token = authorizationStr.replace('Bearer ', '');
  console.log(`token: ${token}`);

  verify(token)
    .then((userSub) => {
      console.log(`VERIFIED! userSub is: ${userSub}.`);

      const gratitudeItemRequest = {
        user_id: userSub,
        gratitude_item: req.body.gratitude_string,
      };
      console.log(`Trying to add item:\n${JSON.stringify(gratitudeItemRequest)}`);

      db.createGratitudeByGoogleId(gratitudeItemRequest, res);
      console.log('made it past the create call');
    })
    .catch((reason) => {
      console.log(`Failed the auth call because: ${JSON.stringify(reason)}`);
      res.status(500).send({ success: false, reason: 'Failed to create new user.' });
    });
});

app.get('/logout', (req, res) => {
  req.logout(); // Perform the logout operation
  req.session.destroy(); // Clear the session data
  res.redirect('http://localhost:3000'); // Redirect to the desired URL
});


app.get('/quotes', refreshTokenIfNeeded, db.getRandomQuote);

app.get('/users', refreshTokenIfNeeded, db.getUsers);

app.get('/users/:id', refreshTokenIfNeeded, db.getUserById);

app.post('/users', refreshTokenIfNeeded, db.createUser);

app.put('/users/:id', refreshTokenIfNeeded, db.updateUser);

app.delete('/users/:id', refreshTokenIfNeeded, db.deleteUser);

app.get('/gratitude/:id_users', refreshTokenIfNeeded, db.getGratitudeByUserId);

app.delete('/gratitude/:id', refreshTokenIfNeeded, db.deleteGratitude);

app.put('/gratitude/:id', refreshTokenIfNeeded, db.updateGratitude);

app.get('/gratitude/:google_id/:date', refreshTokenIfNeeded, db.getGratitudeByUserIdAndDate);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});







/*const express = require('express');
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

//debugger; 
app.use(session({
    secret: process.env.SECRET,
    cookie: { maxAge: 172800000 },
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

async function refreshAccessToken(refreshToken) {
  try {
    const { tokens } = await client.refreshToken({
      refreshToken: refreshToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    });

    const { access_token } = tokens;
    return access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}



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
      request.session.refreshToken = refreshToken;
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

  
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

app.get('/login', (req, res) => {
    res.send('<a href = "/auth/google">Login with Google</a>');
});

app.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile', 'openid'], accessType: 'offline', prompt: 'consent'})
);

//debugger;
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
      //const { tokens } = await client.getToken(code);
      //const idToken = tokens.id_token;
      //console.log("ID TOKEN IS: ", idToken);
      //const userId = await verify(idToken)
    
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


app.post('/gratitude/assign', (req, res) => {
  //debugger;
    const authorizationStr = req.headers.authorization;
    console.log(`authorization: ${authorizationStr}`);
    const token = authorizationStr.replace("Bearer ", "");
    console.log(`token: ${token}`);
   // console.log(`refresh: ${refreshToken}`);
   

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

app.get('/quotes', db.getRandomQuote);

app.get('/users', db.getUsers);

app.get('/users/:id', db.getUserById);

app.post('/users', db.createUser);

app.put('/users/:id', db.updateUser);

app.delete('/users/:id', db.deleteUser);

app.get('/gratitude/:id_users', db.getGratitudeByUserId);

app.delete('/gratitude/:id', db.deleteGratitude);

app.put('/gratitude/:id', db.updateGratitude);

app.get('/gratitude/:google_id/:date', db.getGratitudeByUserIdAndDate);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})*/


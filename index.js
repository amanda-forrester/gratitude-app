const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3005;

const db = require('./queries');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (req, res) => {
    res.json({info: 'This is the gratitude app backend'})
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


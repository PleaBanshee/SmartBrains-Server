const express = require('express');
const bcrypt = require('bcrypt-nodejs'); // use this package to hash passwords
const cors = require('cors'); // allows restricted resources to be shared and requested accross the web
const knex = require('knex'); // allows you to build sql queries
const register = require('./controllers/register.js'); // register route
const signIn = require('./controllers/signIn.js'); // signin route
const profile = require('./controllers/profile.js'); // profile route
const images = require('./controllers/image.js'); // updating entries
const image = require('./controllers/image.js');
require('dotenv').config();

const PORT = process.env.PORT; // variable which defines which port the server will be listening to
const app = express();
console.log(PORT);
// use this code so you can parse responses into the correct format
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// Datbase configuration
const db = knex({
    client: 'pg', // database is PostgreSQL
    connection: {
      connectionString : process.env.DATABASE_URL, // server url
      ssl: true,
    }
});

// Default route
app.get('/',(req,res) => {
    res.json(`Connected to server: port ${PORT}`);
});

// Sign In route
app.post('/signIn', signIn.handleSignIn(db,bcrypt)); // receives req and res in js file

// Register route
app.post('/Register', register.handleRegister(db,bcrypt)); // dependency injection: passing required objects so we don't need to import them

// Gets a user profile
app.get('/Profile/:id', profile.handleProfile(db));

// API call route
app.post('/imageurl',(req,res) => image.handleApiCall(req,res));

// Increase user rank when submitting images
app.put('/Image', images.handleImages(db)); // PUT --- updates content

app.listen(PORT || 3001,() => { // run the backend and frontend on respective ports, connect to port 3001 if other Port is not available
    console.log(`SmartBrains is running on port ${PORT}`);
});
const express = require('express');
const bcrypt = require('bcrypt-nodejs'); // use this package to hash passwords
const cors = require('cors'); // allows restricted resources to be shared and requested accross the web
const knex = require('knex'); // allows you to build sql queries
const register = require('./controllers/register.js'); // register route
const signIn = require('./controllers/signIn.js'); // signin route
const profile = require('./controllers/profile.js'); // profile route
const images = require('./controllers/image.js'); // updating entries
require('dotenv').config();

const PORT = process.env.PORT; // variable which defines which port the server will be listening to
const app = express();
// use this code so you can parse responses into the correct format
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// Database configuration
const db = knex({
    client: 'pg', // database is PostgreSQL
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: true,
    },
});

// console.log(db.connection.connectionString);

// Default route
app.get('/',(req,res) => {
    res.json(db.users);
});

// Sign In route
app.post('/signIn', signIn.handleSignIn(db,bcrypt)); // receives req and res in js file

// Register route
app.post('/Register',(req,res) => register.handleRegister(req,res,db,bcrypt)); // dependency injection: passing required objects so we don't need to import them

// Gets a user profile
app.get('/Profile/:id', (req,res) => profile.handleProfile(req,res,db));

// API call route
app.post('/imageurl',(req,res) => images.handleApiCall(req,res));

// Increase user rank when submitting images
app.put('/Image', (req,res) => images.handleImages(req,res,db)); // PUT --- updates content

app.listen(PORT || 3001,() => { // run the backend and frontend on respective ports, connect to port 3001 if other Port is not available
    console.log(`SmartBrains is running on port ${PORT}`);
});
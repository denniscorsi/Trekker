const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.AUTH_PORT
require('dotenv').config()
const hello = 'hi'
const mongoURI = process.env.MONGO_URI_USERS

mongoose.connect(mongoURI);

mongoose.connection.once('open', () => {
    console.log('connected to the users DB by the users server')
});

app.use(express.json());



app.use((req, res, err, next) => {
    const defaultError = {
        log: 'There was an unknown middleware error in Authentication',
        status: 500,
        message: 'Housten, there\'s been an authentication problem',
    };
    const errObj = Object.assign(defaultError, err)
    res.status(errObj.status).json(errObj.message)
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});


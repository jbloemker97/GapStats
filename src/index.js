const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Routes
const dataRoute = require('./data/data-router');

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/data/', dataRoute);

// Listen on server
app.listen(PORT, () => { console.log(`Server running on port: ${PORT}`); });
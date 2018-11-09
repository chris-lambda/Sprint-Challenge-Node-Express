const express = require('express');

const configureMiddleware = require('../config/middleware');

const server = express();

configureMiddleware(server);


module.exports = server;
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./config/webpack.config');
const dbconfig = require('./config/dbConfig');
const appconfig = require('./config/appConfig');
const timestamp = require('console-timestamp');
const appRoutes = require('./server/config/routes'); // Import the application end points/API
const helmet = require('helmet');
const compression = require('compression');

// For testing
var config = require("./server/config/config.js").get(process.env.NODE_ENV);
// For testing

//Import swagger
var swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

//Declarations
const app = express();

// Compression
app.use(compression());

// Helmet
app.use(helmet());

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(morgan('dev')); // Morgan Middleware
app.use(bodyParser.json({
    extended: true,
    limit: '10mb'
})); // Body-parser middleware
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
})); // For parsing application/x-www-form-urlencoded

//app.use(webpackMiddleware(webpack(webpackConfig)));

// Set Static Folder
app.use(express.static(path.join(__dirname, 'dist')));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

appRoutes(app);

//-------------------------------------- Client Database Functions
//initialize connection to database
mongoose.Promise = global.Promise;
mongoose.connect(dbconfig.database, {keepAlive: true, useNewUrlParser: true});

//on database connection
mongoose.connection
    .once('open', () => console.log('Connected to database instance.'))
    .on('error', error => console.log('Error connecting to MongoLab: ', error));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Start server
var server;
if (process.env.SECURE) {
    // For Secure Connection over HTTPS
    server = http.createServer(app);
} else {
    // For HTTP connection
    server = http.createServer(app);
}

server.listen(appconfig.port, () => {
    //console.log('DD-MM-YY hh:mm'.timestamp);
    console.log('Connected to customer app server @ port ' + appconfig.port + ' at datetime: ' + 'DD-MM-YY hh:mm'.timestamp);
});
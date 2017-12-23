var mongoose = require('mongoose');
var config = require('../config');

mongoose.Promise = require('bluebird');

mongoose.connect(config.mongodbUri);

mongoose.connection.on('error', function(err) {
    console.error('Database Connection Error: ' + err);
    console.error('сервер MongoDB Запусти!');
    process.exit(2);
});

mongoose.connection.on('connected', function() {
    console.info('Succesfully connected to MongoDB Database');
});
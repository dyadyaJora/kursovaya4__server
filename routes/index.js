var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    //res.send('Index');
  fs.readFile(path.resolve('../taxi-service/www/index.html'), 'utf-8', function(err, str) {
    if (err) { return next(err); }

    res.send(str);
  });
});

module.exports = router;

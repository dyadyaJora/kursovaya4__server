var express = require('express');
var router = express.Router();

module.exports = function(passport) {

	router.use(passport.authenticate('bearer', { session: false }));


	  router.get('/', function(req, res) {
            res.json(req.user.toObject());
	  });

	return router;
}

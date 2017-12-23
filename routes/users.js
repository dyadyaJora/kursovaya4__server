var express = require('express');
var router = express.Router();

/* GET users listing. */
module.exports = function(passport) {
	/*router.get('/', 
		passport.authenticate('bearer', { session: false }),
		function(req, res, next) {
		    res.send('Secure responce');
		});
	*/

	router.use(passport.authenticate('bearer', { session: false }));


	  router.get('/', function(req, res) {
		    res.send('Secure responce');
	  });

	return router;
}

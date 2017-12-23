module.exports = function() {

  return function(req, res, next) {
  	console.log('---SATELLIZER____', req.body);
    if (!req.query.code) {
      req.query.code = req.body.oauthData.code;
    }

    next();
  };

};

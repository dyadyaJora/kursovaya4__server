var BearerStrategy = require('passport-http-bearer').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;

var mongoose = require('mongoose');
var User = mongoose.model('User');

var config = require('../config');

module.exports = function(passport) {

	passport.use(new BearerStrategy(function(token, done) {
		console.log('BEARER', token);
	    console.log('BEARER Callback ===================================================');
		User.findOne({ token: token }, function(err, user) {
			if (err) { return done(err); }

			if (!user) { return done(null, false); }

			done(null, user);
		});
	}));

	passport.use(new VKontakteStrategy(
		config.passportOptions.vkontakte,
		function(accessToken, refreshToken, profile, done) {
			User.findOne({ vkId: profile.id }, function(err, user) {
				if (err) { return done(err); }

				if (user) { return done(null, user); }

				user.save();
			});
		}));
	
	passport.use(new FacebookStrategy(
		config.passportOptions.facebook,
		function(accessToken, refreshToken, profile, done) {
			console.log('============\n', accessToken, refreshToken, profile, '\n============');
			console.log('-----YES-----');
			done(null, Object.assign({}, profile, {hz: '+1'}));
			//done(null, {token: 'hahahhahahahahaha'});
			/*User.findOne({ fbId: profile.id }, function(err, user) {
				if (err) { return done(err); }

				if (user) { return done(null, user); }

				user.save();
			});*/
		}));
};
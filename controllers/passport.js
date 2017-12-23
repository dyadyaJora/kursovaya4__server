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
			var nuser;
			
			User.findOne({ fbId: profile.id }, function(err, user) {
				if (err) { return done(err); }

				if (user) { return done(null, user); }
				
				nuser = new User({
					nickname: 'fb' + profile.id,
					name: profile.displayName, //TODO: make escape
					avatar: profile.photos.length? profile.photos[0].value : '',
					fbId: profile.id
				});

				return nuser.save();
			})
			.then(function(user) {
              	done(null, nuser);
            })
            .catch(function(err) {
              	done(err);
            });
		}));
};
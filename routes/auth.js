var express = require('express');
var router = express.Router();
var satellizerAdapter = require('../controllers/satellizer-adapter');

module.exports = function(passport) {

    router.get('/facebook/callback', function(req, res) {
        console.log('GET FACEBOOK cb');
        //res.end();
        res.send('ok');
    });
    
    router.get('/facebook', function(req, res) {
        console.log('hz', req.user);
        res.end();
    });

    router.post('/facebook',
        satellizerAdapter(),
        passport.authenticate('facebook', { failureRedirect: '/ppc', session: false }),
        function(req, res) {
            res.json(req.user.toObject());
        });

    return router;

};

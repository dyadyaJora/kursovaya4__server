var express = require('express');
var router = express.Router();
var config = require('../config');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');
var googleMaps = require('@google/maps').createClient({
  key: config.googleMapKey
});

module.exports = function(passport, driverSocket) {

	router.use(passport.authenticate('bearer', { session: false }));


	router.get('/', function(req, res) {
		res.json({msg:'order'});
	});

	router.post('/', function(req, res) {
		var data = req.body
			fromLatLon = data.fromLoc.lat + ',' + data.fromLoc.lon,
			toLatLon = data.roadAddresses[0].lat + ',' + data.roadAddresses[0].lon,
			validateStr = '';

		Object.assign(data, { client: req.user._id, status: 'New' });
		// === validation TODO=======
		googleMaps.directions({
                origin: fromLatLon,
                destination: toLatLon,
                mode: 'driving'
            }, function(err, res) {
            	if (err) {
            		validateStr += 'Ошибка при построении маршрута Google Maps';
            		return;
            	}

            	if (res.json.status !== 'OK') {
            		validateStr += 'Ошибка при построении маршрута Google Maps';
            		return;
            	}

            	console.log(err, res);
            });
		// ======================

		// === db save ==========
		if (!validateStr) {
			var newOrder = new Order(data);
			
			newOrder.save()
				.then(function(res) {
					console.log(res, 'ORDER RESULT ______________________');
					res.send(newOrder.toObject());
					driverSocket.socket.emit('driver-order', newOrder);
				})
				.catch(function(err) {
					console.log(err, 'ORDER Error ______________________');
					res.json({msg: 'Order DB error'});
				});
		}
		// ======================
	});

	router.get('/allmy', function(req, res) {
		Order.find({ client: req.user._id })
			.then(function(orders) {
				res.json(orders);
			})
			.catch(function(err) {
				res.status(404);
			});
	});

	return router;
}

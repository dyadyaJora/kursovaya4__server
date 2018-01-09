var express = require('express');
var router = express.Router();
var config = require('../config');
var mongoose = require('mongoose');
var Order = mongoose.model('Order');

module.exports = function() {
	
	router.get('/', function(req, res) {
		console.log('aaaaa');
		Order.find({})
			.then(function(orders) {
				res.json(orders);
			})
			.catch(function(err) {
				res.status(404);
			});
	});

	return router;
}

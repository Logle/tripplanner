var express = require('express');
var router = express.Router();
var models = require('../models');

/* GET home page. */
router.get('/', function(req, res) {
  models.Hotel.find(function (err, hotels) {
      var hotels = hotels;
      models.Restaurant.find(function(err, restaurants) {
          var restaurants = restaurants;
          models.ThingsToDo.find(function(err, things_to_do) {
              var things_to_do = things_to_do;
              models.Day.find(function(err, days){
                var days = days;
                res.render('index', {hotels: hotels, restaurants: restaurants, things_to_do: things_to_do, days:days});
              })
          })
      })
  })
});

module.exports = router;

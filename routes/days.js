var express = require('express');
var router = express.Router();
var models = require('../models');

router.post('/:dayId/attractions',function(req,res,next){
  //...add an attraction to day...
  var type = req.body.type_of_place;
  var name = req.body.name;
  var Day = models.Day;
 
  Day.findOne({day_number: req.params.dayId}, function(err, thisDay){
	if (type ==='hotel') { 
	  		thisDay.hotel = name;
	} else if (type==='thingtodo') {
	  		thisDay.thingsToDo.push(name);	
	} else {
			thisDay.restaurant.push(name);	
	}
		thisDay.save(function(err) {
			res.send(thisDay);
		});

	});
});

// router.post('/',function(req, res){
// var Day = models.Day;
// 	Day.create({day_number:1, hotel:'', restaurant:[], thingsToDo:[]});
// 	Day.create({day_number:2, hotel:'', restaurant:[], thingsToDo:[]});
// 	Day.create({day_number:3, hotel:'', restaurant:[], thingsToDo:[]});
// });

module.exports = router;
 

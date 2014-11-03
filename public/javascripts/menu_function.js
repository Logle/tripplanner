function initialize_gmaps(x,y) {
        // initialize new google maps LatLng object
        var myLatlng = new google.maps.LatLng(x,y);
       // set the map options hash
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // get the maps div's HTML obj
        var map_canvas_obj = document.getElementById("map-canvas");
        // initialize a new Google Map with the options
        var map = new google.maps.Map(map_canvas_obj, mapOptions);
        // Add the marker to the map
        var marker = new google.maps.Marker({
          position: myLatlng,
          title:"Hello World!"
        });
        // Add the marker to the map by calling setMap()
        marker.setMap(map);
};

// to write new visit to server

function writeVisitToServer(dayId, type_of_place, name) {
  var post_data = {
    type_of_place: type_of_place,
    name: name
  };
 
  // the callback function below will be called if this request completes successfully. 
  // the server's response to this request is passed into this callback function as "responseData"
 
  var post_callback = function (responseData) {
    //... what to do when done...
  };
 
  // jQuery Ajax call - super very efficient
  $.post( "/days/" + dayId + "/attractions", post_data, post_callback);
}

// this function draw the day plan given the dayObject parameter
function drawDay(dayObject){

	$('#dayPlan').html("<h4>Hotel:</h4>");
 	if (dayObject.hotel != ''){
		$("#dayPlan").append("<p>" + dayObject.hotel + "</p>")
	}  
	$('#dayPlan').append("<h4>Things To Do: </h4>"); 		
	for (i=0; i<dayObject.thingsToDo.length; i++){
		$("#dayPlan").append("<p>" + dayObject.thingsToDo[i]+ "</p>")	
	};
	$('#dayPlan').append("<h4>Restaurants: </h4>"); 
	for (i=0; i<dayObject.restaurant.length; i++){
		$("#dayPlan").append("<p>" + dayObject.restaurant[i] + "</p>");
	} ;
	
}
// this function initiate map and initiate the lists of hotels, restaurants and things to do
function prepareList(){
	
	initialize_gmaps(40.705786, -74.007672);
	
	all_hotels.forEach( function(hotel){
		$("#list_hotels").append("<li><a>" + hotel.name +"</a></li>"); 
	});
	all_things_to_do.forEach( function(thingstodo){
		$("#list_thingstodo").append("<li><a>" + thingstodo.name +"</a></li>"); 
	});
	all_restaurants.forEach( function(restaurant){
		$("#list_restaurants").append("<li><a>" + restaurant.name +"</a></li>"); 
	})

	$("#hotelInMenu").prepend(all_hotels[0].name);
	$("#thingtodoInMenu").prepend(all_things_to_do[0].name);
	$("#restaurantInMenu").prepend(all_restaurants[0].name);
};

// check if the array containt an element that has name property equal to name and return that element

function lookUpName(Arr, name){
	for (var i=0, n=Arr.length; i<n; i++){
		if (Arr[i].name === name) {
			return Arr[i];
		}
	}
	return null;
}

function addDay(days){

}

function initiateDatabase(){
	$.post("/days");
}

function sort(arr){
	var sorted = [];
	for (var i=0; i<arr.length; i++){
		sorted[arr[i].day_number - 1] = arr[i];
	}
	return sorted;
}

$(document).ready(function() {
   	
   	prepareList();
   	// initiateDatabase(); 
   	// the database cannot be null !!!
    var hotelInMenu = all_hotels[0].name;
    var thingtodoInMenu = all_things_to_do[0].name;
    var restaurantInMenu = all_restaurants[0].name;
    var days = all_days;
    var thisday = 1;
    drawDay(days[0]);  
	
	// console.log("this is days", days);
	// if a element item is clicked, move it to the front and initiate the map
	
	$("a").click(function(){
		var element = $(this); 
		if (element.parent().parent().attr('id') === "list_hotels"){
			hotelInMenu = element.text();
			$("#hotelInMenu").html("<span>" + hotelInMenu+ "</span> <span class='caret'></span>" );
			var chosenObject = lookUpName(all_hotels, hotelInMenu);
			if (chosenObject != null){
				initialize_gmaps(chosenObject.place[0].location[0],chosenObject.place[0].location[1]);
			}
		} else if (element.parent().parent().attr('id') === "list_thingstodo"){
			thingtodoInMenu = element.text();
			$("#thingtodoInMenu").html("<span>"+thingtodoInMenu+"</span> <span class='caret'></span>");
			var chosenObject = lookUpName(all_things_to_do, thingtodoInMenu);
			if (chosenObject != null){
				initialize_gmaps(chosenObject.place[0].location[0],chosenObject.place[0].location[1]);
			}

		} else if (element.parent().parent().attr('id') === "list_restaurants"){
			restaurantInMenu = element.text();
			$("#restaurantInMenu").html("<span>"+restaurantInMenu+"</span> <span class='caret'></span>");
			var chosenObject = lookUpName(all_restaurants, restaurantInMenu);
			if (chosenObject != null){
				initialize_gmaps(chosenObject.place[0].location[0],chosenObject.place[0].location[1]);
			}
		}
	});
	
	// add a element item into the day plan list
	$(".addSomething").click(function(){
		var	addelement = $(this); 
		if (addelement.parent().siblings().attr('id')==="planHotel" ){
			days[thisday-1].hotel = hotelInMenu;
			writeVisitToServer(thisday,'hotel', hotelInMenu);
			drawDay(days[thisday-1]);
		} else if (addelement.parent().siblings().attr('id')==="planThing" ){
			var count = days[thisday-1].thingsToDo.length;
			if( days[thisday-1].thingsToDo.indexOf(thingtodoInMenu) === -1  ) { 
				days[thisday-1].thingsToDo[count] = thingtodoInMenu;
				writeVisitToServer(thisday,'thingtodo', thingtodoInMenu); 
				drawDay(days[thisday-1]);
			}
		} else if (addelement.parent().siblings().attr('id')==="planRestaurant" ){
			var count = days[thisday-1].restaurant.length;
			if( days[thisday-1].restaurant.indexOf(restaurantInMenu) === -1  ) { 
				days[thisday-1].restaurant[count] = restaurantInMenu;
				writeVisitToServer(thisday,'restaurant', restaurantInMenu); 
				drawDay(days[thisday-1]);
			}
			
		}
	});
	
	// this to change the view of that day itinerary 
	$(".day").click(function(){
	 	var dayelement = $(this);
	 	thisday = parseInt(dayelement.text()[dayelement.text().length-1]);
	 	// console.log(thisday);
	 	$('.active.day').removeClass('active');
	 	$(this).addClass('active');
		drawDay(days[thisday-1]);
	});
});
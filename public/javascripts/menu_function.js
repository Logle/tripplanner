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

function drawDay(dayObject){

	$('#dayPlan').html("<h4>Hotel:</h4>");
	if (dayObject.hotel != null){
		$("#dayPlan").append("<p>" + dayObject.hotel + "</p>")
	}  
	$('#dayPlan').append("<h4>Things To Do: </h4>"); 		
	for (i=0; i<dayObject.thingsToDo.length; i++){
		$("#dayPlan").append("<p>" + dayObject.thingsToDo[i] + "</p>")	
	};
	$('#dayPlan').append("<h4>Restaurants: </h4>"); 
	for (i=0; i<dayObject.restaurant.length; i++){
		$("#dayPlan").append("<p>" + dayObject.restaurant[i] + "</p>");
	} ;
	
}

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

	$("#nowhotel").prepend(all_hotels[0].name);
	$("#nowthingtodo").prepend(all_things_to_do[0].name);
	$("#nowrestaurant").prepend(all_restaurants[0].name);
};

function lookUpName(Arr, name){
	for (var i=0, n=Arr.length; i<n; i++){
		if (Arr[i].name===name) {
			return Arr[i];
		}
	}
	return null;
}

function addDay(days){
	return days.push({
		hotel: null,
		thingsToDo: [],
		restaurant: []
	});
}

$(document).ready(function() {
   	
   	prepareList();

    var nowhotel = all_hotels[0].name;
    var nowthingtodo = all_things_to_do[0].name;
    var nowrestaurant = all_restaurants[0].name;
    
    var days =[];  addDay(days); drawDay(days[0]);
	
	$("a").click(function(){
		var element = $(this); 
		if (element.parent().parent().attr('id') === "list_hotels"){
			nowhotel = $(this).context.innerHTML;
			$("#nowhotel").html("<span>" + nowhotel+ "</span>" );
			var ob = lookUpName(all_hotels, nowhotel);
			if (ob != null){
				initialize_gmaps(ob.place[0].location[0],ob.place[0].location[1]);
			}
		}
		if (element.parent().parent().attr('id') === "list_thingstodo"){
			nowthingtodo = $(this).context.innerHTML;
			$("#nowthingtodo").html("<span>"+nowthingtodo+"</span>");
			var ob = lookUpName(all_things_to_do, nowthingtodo);
			if (ob != null){
				initialize_gmaps(ob.place[0].location[0],ob.place[0].location[1]);
			}

		}
		if (element.parent().parent().attr('id') === "list_restaurants"){
			nowrestaurant = $(this).context.innerHTML;
			$("#nowrestaurant").html("<span>"+nowrestaurant+"</span>");
			var ob = lookUpName(all_restaurants, nowrestaurant);
			if (ob != null){
				initialize_gmaps(ob.place[0].location[0],ob.place[0].location[1]);
			}
		}
	})
	$(".addSomething").click(function(){
		addelement = $(this); 
		if (addelement.parent().siblings().attr('id')==="planHotel" ){

		}
	})
});
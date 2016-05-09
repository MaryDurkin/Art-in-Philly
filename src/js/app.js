

var ViewModel = function() {
	var self = this;
	this.location = ko.observable("Haverford");


}
var map;
var service;
var infowindow;
function initMap() {
    var philly = new google.maps.LatLng(39.9526, -75.1652);
    	map = new google.maps.Map(document.getElementById('map'), {
    		center: philly, //{lat: 39.9526, lng: -75.1652},			// Philadelphia PA
    		zoom: 13
    	});
    var request = {
    		location: philly,
    		radius: '2500',
    		types: ['museum']
  		};

  	service = new google.maps.places.PlacesService(map);
  	service.nearbySearch(request, callback);
}

function callback(results, status){
	if (status == google.maps.places.PlacesServiceStatus.OK) {

		var markers = [];
		var infoWindows = [];
		//var i = 0;

		for (var i = 0; i < results.length; i++) {

			var infoWindow = new google.maps.InfoWindow({
	      			content: "Hello?"+i
	    		});
			var marker = new google.maps.Marker({
	      			map: map,
	      			position: results[i].geometry.location,
	      			place: {
	      			placeId: results[i].place_id,
	      			location: results[i].geometry.location
	      			}
	      		});

			marker.addListener('click', (function(markerCopy, infoWindowCopy) {
				return function(){
		      		 		infoWindowCopy.open(map, markerCopy);
		      			};
		    })(marker, infoWindow));
		}

    }

}
ko.applyBindings(new ViewModel());
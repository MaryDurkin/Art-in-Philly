var artPlaces =  [
        {
            name: "Philadelphia Museum of Art",
            position: {lat: 39.9658015, lng: -75.1811616},
            type: 'Museum'
        },
        {
            name: "Barnes Foundation",
            position: {lat: 39.9605194, lng: -75.1725901},
            type: 'Museum'
        },
        {
            name: "Rodin Museum",
            position: {lat: 39.9619653, lng: -75.1739912},
            type: 'Museum'
        },
        {
   			name: "PAFA",
            position: {lat: 39.9556041, lng: -75.1632326},
            type: 'Museum'
        },
        {
            name: "Blick Art Materials",
            position: {lat: 39.9506031, lng: -75.1631014},
            type: 'Supply Store'
        },
        {
            name: "Philadelphia's Magic Gardens",
            position: {lat: 39.942642, lng: -75.1592851},
            type: 'Gallery'
        }
        ];

var ArtLocation = function(data){

	this.name = ko.observable(data.name);
	this.position = ko.observable(data.position);
	this.type = ko.observable(data.type);

};
var ViewModel = function() {
	var self = this;
	this.location = ko.observable("Haverford");

	this.artList = ko.observableArray([]);

	artPlaces.forEach(function(artPlaceItem){

		self.artList.push(new ArtLocation(artPlaceItem));
	});

	console.log(this.artList()[0].position());
	this.moveWindow = function() {
		console.log("this is where I figure out where to put the window");
		//infoWindow.setContent(artPlaces[iCopy].name);
		//infoWindow.open(map, markerCopy);
	};

}

var map;
var service;
var infowindow;
function initMap() {
    var philly = new google.maps.LatLng(39.9526, -75.1652);
    	map = new google.maps.Map(document.getElementById('map'), {
    		center: philly, //{lat: 39.9526, lng: -75.1652},			// Philadelphia PA
    		zoom: 14
    	});
    /*
    var request = {
    		location: philly,
    		radius: '2500',
    		types: ['museum','art_gallery','store']
  		};
	*/
  	//service = new google.maps.places.PlacesService(map);
  	//service.nearbySearch(request, callback);
  	//create infoWindow
  	infoWindow = new google.maps.InfoWindow({
	      			content: "try this"
	    		});
  	for (var i = 0; i < artPlaces.length; i++) {
  			/*
			var infoWindow = new google.maps.InfoWindow({
	      			content: "model "+i
	    		});
	    	*/
			var marker = new google.maps.Marker({
	      			map: map,
	      			position: artPlaces[i].position,
	      			label: artPlaces[i].type
	      		});

			marker.addListener('click', (function(markerCopy, iCopy) {
				return function(){

							infoWindow.setContent(artPlaces[iCopy].name);
		      		 		infoWindow.open(map, markerCopy);
		      			};
		    })(marker, i));
		}
}

ko.applyBindings(new ViewModel());
/*
function callback(results, status){
	if (status == google.maps.places.PlacesServiceStatus.OK) {

		var markers = [];
		var infoWindows = [];
		//var i = 0;

		for (var i = 0; i < results.length; i++) {

			var infoWindow = new google.maps.InfoWindow({
	      			content: "model "+i
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

} */


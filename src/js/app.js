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

var map;
var service;
var infowindow;
var locationMarkers = [];
var marker;
var i;
var PHILLY = {lat: 39.9526, lng: -75.1652};

function initMap() {
    //var philly = new google.maps.LatLng(39.9526, -75.1652);

    map = new google.maps.Map(document.getElementById('map'), {
    	center: PHILLY, //{lat: 39.9526, lng: -75.1652},			// Philadelphia PA
    	zoom: 14
    });

  	//create infoWindow
  	infoWindow = new google.maps.InfoWindow({
	   });



  	//This code works to set markers...

  	for (i = 0; i < artPlaces.length; i++) {

			marker = new google.maps.Marker({
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
			locationMarkers[i] = marker;
			if (i===3) {
				locationMarkers[2].setVisible(false);
			}
	}
	console.log(locationMarkers);
	locationMarkers[4].setVisible(false);
}

var ArtLocation = function(data){

	this.name = data.name;
	this.position = data.position;
	this.type = data.type;
	this.marker = data.marker;
};
var ViewModel = function() {
	var self = this;

	self.googleMap = map;
	this.location = ko.observable("Haverford");

	this.artList = ko.observableArray([]);

	artPlaces.forEach(function(artPlaceItem){

		self.artList.push(new ArtLocation(artPlaceItem));
	});



	this.currentAttraction = ko.observable(this.artList()[0]);
	console.log("Here");
	console.log(this.currentAttraction().name);
	console.log(locationMarkers);
	// Update current attraction
	this.setCurrentAttraction = function(nextAttraction){

		self.currentAttraction(nextAttraction);
		//reset the window content and position
		console.log(self.currentAttraction().name);
		console.log(locationMarkers);
		console.log(locationMarkers[0]);
		locationMarkers[0].setVisible(false);
		infoWindow.setContent(self.currentAttraction().name);
		infoWindow.setPosition(self.currentAttraction().position);
	};

	this.moveWindow = function(name) {

		console.log(self.currentAttraction().name);
		infoWindow.setPosition(self.currentAttraction().position);
		//infoWindow.open(map, markerCopy);
	};


}




ko.applyBindings(new ViewModel());



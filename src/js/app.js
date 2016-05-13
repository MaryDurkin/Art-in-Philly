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

var ArtLocation = function(data){
	/*
	this.name = ko.observable(data.name);
	this.position = ko.observable(data.position);
	this.type = ko.observable(data.type);
	*/
	this.name = data.name;
	this.position = data.position;
	this.type = data.type;
};
var ViewModel = function() {
	var self = this;
	this.location = ko.observable("Haverford");

	this.artList = ko.observableArray([]);

	artPlaces.forEach(function(artPlaceItem){

		self.artList.push(new ArtLocation(artPlaceItem));
	});

	//console.log(map);

	console.log(this.artList().length);
	console.log(this.artList()[0].position);
	console.log(this.artList()[0].type);
	console.log(this.artList()[0].name);

	/* this.currentCat = ko.observable(this.catList()[0]);
	this.setCurrentCat = function(nextCat) {

		self.currentCat(nextCat);

	}; */

	this.currentAttraction = ko.observable(this.artList()[0]);
	console.log("Here");
	console.log(this.currentAttraction().name);
	// Update current attraction
	this.setCurrentAttraction = function(nextAttraction){
		console.log("Which Damm Attraction!");
		self.currentAttraction(nextAttraction);
		//reset the window content and position
		infoWindow.setContent(self.currentAttraction().name);
		infoWindow.setPosition(self.currentAttraction().position);
	};

	this.moveWindow = function(name) {

		console.log("this is where I figure out where to put the window");
		//infoWindow.setContent(self.currentAttraction().name);

		console.log(self.currentAttraction().name);
		infoWindow.setPosition(self.currentAttraction().position);
		//infoWindow.open(map, markerCopy);
	};


}



function initMap() {
    //var philly = new google.maps.LatLng(39.9526, -75.1652);
    var philly = {lat: 39.9526, lng: -75.1652};
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
	   });

  	//This code works to set markers...

  	for (var i = 0; i < artPlaces.length; i++) {

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



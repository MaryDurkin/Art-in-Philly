var artPlaces =  [
        {
            name: "Philadelphia Museum of Art",
            position: {lat: 39.9658015, lng: -75.1811616},
            type: 'Museum'
        },
        {
            name: "The Barnes Foundation",
            position: {lat: 39.9605194, lng: -75.1725901},
            type: 'Museum'
        },
        {
            name: "Rodin Museum",
            position: {lat: 39.9619653, lng: -75.1739912},
            type: 'Museum'
        },
        {
   			name: "Pennsylvania Academy of The Fine Arts",
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
        },
        {
            name: "Test Error Location",
            position: {lat: 39.953248, lng: -75.162},
            type: 'Gallery'
        }
        ];

var map;
var infoWindow;
var locationMarkers = [];
var marker;
// used for the data bind menu
var placeTypes = ['All','Gallery','Museum','Supply Store'];

var ArtLocation = function(data){
	this.selected = ko.observable(true);
	this.name = data.name;
	this.position = data.position;
	this.type = data.type;

};

function initMap() {

    // create map
    var PHILLY = {lat: 39.9526, lng: -75.1652};
    map = new google.maps.Map(document.getElementById('map'), {
    	center: PHILLY,
    	zoom: 14
    });

  	//create infoWindow this window will have it's content and location assigned/changed when appropriate
  	infoWindow = new google.maps.InfoWindow({
	   });
  	// create markers...
  	for (var i = 0; i < artPlaces.length; i++) {
			marker = new google.maps.Marker({
	      			map: map,
	      			position: artPlaces[i].position,
	      			label: artPlaces[i].type
	      		});
		    // add marker to array of loaction markers
			locationMarkers[i] = marker;
	}
	ko.applyBindings(new ViewModel());
}

var ViewModel = function() {

	var self = this;
	chosenType =  ko.observable("All");
	var currentMarker;
	var currentIndex = 0;
	var lastIndex = 0;
	this.artList = ko.observableArray([]);

	var setWindow = function(place,index) {

		var CLIENT_ID = "NB2NRF1KT2Q2ZXV2XLNWX5OFP2MCBZN4ZSUHGCTA2UTEPX0I";
		var CLIENT_SECRET = "WZDS21MLCN3ETHUVXOZSZPFA13T2LJFEU2P0WWQYXCBCA2KI";
		var FourSquareURL = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20130815&ll=39.9526,-75.1652&query=" + place + "&match&limit=1";

			$.getJSON(FourSquareURL, function(data) {

				if (data.response.venues.length >0) {
					infoWindow.setContent(place + " "+data.response.venues[0].location.address + " " +data.response.venues[0].contact.formattedPhone);
					infoWindow.open(map,locationMarkers[index]);
				}
				//This is used in the event of the .getJSON working but foursquare not having information on that location
				else {
					infoWindow.setContent(place + " further information not available");
					infoWindow.open(map,locationMarkers[index]);
				}

			}).fail(function(e){ // regular error handling
				infoWindow.setContent(place + "  further information not available");
				infoWindow.open(map,locationMarkers[index]);
			});

	};

	artPlaces.forEach(function(artPlaceItem){

		self.artList.push(new ArtLocation(artPlaceItem));
	});



	// add event listeners to the markers
	for (var i = 0; i < locationMarkers.length; i++) {
		currentMarker = locationMarkers[i];

		currentMarker.addListener('click', (function(currentMarkerCopy, iCopy) {

			return function(){
				setMarkerBounce(currentMarkerCopy);
				setWindow(artPlaces[iCopy].name,iCopy);

		    };
		})(currentMarker, i));
	}


	this.currentAttraction = ko.observable(this.artList()[0]);


	this.updateVisibles = function() {

		var type = chosenType();

		// close info window when new filter is chosen
		infoWindow.close();
		if (type === 'All') {
			for (var i = 0; i < artPlaces.length; i++) {
				self.artList()[i].selected(true);
				locationMarkers[i].setVisible(true);
			}
		}
		else {
			for (var i = 0; i< artPlaces.length; i++){
				 if (type === self.artList()[i].type) {
				 	self.artList()[i].selected(true);
				 	locationMarkers[i].setVisible(true);
				 }
				 else {
				 	self.artList()[i].selected(false);
				 	locationMarkers[i].setVisible(false);
				 }
			}
		}
	};

	function findIndex(name) {

		for (var i=0; i < artPlaces.length; i++ ) {
			if (name === artPlaces[i].name) {
				return i;
			}
		}
		return -1;
	};

	function setMarkerBounce(marker) {

        marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
        marker.setAnimation(null);
    }, 2000);
    };



	// Update current attraction
	this.setCurrentAttraction = function(nextAttraction){
		//lastIndex = currentIndex;
		self.currentAttraction(nextAttraction);

		currentIndex = findIndex(self.currentAttraction().name)
		setMarkerBounce(locationMarkers[currentIndex]);
		setWindow(self.currentAttraction().name, currentIndex);
	};

};


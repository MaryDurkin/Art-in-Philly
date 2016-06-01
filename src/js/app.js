/*
There are two basic data structures that the app uses:
	the initial one provided - artPlaces
	a KO array created from artPlaces, with map markers added
*/
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
        {	// used to test, for example, if a location closes and foursquare no longer holds data
            name: "Test Error Location",
            position: {lat: 39.953248, lng: -75.162},
            type: 'Gallery'
        }
        ];

var map;
// used for the data bind menu
var placeTypes = ['All','Gallery','Museum','Supply Store'];

function initMap() {

    // create map
    var PHILLY = {lat: 39.9526, lng: -75.1652};
    map = new google.maps.Map(document.getElementById('map'), {
    	center: PHILLY,
    	zoom: 14
    });

	ko.applyBindings(new ViewModel());
}

var ViewModel = function() {

	var self = this;
	var infoWindow;
	var currentAttraction;
	var marker;
	var text;
	query =  "";

	// constructor for element of KO array artList
	var ArtLocation = function(data){
		this.selected = ko.observable(true);
		this.name = data.name;
		this.position = data.position;
		this.type = data.type;
		this.marker = data.marker;

	};

	// An observable array to store locations, their data and markers
	artList = ko.observableArray([]);

	//populate KO list of places
	artPlaces.forEach(function(artPlaceItem){
		artList.push(new ArtLocation(artPlaceItem));
	});

	//create infoWindow, this window will have it's content and location assigned/changed when appropriate
  	infoWindow = new google.maps.InfoWindow({
	   });

  	//create markers, add them to the artList and assign listeners
	for (var i = 0; i < artList().length; i++) {
			marker = new google.maps.Marker({
	      			map: map,
	      			position: artList()[i].position,
	      			label: artList()[i].type
	      		});

			artList()[i].marker = marker;

			marker.addListener('click', (function(markerCopy, iCopy) {
				return function(){
					currentAttraction = artList()[iCopy];
					setMarkerBounce(markerCopy);
					setWindow(currentAttraction);
		    	};
			})(marker, i));
	};
	// initial value
	//currentAttraction = artList()[0];
	// setWindow gets the info from foursquare and updates the content of the infowindow
	var setWindow = function(attraction) {

		var CLIENT_ID = "NB2NRF1KT2Q2ZXV2XLNWX5OFP2MCBZN4ZSUHGCTA2UTEPX0I";
		var CLIENT_SECRET = "WZDS21MLCN3ETHUVXOZSZPFA13T2LJFEU2P0WWQYXCBCA2KI";
		var FourSquareURL = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20130815&ll=39.9526,-75.1652&query=" + attraction.name + "&match&limit=1";

			$.getJSON(FourSquareURL, function(data) {

				if (data.response.venues.length >0) {
					infoWindow.setContent(attraction.name + " "+data.response.venues[0].location.address + " " +data.response.venues[0].contact.formattedPhone);
					infoWindow.open(map,attraction.marker);
				}
				//This is used in the event of the .getJSON working but foursquare not having information on that location
				else {
					infoWindow.setContent(attraction.name + " further information not available");
					infoWindow.open(map,attraction.marker);
				}

			}).fail(function(e){ // regular error handling
				infoWindow.setContent(attraction + "  further information not available");
				infoWindow.open(map,attraction.marker);
			});

	};

	// this.filter is bound to the search box and sets the visibility of each
	// location if it matches the search criteria
	this.filter = function() {

		//console.log("searching for matches of.."+string);
		infoWindow.close();
		var lowerCaseQuery = query.toLowerCase();

		for (var i=0; i < artList().length; i++) {
			if (artList()[i].name.toLowerCase().indexOf(lowerCaseQuery) !== -1) {
				artList()[i].selected(true);
				artList()[i].marker.setVisible(true);
			}
			else {
				artList()[i].selected(false);
				artList()[i].marker.setVisible(false);
			}
		};
	};

	function setMarkerBounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
        	marker.setAnimation(null);
    	}, 2000);
    };

	// bound to listed attractions
	this.setCurrentAttraction = function(nextAttraction){
		currentAttraction = nextAttraction;
		setMarkerBounce(currentAttraction.marker);
		setWindow(currentAttraction);
	};

};


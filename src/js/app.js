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
		}
		];

var map;
// used for the data bind menu and possible later in the apps future for a 'select by type' menu option
var placeTypes = ['All','Gallery','Museum','Supply Store'];

function initMap() {

// This JSON generated using the Google Maps style wizard:
// http://googlemaps.github.io/js-samples/styledmaps/wizard/index.html
	var styles = [
		{
			"featureType": "water",
			"stylers": [
				{ "color": "#92a8d1" }
			]
		},{
			"featureType": "poi.park",
			"stylers": [
				{ "lightness": 29 },
				{ "saturation": -12 },
				{ "hue": "#00ff77" }
			]
		},{
			"featureType": "landscape.man_made",
			"stylers": [
				{ "hue": "#ffbb00" },
				{ "saturation": 17 },
				{ "lightness": -8 }
			]
		},{
			"featureType": "transit.line",
			"stylers": [
				{ "color": "#9896a4" }
			]
		},{
			"featureType": "transit.station",
			"stylers": [
				{ "color": "#9896a4" }
			]
		},{
			"featureType": "poi.school",
			"stylers": [
				{ "color": "#b18f6a" }
			]
		},{
			"featureType": "road.arterial",
			"stylers": [
				{ "saturation": -22 }
			]
		}
	];

	var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
	// create map
	var PHILLY = {lat: 39.9526, lng: -75.1652};
	var mapOptions = {
		center: PHILLY,
		zoom: 14,
		mapTypeControl: false,
		mapTypeControlOptions: {
		mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		}
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');

	ko.applyBindings(new ViewModel());
}

var ViewModel = function() {

	var self = this;
	var infoWindow;
	var currentAttraction;
	var marker;
	var text;
	var query;
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
	}

	// setWindow gets the info from foursquare and updates the content of the infowindow
	var CLIENT_ID = "NB2NRF1KT2Q2ZXV2XLNWX5OFP2MCBZN4ZSUHGCTA2UTEPX0I";
	var CLIENT_SECRET = "WZDS21MLCN3ETHUVXOZSZPFA13T2LJFEU2P0WWQYXCBCA2KI";
	var contentString;

	var setWindow = function(attraction) {

		var FourSquareURL = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20130815&ll=39.9526,-75.1652&query=" + attraction.name + "&match&limit=1";
		var attributionURL = "http://foursquare.com/v/";
		var address;
		var phone;
		$.getJSON(FourSquareURL, function(data) {})
			.done(function(data){
			if (data.response.venues.length >0) {
				//if the venue is found, populate the info window
				// check phone # is returned
				phone = data.response.venues[0].contact.formattedPhone ? data.response.venues[0].contact.formattedPhone : "No phone";
				//check location address is returned
				address = data.response.venues[0].location.address ? data.response.venues[0].location.address : "No address found";
				attributionURL = "http://foursquare.com/v/"+data.response.venues[0].id;
				contentString = '<div id="window-content">'+
								'<h4 id="name">'+attraction.name+'</h4>'+
								'<h5 id="address">'+address+'</h5>'+
								'<h5 id="phone">'+phone+'</h5>'+
								'<h6 id="attribution">(Information provided by <a href="" id="four-square-return" target="_blank">FourSquare</a> )</h6>'+
								'</div>';
				infoWindow.setContent(contentString);
				infoWindow.open(map,attraction.marker);
				document.getElementById("four-square-return").href = attributionURL;
				}

			else {
				// If the venue is not found, but the getJSON doesn't fail - populate the info window with error message
				contentString = '<div id="window-content">'+
								'<h4 id="name">'+attraction.name+'</h4>'+
								'<h6 id="error-msg">Further information not available</h6>'+
								'</div>';
				infoWindow.setContent(contentString);
				infoWindow.open(map,attraction.marker);
			}

			})
			.fail(function(e){ // regular error handling
			contentString = '<div id="window-content">'+
							'<h4 id="name">'+attraction.name+'</h4>'+
							'<h6 id="attribution">Further information not available</h6>'+
							'</div>';
			infoWindow.setContent(contentString);
			infoWindow.open(map,attraction.marker);
			});

	};

	// this.filter is bound to the search box and sets the visibility of each
	// location if it matches the search criteria
	this.filter = function() {

		infoWindow.close();
		var lowerCaseQuery = this.query.toLowerCase();

		for (var i=0; i < artList().length; i++) {
			if (artList()[i].name.toLowerCase().indexOf(lowerCaseQuery) !== -1) {
				artList()[i].selected(true);
				artList()[i].marker.setVisible(true);
			}
			else {
				artList()[i].selected(false);
				artList()[i].marker.setVisible(false);
			}
		}
	};

	function setMarkerBounce(marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
			marker.setAnimation(null);
			}, 2000);
	};

	// bound to listed attractions/places/venues
	this.setCurrentAttraction = function(nextAttraction){
		currentAttraction = nextAttraction;
		setMarkerBounce(currentAttraction.marker);
		setWindow(currentAttraction);
	};

};


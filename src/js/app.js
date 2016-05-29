var artPlaces =  [
        {
            name: "Philadelphia Museum of Art",
            position: {lat: 39.9658015, lng: -75.1811616},
            type: 'Museum',
            address: "",
            crossStreet: "",
            phone: ""
        },
        {
            name: "The Barnes Foundation",
            position: {lat: 39.9605194, lng: -75.1725901},
            type: 'Museum',
            address: "",
            crossStreet: "",
            phone: ""
        },
        {
            name: "Rodin Museum",
            position: {lat: 39.9619653, lng: -75.1739912},
            type: 'Museum',
            address: "",
            crossStreet: "",
            phone: ""
        },
        {
   			name: "Pennsylvania Academy of The Fine Arts",
            position: {lat: 39.9556041, lng: -75.1632326},
            type: 'Museum',
            address: "",
            crossStreet: "",
            phone: ""
        },
        {
            name: "Blick Art Materials",
            position: {lat: 39.9506031, lng: -75.1631014},
            type: 'Supply Store',
            address: "",
            crossStreet: "",
            phone: ""
        },
        {
            name: "Philadelphia's Magic Gardens",
            position: {lat: 39.942642, lng: -75.1592851},
            type: 'Gallery',
            address: "",
            crossStreet: "",
            phone: ""
        }
        ];

var map;
var infoWindow;
var locationMarkers = [];
var marker;
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
    	center: PHILLY, //{lat: 39.9526, lng: -75.1652},			// Philadelphia PA
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
			artPlaces[i].marker = marker;

	}
	ko.applyBindings(new ViewModel());
}

var ViewModel = function() {

	var self = this;
	chosenType =  ko.observable("All");
	var currentMarker;
	this.artList = ko.observableArray([]);

	var getFourSquareInfo = function(place,position) {

	var CLIENT_ID = "NB2NRF1KT2Q2ZXV2XLNWX5OFP2MCBZN4ZSUHGCTA2UTEPX0I";
	var CLIENT_SECRET = "WZDS21MLCN3ETHUVXOZSZPFA13T2LJFEU2P0WWQYXCBCA2KI";
	var FourSquareURL = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&v=20130815&ll=39.9526,-75.1652&query=" + place + "&match&limit=1";
	var windowData;
		$.getJSON(FourSquareURL, function(data) {

			windowData = data;
			infoWindow.setContent(place + " "+data.response.venues[0].location.address + " " +data.response.venues[0].contact.formattedPhone);
			infoWindow.setPosition(position);
			infoWindow.open(map);

		});

	};

	artPlaces.forEach(function(artPlaceItem){

		self.artList.push(new ArtLocation(artPlaceItem));
	});

	// add event listeners to the markers
	for (var i = 0; i < artPlaces.length; i++) {
		currentMarker = artPlaces[i].marker;
		currentMarker.addListener('click', (function(currentMarkerCopy, iCopy) {
			return function(){
				getFourSquareInfo(artPlaces[iCopy].name,artPlaces[iCopy].position);
		    };
		})(currentMarker, i));
	};
	//getFourSquareInfo();

	this.currentAttraction = ko.observable(this.artList()[0]);


	this.updateVisibles = function() {

		var type = chosenType();

		// close info window when new filter is chosen
		infoWindow.close();
		if (type === 'All') {
			for (var i = 0; i < artPlaces.length; i++) {
				self.artList()[i].selected(true);

				artPlaces[i].marker.setVisible(true);
			}
		}
		else {
			for (var i = 0; i< artPlaces.length; i++){


				 if (type === self.artList()[i].type) {
				 	self.artList()[i].selected(true);
				 	artPlaces[i].marker.setVisible(true);

				 }
				 else {
				 	self.artList()[i].selected(false);
				 	artPlaces[i].marker.setVisible(false);

				 }
			}
		}

	};

	// Update current attraction
	this.setCurrentAttraction = function(nextAttraction){
		self.currentAttraction(nextAttraction);
		getFourSquareInfo(self.currentAttraction().name, self.currentAttraction().position);

	};

}


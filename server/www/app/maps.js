
$(document).ready(function() {
	// This example displays a marker at the center of Australia.
	// When the user clicks the marker, an info window opens.
	// ITB
	// -6.891625, 107.610089

  var locations = [ 
					['Node 1', -6.891625, 107.610089],
					['Telkom', -6.974001,107.6281593]
				];
  var startCoordinate = {lat: -6.9034443, lng: 107.5731159};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: startCoordinate
  });
  var temperature = 0 , humidity = 0 , windSpeed = 0 ,  luxIntensity = 0;
  var menit = 0; suhu = 0, lembab = 0, tekanan = 0, lux = 0, windDirection = 0, lat = 0, long = 0, rainfall = 0;
var rainfallMinute = 0, windSpeedMinute = 0;
var lastLat = 0, lastLong = 0;
  var now = Date();

  var contentString = [
  	  '<div id="content">'+
	      '<div id="siteNotice">'+
	      '</div>'+
	      '<h1 id="firstHeading" class="firstHeading">Poksay - <small> Node 1 </small></h1>'+
	      '<h2 class="secondHeading">PPTK Gambung B3</h2>'+
	      '<div> Status : <span id="deviceStats1" class="label label-success">Active</span> - Plant Health : <span id="deviceStats1" class="label label-success">Fertile, no need pestiside</span> </div>' +

	      '<div id="bodyContent">'+
	      '<h4> Realtime Data : </h4>'+
	      '<div class="table-responsive"> ' +
	      '<table class="table">' +
	      '<thead>' +
	      '<tr>' +
	      '<th> Parameter </th> ' +
	      '<th> Value </th> ' +
	      '</tr>' +
	      '</thead>' +
	      '<tbody>' + 
	      '<tr>' +
	      '<th> Temperature </th> ' +
	      '<th id="temp1"> ' + suhu + ' Celcius </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Humidity </th> ' +
	      '<th id="humid1"> ' + lembab + ' %</th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Pressure </th> ' +
	      '<th id="pres1"> ' + tekanan + ' %</th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Wind Speed </th> ' +
	      '<th id="windSpeed1"> ' + windSpeedMinute + ' m/s </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Wind Direction </th> ' +
	      '<th id="windDirection1"> ' + windDirectionConvert(windDirection) + ' </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Lux Intensity </th> ' +
	      '<th id="luxIntensity1"> ' + lux + ' lux </th> ' +
	      '</tr>' +
	      '</tbody>' +
	      '</table>' +
	      '' +
	      '<p> <a class="btn btn-primary" href="graph-Device1.html">'+
	      '	Realtime graph </a> <a class="btn btn-info" href="graphMonthly-Device1.html">'+
	      '	Monthly graph </a> <a class="btn btn-warning" href="flyDrone-Device1.html">'+
	      '	Fly Drone </a> </p>'+
	      	      '<small>' + now + '</small>' +

	      '</div>'+
	      '</div>' 
       
      ,
      
	      '<div id="content">'+
	      '<div id="siteNotice">'+
	      '</div>'+
	      '<h1 id="firstHeading" class="firstHeading">ZeroDevice - 2</h1>'+
	      '<div> Status : <span id="deviceStats1" class="label label-default">Not Active</span> </div>' +
	      '<div id="bodyContent">'+
	      '<h4> Realtime Data : </h4>'+
	      '<div class="table-responsive"> ' +
	      '<table class="table">' +
	      '<thead>' +
	      '<tr>' +
	      '<th> Parameter </th> ' +
	      '<th> Value </th> ' +
	      '</tr>' +
	      '</thead>' +
	      '<tbody>' + 
	      '<tr>' +
	      '<th> Temperature </th> ' +
	      '<th id="temp2"> ' + temperature + ' Celcius </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Humidity </th> ' +
	      '<th id="humid2"> ' + humidity + ' %</th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Wind Speed </th> ' +
	      '<th id="windSpeed2"> ' + windSpeed + ' m/s </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Wind Direction </th> ' +
	      // '<th id="windDirection2"> ' + windDirection + ' degree </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Lux Intensity </th> ' +
	      '<th id="luxIntensity2"> ' + luxIntensity + ' lux </th> ' +
	      '</tr>' +
	      '</tbody>' +
	      '</table>' +
	      '' +
	      '<p> <a class="btn btn-primary" href="graph.html">'+
	      '	Realtime graph </a> <a class="btn btn-info" href="graph.html">'+
	      '	Monthly graph </a> </p>'+
	      	      '<small>' + now + '</small>' +

	      '</div>'+
	      '</div>' 
      ];


  var infowindow = new google.maps.InfoWindow();
  var marker, i;

  /**
  for (var i = 0; i < locations.length ; i++) {
	  marker = new google.maps.Marker({
	    position: new google.maps.LatLng(locations[i][1], locations[i][2]),
	    map: map,
	  });

	  // marker.addListener('click', function() {
	  //   infowindow.setContent(contentString[i]);
	  //   infowindow.open(map, marker);
	  // });
	  google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(contentString[i]);
          infowindow.open(map, marker);
        }
      })(marker, i));
  }**/

  // set number of device
  //var numberDevices = infowindow.length;
  //$('#numberDevice').text(numberDevices.toString());

  // socket bro
  var socket = io.connect();
  socket.on('aws-data', (data)=> {
  	console.log(data);
  	suhu = data.suhu;
  	lembab = data.lembab;
  	tekanan = data.tekanan; 
  	lux = data.lux;
  	windDirection = data.windDirection;
  	rainfall = data.rainfall;
  	lat = data.lat;
  	long = data.long;

  	// check lat && long not null

  	if (lat != 'null' && long != 'null'){
  		// kasih jarak biar ga selalu upate
  		let distance = haversineDistance([parseFloat(lat),parseFloat(long)],[parseFloat(lastLat),parseFloat(lastLong)]);
  		//console.log(distance);
  		if (lastLat != lat && lastLong != long && distance >10000){
  			//drawMaps(parseFloat(lat),parseFloat(long));
  			//drawMaps(parseFloat(lat),parseFloat(long));
  			drawMaps(-7.1483992,107.5072534);
  			lastLat = lat;
  			lastLong = long;
  		}
  	}
  	// temperature = data.temperature;
  	// humidity = data.humidity;
  	// windSpeed = data.windSpeeds;
  	// windDirection = data.windDirection;
  	// luxIntensity = data.luxIntensity;

  	
  	// set data to html id
  	$('#temp1').text(suhu + ' Celcius');
  	$('#humid1').text(lembab + ' %');
  
  	$('#windDirection1').text(windDirectionConvert(windDirection) );
  	$('#luxIntensity1').text(lux + ' lux');
  	$('#pres1').text(tekanan + ' Pascal');
  });

  socket.on('minuteData', (data)=>{
  	console.log(data);
  	windSpeedMinute = data.windSpeedMinute;
  	rainfallMinute  = data.rainfallMinute;
  	$('#windSpeed1').text(windSpeedMinute + ' m/s');
  })	

 // body, ...args)
var deviceCount = 0;
 function drawMaps(lat,lon){

 	  marker = new google.maps.Marker({
	    position: new google.maps.LatLng(lat, lon),
	    map: map,
	  });

	  google.maps.event.addListener(marker, 'click', (function(marker) {
        return function() {
          infowindow.setContent(contentString[0]);
          infowindow.open(map, marker);
        }
      })(marker));

	  deviceCount++;
	  $('#numberDevice').text(deviceCount.toString());
 }


 function windDirectionConvert(value){
 	if (value == 0) {
 		return "North";
 	} else if (value == 1) {
 		return "North East";
 	} else if (value == 2) {
 		return "East";
 	} else if (value == 3) {
 		return "South East";
 	} else if (value == 4) {
 		return "South";
 	} else if (value == 5) {
 		return "South West";
 	} else if (value == 6) {
 		return "West";
 	} else if (value == 7) {
 		return "North West";
 	}
 }

});

/**
 * Calculates the haversine distance between point A, and B.
 * @param {number[]} latlngA [lat, lng] point A
 * @param {number[]} latlngB [lat, lng] point B
 * @param {boolean} isMiles If we are using miles, else km.
 */
const haversineDistance = (latlngA, latlngB) => {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRad(latlngB[1] - latlngA[1]);
  const dLatSin = Math.sin(dLat / 2);
  const dLon = toRad(latlngB[0] - latlngA[0]);
  const dLonSin = Math.sin(dLon / 2);

  const a = (dLatSin * dLatSin) +
            (Math.cos(toRad(latlngA[1])) * Math.cos(toRad(latlngB[1])) * dLonSin * dLonSin);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let distance = R * c;


  return distance;
}
$(document).ready(function() {
	// This example displays a marker at the center of Australia.
	// When the user clicks the marker, an info window opens.
	// ITB
	// -6.891625, 107.610089

  var locations = [ 
					['ITB', -6.891625, 107.610089],
					['Telkom', -6.974001,107.6281593]
				];
  var startCoordinate = {lat: -6.9034443, lng: 107.5731159};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: startCoordinate
  });
  var temperature = 0 , humidity = 0 , windSpeed = 0 ,  luxIntensity = 0;
  let menit = 0; suhu = 0, lembab = 0, tekanan = 0, lux = 0, windDirection = 0, lat = 0, long = 0, rainfall = 0;
let rainfallMinute = 0, windSpeedMinute = 0;
  var now = Date();

  var contentString = [
  	  '<div id="content">'+
	      '<div id="siteNotice">'+
	      '</div>'+
	      '<h1 id="firstHeading" class="firstHeading">ZeroDevice - 1</h1>'+
	      '<div> Status : <span id="deviceStats1" class="label label-success">Active</span> </div>' +
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
	      '<th id="temp1"> ' + temperature + ' Celcius </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Humidity </th> ' +
	      '<th id="humid1"> ' + humidity + ' %</th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Wind Speed </th> ' +
	      '<th id="windSpeed1"> ' + windSpeed + ' m/s </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Wind Direction </th> ' +
	      // '<th id="windDirection1"> ' + windDirection + ' degree </th> ' +
	      '</tr>' +
	      '<tr>' +
	      '<th> Lux Intensity </th> ' +
	      '<th id="luxIntensity1"> ' + luxIntensity + ' lux </th> ' +
	      '</tr>' +
	      '</tbody>' +
	      '</table>' +
	      '' +
	      '<p> <a class="btn btn-primary" href="graph-Device1.html">'+
	      '	Realtime graph </a> <a class="btn btn-info" href="graphMonthly-Device1.html">'+
	      '	Monthly graph </a> </p>'+
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
  }

  // set number of device
  var numberDevices = locations.length;
  $('#numberDevice').text(numberDevices.toString());

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

  	// temperature = data.temperature;
  	// humidity = data.humidity;
  	// windSpeed = data.windSpeeds;
  	// windDirection = data.windDirection;
  	// luxIntensity = data.luxIntensity;

  	
  	// set data to html id
  	$('#temp1').text(data.temperature + ' Celcius');
  	$('#humid1').text(data.humidity + ' %');
  	$('#windSpeed1').text(data.windSpeeds + ' m/s');
  	// $('#windDirection1').text(data.windDirection + ' degree');
  	$('#luxIntensity1').text(data.luxIntensity + ' lux');
  });

  socket.on('minuteData', (data)=>{
  	console.log(data);
  	windSpeedMinute = data.windSpeedMinute;
  	rainfallMinute  = data.rainfallMinute;
  })	

 // body, ...args)

});
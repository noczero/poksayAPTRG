var chart;
var chrt;

//convert time
function convertTimestamp(timestamp) {
  var d = new Date(timestamp * 1000),	// Convert the passed timestamp to milliseconds
		yyyy = d.getFullYear(),
		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
		hh = d.getHours(),
		h = hh,
		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}
	
	// ie: 2013-02-18, 8:35 AM	
	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
		
	return time;
}

$(document).ready(function() {
	// highstock
	$('#example').DataTable( {
      "ajax": {
         "url": "/api/v1",
         "dataSrc" : function(json) {
         	//console.log(json.rows);
         	return json.rows;
         }
     },
     "columns": [
				{    
				"render" : function (data, type, row, meta) {
					 return meta.row + meta.settings._iDisplayStart + 1;
				}
				},
         { "data": "temperature" },
         { "data" : "humidity"},
         { "data" : "windspeed"},
         { "data" : "winddirection"},
         { "data": "waktu" ,  
         		"render" :  function(data){
         					return convertTimestamp(data);
   								 }
        }
     ],
     "order" : [[0 , "desc"]]
    });

   	//DIsable UTC
   	   Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

   	   // table
   	   //Get Temperature in JSON
	   $.getJSON('/api/v1', function (data) {
	   			//console.log(data.rows[1]);
				var temperatureList = [], humidityList = [], windSpeedList = [], windDirectionList = [], luxList = [];

				 for (var i in data.rows) {
				 	//var waktu = new Date.(data.data[i].waktu).getTime()/1000;
				 	//var waktu = moment(data.data[i].waktu).unix();
				 	temperatureList.push([data.rows[i].date*1000 , data.rows[i].temperature]);
				 	humidityList.push([data.rows[i].date*1000 , data.rows[i].humidity]);
				 	windSpeedList.push([data.rows[i].date*1000 , data.rows[i].windspeed]);
				 	windDirectionList.push([data.rows[i].date*1000 , data.rows[i].lux]);
				 }

				//console.log(data.data[0].waktu);
				//	console.log(temperatureList);
				//console.log(data);

	 	Highcharts.stockChart('tempGraph', {
	        rangeSelector: {
	            selected: 1
	        },

	        title: {
	            text: 'Temperature over Time'
	        },

	        series: [{
	            name: 'Celcius',
	            data: temperatureList,
	            tooltip: {
	                valueDecimals: 2
	            }
	        }],credits: {
		      enabled: false
		 	}
    	});

    	Highcharts.stockChart('humidGraph', {
	        rangeSelector: {
	            selected: 1
	        },

	        title: {
	            text: 'Humidity over Time'
	        },

	        series: [{
	            name: 'Percents',
	            data: humidityList,
	            tooltip: {
	                valueDecimals: 2
	            }
	        }],credits: {
		      enabled: false
		 }
    	});

    	Highcharts.stockChart('windDirectionGraph', {
	        rangeSelector: {
	            selected: 1
	        },

	        title: {
	            text: 'Wind Direction over Time'
	        },

	        series: [{
	            name: 'Degree',
	            data: windDirectionList,
	            tooltip: {
	                valueDecimals: 2
	            }
	        }],credits: {
		      enabled: false
		 }
    	});

    	Highcharts.stockChart('windSpeedGraph', {
	        rangeSelector: {
	            selected: 1
	        },

	        title: {
	            text: 'Wind Speed over Time'
	        },

	        series: [{
	            name: 'm/s',
	            data: windSpeedList,
	            tooltip: {
	                valueDecimals: 2
	            }
	        }],credits: {
		      enabled: false
		 }
    	});

    	Highcharts.stockChart('luxIntensityGraph', {
	        rangeSelector: {
	            selected: 1
	        },

	        title: {
	            text: 'Light Intensity over Time'
	        },

	        series: [{
	            name: 'm/s',
	            data: luxList,
	            tooltip: {
	                valueDecimals: 2
	            }
	        }],credits: {
		      enabled: false
		 }
    	});


	});


	   // start
	 //Get Humidity in JSON
	 $.getJSON('/api/v1', function (data) {
	   			//console.log(data.rows[1]);
				var result = [];

				 for (var i in data.rows) {
				 	//var waktu = new Date.(data.data[i].waktu).getTime()/1000;
				 	//var waktu = moment(data.data[i].waktu).unix();
				 	result.push([data.rows[i].date*1000 , data.rows[i].humidity]);
				 }

				//console.log(data.data[0].waktu);
				//	console.log(result);
				//console.log(data);

	 	Highcharts.stockChart('humidGraph', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Humidity Indoor over Time (DHT22)'
        },

        series: [{
            name: 'Percents',
            data: result,
            tooltip: {
                valueDecimals: 2
            }
        }]
    	});

	});
	 // end

});
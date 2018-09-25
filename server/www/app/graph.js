$(document).ready(function() {
  var temperature = 0 , humidity = 0 , windSpeed = 0 , windDirection = 0, luxIntensity = 0;
  // socket bro
  var socket = io.connect();
  socket.on('aws-data', (data)=> {
  	console.log(data);
  	temperature = parseInt(data.temperature);
  	humidity = parseInt(data.humidity);
  	windSpeed = parseInt(data.windSpeeds);
  	windDirection = parseInt(data.windDirection);
  	luxIntensity = parseInt(data.luxIntensity);

  	gauge.value = windDirection;

  });

	Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

	// start one chart
	Highcharts.chart('tempGraph', {
        chart: {
            type: 'spline',
            events : {
                load : function() {
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = temperature;
                            series.addPoint([x, y], true, true);
                        }, 1000);
                }
            }
        },
        title: {
            text: 'Temperature'
        },
        xAxis: {
            type: 'datetime',
             crosshair : true,
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'Celcius'
                //https://www.kane.co.uk/knowledge-centre/what-are-safe-levels-of-co-and-co2-in-rooms
            },
             crosshair : true,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,

            plotBands: [{ // Light air
                from: 0 ,
                to: 3,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Cold', 
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 4,
                to: 15,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Cool',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 16,
                to: 27,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Normal',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Moderate breeze
                from: 28,
                to: 39,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Warm',
                    style: {
                        color: '#606060'
                    }
                }
            },
             { // Moderate breeze
                from: 40,
                to: 100,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Hot',
                    style: {
                        color: '#606060'
                    }
                }
            }
            ]
        },
        tooltip: {
            valueSuffix: ' Degree'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                }

            }
        },
        series: [{
            name: 'Temperature',
            data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: temperature
                        });
                    }
                    return data;
                }())

        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        },credits: {
		      enabled: false
		 }
    });    
    // end one chart 

    // start one chart
	Highcharts.chart('humidGraph', {
        chart: {
            type: 'spline',
            events : {
                load : function() {
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = humidity;
                            series.addPoint([x, y], true, true);
                        }, 1000);
                }
            }
        },
        title: {
            text: 'Humidity'
        },
        xAxis: {
            type: 'datetime',
             crosshair : true,
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'Percentage'
                //https://www.kane.co.uk/knowledge-centre/what-are-safe-levels-of-co-and-co2-in-rooms
            },
             crosshair : true,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,

            plotBands: [{ // Light air
                from: 0 ,
                to: 30,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Dry', 
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 31,
                to: 60,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Average',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 61,
                to: 100,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Wet',
                    style: {
                        color: '#606060'
                    }
                }
            }
            ]
        },
        tooltip: {
            valueSuffix: ' Degree'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                }

            }
        },
        series: [{
            name: 'Humidity',
            data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: humidity
                        });
                    }
                    return data;
                }())

        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        },credits: {
		      enabled: false
		 }
    });    
    // end one chart 

        // start one chart
	Highcharts.chart('windSpeedGraph', {
        chart: {
            type: 'spline',
            events : {
                load : function() {
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = windSpeed;
                            series.addPoint([x, y], true, true);
                        }, 1000);
                }
            }
        },
        title: {
            text: 'Wind Speed'
        },
        xAxis: {
            type: 'datetime',
             crosshair : true,
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'm/s'
                //https://www.kane.co.uk/knowledge-centre/what-are-safe-levels-of-co-and-co2-in-rooms
            },
             crosshair : true,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,

            plotBands: [{ // Light air
                from: 0 ,
                to: 0.3,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Calm', 
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 0.4,
                to: 1.5,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Light air',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 1.6,
                to: 3.3,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Light Breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 3.4,
                to: 5.5,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Gentle Breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 5.6,
                to: 7.9,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Moderate Breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 8,
                to: 10.7,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Fresh Breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 10.8,
                to: 13.8,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Strong Breeze',
                    style: {
                        color: '#606060'
                    }
                }
            }
            ]
        },
        tooltip: {
            valueSuffix: ' m/s'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                }

            }
        },
        series: [{
            name: 'Wind Speed',
            data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: windSpeed
                        });
                    }
                    return data;
                }())

        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        },credits: {
		      enabled: false
		 }
    });    
    // end one chart 
    

       // start one chart
	Highcharts.chart('luxIntensityGraph', {
        chart: {
            type: 'spline',
            events : {
                load : function() {
                        var series = this.series[0];
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current time
                                y = luxIntensity;
                            series.addPoint([x, y], true, true);
                        }, 1000);
                }
            }
        },
        title: {
            text: 'Lux Intensity'
        },
        xAxis: {
            type: 'datetime',
             crosshair : true,
            labels: {
                overflow: 'justify'
            }
        },
        yAxis: {
            title: {
                text: 'lux'
                //https://www.kane.co.uk/knowledge-centre/what-are-safe-levels-of-co-and-co2-in-rooms
            },
             crosshair : true,
            minorGridLineWidth: 0,
            gridLineWidth: 0,
            alternateGridColor: null,

            plotBands: [{ // Light air
                from: 0 ,
                to: 0.2,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Clear night, no Moon', 
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Light breeze
                from: 0.3,
                to: 1,
                color: 'rgba(0, 0, 0, 0)',
                label: {
                    text: 'Clear night, full Moon',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 1,
                to: 50,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Indoor (Family Living Room)',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 300,
                to: 500,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Sunrise/Sunset',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 500,
                to: 1000,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Overcast Daily',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 10000,
                to: 25000,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Daylight',
                    style: {
                        color: '#606060'
                    }
                }
            }, { // Gentle breeze
                from: 32000,
                to: 130000,
                color: 'rgba(68, 170, 213, 0.1)',
                label: {
                    text: 'Direct Sunlight',
                    style: {
                        color: '#606060'
                    }
                }
            }
            ]
        },
        tooltip: {
            valueSuffix: ' lux'
        },
        plotOptions: {
            spline: {
                lineWidth: 4,
                states: {
                    hover: {
                        lineWidth: 5
                    }
                },
                marker: {
                    enabled: false
                }

            }
        },
        series: [{
            name: 'Wind Speed',
            data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;

                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: luxIntensity
                        });
                    }
                    return data;
                }())

        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        },credits: {
		      enabled: false
		 }
    });    
    // end one chart 

    // compass

var gauge = new RadialGauge({
    renderTo: 'compass',
    width : 250,
    height : 250,
    minValue: 0,
    maxValue: 360,
    majorTicks: [
        "N",
        "NE",
        "E",
        "SE",
        "S",
        "SW",
        "W",
        "NW",
        "N"
    ],
    minorTicks: 22,
    ticksAngle: 360,
    startAngle: 180,
    strokeTicks: false,
    highlights: false,
    colorPlate: "#a33",
    colorMajorTicks: "#f5f5f5",
    colorMinorTicks: "#ddd",
    colorNumbers: "#ccc",
    colorNeedle: "rgba(240, 128, 128, 1)",
    colorNeedleEnd: "rgba(255, 160, 122, .9)",
    valueBox: false,
    valueTextShadow: false,
    colorCircleInner: "#fff",
    colorNeedleCircleOuter: "#ccc",
    needleCircleSize: 15,
    needleCircleOuter: false,
    animationRule: "linear",
    needleType: "line",
    needleStart: 75,
    needleEnd: 99,
    needleWidth: 3,
    borders: true,
    borderInnerWidth: 0,
    borderMiddleWidth: 0,
    borderOuterWidth: 10,
    colorBorderOuter: "#ccc",
    colorBorderOuterEnd: "#ccc",
    colorNeedleShadowDown: "#222",
    borderShadowWidth: 0,
    animationTarget: "plate",
    animationDuration: 1500,
    value: 0,
    animateOnInit: true
}).draw();
gauge.draw();

// setInterval(() => {
//    gauge.value = windDirection;
//    console.log(arahAngin);
// }, 1000);
});
'use strict';
// EXPREES DAN SOCKET IO
const express = require('express'); // import package express
const app = express(); 
const server = require('http').createServer(app);
const io = require('socket.io').listen(server); // import package socket.io
const path = require('path'); // import package path (sudah default ada)

app.use(express.static(path.join(__dirname,'www'))); // untuk nempation file web kita di folder www
const portListen = 1234;
server.listen(portListen);
console.log("Server starting... 192.168.1.2:" + portListen)


/*
0. BME DATA : 0, 1, 2
1. LUX : 3
2. rainfall : 4
3. WIND DIR : 5
4. GPS : 6, 7
*/

// var idDevice = 'zeroDevice-1', temperature = 0 , humidity = 0 , windSpeed = 0 , windDirection = 0, luxIntensity = 0;
//data bme : suhu, lembab, tekanan
let idDevice = 'zeroDevice-1', suhu = 0, lembab = 0, tekanan = 0, lux = 0, windDirection = 0, lat = 0, long = 0, rainfall = 0;
/*=====================================
=            Postgress SQL            =
=====================================*/
const postgress = require('pg');
const config = {
    user: 'pi',
    database: 'zeroWeather',
    password: 'noczero',
    port: 5432
};

const pool = new postgress.Pool(config);
//postgres://dbusername:passwrod@server:port/database
const connectionString = process.env.DATABASE_URL || 'postgres://pi:noczero@192.168.1.2:5432/zeroWeather';

// function insertDataToDB(){ 
// 	pool.connect((err,client,done) => {
// 		if(err){
// 			done();
// 			console.log(err);
// 		}
// 		//if (dataDHT22 != undefined) {
// 			const queryString = "INSERT INTO aws (id,dataBME,lux,windDirection,location) VALUES (" +  [idDevice,dataBME, lux, windDirection, location].join(",")  + ")";
			
// 			client.query(queryString , (err,result) => {
// 				if(err)
// 					console.log(err)
// 				else
// 					console.log('Insert data to Database success..');

// 				done();

// 			});
// 		//}
// 	});
// }

/*===================================
=            API Express            =
===================================*/
app.get('/api/v1', (req,res,next) => {
	 //let result = getIndoor();
	//const results; 
	pool.connect((err,client,done) => {
		if(err){
			done();
			console.log(err);
		} else {
			/*
0. BME DATA : 0, 1, 2 data bme : suhu, lembab, tekanan
1. LUX : 3
2. rainfall : 4
3. WIND DIR : 5
4. GPS : 6, 7
*/
			const queryString = "SELECT id,temperature,humidity,windspeed,winddirection,lux,extract(epoch from waktu) as date FROM aws";

			client.query(queryString, (err,result) => {
				done();
				if(err){
					console.log(err);
				} else {
					//console.log(result.rows);
					
					 res.json(result);
					 console.log("Get data using API...");
				}		
			});
		}
	});
});


// /*============================
// =            MQTT            =
// ============================*/
const mqtt = require('mqtt');
const topic1 = 'telkomIoT/sensor';
const topic2 = 'EEEDays/zeroDevice-1/cmd'; //subscribe to all topics

//const broker_server = 'mqtt://192.168.43.114';
//const broker_server = 'mqtt://192.168.1.2';
const broker_server = 'mqtt://192.168.1.2';

const options = {
	clientId : 'zero_device' + Math.random().toString(16).substr(2, 8),
	port : 1883,
	keepalive : 60
}
const clientMqtt = mqtt.connect(broker_server,options);
clientMqtt.on('connect', mqtt_connect);
clientMqtt.on('reconnect', mqtt_reconnect);
clientMqtt.on('error', mqtt_error);
clientMqtt.on('message', mqtt_messageReceived);

function mqtt_connect() {
	console.log('MQTT Connected');
	clientMqtt.subscribe(topic1);
	clientMqtt.subscribe(topic2);
}

function mqtt_reconnect(err){
	console.log(err);
	console.log('MQTT reconnect');
	//clientMqtt = mqtt.connect(broker_server, options); // reconnect
}

function mqtt_error(err){
	console.log(err);
}

function after_publish() {
	console.log('MQTT Publish');
	//call after publish
}

let dataDHT22;
let listMessage = [];
// pesan keterima dari broker dan diteruskan ke client
function mqtt_messageReceived(topic , message , packet){
	//console.log('Message received : ' + message);
	//console.log('Topic :' + topic);
	//var stringBuf = packet.payload.toString('utf-8');
    //var obj = JSON.parse(message.toString());
  	console.log('Topic : ' + topic );
  	console.log('Receive Messages : ' + message);
  	// message format csv : windSpeeds,windDirection,luxIntensity,temperature,humidity;

	if (topic == topic1){
		// message 
		listMessage = parsingRAWData(message,","); //parse the message by comma
		console.log("MSG : " +listMessage);
		// set message to var
/*
		0. BME DATA : 0, 1, 2 //data bme : suhu, lembab, tekanan
		1. LUX : 3
		2. rainfall : 4
		3. WIND DIR : 5
		4. GPS : 6, 7
*/
		let rainfallMinute = 0, windSpeedMinute = 0;

		if (listMessage[0] == "minute") {
			rainfallMinute = listMessage[1];
			windSpeedMinute = listMessage[2];
		}else{
			suhu = listMessage[0];
			lembab = listMessage[1];
			tekanan = listMessage[2]
			lux = listMessage[3];
			windDirection = listMessage[4];
			lat = listMessage[5];
			long = listMessage[6];
			rainfall = listMessage[7];
		}
		// windSpeed = listMessage[0];
		// windDirection = listMessage[1];
		// luxIntensity = listMessage[2];
		// temperature = listMessage[3];
		// humidity = listMessage[4];

		io.sockets.emit('minuteData',{
			topic1 : topic1,
			rainfallMinute: rainfallMinute,
			windSpeedMinute: windSpeedMinute
		});

		io.sockets.emit('aws-data', {
									//json
									// call in client data.topic , data.windSpeeds....
									topic : topic1 ,
									suhu: suhu,
									lembab: lembab,
									tekanan: tekanan,
									lux: lux,
									windDirection: windDirection,
									rainfall: rainfall,
									lat: lat,
									long: long

									// windSpeeds : listMessage[0] , 
									// windDirection : listMessage[1],
									// luxIntensity : listMessage[2],
									// temperature : listMessage[3],
									// humidity : listMessage[4]
								});
	}else
	if (topic == topic2){
		io.sockets.emit('led2', {data : message , topic : topic2})
	}

	//dataDHT22 = JSON.parse(message.toString());
	//io.sockets.emit('dataDHT22' , dataDHT22);
	//console.log(dataDHT22.temperature);
}
// /*=====  End of MQTT  ======*/

/*=================================
=            Socket IO            =
=================================*/
let jumlahClient = 0;
io.on('connection' , (socket)=> {
	jumlahClient++;
	console.log('New Client Connected');

	socket.on('ctrl-led1', (data) => {
		// receive from web and publish mqtt to turn LED1
		clientMqtt.publish(topic2, data.data.toString());
		console.log('publish message to ' + topic1 + ' - message ' + data.data);
	});


	socket.on('disconnect' , ()=> {
		jumlahClient--;
		console.log('Client disconnected \n' + 'Total :' + jumlahClient);
	});

});


/*=====  End of Socket IO  ======*/



// FUNCTION UNTUK PARSING
// argument 1 : data yang diparsing ex: 123 434 5334
// argument 2 : pemisah
// return array data [0] =123 [1] =434 [2] =5334
function parsingRAWData(data,delimiter){
	let result;
	result = data.toString().replace(/(\r\n|\n|\r)/gm,"").split(delimiter);

	return result;
}

//insertDataToDB();
// call it every 5 minutes
// setInterval( ()=> {
// 	insertDataToDB();
// }, 1000*60*5);
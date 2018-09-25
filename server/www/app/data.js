// declare for plot
var totalPoints = 300,
	soundList = [],
	vibrateList = [],
	soundVal = 0,
	vibrateVal = 0,
	updateInterval = 30;

function update(){
	const socket = io.connect();

	socket.on('led1', (data)=>{
		console.log(data);
		// document.getElementById("receiveData").innerHTML = "Current LED ON " + data.datahasil;
		$("#receiveData-1").text('message ' + data.data + ' on ' + data.topic); 
	});
	socket.on('led2', (data)=>{
		console.log(data);
		// document.getElementById("receiveData").innerHTML = "Current LED ON " + data.datahasil;
		$("#receiveData-2").text('message ' + data.data + ' on ' + data.topic); 
	});
	socket.on('led3', (data)=>{
		console.log(data);
		// document.getElementById("receiveData").innerHTML = "Current LED ON " + data.datahasil;
		$("#receiveData-3").text('message ' + data.data + ' on ' + data.topic); 
	});
	socket.on('runLED', (data)=>{
		console.log(data);
		// document.getElementById("receiveData").innerHTML = "Current LED ON " + data.datahasil;
		$("#receiveData-4").text('message ' + data.data + ' on ' + data.topic); 
	});


	socket.on('soundVibrate', (data) => {
		// push new value for flot
		$("#receiveData-2").text('message ' + data.data + ' on ' + data.topic); 
		console.log(data);
		console.log('Suara ' + data.data[0]);
		console.log('Getar ' + data.data[1]);

		soundVal = parseInt(data.data[0]);
		vibrateVal = parseInt(data.data[1]);
		cryingDetection(soundVal, vibrateVal);

		soundList.push([totalPoints , soundVal]);
		soundList.shift();

		vibrateList.push([totalPoints , vibrateVal]);
		vibrateList.shift();

		for(var i = 0; i < totalPoints; i++){
			vibrateList[i][0] = i;
			soundList[i][0] = i;
		}

	});

}

//doucment ready
$(document).ready(function() {
	var plotSound = $.plot("#grafikSuara" , [
  		  { data : getSoundList() , label : "Suara" }
         ] , {
              series: {
                shadowSize: 0 // Drawing is faster without shadows
              },
              yaxis: {
                min: 0,
                max: 100
              },
              xaxis: {
                show: false
              }
          });

	var plotVibrate = $.plot("#grafikGetar", [
		  { data : getVibrateList() , label : "Getaran" }
         ] , {
              series: {
                shadowSize: 0 // Drawing is faster without shadows
              },
              yaxis: {
                min: 0,
                max: 1
              },
              xaxis: {
                show: false
              }
          });

	// update plot suara
	function updateGrafik(){
		plotSound.setData([{data : soundList}]);
		plotSound.draw();

		plotVibrate.setData([{data : vibrateList}]);
		plotVibrate.draw();

		setTimeout(updateGrafik, updateInterval);
	}
	updateGrafik();
	// update plot getaran
});

let count = 0 ;
function cryingDetection(sound , vibrate) {
	if ((sound < 41 || sound > 42) && vibrate == 1){
		console.log("Mungkin crying.");
		count++;
	}

	if (count > 5){
		changeStatusHTML();
		console.log("Crying fixed...");
		count = 0;
		return true;
	}

	return false;
}


function changeStatusHTML(){
	if ( $('#stats').hasClass('label-normal')){
		$('#stats').removeClass('label-normal')
		$('#stats').addClass('label-warning')
		$('#stats').text('Crying detect...');
	}
}

setInterval(function(){ 
	if(count < 5){
		$('#stats').removeClass('label-warning')
		$('#stats').addClass('label-normal')

		$('#stats').text('Normal');
		count = 0 ;
		console.log("RESET STATUS");
	}

 }, 30000);

// graphic plot
function getSoundList(){
	for (var i = 0 ; i < totalPoints; ++i){
		soundList.push([i,0]);
	}

	return soundList;
}

function getVibrateList(){
	for (var i = 0; i < totalPoints ; ++i){
		vibrateList.push([i,0]);
	}

	return vibrateList;
}

// function slowLED(){
// 		const socket = io.connect();
// 		socket.emit('slowLED', true);
// 		$("#status").text("Slow");
// 		console.log("slow LED");
// }

// function mediumLED(){
// 	const socket = io.connect();
// 	socket.emit('mediumLED', true);
// 	$("#status").text("Medium");
// 	console.log("medium LED");
// }

// function fastLED(){
// 	const socket = io.connect();
// 	socket.emit('fastLED', true);
// 	$("#status").text("Fast");
// 	console.log("fast LED");
// }

// function startLED_1(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-led1', {data : true});
// 	$("#onoroff-1").text("Turn On LED");
// 	console.log("On LED");
// }

// function stopLED_1(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-led1', {data : false});
// 	$("#onoroff-1").text("Turn Off LED");
// 	console.log("Off LED");
// }

// function startLED_2(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-led2', {data : true});
// 	$("#onoroff-2").text("Turn On LED");
// 	console.log("On LED");
// }

// function stopLED_2(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-led2', {data : false});
// 	$("#onoroff-2").text("Turn Off LED");
// 	console.log("Off LED");
// }

// function startLED_3(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-led3', {data : true});
// 	$("#onoroff-3").text("Turn On LED");
// 	console.log("On LED");
// }

// function stopLED_3(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-led3', {data : false});
// 	$("#onoroff-3").text("Turn Off LED");
// 	console.log("Off LED");
// }

// function startRunningLED(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-runLED', {data : true});
// 	$("#onoroff-4").text("Turn ON Runing LED");
// 	console.log("Turn ON Runing LED");
// }

// function stopRunningLED(){
// 	const socket = io.connect();
// 	socket.emit('ctrl-runLED', {data : false});
// 	$("#onoroff-4").text("Turn OFF Runing LED");
// 	console.log("Turn OFF Runing LED");
// }


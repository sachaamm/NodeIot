
const StreamClientManager = require('./streamClientFunctions');


function emitToStreamClients(streamClients,captationId,dataArray){

	streamClients.forEach(function(streamClient) {

		if(!streamClient.over && parseInt(streamClient.captationId) == parseInt(captationId)){

			streamClient.socketClient.emit('receiveCaptation' + streamClient.clientId, dataArray);


			//console.log("Data " + dataArray + " to " + streamClient.clientId );

			//console.log("emit to receiveCaptation"+streamClient.socketIOPort);
		}

		//console.log("Captation Id for stream client " + captationId);





	});


}

function emitGPSDataToStreamRequired(streamClients,dataArray){


	StreamClientManager.getStreamClientsGpsAssisted(streamClients,function(streamClientsGpsAssisted){

		if(streamClientsGpsAssisted.length > 0){

			//  CAPTATION # 7 : GPS CAPTATION
				streamClientsGpsAssisted[0].socketClient.emit('receiveCaptation7', dataArray);

				//console.log("SEND GPS DATA TO A CLIENT");


		}


		streamClientsGpsAssisted.forEach(function(streamClientGpsAssisted) {

			// IN THE SAME TIME , INDICATE GPS INFO IN LOG

			//console.log("GPS INFO LOG");

			var streamLog = streamClientGpsAssisted.logExport;
			var lastLogLine = streamLog[streamLog.length - 1];

			if(lastLogLine){

				var lineLg = lastLogLine.length;

				lastLogLine["Latitude"] = dataArray[0];
				lastLogLine["Longitude"] = dataArray[1];
				lastLogLine["Altitude"] = dataArray[2];

				//console.log("last Log Line lg " + lastLogLine.length);

				//console.log("Stream log length " + streamLog.length);

				//console.log("lastlog line " );

				//console.log(lastLogLine);

				//console.log("data array [0] " + dataArray[0] + " [1] " + dataArray[1] + " [2] " + dataArray[2]);



				streamClientGpsAssisted.logExport[streamLog.length - 1] = lastLogLine;
				//console.log("Assign gps data to line");

			}

		});


	});







}

function getStreamCategoriesForCaptation(captationId,cb){

	connection.query('SELECT * FROM beeyond_captation WHERE id=' + captationId + '', function(err, rows, fields) {

		var sensorId = rows[0]["sensorId"];

		connection.query('SELECT * FROM beeyond_sensor WHERE id=' + sensorId + '', function(err, rows, fields) {

			// ON RECUPERE LES CATEGORIES

		});



	});



}


module.exports.emitToStreamClients = emitToStreamClients;
module.exports.emitGPSDataToStreamRequired = emitGPSDataToStreamRequired;
module.exports.getStreamCategoriesForCaptation = getStreamCategoriesForCaptation;

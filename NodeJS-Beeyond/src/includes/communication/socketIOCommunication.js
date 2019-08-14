
// --------------------
// -- SOCKET IO --
// --------------------


var _apiKey = "apiKey";

//var socketClient = null; // WE MUST BUILD AN ARRAY OF CLIENTS AND STORING IT IN SESSION
// WHEN A CLIENT IS DISCONNECTED WE REMOVE IT from THE ARRAY



var socketClients = [];


var currentServerIndex = 0;

// IO MANAGER IS USELESS



var socketClient = null;



function initSocketConnection(io,StreamClientManager,streamClients,SensorInfo,CaptationInfo,sqlConnection,socketIOPort){

	io.on('connection', function(client) {


		//socketClient = client;

		client.emit('communicateClientId', client.id);  // ON COMMUNIQUE AU CLIENT SON ID

		client.on('startCaptation', function(data) {

			var startCaptationMessage = data;
			var explodeStartCaptationMessage = startCaptationMessage.split("_");

			var apiKey = explodeStartCaptationMessage[0];
			var captationId = explodeStartCaptationMessage[1];



			SensorInfo.getSensorsValuesAndUnitsWithCaptationId(sqlConnection,captationId,function(sensorsValuesUnits){

				var valuesNames = sensorsValuesUnits[0];
				var unitsNames = sensorsValuesUnits[1];
				//var valuesTypes = rows[0]["valuesTypes"]; // DON'T FORGET THAT IM HERE GUYS

				var splValues = valuesNames.split("***");
				var splUnits = unitsNames.split("***");
				//var splTypes = valuesTypes.split("***");


				CaptationInfo.getCaptationInfo(sqlConnection,captationId,function(captation){

					var sensorValues = [];

					for(var i = 0 ; i < splValues.length-1 ; i++){

						var sensorValue = splValues[i]+" ("+splUnits[i]+")";
						sensorValues.push(sensorValue);

					}

					let gpsAssisted = false;

					if(captation[8] == 'on'){

						sensorValues.push("Latitude");
						sensorValues.push("Longitude");
						sensorValues.push("Altitude");

						gpsAssisted = true;

					}

					// on cree le socket client . on aura juste besoin de :
					streamClients.push(new StreamClientManager.StreamClient(client.id,captationId,[],false,new Date(),sensorValues,client,gpsAssisted));
					console.log("INSERT A NEW STREAM CLIENT -- (" + client.id + ") --");

					socketIOPort++;

				});



			});





		});

		client.on('disconnect', function(){

			console.log('User Disconnected '+ client.id);

			StreamClientManager.getStreamClient(streamClients,client.id,function(streamClient){

				streamClient.over = true; // PREPARE TO REMOVE DISCONNECTED CLIENT

			});

			StreamClientManager.flushDisconnectedStreamClients(streamClients);

			//socketClient = null;
		});





	});

}


module.exports.initSocketConnection = initSocketConnection;

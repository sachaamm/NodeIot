'use strict';

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

io.on('connection', function (client) {

	//socketClient = client;

	client.emit('communicateClientId', client.id); // ON COMMUNIQUE AU CLIENT SON ID

	client.on('startCaptation', function (data) {

		var startCaptationMessage = data;
		var explodeStartCaptationMessage = startCaptationMessage.split("_");

		var apiKey = explodeStartCaptationMessage[0];
		var captationId = explodeStartCaptationMessage[1];

		getSensorsValuesAndUnitsWithCaptationId(captationId, function (sensorsValuesUnits) {

			var valuesNames = sensorsValuesUnits[0];
			var unitsNames = sensorsValuesUnits[1];
			//var valuesTypes = rows[0]["valuesTypes"]; // DON'T FORGET THAT IM HERE GUYS

			var splValues = valuesNames.split("***");
			var splUnits = unitsNames.split("***");
			//var splTypes = valuesTypes.split("***");


			getCaptationInfo(captationId, function (captation) {

				var sensorValues = [];

				for (var i = 0; i < splValues.length - 1; i++) {

					var sensorValue = splValues[i] + " (" + splUnits[i] + ")";
					sensorValues.push(sensorValue);
				}

				if (captation[8] == 'on') {

					sensorValues.push("Latitude");
					sensorValues.push("Longitude");
					sensorValues.push("Altitude");
				}

				// on cree le socket client . on aura juste besoin de : 
				streamClients.push(new StreamClient(client.id, captationId, [], false, new Date(), sensorValues, client));
				console.log("INSERT A NEW STREAM CLIENT -- (" + client.id + ") --");

				socketIOPort++;
			});
		});
	});

	client.on('disconnect', function () {

		console.log('User Disconnected ' + client.id);

		getStreamClient(streamClients, client.id, function (streamClient) {

			streamClient.over = true; // PREPARE TO REMOVE DISCONNECTED CLIENT
		});

		flushDisconnectedStreamClients();

		//socketClient = null;
	});
});

ioServers.forEach(function (ioServer) {

	ioServer.on('connection', function (client) {

		//console.log("Client is now connected " + client.id + " client port " + client.port);


		client.emit('communicateClientId', client.id);
		//client.emit('communicateClientSocketPort', client.id); 


		//CAPTATION COMMUNICATION
		client.on('startCaptation', function (data) {
			// A CE STADE , ON NE PEUX PAS SAVOIR SUR QUEL PORT LE CLIENT COMMUNIQUE, CE QUI PEUT ETRE UN PROBLEME....


			console.log("start Captation");

			var startCaptationMessage = data;
			var explodeStartCaptationMessage = startCaptationMessage.split("_");

			var apiKey = explodeStartCaptationMessage[0];
			var captationId = explodeStartCaptationMessage[1];

			// WE CAN IMPROVE CODE BY USING THE FUNCTION getSensorsValuesAndUnitsWithCaptationId(captationId,cb)

			getSensorsValuesAndUnitsWithCaptationId(captationId, function (sensorsValuesUnits) {

				var valuesNames = sensorsValuesUnits[0];
				var unitsNames = sensorsValuesUnits[1];
				//var valuesTypes = rows[0]["valuesTypes"]; // DON'T FORGET THAT IM HERE GUYS

				var splValues = valuesNames.split("***");
				var splUnits = unitsNames.split("***");
				//var splTypes = valuesTypes.split("***");


				getCaptationInfo(captationId, function (captation) {

					var sensorValues = [];

					for (var i = 0; i < splValues.length - 1; i++) {

						var sensorValue = splValues[i] + " (" + splUnits[i] + ")";
						sensorValues.push(sensorValue);
					}

					if (captation[8] == 'on') {

						sensorValues.push("Latitude");
						sensorValues.push("Longitude");
						sensorValues.push("Altitude");
					}

					streamClients.push(new StreamClient(client.id, captationId, [], false, new Date(), sensorValues, socketIOPort, client));
					console.log("INSERT A NEW STREAM CLIENT -- (" + client.id + ") --");

					socketIOPort++;
				});
			});
		});

		client.on('disconnect', function () {

			console.log('User Disconnected ' + client.id);

			getStreamClient(streamClients, client.id, function (streamClient) {

				streamClient.over = true; // PREPARE TO REMOVE DISCONNECTED CLIENT
			});

			flushDisconnectedStreamClients();

			//socketClient = null;
		});
	});

	currentServerIndex++;
});

/*

io.on('connection', function(client) {  
	
	socketClient = client; // WE NEED THE SOCKET CLIENT TO BE REACHABLE AS GLOBAL VARIABLE
	
	console.log("Client is now connected " + client.id);
	
	
	client.emit('communicateClientId', client.id); 
	
	//CAPTATION COMMUNICATION
	client.on('startCaptation', function(data) {
		
		var startCaptationMessage = data;
		var explodeStartCaptationMessage = startCaptationMessage.split("_");
		
		var apiKey = explodeStartCaptationMessage[0];
		var captationId = explodeStartCaptationMessage[1];
		
		connection.query('SELECT * FROM beeyond_captation WHERE id=' + captationId + '', function(err, rows, fields) {
	
			var sensorId = rows[0]["sensorId"];
			
			connection.query('SELECT * FROM beeyond_sensor WHERE id=' + sensorId + '', function(err, rows, fields) {
	
				var valuesNames = rows[0]["valuesNames"];
				var unitsNames = rows[0]["unitsNames"];
				//var valuesTypes = rows[0]["valuesTypes"];
				
				var splValues = valuesNames.split("***");
				var splUnits = unitsNames.split("***");
				//var splTypes = valuesTypes.split("***");
							
				
						
				var sensorValues = [];
			
				for(var i = 0 ; i < splValues.length-1 ; i++){
				
					var sensorValue = splValues[i]+" ("+splUnits[i]+")";
					sensorValues.push(sensorValue);
								
				}
						
				streamClients.push(new StreamClient(client.id,captationId,[],false,new Date(),sensorValues,socketIOPort));
				socketIOPort++;
				//client.send(client.id);
				
	
			});
	
		});
		
		
		
		// PUSH A BEEYOND CLIENT
		
		
		// WE MUST DEFINE THE CLIENT HERE
		
		// SEND CAPTATION TO CLIENT ( RECEIVE ON CLIENT SIDE ) 
		//if(apiKey == _apiKey)client.emit('receiveCaptation', Math.random(10));
		
	});
	
	  client.on('disconnect', function(){
        
		console.log('User Disconnected '+ client.id);
		
		getStreamClient(streamClients,client.id,function(streamClient){
			
			streamClient.over = true; // PREPARE TO REMOVE DISCONNECTED CLIENT
					
		});
			
		flushDisconnectedStreamClients();
		
		
	
		socketClient = null;
    });
});


*/
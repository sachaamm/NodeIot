'use strict';

// --------------------
// -- UDP PORT --
// --------------------

udpServer.on('error', err => {
	console.log(`server error:\n${err.stack}`);
	server.close();
});

var nbLogMax = 3;
var nbLog = 0;

udpServer.on('message', (msg, rinfo) => {

	if (nbLog < nbLogMax) console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

	nbLog++;

	// PARSE MESSAGE
	var splMessage = msg.toString().split("***");
	var dataArray = [];

	var valueLine = [];

	var captationId = splMessage[0];

	var lg = splMessage.length;

	for (var i = 1; i < lg; i++) {

		dataArray.push(parseFloat(splMessage[i]));
		valueLine.push(parseFloat(splMessage[i]));
	}

	//var joinedValue = valueLine.join(",");

	var date = new Date();

	var seconds = date.getSeconds();
	var minutes = date.getMinutes();
	var hour = date.getHours();

	var time = hour + ":" + minutes + ":" + seconds;

	getStreamClientWithCaptationId(streamClients, captationId, function (streamClient) {

		getCaptationInfo(captationId, function (captation) {

			var jsonLine = '{';

			var streamCategories = streamClient.streamCategories;

			for (var i = 0; i < streamCategories.length; i++) {

				jsonLine += '"' + streamCategories[i] + '" : "' + dataArray[i] + '"';
				jsonLine += ',';
			}

			//if(captation[8] == 'on')jsonLine

			jsonLine += '"Time" : "' + time + '" }';

			var jsonParseLine = JSON.parse(jsonLine);

			addLineToStreamExportFileLinkedToCaptation(jsonParseLine, captationId);

			emitToStreamClients(dataArray); // EMIT

		});
	});
});

udpServer.on('listening', () => {
	const address = udpServer.address();
	console.log(`UDP server listening ${address.address}:${address.port}`);
});

udpServer.bind(udpPort);
// server listening 0.0.0
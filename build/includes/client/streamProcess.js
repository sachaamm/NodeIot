'use strict';

function emitToStreamClients(dataArray) {

	streamClients.forEach(function (streamClient) {

		if (!streamClient.over) {

			streamClient.socketClient.emit('receiveCaptation' + streamClient.clientId, dataArray);
			//console.log("emit to receiveCaptation"+streamClient.socketIOPort);
		}
	});
}

function getStreamCategoriesForCaptation(captationId, cb) {

	connection.query('SELECT * FROM beeyond_captation WHERE id=' + captationId + '', function (err, rows, fields) {

		var sensorId = rows[0]["sensorId"];

		connection.query('SELECT * FROM beeyond_sensor WHERE id=' + sensorId + '', function (err, rows, fields) {

			// ON RECUPERE LES CATEGORIES

		});
	});
}
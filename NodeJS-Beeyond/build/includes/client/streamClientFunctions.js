"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
//------------------------
// -- BEEYOND CLIENT
//------------------------
const StreamClient = class {

	constructor(clientId, captationId, logExport, over, connectionDate, streamCategories, socketClient) {

		this.clientId = clientId;
		this.captationId = captationId;
		this.logExport = logExport;
		this.over = over;
		this.connectionDate = connectionDate;
		this.streamCategories = streamCategories;
		//this.socketIOPort = socketIOPort;
		this.socketClient = socketClient;
	}

};

function getStreamClient(streamClients, clientId, cb) {

	streamClients.forEach(function (streamClient) {

		if (streamClient.clientId == clientId) cb(streamClient);
	});
}

function getStreamClientWithCaptationId(streamClients, captationId, cb) {

	streamClients.forEach(function (streamClient) {

		//console.log("streamClient.captationId " + streamClient.captationId + " captationId " + captationId);
		if (parseInt(streamClient.captationId) == parseInt(captationId)) {

			cb(streamClient);
		}
	});
}

function flushDisconnectedStreamClients() {

	streamClients.forEach(function (streamClient) {

		if (streamClient.over) {

			var index = streamClients.indexOf(streamClient);
			streamClients.splice(index, 1);

			console.log("FLUSH INDEX " + index);
		}
	});
}

function addLineToStreamExportFileLinkedToCaptation(line, captationId) {

	//console.log("ADD line to stream export file " + line.toString());


	streamClients.forEach(function (streamClient) {

		//console.log("STREAM CLIENT CPATATION ID " + parseInt(streamClient.captationId) + " CAPTATION ID " + parseInt(captationId));

		if (parseInt(streamClient.captationId) == parseInt(captationId)) {

			//console.log("PUSH SOMETGHING ");
			streamClient.logExport.push(line);
		}
	});
}

exports.default = StreamClient;
exports.getStreamClient = getStreamClient;
exports.addLineToStreamExportFileLinkedToCaptation = addLineToStreamExportFileLinkedToCaptation;
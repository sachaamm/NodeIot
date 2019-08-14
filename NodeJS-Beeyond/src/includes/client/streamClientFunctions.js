//------------------------
// -- BEEYOND CLIENT
//------------------------
const StreamClient = class {

	constructor(clientId,captationId,logExport,over,connectionDate,streamCategories,socketClient,gpsAssisted){

		this.clientId = clientId;
		this.captationId = captationId;
		this.logExport = logExport;
		this.over = over;
		this.connectionDate = connectionDate;
		this.streamCategories = streamCategories;
		//this.socketIOPort = socketIOPort;
		this.socketClient = socketClient;
		this.gpsAssisted = gpsAssisted;

	

	}


}




function getStreamClient(streamClients,clientId,cb){

	streamClients.forEach(function(streamClient) {

		if(streamClient.clientId == clientId)cb(streamClient);

	});


}


function getStreamClientWithCaptationId(streamClients,captationId,cb){


	streamClients.forEach(function(streamClient) {

			//console.log("streamClient.captationId " + streamClient.captationId + " captationId " + captationId);
		if(parseInt(streamClient.captationId) == parseInt(captationId)){


			cb(streamClient);
		}


	});


}

// GET ALL STREAM CLIENTS ASKING FOR A GPS ASSISTED CAPTATION
function getStreamClientsGpsAssisted(streamClients,cb){

	var streamClientsGpsAssisted = [];

	//streamClients.forEach( (streamClient) =>
	streamClients.forEach( function(streamClient)
	{

			if(streamClient.gpsAssisted)  streamClientsGpsAssisted.push(streamClient);


	});

	 cb(streamClientsGpsAssisted);



}


function flushDisconnectedStreamClients(streamClients){

	streamClients.forEach(function(streamClient) {

		if(streamClient.over){

			var index = streamClients.indexOf(streamClient);
			streamClients.splice(index,1);

			console.log("FLUSH INDEX " + index);
		}


	});

}






function addLineToStreamExportFileLinkedToCaptation(streamClients,line,captationId){

	//console.log("ADD line to stream export file " + line.toString());

	streamClients.forEach(function(streamClient) {

		//console.log("STREAM CLIENT CPATATION ID " + parseInt(streamClient.captationId) + " CAPTATION ID " + parseInt(captationId));

		if(parseInt(streamClient.captationId) == parseInt(captationId)){

			//console.log("PUSH SOMETGHING ");
			streamClient.logExport.push(line);

		}

	});


}



module.exports.StreamClient = StreamClient;
module.exports.getStreamClient = getStreamClient;
module.exports.getStreamClientWithCaptationId = getStreamClientWithCaptationId;
module.exports.getStreamClientsGpsAssisted = getStreamClientsGpsAssisted;
module.exports.flushDisconnectedStreamClients = flushDisconnectedStreamClients;
module.exports.addLineToStreamExportFileLinkedToCaptation = addLineToStreamExportFileLinkedToCaptation;


//module.exports.StreamClient = streamClient;
//export default StreamClient
//export { getStreamClient, addLineToStreamExportFileLinkedToCaptation, testFunc }

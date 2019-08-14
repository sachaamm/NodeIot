"use strict";

// --------------------
// -- STREAM EXPORT --
// --------------------


var exportFile = true;

var streamsFolder = "public/streams/";

var streamClientToExport = []; // ACTUALLY USELESS

function saveStreamToCSV(req, res, streamDescription, captationModelId) {

	var form = [];

	var captationId = captationModelId;
	var date = dateForStream;
	var fileName = streamName;
	var nbResults = streamLines.length - 1;
	var description = streamDescription;

	form.push(captationId);
	form.push(date);
	form.push(fileName);
	form.push(nbResults);
	form.push(description);

	insertEntry(req, res, "captation_file", form);

	streamExportCategories.push("Time");

	var csv = json2csv({ data: streamLines, fields: streamExportCategories });

	fs.writeFile(streamsFolder + streamName + '.csv', csv, function (err) {
		if (err) throw err;
		console.log('file saved');

		flushDisconnectedStreamClients(); // REMOVE DISCONNECTED CLIENTS

	});
}

// EXPORT ONE BY ONE , WITH A DESCRIPTION 
function exportDisconnectedClientsStreamLog(req, res, description, clientId) {

	console.log("EXPORT DISCONNECTED CLIENTS");

	var _streamName = "";

	streamClients.forEach(function (streamClient) {

		console.log("OVER " + streamClient.clientId + " CLIENT ID " + clientId);

		if (streamClient.clientId == clientId) {

			var captationId = streamClient.captationId;

			connection.query('SELECT * FROM beeyond_captation WHERE id=' + captationId + '', function (err, rows, fields) {

				_streamName = rows[0]["name"] + "-" + streamClient.clientId;

				var date = streamClient.connectionDate;

				var fileName = _streamName;
				var nbResults = streamClient.logExport.length - 1;

				var streamCategories = streamClient.streamCategories;
				streamCategories.push("Time");

				var form = [];

				form.push(captationId);
				form.push(date);
				form.push(fileName);
				form.push(nbResults);
				form.push(description);

				var csv = json2csv({ data: streamClient.logExport, fields: streamCategories });

				fs.writeFile(streamsFolder + _streamName + '.csv', csv, function (err) {

					if (err) throw err;
					console.log('file saved');

					flushDisconnectedStreamClients(); // REMOVE DISCONNECTED CLIENTS

					insertEntry(req, res, "captation_file", form);

					//res.redirect("/logs");
				});
			});
		}
	});
}
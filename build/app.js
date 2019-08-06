'use strict';

var _streamClientFunctions = require('./includes/client/streamClientFunctions');

var _streamClientFunctions2 = _interopRequireDefault(_streamClientFunctions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// * * * * * * * * * * * * * * * * * * * * * * * * * * * 
// * * * * BEEYOND - DATA VISUALIZER * * * * //
// * * * * * * * * * * * * * * * * * * * * * * * * * * * 
// Alexandre Amiel @ The Camp / The Hive - 2017 - 2018 
// * * * * * * * * * * * * * * * * * * * * * * * * * * * 

// EXPRESS
var express = require('express');
var app = express();

// SOCKET IO

//ONE MANAGER TO ROUTE ALL THE SOCKETS & IO SERVERS

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var nbClientsMaxForSocket = 10; // we can watch a max of 10 differents real time graph in same time
var socketServers = []; // 10 servers = 10 ports
var ioServers = [];

//FS
var fs = require("fs"),
    path = require("path");

//SERIAL PORT
var SerialPort = require('serialport');
var port;

//UDP
const dgram = require('dgram');
const udpServer = dgram.createSocket('udp4');

//MYSQL
var mysql = require('mysql');

//ASYNC
var async = require('async');

//EXEC 
var exec = require('exec');

//JSON CSV
var json2csv = require('json2csv');

//MYSQL
var mysql = require('mysql');

//PORTS
var expressPort = 8080;
var socketIOManagerPort = 8098;
var socketIOPort = socketIOManagerPort + 1; // increment socketIOPort , rather than socketIOManagerPort
var udpPort = 41234;

var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// SETUP EXPRESS
app.use(express.static(__dirname + '/public')); // SET PUBLIC FOLDER CONTENT REACHABLE FOR CLIENT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'thehive' })); // ENABLE SESSION

// SESSIONS
app.use(function (req, res, next) {

	if (typeof req.session.inserterErrorMessage == 'undefined') {
		req.session.inserterErrorMessage = [];
	}

	next();
});

app.use(function (req, res, next) {
	//res.locals.socketIOPort = socketIOPort; // userId is reachable everywhere

	res.locals.socketIOPort = socketIOManagerPort;
	res.locals.expressPort = expressPort;
	res.locals.baseUrl = baseUrl;

	next();
});

//PASSWORD
var p = 'beeyond123';

var connection = mysql.createConnection({
	connectionLimit: 100, //important    
	host: 'localhost',
	user: 'beeyondUser',
	password: p,
	database: 'beeyond'
});

// LOCAL
var baseUrl = "http://localhost";

// RICKSHAW
var rickshawColorPaletteNames = [// CHECK @ https://github.com/shutterstock/rickshaw#rickshawcolorpalette
"classic9", "colorwheel", "cool", "munin", "spectrum14", "spectrum2000", "spectrum2001"];

// WELCOME
console.log("### WELCOME TO BEEYOND DATA VISUALIZER ###");
console.log("** Socket IO Manager is listening  on port " + socketIOManagerPort + " **");
console.log("** Express is listening  on port " + expressPort + " **");
console.log("** Server is locally reachable @ http://localhost:" + expressPort + " **");

/*

// INIT SOCKET SERVERS
for(var i = 0 ; i < nbClientsMaxForSocket ; i++){
	
	var socketServer = require('http').createServer(app);  
	var ioServer = require('socket.io')(socketServer);
	
	socketServers.push(socketServer);
	ioServers.push(ioServer);
	
	console.log("Create Socket Server #" + i);
	
}



// START SOCKET SERVERS LISTENING
for(var i = 0 ; i < nbClientsMaxForSocket ; i++){
	
	var port = socketIOPort + i;
	console.log("A socketIO server is listening on port #" + port);
	socketServers[i].listen(port);
	
}

*/

// INCLUDES 

// CLIENT


eval(fs.readFileSync('includes/client/streamProcess.js') + ''); // Stream Process
//SQL
eval(fs.readFileSync('includes/sql/sqlInserter.js') + ''); // sql inserter   										
eval(fs.readFileSync('includes/sql/sensorEntry.js') + ''); // insert Sensor
eval(fs.readFileSync('includes/sql/sensorInfo.js') + ''); // insert Log
eval(fs.readFileSync('includes/sql/captationEntry.js') + ''); //  insert Captation
eval(fs.readFileSync('includes/sql/captationInfo.js') + ''); // insert Log
eval(fs.readFileSync('includes/sql/captationFileEntry.js') + ''); // insert Log
// UTILITY
eval(fs.readFileSync('includes/utility/hashUtilities.js') + ''); // Hash 
eval(fs.readFileSync('includes/utility/dataConversionUtilities.js') + ''); // Data conversion
eval(fs.readFileSync('includes/utility/securityUtilities.js') + ''); // Security utility
// COMMUNICATION
eval(fs.readFileSync('includes/communication/serialCommunication.js') + ''); // Serial 
eval(fs.readFileSync('includes/communication/socketIOCommunication.js') + ''); // Socket IO 
eval(fs.readFileSync('includes/communication/udpCommunication.js') + ''); // UDP
// IO
eval(fs.readFileSync('includes/IO/streamExport.js') + ''); // Stream Export


//DELIMITERS
var rowDelimiter = "^^";

//STREAM CLIENTS
var streamClients = [];

//---------------------------------------
// --- MAIN ( Display infos on the project, etc ) ---
//---------------------------------------
app.get('/', function (req, res) {

	res.render('main.ejs', {});
});

//---------------------------------------
// --- SENSORS ---
//---------------------------------------
app.get('/sensors', function (req, res) {

	flushDisconnectedStreamClients(); // REMOVE DISCONNECTED CLIENTS

	var sensorRows = [];

	connection.query('SELECT * FROM beeyond_sensor', function (err, rows, fields) {

		for (var i = 0; i < rows.length; i++) {

			var rowStr = rows[i]["name"] + rowDelimiter + rows[i]["palette"] + rowDelimiter + rows[i]["valuesNames"] + rowDelimiter + rows[i]["unitsNames"];
			sensorRows.push(rowStr);
		}

		res.render('sensors.ejs', { sensorRows: sensorRows });
	});
});

app.get('/newSensor', function (req, res) {
	// --- PREPARE SENSOR INSERTION

	var valuesTypes = ["Int8", "Float32"];

	res.render('newSensor.ejs', { palettes: rickshawColorPaletteNames, valuesTypes: valuesTypes });
});

app.post('/insertSensor', function (req, res) {
	// INSERT SENSOR

	var form = [];

	var sensorName = req.body.sensorName;
	var colorPalette = req.body.colorPalette;
	var sensorValuesAndUnits = req.body.sensorValuesAndUnits;

	console.log("SENSOR NAME : " + sensorName + " COLOR PALETTE : " + colorPalette + " SENSOR VALUES AND UNITS : " + sensorValuesAndUnits);
	form.push(sensorName);
	form.push(colorPalette);
	form.push(sensorValuesAndUnits);

	console.log("-- Try to insert sensor -- " + form.length);

	insertEntry(req, res, "sensor", form);
});

//-------------------------------------
//-- CAPTATION
//--------------------------------------
app.get('/captations', function (req, res) {
	// LIST ALL CAPTATIONS

	flushDisconnectedStreamClients(); // REMOVE DISCONNECTED CLIENTS

	var captationRows = [];
	var captationIds = [];

	connection.query('SELECT * FROM beeyond_captation', function (err, rows, fields) {

		for (var i = 0; i < rows.length; i++) {

			var rowStr = rows[i]["name"] + rowDelimiter + rows[i]["protocol"] + rowDelimiter + rows[i]["port"] + rowDelimiter + rows[i]["additionalProtocolInfo"];
			captationRows.push(rowStr);
			captationIds.push(rows[i]["id"]);
		}

		res.render('captations.ejs', { palettes: rickshawColorPaletteNames, captationRows: captationRows, captationIds: captationIds });
	});
});

app.get('/captation/:mode&:id', function (req, res) {
	// INSERT / UPDATE CAPTATION 

	var captationId = parseInt(req.params.id);

	var sensors = [];
	var sensorsIds = [];

	var protocols = ["Serial", "UDP", "RF"];

	var process = {};

	var name = "";
	var protocol = "";
	var port = "";
	var additionalProtocolInfo = "";

	var mode = req.params.mode;

	var rowExisting = false;

	process.getSensors = function (callback) {

		console.log(" GET SENSORS ");

		connection.query('SELECT * FROM beeyond_sensor', function (err, rows, fields) {

			for (var i = 0; i < rows.length; i++) {

				sensors.push(rows[i]["name"] + " -(" + rows[i]["id"] + ")- ");
				rowExisting = true;
			}

			if (err) callback(err);

			callback(null, rows);
		});
	};

	//  ROW EXISTING CHECKING IS AVOIDING A SERVER CRASH
	if (captationId != 0 && rowExisting) {
		// ( IF CAPTION ID == 0 -> MODE = CREATE -> DO NOT TRY TO SELECT A CAPTATION )

		process.getCaptationInfo = function (callback) {

			connection.query('SELECT * FROM beeyond_captation WHERE id=' + captationId + '', function (err, rows, fields) {

				name = rows[0]["name"];
				protocol = rows[0]["protocol"];
				port = rows[0]["port"];
				additionalProtocolInfo = rows[0]["additionalProtocolInfo"];
				id = rows[0]["id"]; // USELESS TO REDEFINE ID...

				if (err) callback(err);

				callback(null, rows);
			});
		};
	}

	async.parallel(process, function (err, result) {

		if (err) {

			console.error("ERROR " + err);

			res.redirect('/');

			return;
		}

		console.log(" RESULT : " + result);

		res.render('captation.ejs', { mode: mode, sensors: sensors, protocols: protocols, name: name, protocol: protocol, port: port, additionalProtocolInfo: additionalProtocolInfo, captationId: captationId });
	});
});

// GET THE CAPTATION FORM , ADD THE ENTRY AND PREPARE TO START THE CAPTATION
app.post('/createCaptation', function (req, res) {
	// CAPTATION TEMPLATE = SENSOR

	var form = [];

	var captationName = req.body.captationName;
	var protocol = req.body.protocol;
	var port = req.body.port;
	var sensorsNames = req.body.sensorsNames;
	var additionalInfo = req.body.additionalInfo;
	var gpsAssisted = req.body.gpsAssisted;

	// POUR LINSTANT UN SEUL CAPTEUR A LA FOIS....
	var re = new RegExp(/-((.*?))-/g);
	var regMatch = sensorsNames.match(re).toString();
	var cleanStr = regMatch.replace("-(", "");
	var id = parseInt(cleanStr.replace(")-", ""));
	console.log("id " + id);

	console.log("SENSOR NAME : " + captationName + " PROTOCOL : " + protocol + " PORT : " + port + " SENSORS NAMES : " + sensorsNames + " ADDITIONAL INFO (ex : Baudrate): " + additionalInfo);
	form.push(captationName);
	form.push(protocol);
	form.push(port);
	form.push(id);
	form.push(additionalInfo);
	form.push(gpsAssisted);

	console.log("---> Start captation Insertion // form.length : ---> " + form.length);

	insertEntry(req, res, "captation", form); // WHEN THE CAPTATION IS CREATED , START THE CAPTATION

});

app.post('/updateCaptation/:id', function (req, res) {
	// UPDATE CAPTATION , change protocol mode etc...

	var captationId = parseInt(req.params.id);

	var captationName = req.body.captationName;
	var protocol = req.body.protocol;
	var port = req.body.port;
	var sensorsNames = req.body.sensorsNames;
	var additionalInfo = req.body.additionalInfo;
	var gpsAssisted = req.body.gpsAssisted;

	var re = new RegExp(/-((.*?))-/g);
	var regMatch = sensorsNames.match(re).toString();
	var cleanStr = regMatch.replace("-(", "");
	var id = parseInt(cleanStr.replace(")-", ""));

	connection.query('UPDATE beeyond_captation SET name="' + captationName + '", protocol="' + protocol + '", port="' + port + '" , sensorsIds="' + id + '",additionalProtocolInfo="' + additionalInfo + '" , gpsAssisted="' + gpsAssisted + '" WHERE id=' + captationId + '', function (err, rows, fields) {

		if (err) console.log(err);

		res.redirect("/");
	});
});

// WE NEED TO GET THE PORT CORRESPONDING TO THE SOCKET CLIENT
// WE CAN MAKE A SELECTION OF THE CLIENT WHEN CONNECTED . THE LAST CLIENT CONNECTED IS 

app.get('/executeCaptation/:id', function (req, res) {
	// EXECUTE CAPTATION = REAL TIME GRAPH

	var captationId = parseInt(req.params.id);
	console.log("Captation Id " + captationId);

	var process = {};

	var captation = [];

	var sensorValuesUnitsTypes = [];

	var currentSocketClient = "";

	var _socketIOPort = 0;

	// GET CAPTATION
	process.getCaptationInfo = function (callback) {

		getCaptationInfo(captationId, function (_captation, err) {

			captation = _captation;

			if (err) callback(err);
			callback(null, captation);
		});
	};

	// GET SENSOR DATA ( Values, Units, Types )
	process.getSensorsValuesUnitsAndType = function (callback) {

		getSensorsValuesAndUnitsWithCaptationId(captationId, function (_sensorValuesUnitsTypes, err) {

			sensorValuesUnitsTypes = _sensorValuesUnitsTypes;

			//console.log("STREAM CLIENTS LENGTH " + streamClients.length);

			if (err) callback(err);
			callback(null, sensorValuesUnitsTypes);
		});
	};

	// GET SENSOR DATA ( Values, Units, Types )
	/*
 process.createSocketClient = function(callback){
 
 	 getStreamClientWithCaptationId(streamClients,captationId,function(_streamClient,err){
 				
 		currentSocketClient = _streamClient;
 		_socketIOPort = _streamClient.socketIOPort;
 		
 		if(err)callback(err);	
 		callback(null,currentSocketClient);
 		
 	});
 	
 	
 	
 }
 */

	async.parallel(process, function (err, result) {

		if (err) {

			console.error("ERROR(in executeCaptation process) " + err);

			res.redirect('/captations');

			return;
		}

		var valuesNames = sensorValuesUnitsTypes[0];
		var unitsNames = sensorValuesUnitsTypes[1];
		var valuesTypes = sensorValuesUnitsTypes[2];

		var splValues = valuesNames.split("***");
		var splUnits = unitsNames.split("***");
		var splTypes = valuesTypes.split("***");

		var sensorValues = [];

		var protocol = captation[2];

		for (var i = 0; i < splValues.length - 1; i++) {

			var sensorValue = splValues[i] + " (" + splUnits[i] + ")";
			sensorValues.push(sensorValue);
		}

		if (protocol == 'Serial') {

			port = new SerialPort(portValue, { autoOpen: true, baudRate: baudrate });
			readSerialData();
		}

		//var socketIOPort = currentSocketClient.socketIOPort;

		//console.log("SOCKET IO PORT of current Socket Client " + currentSocketClient.socketIOPort);


		res.render('executeCaptation.ejs', { values: sensorValues, captationName: captation[0], protocol: protocol, captationId: captationId, gpsAssisted: captation[8] });
	});
});

app.post('/exportStream', function (req, res) {
	//EXPORT STREAM CAPTATION

	var description = req.body.description;
	var clientId = req.body.streamClientId;

	console.log("CLIENT ID " + clientId);

	var captationModelId = -1;

	console.log("Description " + description);

	cleanSqlTextEntry(description, function (cleanDescription) {

		cleanSqlTextEntry(clientId, function (cleanClientId) {

			exportDisconnectedClientsStreamLog(req, res, cleanDescription, cleanClientId); // EXPORT STREAM LOG FROM CLIENTS
		});
	});
});

//----------------------------------
//--- LOGS ( Captations Files )
//----------------------------------
app.get('/logs', function (req, res) {

	flushDisconnectedStreamClients(); // REMOVE DISCONNECTED CLIENTS

	var captationFileRows = [];
	var captationFileIds = [];

	connection.query('SELECT * FROM beeyond_captation_file', function (err, rows, fields) {

		for (var i = 0; i < rows.length; i++) {

			captationFileRows.push(rows[i]["fileName"] + rowDelimiter + rows[i]["date"] + rowDelimiter + rows[i]["nbResults"]);
			captationFileIds.push(rows[i]["id"]);
		}

		res.render('logs.ejs', { captationFileRows: captationFileRows, captationFileIds: captationFileIds });
	});
});

//----------------------------------
//--- TESTS
//----------------------------------
app.get('/graph', function (req, res) {
	// --- CAPTATION ( REAL TIME GRAPH ) ---

	var arr = ["ValueA"];

	res.render('graphBasic.ejs', { values: arr });
});

app.get('/mapbox', function (req, res) {
	// --- mapBox TEST ---

	var points = [];

	var nbPoints = 5;

	var startLat = 43.496317;
	var startLon = 5.342152;

	var offset = 0.001;

	for (var i = 0; i < nbPoints; i++) {

		var rdLat = startLat + Math.random() * offset;
		var rdLon = startLon + Math.random() * offset;

		var point = [];

		//console.log(rdLat);

		points.push(rdLon + "," + rdLat);
	}

	res.render('droneMissionFakeTemplate.ejs', { missionPoints: points, latitude: startLat, longitude: startLon });
});

//* * * * * * * * * * * * * * * 
//* * * * * * * * * * * * * * * 
app.listen(expressPort);
server.listen(socketIOManagerPort);
//* * * * * * * * * * * * * * * 
//* * * * * * * * * * * * * * * 


// --------------------
// -- UPDATES --
// --------------------

// We must be able to stream float values -> ok with UDP / for Serial implementation, check byteArrayToFloat.html
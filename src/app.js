// * * * * * * * * * * * * * * * * * * * * * * * * * * *
// * * * * BEEYOND - DATA VISUALIZER * * * * //
// * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Alexandre Amiel @ The Camp / The Hive - 2017 - 2018
// * * * * * * * * * * * * * * * * * * * * * * * * * * *

// EXPRESS
var express = require('express');
var app = express();

const fileUpload = require('express-fileupload');


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
var _async = require('async');

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
app.use(session({secret: 'thehive'})) // ENABLE SESSION

// default options
app.use(fileUpload());

// SESSIONS
app.use(function(req, res, next){

	if (typeof(req.session.inserterErrorMessage) == 'undefined') {
		req.session.inserterErrorMessage = [];
	}

  if (typeof(req.session.statut) == 'undefined') {
    req.session.statut = "";
  }

    next();
});

app.use(function(req, res, next) {
  //res.locals.socketIOPort = socketIOPort; // userId is reachable everywhere

  res.locals.socketIOPort = socketIOManagerPort;
  res.locals.expressPort = expressPort;
  res.locals.baseUrl = baseUrl;
  res.locals.statut = "";

  next();
});



// LOCAL
var baseUrl = "http://localhost";

// RICKSHAW
var rickshawColorPaletteNames = [ // CHECK @ https://github.com/shutterstock/rickshaw#rickshawcolorpalette
"classic9","colorwheel","cool","munin","spectrum14","spectrum2000","spectrum2001"];




// WELCOME
console.log("### WELCOME TO BEEYOND DATA VISUALIZER ###");
console.log("** Socket IO Manager is listening  on port " + socketIOManagerPort + " **");
console.log("** Express is listening  on port " + expressPort + " **");
console.log("** Server is locally reachable @ http://localhost:" + expressPort + " **");



//DELIMITERS
var rowDelimiter = "^^";

//STREAM CLIENTS
var streamClients = [];



// INCLUDES

	// CLIENT
const StreamClientManager = require('./includes/client/streamClientFunctions');
const StreamProcess = require('./includes/client/streamProcess');

	// SQL
const SqlConnection = require('./includes/sql/sqlConnection');
const SqlInserter = require('./includes/sql/sqlInserter');
const SensorEntry = require('./includes/sql/sensorEntry');
const SensorInfo = require('./includes/sql/sensorInfo');
const CaptationEntry = require('./includes/sql/captationEntry');
const CaptationInfo = require('./includes/sql/captationInfo'); // insert Log
const CaptationFileEntry = require('./includes/sql/captationFileEntry'); // insert Log
const CaptationFileInfo = require('./includes/sql/captationFileInfo'); // captation file info
const NewsletterSubscriptionEntry = require('./includes/sql/newsletterSubscriptionEntry'); // captation file info
const UserInfo = require('./includes/sql/userInfo'); // captation file info



	// UTILITY
const Hash = require('./includes/utility/hashUtilities'); // Hash
const DataConversion = require('./includes/utility/dataConversionUtilities'); // Data conversion
const Security = require('./includes/utility/securityUtilities'); // Security utility

	// COMMUNICATION
const SerialCommunication = require('./includes/communication/serialCommunication'); // Serial
const SocketIOCommunication = require('./includes/communication/socketIOCommunication'); // Socket IO
const UdpCommunication = require('./includes/communication/udpCommunication'); // UDP

	// IO
const StreamExport = require('./includes/IO/streamExport'); // Stream Export




var connection = SqlConnection.sqlConnection(function(sqlConnection){

//  SensorInfo.getSensorsValuesAndUnitsWithCaptationId(connection,captationId,function(_sensorValuesUnitsTypes,err){
  connection = sqlConnection;
  // WHEN THE SQL CONNECTION IS DONE , WE CAN SET UP THE SOCKET IO AND UDP COMMUNICATION ( BECAUSE OF connection callback )
  SocketIOCommunication.initSocketConnection(io,StreamClientManager,streamClients,SensorInfo,CaptationInfo,connection,socketIOPort);
  UdpCommunication.initUdpServer(StreamClientManager,StreamProcess,streamClients,CaptationInfo,connection,udpServer,udpPort);


});













//---------------------------------------
// --- MAIN ( Display infos on the project, etc ) ---
//---------------------------------------
app.get('/', function (req, res) {

	res.render('main.ejs',{  } );

});


//---------------------------------------
// --- CONNEXION ---
//---------------------------------------
app.post('/connexion', function (req, res) {

	//res.render('main.ejs',{  } );
  var mail = req.body.mail;
  var password = req.body.password;

  UserInfo.usersExists(connection,mail,password,function(result,err){

    if(result[0] == "validate_login"){

      //req.session.statut = result[2];
      res.locals.statut = result[2];

      console.log("REDIRECT TO VALIDATE");
      res.render('form/validateForm.ejs',{ arg: result[0] } );
      ////res.redirect("/validateForm/validate_login");
    }

    if(result[0] == "wrong_password"){

      console.log("REDIRECT TO ERROR , wrong_password" + result[0]);
      res.render('form/errorForm.ejs',{ arg: result[0] } );
      //res.render('form/errorForm.ejs',{ arg: arg } );
    }

    if(result[0] != "wrong_password" && result[0] != "validate_login"){

      console.log("REDIRECT TO ERROR " + result[0] );
      res.render('form/errorForm.ejs',{ arg: result[0] } );

    }

    //if(result[0] == "wrong_password"){

    //req.session.statut == result[2];




  });




});






//---------------------------------------
// --- SENSORS ---
//---------------------------------------
app.get('/sensors', function (req, res) {

	var sensorRows = [];

	connection.query('SELECT * FROM beeyond_sensor', function(err, rows, fields) {

			for(var i = 0 ; i < rows.length ; i++){

				var rowStr = rows[i]["name"]+rowDelimiter+rows[i]["palette"]+rowDelimiter+rows[i]["valuesNames"]+rowDelimiter+rows[i]["unitsNames"];
				sensorRows.push(rowStr);

			}

		res.render('sensors.ejs',{ sensorRows:sensorRows} );

	});

});



app.get('/newSensor', function (req, res) {// --- PREPARE SENSOR INSERTION

	var valuesTypes = ["Int8","Float32"];

	res.render('newSensor.ejs',{ palettes:rickshawColorPaletteNames,valuesTypes:valuesTypes } );

});


app.post('/insertSensor', function (req, res) { // INSERT SENSOR

	var form = [];

	var sensorName = req.body.sensorName;
	var colorPalette = req.body.colorPalette;
	var sensorValuesAndUnits = req.body.sensorValuesAndUnits;


	console.log("SENSOR NAME : " + sensorName + " COLOR PALETTE : " + colorPalette + " SENSOR VALUES AND UNITS : " + sensorValuesAndUnits);
	form.push(sensorName);
	form.push(colorPalette);
	form.push(sensorValuesAndUnits);

	console.log("-- Try to insert sensor -- " + form.length);

	SqlInserter.insertEntry(req,res,"sensor",form,connection);


});




//-------------------------------------
//-- CAPTATION
//--------------------------------------
app.get('/captations', function (req, res) { // LIST ALL CAPTATIONS


	var captationRows = [];
	var captationIds = [];

	connection.query('SELECT * FROM beeyond_captation', function(err, rows, fields) {

			for(var i = 0 ; i < rows.length ; i++){

				var rowStr = rows[i]["name"]+rowDelimiter+rows[i]["protocol"]+rowDelimiter+rows[i]["port"]+rowDelimiter+rows[i]["additionalProtocolInfo"];
				captationRows.push(rowStr);
				captationIds.push(rows[i]["id"]);

			}

			res.render('captations.ejs',{ palettes:rickshawColorPaletteNames,captationRows:captationRows,captationIds:captationIds } );

	});


});


app.get('/captation/:mode&:id', function (req, res) { // INSERT / UPDATE CAPTATION

	var captationId = parseInt(req.params.id);

	var sensors = [];
	var sensorsIds = [];

	var protocols = ["Serial","UDP","RF"];

	var process = {};

	var name = "";
	var protocol = "";
  var port = "";

	var additionalProtocolInfo = "";

	var mode = req.params.mode;

	var rowExisting = false;

  // DISPLAY SENSORS ( ONE SENSOR FOR ONE CAPTATION )
	process.getSensors = function(callback){

		//console.log(" DISPLAY SENSORS ( ONE SENSOR FOR ONE CAPTATION ) " );

		connection.query('SELECT * FROM beeyond_sensor', function(err, rows, fields) {

			for(var i = 0 ; i < rows.length ; i++){

				sensors.push(rows[i]["name"]+" -("+rows[i]["id"]+")- ");
				rowExisting = true;
			}

			if(err)callback(err);

			callback(null,rows);

		});

	}

	//  ROW EXISTING CHECKING IS AVOIDING A SERVER CRASH
	if(captationId != 0 && rowExisting){ // ( IF CAPTION ID == 0 -> MODE = CREATE -> DO NOT TRY TO SELECT A CAPTATION )

		process.getCaptationInfo = function(callback){

			connection.query('SELECT * FROM beeyond_captation WHERE id='+captationId+'', function(err, rows, fields) {

				name = rows[0]["name"];
				protocol = rows[0]["protocol"];
				port = rows[0]["port"];
				additionalProtocolInfo = rows[0]["additionalProtocolInfo"];
				id = rows[0]["id"]; // USELESS TO REDEFINE ID...

				if(err)callback(err);

				callback(null,rows);

			});

		}

	}


	_async.parallel(process,function(err,result){

		if(err){

			console.error("ERROR " + err);

			res.redirect('/');

			return;

		}

		//console.log(" RESULT : " + result );

		res.render('captation.ejs',{ mode:mode,sensors:sensors,protocols:protocols,name:name,protocol:protocol,port:port,additionalProtocolInfo:additionalProtocolInfo,captationId:captationId} );

	});



});




// GET THE CAPTATION FORM , ADD THE ENTRY AND PREPARE TO START THE CAPTATION
app.post('/createCaptation', function (req, res) { // CAPTATION TEMPLATE = SENSOR

	var form = [];

	var captationName = req.body.captationName;
	var protocol = req.body.protocol;
	var port = req.body.port;
	var sensorsNames = req.body.sensorsNames;
	var additionalInfo = req.body.additionalInfo;
	var gpsAssisted = req.body.gpsAssisted;
  var arduinoFile = req.files.arduinoFile;


  var arduinoFileName = "";

  if (req.files.arduinoFile){

    arduinoFileName = arduinoFile["name"];

    var dirPath = '/public/code/arduino/' + captationName + '/';

    const mkdirSync = function (dirPath) {

      try{

        console.log("The directory was succesfully created.");

        fs.mkdirSync(dirPath);

        arduinoFile.mv(__dirname +  dirPath + arduinoFileName, function(err) {

            if (err)
            return res.status(500).send(err);

            res.send('Arduino File uploaded!');

          });


      } catch (err) {

          console.log("fs Error : " + err);
          if (err.code !== 'EEXIST') throw err

      }
    }


  }

  //console.log(arduinoFile["name"]);
  //console.log(arduinoFile.name);
  /*

  */




  if (!gpsAssisted)gpsAssisted = "off";

  //console.log("GPS ASSISTED " + gpsAssisted);


	// POUR LINSTANT UN SEUL CAPTEUR A LA FOIS....
	var re = new RegExp(/-((.*?))-/g);
	var regMatch = sensorsNames.match(re).toString();
	var cleanStr = regMatch.replace("-(","");
	var id = parseInt(cleanStr.replace(")-",""));

  //console.log("id " + id);

	//console.log("SENSOR NAME : " + captationName + " PROTOCOL : " + protocol + " PORT : " + port + " SENSORS NAMES : " + sensorsNames + " ADDITIONAL INFO (ex : Baudrate): " + additionalInfo);

  form.push(captationName);
	form.push(protocol);
	form.push(port);
	form.push(id);
	form.push(additionalInfo);
	form.push(gpsAssisted);
  form.push(arduinoFileName);

	//console.log("---> Start captation Insertion // form.length : ---> " + form.length);

	SqlInserter.insertEntry(req,res,"captation",form,connection); // WHEN THE CAPTATION IS CREATED , START THE CAPTATION


});


app.post('/updateCaptation/:id', function (req, res) { // UPDATE CAPTATION , change protocol mode etc...

	var captationId = parseInt(req.params.id);

	var captationName = req.body.captationName;
	var protocol = req.body.protocol;
	var port = req.body.port;
	var sensorsNames = req.body.sensorsNames;
	var additionalInfo = req.body.additionalInfo;
	var gpsAssisted = req.body.gpsAssisted;

	var re = new RegExp(/-((.*?))-/g);
	var regMatch = sensorsNames.match(re).toString();
	var cleanStr = regMatch.replace("-(","");
	var id = parseInt(cleanStr.replace(")-",""));

	connection.query('UPDATE beeyond_captation SET name="'+captationName+'", protocol="'+protocol+'", port="'+port+'" , sensorsIds="'+id+'",additionalProtocolInfo="'+additionalInfo+'" , gpsAssisted="'+gpsAssisted+'" WHERE id='+captationId+'', function(err, rows, fields) {

		if(err)console.log(err);

		res.redirect("/");

	});

});


// WE NEED TO GET THE PORT CORRESPONDING TO THE SOCKET CLIENT
// WE CAN MAKE A SELECTION OF THE CLIENT WHEN CONNECTED . THE LAST CLIENT CONNECTED IS

app.get('/executeCaptation/:id', function (req, res) { // EXECUTE CAPTATION = REAL TIME GRAPH

	var captationId = parseInt(req.params.id);
	console.log("Captation Id " + captationId);

	var process = {};

	var captation = [];

	var sensorValuesUnitsTypes = [];

	var currentSocketClient = "";

	var _socketIOPort = 0;





	// GET CAPTATION
	process.getCaptationInfo = function(callback){

    //SqlConnection.sqlConnection(function(sqlConnection){
    if(connection == null)console.log("connection is null !");

      //  SensorInfo.getSensorsValuesAndUnitsWithCaptationId(connection,captationId,function(_sensorValuesUnitsTypes,err){
      CaptationInfo.getCaptationInfo(connection,captationId,function(_captation,err){

          captation = _captation;

          if(err)callback(err);
          callback(null,captation);

      });

    //});





	}

	// GET SENSOR DATA ( Values, Units, Types )
	process.getSensorsValuesUnitsAndType = function(callback){

    //SqlConnection.sqlConnection(function(sqlConnection){

		    SensorInfo.getSensorsValuesAndUnitsWithCaptationId(connection,captationId,function(_sensorValuesUnitsTypes,err){

			       sensorValuesUnitsTypes = _sensorValuesUnitsTypes;
			       //console.log("STREAM CLIENTS LENGTH " + streamClients.length);
			       if(err)callback(err);
			       callback(null,sensorValuesUnitsTypes);

		  });


    //});



	}

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



	_async.parallel(process,function(err,result){

		if(err){

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

		for(var i = 0 ; i < splValues.length-1 ; i++){

			var sensorValue = splValues[i]+" ("+splUnits[i]+")";
			sensorValues.push(sensorValue);

		}

		if(protocol == 'Serial'){

			port = new SerialPort(portValue, { autoOpen: true, baudRate : baudrate });
			readSerialData();

		}

		//var socketIOPort = currentSocketClient.socketIOPort;

		//console.log("SOCKET IO PORT of current Socket Client " + currentSocketClient.socketIOPort);

    var points = [];

  	var nbPoints = 5;

  	var startLat = 43.496317;
  	var startLon = 5.342152;

  	var offset = 0.001;

  	for(var i = 0 ; i < nbPoints ; i++){

  		var rdLat = startLat + Math.random() * offset;
  		var rdLon = startLon + Math.random() * offset;

  		var point = [];

  		//console.log(rdLat);

  		points.push(rdLon+","+rdLat);

  	}


  	//res.render('droneMissionFakeTemplate.ejs',{ missionPoints:points,latitude:startLat,longitude:startLon } );






		res.render('executeCaptation.ejs',{ values: sensorValues,captationName: captation[0],protocol:protocol, captationId:captationId,gpsAssisted:captation[8], missionPoints:points,latitude:startLat,longitude:startLon,mode:"REAL_TIME" } );

	});


});


var __streamsFolder__ = "public/streams/";


app.post('/exportStream', function (req, res) { //EXPORT STREAM CAPTATION

	var description = req.body.description; // CLEAN THIS !
	var clientId = req.body.streamClientId;

	console.log("CLIENT ID " + clientId );

	var captationModelId = -1;

	console.log("Description " + description);

	Security.cleanSqlTextEntry(description,function(cleanDescription){

		Security.cleanSqlTextEntry(clientId,function(cleanClientId){

			StreamExport.exportDisconnectedClientsStreamLog(req,res,cleanDescription,cleanClientId,StreamClientManager,__streamsFolder__,streamClients,SqlInserter,connection); // EXPORT STREAM LOG FROM CLIENTS

		});

	});


});


//----------------------------------
//--- LOGS ( Captations Files )
//----------------------------------
app.get('/logs', function (req, res) {

	//flushDisconnectedStreamClients(); // REMOVE DISCONNECTED CLIENTS

	var captationFileRows = [];
	var captationFileIds = [];

	connection.query('SELECT * FROM beeyond_captation_file', function(err, rows, fields) {

		for(var i = 0 ; i < rows.length ; i++){

			captationFileRows.push(rows[i]["fileName"]+rowDelimiter+rows[i]["date"]+rowDelimiter+rows[i]["nbResults"]+rowDelimiter+rows[i]["id"]+rowDelimiter+rows[i]["captationId"]);
			captationFileIds.push(rows[i]["id"]);

		}



		res.render('logs.ejs',{ captationFileRows:captationFileRows,captationFileIds:captationFileIds } );

	});

});



app.get('/loadCaptationFile/:id&:captationId&:captationFileName', function (req, res) {

  var captationFileId = parseInt(req.params.id);
  var captationId = parseInt(req.params.captationId);
  var captationFileName = req.params.captationFileName;

  console.log("CAPTATION FILE NAME " + captationFileName);

  var process = {};

  //var captationId = -1;
  //var captationFileName = "";

  var captation = [];
  var captationFile = [];

  var gpsAssisted = false;

  var sensorValuesUnitsTypes = [];


  var fileLines = [];

  //var __captationFileFolder = "";




  // first, get captation file info, file name , captation id etc.
  process.getCaptationFileInfo = function(callback){

    console.log("captationFileId " + captationFileId);

    CaptationFileInfo.getCaptationFileInfo(connection,captationFileId,function(_captationFile,err){

        captationFile = _captationFile;
        console.log("captation File [3] " + captationFileName);
        //captationId = _captationFile[1];

        if(err)callback(err);
        callback(null,captationFile);

    });

  }

  //second, get captation info
  process.getCaptationInfo = function(callback){

    console.log("captation id " + captationFile.length );

    CaptationInfo.getCaptationInfo(connection,captationId,function(_captation,err){

      captation = _captation;

      if(_captation[8] == 'on'){
        gpsAssisted = true;
        console.log("Gps assisted is true");
      }

      console.log("Get Captation ");

      if(err)callback(err);
      callback(null,captation);

    });

  }


  //third, put lines from stream in array
  process.getCaptationFileLines = function(callback){

    console.log("captationFile lg " + captationFileName);

    //var fileLines = [];


    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(__streamsFolder__ + captationFileName + '.csv')
    });


    lineReader.on('line', function (line) {
      console.log('Line from file:', line);
      fileLines.push(line);
    });



    callback(null,fileLines);




  }

  //Fourth, get sensor data
  // GET SENSOR DATA ( Values, Units, Types )
  process.getSensorsValuesUnitsAndType = function(callback){

    SensorInfo.getSensorsValuesAndUnitsWithCaptationId(connection,captationId,function(_sensorValuesUnitsTypes,err){

      sensorValuesUnitsTypes = _sensorValuesUnitsTypes;

      //console.log("STREAM CLIENTS LENGTH " + streamClients.length);

      if(err)callback(err);
      callback(null,sensorValuesUnitsTypes);

    });

  }

  var startLat = 43.496317;
  var startLon = 5.342152;


  _async.parallel(process,function(err,result){


    if(err){

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

		for(var i = 0 ; i < splValues.length-1 ; i++){

			var sensorValue = splValues[i]+" ("+splUnits[i]+")";
			sensorValues.push(sensorValue);

		}

    console.log("FINAL RESULT " + fileLines.length);

    var onlyValuesFromFiles = fileLines.splice(1);
    var filesValues = fileLines[0];

    // GET GPS POSITIONS FROM FILE

    var points = [];

    var graphLines = [];


      for(var i = 0 ; i < onlyValuesFromFiles.length ; i++){

        var valueLine = onlyValuesFromFiles[i];
        console.log("VALUE LINE " + valueLine);

        var explodeLine = valueLine.split(",");

        var valueLg = explodeLine.length;

        if(gpsAssisted){

          var lat = explodeLine[valueLg-4];
          console.log("lat " + lat);
          var lon = explodeLine[valueLg-3];
          console.log("lon " + lon);
          var alt = explodeLine[valueLg-2];
          console.log("alt " + alt);

          if(!isNaN(lat) && !isNaN(lon))points.push([lat,lon]);

          if(i == 0){
            startLat = parseFloat(lat);
            startLon = parseFloat(lon);
          }

      }

      var valuesExceptGPSAndTime = null;

      if(gpsAssisted){

        valuesExceptGPSAndTime = explodeLine.slice(0,valueLg - 4);

      }else{

        valuesExceptGPSAndTime = explodeLine.slice(0,valueLg - 1);

      }


      //valuesExceptGPSAndTime = valuesExceptGPSAndTime.replace('"',"");
      graphLines.push(valuesExceptGPSAndTime);

      //console.log(" values except gps and time : " + nouvChn);

  }


	for(var i = 0 ; i < graphLines.length ; i++){
		console.log("graphLines [i] " + graphLines[i]);
	}


		res.render('loadCaptationFile.ejs',{ 
			values: sensorValues,
			captationName: captation[0],
			protocol:protocol, 
			captationId:captationId,
			gpsAssisted:captation[8], 
			missionPoints:points,
			latitude:startLat,
			longitude:startLon,
			mode:"FROM_FILE",
			graphLines:graphLines 
		} );



  });


});


//----------------------------------
//--- ARCHIVES
//----------------------------------
app.get('/archives', function (req, res) { // --- CAPTATION ( REAL TIME GRAPH ) ---

	var arr = ["ValueA"];

	res.render('archives.ejs',{ values: arr } );

});

app.post('/archive', function (req, res) { // --- CAPTATION ( REAL TIME GRAPH ) ---

	//var arr = ["ValueA"];
  var archiveTitle = req.body.titre;
  var archiveDescription = req.body.description;

  var archiveFile = req.body.fichier;

  var form = [];
  form.push(archiveTitle); // 0
  form.push(archiveDescription); // 1
  //form.push(archiveFileName); // 2

  SqlInserter.insertEntry(req,res,"archive",form,connection); // WHEN THE CAPTATION IS CREATED , START THE CAPTATION


	//res.render('archives.ejs',{ values: arr } );

});

//----------------------------------
//--- TEAM
//----------------------------------
app.get('/team', function (req, res) { // --- CAPTATION ( REAL TIME GRAPH ) ---

	var arr = ["ValueA"];

	res.render('team.ejs',{ values: arr } );

});

//----------------------------------
//--- PARTENAIRES
//----------------------------------
app.get('/partenaires', function (req, res) { // --- CAPTATION ( REAL TIME GRAPH ) ---

	var arr = ["ValueA"];

	res.render('partenaires.ejs',{ values: arr } );

});

//----------------------------------
//--- NEWSLETTER
//----------------------------------
app.post('/newsletterSubscription', function (req, res) { // --- CAPTATION ( REAL TIME GRAPH ) ---

	//var arr = ["ValueA"];
  var firstName = req.body.prenom; // CLEAN THIS !
  var lastName = req.body.nom;
  var mail = req.body.mail;
  var company = req.body.company;

  var form = [];
  form.push(firstName); // 0
  form.push(lastName); // 1
  form.push(mail); // 2
  form.push(company); // 3

  SqlInserter.insertEntry(req,res,"newsletter_subscription",form,connection); // WHEN THE CAPTATION IS CREATED , START THE CAPTATION



	//res.render('partenaires.ejs',{ values: arr } );

});


//----------------------------------
//--- REGISTER
//----------------------------------
app.post('/register', function (req, res) { // --- CAPTATION ( REAL TIME GRAPH ) ---

	//var arr = ["ValueA"];
  var pseudo = req.body.pseudo; // CLEAN THIS !
  var password = req.body.password;
  var mail = req.body.mail;
  var passwordConfirm = req.body.confirmpassword;

  var form = [];
  form.push(pseudo); // 0
  form.push(mail); // 1
  form.push(password); // 2
  form.push(passwordConfirm); // 3

  SqlInserter.insertEntry(req,res,"user",form,connection); // WHEN THE CAPTATION IS CREATED , START THE CAPTATION



});



// VALIDATE FORM
app.get('/validateForm/:arg', function(req,res){

  var arg = req.params.arg; // CLEAN ME

  res.render('form/validateForm.ejs',{ arg: arg , statut: req.session.statut } );


});

// ERROR FORM
app.get('/errorForm/:arg', function(req,res){

  var arg = req.params.arg; // CLEAN ME

  res.render('form/errorForm.ejs',{ arg: arg } );


});







//* * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * *
app.listen(expressPort);
server.listen(socketIOManagerPort);
//* * * * * * * * * * * * * * *
//* * * * * * * * * * * * * * *






// --------------------
// -- COMMUNICATION --
// --------------------

// We must be able to stream float values -> ok with UDP / for Serial implementation, check byteArrayToFloat.html

/*
	console.log("INIT UDP SERVER");

	udpServer.on('error', (err) => {
		console.log(`server error:\n${err.stack}`);
		server.close();
	});


	var nbLogMax = 3;
	var nbLog = 0;

	udpServer.on('message', (msg, rinfo) => {

		if(nbLog<nbLogMax)console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

		nbLog++;

		// PARSE MESSAGE
		var splMessage = msg.toString().split("***");
		var dataArray = [];

		var valueLine = [];

		var captationId = splMessage[0];

		var lg = splMessage.length;

		for(var i = 1 ; i < lg ; i++){

			dataArray.push(parseFloat(splMessage[i]));
			valueLine.push(parseFloat(splMessage[i]));

		}

		//var joinedValue = valueLine.join(",");

		var date = new Date();

		var seconds = date.getSeconds();
		var minutes = date.getMinutes();
		var hour = date.getHours();

		var time = hour+":"+minutes+":"+seconds;


		getStreamClientWithCaptationId(streamClients,captationId,function(streamClient){

			getCaptationInfo(captationId, function(captation){

				var jsonLine = '{';

				var streamCategories = streamClient.streamCategories;

				for(var i = 0 ; i < streamCategories.length; i++){

					jsonLine += '"'+streamCategories[i]+'" : "' + dataArray[i] +'"' ;
					jsonLine += ',';

				}

				//if(captation[8] == 'on')jsonLine

				jsonLine += '"Time" : "' + time +'" }' ;

				var jsonParseLine = JSON.parse(jsonLine);

				addLineToStreamExportFileLinkedToCaptation(jsonParseLine,captationId);

				emitToStreamClients(dataArray); // EMIT


			});

		});






	});

	udpServer.on('listening', () => {
		const address = udpServer.address();
		console.log(`UDP server listening ${address.address}:${address.port}`);
	});

	udpServer.bind(udpPort);



*/







// --------------------
// -- UPDATES --
// --------------------

// We must be able to stream float values -> ok with UDP / for Serial implementation, check byteArrayToFloat.html

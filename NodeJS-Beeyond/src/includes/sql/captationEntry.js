//const SqlConnection = require('./sqlConnection');
//const connection = SqlConnection.sqlConnection;

//ASYNC
const _async = require('async');


function checkCaptationEntry(req,res,form,connection){


	var name = "";

	var process = {};


	process.checkNameAvailabilty = function(callback){

		connection.query('SELECT * from beeyond_captation WHERE name ="' + name + '" ', function(err, rows, fields) {

			if (err)return callback(err);
			// WE CHECK IF THE VALUE IS FREE
			var valueFree = rows.length;

			if(valueFree == 0){

				callback(null,name);

			}else{

				callback('Value : ' + name + ' is already used',null);

			}

		});
	}

		_async.parallel(process,function(err,result){

		if(err){
			console.error("ERROR " + err);
			// REDIRECTION VERS LA PAGE D'ENVOI DE FORMULAIRE , AVEC LE DETAIL DES ERREURS
			req.session.inserterErrorMessage = [];
			req.session.inserterErrorMessage.push(err);
			res.redirect('/register');


			return;

		}

			console.log(" RESULT : " + result + " FORM LENGTH " + form.length);
			insertCaptationEntry(req,res,form);


		});
}

function insertCaptationEntry(req,res,form){

	var name = form[0];
	var protocol = form[1];
	var port = form[2];
	var sensorsNames = form[3];
	var additionalInfo = form[4];
	var gpsInfo = form[5];
	var arduinoFileName = form[6];
	// var splitSensorsNames = sensorsNames.split("##");


	// var joinValues = valuesArr.join("***");
	// var joinUnits = unitsArr.join("***");


	console.log("Name " + name + " protocol " + protocol + " port " + port + " sensorsNames " + sensorsNames + " gps info " + gpsInfo);

	connection.query('INSERT INTO beeyond_captation (name,protocol,port,sensorId,additionalProtocolInfo,gpsAssisted,arduinoFileName) VALUES ("'+name+'","'+protocol+'","'+port+'","'+sensorsNames+'","'+additionalInfo+'","'+gpsInfo+'","'+arduinoFileName+'")',  function (err, result) {

		if (err) {

            console.log("CAPTATION ENTRY ERROR : " + err.message);

        } else {

            console.log('Captation succesfully inserted !');
			res.redirect("/executeCaptation/"+result.insertId);
		}




	});



}

module.exports.checkCaptationEntry = checkCaptationEntry;

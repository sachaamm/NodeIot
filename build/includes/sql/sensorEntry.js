'use strict';

function checkSensorEntry(req, res, form) {

	var name = "";

	var process = {};

	process.checkNameAvailabilty = function (callback) {

		connection.query('SELECT * from beeyond_sensor WHERE name ="' + name + '" ', function (err, rows, fields) {

			if (err) return callback(err);
			// WE CHECK IF THE VALUE IS FREE
			var valueFree = rows.length;

			if (valueFree == 0) {

				callback(null, name);
			} else {

				callback('Value : ' + name + ' is already used', null);
			}
		});
	};

	async.parallel(process, function (err, result) {

		if (err) {
			console.error("ERROR " + err);
			// REDIRECTION VERS LA PAGE D'ENVOI DE FORMULAIRE , AVEC LE DETAIL DES ERREURS
			req.session.inserterErrorMessage = [];
			req.session.inserterErrorMessage.push(err);
			res.redirect('/register');

			return;
		}

		console.log(" RESULT : " + result + " FORM LENGTH " + form.length);
		insertSensorEntry(req, res, form);
	});
}

function insertSensorEntry(req, res, form) {

	var name = form[0];
	var palette = form[1];
	var valuesAndUnitsNames = form[2];

	var splValuesAndUnits = valuesAndUnitsNames.split("##");
	var valuesArr = [];
	var unitsArr = [];
	var typesArr = [];

	for (var i = 0; i < splValuesAndUnits.length; i++) {

		var splValueUnit = splValuesAndUnits[i].split(">>");

		var value = splValueUnit[0];
		var unit = splValueUnit[1];
		var type = splValueUnit[2];

		valuesArr.push(value);
		unitsArr.push(unit);
		typesArr.push(type);
	}

	var joinValues = valuesArr.join("***");
	var joinUnits = unitsArr.join("***");
	var joinTypes = typesArr.join("***");

	console.log("name " + name + " palette " + palette + " valuesNames " + joinValues + " unitsNames " + joinUnits);

	connection.query('INSERT INTO beeyond_sensor (name,palette,valuesNames,unitsNames,valuesTypes) VALUES ("' + name + '","' + palette + '","' + joinValues + '","' + joinUnits + '","' + joinTypes + '")', function (err, result) {

		if (err) {

			console.log(err.message);
		} else {

			console.log('Sensor succesfully inserted !');
			res.redirect("/");
		}
	});
}
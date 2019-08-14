

function getSensorsValuesAndUnits(connection,sensorId,cb){

	connection.query('SELECT * FROM beeyond_sensor WHERE id='+sensorId+'', function(err, rows, fields) {

		var valuesNames = rows[0]["valuesNames"];
		var unitsNames = rows[0]["unitsNames"];
		var valuesTypes = rows[0]["valuesTypes"];

		var arr = [];
		arr.push(valuesNames);
		arr.push(unitsNames);
		arr.push(valuesTypes);


		cb(arr);

	});


}

function getSensorsValuesAndUnitsWithCaptationId(connection,captationId,cb){

	//console.log("GET SENSOR VALUES !!!!! " + captationId);

	connection.query('SELECT * FROM beeyond_captation WHERE id=' + captationId + '', function(err, rows, fields) {

		var sensorId = rows[0]["sensorId"];

		//console.log("GET SENSOR id !!!!! " + sensorId);


		connection.query('SELECT * FROM beeyond_sensor WHERE id=' + sensorId + '', function(err, _rows, fields) {


			//console.log("GET SENSORS !!!!! " + captationId);

			var valuesNames = _rows[0]["valuesNames"];
			var unitsNames = _rows[0]["unitsNames"];
			var valuesTypes = _rows[0]["valuesTypes"];

			var arr = [];
			arr.push(valuesNames);
			arr.push(unitsNames);
			arr.push(valuesTypes);

			cb(arr);

		});



	});


}


module.exports.getSensorsValuesAndUnits = getSensorsValuesAndUnits;
module.exports.getSensorsValuesAndUnitsWithCaptationId = getSensorsValuesAndUnitsWithCaptationId;

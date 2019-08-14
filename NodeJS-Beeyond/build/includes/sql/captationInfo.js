'use strict';

function getCaptationInfo(captationId, cb) {

	connection.query('SELECT * FROM beeyond_captation WHERE id=' + captationId + '', function (err, rows, fields) {

		var arr = [];

		arr.push(rows[0]["name"]); // 0
		arr.push(rows[0]["sensorId"]); // 1
		arr.push(rows[0]["protocol"]); // 02
		arr.push(rows[0]["port"]); // 03
		arr.push(rows[0]["dateStart"]); // 04
		arr.push(rows[0]["dateEnd"]); // 05
		arr.push(rows[0]["fileName"]); // 06
		arr.push(rows[0]["aditionnalProtocolInfo"]); // 07
		arr.push(rows[0]["gpsAssisted"]); // 08

		cb(arr);
	});
}
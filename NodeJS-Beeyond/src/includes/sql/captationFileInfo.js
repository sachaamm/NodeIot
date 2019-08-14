//const SqlConnection = require('./sqlConnection');
//const connection = SqlConnection.sqlConnection;


function getCaptationFileInfo(connection,captationFileId, cb){

	connection.query('SELECT * FROM beeyond_captation_file WHERE id=' + captationFileId + '', function(err, rows, fields) {

		var arr = [];

		arr.push(rows[0]["id"]);// 0
		arr.push(rows[0]["captationId"]);// 1
		arr.push(rows[0]["date"]);// 02
		arr.push(rows[0]["fileName"]);// 03
		arr.push(rows[0]["nbResults"]);// 04
		arr.push(rows[0]["description"]);// 05


		cb(arr);

	});


}

module.exports.getCaptationFileInfo = getCaptationFileInfo;

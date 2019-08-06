//const SqlConnection = require('./sqlConnection');
//const connection = SqlConnection.sqlConnection;

function insertCaptationFile(req,res,form,connection){


	var captationId = form[0];
	var date = form[1];
	var fileName = form[2];
	var nbResults = form[3];
	var description = form[4];
	//var additionalInfo = form[4];


	console.log("CaptationId " + captationId + " Date " + date + " filename " + fileName + " nbResults " + nbResults + " Description " + description);

	connection.query('INSERT INTO beeyond_captation_file (captationId,date,fileName,nbResults,description) VALUES ("'+captationId+'","'+date+'","'+fileName+'","'+nbResults+'","'+description+'")',  function (err, result) {

		if (err) {

            console.log("CAPTATION FILE ENTRY ERROR : " + err.message);

        } else {

            console.log('Captation file succesfully inserted !');
						res.redirect("/");
		}




	});



}


module.exports.insertCaptationFile = insertCaptationFile;

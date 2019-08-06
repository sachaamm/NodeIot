///////////
// CHECK USER > MOVE UPLOADED USER AVATAR > ADD USER TO DB > SET USER ID FOR SESSION
//ASYNC
const _async = require('async');




function checkUserEntry(req,res,form,connection){

  var pseudo = form[0];
	var mail = form[1];
	var password = form[2];
	var confirm = form[3];

	var lengthMin = 5;

	var process = {};

  var registrationErrors = [];

	process.checkValuesWereSet = function(callback){

		if(password.length == 0 || confirm.length == 0 || mail.length == 0){

			callback('value_missing',null);
      registrationErrors.push('value_missing');

		}else{

			callback(null,true);

		}

	}

	process.checkPasswordsLength = function(callback){

		if(password.length < lengthMin){

			callback('weak_password',null);
      registrationErrors.push('weak_password');

		}else{

			callback(null,true);

		}

	}

	process.checkMailFormat = function(callback){

		if(!validateEmail(mail)){

			callback('mail_format',null);
      registrationErrors.push('mail_format');

		}else{

			callback(null,true);

		}

	}


	process.checkPasswords = function(callback){

		if(password != confirm){

			callback('passwords_differs',null);
      registrationErrors.push('password_differs');

      //res.redirect('');

		}else{

			callback(null,password);

		}

	}

	process.checkMailAvailabilty = function(callback){

		connection.query('SELECT * from beeyond_user WHERE mail ="' + mail + '" ', function(err, rows, fields) {

			if (err)return callback(err);
			// WE CHECK IF THE MAIL IS FREE
			var mailFree = rows.length;

			if(mailFree == 0){

				callback(null,mail);

			}else{
				//console.log('Mail is already used');
				callback('mail_used',null);

			}

		});

	}




	_async.parallel(process,function(err,result){

		if(err){
			console.error("ERROR DURING REGISTRATION : " + err);
			// REDIRECTION VERS LA PAGE D'ENVOI DE FORMULAIRE , AVEC LE DETAIL DES ERREURS
			//req.session.registrationError.push(err);
			//res.redirect('/');

      // ON POURRA EVENTUELLEMENT AJOUTER DES INFOS DETAILLEES AVEC REGISTRATION ERROR.
      res.render('form/errorForm.ejs',{ arg: "register_fail" } );


			//return false;
			return;

		}

		console.log(result);

		//var password = result['checkPasswords'];
		//var mail = result['checkMailAvailabilty'];

		//moveUploadedAvatar(req,res,form);
    addUser(req,res,form);

		//return;


	});
//return;

}





function addUser(req,res,form){

  var pseudo = form[0];
	var mail = form[1];
	var password = form[2];
	var pseudo = form[3];

  var defaultStatut = "user";


	var today = new Date();
	var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;

	connection.query('INSERT INTO beeyond_user (mail,password,statut,pseudo,dateRegistration) VALUES ("'+mail+'","'+password+'","'+defaultStatut+'","'+pseudo+'","'+dateTime+'")',  function (err, result) {

		if (err) {
            console.log(err.message);
        } else {
            console.log('New User created !');
        }


      res.redirect("/");
			//console.log("SET USER ID AFTER REGISTRATION ,req " + req + " >> res " + res + "  >> mail " + mail);
			//console.log("REQ USER ID LENGTH " + req.session.userId.length);



		});






}

function checkLocalityExistence(locality){

	connection.query('SELECT * FROM ed_localite WHERE name="'+locality+'"', function (err, result) {

		if(!err){

			console.log("Check locality existence " + result.length);

			if(result.length == 0){

				// ON AJOUTE CETTE NOUVELLE LOCALITE
				connection.query('INSERT INTO ed_localite (name,country) VALUES ("'+locality+'","France")',  function (err, result) {

					if (err) {
						console.log(err.message);
					} else {
						console.log('New Locality created !');
					}

				});


			}

		}


	});

}

function setUserIDAfterRegistration(req,res,mail){

	console.log("SET USER ID AFTER REGISTRATION ");

	connection.query('SELECT * FROM ed_user WHERE mail="'+mail+'"', function (err, result) {

		console.log("connection query");

		if(!err){

			console.log("ok");

			var userId = result[0]['id'];
			console.log('Set user id after registration : ' + userId);
			req.session.userId[0] = userId;

			res.redirect('/main');

		}else{

			console.log("ERROR " + err);

		}



	});



}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports.checkUserEntry = checkUserEntry;

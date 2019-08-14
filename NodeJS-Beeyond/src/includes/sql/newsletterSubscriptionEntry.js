//const SqlConnection = require('./sqlConnection');
//const connection = SqlConnection.sqlConnection;

//ASYNC
const _async = require('async');


function checkNewsletterSubscriptionEntry(req,res,form,connection){


	var name = "";

	var process = {};

  var mail = form[2];


	process.checkNewsletterSubscriptionMailAvailabilty = function(callback){

		connection.query('SELECT * from beeyond_newsletter_subscription WHERE mail ="' + mail + '" ', function(err, rows, fields) {

			if (err)return callback(err);
			// WE CHECK IF THE VALUE IS FREE
			var valueFree = rows.length;

			if(valueFree == 0){

				callback(null,mail);

			}else{

				callback('Mail : ' + mail + ' is already used for newslette subscription',null);

			}

		});
	}

		_async.parallel(process,function(err,result){

		if(err){
			console.error("ERROR " + err);
			// REDIRECTION VERS LA PAGE D'ENVOI DE FORMULAIRE , AVEC LE DETAIL DES ERREURS
			req.session.inserterErrorMessage = [];
			req.session.inserterErrorMessage.push(err);
			res.redirect('/errorPage');

			return;

		}

			console.log(" RESULT : " + result + " FORM LENGTH " + form.length);
			insertNewsletterSubscriptionEntry(req,res,form);


		});
}

function insertNewsletterSubscriptionEntry(req,res,form){

	var firstName = form[0];
	var lastName = form[1];
	var mail = form[2];
	var company = form[3];


	console.log("firstName " + firstName + " lastName " + lastName + " mail " + mail + " company " + company );

	connection.query('INSERT INTO beeyond_newsletter_subscription (nom,prenom,company,mail) VALUES ("'+lastName+'","'+firstName+'","'+company+'","'+mail+'")',  function (err, result) {

		if (err) {

            console.log("NEWSLETTER SUBSCRIPTION ERROR : " + err.message);

        } else {

            console.log('Newsletter Subscription succesfully inserted !');
            var validateFormArg = "newsletterSubscription";

			      res.redirect("/validateForm/" + validateFormArg);
		}




	});



}

module.exports.checkNewsletterSubscriptionEntry = checkNewsletterSubscriptionEntry;

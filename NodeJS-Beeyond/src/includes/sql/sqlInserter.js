
//eval(fs.readFileSync('includes/sensorEntry.js')+'');
const SensorEntry = require('./sensorEntry');
// const SensorInfo = require('./sensorInfo');
const CaptationEntry = require('./captationEntry');
// const CaptationInfo = require('./captationInfo'); // insert Log
const CaptationFileEntry = require('./captationFileEntry'); // insert Log
// const CaptationInfo = require('./captationInfo'); // insert Log
const NewsletterSubscriptionEntry = require('./newsletterSubscriptionEntry'); // insert Log

const UserEntry = require('./userEntry'); // insert Log

const DocumentationFileEntry = require('./documentationFileEntry'); // insert Log


function insertEntry(req,res,arg,form,sqlConnection){

		var unknownArgument = true;

		if(arg == 'sensor'){

			SensorEntry.checkSensorEntry(req,res,form,sqlConnection);
			unknownArgument = false;
		}

		if(arg == 'captation'){

			CaptationEntry.checkCaptationEntry(req,res,form,sqlConnection);
			unknownArgument = false;
		}

		if(arg == 'captation_file'){

			CaptationFileEntry.insertCaptationFile(req,res,form,sqlConnection);
			unknownArgument = false;
		}

		if(arg == 'newsletter_subscription'){

			NewsletterSubscriptionEntry.checkNewsletterSubscriptionEntry(req,res,form,sqlConnection);
			unknownArgument = false;
		}

		if(arg == 'user'){

			UserEntry.checkUserEntry(req,res,form,sqlConnection);
			unknownArgument = false;
		}


		if(arg == 'archive'){

			DocumentationFileEntry.checkDocumentationFileEntry(req,res,form,sqlConnection);
			unknownArgument = false;
		}


		if(unknownArgument)console.log("ERROR ! ARGUMENT UNKNOWN IN insertEntry() . Argument : " + arg);


}


module.exports.insertEntry = insertEntry;

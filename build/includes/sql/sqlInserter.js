'use strict';

//eval(fs.readFileSync('includes/sensorEntry.js')+'');

function insertEntry(req, res, arg, form) {

	var unknownArgument = true;

	if (arg == 'sensor') {

		//console.log("FORM LG "+ form.length);
		checkSensorEntry(req, res, form);

		unknownArgument = false;
	}

	if (arg == 'captation') {

		//console.log("FORM LG "+ form.length);
		checkCaptationEntry(req, res, form);

		unknownArgument = false;
	}

	if (arg == 'captation_file') {

		unknownArgument = false;
		insertCaptationFile(req, res, form);
	}

	if (unknownArgument) console.log("ERROR ! ARGUMENT UNKNOWN IN insertEntry() . Argument : " + arg);
}
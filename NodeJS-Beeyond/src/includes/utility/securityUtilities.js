function cleanSqlTextEntry(entry,cb){

	//console.log("cleanInput TO CLEAN " + cleanInput);

	var cleanInput = "" + entry; 
	
	cleanInput = cleanInput.replace(/'/g,"");
	cleanInput = cleanInput.replace(/SELECT/g,"");
	cleanInput = cleanInput.replace(/INSERT/g,"");
	cleanInput = cleanInput.replace(/UPDATE/g,"");
	cleanInput = cleanInput.replace(/DELETE/g,"");
	cleanInput = cleanInput.replace(/FILE/g,"");
	cleanInput = cleanInput.replace(/CREATE/g,"");
	cleanInput = cleanInput.replace(/ALTER/g,"");
	cleanInput = cleanInput.replace(/TRUNCATE/g,"");
	cleanInput = cleanInput.replace(/GRANT/g,"");
	cleanInput = cleanInput.replace(/SUPER/g,"");
	cleanInput = cleanInput.replace(/SHOW DATABASES/g,"");
	cleanInput = cleanInput.replace(/USER/g,"");
	cleanInput = cleanInput.replace(/VALUES/g,"");
	
	cb(cleanInput);
	
}

module.exports.cleanSqlTextEntry = cleanSqlTextEntry;

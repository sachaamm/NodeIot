function getExtension(fileName,cb){

	var extension = fileName.match(/\.[0-9a-z]+$/i);
	if(extension.length == 1){
    cb(extension[0]);
  }

  if(extension.length > 1)
  {
    console.log("ERROR, extension length > 1");
  }

  if(extension.length == 0)cb(null);

	//return null;

}

function availableExtension(extensions,extension,cb){

  var count = 0;

	for(var i = 0 ; i < extensions.length ; i++){

		if(extensions[i] == extension){
      cb(true);

    }else{
      count++;

    }

	}

	if(count == extensions.length)cb(false);

}

module.exports.getExtension = getExtension;
module.exports.availableExtension = availableExtension;

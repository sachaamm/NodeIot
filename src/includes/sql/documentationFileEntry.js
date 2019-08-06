//ASYNC
const _async = require('async');

const FileExtensionUtility = require('../utility/fileExtensions');



function checkDocumentationFileEntry(req,res,form,sqlConnection){

  console.log("DEFINE CHECK DOCUMENTATION FILE ENTRY ! ");
  //var process = {};
  moveUploadedDocumentationFile(req,res,form,sqlConnection);


}

function moveUploadedDocumentationFile(req,res,form,sqlConnection){

	var directoryName = 'public/uploads/archives/';
	var fileName ;
	var extensions = ['.txt','.jpg'];

	var sampleFile;

	if (!req.files) {
		res.send('No files were uploaded.');
		return;
	}

	sampleFile = req.files.fichier;

	//DATE
	fileName = new Date().getTime(); // DATE FOR FILE

  form.push(fileName);
  form.push("picture");

	//var validExtension = FileExtensionUtility.availableExtension(extensions,FileExtensionUtility.getExtension(sampleFile.name));

  FileExtensionUtility.getExtension(sampleFile.name , function(_extension){

    FileExtensionUtility.availableExtension(extensions,_extension,function(validExtension){

      // IF THE FILE EXTENSION IS VALID
      if(validExtension){

        var profileFileName = fileName + _extension;
        var pathFile = directoryName + '/' + profileFileName;

        // MOVE THE FILE
        sampleFile.mv(pathFile, function(err) {

          if (err) {

            var err = "Upload Error status 500";
            console.log(err);

            res.render('form/errorForm.ejs',{ arg: "upload_fail" } );

          }
          else {

            console.log('File uploaded!');
            addArchiveEntry(req,res,form,sqlConnection);

            }
          });

      }
      else {

           var err = 'Wrong type for this file!';
           console.log(err);
           req.session.registrationError.push(err);

           res.redirect('/');

      }


    });

  });







}


function addArchiveEntry(req,res,form,sqlConnection){

  var title = form[0];
	var description = form[1];
	var fileName = form[2];
	var type = form[3];
	//var additionalInfo = form[4];
	//var gpsInfo = form[5];
	//var arduinoFileName = form[6];


	//console.log("Name " + name + " protocol " + protocol + " port " + port + " sensorsNames " + sensorsNames + " gps info " + gpsInfo);

	connection.query('INSERT INTO beeyond_archive (title,description,fileName,type) VALUES ("'+title+'","'+description+'","'+fileName+'","'+type+'")',  function (err, result) {

		if (err) {

            console.log("ARCHIVE ENTRY ERROR : " + err.message);

        } else {

            console.log('Archive succesfully inserted !');
			      res.redirect("/");
		}




	});



}

module.exports.checkDocumentationFileEntry = checkDocumentationFileEntry;

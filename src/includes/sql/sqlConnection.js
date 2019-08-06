
//MYSQL
var mysql = require('mysql');

var sqlCredentialPath = "./mySqlCredentials.txt";

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream(sqlCredentialPath)
});

if (!require('fs').existsSync(sqlCredentialPath)) {
    // Do something
    console.log("MYSQL ERROR ! Your MYSQL File Credentials ( - path : " + sqlCredentialPath + " ) were not found !  ");
}


var lineIndex = 0;
var dbUser = "";
var dbPassword = "";
var dbName = "";

var nbOfSecretInfos = 3;

console.log("create connection");


module.exports.sqlConnection = function(cb){

  //console.log("create connection");


  lineReader.on('line', function (line) {
    //console.log('Line from file:', line);

    if(lineIndex == 0)dbName = line;
    if(lineIndex == 1)dbUser = line;
    if(lineIndex == 2)dbPassword = line;

    if(lineIndex == nbOfSecretInfos-1){


      connection      =    mysql.createConnection({
        connectionLimit : 100, //important
      	host     : 'localhost',
        user     : dbUser,
        password : dbPassword,
        database : dbName

      });

      cb(connection);

      console.log("Create SQL connection from " + sqlCredentialPath + ".");


    }

    lineIndex++;

  });



}

//module.exports.sqlConnection = connection;

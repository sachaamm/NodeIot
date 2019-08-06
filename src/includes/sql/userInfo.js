function usersExists(sqlConnection,mail,password,cb){

  sqlConnection.query("SELECT * FROM beeyond_user WHERE mail='" + mail + "'", function(err, rows, fields) {

    console.log("rows length " + rows.length);

    if(rows.length != 0){

      //console.log(password + " / " + rows[0]["password"] + " / " + rows[0]["statut"]);


      if(rows[0]["password"] == password){
        cb(["validate_login",rows[0]["id"],rows[0]["statut"]]);
      }else{
        cb(["wrong_password",rows[0]["id"],rows[0]["statut"]]);
      }

    }else{

        cb(["unknown_user",-1,""]);

    }




  });

}

module.exports.usersExists = usersExists;

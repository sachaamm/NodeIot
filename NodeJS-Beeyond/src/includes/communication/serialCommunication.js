// --------------------
// -- SERIAL PORT --     in progress / not priority
// --------------------

function readSerialData(){

	console.log("START TO READ SERIAL DATA");
	
	port.open(function (err) {
		if (err) {
			return console.log('Error opening port: ', err.message);
		}
 
		// Because there's no callback to write, write errors will be emitted on the port:
		port.write('main screen turn on');
	});
 
	// The open event is always emitted
	port.on('open', function() {
		// open logic
		console.log("port open");

		readDataOnPort();	
		
	});
	
	
}


function readDataOnPort () // for reading
{
    port.on('data', function(data)
    {
        
	
		var strData = data.toString();
		var parseData = strData.charCodeAt(0);
		
		var dataArray = [];
		
		for(var i = 0 ; i < data.length ; i++){
			
			dataArray.push(strData.charCodeAt(i));
			console.log("CHAR AT : "+strData.charCodeAt(i));
		}
		
		if(dataArray.length == streamExportCategories.length){
			
			if(exportFile){
				console.log("ADD LINE TO EXPORT");
				streamLines.push(dataArray.join(",")+"\n");
			}
			
		}
		
		console.log("Data parsed :: Length ( " + data.length + " )  data " + data + " str Data " + strData + "bb" + intFromBytes(data) );
		
		socketClient.emit('receiveCaptation', dataArray);
		// socketClient.emit('receiveCaptation', data);
		
		receiveNewData = true;
		
    });
}


module.exports.readSerialData = readSerialData;
module.exports.readDataOnPort = readDataOnPort;

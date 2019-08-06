NTPClient timeClient(udp, "europe.pool.ntp.org", 7200, 60000);
String formattedDate;
String dayStamp;
String timeStamp;
String minutes;
String previousMinutes;



// CHECK NTP TIME
void checkTime() {

  timeClient.update();
  //Serial.println(timeClient.getFormattedTime());
  formattedDate = timeClient.getFormattedDate();
  //Serial.println(formattedDate);

  // Extract date
  int splitT = formattedDate.indexOf("T");
  dayStamp = formattedDate.substring(0, splitT);
  //Serial.print("DATE: ");
  //Serial.println(dayStamp);

  int splitDateA = dayStamp.indexOf("-", 1);
  int splitDateB = dayStamp.indexOf("-", 2);

  String a = dayStamp;
  a = dayStamp.substring(0,4);
  //a.remove(splitDateA,1);
  //a.remove(splitDateB+1,1);
  //a.replace('-','x');
  //Serial.println(a);
  String b = dayStamp.substring(5,7);
  //Serial.println(b);
  String c = dayStamp.substring(8,10);
  //Serial.println(c);

  String year = formattedDate.substring(0, splitDateA);
  
  String month = formattedDate.substring(splitDateA+1, splitDateB);
 //String day = formattedDate.substring(splitDateB+1, dayStamp.length() - 1);
  // Extract time
  timeStamp = formattedDate.substring(splitT + 1, formattedDate.length() - 1);
  //Serial.print("TIME: ");
  //Serial.println(timeStamp);

  int splitHour = timeStamp.indexOf(":", 2);
  //Serial.println(splitHour);


  minutes = timeStamp.substring(splitHour + 1, splitHour + 3);

  if (previousMinutes.toInt() != minutes.toInt() ) {

    // WE ADD A LINE IN OUR LOG FILE

    // 1- DETERMINES PATH
    String cleanDayStamp = dayStamp;
    cleanDayStamp.replace('-', 'X');

    String folder = logDirectoryName;
    const int arraySize = folder.length() + 1 + cleanDayStamp.length()  + 4;

    
    String fileName = "/ESPLOGS/" + a + b + c + ".csv";

    // If the data.txt file doesn't exist
    // Create a file on the SD card and write the data labels
    File file = SD.open(fileName.c_str());
    if (!file) {
      Serial.println("File doens't exist");
      Serial.println("Creating file...");
      writeFile(fileName.c_str(), "Reading ID, Date, Hour, Humidity, TemperatureC, HeatIndexC, TemperatureF, HeatIndexF \r\n");
    }
    else {
      Serial.println("File already exists"); 
      
    }

    String message = "0,"+ dayStamp +","+ timeStamp +","+ humidity +","+ temperatureC+","+ heatIndexC +"," + temperatureF+","+heatIndexF+" \r\n";

    appendFile(fileName.c_str(), message.c_str());
    
    file.close();

  }

  previousMinutes = minutes;
}

File myFile;
char logDirectoryName [] = "ESPLOGS"; // USE ONLY CAPS !

bool   SD_present = false;


void setupSD(){
   Serial.print("Initializing SD card...");

  if (!SD.begin(5, 23, 19, 18)) {
   // if (!SD.begin(5)) {
    Serial.println("initialization failed!");
    while (1);
  }
  Serial.println("initialization done.");
  SD_present = true;

  if (!SD.exists(logDirectoryName)) {
    SD.mkdir(logDirectoryName);
  }

}

// Append data to the SD card (DON'T MODIFY THIS FUNCTION)
void appendFile( const char * path, const char * message) {
  Serial.printf("Appending to file: %s\n", path);

  File file = SD.open(path, FILE_WRITE);
  if (!file) {
   
  }

  
  if (file.print(message)) {
    Serial.println("Message appended");
  } else {
    Serial.println("Append failed");
  }
  
  file.close();
}


// Write to the SD card (DON'T MODIFY THIS FUNCTION)
void writeFile(const char * path, const char * message) {

  Serial.printf("Writing file: %s\n", path);

  File file = SD.open(path, FILE_WRITE);
  if(!file) {
    Serial.println("Failed to open file for writing");
    return;
  }
  if(file.print(message)) {
    Serial.println("File written");
  } else {
    Serial.println("Write failed");
  }
  file.close();
  
}

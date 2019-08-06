/*
 *  This sketch sends random data over UDP on a ESP32 device
 *
 */
#include <WiFi.h>
#include <WiFiUdp.h>





// WiFi network name and password:
const char * networkName = "YOUR_SSID";
const char * networkPswd = "*********";

//IP address to send UDP data to:
// either use the ip address of the server or 
// a network broadcast address
const char * udpAddress = "192.168.8.170";
const int udpPort = 41234;

//Are we currently connected?
boolean connected = false;

//The udp library class
WiFiUDP udp;



void setup(){
  // Initilize hardware serial:
  Serial.begin(115200);

  Serial.println("Hello ESP32");

  //Connect to the WiFi network
  connectToWiFi(networkName, networkPswd);
}

void loop(){

 
  int captationId = 2; // CAPTATION ID HAS TO BE DEFINED MANUALLY IN THE ARDUINO CODE

  int temperature = (int)random(18,30);
  int humidity = (int)random(30,40);
  
  //only send data when connected
  if(connected){
    //Send a packet
    udp.beginPacket(udpAddress,udpPort);
    
    udp.printf("%d *** %d *** %d",captationId, temperature, humidity);
    
    udp.endPacket();
  }
  //Wait for 1 second
  delay(1000);
}

void connectToWiFi(const char * ssid, const char * pwd){
  Serial.println("Connecting to WiFi network: " + String(ssid));

  // delete old config
  WiFi.disconnect(true);
  //register event handler
  WiFi.onEvent(WiFiEvent);
  
  //Initiate connection
  WiFi.begin(ssid, pwd);

  Serial.println("Waiting for WIFI connection...");
}

//wifi event handler
void WiFiEvent(WiFiEvent_t event){
    switch(event) {
      case SYSTEM_EVENT_STA_GOT_IP:
          //When connected set 
          Serial.print("WiFi connected! IP address: ");
          Serial.println(WiFi.localIP());  
          //initializes the UDP state
          //This initializes the transfer buffer
          udp.begin(WiFi.localIP(),udpPort);
          connected = true;
          break;
      case SYSTEM_EVENT_STA_DISCONNECTED:
          Serial.println("WiFi lost connection");
          connected = false;
          break;
    }
}

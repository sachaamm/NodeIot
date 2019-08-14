/*****************************************
* ESP32 GPS VKEL 9600 Bds
******************************************/

#include <TinyGPS++.h>                       

TinyGPSPlus gps;                            
HardwareSerial Serial1(1);    


#include <WiFi.h>
#include <WiFiUdp.h>


// WiFi network name and password:
const char * networkName = "GL-AR300M-884";
const char * networkPswd = "goodlife";

//IP address to send UDP data to:
// either use the ip address of the server or 
// a network broadcast address
const char * udpAddress = "192.168.8.170";
const int udpPort = 41234;


//Are we currently connected?
boolean connected = false;

//The udp library class
WiFiUDP udp;


void setup()
{
  Serial.begin(115200);
  Serial1.begin(9600, SERIAL_8N1, 17, 16);

   //Connect to the WiFi network
  connectToWiFi(networkName, networkPswd);
}

void loop()
{
  Serial.print("Latitude  : ");
  Serial.println(gps.location.lat(), 5);
  Serial.print("Longitude : ");
  Serial.println(gps.location.lng(), 4);
  Serial.print("Satellites: ");
  Serial.println(gps.satellites.value());
  Serial.print("Altitude  : ");
  Serial.print(gps.altitude.feet() / 3.2808);
  Serial.println("M");
  Serial.print("Time      : ");
  Serial.print(gps.time.hour());
  Serial.print(":");
  Serial.print(gps.time.minute());
  Serial.print(":");
  Serial.println(gps.time.second());
  Serial.println("**********************");


  int captationId = 9;
  int gpsCaptationId = 7;
  int temperature = (int)random(18,30);
  int humidity = (int)random(30,40);
  
  //only send data when connected
  if(connected){

    //Serial.println("temperature ");
    //Serial.println(temperature);
    //Send a packet
    udp.beginPacket(udpAddress,udpPort);

   // udp.printf("%d *** %d *** %d *** %.8f *** %.8f *** %.3f",captationId, temperature, humidity,gps.location.lat(),gps.location.lng(),gps.altitude.feet());
    udp.printf("%d *** %.8f *** %.8f *** %.3f",gpsCaptationId,gps.location.lat(),gps.location.lng(),gps.altitude.feet());
    udp.endPacket();

    udp.beginPacket(udpAddress,udpPort);
    udp.printf("%d *** %d *** %d",captationId,temperature,humidity);
    udp.endPacket();
  }


  smartDelay(1000);                                      

  if (millis() > 5000 && gps.charsProcessed() < 10)
    Serial.println(F("No GPS data received: check wiring"));
}

static void smartDelay(unsigned long ms)                
{
  unsigned long start = millis();
  do
  {
    while (Serial1.available())
      gps.encode(Serial1.read());
  } while (millis() - start < ms);
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

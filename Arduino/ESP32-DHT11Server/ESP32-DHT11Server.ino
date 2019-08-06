/*
    This sketch sends random data over UDP on a ESP32 device

*/


// *** DHT *** //
#include "DHT.h"
#include "DHTFunctions.h"

// *** WIFI & UDP*** //
#include <WiFi.h>
#include <WiFiUdp.h>
#include "UDPFunctions.h"
#include "WifiFunctions.h" 

// *** SD *** //
#include <mySD.h>
#include "SDFunctions.h"

// *** WEBSERVER & CSS *** //
#include <ESP32WebServer.h>  
#define ServerVersion "1.0"
#include "CSS.h"
#include "WebserverFunctions.h"
//#include "ESPAsyncWebServer.h"


// *** NTP *** //
#include <NTPClient.h>
#include "NTPFunctions.h"

#include <TimedAction.h>
TimedAction sensorAction = TimedAction(1000, checkSensor); // GET SENSOR VALUES
TimedAction timeAction = TimedAction(1000, checkTime); // GET DATE AND TIME VIA NTP


void setup() {
  // Initilize hardware serial:
  Serial.begin(115200);

  connectToWiFi(networkName, networkPswd); //Connect to the WiFi network

  setupDHT();
  setupSD();
  setupWebserver();

}

void loop() {

  sensorAction.check(); // GET SENSORS VALUES EACH 1000ms
  timeAction.check(); // GET DATE AND TIME VALUES FROM NTP EACH 1000ms

  udpLoop(); // LISTEN INCOMING UDP PACKETS

  server.handleClient(); // Listen for client connections


}

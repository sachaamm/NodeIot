//Are we currently connected?
boolean connected = false;


// WiFi network name and password:
const char * networkName = "SSID";
const char * networkPswd = "*****";



//wifi event handler
void WiFiEvent(WiFiEvent_t event) {
  switch (event) {
    case SYSTEM_EVENT_STA_GOT_IP:
      //When connected set
      Serial.print("WiFi connected! IP address: ");
      Serial.println(WiFi.localIP());
      //initializes the UDP state
      //This initializes the transfer buffer
      udp.begin(WiFi.localIP(), udpPort);
      connected = true;
      break;
    case SYSTEM_EVENT_STA_DISCONNECTED:
      Serial.println("WiFi lost connection");
      connected = false;
      break;
  }
}


void connectToWiFi(const char * ssid, const char * pwd) {
  Serial.println("Connecting to WiFi network: " + String(ssid));
  
  WiFi.disconnect(true); // delete old config
  WiFi.onEvent(WiFiEvent); //register event handler
  WiFi.begin(ssid, pwd); //Initiate connection

  Serial.println("Waiting for WIFI connection...");
}

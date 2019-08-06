
//IP address to send UDP data to:
// either use the ip address of the server or
// a network broadcast address
const char * udpAddress = "192.168.0.255";
const int udpPort = 3333;

//The udp library class
WiFiUDP udp;

char packetBuffer[255]; //buffer to hold incoming packet
uint8_t  * ReplyBuffer = 0x00;       // a string to send back

bool debugUdp = false;

void udpLoop(){
  
  int packetSize = udp.parsePacket();
  if (packetSize) {

    IPAddress remoteIp = udp.remoteIP();

    if(debugUdp){
      Serial.print("Received packet of size ");
      Serial.println(packetSize);
      Serial.print("From ");
    
      Serial.print(remoteIp);
      Serial.print(", port ");
      Serial.println(udp.remotePort());
    }
  

    // read the packet into packetBufffer
    int len = udp.read(packetBuffer, 255);
    if (len > 0) {
      packetBuffer[len] = 0;
    }

    if(debugUdp){
      Serial.println("Contents:");
      Serial.println(packetBuffer);
    }

    // send a reply, to the IP address and port that sent us the packet we received
    if (strcmp(packetBuffer, "HELLO") == 0) {

      udp.beginPacket(udp.remoteIP(), udp.remotePort());
      udp.print(String("HELLO_123"));
      //udp.write((uint8_t)atoi("eee") ); // https://stackoverflow.com/questions/25360893/convert-char-to-uint8-t
      udp.endPacket();

    }

    if (strcmp(packetBuffer, "VALUES") == 0) {

      udp.beginPacket(udp.remoteIP(), udp.remotePort());

      String valuesStr = "VALUES_";

      valuesStr += humidity;
      valuesStr += "_";
      valuesStr += temperatureC;
      valuesStr += "_";
      valuesStr += heatIndexC;
      valuesStr += "_";
      valuesStr += temperatureF;
      valuesStr += "_";
      valuesStr += heatIndexF;

      udp.print(valuesStr);
      //udp.write((uint8_t)atoi("eee") ); // https://stackoverflow.com/questions/25360893/convert-char-to-uint8-t
      udp.endPacket();

    }

  }
}

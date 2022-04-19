#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>

AsyncWebServer server(80);

const int relay = 5;
const char* ssid = "LAN@Marcel"; //Enter SSID
const char* password = "31415926"; //Enter Password

bool armed = false;
bool shock = false;

void notFound(AsyncWebServerRequest *request) {
  request->send(404, "text/plain", "Not found");
}

void setup() {
  Serial.begin(9600);
  pinMode(relay, OUTPUT);
  digitalWrite(relay, HIGH);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) 
  {
     delay(500);
     Serial.print("*");
  }

  Serial.println("");
  Serial.println("WiFi connection Successful");
  Serial.print("The IP Address of ESP8266 Module is: ");
  Serial.print(WiFi.localIP());// Print the IP address
  Serial.println("");

  server.on("/arm", HTTP_POST, [](AsyncWebServerRequest *request) {
    armed = true;
    request->send(200, "text/plain", "Armed");
  });

  server.on("/shock", HTTP_POST, [](AsyncWebServerRequest *request) {
    shock = true;
    request->send(200, "text/plain", "Shock");
  });

  server.onNotFound(notFound);

  server.begin();
}

void loop() {
  if (shock && !armed)
  { 
    shock = false;
  }
  
  if(armed && shock){
    digitalWrite(relay, LOW);
    Serial.println("On");
    delay(500);
    digitalWrite(relay, HIGH);
    Serial.println("Off");
    delay(500);
    shock = false;
    armed = false;
  }
}
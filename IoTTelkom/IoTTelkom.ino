/**
Bismillahirahmanirahim

To Do :
A411 Hall Effect Config
**/

#include <SPI.h>
#include <LoRa.h>
#include <stdint.h>
#include <SparkFunBME280.h>
#include <Wire.h>
#include  <BH1750.h>
#include <i2cdetect.h>
#include <Bounce2.h>

#define windDir A0

#define rotaryEncoder_A 5 //CLK
#define rotaryEncoder_B 6 //DT
#define rotaryEncoder_sw 7

#define STEP_SIZE 12

byte encoder0Pos = 0;

Bounce debouncerA = Bounce();
Bounce debouncerB = Bounce();

// initialize BME object
BME280 BME280Sensor; // temperature, pressure,
BH1750 lightMeterBH1750(0x23);

// GPS Init
#include <TinyGPS++.h>
#include <SoftwareSerial.h>
/*
   This sample code demonstrates the normal use of a TinyGPS++ (TinyGPSPlus) object.
   It requires the use of SoftwareSerial, and assumes that you have a
   4800-baud serial GPS device hooked up on pins 4(rx) and 3(tx).
*/
static const int RXPin = 5, TXPin = 4; // yellow cable RX, TX green cable.
static const uint32_t GPSBaud = 9600;

// Hall effect
#define pinHall 2 // Digital 

// Reed Switch
#define pinReed 3 

//Wind gust and rainfall arrays are updated every minute
//Timing variables
byte seconds;                       //Keeps track of seconds to increment the minute counter
byte mins_2;                        //Keeps track of time for average wind dir/speed over two minutes
byte minutes;                       //Keeps track of minutes to enable easy access to time-based array locations
byte mins_10;                       //Keeps track of time for average wind dir/speed over ten minutes
long prevSec;                       //Millis counter to check for passing seconds
unsigned int timeSinceReset;        //Keeps track of time (in mins) since last reset and resets variables after 24hrs
int wind_speed_rpm;
int rain_fall_minute;
unsigned int lastRec;


// The TinyGPS++ object
TinyGPSPlus gps;

// The serial connection to the GPS device
SoftwareSerial ss(RXPin, TXPin);

void setupBME280(){
  //***Driver settings********************************//
    //commInterface can be I2C_MODE or SPI_MODE
    //specify chipSelectPin using arduino pin names
    //specify I2C address.  Can be 0x77(default) or 0x76

    //For I2C, enable the following and disable the SPI section
    BME280Sensor.settings.commInterface = I2C_MODE;
    BME280Sensor.settings.I2CAddress = 0x76;

     //runMode can be:
    //  0, Sleep mode
    //  1 or 2, Forced mode
    //  3, Normal mode
    BME280Sensor.settings.runMode = 3; //Forced mode
     //tStandby can be:
    //  0, 0.5ms
    //  1, 62.5ms
    //  2, 125ms
    //  3, 250ms
    //  4, 500ms
    //  5, 1000ms
    //  6, 10ms
    //  7, 20ms
    BME280Sensor.settings.tStandby = 0;

    //filter can be off or number of FIR coefficients to use:
    //  0, filter off
    //  1, coefficients = 2
    //  2, coefficients = 4
    //  3, coefficients = 8
    //  4, coefficients = 16
    BME280Sensor.settings.filter = 0;

    //tempOverSample can be:
    //  0, skipped
    //  1 through 5, oversampling *1, *2, *4, *8, *16 respectively
    BME280Sensor.settings.tempOverSample = 1;

    //pressOverSample can be:
    //  0, skipped
    //  1 through 5, oversampling *1, *2, *4, *8, *16 respectively
    BME280Sensor.settings.pressOverSample = 1;

    //humidOverSample can be:
    //  0, skipped
    //  1 through 5, oversampling *1, *2, *4, *8, *16 respectively
    BME280Sensor.settings.humidOverSample = 1;
    delay(10);  //Make sure sensor had enough time to turn on. BME280 requires 2ms to start up.         Serial.begin(57600);

    Serial.print("Starting BME280... result of .begin(): 0x");
    //Calling .begin() causes the settings to be loaded
    Serial.println(BME280Sensor.begin(), HEX);
}

void setupEncoder(){
    Serial.println("Setup Encoder...");
    // pinMode(rotaryEncoder_A, INPUT);
    // pinMode(rotaryEncoder_B, INPUT);
    Serial.println("Set PIN Mode Encoder Done...");

    // debouncerA.attach(rotaryEncoder_A, INPUT_PULLUP);
    // debouncerA.interval(5); // interval in ms
    // debouncerB.attach(rotaryEncoder_B, INPUT_PULLUP);
    // debouncerB.interval(5); // interval in ms
    //attachInterrupt(0 , encoder_read() , FALLING )

}

void setupPotensioMeter(){
    Serial.println("PIN A0 as potensiometer");
    pinMode(windDir, INPUT);
}

int count = 0;
void encoder_read() {
  if(digitalRead(rotaryEncoder_B)){
    count++;
  } else {
    count--;
  }

  Serial.println("Count : " + String(count));
}

void setupBH1750(){
  Serial.println("BH1750 Setup... [ Light Meter Sensor ]");
  lightMeterBH1750.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
}

void setupGPS(){
  Serial.println("GPS setup start..");
  ss.begin(GPSBaud);
}

void setupHallEffect(){
  Serial.println("Hall Effect setup...");
  //interrupt all gpio beside gpio16
  pinMode(pinHall, INPUT); //
  attachInterrupt(digitalPinToInterrupt(pinHall),detectMagnet,FALLING);
}

void setupReedSwitch(){
  Serial.println("Reed Switch setup...");
  pinMode(pinReed, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(pinReed),windSpeed,FALLING);
}

int count_magnet = 0;
void detectMagnet(){
  //digitalWrite(LED2, HIGH);
  count_magnet++;
  Serial.println("Magnet Detected");
}

//
int wind_count = 0; 
void windSpeed(){
  if (millis() - lastRec > 20 ) {
    wind_count++;
    lastRec = millis();
    Serial.println("One ROtation Detected");
  }
  
}

// just testing
String readHallEffect(){
  int val = digitalRead(pinHall);

  return String(val);
}

// count tipping 
int countTipping = 0, rainFall = 0;
int countRainFall(){
  rainFall = rainFall + (0.2 * count_magnet);

  return rainFall;
}

// count wind speed 
float wind_speed = 0.0, radius = 2.3;
float countWindSpeed(int rpm){
  wind_speed = wind_speed + (0.2 * count_magnet);
  //V=r×2π×(rps)……m/s
  // rpm to rps
  int rps = rpm/60;
  wind_speed = radius * 2 * 3.14 * rps;
  return wind_speed;
}

void resetRainValue(){
  rainFall = 0;
  rain_fall_minute = 0;
  countTipping = 0;
}

String readGPS(){ 
  if (gps.location.isValid()) {
    double lat = gps.location.lat();
    double lon = gps.location.lng();
    //Serial.println(lat);
    //Serial.println(lon);
    //Serial.println("Lat : " + lat  + " - Lon : " + lon);
    return String(lat,6) + "," + String(lon,6);
  } else {
    //Serial.println("gps not lock");
    return "null,null";
  }
}

String readBME280(){
  float temperature = BME280Sensor.readTempC();
  float humidity = BME280Sensor.readFloatHumidity();
  float pressure = BME280Sensor.readFloatPressure();

  return String(temperature) + "," + String(humidity) + "," + String(pressure);
}

String readEncoder(){
   // Read the status of the inputs
    debouncerA.update();
    debouncerB.update();

  int val = digitalRead(rotaryEncoder_A);
  int8_t EncVariation = 0;

    if (debouncerA.rose())
    { // if input A changed from low to high, it was CW if B is high too
        EncVariation = (debouncerB.read()) ? 1 : -1;
    }
    else if (debouncerA.fell())
    { // if input A changed from high to low, it was CW if B is low too
        EncVariation = (debouncerB.read()) ? -1 : 1;
    }
    else if (debouncerB.rose())
    { // if input B changed from low to high, it was CCW if A is high too
        EncVariation = (debouncerA.read()) ? -1 : 1;
    }
    else if (debouncerB.fell())
    { // if input B changed from high to low, it was CCW if B is low too
        EncVariation = (debouncerA.read()) ? 1 : -1;
    }

    if (EncVariation != 0)
    {
        encoder0Pos = (encoder0Pos + EncVariation * STEP_SIZE) % 360;

        Serial.println (encoder0Pos, DEC);
    }

  return String(val) + "," + String(encoder0Pos);
}

String readBH1750(){
  uint16_t lux = lightMeterBH1750.readLightLevel();
  return String(lux);
}

int convertArahAngin(int value){
  // input 0 - 360
  // output utara, timur laur, timur, tenggara, selatan, barat daya, barat laut
  // 0 , 45 , 90 , 135, 180 , 225 , 270 , 315

  if ( (value > 337.5 && value <= 360) || (value >= 0 && value <= 22.5))
    //return "Utara"; 
    return 0; 
  else if ( value > 22.5 && value <= 45+22.5)
    //return "Timur Laut";
    return 1;
  else if ( value > 90-22.5 && value <= 90+22.5)
    //return "Timur";
    return 2;
  else if ( value > 135-22.5 && value <= 135+22.5)
    //return "Tenggara";
    return 3;
  else if ( value > 180-22.5 && value <= 180+22.5)
    //return "Selatan";
    return 4;
  else if ( value > 225-22.5 && value <= 225+22.5)
    //return "Barat Daya";
    return 5;
  else if ( value > 270-22.5 && value <= 270+22.5)
    //return "Barat";
    return 6;
  else if ( value > 315-22.5 && value <= 315+22.5)
    //return "Barat Laut";
    return 7;
  
}
int valuePot = 0, arahAngin = 0;
int readPotensio(){
  valuePot = analogRead(windDir);
  arahAngin = map(valuePot,0,1024,0,360);

  return convertArahAngin(arahAngin);
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(57600);
  Wire.begin();

  // START LORA
  if(!LoRa.begin(433E6)){
    Serial.println("LoRa Failed...");
    while(1);
  } else {
    Serial.println("LoRa starting...");
  }
  Serial.println("BME280 Setup... [ Temperature, Humidity, Pressure ] ");
  setupBME280();
  Serial.println("BME280 Done Setup");
  // BH1750 Setup
  setupBH1750();
  Serial.println("BH1750 Done Setup");
  
  // potensiometer
  setupPotensioMeter();
  i2cdetect();

  // gps
  setupGPS();

  // hall effect
  setupHallEffect();

  // reed switch
  setupReedSwitch();
}

void sendingDataLoRa(String data){
  LoRa.beginPacket();
  LoRa.print(data);
  LoRa.endPacket();
}

void loop() {
  // put your main code here, to run repeatedly:
  
  // temp
  String dataBME = readBME280();
  Serial.println("BME Data" + dataBME);
  
  // lux
  String lux = readBH1750();
  Serial.println("Lux : " + lux);

  // wind
  String windDirection = String(readPotensio());
  Serial.println("Wind Dir : " + windDirection);

  // gps
  String location = readGPS();
  Serial.println("GPS Read : "  + location);

  // hall effect
   String detect = readHallEffect();
   Serial.println("Hall Effect : " + detect);

   // wind & tip
   Serial.println("Wind Count " + String(wind_count));
   Serial.println("Tip Count " + String(count_magnet));

  sendingDataLoRa(dataBME + "," + lux + "," + windDirection + "," + location + "," + String(count_magnet) + "," + String(wind_count));
  //delay(100);

  if(millis()-prevSec>=1000)             //Keep a track of time
  {
    prevSec+=1000;

    updateTime();                      //If 1 minute rolls over then the arrays for windgust and rain are updated
  }

  if(timeSinceReset>(1440+15)) //24h * 60min/h = 1440min + 15 extra mins just in case the Imp triggers the reset 
  {
    resetDay();                          //Reset all the variables that need daily resetting
  }

  smartDelay(100); // must add for GPS data

  if (millis() > 5000 && gps.charsProcessed() < 10)
    Serial.println(F("No GPS data received: check wiring"));
}


// smart delay with milis in GPS
static void smartDelay(unsigned long ms)
{
  unsigned long start = millis();
  do 
  {
    while (ss.available())
      gps.encode(ss.read());
  } while (millis() - start < ms);
}






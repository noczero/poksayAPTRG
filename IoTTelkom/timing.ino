  void updateTime()
  {
    // every one minutes
    if(++seconds > 59)
    {
      seconds = 0;
      Serial.println("Running in one minutes...");
      rain_fall_minute = countRainFall();
      wind_speed_rpm = countWindSpeed(wind_count);
      sendingDataLoRa("minute," + String(rain_fall_minute) + "," + String(wind_speed_rpm)); 
      // every hours
      if(++minutes > 59) {
        minutes = 0;
        Serial.println("Running in one hour...");
      }

      // every ten minutes
      if(++mins_10 > 9) {
        mins_10 = 0;
        Serial.println("Running in ten minutes...");
      }

      //WindGust_10min[mins_10] = 0;                   //Zero out wind gust for this minute
      //rainHour[minutes] = 0;   
      resetRainValue();    
      count_magnet = 0 ;                  //Zero out rainfall for this minute
      wind_count = 0;
      timeSinceReset++;                              //Add one minute to the time since the last midnight reset   
      
    }
  }
  
  //Reset all dailiy variables at midnight
  void resetDay()
  {
    resetRainValue();
     //windgustmph = 0;                               //Reset the daily windgust
    //windgustdir = 0;                               //Reset the daily gust direction
    minutes = 0;                                     //Reset the minute tracker
    seconds = 0;                                     //Reset the second tracker
    prevSec = millis();                              //Reset the variable used to track minutes
    
    timeSinceReset = 0;                              //Reset the emergency midnight reset
  }


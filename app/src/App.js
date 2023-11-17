import { replSend, replRawMode } from "./bluetooth/js/repl.js"
import React from 'react';
import { sendToMonocle } from './comms.js';
import {statusCallback, relayCallback} from './bluetooth/js/main.js';
import {ensureConnected} from './bluetooth/js/main.js';
var response;

const App = () => {
  
  const fetchWeatherAndSendToMonocle = async () => {
    const forecastUrl = "https://api.weather.gov/points/40.1163,-88.2435"; // Replace with your actual URL

    try {
      // Fetch the initial weather data from the API
      const initialResponse = await fetch(forecastUrl);
      if (!initialResponse.ok) {
        throw new Error(`HTTP error! status: ${initialResponse.status}`);
      }
      const initialData = await initialResponse.json();

      // Extract the forecast URL from the initial response
      const detailedForecastUrl = initialData.properties.forecast;
      if (!detailedForecastUrl) {
        throw new Error('Detailed forecast URL not found in the data');
      }

      // Fetch the detailed forecast data
      const detailedResponse = await fetch(detailedForecastUrl);
      if (!detailedResponse.ok) {
        throw new Error(`HTTP error! status: ${detailedResponse.status}`);
      }
      const detailedData = await detailedResponse.json();

      // Format and send the detailed weather data
      const formattedWeather = formatWeatherData(detailedData);
      await replRawMode(true);
      let utf8Encode = new TextEncoder();
      utf8Encode.encode('display.Text(formattedWeather, 90,90,display.RED)');
      response = await replSend(utf8Encode);
      await replRawMode(false);
      
    } catch (error) {
      console.error('Error fetching or processing weather data:', error);
    }
  };
  
  const formatWeatherData = (detailedData) => {
    // You'll need to adjust this function based on the structure of detailedData
    // For example, if it has a 'periods' array like before, you can format it accordingly
    // This is a placeholder logic
    const currentWeather = detailedData.properties.periods[0];
    return `Weather in ${currentWeather.name}: ${currentWeather.temperature} ${currentWeather.temperatureUnit}, ${currentWeather.detailedForecast}`;
  };

  return (
    <div className="App">
      <button onClick={fetchWeatherAndSendToMonocle}>Get Weather and Send to Monocle</button>
    </div>
  );
};

export default App;
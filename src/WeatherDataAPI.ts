// This class provides a static method to fetch weather data from the BrightSky API.
export class WeatherDataAPI {

    // Static method to asynchronously retrieve weather data from the BrightSky API.
    public static async getData() {
        // Get the current date in ISO format (YYYY-MM-DD).
        const currentDate: string = new Date().toISOString().slice(0, 10);
        // Fetch weather data from the BrightSky API for a specific location and date.
        const response = await fetch(`https://api.brightsky.dev/weather?lat=50.93&lon=6.95&date=${currentDate}`);
        // Parse the JSON response from the API to obtain weather data.
        const weatherData = await response.json();
        // Extract the first set of weather data from the API response.
        const firstWeatherData = weatherData.weather[0];

        // Return the first set of weather data.
        return firstWeatherData;
    }


}
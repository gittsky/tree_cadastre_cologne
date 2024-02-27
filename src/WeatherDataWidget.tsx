// Importing necessary components and dependencies
import {
  UiItemsProvider,
  WidgetState,
  StagePanelLocation,
  StagePanelSection,
  Widget,
} from "@itwin/appui-react";
import * as React from "react";
import { WeatherDataAPI } from "./WeatherDataAPI";

// Functional component to display daily weather data for Cologne
function WeatherData() {
  // State to store weather data
  const [weatherData, setWeatherData] = React.useState<any>({});

  // Effect hook to fetch data when the component mounts
  React.useEffect(() => {
    // Async function to fetch weather data from the WeatherDataAPI
    const fetchData = async () => {
      try {
        const cloudData = await WeatherDataAPI.getData();

        // Update the state with the fetched weather data
        setWeatherData(cloudData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Invoke the fetchData function
    fetchData();
  }, []);

  // Map over the weatherData object and create table rows for each key-value pair
  const weatherTable = Object.entries(weatherData).map(([key, value]) => (
    <tr key={key}>
      <th>{JSON.stringify(key)}</th>
      <th>{JSON.stringify(value)}</th>
    </tr>
  ));

  // Render the weather table component
  return (
    <div className="weather-table">
      <h3>Current Weather</h3>
      <table>
        <tbody>{weatherTable}</tbody>
      </table>
    </div>
  );
}

// WeatherProvider class implementing UiItemsProvider
export class WeatherProvider implements UiItemsProvider {
  // Unique identifier for the provider
  public readonly id: string = "WeatherProviderId";

  // Function to provide widgets based on stage and location
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];

    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Current Weather",
        label: "Current Weather",
        defaultState: WidgetState.Open,
        content: <WeatherData />,
      });
    }

    return widgets;
  }
}

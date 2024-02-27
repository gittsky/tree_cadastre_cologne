// Importing necessary components and dependencies
import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  Widget,
  WidgetState,
  useActiveIModelConnection,
} from "@itwin/appui-react";

import { TimeSeries } from "pondjs";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  //@ts-ignore
} from "react-timeseries-charts";

import React from "react";

// Functional component for the SensorWidget
export function SensorWidget() {
  // State hooks to manage component state
  const [elementName, setElementName] = React.useState("");
  const [elementId, setElementId] = React.useState("0x20000003127");

  const [timeseries, setTimeseries] = React.useState<TimeSeries | null>(null);

  // Get the active iModel connection using a custom hook
  const iModelConnection = useActiveIModelConnection();

  // Effect hook to subscribe to selection changes in the iModelConnection
  React.useEffect(() => {
    // Add a listener for selection changes
    iModelConnection?.selectionSet.onChanged.addListener((e) => {
      // Retrieve properties of the selected element
      e.set.elements.forEach((element) => {
        iModelConnection?.elements.getProps(element).then((e) => {
          console.log("Props: ", e);
          const obj: any = e[0];
          // Check if the properties contain specific data and update state accordingly
          if (obj.deutscherN && obj.id) {
            setElementId(obj.id);
            setElementName(obj.deutscherN);
          }
          const ele: any = e[0];
          if (ele.name && ele.id) {
            setElementId(ele.id);
            setElementName(ele.name);
          }
        });
      });
    });
    // Cleanup: Remove the listener when the component unmounts
    return () => {
      iModelConnection?.selectionSet.onChanged.removeListener(() => {});
    };
  }, []);

  // Effect hook to fetch sensor data when the elementId changes
  React.useEffect(() => {
    // Check if elementId is empty
    if (elementId === "") {
      return;
    } else {
      // Fetch sensor data from an endpoint based on the elementId
      const requestOptions: RequestInit = {
        method: "GET",
        redirect: "follow",
      };
      if (!process.env.IMJS_SENSOR_ENDPOINT) return;
      fetch(
        process.env.IMJS_SENSOR_ENDPOINT +
          "/project/project_1/sensor/" +
          elementId,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          // Process fetched data and create a TimeSeries
          const datapoints = result["data"];
          const tempTimeseries = new TimeSeries({
            name: "sensor data",
            columns: ["index", "value"],
            points: datapoints,
          });
          // Update the state with the new TimeSeries
          setTimeseries(tempTimeseries);
        })
        .catch((error) => console.log("error", error));
    }
  }, [elementId]);

  // <div>Tree Species: {elementName}</div>
  // <div>iModel Id: {elementId}</div>

  // Render the component with a conditional check for timeseries data
  return (
    <div>
      {timeseries === null ? (
        <></>
      ) : (
        <ChartContainer
          timeRange={timeseries.timerange()}
          format="%b '%y"
          width={400}
        >
          <ChartRow height="150">
            <YAxis
              id="value"
              label="Value"
              min={timeseries.min("value", () => {})}
              max={timeseries.max("value")}
              width="45"
            />
            <Charts>
              <LineChart axis="value" series={timeseries} />
            </Charts>
          </ChartRow>
        </ChartContainer>
      )}
    </div>
  );
}

// Class implementing UiItemsProvider to provide widget
export class SensorWidgetUiProvider implements UiItemsProvider {
  // Unique id for the provider
  public readonly id: string = "SensorWidgetUiProvider";

  // Method to provide widgets based on stage and location
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];

    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Soil Moisture",
        label: "Soil Moisture",
        defaultState: WidgetState.Open,
        content: <SensorWidget />,
      });
    }
    return widgets;
  }
}

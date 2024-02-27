// Importing necessary components and dependencies
import {
  DecorateContext,
  Decorator,
  IModelConnection,
  Marker,
  ScreenViewport,
} from "@itwin/core-frontend";
import { QueryRowFormat } from "@itwin/core-common";
import { AlertMarker } from "../markers/AlertMarker";
// import { WeatherDataAPI } from "../../WeatherDataAPI";
import { UiFramework } from "@itwin/appui-react";

// Define a class named AlertDecorator that implements the Decorator class
export class AlertDecorator implements Decorator {
  // Declare class properties
  public iModel: IModelConnection; // Represents the iModel connection
  private _markerSet: Marker[]; // Array to store markers
  public EcId: string; // Identifier for the alert

  // Constructor for the AlertDecorator class
  constructor(vp: ScreenViewport, EcId: string) {
    this.iModel = vp.iModel; // Set iModel connection from the viewport
    this._markerSet = []; // Initialize an empty array for markers
    this.EcId = EcId; // Set the alert identifier
    this.addMarkers(); // Call a method to add markers
  }

  // Static method to asynchronously retrieve tree data based on a given name
  public static async getTreeData(name: string) {
    // ECSQL query to fetch specific properties from the iModel
    const query = `SELECT ECInstanceId,
                          DeutscherN,
                          Gattung,
                          Art,
                          Sorte,
                          Origin
                          FROM GisDynamic.Bestand_Einzelb__x00E4__ume
                          WHERE ECInstanceId='${name}'`;

    // Use UiFramework to get an iModel connection and execute the query
    const results = UiFramework.getIModelConnection()!.createQueryReader(
      query,
      undefined,
      {
        rowFormat: QueryRowFormat.UseJsPropertyNames,
      }
    );

    const values = []; // Array to store the retrieved data

    // Iterate over the query results and extract properties
    for await (const row of results) {
      const { ECInstanceId, DeutscherN, Gattung, Art, Sorte, Origin } = row;
      values.push({ ECInstanceId, DeutscherN, Gattung, Art, Sorte, Origin });
    }

    return values; // Return the array of retrieved data
  }

  // Private method to add markers based on retrieved data
  private async addMarkers() {
    console.log("addMarkers called");

    // Retrieve tree data based on the provided alert identifier
    const values = await AlertDecorator.getTreeData(this.EcId);

    values.forEach((value: any) => {
      // Create an AlertMarker instance using retrieved data
      const alertMarker = new AlertMarker(
        { x: value.Origin.x, y: value.Origin.y, z: value.Origin.z },
        { x: 20, y: 20 },
        { x: 20, y: 20 },
        value.ECInstanceId,
        value.DeutscherN,
        value.Gattung,
        value.Art,
        value.Sorte
      );

      this._markerSet.push(alertMarker); // Add the created marker to the marker set
    });
  }

  // Implementation of the decorate method from the Decorator class
  public decorate(context: DecorateContext): void {
    console.log("decorate method called");

    // Iterate over the marker set and add decorations to the context
    this._markerSet.forEach((marker) => {
      marker.addDecoration(context);
    });
  }
}

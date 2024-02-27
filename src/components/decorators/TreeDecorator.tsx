// Importing necessary components and dependencies
import {
  DecorateContext,
  Decorator,
  IModelConnection,
  Marker,
  ScreenViewport,
} from "@itwin/core-frontend";
import { QueryRowFormat } from "@itwin/core-common";
import { TreeMarker } from "../markers/TreeMarker";
import { UiFramework } from "@itwin/appui-react";

// Define and export the TreeDecorator class, implementing the Decorator interface
export class TreeDecorator implements Decorator {
  // Declare class properties
  public iModel: IModelConnection;
  private _markerSet: Marker[];
  public treeName: string;

  // Constructor to initialize the TreeDecorator instance with a ScreenViewport and a treeName
  constructor(vp: ScreenViewport, treeName: string) {
    // Initialize iModel and _markerSet properties
    this.iModel = vp.iModel;
    this._markerSet = [];
    this.treeName = treeName;
    // Call the method to add markers based on tree data
    this.addMarkers();
  }

  // Static method to asynchronously retrieve tree data based on the provided name
  public static async getTreeData(name: string) {
    // Define the SQL query to fetch tree data from the specified iModel
    const query = `SELECT ECInstanceId,
                          DeutscherN,
                          Gattung,
                          Art,
                          Sorte,
                          Origin
                          FROM GisDynamic.Bestand_Einzelb__x00E4__ume
                          WHERE DeutscherN='${name}'`;

    // Execute the query and retrieve the results with specified row format
    const results = UiFramework.getIModelConnection()!.createQueryReader(
      query,
      undefined,
      {
        rowFormat: QueryRowFormat.UseJsPropertyNames,
      }
    );
    const values = [];

    // Iterate over the query results and extract relevant properties
    for await (const row of results) {
      const { ECInstanceId, DeutscherN, Gattung, Art, Sorte, Origin } = row;
      values.push({ ECInstanceId, DeutscherN, Gattung, Art, Sorte, Origin });
    }

    // Return the collected values
    return values;
  }

  // Private method to add markers based on tree data
  private async addMarkers() {
    console.log("addMarkers called");

    // Retrieve tree data based on the provided treeName
    const values = await TreeDecorator.getTreeData(this.treeName);

    // Iterate over the retrieved values and create TreeMarker instances
    values.forEach((value: any) => {
      const treeMarker = new TreeMarker(
        { x: value.Origin.x, y: value.Origin.y, z: value.Origin.z },
        { x: 20, y: 20 },
        { x: 20, y: 20 },
        value.ECInstanceId,
        value.DeutscherN,
        value.Gattung,
        value.Art,
        value.Sorte
      );
      
      // Add the created TreeMarker to the marker set
      this._markerSet.push(treeMarker);
    });
  }

  // Implement the decorate method required by the Decorator interface
  public decorate(context: DecorateContext): void {
    console.log("decorate method called");

    // Iterate over the marker set and add decorations to the context
    this._markerSet.forEach((marker) => {
      marker.addDecoration(context);
    });
  }
}

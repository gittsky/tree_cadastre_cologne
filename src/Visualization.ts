// Importing necessary components and dependencies
import { QueryRowFormat } from "@itwin/core-common";
import { IModelConnection, ScreenViewport } from "@itwin/core-frontend";
import { EmphasizeElements } from "@itwin/core-frontend";


// Define a class named Visualization
export class Visualization {

  // Define a static method named showTrees for displaying trees in a ScreenViewport
  public static showTrees = async (vp: ScreenViewport, Name: string, toggle: boolean) => {

    // Get the element IDs corresponding to the specified tree name
    const elementIds = await Visualization.getElementIds(vp.iModel, Name);
    // Create or get an EmphasizeElements instance for the specified viewport
    const emph = EmphasizeElements.getOrCreate(vp);
    // If the toggle parameter is true, isolate the elements in the viewport
    if (toggle == true){
      emph.isolateElements(elementIds, vp);
    }
  }


  // Define a private static method named getElementIds for retrieving element IDs based on a tree name
  private static getElementIds = async (iModel: IModelConnection, treeName: string) => {

    // ECSQL query to select element IDs based on the tree name
    const query =
    `SELECT ECInstanceId FROM GisDynamic.Bestand_Einzelb__x00E4__ume WHERE DeutscherN="${treeName}"`;

    // Execute the query using iModel's queryReader method with a specified row format
    const result = iModel.createQueryReader(query, undefined, { rowFormat: QueryRowFormat.UseJsPropertyNames });
    // Initialize an array to store retrieved element IDs
    const elementIds = [];

    // Iterate over the query result and populate the elementIds array
    for await (const row of result) {
      elementIds.push(row.id);
    }

    // Log the retrieved element IDs to the console for debugging purposes
    console.log("Element IDs:", elementIds);

    // Return the array of element IDs
    return elementIds;
  }
}
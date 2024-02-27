// Importing necessary components and dependencies
import { XAndY, XYAndZ } from "@itwin/core-geometry";
import {
  Marker,
  BeButtonEvent,
  IModelApp,
  NotifyMessageDetails,
  OutputMessagePriority,
  StandardViewId,
} from "@itwin/core-frontend";

// Define a custom class 'TreeMarker' that extends the 'Marker' class
export class TreeMarker extends Marker {
  // Private member variables to store information about the tree
  private _ECInstanceId: string;
  private _DeutscherN: string;
  private _ScientificName: string;
  private _Position: XAndY;

  // Constructor to initialize the TreeMarker object with specified parameters
  constructor(
    location: XYAndZ,
    size: XAndY,
    position: XAndY,
    ECInstanceId: string,
    DeutscherN: string,
    Gattung: string,
    Art: string,
    Sorte: string
  ) {
    // Call the constructor of the parent 'Marker' class
    super(location, size);

    // Initialize member variables with provided values
    this._Position = position;
    this._ECInstanceId = ECInstanceId;
    this._DeutscherN = DeutscherN;
    this._ScientificName = Gattung + " " + Art + " " + Sorte;

    // Set the image URL for the marker
    this.setImageUrl(`./tree.png`);

    // Create a subtitle element and set its HTML content
    const subTitle = document.createElement("div");
    subTitle.className = "weather-table";
    subTitle.innerHTML = `
      <h3>${this._DeutscherN} <br>${this._ScientificName}</h3>
    `;

    // Set the subtitle as the title of the marker
    this.title = subTitle;
  }

  // Event handler for mouse button clicks on the marker
  public onMouseButton(_ev: BeButtonEvent): boolean {
    // Check if the mouse button is pressed down
    if (!_ev.isDown) return true;

    // Display a notification message when the tree marker is clicked
    IModelApp.notifications.outputMessage(
      new NotifyMessageDetails(
        OutputMessagePriority.Info,
        "Tree " + this._DeutscherN + " was clicked on"
      )
    );

    // Zoom to the elements associated with the tree marker in the selected view
    IModelApp.viewManager.selectedView!.zoomToElements(this._ECInstanceId, {
      animateFrustumChange: true,
      minimumDimension: 50,
      standardViewId: StandardViewId.Top,
    });

    // Indicate that the event has been handled
    return true;
  }
}

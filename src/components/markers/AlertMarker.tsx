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

// import { useIssueStore } from "../../stores/main_store";
// const { issues, addIssues } = useIssueStore();
// const issue = issues.map(issue);

// Class definition for AlertMarker extending Marker class
export class AlertMarker extends Marker {
  private _ECInstanceId: string;
  private _DeutscherN: string;
  private _ScientificName: string;
  private _Position: XAndY;

  // Constructor for AlertMarker class
  constructor(
    location: XYAndZ,
    size: XAndY,
    position: XAndY,
    ECInstanceId: string,
    DeutscherN: string,
    Gattung: string,
    Art: string,
    Sorte: string
    // cloudData: any
  ) {
    super(location, size);

    // Initialize class properties with provided values
    this._Position = position;
    this._ECInstanceId = ECInstanceId;
    this._DeutscherN = DeutscherN;
    this._ScientificName = Gattung + " " + Art + " " + Sorte;

    // Set the image URL for the marker
    this.setImageUrl(`./treealert.png`);

    // Create and set the title of the marker using a div element
    const subTitle = document.createElement("div");
    subTitle.className = "weather-table";
    subTitle.innerHTML = `
     <h3>${this._DeutscherN} <br>${this._ECInstanceId}</h3>
    `;
    this.title = subTitle;
  }

  // Event handler for mouse button click on the marker
  public onMouseButton(_ev: BeButtonEvent): boolean {
    if (!_ev.isDown) return true;

    // Display a notification message when the marker is clicked
    IModelApp.notifications.outputMessage(
      new NotifyMessageDetails(
        OutputMessagePriority.Info,
        "Issue for " + this._DeutscherN + " was clicked on"
      )
    );

    // Zoom to the elements associated with the marker in the selected view
    IModelApp.viewManager.selectedView!.zoomToElements(this._ECInstanceId, {
      animateFrustumChange: true,
      minimumDimension: 50,
      standardViewId: StandardViewId.Top,
    });
    return true;
  }
}

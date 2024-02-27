/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// adapted, based on Bentley Systems Sample

// Importing necessary components and dependencies
import React, { useState, useEffect } from "react";
import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  useActiveViewport,
  Widget,
  WidgetState,
  useActiveIModelConnection,
} from "@itwin/appui-react";
import { imageElementFromUrl, IModelApp } from "@itwin/core-frontend";
import { Point3d } from "@itwin/core-geometry";
import {
  Button,
  Fieldset,
  RadioTile,
  RadioTileGroup,
  ToggleSwitch,
  Flex,
  Input,
  InputGroup,
  Label,
  FileUpload,
  FileUploadCard,
} from "@itwin/itwinui-react";
import {
  MarkerData,
  MarkerPinDecorator,
} from "./common/marker-pin/MarkerPinDecorator";
import { PlaceMarkerTool } from "./common/marker-pin/PlaceMarkerTool";
import { PopupMenu } from "./common/marker-pin/PopupMenu";
import MarkerPinApi from "./MarkerPinApi";
import "./MarkerPin.scss";
import { SvgCheckmarkSmall } from "@itwin/itwinui-icons-react";
import { useIssueStore } from "./stores/main_store";
import { AlertDecorator } from "./components/decorators/AlertDecorator";
import { useNameStore, useVisibleStore } from "./stores/main_store";

// Define the structure of the manual pin selection
interface ManualPinSelection {
  name: string;
  image: string;
}

/** A static array of pin images. */
const manualPinSelections: ManualPinSelection[] = [
  { image: "pin_google_maps.svg", name: "Google Pin" },
  { image: "pin_celery.svg", name: "Celery Pin" },
  { image: "pin_poloblue.svg", name: "Polo blue Pin" },
];

// Define the MarkerPinWidget functional component
const MarkerPinWidget = () => {
  // State variables for widget functionality
  const [files, setFiles] = React.useState<Array<File>>([]);
  const viewport = useActiveViewport();
  const [imagesLoadedState, setImagesLoadedState] =
    React.useState<boolean>(false);
  const [showDecoratorState, setShowDecoratorState] =
    React.useState<boolean>(true);
  const [manualPinState, setManualPinState] =
    React.useState<ManualPinSelection>(manualPinSelections[0]);
  const [markersDataState, setMarkersDataState] = React.useState<MarkerData[]>(
    []
  );
  const [markerPinDecorator] = React.useState<MarkerPinDecorator>(() => {
    return MarkerPinApi.setupDecorator();
  });

  // State variables for tree information
  const [treeName, setTreeName] = React.useState("");
  const [treeId, setTreeId] = React.useState("0x20000003127");
  const [trunk, setTrunk] = React.useState("");
  const [crown, setCrown] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [treeAge, setTreeAge] = React.useState("");
  const [newIssue, setNewIssue] = React.useState<string>("");
  const iModelConnection = useActiveIModelConnection();

  // State variables for issues
  const [currentIssues, setCurrentIssues] = React.useState<string[]>([]);
  const [showAlertMarkers, setShowAlertMarkers] = React.useState<boolean>(true);
  const { issues, addIssues } = useIssueStore();
  const { setVisible } = useVisibleStore();

  // Toggle visibility of issue markers
  function handleToggleMarkers() {
    setVisible(!showAlertMarkers);
    setShowAlertMarkers(!showAlertMarkers);
    let test = IModelApp.viewManager.decorators;
    test.forEach((decorator) => {
      if (decorator instanceof AlertDecorator) {
        IModelApp.viewManager.dropDecorator(decorator);
      }
    });

    if (showAlertMarkers === true) {
      const viewport = IModelApp.viewManager.getFirstOpenView();

      if (!viewport) return;
      issues.map((issue: any) => {
        IModelApp.viewManager.addDecorator(
          new AlertDecorator(viewport, issue.id.toString())
        );
      });
    }
  }

  // useEffect to listen for selection changes in the iModel
  React.useEffect(() => {
    iModelConnection?.selectionSet.onChanged.addListener((e) => {
      e.set.elements.forEach((element) => {
        // console.log("Element: ", element);
        iModelConnection?.elements.getProps(element).then((e) => {
          console.log("Props: ", e);
          const obj: any = e[0];
          if (obj.deutscherN && obj.id) {
            setTreeId(obj.id);
            setTreeName(obj.deutscherN);
            setTrunk(obj.sTAMMBIS);
            setCrown(obj.kRONE);
            setHeight(obj.h_HE);
            setTreeAge(obj.alterSchae);

            issues.forEach((issue) => {
              if (issue.id === obj.id) setCurrentIssues(issue.issue);
            });
          }
        });
      });
    });
    return () => {
      iModelConnection?.selectionSet.onChanged.removeListener(() => {});
    };
  }, []);

  /** Load the images on widget startup */
  useEffect(() => {
    MarkerPinApi._images = new Map();
    const p1 = imageElementFromUrl("pin_google_maps.svg").then((image) => {
      MarkerPinApi._images.set("pin_google_maps.svg", image);
    });
    const p2 = imageElementFromUrl("pin_celery.svg").then((image) => {
      MarkerPinApi._images.set("pin_celery.svg", image);
    });
    const p3 = imageElementFromUrl("pin_poloblue.svg").then((image) => {
      MarkerPinApi._images.set("pin_poloblue.svg", image);
    });

    Promise.all([p1, p2, p3])
      .then(() => setImagesLoadedState(true))
      .catch((error) => console.error(error));
  }, []);

  /** Initialize Decorator */
  useEffect(() => {
    MarkerPinApi.enableDecorations(markerPinDecorator);
    return () => {
      MarkerPinApi.disableDecorations(markerPinDecorator);
    };
  }, [markerPinDecorator]);

  /** When the images are loaded, initialize the MarkerPin */
  useEffect(() => {
    if (!imagesLoadedState) return;

    void IModelApp.localization.registerNamespace("marker-pin-i18n-namespace");
    PlaceMarkerTool.register("marker-pin-i18n-namespace");
    MarkerPinApi.setMarkersData(markerPinDecorator, markersDataState);

    if (viewport) viewInit();
    else IModelApp.viewManager.onViewOpen.addOnce(() => viewInit());

    return () => {
      IModelApp.localization.unregisterNamespace("marker-pin-i18n-namespace");
      IModelApp.tools.unRegister(PlaceMarkerTool.toolId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesLoadedState]);

  useEffect(() => {
    if (showDecoratorState) MarkerPinApi.enableDecorations(markerPinDecorator);
    else MarkerPinApi.disableDecorations(markerPinDecorator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDecoratorState]);

  useEffect(() => {
    MarkerPinApi.setMarkersData(markerPinDecorator, markersDataState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markersDataState]);

  const viewInit = () => {
    if (!viewport) return;
  };

  /** This callback will be executed by the PlaceMarkerTool when it is time to create a new marker */
  const _manuallyAddMarker = (point: Point3d) => {
    MarkerPinApi.addMarkerPoint(
      markerPinDecorator,
      point,
      MarkerPinApi._images.get(manualPinState.image)!
    );
  };

  /** This callback will be executed when the user clicks the UI button.  It will start the tool which
   * handles further user input.
   */
  const _onStartPlaceMarkerTool = () => {
    void IModelApp.tools.run(PlaceMarkerTool.toolId, _manuallyAddMarker);
  };

  // create the widget and include the previously defined functionality
  return (
    <div className="sample-options">
      <div className="sample-grid">
        <Fieldset legend="Set Marker" className="manual-placement">
          <RadioTileGroup>
            {manualPinSelections.map((pin, index) => (
              <RadioTile
                key={index}
                icon={<img src={pin.image} alt="pin symbol" />}
                checked={manualPinState.name === pin.name}
                onChange={() => setManualPinState(pin)}
              />
            ))}
          </RadioTileGroup>
          <Button
            styleType="default"
            size="small"
            className="manual-placement-btn"
            onClick={_onStartPlaceMarkerTool}
            title="Click here and then click the view to place a new marker"
          >
            Click To Place Marker
          </Button>
        </Fieldset>
        <ToggleSwitch
          className="show-markers"
          label="Show markers"
          labelPosition="left"
          checked={showDecoratorState}
          onChange={() => setShowDecoratorState(!showDecoratorState)}
        />

        <Fieldset
          legend="Specify A Problem"
          style={{ display: "flex", flexDirection: "column", gap: 11 }}
        >
          <>
            <Input
              onChange={(e) => setNewIssue(e.target.value)}
              placeholder="Enter Issue"
              size="large"
            />
          </>
          <FileUpload
            onFileDropped={(files) => {
              const fileArray = Array.from(files);
              setFiles(fileArray);
            }}
          >
            <FileUploadCard
              files={files}
              onFilesChange={(files) => setFiles(files)}
            />
          </FileUpload>
          <Button
            onClick={() => {
              addIssues({ id: treeId, issue: [...currentIssues, newIssue] });
            }}
            size="small"
            styleType="cta"
            endIcon={<SvgCheckmarkSmall />}
          >
            Click to update issues
          </Button>
        </Fieldset>
        {/* <InputGroup>
          <Flex flexDirection="column" alignItems="flex-start">
            <ToggleSwitch
              label="Show all issues"
              labelPosition="left"
              checked={!showAlertMarkers}
              onChange={handleToggleMarkers}
            />
          </Flex>
        </InputGroup> */}
        <Label>
          {issues
            .filter((issue) => issue.id === treeId) // Filter issues by current treeId
            .map((filteredIssue) => (
              <div key={filteredIssue.id}>
                Issue {issues.indexOf(filteredIssue) + 1} for tree{" "}
                {filteredIssue.id}: {filteredIssue.issue}
              </div>
            ))}
        </Label>

        {/* <Label>
          {issues.map((issue) => (
            <div key={issue.id}>
              Issue {issues.indexOf(issue) + 1} for tree {issue.id}:{" "}
              {issue.issue}
            </div>
          ))}
        </Label> */}

        <PopupMenu canvas={viewport?.canvas} />
      </div>
    </div>
  );
};

// Define a new UIItemsProvider
export class MarkerPinWidgetProvider implements UiItemsProvider {
  public readonly id: string = "MarkerPinWidgetProvider";

  // Provide the MarkerPinWidget as a widget in the specified location
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "MarkerPinWidget",
        label: "Set Issue",
        defaultState: WidgetState.Open,
        content: <MarkerPinWidget />,
      });
    }
    return widgets;
  }
}

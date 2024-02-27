/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

// Importing necessary components and dependencies
import "./App.scss";
import type { ScreenViewport } from "@itwin/core-frontend";
import {
  FitViewTool,
  IModelApp,
  StandardViewId,
  IModelConnection,
  FeatureSymbology,
} from "@itwin/core-frontend";
import { FillCentered } from "@itwin/core-react";
import { ProgressLinear } from "@itwin/itwinui-react";
import {
  MeasurementActionToolbar,
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import {
  AncestorsNavigationControls,
  CopyPropertyTextContextMenuItem,
  PropertyGridManager,
  PropertyGridUiItemsProvider,
  ShowHideNullValuesSettingsMenuItem,
} from "@itwin/property-grid-react";
import {
  TreeWidget,
  TreeWidgetUiItemsProvider,
} from "@itwin/tree-widget-react";
import {
  useAccessToken,
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerPerformance,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Auth } from "./Auth";
import { history } from "./history";

// for sensor data
// import { SensorWidgetUiProvider } from "./SensorWidget";

// for properties
import { PropertiesProvider } from "./PropertiesWidget";

// for Visibility
import { VisibilityProvider } from "./VisibilityWidget";

// for bgMapWidget
//import { BgMapWidgetProvider } from "./BgMapWidget";
import { BackgroundMapWidgetProvider } from "./BgMapWidget";

import { MapLayersUI } from "@itwin/map-layers";

// uncomment for bgMapOSM
// import { BaseMapLayerSettings } from "@itwin/core-common";

import { MarkerPinWidgetProvider } from "./MarkerPinWidget";

import { WeatherProvider } from "./WeatherDataWidget";


// In the following the App is being built, i.e. all components are merged together into a previously empty app.
const App: React.FC = () => {
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID);
  const [iTwinId, setITwinId] = useState(process.env.IMJS_ITWIN_ID);
  const [changesetId, setChangesetId] = useState(
    process.env.IMJS_AUTH_CLIENT_CHANGESET_ID
  );

  const [BingMapsKey] = useState(process.env.IMJS_BING_MAPS_KEY ?? "");

  const initialize = useCallback(async () => {
    try {
      await MapLayersUI.initialize({});
    } catch {}
  }, []);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const accessToken = useAccessToken();

  const authClient = Auth.getClient();

  const login = useCallback(async () => {
    try {
      await authClient.signInSilent();
    } catch {
      await authClient.signIn();
    }
  }, [authClient]);

  useEffect(() => {
    void login();
  }, [login]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iTwinId")) {
      setITwinId(urlParams.get("iTwinId") as string);
    }
    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    }
    if (urlParams.has("changesetId")) {
      setChangesetId(urlParams.get("changesetId") as string);
    }
  }, []);

  useEffect(() => {
    let url = `viewer?iTwinId=${iTwinId}`;

    if (iModelId) {
      url = `${url}&iModelId=${iModelId}`;
    }

    if (changesetId) {
      url = `${url}&changesetId=${changesetId}`;
    }
    history.push(url);
  }, [iTwinId, iModelId, changesetId]);

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    // default execute the fitview tool and use the iso standard view after tile trees are loaded

    // Uncomment to create an initial OSM background map
    // const settings = BaseMapLayerSettings.fromJSON({
    //   formatId: "TileURL",
    //   url: "https://b.tile.openstreetmap.org/{level}/{column}/{row}.png",
    //   name: "openstreetmap",
    // });

    // viewPort.view.displayStyle.backgroundMapBase = settings;

    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            ViewerPerformance.addMark("TilesLoaded");
            ViewerPerformance.addMeasure(
              "TileTreesLoaded",
              "ViewerStarting",
              "TilesLoaded"
            );
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          // after 20 seconds, stop waiting and fit the view
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };

    tileTreesLoaded().finally(() => {
      void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Iso);
    });
  }, []);

  const viewCreatorOptions = useMemo(
    () => ({ viewportConfigurer: viewConfiguration, skyboxOn: true }),
    [viewConfiguration]
  );

  const onIModelAppInit = useCallback(async () => {
    // iModel now initialized
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();
    MeasurementActionToolbar.setDefaultActionProvider();
  }, []);

  const onIModelConnected = (_imodel: IModelConnection) => {
    IModelApp.viewManager.onViewOpen.addOnce((vp: ScreenViewport) => {
      // const viewStyle: DisplayStyleSettingsProps = {
      //   viewflags: {
      //     visEdges: false,
      //     shadows: true,
      //   },
      // };
      // vp.overrideDisplayStyle(viewStyle);
    });
  };

  return (
    <div className="viewer-container">
      {!accessToken && (
        <FillCentered>
          <div className="signin-content">
            <ProgressLinear indeterminate={true} labels={["Signing in..."]} />
          </div>
        </FillCentered>
      )}

      <Viewer
        iTwinId={iTwinId ?? ""}
        iModelId={iModelId ?? ""}
        changeSetId={changesetId}
        authClient={authClient}
        viewCreatorOptions={viewCreatorOptions}
        enablePerformanceMonitors={true} // see description in the README (https://www.npmjs.com/package/@itwin/web-viewer-react)
        onIModelAppInit={onIModelAppInit}
        onIModelConnected={onIModelConnected}
        mapLayerOptions={{ BingMaps: { key: "key", value: BingMapsKey } }}
        // Here the different UI providers are added
        uiProviders={[
          //new BgMapWidgetProvider(),
          new BackgroundMapWidgetProvider(),
          // new SensorWidgetUiProvider(),
          new PropertiesProvider(),
          new VisibilityProvider(),
          new MarkerPinWidgetProvider(),
          new WeatherProvider(),
          new ViewerNavigationToolsProvider(),
          new ViewerContentToolsProvider({
            vertical: {
              measureGroup: false,
            },
          }),
          new ViewerStatusbarItemsProvider(),
          new TreeWidgetUiItemsProvider(),
          // this implements the property pop up (possible to set up a new uiitemsprovider)
          // uncomment if you want to have a pop up widget each time you click on a tree point
          // new PropertyGridUiItemsProvider({
          //   propertyGridProps: {
          //     autoExpandChildCategories: true,
          //     ancestorsNavigationControls: (props) => (
          //       <AncestorsNavigationControls {...props} />
          //     ),
          //     contextMenuItems: [
          //       (props) => <CopyPropertyTextContextMenuItem {...props} />,
          //     ],
          //     settingsMenuItems: [
          //       (props) => (
          //         <ShowHideNullValuesSettingsMenuItem
          //           {...props}
          //           persist={true}
          //         />
          //       ),
          //     ],
          //   },
          // }),
          new MeasureToolsUiItemsProvider(),
        ]}
      />
    </div>
  );
};

export default App;

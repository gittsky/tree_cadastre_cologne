/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
// adapted, based on Bentley Systems Sample

// Importing necessary components and dependencies
import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  useActiveViewport,
  Widget,
  WidgetState,
} from "@itwin/appui-react";
import { BackgroundMapType, BaseMapLayerSettings } from "@itwin/core-common";
import { ViewState3d } from "@itwin/core-frontend";
import { Select, SelectOption } from "@itwin/itwinui-react";
import React, { FunctionComponent, useEffect, useState } from "react";

import "./BackgroundMap.scss";

// create the interface for the widget
const BackgroundMapWidget: FunctionComponent = () => {
  const viewport = useActiveViewport();

  const bgMapOptions = React.useRef<SelectOption<string>[]>([
    { value: "bing", label: "Bing Maps" },
    { value: "google", label: "Google Maps" },
    { value: "openstreetmap", label: "Open Street Map" },
    { value: "nrwdop", label: "NRW DOP Colorinfrarot" },
  ]);

  const bgMapTypeOptions = React.useRef<SelectOption<string>[]>([
    {
      value: BackgroundMapType[Number(BackgroundMapType.Street)],
      label: "Streets",
    },
    {
      value: BackgroundMapType[Number(BackgroundMapType.Hybrid)],
      label: "Aerial with labels",
    },
    {
      value: BackgroundMapType[Number(BackgroundMapType.Aerial)],
      label: "Aerial",
    },
  ]);

  // Extract the background map UI key from the active display style
  const getBgMapKeyFromDisplayStyle = () => {
    const displayStyle = (viewport!.view as ViewState3d).getDisplayStyle3d();
    if (displayStyle.backgroundMapBase instanceof BaseMapLayerSettings) {
      if (displayStyle.backgroundMapBase.provider?.name === "BingProvider") {
        return "bing";
      } else if (displayStyle.backgroundMapBase.formatId === "TileURL") {
        return displayStyle.backgroundMapBase.name;
      }
    }
    return "";
  };

  // Extract the background map 'style' key from the active display style
  const getBgMapTypeKeyFromDisplayStyle = () => {
    const displayStyle = (viewport!.view as ViewState3d).getDisplayStyle3d();
    if (displayStyle.backgroundMapBase instanceof BaseMapLayerSettings) {
      if (displayStyle.backgroundMapBase.provider?.name === "BingProvider") {
        return BackgroundMapType[
          Number(displayStyle.backgroundMapBase.provider.type.toString())
        ];
      }
    }
    return BackgroundMapType[Number(BackgroundMapType.Hybrid)];
  };

  // Indicates whether or not the background map provider supports various styles. (i.e. aerial photography, streets, etc.)
  const bgMapTypeSupported = () => {
    const displayStyle = (viewport!.view as ViewState3d).getDisplayStyle3d();
    if (displayStyle.backgroundMapBase instanceof BaseMapLayerSettings) {
      if (displayStyle.backgroundMapBase.provider?.name === "BingProvider") {
        return true;
      }
    }
    return false;
  };

  const [bgMap, setBgMap] = useState(() => getBgMapKeyFromDisplayStyle());
  const [bgMapType, setBgMapType] = useState(() =>
    getBgMapTypeKeyFromDisplayStyle()
  );
  const [bgMapSupportsType, setBgMapSupportsType] = useState(() =>
    bgMapTypeSupported()
  );

  useEffect(() => {
    const displayStyle = (viewport!.view as ViewState3d).getDisplayStyle3d();
    const type = BackgroundMapType[bgMapType as keyof typeof BackgroundMapType];

    // Create the proper BackgroundMap/BaseMap definition based on the active 'bgMap'
    // selected in the UI
    if (bgMap === "bing") {
      displayStyle.changeBackgroundMapProvider({ name: "BingProvider", type });
      setBgMapSupportsType(true);
    } else if (bgMap === "openstreetmap") {
      setBgMapSupportsType(false);
      displayStyle.backgroundMapBase = BaseMapLayerSettings.fromJSON({
        formatId: "TileURL",
        url: "https://b.tile.openstreetmap.org/{level}/{column}/{row}.png",
        name: "openstreetmap",
      });
    } else if (bgMap === "google") {
      let googleLayer = "y"; // default to hybrid
      switch (bgMapType) {
        case BackgroundMapType[Number(BackgroundMapType.Aerial)]:
          googleLayer = "s";
          break;
        case BackgroundMapType[Number(BackgroundMapType.Street)]:
          googleLayer = "m";
          break;
      }
      setBgMapSupportsType(true);
      displayStyle.backgroundMapBase = BaseMapLayerSettings.fromJSON({
        formatId: "TileURL",
        url: `https://mt0.google.com/vt/lyrs=${googleLayer}&hl=en&x={column}&y={row}&z={level}`,
        name: "google",
      });
    } else if (bgMap === "nrwdop") {
      setBgMapSupportsType(false);
      displayStyle.backgroundMapBase = BaseMapLayerSettings.fromJSON({
        formatId: "WMS",
        url: `https://www.wms.nrw.de/geobasis/wms_nw_dop`,
        name: "WMS NW DOP",
        subLayers: [{ id: 0, name: "nw_dop_cir", visible: true }], // WMTS requires sublayers definition to be provided
      });
      // Bei Colorinfrarot-Darstellungen treten Bereiche mit Vegetation in Rottönen hervor,
      //da der Pflanzenfarbstoff Chlorophyll das Nahe Infrarot (NIR) besonders stark reflektiert.
      //Die Abgrenzung zu vegetationsfreien Flächen wie versiegelten Böden, Böden ohne Bewuchs oder Gewässern in Blautönen ist sehr deutlich.
      // Diese Eigenschaften können die Identifizierung und geometrische Auswertung speziell in den Themenbereichen
      //Versiegelung, Forst- und Landwirtschaft sowie Umwelt unterstützen.
    }
  }, [viewport, bgMap, bgMapType]);

  //////////////////////
  // Component rendering
  return (
    <div className={"sample-options"}>
      <div
        className={"sample-options-2col"}
        style={{ gridTemplateColumns: "1fr 2fr" }}
      >
        <span title={"Background Map Provider"}>Provider</span>
        <Select<string>
          popoverProps={{ appendTo: () => document.body }}
          options={bgMapOptions.current}
          value={bgMap}
          onChange={setBgMap}
          size="small"
        />
      </div>
      <div
        className={"sample-options-2col"}
        style={{ gridTemplateColumns: "1fr 2fr" }}
      >
        <span title={"Background Map Provider"}>Style</span>
        <Select<string>
          popoverProps={{ appendTo: () => document.body }}
          options={bgMapTypeOptions.current}
          value={bgMapSupportsType ? bgMapType : undefined}
          disabled={!bgMapSupportsType}
          onChange={setBgMapType}
          size="small"
        />
      </div>
    </div>
  );
};

export class BackgroundMapWidgetProvider implements UiItemsProvider {
  public readonly id: string = "BackgroundMapWidgetProvider";

  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "BackgroundMapWidget",
        label: "Background Map",
        defaultState: WidgetState.Floating,
        // eslint-disable-next-line react/display-name
        content: <BackgroundMapWidget />,
      });
    }
    return widgets;
  }
}
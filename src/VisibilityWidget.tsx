// Importing necessary components and dependencies
import {
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiItemsProvider,
  Widget,
  WidgetState,
} from "@itwin/appui-react";

import * as React from "react";
import {
  ComboBox,
  Label,
  InputGroup,
  Anchor,
  Flex,
  Fieldset,
  ToggleSwitch,
} from "@itwin/itwinui-react";
import { TreeDecorator } from "./components/decorators/TreeDecorator";
import { IModelApp } from "@itwin/core-frontend";
import { useNameStore, useVisibleStore } from "./stores/main_store";

// Functional component TreeVisibility for controlling visibility of selected trees
export const TreeVisibility = () => {
  // State variables to manage selected name and marker visibility
  const [name, setName] = React.useState<string>("Select a species");
  const [showMarkers, setShowMarkers] = React.useState<boolean>(true);
  // Accessing store hooks for managing state globally
  const { setVisible } = useVisibleStore();
  const { setTreeName } = useNameStore();

  // Handler for toggling markers and updating decorators
  function handleToggleMarkers() {
    setVisible(!showMarkers);
    setShowMarkers(!showMarkers);
    // Removing existing TreeDecorator instances
    let test = IModelApp.viewManager.decorators;
    test.forEach((decorator) => {
      if (decorator instanceof TreeDecorator) {
        IModelApp.viewManager.dropDecorator(decorator);
      }
    });

    // Adding TreeDecorator if markers are enabled
    if (showMarkers === true) {
      const viewport = IModelApp.viewManager.getFirstOpenView();

      if (!viewport) return;
      IModelApp.viewManager.addDecorator(new TreeDecorator(viewport, name));
    }
  }

  // Handler for changing selected tree name
  const handleNameChange = (selectedName: string) => {
    setTreeName(selectedName);
    setName(selectedName);
    return selectedName;
  };

  // List of tree name options for the ComboBox
  const nameoptions = React.useMemo(
    () => [
      {
        label: "Abendlaendischer Lebensbaum",
        value: "Abendlaendischer Lebensbaum",
      },
      { label: "Ahorn", value: "Ahorn" },
      { label: "Amberbaum", value: "Amberbaum" },
      { label: "Amerikanische Linde", value: "Amerikanische Linde" },
      { label: "Amerikanische Rot-Eiche", value: "Amerikanische Rot-Eiche" },
      {
        label: "Amerikanische Stadt-Linde",
        value: "Amerikanische Stadt-Linde",
      },
      {
        label: "Amerikanischer Tulpenbaum",
        value: "Amerikanischer Tulpenbaum",
      },
      {
        label: "Amerikanischer Zürgelbaum",
        value: "Amerikanischer Zürgelbaum",
      },
      { label: "Apfel", value: "Apfel" },
      { label: "Apfel Street Parade", value: "Apfel Street Parade" },
      { label: "Atlas Zeder", value: "Atlas Zeder" },
      { label: "Baumhasel", value: "Baumhasel" },
      { label: "Bergahorn", value: "Bergahorn" },
      { label: "Berg-Ahorn 'Spaethii'", value: "Berg-Ahorn 'Spaethii'" },
      { label: "Berg-Ulme", value: "Berg-Ulme" },
      { label: "Birke", value: "Birke" },
      { label: "Birne", value: "Birne" },
      { label: "Blasenbaum", value: "Blasenbaum" },
      { label: "Blauglockenbaum", value: "Blauglockenbaum" },
      { label: "Blumen-Esch", value: "Blumen-Esch" },
      { label: "Blut-Ahorn, Spitzahorn", value: "Blut-Ahorn, Spitzahorn" },
      { label: "Blut-Pflaume", value: "Blut-Pflaume" },
      { label: "Chinesische Ulme", value: "Chinesische Ulme" },
      { label: "Coloradotanne", value: "Coloradotanne" },
      { label: "Crataegus, Dorn", value: "Crataegus, Dorn" },
      { label: "Douglasfichte", value: "Douglasfichte" },
      { label: "Douglasie", value: "Douglasie" },
      {
        label: "Dreidorniger Lederhülsenbaum, Gleditschie",
        value: "Dreidorniger Lederhülsenbaum, Gleditschie",
      },
      { label: "Dreilappiger Apfel", value: "Dreilappiger Apfel" },
      {
        label: "Eberesche, Mehlbeere, Vogelbeerbaum",
        value: "Eberesche, Mehlbeere, Vogelbeerbaum",
      },
      {
        label: "Echter Korkbaum, Amur-Korkbaum",
        value: "Echter Korkbaum, Amur-Korkbaum",
      },
      { label: "Echter Rotdorn", value: "Echter Rotdorn" },
      { label: "Eibe", value: "Eibe" },
      { label: "Eiche", value: "Eiche" },
      { label: "Einblättrige Esche", value: "Einblättrige Esche" },
      { label: "Eisenbaum", value: "Eisenbaum" },
      { label: "Eisenholzbaum", value: "Eisenholzbaum" },
      { label: "Erle", value: "Erle" },
      { label: "Esche", value: "Esche" },
      { label: "Eschen-Ahorn", value: "Eschen-Ahorn" },
      { label: "Essigbaum", value: "Essigbaum" },
      { label: "Etagen Hartriegel", value: "Etagen Hartriegel" },
      { label: "Europäische Lärche", value: "Europäische Lärche" },
      { label: "Fächer-Ahorn", value: "Fächer-Ahorn" },
      {
        label: "Farn- oder geschlitzblättrige Birke",
        value: "Farn- oder geschlitzblättrige Birke",
      },
      { label: "Feldahorn", value: "Feldahorn" },
      {
        label: "Feldahorn Huibers Elegant",
        value: "Feldahorn Huibers Elegant",
      },
      {
        label: "Feldulme (procera, minora, campestris)",
        value: "Feldulme (procera, minora, campestris)",
      },
      { label: "Felsenbirne", value: "Felsenbirne" },
      { label: "Feuerahorn", value: "Feuerahorn" },
      { label: "Fichte", value: "Fichte" },
      { label: "Flügelnuß", value: "Flügelnuß" },
      { label: "Gelbe Gleditschie", value: "Gelbe Gleditschie" },
      { label: "Gemeine Esche", value: "Gemeine Esche" },
      { label: "Gemeiner Goldregen", value: "Gemeiner Goldregen" },
      {
        label: "Gemeiner Judasbaum, Herzbaum",
        value: "Gemeiner Judasbaum, Herzbaum",
      },
      { label: "Gewöhnliche Eberesche", value: "Gewöhnliche Eberesche" },
      { label: "Gewöhnliche Kiefer", value: "Gewöhnliche Kiefer" },
      { label: "Ginko", value: "Ginko " },
      {
        label: "Ginkobaum, Fächerblattbaum",
        value: "Ginkobaum, Fächerblattbaum",
      },
      {
        label: "Gleditschie, Lederhülsenbaum",
        value: "Gleditschie, Lederhülsenbaum",
      },
      { label: "Goldrobinie", value: "Goldrobinie" },
      { label: "Götterbaum", value: "Götterbaum" },
      { label: "Graupappel", value: "Graupappel" },
      {
        label: "Großblättrige Sommerlinde",
        value: "Großblättrige Sommerlinde",
      },
      { label: "Grüne Hängebuche", value: "Grüne Hängebuche" },
      { label: "Hainbuche, Weißbuche", value: "Hainbuche, Weißbuche" },
      { label: "Hasel", value: "Hasel" },
      { label: "Holzbirne, Gemeine Birne", value: "Holzbirne, Gemeine Birne" },
      { label: "Hopfenbuche", value: "Hopfenbuche" },
      { label: "Immergrüne Eiche", value: "Immergrüne Eiche" },
      { label: "Italienische Erle", value: "Italienische Erle" },
      {
        label: "Japanische Nelken-Kirsche",
        value: "Japanische Nelken-Kirsche",
      },
      { label: "Japanischer Schnurbaum", value: "Japanischer Schnurbaum" },
      {
        label: "Judasblattbaum, Lebkuchenbaum",
        value: "Judasblattbaum, Lebkuchenbaum",
      },
      { label: "Kaiserlinde", value: "Kaiserlinde" },
      { label: "Kanadische Hemlocktanne", value: "Kanadische Hemlocktanne" },
      { label: "Kanadische Holz-Pappel", value: "Kanadische Holz-Pappel" },
      { label: "Kastanie", value: "Kastanie" },
      {
        label: "Kaukasus-Fichte, Sapindus-Fichte",
        value: "Kaukasus-Fichte, Sapindus-Fichte",
      },
      { label: "Kegel-Robinie", value: "Kegel-Robinie" },
      { label: "Kiefer", value: "Kiefer" },
      { label: "Kirsche", value: "Kirsche" },
      { label: "Kolchischer Ahorn", value: "Kolchischer Ahorn" },
      { label: "Korkenzieher Weide", value: "Korkenzieher Weide" },
      { label: "Korkenzieher-Akazie", value: "Korkenzieher-Akazie" },
      { label: "Kreuzdorn", value: "Kreuzdorn" },
      { label: "Krimline", value: "Krimline" },
      { label: "Kugelahorn", value: "Kugelahorn" },
      { label: "Kugelrobinie", value: "Kugelrobinie" },
      { label: "Kugel-Trompetenbaum", value: "Kugel-Trompetenbaum" },
      { label: "Kupfer-Felsenbirne", value: "Kupfer-Felsenbirne" },
      { label: "Küstenmammutbaum", value: "Küstenmammutbaum" },
      { label: "Lärche", value: "Lärche" },
      { label: "Lebensbaum", value: "Lebensbaum" },
      { label: "Lederblättriger Weißdorn", value: "Lederblättriger Weißdorn" },
      {
        label: "Leyland-Zypresse Bastardzypresse",
        value: "Leyland-Zypresse Bastardzypresse",
      },
      { label: "Libanon-Zeder", value: "Libanon-Zeder" },
      { label: "Linde", value: "Linde" },
      {
        label: "Lorbeermispel, Glanzmispel",
        value: "Lorbeermispel, Glanzmispel",
      },
      { label: "Magnolie", value: "Magnolie" },
      { label: "Mammutbaum", value: "Mammutbaum" },
      { label: "Marone, Eßkastanie", value: "Marone, Eßkastanie" },
      { label: "Maulbeere", value: "Maulbeere" },
      { label: "Mehlbeere", value: "Mehlbeere" },
      {
        label: "Östereichische Schwarzkiefer",
        value: "Östereichische Schwarzkiefer",
      },
      { label: "Papierbirke", value: "Papierbirke" },
      { label: "Pappel", value: "Pappel" },
      {
        label: "Pfaffenhütchen (Spindelbaum)",
        value: "Pfaffenhütchen (Spindelbaum) ",
      },
      {
        label: "Pflaumenblättriger Weiß-Dorn",
        value: "Pflaumenblättriger Weiß-Dorn",
      },
      { label: "Platane", value: "Platane" },
      {
        label: "Purpur-Kastanie, Blut-Kastanie",
        value: "Purpur-Kastanie, Blut-Kastanie",
      },
      {
        label: "Pyramiden-Eiche, Säulen-Eiche",
        value: "Pyramiden-Eiche, Säulen-Eiche",
      },
      { label: "Pyramiden-Hainbuche", value: "Pyramiden-Hainbuche" },
      { label: "Roßkastanie", value: "Roßkastanie" },
      { label: "Rotahorn", value: "Rotahorn" },
      { label: "Rot-Buche", value: "Rot-Buche" },
      { label: "Roter Holunder", value: "Roter Holunder" },
      { label: "Rotfichte", value: "Rotfichte" },
      { label: "Rundblättrige Rotbuche", value: "Rundblättrige Rotbuche" },
      { label: "Sal-Weide", value: "Sal-Weide" },
      { label: "Sandbirke", value: "Sandbirke" },
      { label: "Sanddorn", value: "Sanddorn" },
      { label: "Säulenkirsche", value: "Säulenkirsche" },
      {
        label: "Säulenpappel, Pyramidenpappel",
        value: "Säulenpappel, Pyramidenpappel",
      },
      { label: "Säulenrobinie", value: "Säulenrobinie" },
      { label: "Säulen-Tulpenbaum", value: "Säulen-Tulpenbaum" },
      { label: "Säulen-Ulme", value: "Säulen-Ulme" },
      { label: "Scheinakazie", value: "Scheinakazie" },
      { label: "Scheinzypresse", value: "Scheinzypresse" },
      { label: "Schmalkroniger Rotahorn", value: "Schmalkroniger Rotahorn" },
      { label: "Schnurbaum", value: "Schnurbaum" },
      { label: "Schwarzbirke", value: "Schwarzbirke" },
      { label: "Schwarzer Holunder", value: "Schwarzer Holunder" },
      { label: "Schwarz-Erle, Rot-Erle", value: "Schwarz-Erle, Rot-Erle" },
      { label: "Schwarzkiefer", value: "Schwarzkiefer" },
      { label: "Schwarznuß", value: "Schwarznuß" },
      { label: "Schwarzpappel", value: "Schwarzpappel" },
      { label: "Schwedische Mehlbeere", value: "Schwedische Mehlbeere" },
      { label: "Serbische Fichte", value: "Serbische Fichte" },
      { label: "Silber-Ahorn", value: "Silber-Ahorn" },
      { label: "Silberlinde", value: "Silberlinde" },
      { label: "Silberpappel", value: "Silberpappel" },
      { label: "Silber-Weide", value: "Silber-Weide" },
      { label: "Sommer-Eiche, Stileiche", value: "Sommer-Eiche, Stileiche" },
      { label: "Späte Traubenkirsche", value: "Späte Traubenkirsche" },
      { label: "Späth's Erle", value: "Späth's Erle" },
      { label: "Spitzahorn", value: "Spitzahorn" },
      { label: "Spitzahorn Cleveland", value: "Spitzahorn Cleveland" },
      { label: "Stechpalme", value: "Stechpalme" },
      { label: "Straßen-Akazie", value: "Straßen-Akazie" },
      { label: "Südlicher Zürgelbaum", value: "Südlicher Zürgelbaum" },
      { label: "Sump-Eiche", value: "Sump-Eiche" },
      { label: "Sumpf-Zypresse", value: "Sumpf-Zypresse" },
      { label: "Tanne", value: "Tanne" },
      { label: "Tränen-Kiefer", value: "Tränen-Kiefer" },
      { label: "Trauben-Kirsche", value: "Trauben-Kirsche" },
      { label: "Trompetenbaum", value: "Trompetenbaum" },
      { label: "Tulpenbaum", value: "Tulpenbaum" },
      { label: "Ulme, Rüster", value: "Ulme, Rüster" },
      { label: "unbekannt", value: "unbekannt" },
      { label: "unbekannt", value: "" },
      { label: "Ungarische Eiche", value: "Ungarische Eiche" },
      { label: "Ungarische Silberlinde", value: "Ungarische Silberlinde" },
      { label: "Urweltmammutbaum, Chinesisches Rotholz", value: " " },
      { label: "Verschiedene", value: "Verschiedene" },
      { label: "Wacholder", value: "Wacholder" },
      { label: "Wal-, Nußbaum", value: "Wal-, Nußbaum" },
      { label: "Walnuß", value: "Walnuß" },
      { label: "Weide", value: "Weide" },
      { label: "Weißdorn", value: "Weißdorn" },
      { label: "Weißer Maulbeerbaum", value: "Weißer Maulbeerbaum" },
      { label: "Weymouthkiefer", value: "Weymouthkiefer" },
      {
        label: "Winter-Eiche, Trauben-Eiche",
        value: "Winter-Eiche, Trauben-Eiche",
      },
      { label: "Winterlinde", value: "Winterlinde" },
      { label: "Winterlinde, Cordaley", value: "Winterlinde, Cordaley" },
      { label: "Winterlinde Dila", value: "Winterlinde Dila" },
      { label: "Winterlinde Rancho", value: "Winterlinde Rancho" },
      { label: "Zeder", value: "Zeder" },
      { label: "Zelkove", value: "Zelkove" },
      { label: "Zierapfel", value: "Zierapfel" },
      { label: "Zier-Birne", value: "Zier-Birne" },
      { label: "Zierkirsche 'Spire'", value: "Zierkirsche 'Spire'" },
      { label: "Zitterpappel", value: "Zitterpappel" },
    ],
    []
  );

  // URL to learn more about the selected species
  const learnMoreUrl = `https://www.google.com/search?q=${encodeURIComponent(
    name
  )}`;

  // Conditional rendering of anchor component
  let anchorComponent = null;
  if (name !== "Verschiedene" && name !== "unbekannt" && name.trim() !== "") {
    anchorComponent = (
      <Anchor href={learnMoreUrl} target="_blank">
        Click here to learn more about this species!
      </Anchor>
    );
  }

  // Rendering the main component with ComboBox, label, toggle switch, and optional anchor
  return (
    <Fieldset
      legend="Set Tree Visibility Per Species"
      style={{ display: "flex", flexDirection: "column", gap: 11 }}
    >
      <InputGroup>
        <Label htmlFor="name-input">German Name</Label>
        <ComboBox
          options={nameoptions}
          inputProps={{
            id: "name-input",
            placeholder: "Select a species",
          }}
          value={name}
          onChange={handleNameChange}
        />

        {anchorComponent}
      </InputGroup>

      <InputGroup>
        <Flex flexDirection="column" alignItems="flex-start">
          <ToggleSwitch
            label="Highlight Selected"
            labelPosition="left"
            checked={!showMarkers}
            onChange={handleToggleMarkers}
          />
        </Flex>
      </InputGroup>
    </Fieldset>
  );
};

// Class VisibilityProvider implementing UiItemsProvider for providing widget
export class VisibilityProvider implements UiItemsProvider {
  public readonly id = "VisibilityProviderId";

  // Method to provide widget
  public provideWidgets(
    _stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    // Adding a widget for tree visibility control in the right panel
    if (
      stageUsage === StageUsage.General &&
      location === StagePanelLocation.Right &&
      section === StagePanelSection.Start
    ) {
      const helloWidget: Widget = {
        id: "Visibility",
        label: "Visibility",
        defaultState: WidgetState.Open,
        content: <TreeVisibility />,
      };
      widgets.push(helloWidget);
    }
    return widgets;
  }
}

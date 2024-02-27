// Importing necessary components and dependencies
import {
  StagePanelLocation,
  StagePanelSection,
  StageUsage,
  UiItemsProvider,
  Widget,
  WidgetState,
  useActiveIModelConnection,
} from "@itwin/appui-react";
import React from "react";
import { Label, Input, Fieldset, Flex, Button } from "@itwin/itwinui-react";
import { SensorWidget } from "./SensorWidget";
import { SvgCheckmarkSmall } from "@itwin/itwinui-icons-react";
import { useIssueStore } from "./stores/main_store";

// React functional component for displaying and updating tree properties
export function TreeProperties() {
  const [treeName, setTreeName] = React.useState("");
  const [treeId, setTreeId] = React.useState("0x20000003127");
  const [trunk, setTrunk] = React.useState("");
  const [crown, setCrown] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [treeAge, setTreeAge] = React.useState("");
  const [treeAddress, setTreeAddress] = React.useState("");
  const [treeLage, setTreeLage] = React.useState("");
  const [treeType, setTreeType] = React.useState<number>(0);
  const [newIssue, setNewIssue] = React.useState<string>("");
  const iModelConnection = useActiveIModelConnection();

  // State variable to store current issues related to the selected tree
  const [currentIssues, setCurrentIssues] = React.useState<string[]>([]);

  // Custom hook to manage issues state
  const { issues, addIssues } = useIssueStore();

  // Effect hook to listen for changes in the selection set
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
            setTreeAddress(obj.hausNr);
            setTreeLage(obj.lagebezeic);
            setTreeType(obj.objekttyp);

            issues.forEach((issue) => {
              if (issue.id === obj.id) setCurrentIssues(issue.issue);
            });
          }
          const ele: any = e[0];
          if (ele.name && ele.id) {
            setTreeId(obj.id);
            setTreeName(obj.name);
            setTreeAddress(obj.strName);
            setTreeLage(obj.strS);
            setTreeType(obj.objekttyp);
          }
        });
      });
    });
    // Cleanup function to remove the listener when the component unmounts
    return () => {
      iModelConnection?.selectionSet.onChanged.removeListener(() => {});
    };
  }, []);

  // Create a variable with the timeseries sensor data
  const sensor = SensorWidget();

  // Mapping of object type keys to their corresponding string values
  const objectTypeKeys = {
    0: "",
    1: "NN",
    2: "Kleingarten",
    3: "Sportplatz",
    4: "Kinderspielplatz",
    5: "Gebäude/Schule/Heim",
    6: "Straße/Platz",
    7: "Grünanlage",
    8: "Friedhof",
    9: "Biotopflächen",
    10: "Fluss/Bach",
    11: "Sonderanlage",
    12: "Forst",
    13: "Ausgleichsfläche",
    14: "Unbekannt",
  };

  // Function to translate a number to its corresponding string value based on the object type keys
  function translateNumberToString(numberValue: number) {
    return objectTypeKeys[numberValue as keyof typeof objectTypeKeys];
  }

  // Render the component
  return (
    <>
      <Fieldset
        legend={"Properties " + treeName}
        style={{ display: "flex", flexDirection: "column", gap: 11 }}
      >
        <Label htmlFor="name-input">
          {" "}
          Soil Moisture of {treeName}
          <br />
          {treeAddress + " " + treeLage}
        </Label>

        <Fieldset>{sensor}</Fieldset>

        <Flex>
          <Flex
            flexDirection="column"
            alignItems="flex-end"
            gap="var(--iui-size-s)"
          >
            <Label htmlFor="name">Name</Label>
            <Label htmlFor="location">Location</Label>
            <Label htmlFor="objectType">Object Type</Label>
            <Label htmlFor="trunk">Trunk Circumference in cm</Label>
            <Label htmlFor="crown">Crown Circumference in m</Label>
            <Label htmlFor="height">Height in m</Label>
            <Label htmlFor="age">Estimated Age</Label>
          </Flex>
          <Flex
            flexDirection="column"
            alignItems="flex-start"
            gap="var(--iui-size-2xs)"
          >
            <Input id="name" placeholder={treeName} />
            <Input id="location" placeholder={treeAddress + " " + treeLage} />
            <Input id="trunk" placeholder={translateNumberToString(treeType)} />
            <Input id="trunk" placeholder={trunk} />
            <Input id="crown" placeholder={crown} />
            <Input id="height" placeholder={height} />
            <Input id="age" placeholder={treeAge} />
          </Flex>
        </Flex>
        <Button size="small" styleType="cta" endIcon={<SvgCheckmarkSmall />}>
          Click to update tree
        </Button>
      </Fieldset>
    </>
  );
}

// UiItemsProvider class for providing the Properties widget
export class PropertiesProvider implements UiItemsProvider {
  public readonly id = "PropertiesProviderId";

  public provideWidgets(
    _stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (
      stageUsage === StageUsage.General &&
      location === StagePanelLocation.Right &&
      section === StagePanelSection.Start
    ) {
      const helloWidget: Widget = {
        id: "Properties",
        label: "Properties",
        defaultState: WidgetState.Open,
        content: <TreeProperties />,
      };
      widgets.push(helloWidget);
    }
    return widgets;
  }
}

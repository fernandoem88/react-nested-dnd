import React, { useState } from "react";
import { Draggable } from "../../components/Draggable";
import { Droppable } from "../../components/Droppable";
import { NestedDndProvider, OnDrop } from "../../components/Provider";
import { DroppableLists } from "../DroppableLists";
import style from "./style.module.scss";

const initialValues = {
  workspace: {
    containersOrder: ["container-1", "container-2"] as const,
  },
  containers: {
    "container-1": { id: "container-1", items: ["1", "2", "3", "4", "5"], isNested: false },
    "container-2": { id: "container-2", items: ["6", "7", "8", "9", "10", "11"], isNested: false },
  },
  items: {
    "1": { id: "1", text: "one", type: "odd" },
    "2": { id: "2", text: "two", type: "even" },
    "3": { id: "3", text: "three", type: "odd" },
    "4": { id: "4", text: "four", type: "even" },
    "5": { id: "5", text: "five", type: "odd" },
    "6": { id: "6", text: "six", type: "even" },
    "7": { id: "7", text: "seven", type: "odd" },
    "8": { id: "8", text: "height", type: "even" },
    "9": { id: "9", text: "nine", type: "odd" },
    "10": { id: "10", text: "ten", type: "even" },
    "11": { id: "11", text: "eleven", type: "odd" },
  },
};

export const appContext = React.createContext(initialValues);

const useOnDrop = () => {
  const [state, setState] = useState(initialValues);
  const onDrop: OnDrop = ({ source, destination, dropType, sameSource }) => {
    const { index: srcIndex, droppableId: srcContainerId } = source;
    const { index: destIndex, droppableId: destContainerId } = destination;
    const newState = { ...state };
    type ContainerKey = keyof typeof newState.containers;

    if (srcContainerId === "workspace") {
      if (dropType !== "replace" || !sameSource || srcIndex === destIndex) {
        return;
      }
      const { workspace } = newState;

      const items = workspace.containersOrder as any as string[];
      const srcItemId = items[srcIndex as any];

      if (destIndex > srcIndex) {
        // we add the source id at the destination index
        items.splice(destIndex + 1, 0, srcItemId);
        // we remove the source id at its previous position
        items.splice(srcIndex, 1);
      } else {
        // we remove the source id at its previous position
        items.splice(srcIndex, 1);
        // we add the source id at the destination index
        items.splice(destIndex, 0, srcItemId);
      }
      setState(newState);
      return;
    }

    if (dropType === "replace") {
      if (sameSource) {
        if (srcIndex === destIndex) return;

        const container = newState.containers[srcContainerId as ContainerKey];
        if (!container) return;
        const items = container.items;
        const srcItemId = items[srcIndex as any];

        if (destIndex > srcIndex) {
          // we add the source id at the destination index
          items.splice(destIndex + 1, 0, srcItemId);
          // we remove the source id at its previous position
          items.splice(srcIndex, 1);
        } else {
          // we remove the source id at its previous position
          items.splice(srcIndex, 1);
          // we add the source id at the destination index
          items.splice(destIndex, 0, srcItemId);
        }
        setState(newState);
      } else {
        // different drop zones
        const srcContainer = newState.containers[srcContainerId as ContainerKey];
        const destContainer = newState.containers[destContainerId as ContainerKey];
        if (!srcContainer || !destContainer) return;

        const srcItems = srcContainer.items;
        const destItems = destContainer.items;
        // removing srcItem from the source items list
        const [srcItem] = srcItems.splice(source.index, 1);
        // adding the source item to the destination items list
        destItems.splice(destination.index, 0, srcItem);

        if (srcContainer.isNested && !srcContainer.items.length) {
          delete newState.containers[srcContainerId as ContainerKey];
        }
        setState(newState);
      }
    } else {
      const srcContainer = newState.containers[srcContainerId as ContainerKey];
      const srcItemId = srcContainer.items[srcIndex];

      const destContainer = newState.containers[destContainerId as ContainerKey];
      const destItemId = destContainer.items[destIndex];

      srcContainer.items.splice(srcIndex, 1);

      const nestedContainerId = `nested-${destItemId}`;
      const nestedContainer: any = {
        id: nestedContainerId,
        items: [srcItemId],
        isNested: true,
      };
      newState.containers[nestedContainerId as ContainerKey] = nestedContainer;
      if (srcContainer.isNested && !srcContainer.items.length) {
        delete newState.containers[srcContainerId as ContainerKey];
      }
      setState(newState);
    }
  };
  return { onDrop, appState: state };
};

export const DndTest = () => {
  const { appState, onDrop } = useOnDrop();

  return (
    <appContext.Provider value={appState}>
      <NestedDndProvider onDrop={onDrop}>
        <Droppable id={"workspace"} accept={["container"]}>
          {(wsProvided, wsSnapshot, wsPlacholder) => (
            <div {...wsProvided} className={style.wrapper}>
              {appState.workspace.containersOrder
                .map((cId) => appState.containers[cId])
                .map((ctnr, index) => (
                  <Draggable
                    horizontal
                    key={ctnr.id}
                    id={ctnr.id}
                    index={index}
                    type="container"
                    droppableId="workspace"
                  >
                    {(horizProvided, horizSnapshot) => (
                      <div
                        {...horizProvided}
                        className={`${style.workspaceItem}${
                          horizSnapshot.isDragging ? " " + style.hidden : ""
                        }`}
                      >
                        <DroppableLists container={ctnr} />
                      </div>
                    )}
                  </Draggable>
                ))}
              {/* {wsPlacholder} */}
            </div>
          )}
        </Droppable>
      </NestedDndProvider>
    </appContext.Provider>
  );
};
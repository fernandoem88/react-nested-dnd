# React-nested-dnd

infinite nested drag and drop library

# example

try it out with this [code sandbox example](https://codesandbox.io/p/sandbox/delicate-fast-hbm2q7?file=%2Fpages%2Findex.tsx&selection=%5B%7B%22endColumn%22%3A48%2C%22endLineNumber%22%3A15%2C%22startColumn%22%3A48%2C%22startLineNumber%22%3A15%7D%5D)

# Components

## Provider

Is the context Root component. it requires 2 props, the **htmlBackend** and the **onDrop** handler

```typescript
import React from "react";
import { Provider, OnDrop } from "react-nested-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const MyApp = () => {
  const [state, setState] = useState();
  const onDrop: OnDrop = ({ source, destination, dropType, sameSource }) => {
    const { index: srcIndex, droppableId: srcContainerId } = source;
    const { index: destIndex, droppableId: destContainerId } = destination;
    // your application logic goes here
    // setState(newState)
  };
  return (
    <Provider onDrop={onDrop} htmlBackend={HTML5Backend}>
      <Children />
    </Provider>
  );
};
```

## Draggable

is the draggable element wrapper. it requires 5 props:

- **type** the Draggable item type
- **id** its own id
- **droppableId** its parent id, the id of the list it belongs to
- **index** its index in the items list.
- **children** a callback that provides some style props and snapShot

```typescript
import React from "react";
import { Draggable } from "react-nested-dnd";

const DraggableItem = (props: {
  value: number;
  id: string;
  parentId: string;
}) => {
  const type = props.value % 2 === 0 ? "even" : "odd";

  return (
    <Draggable
      droppableId={props.parentId}
      id={props.id}
      index={index}
      type={type}
    >
      {(providedStyle, snapshot) => {
        return (
          <div
            {...providedStyle}
            className={snapshot.isDragging ? "dragging" : ""}
          >
            {props.value}
          </div>
        );
      }}
    </Draggable>
  );
};
```

## Droppable

the draggable items list container. it requires 3 props

- **id** the droppable id
- **accept** array of allowed draggable item types.
- **children** a call back that provides a droppable style, a place holder for the dragged item and the droppable component snapshot

```typescript
import React from "react";
import { Droppable } from "react-nested-dnd";

const DroppableList = (props: {
    id: string;
    items: number[];
  ;
}) => {

  const Items = props.items.map((item, index) => <DraggableItem droppableId={props.id} {...restOfItemProps}/>)

  return (
    <Droppable id={props.id} accept={["even", "odd"]}>
      {(providedStyle, snapshot, placeholder) => {
        return (
          <div {...providedStyle}>
            {Items}
            // when an item is dragged over the container, we should add a placehold so the container will have enought space for the item to be dropped
            {placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};
```

## useOnDrop

here is an example of how we can handle onDrop using a custom hook

```ts
// utils.ts

const initialValues = {
  workspace: {
    containersOrder: ["container-1", "container-2"] as const,
  },
  containers: {
    "container-1": {
      id: "container-1",
      items: ["1", "2", "3", "4", "5"],
      isNested: false,
    },
    "container-2": {
      id: "container-2",
      items: ["6", "7", "8", "9", "10", "11"],
      isNested: false,
    },
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

export const useOnDrop = () => {
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
        const srcContainer =
          newState.containers[srcContainerId as ContainerKey];
        const destContainer =
          newState.containers[destContainerId as ContainerKey];
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

      const destContainer =
        newState.containers[destContainerId as ContainerKey];
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
```

MIT © [https://github.com/fernandoem88/typed-classnames](https://github.com/fernandoem88/typed-classnames)

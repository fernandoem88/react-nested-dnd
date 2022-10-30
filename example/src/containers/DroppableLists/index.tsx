import React from "react";
import { Droppable } from "../../components/Droppable";
import { DraggableItems } from "../DraggableItems";
import style from "./style.module.scss";

export const DroppableLists = ({
  container,
}: {
  container: {
    id: string;
    items: string[];
  };
}) => {
  return (
    <Droppable key={container.id} id={container.id} accept={["even", "odd"]}>
      {(provided, snapshot, placeholder) => {
        return (
          <div {...provided} className={style.container}>
            <DraggableItems container={container} />
            {placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

import React, { useContext } from 'react'
import {} from 'react-nested-dnd'
import { DroppableLists } from '../DroppableLists'
import { appContext } from '../RootContainer'

import style from './style.module.scss'

export const DraggableItems = (props: {
  container: { id: string; items: string[] }
}) => {
  const { items, containers } = useContext(appContext)

  return (
    <>
      {props.container.items.map((itemId, index) => {
        const item = items[itemId as keyof typeof items]
        const nestedId = `nested-${itemId}`
        const nestedContainer = containers[nestedId as keyof typeof containers]
        return (
          <Draggable
            key={itemId}
            droppableId={props.container.id}
            id={itemId}
            index={index}
            type={item.type}
          >
            {(provided, snapshot) => {
              return (
                <div
                  {...provided}
                  className={`${style.item}${
                    snapshot.isDragging ? ' ' + style.hidden : ''
                  }`}
                >
                  {item.text}
                  {nestedContainer && (
                    <DroppableLists container={nestedContainer} />
                  )}
                </div>
              )
            }}
          </Draggable>
        )
      })}
    </>
  )
}

import React from 'react'
import { Droppable } from 'react-nested-dnd'
import { DraggableItems } from '../DraggableItems'
// import style from './style.module.scss'

const style = {} as any

export const DroppableLists = ({
  container
}: {
  container: {
    id: string
    items: string[]
  }
}) => {
  return (
    <Droppable key={container.id} id={container.id} accept={['even', 'odd']}>
      {(provided: any, _: any, placeholder: any) => {
        return (
          <div {...provided} className={style.container}>
            <DraggableItems container={container} />
            {placeholder}
          </div>
        )
      }}
    </Droppable>
  )
}

import { FC, useCallback, useEffect, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { DragItem, DraggableProps } from './types'
import { useDroppableContext, useOnDrop } from '../Provider'
import { getElementMargin, getTranslationStyle, handleHover } from './utils'

const Draggable: FC<DraggableProps> = ({ children, horizontal, ...props }) => {
  const ref = useRef<any>()
  const onDrop = useOnDrop()

  const {
    threesholdIndex,
    threesholdId,
    setThreesholdIndex,
    setThreesholdId,
    getAcceptTypes,
    isDropTarget: isParentActive
  } = useDroppableContext(props.droppableId)

  const [{ isDragging, draggedItem, style }, drag] = useDrag({
    type: props.type,
    item: () => {
      const element = ref.current as HTMLDivElement
      const rect = element?.getBoundingClientRect()
      return {
        ...props,
        __rect__: rect,
        margin: getElementMargin(element)
      }
    },
    collect: (monitor) => {
      const draggedItem = monitor.getItem()
      const isDragging = monitor.isDragging()

      const { style } = getTranslationStyle({
        sourceItem: draggedItem,
        destinationItem: props,
        threesholdIndex,
        horizontal,
        domRect: draggedItem?.__rect__,
        isDragging,
        isParentActive,
        margin: draggedItem?.margin
      })

      return { isDragging, draggedItem, style }
    },

    end(_, monitor) {
      if (monitor.didDrop()) {
        const result = monitor.getDropResult() as any
        onDrop(result)
      }
    }
  })

  const [{ isOver }, drop] = useDrop<
    DragItem & { __rect__: DOMRect | undefined },
    { source: any; destination: any; dropType: 'combine' },
    { isOver: boolean }
  >({
    accept: getAcceptTypes(),
    collect(monitor) {
      return {
        // handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver()
      }
    },

    drop(_, monitor) {
      const draggedItem = monitor.getItem() as DragItem
      if (!draggedItem) return

      const isDropTarget = monitor.isOver({ shallow: true })
      if (!isDropTarget) return

      return {
        source: {
          index: draggedItem.index,
          id: draggedItem.id,
          droppableId: draggedItem.droppableId
        },
        destination: {
          index: props.index,
          id: props.id,
          droppableId: props.droppableId
        },
        dropType: 'combine',
        sameSource: draggedItem.droppableId === props.droppableId
      }
    },

    hover(draggedItem, monitor) {
      handleHover(monitor, {
        sourceItem: draggedItem,
        destinationItem: props,
        ref,
        setThreesholdIndex,
        threesholdIndex,
        horizontal
      })
    }
  })

  const isDestination = isParentActive && threesholdIndex === props.index
  const idMismatch = isDestination && threesholdId !== props.id
  useEffect(() => {
    if (idMismatch) {
      setThreesholdId(props.id)
    }
  }, [idMismatch, setThreesholdId, props.id])

  const indexMismatch =
    isParentActive &&
    threesholdIndex !== props.index &&
    threesholdId === props.id
  useEffect(() => {
    if (indexMismatch) {
      setThreesholdId(undefined as any)
    }
  }, [indexMismatch, setThreesholdId, props.id])

  const isDraggingSrouce =
    isDragging &&
    draggedItem?.index === props.index &&
    draggedItem?.droppableId === props.droppableId

  useEffect(() => {
    if (isDraggingSrouce) {
      setThreesholdIndex(props.index)
      setThreesholdId(props.id)
    }
  }, [
    isDraggingSrouce,
    setThreesholdIndex,
    setThreesholdId,
    props.index,
    props.id
  ])

  const dndRef = useCallback(
    (element: any) => {
      ref.current = drag(drop(element))
    },
    [drag, drop]
  )

  return children({ ref: dndRef, style }, { isDragging, isOver: isOver })
}

export { Draggable }

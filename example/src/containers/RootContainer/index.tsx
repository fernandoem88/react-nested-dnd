import React, { useState } from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Draggable, Droppable, Provider } from 'react-nested-dnd'
import { DroppableLists } from '../DroppableLists'
import { INITIAL_VALUES } from './constants'
// import style from './style.module.scss'

const style = {} as any

const appContext = React.createContext(INITIAL_VALUES)

const useOnDrop = () => {
  const [state, setState] = useState(INITIAL_VALUES)
  const onDrop = ({ source, destination, dropType, sameSource }: any) => {
    const { index: srcIndex, droppableId: srcContainerId } = source
    const { index: destIndex, droppableId: destContainerId } = destination
    const newState = { ...state }
    type ContainerKey = keyof typeof newState.containers

    if (srcContainerId === 'workspace') {
      if (dropType !== 'replace' || !sameSource || srcIndex === destIndex) {
        return
      }
      const { workspace } = newState

      const items = workspace.containersOrder as any as string[]
      const srcItemId = items[srcIndex as any]

      if (destIndex > srcIndex) {
        // we add the source id at the destination index
        items.splice(destIndex + 1, 0, srcItemId)
        // we remove the source id at its previous position
        items.splice(srcIndex, 1)
      } else {
        // we remove the source id at its previous position
        items.splice(srcIndex, 1)
        // we add the source id at the destination index
        items.splice(destIndex, 0, srcItemId)
      }
      setState(newState)
      return
    }

    if (dropType === 'replace') {
      if (sameSource) {
        if (srcIndex === destIndex) return

        const container = newState.containers[srcContainerId as ContainerKey]
        if (!container) return
        const items = container.items
        const srcItemId = items[srcIndex as any]

        if (destIndex > srcIndex) {
          // we add the source id at the destination index
          items.splice(destIndex + 1, 0, srcItemId)
          // we remove the source id at its previous position
          items.splice(srcIndex, 1)
        } else {
          // we remove the source id at its previous position
          items.splice(srcIndex, 1)
          // we add the source id at the destination index
          items.splice(destIndex, 0, srcItemId)
        }
        setState(newState)
      } else {
        // different drop zones
        const srcContainer = newState.containers[srcContainerId as ContainerKey]
        const destContainer =
          newState.containers[destContainerId as ContainerKey]
        if (!srcContainer || !destContainer) return

        const srcItems = srcContainer.items
        const destItems = destContainer.items
        // removing srcItem from the source items list
        const [srcItem] = srcItems.splice(source.index, 1)
        // adding the source item to the destination items list
        destItems.splice(destination.index, 0, srcItem)

        if (srcContainer.isNested && !srcContainer.items.length) {
          delete newState.containers[srcContainerId as ContainerKey]
        }
        setState(newState)
      }
    } else {
      const srcContainer = newState.containers[srcContainerId as ContainerKey]
      const srcItemId = srcContainer.items[srcIndex]

      const destContainer = newState.containers[destContainerId as ContainerKey]
      const destItemId = destContainer.items[destIndex]

      srcContainer.items.splice(srcIndex, 1)

      const nestedContainerId = `nested-${destItemId}`
      const nestedContainer: any = {
        id: nestedContainerId,
        items: [srcItemId],
        isNested: true
      }
      newState.containers[nestedContainerId as ContainerKey] = nestedContainer
      if (srcContainer.isNested && !srcContainer.items.length) {
        delete newState.containers[srcContainerId as ContainerKey]
      }
      setState(newState)
    }
  }
  return { onDrop, appState: state }
}

export const DndExample = () => {
  const { appState, onDrop } = useOnDrop()

  return (
    <appContext.Provider value={appState}>
      <Provider onDrop={onDrop} HTML5Backend={HTML5Backend}>
        <Droppable id={'workspace'} accept={['container']}>
          {(wsProvided: any) => (
            <div {...wsProvided} className={style.wrapper}>
              {appState.workspace.containersOrder
                .map((cId) => appState.containers[cId])
                .map((ctnr, index) => (
                  <Draggable
                    horizontal
                    key={ctnr.id}
                    id={ctnr.id}
                    index={index}
                    type='container'
                    droppableId='workspace'
                  >
                    {(horizProvided: any, horizSnapshot: any) => (
                      <div
                        {...horizProvided}
                        className={`${style.workspaceItem}${
                          horizSnapshot.isDragging ? ' ' + style.hidden : ''
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
      </Provider>
    </appContext.Provider>
  )
}

export { appContext }

export default DndExample

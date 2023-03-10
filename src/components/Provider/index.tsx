import { DndProvider } from 'react-dnd'
import React, { createContext, Context, useContext } from 'react'
import { OnDrop, ProviderProps } from './types'

const ONDROP_CTX = createContext<OnDrop>(() => {})

const STORE = {
  droppables: {} as {
    [id: string]: {
      context: Context<{
        threesholdIndex: number
        setThreesholdIndex: React.Dispatch<React.SetStateAction<number>>
        threesholdId: string
        setThreesholdId: React.Dispatch<React.SetStateAction<string>>
        // sameSource: boolean;
        isDropTarget: boolean
        id: string
        getAcceptTypes: () => string[]
      }>
    }
  }
}

const useOnDrop = () => {
  return useContext(ONDROP_CTX)
}

const useDroppableContext = (droppableId: string) => {
  return useContext(STORE.droppables[droppableId].context)
}

const DndCtxProvider = ONDROP_CTX.Provider

const Provider: React.FC<ProviderProps> = (props) => {
  return (
    <DndCtxProvider value={props.onDrop}>
      <DndProvider backend={props.HTML5Backend}>{props.children}</DndProvider>
    </DndCtxProvider>
  )
}

export { useOnDrop, useDroppableContext, Provider, STORE }

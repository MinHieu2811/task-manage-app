import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react'
import usePortal from 'react-useportal'

import {
  INotiStateItem,
  NotiAction,
  ADD,
  REMOVE,
  REMOVE_ALL,
  REMOVE_ALL_AND_ADD
} from './interface.d'
import Notifications from './notification'

export const NotiContext = createContext<{
  notiList: INotiStateItem[]
  notiDispatch: Dispatch<NotiAction>
}>({
  notiList: [],
  notiDispatch: () => {
    return null
  }
})

const initialState: INotiStateItem[] = []

export const notiReducer = (state: INotiStateItem[], action: NotiAction) => {
  switch (action.type) {
    case ADD:
      return [
        ...state,
        {
          id: +new Date(),
          content: action.payload.content,
          type: action.payload.type
        }
      ]
    case REMOVE:
      return state.filter((t) => t.id !== action.payload.id)
    case REMOVE_ALL:
      return initialState
    case REMOVE_ALL_AND_ADD:
      return [
        {
          id: action.payload?.id || +new Date(),
          content: action.payload.content,
          type: action.payload.type
        }
      ]
    default:
      return state
  }
}

export const NotiProvider = ({ children }: { children: ReactNode }) => {
  const [notiList, notiDispatch] = useReducer(notiReducer, initialState)
  const notiData = { notiList, notiDispatch }
  const { Portal } = usePortal()
  return (
    <NotiContext.Provider value={notiData}>
      {children}
      <Portal>
        <Notifications notiList={notiList} />
      </Portal>
    </NotiContext.Provider>
  )
}

export const useNotiContext = () => {
  return useContext(NotiContext)
}

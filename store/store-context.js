import Error from 'next/error'
import { createContext, useReducer } from 'react'
export const StoreContext = createContext()

export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_BOBA_STORES: 'SET_BOBA_STORES'
}

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return {
        ...state,
        latLong: action.payload.latLong
      }
    }
    case ACTION_TYPES.SET_BOBA_STORES: {
      return {
        ...state,
        bobaStores: action.payload.bobaStores
      }
    }
    default: 
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const StoreProvider = ({children}) => {
  const initialState = {
    latLong: "",
    bobaStores: []
  }

  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
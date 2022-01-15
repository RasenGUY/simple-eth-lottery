import React, { createContext, useReducer } from 'react';

const initialContext = {
  injectedProvider: undefined, 
  setInjectedProvider: () => {} 
};


const appReducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_INJECTED_PROVIDER": 
      return {
        ...state,
        injectedProvider: payload
      }
    default:
      return state;
  }
};

const AppContext = createContext(initialContext);

export const useAppContext = () => React.useContext(AppContext);
export const AppContextProvider = ({ children }) => {
  
  const [store, dispatch] = useReducer(appReducer, initialContext);
  
  const contextValue = {
    injectedProvider: store.injectedProvider,
    setInjectedProvider: provider => {
      dispatch({type: 'SET_INJECTED_PROVIDER', payload: provider })
    }
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};



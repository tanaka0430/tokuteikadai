import React, { createContext, useContext } from 'react';
import { useHomeSetup } from '../hooks/useHomeSetup';

const HomeSetupContext = createContext();

export const HomeSetupProvider = ({ children }) => {
  const setup = useHomeSetup(); // 1 回だけ呼び出す
  return (
    <HomeSetupContext.Provider value={setup}>
      {children}
    </HomeSetupContext.Provider>
  );
};

export const useHomeSetupContext = () => {
  return useContext(HomeSetupContext);
};

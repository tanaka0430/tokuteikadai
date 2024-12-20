import React from 'react'
import { createContext, useState } from 'react'

export const UserContext = createContext({});

export const UserProvider = (props) => {
    const { children } = props;
    const [loginUser, setLoginUser] = useState("");
    const [isLogined, setIsLogined] = useState(false);

    return (
    <UserContext.Provider value={{ loginUser, setLoginUser, isLogined, setIsLogined }}>
        {children}
    </UserContext.Provider>
  );
};

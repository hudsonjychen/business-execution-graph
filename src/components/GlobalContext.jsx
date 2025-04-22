import React, { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [mode, setMode] = useState("discovery");

    return (
        <GlobalContext.Provider value={{ mode, setMode }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
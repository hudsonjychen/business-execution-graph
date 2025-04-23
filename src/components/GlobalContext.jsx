import React, { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [mode, setMode] = useState("discovery");
    const [objectTypes, setObjectTypes] = useState([]);
    const [objectTypeChecked, setObjectTypeChecked] = useState([]);

    return (
        <GlobalContext.Provider 
            value={{ 
                mode, setMode, 
                objectTypes, setObjectTypes, 
                objectTypeChecked, setObjectTypeChecked
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
import React, { createContext, useState, useContext } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [mode, setMode] = useState("discovery");
    const [fileImported, setFileImported] = useState(null);
    const [objectTypes, setObjectTypes] = useState([]);
    const [objectTypeChecked, setObjectTypeChecked] = useState([]);
    const [attributeTypeChecked, setAttributeTypeChecked] = useState('');
    const [pngDataUrl, setPngDataUrl] = useState(null);

    return (
        <GlobalContext.Provider 
            value={{ 
                mode, setMode, 
                fileImported, setFileImported,
                objectTypes, setObjectTypes, 
                objectTypeChecked, setObjectTypeChecked,
                attributeTypeChecked, setAttributeTypeChecked,
                pngDataUrl, setPngDataUrl
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => useContext(GlobalContext);
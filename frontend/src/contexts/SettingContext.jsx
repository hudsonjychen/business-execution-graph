import { createContext, useState, useContext } from "react";

const SettingContext = createContext();

export const SettingProvider = ({ children }) => {
    const [attributeTypeChecked, setAttributeTypeChecked] = useState('');
    const [notationTypeChecked, setNotationTypeChecked] = useState('');
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedColorPattern, setSelectedColorPattern] = useState({'process': null, 'objectType': null, 'activity': null});
    const [nodeSize, setNodeSize] = useState([90, 50, 30]);
    const [objectTypeFrequency, setObjectTypeFrequency] = useState(0);
    const [activityFrequency, setActivityFrequency] = useState(0);
    const [nodeTypeShown, setNodeTypeShown] = useState('both');
    const [colorLevelType, setColorLevelType] = useState('disabled');
    const [sharedNodeShown, setSharedNodeShown] = useState('both')

    return (
        <SettingContext.Provider 
            value={{ 
                attributeTypeChecked, setAttributeTypeChecked,
                notationTypeChecked, setNotationTypeChecked,
                selectedColor, setSelectedColor,
                selectedColorPattern, setSelectedColorPattern,
                nodeSize, setNodeSize,
                objectTypeFrequency, setObjectTypeFrequency,
                activityFrequency, setActivityFrequency,
                nodeTypeShown, setNodeTypeShown,
                colorLevelType, setColorLevelType,
                sharedNodeShown, setSharedNodeShown
            }}>
            {children}
        </SettingContext.Provider>
    );
};

export const useSetting = () => useContext(SettingContext);
import React, { useState, useContext } from 'react';

const SettingsContext = React.createContext({});

const LOCAL_STORAGE_KEY = 'live_translate_settings';

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        // Restore previous settings
        const value = window.localStorage.getItem(LOCAL_STORAGE_KEY);

        try {
            return JSON.parse(value);
        } catch (err) {
            return {};
        }
    });

    const setAndSaveSetting = (name, value) => {
        const newSettings = { ...settings, [name]: value };
        setSettings(newSettings);

        window.localStorage.setItem(
            LOCAL_STORAGE_KEY,
            JSON.stringify(newSettings),
        );
    };

    const context = {
        settings,
        setAndSaveSetting,
    };

    return (
        <SettingsContext.Provider value={context}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSetting = (name, def) => {
    const { settings, setAndSaveSetting } = useContext(SettingsContext);
    const value = (settings && name in settings) ? settings[name] : def;
    const setSetting = (newVal) => {
        // Handle function expecting old value
        if (typeof newVal === 'function')
            newVal = newVal(value);

        setAndSaveSetting(name, newVal);
    };
    return [value, setSetting];
};

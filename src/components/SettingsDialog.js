import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core';
import { useSetting } from '../context/Settings';
import { DEFAULT_MSG_REGEX } from '../config';

const SettingsDialog = ({ show, onClose = () => {} }) => {
    const [regexSetting, setRegexSetting] = useSetting('msg_regex', DEFAULT_MSG_REGEX);
    const [regex, setRegex] = useState(regexSetting);
    const [regexError, setRegexError] = useState(false);

    const handleSave = () => {
        if (regexError) return;

        // Copy local state to settings
        setRegexSetting(regex);

        onClose();
    };

    const resetRegex = () => setRegex(DEFAULT_MSG_REGEX);

    const handleRegexChange = event => {
        const value = event.target.value;
        try {
            new RegExp(value);
            setRegexError(false);
        } catch (err) {
            setRegexError(err.message);
        }
        setRegex(value);
    };

    return (
        <Dialog open={show} onClose={onClose} maxWidth='md'>
            <DialogTitle>Live Translate Settings</DialogTitle>
            <DialogContent>
                <TextField
                    label='Regex'
                    helperText={regexError || 'Customize the messages that get copied into the translation box'}
                    error={Boolean(regexError)}
                    fullWidth
                    value={regex}
                    onChange={handleRegexChange}
                    InputProps={{
                        endAdornment: <>
                            <Button color='primary' onClick={resetRegex}>
                                Reset
                            </Button>
                        </>,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='primary'>
                    Cancel
                </Button>
                <Button onClick={handleSave} color='primary'>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsDialog;

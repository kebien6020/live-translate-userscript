import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import TranslateIcon from '@material-ui/icons/Translate';
import SettingsDialog from './SettingsDialog';

const Buttons = ({ onToggleMessages, messagesAreShown }) => {
    const [showSettingsDialog, setShowSettingsDialog] = useState(false);
    const toggleSettingsDialog = () => setShowSettingsDialog(prev => !prev);
    const closeSettingsDialog = () => setShowSettingsDialog(false);

    return (
        <Wrapper>
            <IconButton
                onClick={onToggleMessages}
                color={messagesAreShown ? 'secondary' : 'default'}
            >
                <TranslateIcon />
            </IconButton>
            <IconButton
                onClick={toggleSettingsDialog}
                color={showSettingsDialog ? 'primary' : 'default'}
            >
                <SettingsIcon />
            </IconButton>

            <SettingsDialog
                show={showSettingsDialog}
                onClose={closeSettingsDialog}
            />
        </Wrapper>
    );
};

const Wrapper = styled('div')({
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    marginLeft: '8px',
});

export default Buttons;

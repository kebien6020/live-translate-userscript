import React from 'react';
import { styled } from '@material-ui/core/styles';
// import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import TranslateIcon from '@material-ui/icons/Translate';

const Buttons = ({ onToggleMessages, messagesAreShown }) => {
    return (
        <Wrapper>
            <IconButton
                onClick={onToggleMessages}
                color={messagesAreShown ? 'primary' : 'default'}
            >
                <TranslateIcon />
            </IconButton>
            {/* <IconButton>
                <SettingsIcon />
            </IconButton> */}
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

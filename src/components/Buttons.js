import React from 'react';
import TranslateIcon from './TranslateIcon';

const Buttons = ({ onToggleMessages, messagesAreShown }) => {
    return (
        <TranslateIcon
            onClick={onToggleMessages}
            fill={messagesAreShown ? 'red' : 'gray'}
        />
    );
};

export default Buttons;

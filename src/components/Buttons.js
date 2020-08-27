import React from 'react';
import TranslateIcon from './TranslateIcon';

const h = React.createElement;

const Buttons = ({ onToggleMessages, messagesAreShown }) => {
    return h(TranslateIcon, {
        onClick: onToggleMessages,
        fill: messagesAreShown ? 'red' : 'gray',
    });
};

export default Buttons;

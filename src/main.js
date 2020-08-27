'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { init as initChatObserver } from './ChatObserver';
import { log } from './util';
import App from './components/App';

const main = async () => {
    log('main: Start');

    initChatObserver();

    const root = document.createElement('div');
    document.body.appendChild(root);

    log('main: Initializing react');

    ReactDOM.render(<App />, root);
};

const inAFrame = window !== window.top;

if (!inAFrame) {
    if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive')
        main();
    else
        document.addEventListener('DOMContentLoaded', main);
}

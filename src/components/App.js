import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
    addMessageEventListener,
    addPageChangeListener,
    removeMessageEventListener,
    removePageChangeEventListener,
} from '../ChatObserver';
import { whenAvailable, log } from '../util';
import Buttons from './Buttons';
import Messages from './Messages';

const h = React.createElement;

const App = () => {
    const [isWatchPage, setIsWatchPage] = useState(false);
    const [messages, setMessages] = useState([]);
    const [containers, setContainers] = useState(null);
    const [showMessages, setShowMessages] = useState(false);
    const toggleMessages = () => setShowMessages(prev => !prev);

    // Detect when we arrive at the watch page
    useEffect(() => {
        const handlePageChange = (isWatchPage) => {
            setIsWatchPage(isWatchPage);

            setMessages([]);
        };

        addPageChangeListener(handlePageChange);

        return () => {
            removePageChangeEventListener(handlePageChange);
        };
    }, []);

    // Setup containers on load / page change
    useEffect(() => {
        const setupContainers = async () => {
            if (!isWatchPage) {
                setContainers(null);
                return;
            }

            let buttonContainer = document.getElementById('live-translate-button-container');

            if (!buttonContainer) {
                buttonContainer = document.createElement('div');
                buttonContainer.id = 'live-translate-button-container';
                const upNext = await whenAvailable('#upnext.ytd-compact-autoplay-renderer');
                upNext.style.display = 'flex';
                upNext.appendChild(buttonContainer);
            }

            let msgContainer = document.getElementById('live-translate-msg-container');

            if (!msgContainer) {
                msgContainer = document.createElement('div');
                msgContainer.id = 'live-translate-msg-container';
                const infoContents = await whenAvailable('#info-contents');
                infoContents.insertAdjacentElement('afterend', msgContainer);
            }

            setContainers({
                buttonContainer,
                msgContainer,
            });
        };

        setupContainers();
    }, [isWatchPage]);

    // Subscribe to messages
    useEffect(() => {
        const addMessage = message => {
            setMessages(prev => [
                ...prev,
                message,
            ]);
        };

        addMessageEventListener(addMessage);

        return () => {
            removeMessageEventListener(addMessage);
        };
    }, []);

    // auto scroll down
    const messagesRef = useRef(null);
    const bottomOfChatRef = useRef(null);
    useEffect(() => {
        if (bottomOfChatRef.current && messagesRef.current) {
            const elem = messagesRef.current;
            if (elem.scrollHeight - elem.offsetHeight - elem.scrollTop <= 100) {
                log('scrolling bottom');
                bottomOfChatRef.current.scrollIntoView({ block: 'end' });
            }
        }
    }, [messages]);

    return containers && h(React.Fragment, null,
        ReactDOM.createPortal(
            h(Buttons, {
                onToggleMessages: toggleMessages,
                messagesAreShown: showMessages,
            }),
            containers.buttonContainer,
        ),
        ReactDOM.createPortal(
            h(Messages, {
                show: showMessages,
                messages,
                forwardRef: messagesRef,
                bottomOfChatRef: bottomOfChatRef,
            }),
            containers.msgContainer,
        ),
    );
};

export default App;

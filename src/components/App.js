import React, { useEffect, useState, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
    addMessageEventListener,
    addPageChangeListener,
    removeMessageEventListener,
    removePageChangeEventListener,
} from '../ChatObserver';
import { whenAvailable, log, error } from '../util';
import Buttons from './Buttons';
import Messages from './Messages';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import useYoutubeDarkMode from '../hooks/useYoutubeDarkMode';
import baseTheme from '../theme';
import { SettingsProvider, useSetting } from '../context/Settings';
import { DEFAULT_MSG_REGEX } from '../config';

const Providers = ({ children }) => {
    const ytIsDark = useYoutubeDarkMode();

    const theme = useMemo(() =>
        createMuiTheme({
            ...baseTheme,
            palette: {
                ...baseTheme.pallette,
                type: ytIsDark ? 'dark' : 'light',
            },
        })
    , [ytIsDark]);

    return (
        <ThemeProvider theme={theme}>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </ThemeProvider>
    );
};

const Main = () => {
    const [isWatchPage, setIsWatchPage] = useState(false);
    const [messages, setMessages] = useState([]);
    const [containers, setContainers] = useState(null);
    const [showMessages, setShowMessages] = useSetting('showMessages', false);
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
                upNext.style.lineHeight = '40px';
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

    // Get the regex
    const [regexStr] = useSetting('msg_regex', DEFAULT_MSG_REGEX);
    const regex = useMemo(() => {
        try {
            return new RegExp(regexStr, 'i');
        } catch (err) {
            error('Invalid regexp', regexStr, err);
            return new RegExp(DEFAULT_MSG_REGEX, 'i');
        }
    }, [regexStr]);

    // Subscribe to messages
    useEffect(() => {
        const addMessage = message => {
            const isAMatch = regex.test(message.text);
            if (!isAMatch)
                return;

            setMessages(prev => [
                ...prev,
                message,
            ]);
        };

        addMessageEventListener(addMessage);

        return () => {
            removeMessageEventListener(addMessage);
        };
    }, [regex]);

    // auto scroll down
    const messagesRef = useRef(null);
    useEffect(() => {
        if (messagesRef.current) {
            const elem = messagesRef.current;
            if (elem.scrollHeight - elem.offsetHeight - elem.scrollTop <= 100) {
                log('scrolling bottom');
                elem.scrollTop = elem.scrollHeight;
            }
        }
    }, [messages]);

    return (containers && <>
        {ReactDOM.createPortal(
            <Buttons
                onToggleMessages={toggleMessages}
                messagesAreShown={showMessages}
            />,
            containers.buttonContainer,
        )}
        {ReactDOM.createPortal(
            <Messages
                show={showMessages}
                messages={messages}
                forwardRef={messagesRef}
            />,
            containers.msgContainer,
        )}
    </>);
};

const App = () => (
    <Providers>
        <Main />
    </Providers>
);

export default App;

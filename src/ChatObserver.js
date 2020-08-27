import { MSG_REGEX } from './config';
import { log, warn, whenAvailable } from './util';

const messageListeners = [];
const pageChangeListeners = [];

export async function addMessageEventListener(listener) {
    messageListeners.push(listener);
}

export async function removeMessageEventListener(listener) {
    const index = messageListeners.findIndex(l => l === listener);
    if (index !== -1) 
        delete messageListeners[index];
    
}

export async function addPageChangeListener(listener) {
    pageChangeListeners.push(listener);
}

export async function removePageChangeEventListener(listener) {
    const index = pageChangeListeners.findIndex(l => l === listener);
    if (index !== -1) 
        delete pageChangeListeners[index];
    
}

let ytApp;

export async function init() {
    ytApp = await whenAvailable('ytd-app');
    const appObserver = new MutationObserver(onPageChange);
    appObserver.observe(ytApp, { attributes: true, attributeFilter: ['is-watch-page'] });
    // Trigger initial setup as if page had just changed
    onPageChange();
}

let chatObserver;

async function onPageChange() {
    log('onPageChange: Init');
    const changedToWatchPage = ytApp.hasAttribute('is-watch-page');
    if (changedToWatchPage) {
        const chatFrame = await whenAvailable('#chatframe');
        const chat = await whenAvailable('#item-offset', chatFrame.contentWindow);

        log('onPageChange: Setting chat observer');
        chatObserver = new MutationObserver(onChatChange);
        chatObserver.observe(chat, { childList: true, subtree: true });
    } else {
        log('onPageChange: Disconnecting chat observer');
        if (chatObserver)
            chatObserver.disconnect();


        log('onPageChange: Removing translation container');
    }

    notifyPageChange(changedToWatchPage);
}

function onChatChange(mutations) {
    for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;

        const chatElems = [...mutation.addedNodes]
            .filter(node => node.nodeType === Node.ELEMENT_NODE)
            .filter(elem => elem.classList.contains('yt-live-chat-item-list-renderer'));

        if (chatElems.length === 0) continue;

        log('onChatChange: New messages ', chatElems.length);

        for (const chatElem of chatElems)
            onChatElem(chatElem);

    }
}

function onChatElem(chatElem) {
    const msgElem = chatElem.querySelector('#message');
    if (!msgElem) {
        warn('onMessage: Could not find message within chatElem', chatElem);
        return;
    }

    const msgText = msgElem.textContent;
    const isAMatch = MSG_REGEX.test(msgText);
    if (!isAMatch) return;

    const author = chatElem.querySelector('#author-name');
    const authorText = author ? author.textContent : '???';
    log('onMessage: Matched text', msgText);

    notifyMessage({
        text: msgText,
        author: authorText,
    });
}

function notifyMessage(message) {
    for (const listener of messageListeners)
        listener(message);
}

function notifyPageChange(isWatchPage) {
    for (const listener of pageChangeListeners)
        listener(isWatchPage);
}

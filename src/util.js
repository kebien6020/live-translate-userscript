import { DEBUG } from './config';

export const sleep = ms => new Promise(res => setTimeout(res, ms));

export const log = (...args) => {
    if (DEBUG)
        console.log(...args); // eslint-disable-line no-console
};

export const warn = (...args) => {
    if (DEBUG)
        console.warn(...args); // eslint-disable-line no-console
};

export const error = (...args) => {
    if (DEBUG)
        console.warn(...args); // eslint-disable-line no-console
};

/**
 * @param {string} selector
 * @param {Window} wnd
 * @returns {Promise<HTMLElement>}
 */
export const whenAvailable = async (selector, wnd = window) => {
    for (;;) {
        const elem = wnd.document.querySelector(selector);
        if (!elem) {
            warn('whenAvailable: Could not find selector', selector);
            await sleep(1000);
        } else {
            log('whenAvailable: Found selector', selector);
            return elem;
        }
    }
};

import { useState, useEffect } from 'react';

const html = document.querySelector('html');

const useYoutubeDarkMode = () => {
    const [dark, setDark] = useState(false);
    useEffect(() => {
        const update = () => {
            const isDark = html.getAttribute('dark') === 'true';
            setDark(isDark);
        };

        update();

        const observer = new MutationObserver(update);
        observer.observe(html, {
            attributes: true,
            attributesFilter: ['dark'],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    return dark;
};

export default useYoutubeDarkMode;

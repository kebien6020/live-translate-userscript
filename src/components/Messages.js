import React from 'react';

const h = React.createElement;

const Messages = ({ show, messages, bottomOfChatRef, forwardRef }) => {
    return h('div',
        {
            style: {
                display: show ? 'block' : 'none',
                fontSize: '13px',
                width: '100%',
                height: '120px',
                backgroundColor: 'white',
                overflow: 'hidden',
                overflowY: 'scroll',
                paddingBottom: '15px',
                marginTop: '5px',
                paddingLeft: '10px',
                paddingRight: '10px',
            },
            ref: forwardRef,
        },
        messages.map((message, idx) => (
            h('div', { key: idx, style: { marginTop: '15px' } },
                h('b', null, message.author),
                '\xA0\xA0',
                message.text,
            )
        )),
        h('div', {
            style: { float: 'left', clear: 'both' },
            ref: bottomOfChatRef,
        }),
    );
};

export default Messages;

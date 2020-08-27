import React from 'react';

const Messages = ({ show, messages, bottomOfChatRef, forwardRef }) => {
    return (
        <div
            style={{
                ...wrapperStyle,
                display: show ? 'block' : 'none',
            }}
            ref={forwardRef}
        >
            {messages.map((message, idx) => (
                <div key={idx} style={{ marginTop: '15px' }}>
                    <b>message.author</b>&nbsp;&nbsp;
                    {message.text}
                </div>
            ))}
            <div
                style={{ float: 'left', clear: 'both' }}
                ref={bottomOfChatRef}
            />
        </div>
    );
};

const wrapperStyle = {
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
};

export default Messages;

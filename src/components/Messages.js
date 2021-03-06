import React from 'react';
import { styled, Paper, Collapse } from '@material-ui/core';

const Messages = ({ show, messages, forwardRef }) => {
    return (
        <Collapse in={show}>
            <Wrapper ref={forwardRef}>
                {messages.map((message, idx) => (
                    <div key={idx} style={{ marginTop: '15px' }}>
                        <b>{message.author}</b>&nbsp;&nbsp;
                        {message.text}
                    </div>
                ))}
            </Wrapper>
        </Collapse>
    );
};

const Wrapper = styled(Paper)({
    fontSize: '13px',
    width: '100%',
    height: '120px',
    overflow: 'hidden',
    overflowY: 'scroll',
    marginTop: '5px',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingBottom: '15px',
});

export default Messages;

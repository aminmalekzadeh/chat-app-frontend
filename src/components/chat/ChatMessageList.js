import PropTypes from 'prop-types';
import { findIndex } from 'lodash';
import { useEffect, useState, useRef } from 'react';

import Scrollbar from '../Scrollbar';
import LightboxModal from '../Lightboxmodal';
import ChatMessageItem from './ChatMessageItem';


// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  conversation: PropTypes.object.isRequired
};

export default function ChatMessageList({ conversation }) {
  const scrollRef = useRef();


  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();

  }, [conversation.messages]);

  const images = conversation.messages !== null && conversation.messages
    .filter((messages) => messages.contentType === 'image')
    .map((messages) => messages.body);

  return (
    <>
      <Scrollbar scrollableNodeProps={{ ref: scrollRef }} sx={{ p: 3, height: 1 }}>
        {conversation.messages !== null && conversation.messages.map((message) => (
          <ChatMessageItem
            key={message._id}
            message={message}
            conversation={conversation}
          />
        ))}
      </Scrollbar>
    </>
  );
}

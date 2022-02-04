import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// material
import { List } from '@mui/material';
// routes
import { PATH_CHAT } from '../../routes/paths';
//
import ChatConversationItem from './ChatConversationItem';
import { me } from '../../utils/jwt';
// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.object,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string
};

export default function ChatConversationList({ conversations, isOpenSidebar, activeConversationId, ...other }) {
  const navigate = useNavigate();

  const handleSelectConversation = (conversationId) => {
    let conversationKey = '';
    const conversation = conversations.byId[conversationId];
    if (conversation.type === 'GROUP') {
      conversationKey = conversation._id;
    } else {
      const otherParticipant = conversation.participants.find(
        (participant) => participant.hash_id !== me()
      );
      conversationKey = conversationId;
    }
    navigate(`${PATH_CHAT.root}/${conversationKey}`);
  };

  return (
    <List disablePadding {...other}>
      {conversations.allIds.map((conversationId) => (
        <ChatConversationItem
          key={conversationId}
          isOpenSidebar={isOpenSidebar}
          conversation={conversations.byId[conversationId]}
          isSelected={activeConversationId === conversationId}
          onSelectConversation={() => handleSelectConversation(conversationId)}
        />
      ))}
    </List>
  );
}

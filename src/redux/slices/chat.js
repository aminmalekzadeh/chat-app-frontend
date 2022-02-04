import { createSlice } from '@reduxjs/toolkit';
// utils
import HttpService from '../../utils/HttpService';

// ----------------------------------------------------------------------
const httpservice = new HttpService();

function objFromArray(array, key = '_id') {
  return array.reduce((accumulator, current) => {
    accumulator[current[key]] = current;
    return accumulator;
  }, {});
}

function removeItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

const initialState = {
  isLoading: false,
  error: false,
  contacts: { byId: {}, allIds: [] },
  NewContacts: [],
  conversations: { byId: {}, allIds: [] },
  activeConversationId: null,
  participants: [],
  recipients: [],
  blockUsers: [],
  blockedOthers: []
};

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CONTACT SSUCCESS
    getContactsSuccess(state, action) {
      const contacts = action.payload;

      state.contacts.byId = objFromArray(contacts, 'id');
      state.contacts.allIds = Object.keys(state.contacts.byId);
    },

    addUserToBlock(state, action) {
      const users = action.payload;
      state.blockUsers.push(users);
    },

    unBlockUser(state, action) {
      const user = action.payload;
      state.blockUsers = removeItemOnce(state.blockUsers, user);
    },

    getBlockedOthers(state, action) {
      const user = action.payload;
      state.blockedOthers.push(user);
    },

    // GET CONVERSATIONS
    getConversationsSuccess(state, action) {
      const conversations = action.payload;

      state.conversations.byId = objFromArray(conversations);
      state.conversations.allIds = Object.keys(state.conversations.byId);
    },

    // GET CONVERSATION
    getConversationSuccess(state, action) {
      const conversation = action.payload;

      if (conversation) {

        state.conversations.byId[conversation._id] = conversation;
        state.activeConversationId = conversation._id;
        if (!state.conversations.allIds.includes(conversation._id)) {
          state.conversations.allIds.push(conversation._id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    // ON SEND MESSAGE
    onSendMessage(state, action) {
      const conversation = action.payload;
      const { conversationId, messageId, message, contentType, attachments, createdAt, senderId } = conversation;

      const newMessage = {
        id: messageId,
        body: message,
        contentType,
        attachments,
        createdAt,
        senderId
      };

      state.conversations.byId[conversationId].messages.push(newMessage);
    },

    createNewConversation(state, action) {
      const conversation = action.payload;
      if (conversation) {
        state.conversations.byId[conversation._id] = conversation;
        state.activeConversationId = conversation._id;
        if (!state.conversations.allIds.includes(conversation._id)) {
          state.conversations.allIds.push(conversation._id);
        }
      } else {
        state.activeConversationId = null;
      }
    },

    markConversationAsReadSuccess(state, action) {
      const { conversationId } = action.payload;
      const conversation = state.conversations.byId[conversationId];
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },

    // GET PARTICIPANTS
    getParticipantsSuccess(state, action) {
      const participants = action.payload;
      state.participants = participants;
    },

    // RESET ACTIVE CONVERSATION
    resetActiveConversation(state) {
      state.activeConversationId = null;
    },

    addRecipients(state, action) {
      const recipients = action.payload;
      state.recipients = recipients;
    },

    addToContact(state, action) {
      const newContact = action.payload;
      state.contacts.allIds.push(newContact.id);
      state.contacts.byId[newContact.id] = newContact;
    },

    getNewContacts(state, action) {
      const newContact = action.payload;
      state.NewContacts = newContact
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const { addRecipients, onSendMessage, resetActiveConversation, addUserToBlock, unBlockUser } = slice.actions;

// ----------------------------------------------------------------------

export function getContacts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpservice.get('/chat/contacts');
      dispatch(slice.actions.getContactsSuccess(response.data.contacts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function addNewUsersBlock(hashId) {
  return async (dispatch) => {
    try {
      const response = await httpservice.post('/account/block', {
        user_block_id: hashId
      });
      dispatch(slice.actions.addUserToBlock(response.data.blockeduser.user_block_id));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

// ----------------------------------------------------------------------

export function getUsersBlocked() {
  return async (dispatch) => {
    try {
      const response = await httpservice.get('/account/block');
      dispatch(slice.actions.addUserToBlock(response.data.blockedUsers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

// ----------------------------------------------------------------

export function UnBlockUser(hashId) {
  return async (dispatch) => {
    try {
      const response = await httpservice.delete('/account/block', {
        user_block_id: hashId
      });
      console.log('response', response.data);
      dispatch(slice.actions.unBlockUser(response.data.blockedUsers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

// ----------------------------------------------------------------------

export function getBlockedbyOthers() {
  return async (dispatch) => {
    try {
      const response = await httpservice.get('/account/blockedothers');
      dispatch(slice.actions.getBlockedOthers(response.data.blockedOthers));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

// ----------------------------------------------------------------------

export function addNewContact(userId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpservice.post('/chat/contact',
        { userId }
      );
      dispatch(slice.actions.addToContact(response.data.contact));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// -----------------------------------------------------------------------


export function getNewContactByUsername(search) {
  return async (dispatch) => {
    try {
      const response = await httpservice.get('/chat/contact', {
        params: { search }
      });
      dispatch(slice.actions.getNewContacts(response.data.contacts));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ------------------------------------------------------------------------

export function getConversations() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpservice.get('/chat/conversations');

      dispatch(slice.actions.getConversationsSuccess(response.data.conversations));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getConversation(conversationKey) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpservice.get('/chat/conversation', {
        params: { conversationKey }
      });
      dispatch(slice.actions.getConversationSuccess(response.data.conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function markConversationAsRead(conversationId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await httpservice.get('/chat/conversation/mark-as-seen', {
        params: { conversationId }
      });
      dispatch(slice.actions.markConversationAsReadSuccess({ conversationId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getParticipants(conversationKey) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await httpservice.get('/chat/participants', {
        params: { conversationKey }
      });
      dispatch(slice.actions.getParticipantsSuccess(response.data.participants));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ---------------------------------------------------------------------

export function createNewConversation(conversation) {
  return async (dispatch) => {
    try {
      const response = await httpservice.post('/chat/conversations', {
        conversation
      });
      dispatch(slice.actions.createNewConversation(response.data.conversation));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------------------------------------------------

export function ReportUser(userReportId) {
  return async (dispatch) => {
    try {
      const response = await httpservice.post('/account/report', {
        userReportId
      });

      console.log('response.data.report', response.data.report)
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  }
}

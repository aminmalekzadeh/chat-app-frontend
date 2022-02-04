import React, { useLayoutEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import EventManager from "../utils/EventManager";
import SockClient from '../utils/SockClient';
import MediaCalls from "../utils/mediaCalls";
// ---------------------------------------------------------
const socket = new SockClient();
const peerjs = new MediaCalls();

const initialState = {
    eventManager: new EventManager(),
    socketService: socket,
    peerjsService: peerjs,
    FileUploads: []
}

// FileName: null,
// processNode: 0


const handlers = {
    UPDATE: (state, action) => {
        const { Conversation } = action.payload;
        
        return {
            ...state,
            eventManager: new EventManager(),
            socketService: socket,
            peerjsService: peerjs,
            FileUploads: Conversation
        }
    },

    INITALIZE: (state, action) => {
        const init = action.payload;
        return {
            ...state,
            init
        }
    }
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const ChatContext = React.createContext({
    ...initialState,
    update: () => Promise.resolve()
});

ChatProvider.propTypes = {
    children: PropTypes.node
};

function ChatProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useLayoutEffect(() => {
        const initialize = () => {
            socket.connect();
        }
        initialize();
    }, []);

    const update = (Conversation) => {
        dispatch({
            type: 'UPDATE',
            payload: {
                Conversation
            }
        })
    }

    return (
        <ChatContext.Provider value={
            {
                ...state,
                update
            }
        }>
            {children}
        </ChatContext.Provider>
    )
}


export { ChatContext, ChatProvider };
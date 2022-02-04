import socketIOClient from "socket.io-client";

class SockClient {

    constructor() {
        this.connection = null;
        this.events = {};
        this.messageHandler = this.messageHandler.bind(this);
    }

    connect() {
        this.connection = socketIOClient('localhost:8000'); 
        
    }

    messageHandler(e) {
        const { event, ...data } = JSON.parse(e.data);
        
        if(this.events && Object.prototype.hasOwnProperty.call(this.events, event)) {
            this.events[event](data);
        }
    }

    $on(event, handler) {
        this.events[event] = handler;
    }

    emit(event, data) {
        return this.connection.emit("chat_message", JSON.stringify({event , data}));
    }
}

export default SockClient;
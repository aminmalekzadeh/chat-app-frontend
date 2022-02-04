import Peer from "peerjs";

class MediaCalls {

    constructor() {
        this.peer = null;
        this.peerId = null;
        this.connection = null;
        this.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia;
    }

    setClient(peerId) {
        this.peerId = peerId;
    }

    init() {
        this.peer = new Peer(this.peerId, {
            key: 'peerjserver',
            path: '/messanger',
            host: 'localhost',
            port: 9000
        });
        return this.peer;
    }

    connect() {
        
        this.connection = this.peer.connect(this.peerId);
        return this.connection;
    }
}

export default MediaCalls;
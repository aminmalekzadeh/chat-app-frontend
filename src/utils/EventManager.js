class EventManager {

    constructor() {
        this.events = {};
    };

    on(event, callback) {
        this.events[event] = callback;
    }

    fire(event, ...data) {
        if (Object.prototype.hasOwnProperty.call(this.events, event)) {
            this.events[event](...data);
        }
    }
}
export default EventManager;
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        return this;
    }
    emit(event, ...args) {
        if (!this.events[event]) {
            return false;
        }
        this.events[event].forEach(listener => {
            listener.apply(this, args);
        });
        return true;
    }
}

export default new EventEmitter;


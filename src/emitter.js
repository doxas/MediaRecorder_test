
export default class Emitter {
    constructor(){
        this.listeners = {};
    }
    emit(eventName, arg){
        if(this.listeners.hasOwnProperty(eventName) === true){
            this.listeners[eventName](arg);
        }
    }
    on(eventName, listener){
        this.listeners[eventName] = listener;
    }
    off(eventName){
        this.listeners[eventName] = null;
    }
}

/*
 * Custom Event Manipulation Module
 */

var E = {};

var C = require('./core');

E.Event = {
    addHandler: function (oElement, sEvent, fnHandler) {
        oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler)
    },
    removeHandler: function (oElement, sEvent, fnHandler) {
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler)
    }
};

E.EventDispatcher = function() {
    return {
        listeners: {},
        attachListener: function(key, cb) {
            this.listeners[key] = this.listeners[key] || {};
            cb.uuid = cb.uuid || C.fastUuid();
            this.listeners[key][cb.uuid] = cb;
            return cb.uuid;
        },
        fire: function(key, data) {
            if (this.listeners[key]) {
                C.each(this.listeners[key], function(cb) {
                    if (cb && typeof cb === 'function' && !cb.blocked) {
                        try {
                            cb(data);
                        }catch(e) {
                            console.log(e)
                        }
                    }
                });
            }
        },
        removeListener: function(key, func) {
            if (this.listeners[key]) {
                this.listeners[key] = C.each(this.listeners[key], function(listener) {
                    if (listener.uuid !== func.uuid) return listener;
                }).merge();
            }
        },
        clearListener: function(key) {
            this.listeners[key] = undefined;
            delete this.listeners[key];
        }
    };
};

module.exports = E;
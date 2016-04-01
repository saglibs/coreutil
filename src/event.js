/*
 * Custom Event Manipulation Module
 */

var E = {};

var C = require('./core');

/**
 * DOM event operators.
 *
 * @static
 * @memberof H
 * @type {{addHandler: E.Event.addHandler, removeHandler: E.Event.removeHandler}}
 */
E.Event = {
    /**
     * Add event handler
     *
     * @static
     * @memberof H.Event
     * @param {Element} oElement DOM element
     * @param {String} sEvent event name
     * @param {Function} fnHandler event handler
     */
    addHandler: function (oElement, sEvent, fnHandler) {
        sEvent[0] = sEvent[0].toUpperCase();
        oElement.addEventListener ? oElement.addEventListener(sEvent, fnHandler, false) : oElement.attachEvent("on" + sEvent, fnHandler)
    },
    /**
     * Remove event handler from dom element
     *
     * @static
     * @memberof H.Event
     * @param {Element} oElement DOM element
     * @param {String} sEvent event name
     * @param {Function} fnHandler event handler
     */
    removeHandler: function (oElement, sEvent, fnHandler) {
        sEvent[0] = sEvent[0].toUpperCase();
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler);
        sEvent[0] = sEvent[0].toLowerCase();
        oElement.removeEventListener ? oElement.removeEventListener(sEvent, fnHandler, false) : oElement.detachEvent("on" + sEvent, fnHandler);
    }
};

/**
 * EventDispatcher
 *
 * @static
 * @memberof H
 * @returns {{listeners: {}, attachListener: attachListener, fire: fire, removeListener: removeListener, clearListener: clearListener}}
 * @constructor
 */
E.EventDispatcher = function() {
    return {
        listeners: {},
        /**
         * Attach an listener listening on a channel
         *
         * @static
         * @memberof H.EventDispatcher
         * @param {String} key channel to listen
         * @param {Function} cb listener body
         * @returns {String} UUID String, listener identifier
         */
        attachListener: function(key, cb) {
            this.listeners[key] = this.listeners[key] || {};
            //noinspection JSUnresolvedVariable
            cb.uuid = cb.uuid || C.fastUuid();
            //noinspection JSUnresolvedVariable
            this.listeners[key][cb.uuid] = cb;
            //noinspection JSUnresolvedVariable
            return cb.uuid;
        },
        /**
         * Fire event at a channel now
         *
         * @static
         * @memberof H.EventDispatcher
         * @param {String} key event channel key to fire
         * @param {*} [data] optional data to append
         */
        fire: function(key, data) {
            if (this.listeners[key]) {
                C.each(this.listeners[key], function(cb) {
                    //noinspection JSUnresolvedVariable
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
        /**
         * Remove a listener from a channel.
         *
         * @static
         * @memberof H.EventDispatcher
         * @param {String} key channel name
         * @param {Function} func listener body
         */
        removeListener: function(key, func) {
            if (this.listeners[key]) {
                this.listeners[key] = C.each(this.listeners[key], function(listener) {
                    //noinspection JSUnresolvedVariable
                    if (listener.uuid !== func.uuid) return listener;
                }).merge();
            }
        },
        /**
         * Clear all listeners on a channel
         *
         * @static
         * @memberof H.EventDispatcher
         * @param {String} key channel key to clear
         */
        clearListener: function(key) {
            this.listeners[key] = undefined;
            delete this.listeners[key];
        }
    };
};

module.exports = E;
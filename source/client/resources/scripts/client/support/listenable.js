/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var map = require("support/map"),
        pocketKnife = require("support/pocketKnife"),
        vector = require("support/vector"),

        event = (function () {

            var prototype = {

                    stopPropagation: function stopPropagation() {

                        this._isPropagationStopped = true;
                    },

                    isPropagationStopped: function isPropagationStopped() {

                        return this._isPropagationStopped;
                    },

                    getData: function getData() {

                        return this._data;
                    },

                    initialise: function initialise(data) {

                        this._isPropagationStopped = false;
                        this._data = data;

                        return this;
                    }
                },

                create = function create(data) {

                    return pocketKnife.create(prototype).initialise(data);
                };

            return create;
        }()),

        prototype = {

            on: function on(eventName, callback, data, isOneTimeListener) {

                var listeners = this._listeners.get(eventName);

                if (!listeners) {

                    listeners = vector();
                    this._listeners.set(eventName, listeners);
                }

                listeners.push({ callback: callback, data: data, isOneTimeListener: isOneTimeListener || false });
            },

            one: function one(eventName, callback, data) {

                this.on(eventName, callback, data, true);
            },

            _reset: function _reset() {

                this._listeners = map();
            },

            off: function off(eventName, callback) {

                if (!eventName) {

                    this._reset();

                    return;
                }

                if (this._listeners.get(eventName)) {

                    if (!callback) {

                        this._listeners.erase(eventName);

                        return;
                    }

                    var listeners = this._listeners.get(eventName);

                    listeners.each(function eachListener(listener, index) {

                        if (listener.callback === callback) {

                            listeners.erase(index);

                            return false;
                        }

                        return true;
                    });
                }
            },

            trigger: function trigger(eventName) {

                var listeners = this._listeners.get(eventName),
                    isEventAllowedToPropagate = true,
                    that,
                    rgmnts,
                    oneTimeListeners;

                if (!listeners) {

                    return isEventAllowedToPropagate;
                }

                that = this;
                rgmnts = pocketKnife.arrayify(arguments, 1);
                oneTimeListeners = vector();
                listeners.each(function eachListener(listener) {

                    var vnt = event(listener.data);

                    if (listener.callback.apply(that, [ vnt ].concat(rgmnts)) === false || vnt.isPropagationStopped()) {

                        isEventAllowedToPropagate = false;
                    }

                    if (listener.isOneTimeListener) {

                        oneTimeListeners.push(listener);
                    }

                    return isEventAllowedToPropagate;
                });
                oneTimeListeners.each(function eachOneTimeListener(oneTimeListener) {

                    that.off(eventName, oneTimeListener.callback);
                });

                return isEventAllowedToPropagate;
            },

            superior: function superior(methodName) {

                return pocketKnife.bind(prototype[methodName], this);
            },

            initialise: function initialise() {

                this._reset();

                return this;
            }
        },

        create = function create() {

            return pocketKnife.create(prototype).initialise();
        };

    return create;
});

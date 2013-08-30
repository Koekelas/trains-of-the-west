/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

/**
 * A collection of classes for others to consume or build upon.
 *
 * @module client/support
 * @namespace client.support
 */
define(function (require) {

    "use strict";

    var map = require("support/map"),
        pocketKnife = require("support/pocketKnife"),
        vector = require("support/vector"),

        event = (function () {

                /**
                 * A helper class allowing the listener to control the propagation of the event.
                 *
                 * @class event
                 * @constructor
                 */
            var prototype = {

                    /**
                     * Stops the event, prevents the still to be notified listeners from being notified. Equivalent to returning `false` from the listener's callback.
                     *
                     * @method stopImmediatePropagation
                     */
                    stopImmediatePropagation: function stopImmediatePropagation() {

                        this._isImmediatePropagationStopped = true;
                    },

                    /**
                     * Tells whether the event stopped propagating.
                     *
                     * @method isImmediatePropagationStopped
                     * @return {Boolean} Whether the event stopped propagating.
                     */
                    isImmediatePropagationStopped: function isImmediatePropagationStopped() {

                        return this._isImmediatePropagationStopped;
                    },

                    /**
                     * Gets the data to be passed to the callback.
                     *
                     * @method getData
                     * @return {any} The data to be passed to the callback.
                     */
                    getData: function getData() {

                        return this._data;
                    },

                    /**
                     * Initialises the instance.
                     *
                     * @method _initialise
                     * @param {any} data The data to be passed to the callback.
                     * @chainable
                     * @protected
                     */
                    _initialise: function _initialise(data) {

                        /**
                         * Whether the event should stop propagating.
                         *
                         * @property _isImmediatePropagationStopped
                         * @type Boolean
                         * @private
                         */
                        this._isImmediatePropagationStopped = false;

                        /**
                         * The data to be passed to the callback.
                         *
                         * @property _data
                         * @type any
                         * @private
                         */
                        this._data = data;

                        return this;
                    }
                },

                create = function create(data) {

                    return pocketKnife.create(prototype)._initialise(data);
                };

            return create;
        }()),

        /**
         * A base class providing publish/subscribe functionality. A publisher must inherit this class.
         *
         * @class listenable
         * @constructor
         */
        prototype = {

            /**
             * Adds a listener.
             *
             * @method on
             * @param {String} eventName The name of the event.
             * @param {Function} callback The function to call when the event occurs. `this` will be bound to the listenable.
             *   @param {client.support.event} callback.event The event helper.
             *   @param {any} [callback.extraArguments] The zero or more extra arguments passed to {{#crossLink "client.support.listenable/trigger:method"}}listenable.trigger{{/crossLink}}.
             * @param {any} [data] The data to be passed to the callback. See {{#crossLink "client.support.event/getData:method"}}event.getData{{/crossLink}}.
             * @param {Boolean} [isOneTimeListener=false] Whether the listener is a onetime listener.
             */
            on: function on(eventName, callback, data, isOneTimeListener) {

                var listeners = this._listeners.get(eventName);

                if (!listeners) {

                    listeners = vector();
                    this._listeners.set(eventName, listeners);
                }

                listeners.push({ callback: callback, data: data, isOneTimeListener: isOneTimeListener || false });
            },

            /**
             * Adds a onetime listener. Equivalent to `on(<eventName>, <callback>, <data>, true)`.
             *
             * @method one
             * @param {String} eventName The name of the event.
             * @param {Function} callback The function to call when the event occurs. `this` will be bound to the listenable.
             *   @param {client.support.event} callback.event The event helper.
             *   @param {any} [callback.extraArguments] The zero or more extra arguments passed to {{#crossLink "client.support.listenable/trigger:method"}}listenable.trigger{{/crossLink}}.
             * @param {any} [data] The data to be passed to the callback. See {{#crossLink "client.support.event/getData:method"}}event.getData{{/crossLink}}.
             */
            one: function one(eventName, callback, data) {

                this.on(eventName, callback, data, true);
            },

            /**
             * Resets the listenable to its initial state.
             *
             * @method _reset
             * @private
             */
            _reset: function _reset() {

                /**
                 * The listeners.
                 *
                 * @property _listeners
                 * @type client.support.map
                 * @private
                 */
                this._listeners = map();
            },

            /**
             * <p>Removes a listener/listeners.</p>
             *
             * <h4>The following combinations are allowed:</h4>
             * <dl>
             *   <dt>`eventName` and `callback` are undefined</dt>
             *   <dd>Removes all listeners.</dd>
             *   <dt>`eventName` is defined</dt>
             *   <dd>Removes all listeners for the specified event name.</dd>
             *   <dt>`eventName` and `callback` are defined</dt>
             *   <dd>Removes the specified listener.</dd>
             * </dl>
             *
             * @method off
             * @param {String} [eventName] The name of the event.
             * @param {Function} [callback] The callback.
             */
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

            /**
             * Triggers an event.
             *
             * @method trigger
             * @param {String} eventName The name of the event.
             * @param {any} [extraArguments] The zero or more extra arguments to be passed to the callbacks.
             * @return {Boolean} Whether the event was allowed to propagate.
             */
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

                    if (listener.callback.apply(that, [ vnt ].concat(rgmnts)) === false || vnt.isImmediatePropagationStopped()) {

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

            /**
             * A helper method for creating a super method.
             *
             * @method _superior
             * @param {String} methodName The name of the method.
             * @return {Function} The super method.
             * @protected
             * @example
             *     var myListenable = function myListenable() {
             *
             *         "use strict";
             *
             *         var instance = listenable(), //inherit listenable
             *             super_trigger = instance._superior("trigger"), //create the trigger super method
             *
             *             //my trigger
             *             trigger = function trigger() {
             *
             *                 super_trigger(); //call it's super method
             *             };
             *
             *         instance.trigger = trigger; //override trigger
             *
             *         return instance;
             *     };
             */
            _superior: function _superior(methodName) {

                return pocketKnife.bind(prototype[methodName], this);
            },

            /**
             * Initialises the instance.
             *
             * @method _initialise
             * @chainable
             * @protected
             */
            _initialise: function _initialise() {

                this._reset();

                return this;
            }
        },

        create = function create() {

            return pocketKnife.create(prototype)._initialise();
        };

    return create;
});

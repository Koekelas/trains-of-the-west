/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var map = require("support/map"),
        vector = require("support/vector"),

        deferred = function deferred() {

            var promise = function promise(dfrrd) {

                    var instance = {},

                        then = function then(onResolve, onReject) {

                            dfrrd.then(onResolve, onReject);

                            return instance;
                        };

                    instance.then = then;

                    return instance;
                },

                states = {

                    PENDING: 0,
                    RESOLVED: 1,
                    REJECTED: 2
                },
                state = states.PENDING,
                result,
                listeners = map(),
                instance = {},

                notifyRelevantListeners = function notifyRelevantListeners() {

                    var lstnrs = state === states.RESOLVED ? listeners.get("resolve") : listeners.get("reject");

                    if (!lstnrs) {

                        return;
                    }

                    lstnrs.each(function eachListener(listener) {

                        listener(result);
                    });
                    listeners = map();
                },

                fulfil = function fulfil(canSatisfy, rslt) {

                    if (state !== states.PENDING) {

                        return;
                    }

                    state = canSatisfy ? states.RESOLVED : states.REJECTED;
                    result = rslt;
                    notifyRelevantListeners();
                },

                resolve = function resolve(value) {

                    fulfil(true, value);
                },

                reject = function reject(reason) {

                    fulfil(false, reason);
                },

                addListener = function addListener(eventName, callback) {

                    var lstnrs = listeners.get(eventName);

                    if (!lstnrs) {

                        lstnrs = vector();
                        listeners.set(eventName, lstnrs);
                    }

                    lstnrs.push(callback);

                    if (state !== states.PENDING) {

                        notifyRelevantListeners();
                    }
                },

                then = function then(onResolve, onReject) {

                    if (onResolve) {

                        addListener("resolve", onResolve);
                    }

                    if (onReject) {

                        addListener("reject", onReject);
                    }

                    return instance;
                },

                getPure = function getPure() {

                    return promise(instance);
                };

            instance.resolve = resolve;
            instance.reject = reject;
            instance.then = then;
            instance.getPure = getPure;

            return instance;
        };

    return deferred;
});

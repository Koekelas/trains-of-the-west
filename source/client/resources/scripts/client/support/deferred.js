/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var map = require("support/map"),
        pocketKnife = require("support/pocketKnife"),
        vector = require("support/vector"),

        deferred = function deferred() {

            var promise = function promise(dfrrd) {

                    var instance = {},

                        then = function then(onFufil, onReject) {

                            dfrrd.then(onFufil, onReject);

                            return instance;
                        };

                    instance.then = then;

                    return instance;
                },

                states = {

                    PENDING: 0,
                    FUFILLED: 1,
                    REJECTED: 2
                },
                state = states.PENDING,
                result,
                listeners = map(),
                instance = {},

                notifyRelevantListeners = function notifyRelevantListeners() {

                    var lstnrs = state === states.FUFILLED ? listeners.get("fufil") : listeners.get("reject");

                    if (!lstnrs) {

                        return;
                    }

                    lstnrs.each(function eachListener(listener) {

                        listener(result);
                    });
                    listeners = map();
                },

                resolve = function resolve(canFufil, rslt) {

                    if (state !== states.PENDING) {

                        return;
                    }

                    state = canFufil ? states.FUFILLED : states.REJECTED;
                    result = rslt;
                    notifyRelevantListeners();
                },

                fufil = function fufil(value) {

                    resolve(true, value);
                },

                reject = function reject(reason) {

                    resolve(false, reason);
                },

                addListener = function addListener(eventName, callback) {

                    var lstnrs = listeners.get(eventName);

                    if (!lstnrs) {

                        lstnrs = vector();
                        listeners.set(eventName, lstnrs);
                    }

                    lstnrs.push(callback);

                    if (state !== states.PENDING) {

                        pocketKnife.nextTick(function onNextTick() {

                            notifyRelevantListeners();
                        });
                    }
                },

                then = function then(onFufil, onReject) {

                    if (pocketKnife.isFunction(onFufil)) {

                        addListener("fufil", onFufil);
                    }

                    if (pocketKnife.isFunction(onReject)) {

                        addListener("reject", onReject);
                    }

                    return instance;
                },

                getPure = function getPure() {

                    return promise(instance);
                };

            instance.fufil = fufil;
            instance.reject = reject;
            instance.then = then;
            instance.getPure = getPure;

            return instance;
        };

    return deferred;
});

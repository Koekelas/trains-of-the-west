/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var messageKeys = require("game/constants").messageKeys,
        SockJS = require("sockjs"),
        listenable = require("support/listenable"),
        browser = require("support/browser"),
        vector = require("support/vector"),
        logger = require("utilities/logger"),

        connection = function connection() {

            var cnnctn,
                isStblshng = false,
                isPn = false,
                queue = vector(),
                instance = listenable(),
                super_trigger = instance.superior("trigger"),

                trigger = function trigger(eventName, data) {

                    if (isPn) {

                        cnnctn.send(JSON.stringify([ eventName, data ]));
                    } else {

                        queue.push({ eventName: eventName, data: data });
                    }
                },

                isEstablishing = function isEstablishing() {

                    return isStblshng;
                },

                isOpen = function isOpen() {

                    return isPn;
                },

                getMessage = function getMessage(data) {

                    var message;

                    try {

                        data = JSON.parse(data);
                        message = {

                            type: data[messageKeys.TYPE],
                            data: data[messageKeys.DATA]
                        };
                    } catch (exception) {

                        logger.logError("message is ill-formed");
                        logger.logError(exception.message, 1);
                    }

                    return message;
                },

                processQueue = function processQueue() {

                    queue.each(function eachMessage(message) {

                        trigger(message.eventName, message.data);
                    });
                    queue = vector();
                },

                addListeners = function addListeners() {

                    cnnctn.onopen = function onOpen() {

                        isStblshng = false;
                        isPn = true;
                        cnnctn.onmessage = function onMessage(event) {

                            var message = getMessage(event.data);

                            if (message && message.type !== undefined) {

                                super_trigger(message.type, message.data);
                            }
                        };
                        processQueue();
                        super_trigger("open");
                    };
                    cnnctn.onclose = function onClose() {

                        isStblshng = isPn = false;
                        super_trigger("close");
                    };
                },

                constructUrl = function constructUrl() {

                    var hostname = window.location.hostname,
                        url = "//" + hostname;

                    if (hostname === "totw-nicodeja.rhcloud.com" && browser.isWebSocketSupported()) {

                        url += ":";

                        if (window.location.protocol === "https:") {

                            url += "8443";
                        } else {

                            url += "8000";
                        }
                    }

                    url += "/totw";

                    return url;
                },

                make = function make() {

                    cnnctn = new SockJS(constructUrl());
                    addListeners();
                    isStblshng = true;
                };

            instance.trigger = trigger;
            instance.isEstablishing = isEstablishing;
            instance.isOpen = isOpen;
            instance.make = make;

            return instance;
        };

    return connection();
});

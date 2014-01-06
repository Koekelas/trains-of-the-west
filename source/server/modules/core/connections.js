/*jslint node: true, plusplus: true, nomen: true*/

"use strict";

var messageKeys = require("../game/constants").messageKeys,
    sockjs = require("sockjs"),
    listenable = require("../support/listenable"),
    map = require("../support/map"),
    logger = require("../utilities/logger"),

    connections = function connections() {

        var sockJsServer,
            cnnctns = map(),
            instance = listenable(),
            super_trigger = instance._superior("trigger"),

            send = function send(connection, message) {

                connection.write(message);
            },

            unicast = function unicast(connectionId, message) {

                var connection = cnnctns.get(connectionId);

                if (connection) {

                    send(connection, message);
                }
            },

            broadcast = function broadcast(message) {

                cnnctns.each(function eachConnection(connection) {

                    send(connection, message);
                });
            },

            trigger = function trigger(eventName, data, connectionId) {

                var message = JSON.stringify([ eventName, data ]);

                if (connectionId !== undefined) {

                    unicast(connectionId, message);
                } else {

                    broadcast(message);
                }
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
                    logger.group();
                    logger.logError(exception.message);
                    logger.ungroup();
                }

                return message;
            },

            addListeners = function addListeners() {

                sockJsServer.on("connection", function onConnection(connection) {

                    cnnctns.set(connection.id, connection);
                    connection.on("data", function onData(data) {

                        var message = getMessage(data);

                        if (message && message.type !== undefined) {

                            super_trigger(message.type, message.data, connection.id);
                        }
                    });
                    connection.on("close", function onClose() {

                        cnnctns.erase(connection.id);
                    });
                });
            },

            make = function make(httpServer) {

                var config = {

                    sockjs_url: "//cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min.js",
                    prefix: "/totw",

                    log: function log(severity, message) {

                        var svrty;

                        switch (severity) {

                        case "error":

                            svrty = logger.severities.ERROR;

                            break;
                        case "info":

                            svrty = logger.severities.INFORMATION;

                            break;
                        case "debug":

                            svrty = logger.severities.DEBUG;

                            break;
                        }

                        logger.log("SOCKJS - " + message, svrty);
                    }
                };

                sockJsServer = sockjs.createServer(config);
                sockJsServer.installHandlers(httpServer);
                addListeners();
            };

        instance.trigger = trigger;
        instance.make = make;

        return instance;
    };

module.exports = connections();

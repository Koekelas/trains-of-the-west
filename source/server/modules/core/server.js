/*jslint node: true, plusplus: true*/

"use strict";

var http = require("http"),
    sttc = require("node-static"),
    connections = require("./connections"),
    terrain = require("../entities/terrain"),
    logger = require("../utilities/logger"),

    server = function server() {

        var HOSTNAME = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
            PORT = process.env.OPENSHIFT_NODEJS_PORT || 80,
            httpServer,
            staticServer,
            entities = [],
            instance = {},

            addListeners = function addListeners() {

                httpServer.on("request", function onRequest(request, response) {

                    staticServer.serve(request, response);
                });
            },

            initialise = function initialise() {

                httpServer = http.createServer();
                staticServer = new sttc.Server("./public");
                addListeners();
                connections.make(httpServer); //after addListeners()!
                entities.push(terrain());
                httpServer.listen(PORT, HOSTNAME);
                logger.logInformation("listening on http://" + HOSTNAME + ":" + PORT);
            };

        initialise();

        return instance;
    };

module.exports = server;

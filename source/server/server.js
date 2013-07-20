/**
 * @license Trains Of The West Copyright (c) 2012-2013 by Bart Coppens (art) and Nicolas De Jaeghere (code), All Rights Reserved.
 */

/*jslint node: true, plusplus: true*/

"use strict";

var server = require("./modules/core/server"),
    logger = require("./modules/utilities/logger"),

    app = function app() {

        var main = function main() {

                server();
            },

            initialise = function initialise() {

                var logLevel;

                switch (process.argv[2]) {

                case "error":

                    logLevel = logger.logLevels.ERROR;

                    break;
                case "information":

                    logLevel = logger.logLevels.INFORMATION;

                    break;
                case "debug":

                    logLevel = logger.logLevels.DEBUG;

                    break;
                }

                if (logLevel !== undefined) {

                    logger.setLevel(logLevel);
                }

                main();
            };

        initialise();
    };

app();

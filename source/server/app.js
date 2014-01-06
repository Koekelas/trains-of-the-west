/**
 * @license Trains of the West Copyright (c) 2012-2014 by Bart Coppens (art) and Nicolas De Jaeghere (code), All Rights Reserved.
 * https://github.com/Koekelas/trains-of-the-west/blob/master/LICENSE
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

                var severity;

                switch (process.argv[2]) {

                case "error":

                    severity = logger.severities.ERROR;

                    break;
                case "information":

                    severity = logger.severities.INFORMATION;

                    break;
                case "debug":

                    severity = logger.severities.DEBUG;

                    break;
                }

                if (severity !== undefined) {

                    logger.setSeverity(severity);
                }

                main();
            };

        initialise();
    };

app();

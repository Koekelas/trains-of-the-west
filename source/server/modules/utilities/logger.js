/*jslint node: true, plusplus: true*/

"use strict";

var logger = function logger() {

    var logLevels = {

            ERROR: 0,
            INFORMATION: 1,
            DEBUG: 2
        },
        ONE_TAB = "  ",
        level = logLevels.DEBUG,
        instance = {},

        log = function log(lvl, message, numberOfIntendations) {

            //>>excludeStart("release", pragmas.release);
            if (console && console.log) {

                if (lvl <= level) {

                    var levelPrefix,
                        i,
                        intendation = "";

                    numberOfIntendations = numberOfIntendations || 0;

                    switch (lvl) {

                    case logLevels.ERROR:

                        levelPrefix = "[ ERROR ] ";

                        break;
                    case logLevels.INFORMATION:

                        levelPrefix = "[ INFO  ] ";

                        break;
                    case logLevels.DEBUG:

                        levelPrefix = "[ DEBUG ] ";

                        break;
                    }

                    for (i = 0; i < numberOfIntendations; ++i) {

                        intendation += ONE_TAB;
                    }

                    console.log(levelPrefix + intendation + message);
                }
            }
            //>>excludeEnd("release");
        },

        logError = function logError(message, numberOfIntendations) {

            log(logLevels.ERROR, message, numberOfIntendations);
        },

        logInformation = function logInformation(message, numberOfIntendations) {

            log(logLevels.INFORMATION, message, numberOfIntendations);
        },

        logDebug = function logDebug(message, numberOfIntendations) {

            log(logLevels.DEBUG, message, numberOfIntendations);
        },

        setLevel = function setLevel(lvl) {

            level = lvl;
        };

    instance.logLevels = logLevels;
    instance.log = log;
    instance.logError = logError;
    instance.logInformation = logInformation;
    instance.logDebug = logDebug;
    instance.setLevel = setLevel;

    return instance;
};

module.exports = logger();

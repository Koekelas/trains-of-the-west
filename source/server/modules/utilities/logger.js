/*jslint node: true, plusplus: true*/

"use strict";

var logger = function logger() {

    var severeties = {

            ERROR: 0,
            INFORMATION: 1,
            DEBUG: 2
        },
        TAB = "  ",
        currentSeverety = severeties.DEBUG,
        currentGroup = 0,
        intendation,
        instance = {},

        log = function log(message, severity) {

            //>>excludeStart("clientRelease", pragmas.clientRelease);
            if (!(console && console.log)) {

                return;
            }

            var prefix;

            if (severity !== undefined) {

                if (severity > currentSeverety) {

                    return;
                }

                switch (severity) {

                case severeties.ERROR:

                    prefix = "[ ERROR ] ";

                    break;
                case severeties.INFORMATION:

                    prefix = "[ INFO  ] ";

                    break;
                case severeties.DEBUG:

                    prefix = "[ DEBUG ] ";

                    break;
                }
            }

            if (prefix === undefined) {

                prefix = "";
            }

            console.log(prefix + intendation + message);
            //>>excludeEnd("clientRelease");
        },

        logError = function logError(message) {

            log(message, severeties.ERROR);
        },

        logInformation = function logInformation(message) {

            log(message, severeties.INFORMATION);
        },

        logDebug = function logDebug(message) {

            log(message, severeties.DEBUG);
        },

        rebuildIntendation = function rebuildIntendation() {

            var numberOfTimesLeft = currentGroup;

            intendation = "";

            while (numberOfTimesLeft > 0) {

                intendation += TAB;
                --numberOfTimesLeft;
            }
        },

        group = function group() {

            ++currentGroup;
            rebuildIntendation();
        },

        ungroup = function ungroup() {

            if (currentGroup <= 0) {

                return;
            }

            --currentGroup;
            rebuildIntendation();
        },

        setSeverety = function setSeverety(severity) {

            currentSeverety = severity;
        },

        initialise = function initialise() {

            rebuildIntendation();
        };

    instance.severeties = severeties;
    instance.log = log;
    instance.logError = logError;
    instance.logInformation = logInformation;
    instance.logDebug = logDebug;
    instance.setSeverety = setSeverety;
    instance.group = group;
    instance.ungroup = ungroup;
    initialise();

    return instance;
};

module.exports = logger();

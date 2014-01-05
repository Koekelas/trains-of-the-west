/*jslint browser: true, plusplus: true, devel: true*/
/*global define*/

define(function () {

    "use strict";

    var logger = function logger() {

        var severities = {

                ERROR: 0,
                INFORMATION: 1,
                DEBUG: 2
            },
            TAB = "  ",
            currentSeverity = severities.DEBUG,
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

                    if (severity > currentSeverity) {

                        return;
                    }

                    switch (severity) {

                    case severities.ERROR:

                        prefix = "[ ERROR ] ";

                        break;
                    case severities.INFORMATION:

                        prefix = "[ INFO  ] ";

                        break;
                    case severities.DEBUG:

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

                log(message, severities.ERROR);
            },

            logInformation = function logInformation(message) {

                log(message, severities.INFORMATION);
            },

            logDebug = function logDebug(message) {

                log(message, severities.DEBUG);
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

            setSeverity = function setSeverity(severity) {

                currentSeverity = severity;
            },

            initialise = function initialise() {

                rebuildIntendation();
            };

        instance.severities = severities;
        instance.log = log;
        instance.logError = logError;
        instance.logInformation = logInformation;
        instance.logDebug = logDebug;
        instance.setSeverity = setSeverity;
        instance.group = group;
        instance.ungroup = ungroup;
        initialise();

        return instance;
    };

    return logger();
});

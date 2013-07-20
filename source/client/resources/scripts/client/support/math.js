/*jslint browser: true, plusplus: true*/
/*global define*/

define(function () {

    "use strict";

    var math = function math() {

        var ROUNDING_ERROR_TOLERANCE = 0.001,
            instance = {},

            equals = function equals(left, right) {

                return Math.abs(left - right) < ROUNDING_ERROR_TOLERANCE;
            },

            clamp = function clamp(value, minimum, maximum) {

                return Math.max(minimum, Math.min(maximum, value));
            },

            radiansToDegrees = function radiansToDegrees(radians) {

                return radians * (180 / Math.PI);
            },

            degreesToRadians = function degreesToRadians(degrees) {

                return degrees * (Math.PI / 180);
            },

            distance = function distance(x1, y1, x2, y2) {

                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            },

            isInInterval = function isInInterval(value, leftIncluded, rightExcluded) {

                return value >= leftIncluded && value < rightExcluded;
            };

        instance.equals = equals;
        instance.clamp = clamp;
        instance.radiansToDegrees = radiansToDegrees;
        instance.degreesToRadians = degreesToRadians;
        instance.distance = distance;
        instance.isInInterval = isInInterval;

        return instance;
    };

    return math();
});

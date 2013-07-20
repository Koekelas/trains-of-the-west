/*jslint node: true, plusplus: true*/

"use strict";

var directions = require("./constants").directions,

    rotationWalker = function rotationWalker() {

        var NUMBER_OF_ROTATIONS = 8,
            instance = {},

            walk = function walk(rotation, direction, times) {

                times = times !== undefined ? times : 2;
                times %= NUMBER_OF_ROTATIONS;

                switch (direction) {

                case directions.CLOCKWISE:

                    return (rotation + times) % NUMBER_OF_ROTATIONS;
                case directions.COUNTERCLOCKWISE:

                    return (rotation - times + NUMBER_OF_ROTATIONS) % NUMBER_OF_ROTATIONS;
                default:

                    return undefined;
                }
            };

        instance.walk = walk;

        return instance;
    };

module.exports = rotationWalker;

/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var timeInSeconds = require("game/clientConstants").time.inSeconds,

        fpsCounter = function fpsCounter() {

            var timeSinceFpsUpdate = 0,
                frameCount = 0,
                fps,
                minimumFps,
                maximumFps,
                instance = {},

                update = function update(deltaTime) {

                    timeSinceFpsUpdate += deltaTime;
                    ++frameCount;

                    if (timeSinceFpsUpdate >= timeInSeconds.ONE_SECOND) {

                        timeSinceFpsUpdate = 0;
                        fps = frameCount;
                        frameCount = 0;

                        if (minimumFps === undefined || minimumFps > fps) {

                            minimumFps = fps;
                        }

                        if (maximumFps === undefined || maximumFps < fps) {

                            maximumFps = fps;
                        }
                    }
                },

                getFps = function getFps() {

                    return fps;
                },

                getMinimumFps = function getMinimumFps() {

                    return minimumFps;
                },

                getMaximumFps = function getMaximumFps() {

                    return maximumFps;
                };

            instance.update = update;
            instance.getFps = getFps;
            instance.getMinimumFps = getMinimumFps;
            instance.getMaximumFps = getMaximumFps;

            return instance;
        };

    return fpsCounter;
});

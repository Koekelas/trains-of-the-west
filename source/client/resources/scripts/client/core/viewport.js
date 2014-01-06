/*jslint browser: true, plusplus: true, nomen: true*/
/*global define, HTMLElement*/

define(function (require) {

    "use strict";

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        jquery = require("jquery"),
        listenable = require("support/listenable"),
        browser = require("support/browser"),
        vector = require("support/vector"),

        viewport = function viewport() {

            var DESIRED_FPS = 60,
                previousCallbackTime = 0,
                dimensions = {},
                windowElement,
                bodyElement,
                instance = listenable(),
                super_trigger = instance._superior("trigger"),

                enableFullScreen = function enableFullScreen(enable) {

                    if (enable) {

                        vector(["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "webkitRequestFullScreen"])
                            .each(function eachVendorVariation(vendorVariation) {

                                if (bodyElement[vendorVariation] !== undefined) {

                                    bodyElement[vendorVariation]();

                                    return false;
                                }

                                return true;
                            });
                    } else {

                        vector(["exitFullscreen", "mozCancelFullScreen", "webkitExitFullscreen", "webkitCancelFullScreen"])
                            .each(function eachVendorVariation(vendorVariation) {

                                if (document[vendorVariation]) {

                                    document[vendorVariation]();

                                    return false;
                                }

                                return true;
                            });
                    }
                },

                scheduleFrame = function scheduleFrame(callback) {

                    window.requestAnimationFrame(callback);
                },

                isFullScreen = function isFullScreen() {

                    var isFullScrn = false,
                        isFound = false;

                    vector(["fullscreenElement", "mozFullScreenElement", "webkitFullscreenElement"])
                        .each(function eachVendorVariation(vendorVariation) {

                            if (document[vendorVariation] !== undefined) {

                                isFullScrn = !!document[vendorVariation];
                                isFound = true;
                            }

                            return !isFound;
                        });

                    return isFullScrn;
                },

                getWidth = function getWidth() {

                    return dimensions.width;
                },

                getHeight = function getHeight() {

                    return dimensions.height;
                },

                createElements = function createElements() {

                    windowElement = jquery(window);
                    bodyElement = jquery("body").get(0);
                },

                setupRequestAnimationFramePolyfill = function setupRequestAnimationFramePolyfill() {

                    if (window.requestAnimationFrame) {

                        return;
                    }

                    vector(["moz", "ms", "o", "webkit"]).each(function eachVendorPrefix(vendorPrefix) {

                        if (window[vendorPrefix + "RequestAnimationFrame"]) {

                            window.requestAnimationFrame = window[vendorPrefix + "RequestAnimationFrame"];

                            return false;
                        }

                        return true;
                    });

                    if (window.requestAnimationFrame) {

                        return;
                    }

                    window.requestAnimationFrame = function requestAnimationFrame(callback) {

                        var now = Date.now(),
                            sleepTime = Math.max(

                                0,
                                Math.round(timeInMilliseconds.ONE_SECOND / DESIRED_FPS - Math.max(

                                    0,
                                    now - previousCallbackTime
                                ))
                            );

                        window.setTimeout(callback, sleepTime);
                        previousCallbackTime = now + sleepTime;
                    };
                },

                calculateDimensions = function calculateDimensions() {

                    dimensions.width = windowElement.width();
                    dimensions.height = windowElement.height();
                },

                addListeners = function addListeners() {

                    windowElement.on("resize", function onResize() {

                        calculateDimensions();

                        //stop scrolling the window iOS Safari!
                        if (browser.isIOsSafari()) {

                            if (window.pageXOffset !== 0 || window.pageYOffset !== 0) {

                                window.pageXOffset = window.pageYOffset = 0;
                            }
                        }

                        super_trigger("resize");
                    });
                },

                make = function make() {

                    createElements();
                    setupRequestAnimationFramePolyfill();
                    calculateDimensions();
                    addListeners();
                };

            instance.enableFullScreen = enableFullScreen;
            instance.scheduleFrame = scheduleFrame;
            instance.isFullScreen = isFullScreen;
            instance.getWidth = getWidth;
            instance.getHeight = getHeight;
            instance.make = make;

            return instance;
        };

    return viewport();
});

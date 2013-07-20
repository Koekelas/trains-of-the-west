/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        listenable = require("support/listenable"),
        math = require("support/math"),

        image = function image(path, cssClass) {

            var TIME_OUT_TIME = 60000,
                PIXEL_OFFSET = 4,
                ALPHA_OFFSET = 3,
                mg,
                timeOutTimer,
                isRdy = false,
                width,
                height,
                opacityMap,
                instance = listenable(),
                super_trigger = instance.superior("trigger"),

                generateCss = function generateCss() {

                    var css = ".";

                    css += cssClass;
                    css += "{position:absolute;width:";
                    css += width;
                    css += "px;height:";
                    css += height;
                    css += "px;background:url(";
                    css += path;
                    css += ");}";

                    return css;
                },

                isReady = function isReady() {

                    return isRdy;
                },

                findIndex = function findIndex(pixel) {

                    var isFound = false,
                        map = opacityMap.map,
                        i,
                        minimum = 0,
                        maximum = map.length - 2; //ignore the last opacity change, it's a fake one and it's only there to simplify this algorithm

                    while (!isFound) {

                        i = Math.floor((minimum + maximum) / 2);

                        if (map[i] < pixel) {

                            if (math.isInInterval(pixel, map[i], map[i + 1])) {

                                isFound = true;
                            } else {

                                minimum = i + 1;
                            }
                        } else if (map[i] > pixel) {

                            maximum = i - 1;
                        } else {

                            isFound = true;
                        }
                    }

                    return i;
                },

                isOpaque = function isOpaque(x, y) {

                    if (math.isInInterval(x, 0, width) && math.isInInterval(y, 0, height)) {

                        var isIndexEven = !(findIndex(y * width + x) % 2),
                            startsOpaque = opacityMap.startsOpaque;

                        if ((isIndexEven && startsOpaque) || (!isIndexEven && !startsOpaque)) {

                            return true;
                        }
                    }

                    return false;
                },

                getPath = function getPath() {

                    return path;
                },

                getWidth = function getWidth() {

                    return width;
                },

                getHeight = function getHeight() {

                    return height;
                },

                getCssClass = function getCssClass() {

                    return cssClass;
                },

                isPixelOpaque = function isPixelOpaque(pixelBuffer, pixel) {

                    return pixelBuffer[pixel + ALPHA_OFFSET] !== 0;
                },

                addOpacityChange = function addOpacityChange(map, runLength) {

                    if (map.length > 0) {

                        map.push(map[map.length - 1] + runLength);
                    } else {

                        map.push(runLength);
                    }
                },

                generateOpacityMap = function generateOpacityMap() {

                    var canvasElement = jquery("<canvas>"),
                        canvasContext,
                        pixelBuffer,
                        wasPreviousPixelOpaque,
                        map = [],
                        subPixel,
                        numberOfSubPixels,
                        runLength = 1;

                    canvasElement.prop({ width: width, height: height });
                    canvasContext = canvasElement.get(0).getContext("2d");
                    canvasContext.drawImage(mg, 0, 0);
                    pixelBuffer = canvasContext.getImageData(0, 0, width, height).data;
                    opacityMap = { startsOpaque: isPixelOpaque(pixelBuffer, 0), map: map };
                    wasPreviousPixelOpaque = opacityMap.startsOpaque;
                    addOpacityChange(map, 0);

                    for (subPixel = PIXEL_OFFSET, numberOfSubPixels = pixelBuffer.length; subPixel < numberOfSubPixels; subPixel += PIXEL_OFFSET) {

                        if (isPixelOpaque(pixelBuffer, subPixel) === wasPreviousPixelOpaque) {

                            ++runLength;
                        } else {

                            wasPreviousPixelOpaque = !wasPreviousPixelOpaque;
                            addOpacityChange(map, runLength);
                            runLength = 1;
                        }
                    }

                    addOpacityChange(map, runLength);
                    addOpacityChange(map, 1);
                },

                onReady = function onReady() {

                    width = mg.width;
                    height = mg.height;
                    generateOpacityMap();
                    mg = undefined;
                    isRdy = true;
                    super_trigger("ready");
                },

                onLoad = function onLoad() {

                    window.clearTimeout(timeOutTimer);
                    onReady();
                },

                addListeners = function addListeners() {

                    jquery(mg).one("load", onLoad);
                },

                removeListeners = function removeListeners() {

                    jquery(mg).one("load", onLoad);
                },

                make = function make() {

                    mg = new Image();
                    addListeners();
                    mg.src = path;
                    timeOutTimer = window.setTimeout(function onTimeOut() {

                        //maybe the image did load but the load event didn't fire?
                        if (mg.width > 0) {

                            removeListeners();
                            onReady();
                        } else {

                            super_trigger("error");
                        }
                    }, TIME_OUT_TIME);
                };

            instance.generateCss = generateCss;
            instance.isReady = isReady;
            instance.isOpaque = isOpaque;
            instance.getPath = getPath;
            instance.getWidth = getWidth;
            instance.getHeight = getHeight;
            instance.getCssClass = getCssClass;
            instance.make = make;

            return instance;
        };

    return image;
});

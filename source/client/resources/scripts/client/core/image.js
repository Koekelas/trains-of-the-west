/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        jquery = require("jquery"),
        listenable = require("support/listenable"),
        math = require("support/math"),
        pocketKnife = require("support/pocketKnife"),

        PIXEL_OFFSET = 4,
        ALPHA_OFFSET = 3,
        CSS = ".{{cssClass}}{position:absolute;width:{{width}}px;height:{{height}}px;background:url({{path}});}",

        prototype = listenable(),

        create = function create(path, cssClass) {

            return pocketKnife.create(prototype)._initialise(path, cssClass);
        };

    prototype.generateCss = function generateCss() {

        return CSS
            .replace("{{cssClass}}", this._cssClass)
            .replace("{{width}}", this._imageElement.width)
            .replace("{{height}}", this._imageElement.height)
            .replace("{{path}}", this._path);
    };

    prototype.isReady = function isReady() {

        return this._isReady;
    };

    prototype._findIndex = function _findIndex(pixel) {

        var isFound = false,
            map = this._opacityMap.map,
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
    };

    prototype.isOpaque = function isOpaque(x, y) {

        if (math.isInInterval(x, 0, this._imageElement.width) && math.isInInterval(y, 0, this._imageElement.height)) {

            var isIndexEven = !(this._findIndex(y * this._imageElement.width + x) % 2),
                startsOpaque = this._opacityMap.startsOpaque;

            if ((isIndexEven && startsOpaque) || (!isIndexEven && !startsOpaque)) {

                return true;
            }
        }

        return false;
    };

    prototype.getPath = function getPath() {

        return this._path;
    };

    prototype.getWidth = function getWidth() {

        return this._imageElement.width;
    };

    prototype.getHeight = function getHeight() {

        return this._imageElement.height;
    };

    prototype.getCssClass = function getCssClass() {

        return this._cssClass;
    };

    prototype._isPixelOpaque = function _isPixelOpaque(pixelBuffer, pixel) {

        return pixelBuffer[pixel + ALPHA_OFFSET] !== 0;
    };

    prototype._addOpacityChange = function _addOpacityChange(map, runLength) {

        if (map.length > 0) {

            map.push(map[map.length - 1] + runLength);
        } else {

            map.push(runLength);
        }
    };

    prototype._generateOpacityMap = function _generateOpacityMap() {

        var canvasElement = jquery("<canvas>"),
            width = this._imageElement.width,
            height = this._imageElement.height,
            canvasContext,
            pixelBuffer,
            wasPreviousPixelOpaque,
            map = [],
            subPixel,
            numberOfSubPixels,
            runLength = 1;

        canvasElement.prop({ width: width, height: height });
        canvasContext = canvasElement.get(0).getContext("2d");
        canvasContext.drawImage(this._imageElement, 0, 0);
        pixelBuffer = canvasContext.getImageData(0, 0, width, height).data;
        wasPreviousPixelOpaque = this._isPixelOpaque(pixelBuffer, 0);
        this._addOpacityChange(map, 0);

        for (

            subPixel = PIXEL_OFFSET, numberOfSubPixels = pixelBuffer.length;
            subPixel < numberOfSubPixels;
            subPixel += PIXEL_OFFSET
        ) {

            if (this._isPixelOpaque(pixelBuffer, subPixel) === wasPreviousPixelOpaque) {

                ++runLength;
            } else {

                wasPreviousPixelOpaque = !wasPreviousPixelOpaque;
                this._addOpacityChange(map, runLength);
                runLength = 1;
            }
        }

        this._addOpacityChange(map, runLength);
        this._addOpacityChange(map, 1); //fake one, terminates the real last one
        this._opacityMap = { startsOpaque: this._isPixelOpaque(pixelBuffer, 0), map: map };
    };

    prototype._addListeners = function _addListeners() {

        var that = this;

        jquery(this._imageElement).one("load", function onLoad() {

            window.clearTimeout(that._timeOutTimerId);
            that._generateOpacityMap();
            that._isReady = true;
            that.trigger("ready");
        });
    };

    prototype._initialise = function _initialise(path, cssClass) {

        var that = this;

        this._superior("_initialise")();
        this._path = path;
        this._cssClass = cssClass;
        this._imageElement = new Image();
        this._isReady = false;
        this._addListeners();
        pocketKnife.nextTick(function onNextTick() {

            that._imageElement.src = that._path;
            that._timeOutTimerId = window.setTimeout(function onTimeOut() {

                that.trigger("error");
            }, timeInMilliseconds.ONE_MINUTE);
        });

        return this;
    };

    return create;
});

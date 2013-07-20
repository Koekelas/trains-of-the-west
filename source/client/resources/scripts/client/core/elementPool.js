/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        element = require("core/element"),
        layerManager = require("core/layerManager"),
        mouse = require("input/mouse"),
        vector = require("support/vector"),

        elementPool = function elementPool() {

            var acquiredElements,
                pooledElements,
                styleElement,
                elementsElement,
                instance = {},

                acquireElement = function acquireElement() {

                    var lmnt;

                    if (pooledElements.getLength() > 0) {

                        lmnt = pooledElements.pop();
                    } else {

                        lmnt = element();
                    }

                    acquiredElements.push(lmnt);

                    return lmnt;
                },

                releaseElement = function releaseElement(lmnt) {

                    acquiredElements.each(function eachElement(e, index) {

                        if (e === lmnt) {

                            acquiredElements.erase(index);
                            e.reset();
                            pooledElements.push(e);

                            return false;
                        }

                        return true;
                    });
                },

                getNumberOfElements = function getNumberOfElements() {

                    return acquiredElements.getLength() + pooledElements.getLength();
                },

                getNumberOfAcquiredElements = function getNumberOfAcquiredElements() {

                    return acquiredElements.getLength();
                },

                getNumberOfPooledElements = function getNumberOfPooledElements() {

                    return pooledElements.getLength();
                },

                createElements = function createElements() {

                    styleElement = jquery("<style>");
                    styleElement.prop("type", "text/css");
                    styleElement.html(".displayNone{display:none;}");
                    jquery("head").append(styleElement);
                    elementsElement = jquery("<div>");
                    elementsElement.prop("id", "elements");
                    elementsElement.addClass("layer");
                    elementsElement.css("z-index", layerManager.getLayer("default"));
                    jquery("#gui").before(elementsElement);
                },

                onClick,

                removeListeners = function removeListeners() {

                    mouse.off("click", onClick);
                },

                addListeners = function addListeners() {

                    removeListeners();
                    mouse.on("click", onClick);
                },

                reset = function reset() {

                    acquiredElements = vector();
                    pooledElements = vector();
                    elementsElement.empty();
                    addListeners();
                },

                make = function make() {

                    createElements();
                    reset();
                };

            /*jslint unparam: true*/
            onClick = function onClick(event, ms) {

                acquiredElements.sort(function sortLayerDescending(leftElement, rightElement) {

                    return rightElement.getLayer() - leftElement.getLayer();
                });
                acquiredElements.each(function eachElement(lmnt) {

                    return lmnt.trigger("click", ms);
                });
            };
            /*jslint unparam: false*/

            instance.acquireElement = acquireElement;
            instance.releaseElement = releaseElement;
            instance.getNumberOfElements = getNumberOfElements;
            instance.getNumberOfAcquiredElements = getNumberOfAcquiredElements;
            instance.getNumberOfPooledElements = getNumberOfPooledElements;
            instance.reset = reset;
            instance.make = make;

            return instance;
        };

    return elementPool();
});

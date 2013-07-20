/*jslint browser: true, plusplus: true*/
/*global define, Raphael*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        layerManager = require("core/layerManager"),
        viewport = require("core/viewport"),

        overlay = function overlay() {

            var overlayElement,
                paper,
                instance = {},

                createPath = function createPath(specification) {

                    return paper.path(specification);
                },

                createSet = function createSet() {

                    return paper.set();
                },

                createElements = function createElements() {

                    overlayElement = jquery("<div>");
                    overlayElement.prop("id", "overlay");
                    overlayElement.addClass("layer");
                    overlayElement.css("z-index", layerManager.getLayer("overlay"));
                    jquery("#gui").before(overlayElement);
                    paper = Raphael(overlayElement.get(0), viewport.getWidth(), viewport.getHeight());
                },

                onResize = function onResize() {

                    paper.setSize(viewport.getWidth(), viewport.getHeight());
                },

                removeListeners = function removeListeners() {

                    viewport.off("resize", onResize);
                },

                addListeners = function addListeners() {

                    removeListeners();
                    viewport.on("resize", onResize);
                },

                reset = function reset() {

                    paper.clear();
                    addListeners();
                },

                make = function make() {

                    createElements();
                    reset();
                };

            instance.createPath = createPath;
            instance.createSet = createSet;
            instance.reset = reset;
            instance.make = make;

            return instance;
        };

    return overlay();
});

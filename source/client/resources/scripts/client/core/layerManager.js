/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var pocketKnife = require("support/pocketKnife"),
        logger = require("utilities/logger"),

        layerManager = function layerManager() {

            var DEFAULT_LAYERS = {

                    "default": 0,
                    "overlay": 10000,
                    "gui": 10001
                },
                layers,
                instance = {},

                setLayer = function setLayer(name, depth) {

                    layers[name] = depth;
                },

                getLayer = function getLayer(name) {

                    if (layers[name] === undefined) {

                        logger.logError("layer \"" + name + "\" is undefined");
                    }

                    return layers[name];
                },

                reset = function reset() {

                    layers = pocketKnife.clone(DEFAULT_LAYERS);
                },

                initialise = function initialise() {

                    reset();
                };

            instance.setLayer = setLayer;
            instance.getLayer = getLayer;
            instance.reset = reset;
            initialise();

            return instance;
        };

    return layerManager();
});

/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        elementPool = require("core/elementPool"),
        mouse = require("input/mouse"),
        fpsCounter = require("utilities/fpsCounter"),

        statistics = function statistics() {

            var CANVAS_WIDTH = 1000,
                CANVAS_HEIGHT = 19,
                fpsCntr = fpsCounter(),
                canvasElement,
                canvasContext,
                instance = {},

                createElements = function createElements() {

                    canvasElement = jquery("<canvas>");
                    canvasElement.css({

                        "position": "absolute",
                        "top": "10px",
                        "left": "10px",
                        "width": CANVAS_WIDTH + "px",
                        "height": CANVAS_HEIGHT + "px",
                        "border": "1px solid #000",
                        "padding": "5px",
                        "background": "#fff"
                    });
                    canvasElement.prop({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });
                    canvasContext = canvasElement.get(0).getContext("2d");
                    canvasContext.font = "16px Verdana, sans-serif";
                    canvasContext.textBaseline = "middle";
                    canvasContext.fillStyle = "#000";
                    jquery("#gui").append(canvasElement);
                },

                activate = function activate() {

                    createElements();
                },

                updateElements = function updateElements(cameraDesc, deltaTime) {

                    var sttstcs = "fps: ";

                    fpsCntr.update(deltaTime);
                    sttstcs += fpsCntr.getFps();
                    sttstcs += " min: ";
                    sttstcs += fpsCntr.getMinimumFps();
                    sttstcs += " max: ";
                    sttstcs += fpsCntr.getMaximumFps();
                    sttstcs += " dt: ";
                    sttstcs += deltaTime;
                    sttstcs += " cx: ";
                    sttstcs += cameraDesc.x;
                    sttstcs += " cy: ";
                    sttstcs += cameraDesc.y;
                    sttstcs += " cz: ";
                    sttstcs += cameraDesc.zoom;
                    sttstcs += " cr: ";
                    sttstcs += cameraDesc.rotation;
                    sttstcs +=  " vw: ";
                    sttstcs += cameraDesc.viewportWidth;
                    sttstcs += " vh: ";
                    sttstcs += cameraDesc.viewportHeight;
                    sttstcs += " mx: ";
                    sttstcs += mouse.getX();
                    sttstcs += " my: ";
                    sttstcs += mouse.getY();
                    sttstcs += " e: ";
                    sttstcs += elementPool.getNumberOfElements();
                    sttstcs += " a: ";
                    sttstcs += elementPool.getNumberOfAcquiredElements();
                    sttstcs += " p: ";
                    sttstcs += elementPool.getNumberOfPooledElements();
                    canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                    canvasContext.fillText(sttstcs, 0, 10);
                },

                update = function update(cameraDesc, deltaTime) {

                    updateElements(cameraDesc, deltaTime);
                },

                destroyElements = function destroyElements() {

                    canvasElement.remove();
                },

                deactivate = function deactivate() {

                    destroyElements();
                };

            instance.activate = activate;
            instance.update = update;
            instance.deactivate = deactivate;

            return instance;
        };

    return statistics;
});

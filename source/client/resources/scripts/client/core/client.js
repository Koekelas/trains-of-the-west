/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        jquery = require("jquery"),
        elementPool = require("core/elementPool"),
        layerManager = require("core/layerManager"),
        overlay = require("core/overlay"),
        resourceManager = require("core/resourceManager"),
        viewport = require("core/viewport"),
        startScene = require("scenes/startScene"),

        client = function client() {

            var time = function time() {

                    var previousNow = Date.now(),
                        instance = {},

                        getDeltaTime = function getDeltaTime() {

                            var now = Date.now(),
                                deltaTime = (now - previousNow) / timeInMilliseconds.ONE_SECOND;

                            previousNow = now;

                            return deltaTime;
                        };

                    instance.getDeltaTime = getDeltaTime;

                    return instance;
                },

                tm = time(),
                scene,
                sceneElement,
                guiElement,
                instance = {},

                wipeSlateClean = function wipeSlateClean() {

                    guiElement.empty();
                },

                setScene = function setScene(scn) {

                    if (scene) {

                        scene.deactivate();
                    }

                    scene = scn;
                    scene.activate();
                },

                run = function run() {

                    viewport.scheduleFrame(run);
                    scene.update(tm.getDeltaTime());
                },

                createElements = function createElements() {

                    sceneElement = jquery("<div>");
                    sceneElement.prop("id", "scene");
                    sceneElement.addClass("fillViewport");
                    guiElement = jquery("<div>");
                    guiElement.prop("id", "gui");
                    guiElement.addClass("layer");
                    guiElement.css("z-index", layerManager.getLayer("gui"));
                    sceneElement.append(guiElement);
                    jquery("body").append(sceneElement);
                },

                initialise = function initialise() {

                    createElements();
                    resourceManager.make();
                    elementPool.make();
                    viewport.make();
                    overlay.make(); //after elementPool.make() and viewport.make()!
                    setScene(startScene(instance));
                    run();
                };

            instance.wipeSlateClean = wipeSlateClean;
            instance.setScene = setScene;
            initialise();

            return instance;
        };

    return client;
});

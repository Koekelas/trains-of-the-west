/*jslint browser: true, plusplus: true*/
/*global define*/

/**
 * A collection of classes that form the core of every game.
 *
 * @module client/core
 */
define(function (require) {

    "use strict";

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        jquery = require("jquery"),
        connection = require("core/connection"),
        elementPool = require("core/elementPool"),
        layerManager = require("core/layerManager"),
        overlay = require("core/overlay"),
        resourceManager = require("core/resourceManager"),
        viewport = require("core/viewport"),
        mouse = require("input/mouse"),
        keyboard = require("input/keyboard"),
        startScene = require("scenes/startScene"),

        /**
         * Responsible for creating and managing the core DOM structure, starting and resetting the client's subsystems, managing the scene and running the game loop.
         *
         * @class client
         * @constructor
         */
        client = function client() {

                /**
                 * A helper class responsible for calculating the delta time.
                 *
                 * @class time
                 * @constructor
                 */
            var time = function time() {

                        /**
                         * The time in milliseconds when {{#crossLink "time/getDeltaTime:method"}}{{/crossLink}} was last called.
                         *
                         * @property previousNow
                         * @type Number
                         * @private
                         */
                    var previousNow = Date.now(),

                        /**
                         * The instance.
                         *
                         * @property instance
                         * @type Object
                         * @private
                         */
                        instance = {},


                        /**
                         * Calculates the delta time.
                         *
                         * @method getDeltaTime
                         * @return {Number} The time elapsed in seconds since this method was last called.
                         */
                        getDeltaTime = function getDeltaTime() {

                            var now = Date.now(),
                                deltaTime = (now - previousNow) / timeInMilliseconds.ONE_SECOND;

                            previousNow = now;

                            return deltaTime;
                        };

                    instance.getDeltaTime = getDeltaTime;

                    return instance;
                },


                /**
                 * The time instance.
                 *
                 * @property tm
                 * @type time
                 * @private
                 * @for client
                 */
                tm = time(),

                /**
                 * The active scene.
                 *
                 * @property scene
                 * @type Object
                 * @private
                 */
                scene,

                /**
                 * The scene DOM element.
                 *
                 * @property sceneElement
                 * @type jQuery
                 * @private
                 */
                sceneElement,

                /**
                 * The GUI DOM element.
                 *
                 * @property guiElement
                 * @type jQuery
                 * @private
                 */
                guiElement,

                /**
                 * The instance.
                 *
                 * @property instance
                 * @type Object
                 * @private
                 */
                instance = {},


                /**
                 * Resets the client's subsystems to their initial state.
                 *
                 * @method wipeSlateClean
                 */
                wipeSlateClean = function wipeSlateClean() {

                    guiElement.empty();
                    connection.off();
                    viewport.off();
                    mouse.off();
                    resourceManager.reset();
                    overlay.reset();
                    elementPool.reset(); //after mouse.off()!
                    layerManager.reset();
                    keyboard.reset();
                },

                /**
                 * Sets the active scene.
                 *
                 * @method setScene
                 * @param {Object} scn The new active scene.
                 *  @param {Function} scn.update Is called each frame.
                 *   @param {Number} scn.update.deltaTime The time elapsed in seconds since the previous frame started rendering.
                 *  @param {Function} [scn.activate] Is called when `scn` becomes the active scene before `update` is called for the first time.
                 *  @param {Function} [scn.deactivate] Is called when `scn` stops being the active scene after `update` is called for the last time.
                 */
                setScene = function setScene(scn) {

                    if (scene && scene.deactivate) {

                        scene.deactivate();
                    }

                    scene = scn;

                    if (scene.activate) {

                        scene.activate();
                    }
                },

                /**
                 * Schedules a new frame and updates the active scene.
                 *
                 * @method run
                 * @private
                 */
                run = function run() {

                    viewport.scheduleFrame(run);
                    scene.update(tm.getDeltaTime());
                },

                /**
                 * Creates the core DOM structure.
                 *
                 * @method createElements
                 * @private
                 */
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

                /**
                 * Initialises the instance and starts the client's subsystems.
                 *
                 * @method initialise
                 * @private
                 */
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

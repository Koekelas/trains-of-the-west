/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        listenable = require("support/listenable"),
        image = require("core/image"),
        spriteSheet = require("core/spriteSheet"),
        map = require("support/map"),
        pocketKnife = require("support/pocketKnife"),
        logger = require("utilities/logger"),

        resourceManager = function resourceManager() {

            var sequence = function sequence(name) {

                    var id = 0,
                        instance = {},

                        nextValue = function nextValue() {

                            var value = name;

                            value += id;
                            ++id;

                            return value;
                        };

                    instance.nextValue = nextValue;

                    return instance;
                },

                numberOfResources,
                numberOfResourcesReady,
                numberOfResourcesToLoad,
                numberOfResourcesLoaded,
                images,
                cssClassSequence,
                spriteSheets,
                styleElement,
                instance = listenable(),
                super_off = instance._superior("off"),
                super_trigger = instance._superior("trigger"),

                generateCss = function generateCss() {

                    var css = "";

                    images.each(function eachImage(mg) {

                        css += mg.generateCss();
                    });
                    spriteSheets.each(function eachSpriteSheet(spriteSht) {

                        css += spriteSht.generateCss();
                    });
                    styleElement.html(css);
                },

                call = function call(callback, resource) {

                    if (pocketKnife.isFunction(callback)) {

                        callback(resource);
                    }
                },

                onReady = function onReady() {

                    if (numberOfResourcesReady >= numberOfResources) {

                        generateCss();
                    }
                },

                onReadyImage,

                onErrorImage = function onErrorImage() {

                    var path = this.getPath();

                    this.off("ready", onReadyImage);
                    logger.logError("image \"" + path + "\" timed out");
                    super_trigger("error", path);
                },

                createImage = function createImage(path, whenReady) {

                    var mg = images.get(path);

                    if (!mg) {

                        ++numberOfResources;
                        ++numberOfResourcesToLoad;
                        mg = image(path, cssClassSequence.nextValue());
                        mg.one("ready", onReadyImage, whenReady);
                        mg.one("error", onErrorImage);
                        images.set(path, mg);
                    } else {

                        call(whenReady, mg);
                    }

                    return mg;
                },

                createSpriteSheet = function createSpriteSheet(spriteSheetDesc, whenReady) {

                    var spriteSht = spriteSheets.get(spriteSheetDesc.path),
                        spriteSheetPath,
                        spriteSheetCellDimensions;

                    if (!spriteSht) {

                        ++numberOfResources;
                        spriteSheetPath = spriteSheetDesc.path;
                        spriteSheetCellDimensions = spriteSheetDesc.cellDimensions;
                        spriteSht = spriteSheet(

                            createImage(spriteSheetPath),
                            spriteSheetCellDimensions.width,
                            spriteSheetCellDimensions.height,
                            spriteSheetDesc.metadata
                        );
                        spriteSht.one("ready", function onReadySpriteSheet() {

                            ++numberOfResourcesReady;
                            call(whenReady, spriteSht);
                            super_trigger("ready", spriteSheetPath);
                            onReady();
                        });
                        spriteSheets.set(spriteSheetPath, spriteSht);
                    } else {

                        call(whenReady, spriteSht);
                    }

                    return spriteSht;
                },

                isReady = function isReady() {

                    return numberOfResourcesReady >= numberOfResources;
                },

                getNumberOfResourcesToLoad = function getNumberOfResourcesToLoad() {

                    return numberOfResourcesToLoad;
                },

                getNumberOfResourcesLoaded = function getNumberOfResourcesLoaded() {

                    return numberOfResourcesLoaded;
                },

                createElements = function createElements() {

                    styleElement = jquery("<style>");
                    styleElement.prop("type", "text/css");
                    jquery("head").append(styleElement);
                },

                reset = function reset() {

                    numberOfResources = numberOfResourcesReady = numberOfResourcesToLoad = numberOfResourcesLoaded = 0;
                    images = map();
                    cssClassSequence = sequence("image");
                    spriteSheets = map();
                    styleElement.html("");
                    super_off();
                },

                make = function make() {

                    createElements();
                    reset();
                };

            onReadyImage = function onReadyImage(event) {

                var path = this.getPath();

                ++numberOfResourcesReady;
                ++numberOfResourcesLoaded;
                this.off("error", onErrorImage);
                super_trigger("load", path);
                call(event.getData(), this);
                super_trigger("ready", path);
                onReady();
            };

            instance.createImage = createImage;
            instance.createSpriteSheet = createSpriteSheet;
            instance.isReady = isReady;
            instance.getNumberOfResourcesToLoad = getNumberOfResourcesToLoad;
            instance.getNumberOfResourcesLoaded = getNumberOfResourcesLoaded;
            instance.reset = reset;
            instance.make = make;

            return instance;
        };

    return resourceManager();
});

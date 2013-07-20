/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var listenable = require("support/listenable"),
        connection = require("core/connection"),
        elementPool = require("core/elementPool"),
        layerManager = require("core/layerManager"),
        overlay = require("core/overlay"),
        resourceManager = require("core/resourceManager"),
        viewport = require("core/viewport"),
        mouse = require("input/mouse"),
        keyboard = require("input/keyboard"),
        gameScene = require("scenes/gameScene"),

        startModel = function startModel(client) {

            var isSignedIn = false,
                gameScn,
                didLoadFl = false,
                instance = listenable(),
                super_trigger = instance.superior("trigger"),

                switchScene = function switchScene() {

                    client.setScene(gameScn);
                },

                addPostSignInListeners = function addPostSignInListeners() {

                    gameScn.on("load", function onLoad() {

                        if (didLoadFl) {

                            return;
                        }

                        super_trigger("load");

                        if (gameScn.isReady()) {

                            switchScene();
                        }
                    });
                    gameScn.on("error", function onError() {

                        didLoadFl = true;
                        super_trigger("loaderror");
                    });
                },

                signIn = function signIn() {

                    if (isSignedIn) {

                        return;
                    }

                    isSignedIn = true;
                    gameScn = gameScene(client);
                    addPostSignInListeners();
                },

                onOpen = function onOpen() {

                    super_trigger("connectionopen");
                },

                onClose = function onClose() {

                    super_trigger("connectionclose");
                },

                removeListeners = function removeListeners() {

                    connection.off("open", onOpen);
                    connection.off("close", onClose);
                },

                isConnectionEstablishing = function isConnectionEstablishing() {

                    return connection.isEstablishing();
                },

                isConnectionOpen = function isConnectionOpen() {

                    return connection.isOpen();
                },

                didLoadFail = function didLoadFail() {

                    return didLoadFl;
                },

                getPercentageComplete = function getPercentageComplete() {

                    return !gameScn ? 0 : gameScn.getPercentageComplete();
                },

                wipeSlateClean = function wipeSlateClean() {

                    client.wipeSlateClean();
                    connection.off();
                    viewport.off();
                    mouse.off();
                    resourceManager.reset();
                    overlay.reset();
                    elementPool.reset(); //after mouse.off()!
                    layerManager.reset();
                    keyboard.reset();
                },

                addListeners = function addListeners() {

                    if (!connection.isOpen()) {

                        connection.one("open", onOpen);
                    }

                    connection.one("close", onClose);
                },

                initialise = function initialise() {

                    wipeSlateClean();
                    addListeners();

                    if (!connection.isOpen()) {

                        connection.make();
                    }
                };

            instance.signIn = signIn;
            instance.removeListeners = removeListeners;
            instance.isConnectionEstablishing = isConnectionEstablishing;
            instance.isConnectionOpen = isConnectionOpen;
            instance.didLoadFail = didLoadFail;
            instance.getPercentageComplete = getPercentageComplete;
            initialise();

            return instance;
        };

    return startModel;
});

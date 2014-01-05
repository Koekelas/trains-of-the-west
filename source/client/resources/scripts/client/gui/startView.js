/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    require("hammerJquery");

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        timeInSeconds = require("game/clientConstants").time.inSeconds,
        jquery = require("jquery"),
        viewport = require("core/viewport"),

        startView = function startView(startController, startModel) {

            var animation = function animation(element, fps, cssClass, sequence) {

                    var FRAME_DURATION = timeInSeconds.ONE_SECOND / fps,
                        isPlaying,
                        timeSinceElementUpdate,
                        currentFrame,
                        instance = {},

                        play = function play() {

                            isPlaying = true;
                        },

                        pause = function pause() {

                            isPlaying = false;
                        },

                        updateElement = function updateElement() {

                            element.get(0).className = cssClass + sequence[currentFrame];
                        },

                        reset = function reset() {

                            isPlaying = false;
                            timeSinceElementUpdate = 0;
                            currentFrame = 0;
                            updateElement();
                        },

                        stop = function stop() {

                            reset();
                        },

                        update = function update(deltaTime) {

                            if (!isPlaying) {

                                return;
                            }

                            timeSinceElementUpdate += deltaTime;

                            if (timeSinceElementUpdate >= FRAME_DURATION) {

                                timeSinceElementUpdate = 0;
                                currentFrame = (currentFrame + 1) % sequence.length;
                                updateElement();
                            }
                        },

                        initialise = function initialise() {

                            reset();
                        };

                    instance.play = play;
                    instance.pause = pause;
                    instance.stop = stop;
                    instance.update = update;
                    initialise();

                    return instance;
                },

                terrainDimensions = {

                    WIDTH: 2655,
                    HEIGHT: 706
                },
                trainDesc = {

                    trainDimensions: {

                        WIDTH: 1181,
                        HEIGHT: 1752
                    },

                    shadowDimensions: {

                        HEIGHT: 93
                    },

                    chimneyAnchor: {

                        X: 591, //396 - 786
                        Y: 61
                    }
                },
                trackDesc = { //left rail, y up

                    startAnchor: {

                        X: 1334,
                        Y: 163
                    },

                    stopAnchor: {

                        X: 1334,
                        Y: 7
                    }
                },
                smokeFrameDesc = {

                    dimensions: {

                        WIDTH: 1740,
                        HEIGHT: 1684
                    },

                    chimneyAnchor: {

                        X: 764, //625 - 903
                        Y: 1320
                    }
                },
                activeDialog,
                loadingMessages = [],
                rootElement,
                connectionDialog,
                connectionStatusLabel,
                signInDialog,
                newAccountDialog,
                loadingDialog,
                smoke,
                train,
                loadingMessageLabel,
                loadingPercentageCompleteLabel,
                loadingFailedDialog,
                languageBundle = require("i18n!templates/nls/start"),
                smokeAnimation,
                instance = {},

                onShowLoadingDialog = function onShowLoadingDialog() {

                    smokeAnimation.play();
                },

                onHideLoadingDialog = function onHideLoadingDialog() {

                    smokeAnimation.stop();
                },

                showDialog = function showDialog(dialog) {

                    if (dialog === activeDialog) {

                        return;
                    }

                    activeDialog.fadeOut(function onFadeOutComplete() {

                        switch (activeDialog) {

                        case loadingDialog:

                            onHideLoadingDialog();

                            break;
                        }

                        activeDialog = dialog;

                        switch (activeDialog) {

                        case loadingDialog:

                            onShowLoadingDialog();

                            break;
                        }

                        activeDialog.fadeIn();
                    });
                },

                showConnectionDialog = function showConnectionDialog() {

                    showDialog(connectionDialog);
                },

                showSignInDialog = function showSignInDialog() {

                    showDialog(signInDialog);
                },

                showNewAccountDialog = function showNewAccountDialog() {

                    showDialog(newAccountDialog);
                },

                showLoadingDialog = function showLoadingDialog() {

                    showDialog(loadingDialog);
                },

                showLoadingFailedDialog = function showLoadingFailedDialog() {

                    showDialog(loadingFailedDialog);
                },

                createElements = function createElements() {

                    var template = require("templates/start");

                    rootElement = jquery(template(languageBundle));
                    connectionDialog = rootElement.find("[data-name='connectionDialog']");
                    connectionStatusLabel = connectionDialog.find("[data-name='status']");
                    signInDialog = rootElement.find("[data-name='signInDialog']");
                    newAccountDialog = rootElement.find("[data-name='newAccountDialog']");
                    loadingDialog = rootElement.find("[data-name='loadingDialog']");
                    smoke = loadingDialog.find("[data-name='smoke']");
                    train = loadingDialog.find("[data-name='train']");
                    loadingMessageLabel = loadingDialog.find("[data-name='message']");
                    loadingPercentageCompleteLabel = loadingDialog.find("[data-name='percentageComplete']");
                    loadingFailedDialog = rootElement.find("[data-name='loadingFailedDialog']");
                    jquery("#gui").append(rootElement);
                },

                updateConnectionStatus = function updateConnectionStatus() {

                    var text;

                    if (startModel.isConnectionEstablishing()) {

                        text = languageBundle.tryingEstablishConnection;
                    } else if (startModel.isConnectionOpen()) {

                        text = languageBundle.connectionEstablished;
                    } else {

                        text = languageBundle.unableEstablishConnection;
                    }

                    connectionStatusLabel.text(text);
                },

                updateTrain = function updateTrain(percentageComplete) {

                    var viewportScale = viewport.getWidth() / terrainDimensions.WIDTH,
                        percentageCompleteScale = percentageComplete / 100,
                        scale = viewportScale * percentageCompleteScale,
                        trainWidth = trainDesc.trainDimensions.WIDTH * scale,
                        trainHeight = trainDesc.trainDimensions.HEIGHT * scale,
                        trainShadowHeight = trainDesc.shadowDimensions.HEIGHT * scale,
                        trackAnchorX = trackDesc.startAnchor.X * viewportScale, //startAnchor.x === stopAnchor.x
                        trackAnchorY = (trackDesc.startAnchor.Y - (trackDesc.startAnchor.Y - trackDesc.stopAnchor.Y) * percentageCompleteScale) * viewportScale,
                        trainX = trackAnchorX - trainWidth / 2,
                        trainY = viewport.getHeight() - trackAnchorY - trainHeight + trainShadowHeight,
                        smokeWidth = smokeFrameDesc.dimensions.WIDTH * scale,
                        smokeHeight = smokeFrameDesc.dimensions.HEIGHT * scale,
                        trainChimneyAnchorX = trainDesc.chimneyAnchor.X * scale,
                        trainChimneyAnchorY = trainDesc.chimneyAnchor.Y * scale,
                        smokeChimneyAnchorX = smokeFrameDesc.chimneyAnchor.X * scale,
                        smokeChimneyAnchorY = smokeFrameDesc.chimneyAnchor.Y * scale,
                        smokeX = trainX + trainChimneyAnchorX - smokeChimneyAnchorX,
                        smokeY = trainY + trainChimneyAnchorY - smokeChimneyAnchorY;

                    train.css({

                        "top": Math.round(trainY) + "px",
                        "left": Math.round(trainX) + "px",
                        "width": Math.round(trainWidth) + "px",
                        "height": Math.round(trainHeight) + "px"
                    });
                    smoke.css({

                        "top": Math.round(smokeY) + "px",
                        "left": Math.round(smokeX) + "px",
                        "width": Math.round(smokeWidth) + "px",
                        "height": Math.round(smokeHeight) + "px"
                    });
                },

                updateLoadingDialog = function updateLoadingDialog() {

                    var percentageComplete = startModel.getPercentageComplete(),
                        numberOfLoadingMessages = loadingMessages.length,
                        i = Math.min(

                            numberOfLoadingMessages - 1,
                            Math.floor(percentageComplete / (100 / numberOfLoadingMessages))
                        );

                    updateTrain(percentageComplete);
                    loadingMessageLabel.text(loadingMessages[i]);
                    loadingPercentageCompleteLabel.text(percentageComplete + "%");
                },

                styleElements = function styleElements() {

                    activeDialog = connectionDialog;
                    signInDialog.hide();
                    newAccountDialog.hide();
                    loadingDialog.hide();
                    loadingFailedDialog.hide();
                    connectionDialog.show();
                    updateConnectionStatus();
                    updateLoadingDialog();
                },

                onResize = function onResize() {

                    updateTrain(startModel.getPercentageComplete());
                },

                addListeners = function addListeners() {

                    var hammerSettings = {

                        prevent_default: true,
                        show_touches: false,
                        touch: false,
                        release: false,
                        tap: true,
                        hold: false,
                        hold_threshold: timeInMilliseconds.ONE_MINUTE,
                        drag: false,
                        swipe: false,
                        transform: false
                    };

                    rootElement.find(".textbox input").on("focus blur input", function onFocusBlurInput(event) {

                        var inputElement = jquery(this),
                            hintElement = inputElement.prev("p");

                        event.preventDefault();

                        if (inputElement.val() === "") {

                            hintElement.show();
                        } else {

                            hintElement.hide();
                        }

                        switch (event.type) {

                        case "focus":

                            hintElement.addClass("partiallyVisible");

                            break;
                        case "blur":

                            hintElement.removeClass("partiallyVisible");

                            break;
                        }
                    });
                    signInDialog.find(".floatLayout").hammer(hammerSettings).on("tap", ".button", function onTapSignInDialogButton() {

                        switch (jquery(this).data("name")) {

                        case "signIn":

                            startController.signIn();

                            break;
                        case "newAccount":

                            startController.newAccount();

                            break;
                        }
                    });
                    newAccountDialog.find(".floatLayout").hammer(hammerSettings).on("tap", ".button", function onTapNewAccountDialogButton() {

                        switch (jquery(this).data("name")) {

                        case "create":

                            startController.createNewAccount();

                            break;
                        case "cancel":

                            startController.cancelNewAccount();

                            break;
                        }
                    });
                    startModel.on("connectionopen", function onConnectionopen() {

                        updateConnectionStatus();
                        showSignInDialog();
                    });
                    startModel.on("connectionclose", function onConnectionclose() {

                        updateConnectionStatus();
                        showConnectionDialog();
                    });
                    startModel.on("load", function onLoad() {

                        updateLoadingDialog();
                    });
                    startModel.on("loaderror", function onLoaderror() {

                        showLoadingFailedDialog();
                    });
                    viewport.on("resize", onResize);
                },

                activate = function activate() {

                    createElements();
                    smokeAnimation = animation(smoke, 10, "smoke_frame", [ 0, 1, 2, 3 ]);
                    styleElements();
                    addListeners();
                },

                animate = function animate(deltaTime) {

                    smokeAnimation.update(deltaTime);
                },

                destroyElements = function destroyElements() {

                    rootElement.remove();
                },

                removeListeners = function removeListeners() {

                    viewport.off("resize", onResize);
                },

                deactivate = function deactivate() {

                    destroyElements();
                    removeListeners();
                },

                initialise = function initialise() {

                    loadingMessages.push(languageBundle.loading1);
                    loadingMessages.push(languageBundle.loading2);
                    loadingMessages.push(languageBundle.loading3);
                    loadingMessages.push(languageBundle.loading4);
                    loadingMessages.push(languageBundle.loading5);
                };

            instance.showConnectionDialog = showConnectionDialog;
            instance.showSignInDialog = showSignInDialog;
            instance.showNewAccountDialog = showNewAccountDialog;
            instance.showLoadingDialog = showLoadingDialog;
            instance.showLoadingFailedDialog = showLoadingFailedDialog;
            instance.activate = activate;
            instance.animate = animate;
            instance.deactivate = deactivate;
            initialise();

            return instance;
        };

    return startView;
});

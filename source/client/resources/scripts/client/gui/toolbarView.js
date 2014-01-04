/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    require("hammerJquery");

    var timeInMilliseconds = require("game/clientConstants").time.inMilliseconds,
        directions = require("game/constants").directions,
        jquery = require("jquery"),
        viewport = require("core/viewport"),
        keyboard = require("input/keyboard"),
        mouse = require("input/mouse"),
        browser = require("support/browser"),

        toolbarView = function toolbarView(toolbarController, toolbarModel, shared) {

            var MOUSE_BORDER_PAN_THRESHOLD = 25,
                BUTTON_HEIGHT = 40,
                CALLOUT_TOP_HEIGHT = 1,
                activeToolModes,
                rootElement,
                zoomInButton,
                zoomOutButton,
                tools,
                terrainTool,
                terrainToolModes,
                terrainToolCurrentModeIcon,
                trackTool,
                trackToolModes,
                trackToolCurrentModeIcon,
                decorationTool,
                decorationToolModes,
                decorationToolCurrentModeIcon,
                instance = {},

                hideModesActiveTool = function hideModesActiveTool() {

                    if (activeToolModes === undefined) {

                        return;
                    }

                    activeToolModes.animate({ "top": 0 });
                    activeToolModes = undefined;
                },

                showModesTool = function showModesTool(toolModes) {

                    var previousActiveToolModes = activeToolModes;

                    hideModesActiveTool();

                    if (toolModes === previousActiveToolModes) {

                        return;
                    }

                    activeToolModes = toolModes;
                    activeToolModes.animate({

                        "top": (BUTTON_HEIGHT * toolModes.children().length + CALLOUT_TOP_HEIGHT) * -1
                    });
                },

                showModesTerrainTool = function showModesTerrainTool() {

                    showModesTool(terrainToolModes);
                },

                showModesTrackTool = function showModesTrackTool() {

                    showModesTool(trackToolModes);
                },

                showModesDecorationTool = function showModesDecorationTool() {

                    showModesTool(decorationToolModes);
                },

                toggleFullScreen = function toggleFullScreen() {

                    viewport.enableFullScreen(!viewport.isFullScreen());
                },

                createElements = function createElements() {

                    var template = shared.createTemplate(),
                        languageBundel = require("i18n!templates/nls/toolbar");

                    rootElement = jquery(template(languageBundel));
                    zoomInButton = rootElement.find("[data-name='zoomIn']");
                    zoomOutButton = rootElement.find("[data-name='zoomOut']");
                    tools = rootElement.find("[data-name*='Tool']");
                    terrainTool = tools.filter("[data-name='terrainTool']");
                    terrainToolModes = terrainTool.find(".modes");
                    terrainToolCurrentModeIcon = terrainTool.find("[data-name='currentMode'] > div");
                    trackTool = tools.filter("[data-name='trackTool']");
                    trackToolModes = trackTool.find(".modes");
                    trackToolCurrentModeIcon = trackTool.find("[data-name='currentMode'] > div");
                    decorationTool = tools.filter("[data-name='decorationTool']");
                    decorationToolModes = decorationTool.find(".modes");
                    decorationToolCurrentModeIcon = decorationTool.find("[data-name='currentMode'] > div");
                    jquery("#gui").append(rootElement);
                },

                enableButton = function enableButton(button) {

                    button.removeClass("disabled");
                },

                disableButton = function disableButton(button) {

                    button.addClass("disabled");
                },

                updateZoomButtons = function updateZoomButtons() {

                    switch (toolbarModel.getCurrentZoomLevel()) {

                    case toolbarModel.getMinimumZoomLevel():

                        enableButton(zoomInButton);
                        disableButton(zoomOutButton);

                        break;
                    case toolbarModel.getMaximumZoomLevel():

                        enableButton(zoomOutButton);
                        disableButton(zoomInButton);

                        break;
                    default:

                        enableButton(zoomInButton);
                        enableButton(zoomOutButton);

                        break;
                    }
                },

                updateTerrainTool = function updateTerrainTool() {

                    var cssClass;

                    terrainToolCurrentModeIcon.removeClass();

                    switch (toolbarModel.getCurrentModeTerrainTool()) {

                    case toolbarModel.toolModes[toolbarModel.tools.TERRAIN].SMOOTH_UP:

                        cssClass = "iconSmoothUp";

                        break;
                    case toolbarModel.toolModes[toolbarModel.tools.TERRAIN].ROUGH_UP:

                        cssClass = "iconRoughUp";

                        break;
                    case toolbarModel.toolModes[toolbarModel.tools.TERRAIN].SMOOTH_DOWN:

                        cssClass = "iconSmoothDown";

                        break;
                    case toolbarModel.toolModes[toolbarModel.tools.TERRAIN].ROUGH_DOWN:

                        cssClass = "iconRoughDown";

                        break;
                    }

                    terrainToolCurrentModeIcon.addClass(cssClass);
                },

                updateTrackTool = function updateTrackTool() {

                    var cssClass;

                    trackToolCurrentModeIcon.removeClass();

                    switch (toolbarModel.getCurrentModeTrackTool()) {

                    case toolbarModel.toolModes[toolbarModel.tools.TRACK].BUILD:

                        cssClass = "iconTrackBuild";

                        break;
                    case toolbarModel.toolModes[toolbarModel.tools.TRACK].DEMOLISH:

                        cssClass = "iconTrackDemolish";

                        break;
                    }

                    trackToolCurrentModeIcon.addClass(cssClass);
                },

                updateDecorationTool = function updateDecorationTool() {

                    var cssClass;

                    decorationToolCurrentModeIcon.removeClass();

                    switch (toolbarModel.getCurrentModeDecorationTool()) {

                    case toolbarModel.toolModes[toolbarModel.tools.DECORATION].BUILD:

                        cssClass = "iconDecorationBuild";

                        break;
                    case toolbarModel.toolModes[toolbarModel.tools.DECORATION].DEMOLISH:

                        cssClass = "iconDecorationDemolish";

                        break;
                    }

                    decorationToolCurrentModeIcon.addClass(cssClass);
                },

                updateTools = function updateTools() {

                    var selectedTool;

                    tools.removeClass("selected");

                    switch (toolbarModel.getSelectedTool()) {

                    case toolbarModel.tools.TERRAIN:

                        selectedTool = terrainTool;

                        break;
                    case toolbarModel.tools.TRACK:

                        selectedTool = trackTool;

                        break;
                    case toolbarModel.tools.DECORATION:

                        selectedTool = decorationTool;

                        break;
                    }

                    if (selectedTool) {

                        selectedTool.addClass("selected");
                    }

                    updateTerrainTool();
                    updateTrackTool();
                    updateDecorationTool();
                },

                styleElements = function styleElements() {

                    if (browser.isFullScreenSupported()) {

                        rootElement.addClass("fullScreenSupported");
                    }

                    updateZoomButtons();
                    updateTools();
                },

                performKeyboardAssistedRotate = function performKeyboardAssistedRotate() {

                    if (keyboard.isDown("option")) {

                        toolbarController.rotateCounterclockwise();
                    } else {

                        toolbarController.rotateClockwise();
                    }
                },

                addListeners = function addListeners() {

                    var buttonsWrapper = rootElement.find(".floatLayout"),
                        buttonsHammerWrapper = buttonsWrapper.hammer({

                            prevent_default: true,
                            show_touches: false,
                            touch: false,
                            release: false,
                            tap: true,
                            hold: true,
                            hold_threshold: timeInMilliseconds.ONE_SECOND,
                            drag: false,
                            swipe: false,
                            transform: false
                        });

                    buttonsHammerWrapper.on("tap", ".button", function onButtonTap(event) {

                        event.stopPropagation();

                        switch (jquery(this).data("name")) {

                        case "zoomIn":

                            toolbarController.zoomIn();

                            break;
                        case "zoomOut":

                            toolbarController.zoomOut();

                            break;
                        case "rotateClockwise":

                            toolbarController.rotateClockwise();

                            break;
                        case "rotateCounterclockwise":

                            toolbarController.rotateCounterclockwise();

                            break;
                        case "terrainTool":

                            toolbarController.toggleTerrainTool();

                            break;
                        case "trackTool":

                            toolbarController.toggleTrackTool();

                            break;
                        case "decorationTool":

                            toolbarController.toggleDecorationTool();

                            break;
                        case "fullScreen":

                            toolbarController.enableFullScreen();

                            break;
                        }
                    });
                    buttonsHammerWrapper.on("hold", ".button", function onButtonHold(event) {

                        event.stopPropagation();

                        switch (jquery(this).data("name")) {

                        case "terrainTool":

                            toolbarController.changeModeTerrainTool();

                            break;
                        case "trackTool":

                            toolbarController.changeModeTrackTool();

                            break;
                        case "decorationTool":

                            toolbarController.changeModeDecorationTool();

                            break;
                        }
                    });
                    buttonsWrapper.find(".modes").hammer({

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
                    }).on("tap", ".calloutButton", function onCalloutButtonTap(event) {

                        event.stopPropagation();

                        var calloutButton = jquery(this),
                            buttonName = calloutButton.closest(".button").data("name"),
                            calloutButtonName = calloutButton.data("name");

                        switch (buttonName) {

                        case "terrainTool":

                            switch (calloutButtonName) {

                            case "smoothUp":

                                toolbarController.selectTerrainToolSmoothUp();

                                break;
                            case "roughUp":

                                toolbarController.selectTerrainToolRoughUp();

                                break;
                            case "smoothDown":

                                toolbarController.selectTerrainToolSmoothDown();

                                break;
                            case "roughDown":

                                toolbarController.selectTerrainToolRoughDown();

                                break;
                            }

                            break;
                        case "trackTool":

                            switch (calloutButtonName) {

                            case "build":

                                toolbarController.selectTrackToolBuild();

                                break;
                            case "demolish":

                                toolbarController.selectTrackToolDemolish();

                                break;
                            }

                            break;
                        case "decorationTool":

                            switch (calloutButtonName) {

                            case "build":

                                toolbarController.selectDecorationToolBuild();

                                break;
                            case "demolish":

                                toolbarController.selectDecorationToolDemolish();

                                break;
                            }

                            break;
                        }
                    });
                    keyboard.on("toggleoppositemodedown", function onToggleoppositemode() {

                        toolbarController.toggleOppositeMode();
                    });
                    mouse.on("middleclick", function onMiddleclick() {

                        performKeyboardAssistedRotate();
                    });
                    /*jslint unparam: true*/
                    keyboard.on("up", function onUp(event, name) {

                        switch (name) {

                        case "toggleOppositeMode":

                            toolbarController.toggleOppositeMode();

                            break;
                        case "deselectTool":

                            toolbarController.deselectTool();

                            break;
                        case "zoomIn":

                            toolbarController.zoomIn();

                            break;
                        case "zoomOut":

                            toolbarController.zoomOut();

                            break;
                        case "rotate":

                            performKeyboardAssistedRotate();

                            break;
                        case "cycleModeTerrainTool":

                            if (keyboard.isDown("option")) {

                                toolbarController.cycleModeTerrainToolDown();
                            } else {

                                toolbarController.cycleModeTerrainToolUp();
                            }

                            break;
                        case "cycleModeTrackTool":

                            if (keyboard.isDown("option")) {

                                toolbarController.cycleModeTrackToolDown();
                            } else {

                                toolbarController.cycleModeTrackToolUp();
                            }

                            break;
                        case "cycleModeDecorationTool":

                            if (keyboard.isDown("option")) {

                                toolbarController.cycleModeDecorationToolDown();
                            } else {

                                toolbarController.cycleModeDecorationToolUp();
                            }

                            break;
                        case "enableFullScreen":

                            toolbarController.enableFullScreen();

                            break;
                        }
                    });
                    mouse.on("drag", function onDrag(event, ms) {

                        toolbarController.pan(ms.deltaX * -1, ms.deltaY * -1);
                    });
                    mouse.on("scroll", function onScroll(event, ms) {

                        if (ms.deltaY < 0) {

                            toolbarController.zoomIn();
                        } else {

                            toolbarController.zoomOut();
                        }
                    });
                    mouse.on("scale", function onScale(event, ms) {

                        if (ms.scaleUp) {

                            toolbarController.zoomIn();
                        } else {

                            toolbarController.zoomOut();
                        }
                    });
                    mouse.on("rotate", function onRotate(event, ms) {

                        if (ms.direction === directions.CLOCKWISE) {

                            toolbarController.rotateClockwise();
                        } else {

                            toolbarController.rotateCounterclockwise();
                        }
                    });
                    /*jslint unparam: false*/
                    toolbarModel.on("zoom", function onZoom() {

                        updateZoomButtons();
                    });
                    toolbarModel.on("selecttool", function onSelecttool() {

                        updateTools();
                    });
                },

                activate = function activate() {

                    createElements();
                    styleElements();
                    addListeners();
                },

                areMouseBorderPanStartConditionsSatisfied = function areMouseBorderPanStartConditionsSatisfied() {

                    var mouseX = mouse.getX(),
                        mouseY = mouse.getY();

                    return (

                        viewport.isFullScreen() &&
                        mouse.getPointerType() === mouse.pointerTypes.MOUSE &&
                        (mouseX < MOUSE_BORDER_PAN_THRESHOLD || mouseX > viewport.getWidth() - MOUSE_BORDER_PAN_THRESHOLD || mouseY < MOUSE_BORDER_PAN_THRESHOLD || mouseY > viewport.getHeight() - MOUSE_BORDER_PAN_THRESHOLD)
                    );
                },

                checkSynchronousInput = function checkSynchronousInput(deltaTime) {

                    if (areMouseBorderPanStartConditionsSatisfied()) {

                        var mouseX = mouse.getX(),
                            mouseY = mouse.getY();

                        if (mouseX < MOUSE_BORDER_PAN_THRESHOLD) {

                            toolbarController.panLeft(deltaTime);
                        } else if (mouseX > viewport.getWidth() - MOUSE_BORDER_PAN_THRESHOLD) {

                            toolbarController.panRight(deltaTime);
                        }

                        if (mouseY < MOUSE_BORDER_PAN_THRESHOLD) {

                            toolbarController.panUp(deltaTime);
                        } else if (mouseY > viewport.getHeight() - MOUSE_BORDER_PAN_THRESHOLD) {

                            toolbarController.panDown(deltaTime);
                        }
                    } else {

                        if (keyboard.isDown("panUp")) {

                            toolbarController.panUp(deltaTime);
                        } else if (keyboard.isDown("panDown")) {

                            toolbarController.panDown(deltaTime);
                        }

                        if (keyboard.isDown("panLeft")) {

                            toolbarController.panLeft(deltaTime);
                        } else if (keyboard.isDown("panRight")) {

                            toolbarController.panRight(deltaTime);
                        }
                    }
                },

                animate = function animate() { /*empty*/ },

                destroyElements = function destroyElements() {

                    rootElement.remove();
                },

                deactivate = function deactivate() {

                    destroyElements();
                };

            instance.showModesTerrainTool = showModesTerrainTool;
            instance.showModesTrackTool = showModesTrackTool;
            instance.showModesDecorationTool = showModesDecorationTool;
            instance.hideModesActiveTool = hideModesActiveTool;
            instance.toggleFullScreen = toggleFullScreen;
            instance.activate = activate;
            instance.checkSynchronousInput = checkSynchronousInput;
            instance.animate = animate;
            instance.deactivate = deactivate;

            return instance;
        };

    return toolbarView;
});

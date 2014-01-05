/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var browser = require("support/browser"),
        toolbarDesktopView = require("gui/toolbarDesktopView"),
        toolbarMobileView = require("gui/toolbarMobileView"),

        toolbarController = function toolbarController(toolbarModel) {

            var toolbarView,
                instance = {},

                toggleOppositeMode = function toggleOppositeMode() {

                    toolbarModel.toggleOppositeMode();
                },

                deselectTool = function deselectTool() {

                    toolbarModel.deselectTool();
                },

                pan = function pan(deltaX, deltaY) {

                    toolbarModel.pan(deltaX, deltaY);
                },

                panUp = function panUp(deltaTime) {

                    toolbarModel.panUp(deltaTime);
                },

                panDown = function panDown(deltaTime) {

                    toolbarModel.panDown(deltaTime);
                },

                panLeft = function panLeft(deltaTime) {

                    toolbarModel.panLeft(deltaTime);
                },

                panRight = function panRight(deltaTime) {

                    toolbarModel.panRight(deltaTime);
                },

                zoomIn = function zoomIn() {

                    toolbarModel.zoomIn();
                },

                zoomOut = function zoomOut() {

                    toolbarModel.zoomOut();
                },

                rotateClockwise = function rotateClockwise() {

                    toolbarModel.rotateClockwise();
                },

                rotateCounterclockwise = function rotateCounterclockwise() {

                    toolbarModel.rotateCounterclockwise();
                },

                toggleTerrainTool = function toggleTerrainTool() {

                    toolbarModel.toggleTerrainTool();
                    toolbarView.hideModesActiveTool();
                },

                changeModeTerrainTool = function changeModeTerrainTool() {

                    toolbarView.showModesTerrainTool();
                },

                selectTerrainToolSmoothUp = function selectTerrainToolSmoothUp() {

                    toolbarModel.selectTerrainToolSmoothUp();
                    toolbarView.hideModesActiveTool();
                },

                selectTerrainToolRoughUp = function selectTerrainToolRoughUp() {

                    toolbarModel.selectTerrainToolRoughUp();
                    toolbarView.hideModesActiveTool();
                },

                selectTerrainToolSmoothDown = function selectTerrainToolSmoothDown() {

                    toolbarModel.selectTerrainToolSmoothDown();
                    toolbarView.hideModesActiveTool();
                },

                selectTerrainToolRoughDown = function selectTerrainToolRoughDown() {

                    toolbarModel.selectTerrainToolRoughDown();
                    toolbarView.hideModesActiveTool();
                },

                cycleModeTerrainToolUp = function cycleModeTerrainToolUp() {

                    toolbarModel.cycleModeTerrainToolUp();
                },

                cycleModeTerrainToolDown = function cycleModeTerrainToolDown() {

                    toolbarModel.cycleModeTerrainToolDown();
                },

                toggleTrackTool = function toggleTrackTool() {

                    toolbarModel.toggleTrackTool();
                    toolbarView.hideModesActiveTool();
                },

                changeModeTrackTool = function changeModeTrackTool() {

                    toolbarView.showModesTrackTool();
                },

                selectTrackToolBuild = function selectTrackToolBuild() {

                    toolbarModel.selectTrackToolBuild();
                    toolbarView.hideModesActiveTool();
                },

                selectTrackToolDemolish = function selectTrackToolDemolish() {

                    toolbarModel.selectTrackToolDemolish();
                    toolbarView.hideModesActiveTool();
                },

                cycleModeTrackToolUp = function cycleModeTrackToolUp() {

                    toolbarModel.cycleModeTrackToolUp();
                },

                cycleModeTrackToolDown = function cycleModeTrackToolDown() {

                    toolbarModel.cycleModeTrackToolDown();
                },

                toggleDecorationTool = function toggleDecorationTool() {

                    toolbarModel.toggleDecorationTool();
                    toolbarView.hideModesActiveTool();
                },

                changeModeDecorationTool = function changeModeDecorationTool() {

                    toolbarView.showModesDecorationTool();
                },

                selectDecorationToolBuild = function selectDecorationToolBuild() {

                    toolbarModel.selectDecorationToolBuild();
                    toolbarView.hideModesActiveTool();
                },

                selectDecorationToolDemolish = function selectDecorationToolDemolish() {

                    toolbarModel.selectDecorationToolDemolish();
                    toolbarView.hideModesActiveTool();
                },

                cycleModeDecorationToolUp = function cycleModeDecorationToolUp() {

                    toolbarModel.cycleModeDecorationToolUp();
                },

                cycleModeDecorationToolDown = function cycleModeDecorationToolDown() {

                    toolbarModel.cycleModeDecorationToolDown();
                },

                enableFullScreen = function enableFullScreen() {

                    toolbarView.toggleFullScreen();
                },

                activateView = function activateView() {

                    toolbarView.activate();
                },

                checkSynchronousInputView = function checkSynchronousInputView(deltaTime) {

                    toolbarView.checkSynchronousInput(deltaTime);
                },

                animateView = function animateView(cameraDesc, deltaTime) {

                    toolbarView.animate(cameraDesc, deltaTime);
                },

                deactivateView = function deactivateView() {

                    toolbarView.deactivate();
                },

                createView = function createView() {

                    var toolbarViewConstructor;

                    if (browser.isDesktop()) {

                        toolbarViewConstructor = toolbarDesktopView;
                    } else {

                        toolbarViewConstructor = toolbarMobileView;
                    }

                    return toolbarViewConstructor(instance, toolbarModel);
                },

                initialise = function initialise() {

                    toolbarView = createView();
                };

            instance.toggleOppositeMode = toggleOppositeMode;
            instance.deselectTool = deselectTool;
            instance.pan = pan;
            instance.panUp = panUp;
            instance.panDown = panDown;
            instance.panLeft = panLeft;
            instance.panRight = panRight;
            instance.zoomIn = zoomIn;
            instance.zoomOut = zoomOut;
            instance.rotateClockwise = rotateClockwise;
            instance.rotateCounterclockwise = rotateCounterclockwise;
            instance.toggleTerrainTool = toggleTerrainTool;
            instance.changeModeTerrainTool = changeModeTerrainTool;
            instance.selectTerrainToolSmoothUp = selectTerrainToolSmoothUp;
            instance.selectTerrainToolRoughUp = selectTerrainToolRoughUp;
            instance.selectTerrainToolSmoothDown = selectTerrainToolSmoothDown;
            instance.selectTerrainToolRoughDown = selectTerrainToolRoughDown;
            instance.cycleModeTerrainToolUp = cycleModeTerrainToolUp;
            instance.cycleModeTerrainToolDown = cycleModeTerrainToolDown;
            instance.toggleTrackTool = toggleTrackTool;
            instance.changeModeTrackTool = changeModeTrackTool;
            instance.selectTrackToolBuild = selectTrackToolBuild;
            instance.selectTrackToolDemolish = selectTrackToolDemolish;
            instance.cycleModeTrackToolUp = cycleModeTrackToolUp;
            instance.cycleModeTrackToolDown = cycleModeTrackToolDown;
            instance.toggleDecorationTool = toggleDecorationTool;
            instance.changeModeDecorationTool = changeModeDecorationTool;
            instance.selectDecorationToolBuild = selectDecorationToolBuild;
            instance.selectDecorationToolDemolish = selectDecorationToolDemolish;
            instance.cycleModeDecorationToolUp = cycleModeDecorationToolUp;
            instance.cycleModeDecorationToolDown = cycleModeDecorationToolDown;
            instance.enableFullScreen = enableFullScreen;
            instance.activateView = activateView;
            instance.checkSynchronousInputView = checkSynchronousInputView;
            instance.animateView = animateView;
            instance.deactivateView = deactivateView;
            initialise();

            return instance;
        };

    return toolbarController;
});

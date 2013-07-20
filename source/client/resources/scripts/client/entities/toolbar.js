/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var modifyTerrainModifiers = require("game/constants").modifyTerrainModifiers,
        toolbarController = require("gui/toolbarController"),
        toolbarModel = require("gui/toolbarModel"),

        toolbar = function toolbar(camera) {

            var toolbarMdl = toolbarModel(camera),
                toolbarCntrllr = toolbarController(toolbarMdl),
                instance = {},

                activate = function activate() {

                    toolbarCntrllr.activateView();
                },

                checkSynchronousInput = function checkSynchronousInput(deltaTime) {

                    toolbarCntrllr.checkSynchronousInputView(deltaTime);
                },

                update = function update(cameraDesc, deltaTime) {

                    toolbarCntrllr.animateView(cameraDesc, deltaTime);
                },

                deactivate = function deactivate() {

                    toolbarCntrllr.deactivateView();
                },

                isTerrainToolSelected = function isTerrainToolSelected() {

                    return toolbarMdl.getSelectedTool() === toolbarMdl.tools.TERRAIN;
                },

                isTrackToolSelected = function isTrackToolSelected() {

                    return toolbarMdl.getSelectedTool() === toolbarMdl.tools.TRACK;
                },

                isDecorationToolSelected = function isDecorationToolSelected() {

                    return toolbarMdl.getSelectedTool() === toolbarMdl.tools.DECORATION;
                },

                getTerrainToolCurrentModeDesc = function getTerrainToolCurrentModeDesc() {

                    var currentMode = toolbarMdl.getCurrentModeTerrainTool();

                    return {

                        up:
                            currentMode === toolbarMdl.toolModes[toolbarMdl.tools.TERRAIN].SMOOTH_UP ||
                            currentMode === toolbarMdl.toolModes[toolbarMdl.tools.TERRAIN].ROUGH_UP,
                        modifier:
                            (
                                currentMode === toolbarMdl.toolModes[toolbarMdl.tools.TERRAIN].SMOOTH_UP ||
                                currentMode === toolbarMdl.toolModes[toolbarMdl.tools.TERRAIN].SMOOTH_DOWN
                            ) ? modifyTerrainModifiers.SMOOTH : modifyTerrainModifiers.ROUGH
                    };
                };

            instance.activate = activate;
            instance.checkSynchronousInput = checkSynchronousInput;
            instance.update = update;
            instance.deactivate = deactivate;
            instance.isTerrainToolSelected = isTerrainToolSelected;
            instance.isTrackToolSelected = isTrackToolSelected;
            instance.isDecorationToolSelected = isDecorationToolSelected;
            instance.getTerrainToolCurrentModeDesc = getTerrainToolCurrentModeDesc;

            return instance;
        };

    return toolbar;
});

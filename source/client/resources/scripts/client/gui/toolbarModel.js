/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,
        listenable = require("support/listenable"),
        vector = require("support/vector"),

        toolbarModel = function toolbarModel(camera) {

            var tool = function tool(type) {

                    var modes = vector(),
                        indexCurrentMode,
                        instance = {},

                        addMode = function addMode(mode, opposite) {

                            modes.push({ mode: mode, opposite: opposite });

                            if (indexCurrentMode === undefined) {

                                indexCurrentMode = 0;
                            }
                        },

                        selectMode = function selectMode(mode) {

                            var isFound = false;

                            modes.each(function eachModeDesc(modeDesc, indexMode) {

                                if (modeDesc.mode === mode) {

                                    indexCurrentMode = indexMode;
                                    isFound = true;
                                }

                                return !isFound;
                            });

                            if (!isFound) {

                                indexCurrentMode = undefined;
                            }
                        },

                        cycleModeUp = function cycleModeUp() {

                            if (indexCurrentMode === undefined) {

                                return;
                            }

                            indexCurrentMode = (indexCurrentMode + 1) % modes.getLength();
                        },

                        cycleModeDown = function cycleModeDown() {

                            if (indexCurrentMode === undefined) {

                                return;
                            }

                            var numberOfModes = modes.getLength();

                            indexCurrentMode = (indexCurrentMode - 1 + numberOfModes) % numberOfModes;
                        },

                        getType = function getType() {

                            return type;
                        },

                        getCurrentMode = function getCurrentMode() {

                            var currentMode;

                            if (indexCurrentMode !== undefined) {

                                currentMode = modes.get(indexCurrentMode).mode;
                            }

                            return currentMode;
                        },

                        getOppositeCurrentMode = function getOppositeCurrentMode() {

                            var oppositeCurrentMode;

                            if (indexCurrentMode !== undefined) {

                                oppositeCurrentMode = modes.get(indexCurrentMode).opposite;
                            }

                            return oppositeCurrentMode;
                        };

                    instance.addMode = addMode;
                    instance.selectMode = selectMode;
                    instance.cycleModeUp = cycleModeUp;
                    instance.cycleModeDown = cycleModeDown;
                    instance.getType = getType;
                    instance.getCurrentMode = getCurrentMode;
                    instance.getOppositeCurrentMode = getOppositeCurrentMode;

                    return instance;
                },

                tools = {

                    TERRAIN: 0,
                    TRACK: 1,
                    DECORATION: 2
                },
                toolModes = {},
                terrainTool,
                trackTool,
                decorationTool,
                selectedTool,
                isOppositeModeSelected = false,
                instance = listenable(),
                super_trigger = instance._superior("trigger"),

                toggleOppositeMode = function toggleOppositeMode() {

                    isOppositeModeSelected = !isOppositeModeSelected;

                    if (selectedTool) {

                        super_trigger("selecttool");
                    }
                },

                areFreePanStartConditionsSatisfied = function areFreePanStartConditionsSatisfied() {

                    var areFreePanStartConditionsStsfd = true;

                    if (selectedTool === trackTool && trackTool.getCurrentMode() === toolModes[tools.TRACK].BUILD) {

                        areFreePanStartConditionsStsfd = false;
                    }

                    return areFreePanStartConditionsStsfd;
                },

                pan = function pan(deltaX, deltaY) {

                    if (areFreePanStartConditionsSatisfied()) {

                        camera.changePosition(deltaX, deltaY);
                    }
                },

                panUp = function panUp(deltaTime) {

                    camera.panUp(deltaTime);
                },

                panDown = function panDown(deltaTime) {

                    camera.panDown(deltaTime);
                },

                panLeft = function panLeft(deltaTime) {

                    camera.panLeft(deltaTime);
                },

                panRight = function panRight(deltaTime) {

                    camera.panRight(deltaTime);
                },

                deselectTool = function deselectTool() {

                    if (selectedTool === undefined) {

                        return;
                    }

                    selectedTool = undefined;
                    super_trigger("selecttool");
                },

                changeZoom = function changeZoom(zoomIn) {

                    var previousZoomLevel = camera.getZoom();

                    camera.changeZoom(zoomIn);

                    if (camera.getZoom() !== previousZoomLevel) {

                        super_trigger("zoom");
                    }
                },

                zoomIn = function zoomIn() {

                    changeZoom(true);
                },

                zoomOut = function zoomOut() {

                    changeZoom(false);
                },

                changeRotation = function changeRotation(direction) {

                    camera.changeRotation(direction);
                },

                rotateClockwise = function rotateClockwise() {

                    changeRotation(directions.CLOCKWISE);
                },

                rotateCounterclockwise = function rotateCounterclockwise() {

                    changeRotation(directions.COUNTERCLOCKWISE);
                },

                toggleTool = function toggleTool(tl) {

                    if (tl === selectedTool) {

                        selectedTool = undefined;
                    } else {

                        selectedTool = tl;
                    }

                    super_trigger("selecttool");
                },

                selectToolMode = function selectToolMode(tl, mode) {

                    if (tl === selectedTool && tl.getCurrentMode() === mode) {

                        return;
                    }

                    selectedTool = tl;
                    selectedTool.selectMode(mode);
                    super_trigger("selecttool");
                },

                cycleModeTool = function cycleModeTool(tl, cycleUp) {

                    if (tl === selectedTool) {

                        if (cycleUp) {

                            selectedTool.cycleModeUp();
                        } else {

                            selectedTool.cycleModeDown();
                        }
                    } else {

                        selectedTool = tl;
                    }

                    super_trigger("selecttool");
                },

                cycleModeToolUp = function cycleModeToolUp(tl) {

                    cycleModeTool(tl, true);
                },

                cycleModeToolDown = function cycleModeToolDown(tl) {

                    cycleModeTool(tl, false);
                },

                toggleTerrainTool = function toggleTerrainTool() {

                    toggleTool(terrainTool);
                },

                selectTerrainToolSmoothUp = function selectTerrainToolSmoothUp() {

                    selectToolMode(terrainTool, toolModes[tools.TERRAIN].SMOOTH_UP);
                },

                selectTerrainToolRoughUp = function selectTerrainToolRoughUp() {

                    selectToolMode(terrainTool, toolModes[tools.TERRAIN].ROUGH_UP);
                },

                selectTerrainToolSmoothDown = function selectTerrainToolSmoothDown() {

                    selectToolMode(terrainTool, toolModes[tools.TERRAIN].SMOOTH_DOWN);
                },

                selectTerrainToolRoughDown = function selectTerrainToolRoughDown() {

                    selectToolMode(terrainTool, toolModes[tools.TERRAIN].ROUGH_DOWN);
                },

                cycleModeTerrainToolUp = function cycleModeTerrainToolUp() {

                    cycleModeToolUp(terrainTool);
                },

                cycleModeTerrainToolDown = function cycleModeTerrainToolDown() {

                    cycleModeToolDown(terrainTool);
                },

                toggleTrackTool = function toggleTrackTool() {

                    toggleTool(trackTool);
                },

                selectTrackToolBuild = function selectTrackToolBuild() {

                    selectToolMode(trackTool, toolModes[tools.TRACK].BUILD);
                },

                selectTrackToolDemolish = function selectTrackToolDemolish() {

                    selectToolMode(trackTool, toolModes[tools.TRACK].DEMOLISH);
                },

                cycleModeTrackToolUp = function cycleModeTrackToolUp() {

                    cycleModeTool(trackTool, true);
                },

                cycleModeTrackToolDown = function cycleModeTrackToolDown() {

                    cycleModeTool(trackTool, false);
                },

                toggleDecorationTool = function toggleDecorationTool() {

                    toggleTool(decorationTool);
                },

                selectDecorationToolBuild = function selectDecorationToolBuild() {

                    selectToolMode(decorationTool, toolModes[tools.DECORATION].BUILD);
                },

                selectDecorationToolDemolish = function selectDecorationToolDemolish() {

                    selectToolMode(decorationTool, toolModes[tools.DECORATION].DEMOLISH);
                },

                cycleModeDecorationToolUp = function cycleModeDecorationToolUp() {

                    cycleModeTool(decorationTool, true);
                },

                cycleModeDecorationToolDown = function cycleModeDecorationToolDown() {

                    cycleModeTool(decorationTool, false);
                },

                getCurrentZoomLevel = function getCurrentZoomLevel() {

                    return camera.getZoom();
                },

                getMinimumZoomLevel = function getMinimumZoomLevel() {

                    return camera.getMinimumZoom();
                },

                getMaximumZoomLevel = function getMaximumZoomLevel() {

                    return camera.getMaximumZoom();
                },

                getSelectedTool = function getSelectedTool() {

                    var type;

                    if (selectedTool) {

                        type = selectedTool.getType();
                    }

                    return type;
                },

                getCurrentModeTool = function getCurrentModeTool(tl) {

                    return tl === selectedTool && isOppositeModeSelected ? tl.getOppositeCurrentMode() : tl.getCurrentMode();
                },

                getCurrentModeTerrainTool = function getCurrentModeTerrainTool() {

                    return getCurrentModeTool(terrainTool);
                },

                getCurrentModeTrackTool = function getCurrentModeTrackTool() {

                    return getCurrentModeTool(trackTool);
                },

                getCurrentModeDecorationTool = function getCurrentModeDecorationTool() {

                    return getCurrentModeTool(decorationTool);
                },

                initialise = function initialise() {

                    toolModes[tools.TERRAIN] = {};
                    toolModes[tools.TERRAIN].SMOOTH_UP = 0;
                    toolModes[tools.TERRAIN].ROUGH_UP = 1;
                    toolModes[tools.TERRAIN].SMOOTH_DOWN = 2;
                    toolModes[tools.TERRAIN].ROUGH_DOWN = 3;
                    toolModes[tools.TRACK] = {};
                    toolModes[tools.TRACK].BUILD = 0;
                    toolModes[tools.TRACK].DEMOLISH = 1;
                    toolModes[tools.DECORATION] = {};
                    toolModes[tools.DECORATION].BUILD = 0;
                    toolModes[tools.DECORATION].DEMOLISH = 1;
                    terrainTool = tool(tools.TERRAIN);
                    terrainTool.addMode(toolModes[tools.TERRAIN].SMOOTH_UP, toolModes[tools.TERRAIN].SMOOTH_DOWN);
                    terrainTool.addMode(toolModes[tools.TERRAIN].ROUGH_UP, toolModes[tools.TERRAIN].ROUGH_DOWN);
                    terrainTool.addMode(toolModes[tools.TERRAIN].SMOOTH_DOWN, toolModes[tools.TERRAIN].SMOOTH_UP);
                    terrainTool.addMode(toolModes[tools.TERRAIN].ROUGH_DOWN, toolModes[tools.TERRAIN].ROUGH_UP);
                    trackTool = tool(tools.TRACK);
                    trackTool.addMode(toolModes[tools.TRACK].BUILD, toolModes[tools.TRACK].DEMOLISH);
                    trackTool.addMode(toolModes[tools.TRACK].DEMOLISH, toolModes[tools.TRACK].BUILD);
                    decorationTool = tool(tools.DECORATION);
                    decorationTool.addMode(toolModes[tools.DECORATION].BUILD, toolModes[tools.DECORATION].DEMOLISH);
                    decorationTool.addMode(toolModes[tools.DECORATION].DEMOLISH, toolModes[tools.DECORATION].BUILD);
                };

            instance.tools = tools;
            instance.toolModes = toolModes;
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
            instance.selectTerrainToolSmoothUp = selectTerrainToolSmoothUp;
            instance.selectTerrainToolRoughUp = selectTerrainToolRoughUp;
            instance.selectTerrainToolSmoothDown = selectTerrainToolSmoothDown;
            instance.selectTerrainToolRoughDown = selectTerrainToolRoughDown;
            instance.cycleModeTerrainToolUp = cycleModeTerrainToolUp;
            instance.cycleModeTerrainToolDown = cycleModeTerrainToolDown;
            instance.toggleTrackTool = toggleTrackTool;
            instance.selectTrackToolBuild = selectTrackToolBuild;
            instance.selectTrackToolDemolish = selectTrackToolDemolish;
            instance.cycleModeTrackToolUp = cycleModeTrackToolUp;
            instance.cycleModeTrackToolDown = cycleModeTrackToolDown;
            instance.toggleDecorationTool = toggleDecorationTool;
            instance.selectDecorationToolBuild = selectDecorationToolBuild;
            instance.selectDecorationToolDemolish = selectDecorationToolDemolish;
            instance.cycleModeDecorationToolUp = cycleModeDecorationToolUp;
            instance.cycleModeDecorationToolDown = cycleModeDecorationToolDown;
            instance.getCurrentZoomLevel = getCurrentZoomLevel;
            instance.getMinimumZoomLevel = getMinimumZoomLevel;
            instance.getMaximumZoomLevel = getMaximumZoomLevel;
            instance.getSelectedTool = getSelectedTool;
            instance.getCurrentModeTerrainTool = getCurrentModeTerrainTool;
            instance.getCurrentModeTrackTool = getCurrentModeTrackTool;
            instance.getCurrentModeDecorationTool = getCurrentModeDecorationTool;
            initialise();

            return instance;
        };

    return toolbarModel;
});

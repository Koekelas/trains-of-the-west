/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,
        decorationLocations = require("game/constants").decorationLocations,
        map = require("support/map"),
        math = require("support/math"),
        rotationWalker = require("game/rotationWalker"),
        terrainModifier = require("game/terrainModifier"),

        terrainClickHelper = function terrainClickHelper(gameScene, terrain) {

            var terrainMdfr = terrainModifier(terrain),
                instance = {},

                northAlignDistances = function northAlignDistances(distances) {

                    var cameraRotation = terrain.getActiveCameraRotation(),
                        dstncs,
                        direction,
                        rotationWlkr;

                    if (cameraRotation === directions.NORTH) {

                        return;
                    }

                    dstncs = [];
                    direction = directions.NORTH;
                    rotationWlkr = rotationWalker();
                    dstncs.push(distances.get(directions.NORTH));
                    dstncs.push(distances.get(directions.EAST));
                    dstncs.push(distances.get(directions.SOUTH));
                    dstncs.push(distances.get(directions.WEST));

                    while (direction !== cameraRotation) {

                        dstncs.push(dstncs.shift());
                        direction = rotationWlkr.walk(direction, directions.CLOCKWISE);
                    }

                    distances.set(directions.NORTH, dstncs[0]);
                    distances.set(directions.EAST, dstncs[1]);
                    distances.set(directions.SOUTH, dstncs[2]);
                    distances.set(directions.WEST, dstncs[3]);
                },

                findClosestCorner = function findClosestCorner(distances) {

                    var closestCorner = directions.NORTH;

                    distances.each(function eachDistance(distance, corner) {

                        if (distance < distances.get(closestCorner)) {

                            closestCorner = corner;
                        }
                    });

                    return closestCorner;
                },

                modifyTerrain = function modifyTerrain(tile, toolbar, mouse) {

                    var distances = map(),
                        spriteSheetCellCorners = tile.getMetadata("corners", true),
                        cornerNorth = spriteSheetCellCorners[directions.NORTH],
                        cornerEast = spriteSheetCellCorners[directions.EAST],
                        cornerSouth = spriteSheetCellCorners[directions.SOUTH],
                        cornerWest = spriteSheetCellCorners[directions.WEST],
                        mouseX = mouse.x,
                        mouseY = mouse.y,
                        spriteSheetCellHeights = tile.getMetadata("heights", true),
                        heightWest = spriteSheetCellHeights[directions.WEST],
                        corners = map(),
                        modeDesc = toolbar.getTerrainToolCurrentModeDesc(),
                        culprit;

                    distances.set(directions.NORTH, math.distance(cornerNorth.x, cornerNorth.y, mouseX, mouseY));
                    distances.set(directions.EAST, math.distance(cornerEast.x, cornerEast.y, mouseX, mouseY));
                    distances.set(directions.SOUTH, math.distance(cornerSouth.x, cornerSouth.y, mouseX, mouseY));
                    distances.set(directions.WEST, math.distance(cornerWest.x, cornerWest.y, mouseX, mouseY));

                    //ignore the north corner if it's hidden
                    if (heightWest === spriteSheetCellHeights[directions.EAST] && heightWest > spriteSheetCellHeights[directions.NORTH]) {

                        distances.set(directions.NORTH, Infinity);
                    }

                    northAlignDistances(distances);
                    corners.set(directions.NORTH, 0);
                    corners.set(directions.EAST, 0);
                    corners.set(directions.SOUTH, 0);
                    corners.set(directions.WEST, 0);
                    corners.set(findClosestCorner(distances), modeDesc.up ? 1 : -1);
                    culprit = terrainMdfr.modify(tile, corners, modeDesc.modifier);

                    if (culprit) {

                        culprit.createHighlight();
                    }
                },

                modifyTrack = function modifyTrack(tile, toolbar, mouse) {

                    //tmp
                    tile.createTrack(0);
                },

                modifyDecoration = function modifyDecoration(tile, toolbar, mouse) {

                    //tmp
                    tile.createDecorationSmall(Math.floor(Math.random() * 16), 0);
                },

                onClick = function onClick(event, mouse) {

                    var toolbar = gameScene.getEntity("toolbar"),
                        modifyImplementation;

                    event.stopImmediatePropagation();

                    if (toolbar.isTerrainToolSelected()) {

                        modifyImplementation = modifyTerrain;
                    } else if (toolbar.isTrackToolSelected()) {

                        modifyImplementation = modifyTrack;
                    } else if (toolbar.isDecorationToolSelected()) {

                        modifyImplementation = modifyDecoration;
                    }

                    if (modifyImplementation) {

                        modifyImplementation(this, toolbar, mouse);
                    }
                };

            instance.onClick = onClick;

            return instance;
        };

    return terrainClickHelper;
});

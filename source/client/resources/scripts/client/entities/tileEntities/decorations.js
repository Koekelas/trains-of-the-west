/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var decorationLocations = require("game/constants").decorationLocations,
        pocketKnife = require("support/pocketKnife"),
        decorationLarge = require("game/decorationLarge"),
        decorationSmall = require("game/decorationSmall"),

        gridDimensions = {

            ROWS: 4,
            COLUMNS: 4
        },

        terrain,

        prototype = {

            _createLocationDesc: function _createLocationDesc(row, column) {

                return { row: row, column: column };
            },

            _getLocation: function _getLocation(locationAsEnum) {

                switch (locationAsEnum) {

                case decorationLocations.NORTH_NORTH:

                    return this._createLocationDesc(0, 0);
                case decorationLocations.NORTH_EAST:

                    return this._createLocationDesc(0, 1);
                case decorationLocations.NORTH_SOUTH:

                    return this._createLocationDesc(1, 1);
                case decorationLocations.NORTH_WEST:

                    return this._createLocationDesc(1, 0);
                case decorationLocations.EAST_NORTH:

                    return this._createLocationDesc(0, 2);
                case decorationLocations.EAST_EAST:

                    return this._createLocationDesc(0, 3);
                case decorationLocations.EAST_SOUTH:

                    return this._createLocationDesc(1, 3);
                case decorationLocations.EAST_WEST:

                    return this._createLocationDesc(1, 2);
                case decorationLocations.SOUTH_NORTH:

                    return this._createLocationDesc(2, 2);
                case decorationLocations.SOUTH_EAST:

                    return this._createLocationDesc(2, 3);
                case decorationLocations.SOUTH_SOUTH:

                    return this._createLocationDesc(3, 3);
                case decorationLocations.SOUTH_WEST:

                    return this._createLocationDesc(3, 2);
                case decorationLocations.WEST_NORTH:

                    return this._createLocationDesc(2, 0);
                case decorationLocations.WEST_EAST:

                    return this._createLocationDesc(2, 1);
                case decorationLocations.WEST_SOUTH:

                    return this._createLocationDesc(3, 1);
                case decorationLocations.WEST_WEST:

                    return this._createLocationDesc(3, 0);
                default:

                    return undefined;
                }
            },

            _getDecoration: function _getDecoration(row, column) {

                return this._grid[row] ? this._grid[row][column] : undefined;
            },

            _createDecoration: function _createDecoration(large, location, spriteSheetCell) {

                var lctn = this._getLocation(location),
                    decoration = this._getDecoration(lctn.row, lctn.column),
                    row;

                if (!decoration) {

                    decoration = decorationSmall(terrain, spriteSheetCell);
                    row = lctn.row;

                    if (!this._grid[row]) {

                        this._grid[row] = {};
                    }

                    this._grid[row][lctn.column] = decoration;
                } else {

                    decoration.setSpriteSheetCell(spriteSheetCell);
                }
            },

            createLarge: function createLarge(location, spriteSheetCell) {

                this._createDecoration(true, location, spriteSheetCell);
            },

            createSmall: function createSmall(location, spriteSheetCell) {

                this._createDecoration(false, location, spriteSheetCell);
            },

            update: function update(x, y, layer, cameraRotation) {

                var terrainSpriteSheet = terrain.getActiveTerrainSpriteSheet(),
                    eighthSurfaceWidth = terrainSpriteSheet.getCellWidth() / 8,
                    eighthSurfaceHeight = Math.floor(terrainSpriteSheet.getCellHeight() / 24),
                    xOffset = x + eighthSurfaceWidth * 3,
                    yOffset = y,
                    row,
                    numberOfRows,
                    column,
                    numberOfColumns,
                    decoration,
                    numberOfLayersAcquired = 0;

                for (row = 0, numberOfRows = gridDimensions.ROWS; row < numberOfRows; ++row) {

                    for (column = 0, numberOfColumns = gridDimensions.COLUMNS; column < numberOfColumns; ++column) {

                        decoration = this._getDecoration(row, column);

                        if (decoration) {

                            numberOfLayersAcquired += decoration.update(

                                xOffset + (column - row) * eighthSurfaceWidth,
                                yOffset + (row + column) * eighthSurfaceHeight,
                                layer + numberOfLayersAcquired,
                                cameraRotation
                            );
                        }
                    }
                }

                return numberOfLayersAcquired;
            },

            releaseElements: function releaseElements() {

                var row,
                    numberOfRows,
                    column,
                    numberOfColumns,
                    decoration;

                for (row = 0, numberOfRows = gridDimensions.ROWS; row < numberOfRows; ++row) {

                    for (column = 0, numberOfColumns = gridDimensions.COLUMNS; column < numberOfColumns; ++column) {

                        decoration = this._getDecoration(row, column);

                        if (decoration) {

                            decoration.releaseElements();
                        }
                    }
                }
            },

            _initialise: function _initialise() {

                this._grid = {};

                return this;
            }
        },

        create = function create(trrn) {

            if (terrain !== trrn) {

                terrain = trrn;
            }

            return pocketKnife.create(prototype)._initialise();
        };

    return create;
});

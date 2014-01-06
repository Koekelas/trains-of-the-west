/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,
        chunkDimensions = require("game/constants").terrainDesc.chunkDimensions,
        terrainDimensions = require("game/constants").terrainDesc.terrainDimensions,
        tileHeightLevels = require("game/constants").terrainDesc.tileHeightLevels,
        layerManager = require("core/layerManager"),
        map = require("support/map"),

        terrainUpdateHelper = function terrainUpdateHelper(terrain) {

            var gridOrigin = {

                    ROW: (chunkDimensions.ROWS * terrainDimensions.ROWS - 1) / 2,
                    COLUMN: (chunkDimensions.COLUMNS * terrainDimensions.COLUMNS - 1) / 2
                },
                previouslyUpdatedTiles = map(),
                instance = {},

                getLocation = function getLocation(screenX, xOffset, halfSurfaceWidth, screenY, yOffset, halfSurfaceHeight) {

                    var row = ((screenY - yOffset) / halfSurfaceHeight - (screenX - xOffset) / halfSurfaceWidth) / 2,
                        column = (screenX - xOffset) / halfSurfaceWidth + row;

                    return { row: row, column: column };
                },

                getTile = function getTile(cameraRotation, row, column) {

                    if (cameraRotation !== directions.NORTH) {

                        var swap;

                        //translate
                        row -= gridOrigin.ROW;
                        column -= gridOrigin.COLUMN;

                        //rotate
                        switch (cameraRotation) {

                        case directions.EAST:

                            swap = row;
                            row = column * -1;
                            column = swap;

                            break;
                        case directions.SOUTH:

                            row *= -1;
                            column *= -1;

                            break;
                        case directions.WEST:

                            swap = row;
                            row = column;
                            column = swap * -1;

                            break;
                        }

                        //translate
                        row += gridOrigin.ROW;
                        column += gridOrigin.COLUMN;
                    }

                    return terrain.getTile(row, column);
                },

                isVisible = function isVisible(screenX, screenY, width, height, viewportWidth, viewportHeight) {

                    if (screenX + width < 0) {

                        return false;
                    }

                    if (screenX > viewportWidth) {

                        return false;
                    }

                    if (screenY + height < 0) {

                        return false;
                    }

                    return !(screenY > viewportHeight);
                },

                updateTiles = function updateTiles(cameraX, cameraY, cameraRotation, viewportWidth, viewportHeight) {

                    var spriteSheet = terrain.getActiveTerrainSpriteSheet(),
                        spriteSheetCellWidth = spriteSheet.getCellWidth(),
                        spriteSheetCellHeight = spriteSheet.getCellHeight(),
                        xOffset = (cameraX - ((chunkDimensions.COLUMNS * terrainDimensions.COLUMNS / 2 - 0.5) * spriteSheetCellWidth)) * -1,
                        yOffset = cameraY * -1,
                        halfSurfaceWidth = spriteSheetCellWidth / 2,
                        halfSurfaceHeight = Math.ceil(spriteSheetCellHeight / 6),
                        tileNorthWest = getLocation(0, xOffset, halfSurfaceWidth, 0, yOffset, halfSurfaceHeight),
                        tileNorthEast = getLocation(viewportWidth, xOffset, halfSurfaceWidth, 0, yOffset, halfSurfaceHeight),
                        tileSouthEast = getLocation(viewportWidth, xOffset, halfSurfaceWidth, viewportHeight, yOffset, halfSurfaceHeight),
                        tileSouthWest = getLocation(0, xOffset, halfSurfaceWidth, viewportHeight, yOffset, halfSurfaceHeight),
                        row,
                        startRow = Math.floor(tileNorthEast.row) - 1,
                        stopRow = Math.ceil(tileSouthWest.row) + Math.ceil(tileHeightLevels.MAXIMUM / 2) + 1,
                        column,
                        startColumn = Math.floor(tileNorthWest.column) - 3,
                        stopColumn = Math.ceil(tileSouthEast.column) + Math.ceil(tileHeightLevels.MAXIMUM / 2) + 3,
                        tile,
                        x,
                        y,
                        layer = layerManager.getLayer("terrainStart"),
                        updatedTiles = map();

                    for (row = startRow; row < stopRow; ++row) {

                        for (column = startColumn; column < stopColumn; ++column) {

                            tile = getTile(cameraRotation, row, column);

                            if (tile) {

                                x = (column - row) * halfSurfaceWidth + xOffset;
                                y = (row + column - tile.getHeight()) * halfSurfaceHeight + yOffset;

                                if (isVisible(x, y, spriteSheetCellWidth, spriteSheetCellHeight, viewportWidth, viewportHeight)) {

                                    layer = tile.update(x, y, layer, cameraRotation);
                                    updatedTiles.set(tile, tile);
                                }
                            }
                        }
                    }

                    return updatedTiles;
                },

                cleanupPreviouslyUpdatedTiles = function cleanupPreviouslyUpdatedTiles(updatedTiles) {

                    previouslyUpdatedTiles.each(function eachPreviouslyUpdatedTile(tile, hash) {

                        if (!updatedTiles.get(hash)) {

                            tile.releaseElements();
                        }
                    });
                },

                update = function update(cameraDesc) {

                    var updatedTiles = updateTiles(

                            cameraDesc.x,
                            cameraDesc.y,
                            cameraDesc.rotation,
                            cameraDesc.viewportWidth,
                            cameraDesc.viewportHeight
                        );

                    cleanupPreviouslyUpdatedTiles(updatedTiles);
                    previouslyUpdatedTiles = updatedTiles;
                };

            instance.update = update;

            return instance;
        };

    return terrainUpdateHelper;
});

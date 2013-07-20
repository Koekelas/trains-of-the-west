/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,

        terrainSpriteSheetAnalyser = function terrainSpriteSheetAnalyser() {

            var instance = {},

                createCorner = function createCorner(x, y) {

                    return { x: x, y: y };
                },

                analyse = function analyse(spriteSheet) {

                    var spriteSheetCell,
                        numberOfSpriteSheetCells,
                        corners,
                        spriteSheetCellHeights,
                        spriteSheetCellHeightSouth,
                        spriteSheetCellWidth = spriteSheet.getCellWidth(),
                        spriteSheetCellHeight = spriteSheet.getCellHeight(),
                        bottom = spriteSheetCellHeight - 1,
                        left = 0,
                        horizontalCenter = spriteSheetCellWidth / 2,
                        right = spriteSheetCellWidth - 1,
                        surfaceVerticalCenter = Math.floor(spriteSheetCellHeight / 6) + 0.5,
                        halfDirtHeight = Math.ceil(spriteSheetCellHeight / 3),
                        quarterDirtHeight = halfDirtHeight / 2,
                        cornerSouthY;

                    for (spriteSheetCell = 0, numberOfSpriteSheetCells = spriteSheet.getNumberOfCells(); spriteSheetCell < numberOfSpriteSheetCells; ++spriteSheetCell) {

                        corners = {};
                        spriteSheetCellHeights = spriteSheet.getMetadata(spriteSheetCell, "heights");
                        spriteSheetCellHeightSouth = spriteSheetCellHeights[directions.SOUTH];
                        cornerSouthY = bottom - halfDirtHeight - quarterDirtHeight * spriteSheetCellHeightSouth;
                        corners[directions.SOUTH] = createCorner(horizontalCenter, cornerSouthY);
                        corners[directions.NORTH] = createCorner(

                            horizontalCenter,
                            Math.max(

                                0,
                                cornerSouthY - Math.floor((spriteSheetCellHeights[directions.NORTH] + 2 - spriteSheetCellHeightSouth) * surfaceVerticalCenter)
                            )
                        );
                        corners[directions.EAST] = createCorner(

                            right,
                            cornerSouthY - Math.floor((spriteSheetCellHeights[directions.EAST] + 1 - spriteSheetCellHeightSouth) * surfaceVerticalCenter)
                        );
                        corners[directions.WEST] = createCorner(

                            left,
                            cornerSouthY - Math.floor((spriteSheetCellHeights[directions.WEST] + 1 - spriteSheetCellHeightSouth) * surfaceVerticalCenter)
                        );
                        spriteSheet.setMetadata(spriteSheetCell, "corners", corners);
                    }
                };

            instance.analyse = analyse;

            return instance;
        };

    return terrainSpriteSheetAnalyser;
});

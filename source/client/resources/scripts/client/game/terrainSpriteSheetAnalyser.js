/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,
        cellHeightLevels = require("game/constants").terrainDesc.cellHeightLevels,

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
                        spriteSheetCellWidth = spriteSheet.getCellWidth(),
                        spriteSheetCellHeight = spriteSheet.getCellHeight(),
                        left = 0,
                        horizontalCenter = spriteSheetCellWidth / 2,
                        right = spriteSheetCellWidth - 1,
                        surfaceHeight = Math.floor(spriteSheetCellHeight / 3),
                        halfSurfaceHeight = Math.ceil(surfaceHeight / 2),
                        oneHeigh = Math.ceil(spriteSheetCellHeight / 6);

                    for (spriteSheetCell = 0, numberOfSpriteSheetCells = spriteSheet.getNumberOfCells(); spriteSheetCell < numberOfSpriteSheetCells; ++spriteSheetCell) {

                        corners = {};
                        spriteSheetCellHeights = spriteSheet.getMetadata(spriteSheetCell, "heights");
                        corners[directions.NORTH] = createCorner(

                            horizontalCenter,
                            Math.max(0, (cellHeightLevels.MAXIMUM - spriteSheetCellHeights[directions.NORTH]) * oneHeigh - 1)
                        );
                        corners[directions.EAST] = createCorner(

                            right,
                            halfSurfaceHeight + (cellHeightLevels.MAXIMUM - spriteSheetCellHeights[directions.EAST]) * oneHeigh - 1
                        );
                        corners[directions.SOUTH] = createCorner(

                            horizontalCenter,
                            surfaceHeight + (cellHeightLevels.MAXIMUM - spriteSheetCellHeights[directions.SOUTH]) * oneHeigh - 1
                        );
                        corners[directions.WEST] = createCorner(

                            left,
                            halfSurfaceHeight + (cellHeightLevels.MAXIMUM - spriteSheetCellHeights[directions.WEST]) * oneHeigh - 1
                        );

                        //exceptions to the above rules
                        switch (spriteSheetCell) {

                        case 1:

                            ++corners[directions.SOUTH].y; //dirt causes surface to face the back

                            break;
                        case 5:

                            ++corners[directions.NORTH].y; //dirt at east, south and west cause fold to face the back
                            ++corners[directions.SOUTH].y; //dirt causes surface to face the back

                            break;
                        }

                        spriteSheet.setMetadata(spriteSheetCell, "corners", corners);
                    }
                };

            instance.analyse = analyse;

            return instance;
        };

    return terrainSpriteSheetAnalyser;
});

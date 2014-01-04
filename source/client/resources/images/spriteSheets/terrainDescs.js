/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,
        directions = require("game/constants").directions,

        PATH = "resources/images/spriteSheets/terrain{{scaleFactor}}x.png",

        createCellDesc = function createCellDesc(heightNorth, heightEast, heightSouth, heightWest, rotationNorth, rotationEast, rotationSouth, rotationWest) {

            var heights = {},
                rotations = {};

            heights[directions.NORTH] = heightNorth;
            heights[directions.EAST] = heightEast;
            heights[directions.SOUTH] = heightSouth;
            heights[directions.WEST] = heightWest;
            rotations[directions.NORTH] = rotationNorth;
            rotations[directions.EAST] = rotationEast;
            rotations[directions.SOUTH] = rotationSouth;
            rotations[directions.WEST] = rotationWest;

            return { heights: heights, rotations: rotations };
        },

        metadata = {

            0: createCellDesc(1, 2, 1, 0, 0, 1, 2, 3),
            1: createCellDesc(0, 1, 2, 1, 1, 2, 3, 0),
            2: createCellDesc(1, 0, 1, 2, 2, 3, 0, 1),
            3: createCellDesc(2, 1, 0, 1, 3, 0, 1, 2),

            4: createCellDesc(1, 2, 1, 1, 4, 5, 6, 7),
            5: createCellDesc(1, 1, 2, 1, 5, 6, 7, 4),
            6: createCellDesc(1, 1, 1, 2, 6, 7, 4, 5),
            7: createCellDesc(2, 1, 1, 1, 7, 4, 5, 6),

            8: createCellDesc(2, 2, 1, 1, 8, 9, 10, 11),
            9: createCellDesc(1, 2, 2, 1, 9, 10, 11, 8),
            10: createCellDesc(1, 1, 2, 2, 10, 11, 8, 9),
            11: createCellDesc(2, 1, 1, 2, 11, 8, 9, 10),

            12: createCellDesc(2, 1, 2, 1, 12, 13, 12, 13),
            13: createCellDesc(1, 2, 1, 2, 13, 12, 13, 12),

            14: createCellDesc(2, 2, 2, 1, 14, 15, 16, 17),
            15: createCellDesc(1, 2, 2, 2, 15, 16, 17, 14),
            16: createCellDesc(2, 1, 2, 2, 16, 17, 14, 15),
            17: createCellDesc(2, 2, 1, 2, 17, 14, 15, 16),

            18: createCellDesc(2, 2, 2, 2, 18, 18, 18, 18)
        },
        terrainDescs = {};

    terrainDescs[zoomLevels.MINIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "1"),
        cellDimensions: {

            width: 128,
            height: 191
        },
        metadata: metadata
    };
    terrainDescs[zoomLevels.MEDIUM] = {

        path: PATH.replace("{{scaleFactor}}", "2"),
        cellDimensions: {

            width: 256,
            height: 383
        },
        metadata: metadata
    };
    terrainDescs[zoomLevels.MAXIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "3"),
        cellDimensions: {

            width: 384,
            height: 575
        },
        metadata: metadata
    };

    return terrainDescs;
});

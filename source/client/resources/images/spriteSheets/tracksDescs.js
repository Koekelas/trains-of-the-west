/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,
        directions = require("game/constants").directions,

        PATH = "resources/images/spriteSheets/tracks{{scaleFactor}}x.png",

        createCellDesc = function createCellDesc(rotationNorth, rotationEast, rotationSouth, rotationWest, emptyCorner) {

            var rotations = {};

            rotations[directions.NORTH] = rotationNorth;
            rotations[directions.EAST] = rotationEast;
            rotations[directions.SOUTH] = rotationSouth;
            rotations[directions.WEST] = rotationWest;

            return { rotations: rotations, emptyCorner: emptyCorner };
        },

        metadata = {

            0: createCellDesc(0, 1, 0, 1, undefined),
            1: createCellDesc(1, 0, 1, 0, undefined),

            2: createCellDesc(2, 3, 2, 3, undefined),
            3: createCellDesc(3, 2, 3, 2, undefined),

            4: createCellDesc(4, 5, 6, 7, undefined),
            5: createCellDesc(5, 6, 7, 4, undefined),
            6: createCellDesc(6, 7, 4, 5, undefined),
            7: createCellDesc(7, 4, 5, 6, undefined),

            8: createCellDesc(8, 9, 10, 11, undefined),
            9: createCellDesc(9, 10, 11, 8, undefined),
            10: createCellDesc(10, 11, 8, 9, undefined),
            11: createCellDesc(11, 8, 9, 10, undefined),

            12: createCellDesc(12, 13, 14, 15, directions.NORTH),
            13: createCellDesc(13, 14, 15, 12, directions.EAST),
            14: createCellDesc(14, 15, 12, 13, directions.SOUTH),
            15: createCellDesc(15, 12, 13, 14, directions.WEST),

            16: createCellDesc(16, 17, 18, 19, directions.SOUTH),
            17: createCellDesc(17, 18, 19, 16, directions.WEST),
            18: createCellDesc(18, 19, 16, 17, directions.NORTH),
            19: createCellDesc(19, 16, 17, 18, directions.EAST),

            20: createCellDesc(20, 21, 22, 23, directions.EAST),
            21: createCellDesc(21, 22, 23, 20, directions.SOUTH),
            22: createCellDesc(22, 23, 20, 21, directions.WEST),
            23: createCellDesc(23, 20, 21, 22, directions.NORTH)
        },
        tracksDescs = {};

    tracksDescs[zoomLevels.MINIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "1"),
        cellDimensions: {

            width: 128,
            height: 96
        },
        metadata: metadata
    };
    tracksDescs[zoomLevels.MEDIUM] = {

        path: PATH.replace("{{scaleFactor}}", "2"),
        cellDimensions: {

            width: 256,
            height: 191
        },
        metadata: metadata
    };
    tracksDescs[zoomLevels.MAXIMUM] = {

        path: PATH.replace("{{scaleFactor}}", "3"),
        cellDimensions: {

            width: 384,
            height: 287
        },
        metadata: metadata
    };

    return tracksDescs;
});

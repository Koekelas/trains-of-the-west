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

            2: createCellDesc(2, 3, 4, 5, undefined),
            3: createCellDesc(3, 4, 5, 2, undefined),
            4: createCellDesc(4, 5, 2, 3, undefined),
            5: createCellDesc(5, 2, 3, 4, undefined),

            6: createCellDesc(6, 7, 8, 9, undefined),
            7: createCellDesc(7, 8, 9, 6, undefined),
            8: createCellDesc(8, 9, 6, 7, undefined),
            9: createCellDesc(9, 6, 7, 8, undefined),

            10: createCellDesc(10, 11, 12, 13, directions.WEST),
            11: createCellDesc(11, 12, 13, 10, directions.NORTH),
            12: createCellDesc(12, 13, 10, 11, directions.EAST),
            13: createCellDesc(13, 10, 11, 12, directions.SOUTH),

            14: createCellDesc(14, 15, 16, 17, directions.EAST),
            15: createCellDesc(15, 16, 17, 14, directions.SOUTH),
            16: createCellDesc(16, 17, 14, 15, directions.WEST),
            17: createCellDesc(17, 14, 15, 16, directions.NORTH),

            18: createCellDesc(18, 19, 20, 21, directions.NORTH),
            19: createCellDesc(19, 20, 21, 18, directions.EAST),
            20: createCellDesc(20, 21, 18, 19, directions.SOUTH),
            21: createCellDesc(21, 18, 19, 20, directions.WEST)
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

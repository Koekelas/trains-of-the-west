/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,
        directions = require("game/constants").directions,

        PATH = "resources/images/spriteSheets/tracks{{scaleFactor}}x.png",

        createCellDesc = function createCellDesc(rotationNorth, rotationEast, rotationSouth, rotationWest) {

            var rotations = {};

            rotations[directions.NORTH] = rotationNorth;
            rotations[directions.EAST] = rotationEast;
            rotations[directions.SOUTH] = rotationSouth;
            rotations[directions.WEST] = rotationWest;

            return { rotations: rotations };
        },

        metadata = {

            0: createCellDesc(0, 1, 0, 1),
            1: createCellDesc(1, 0, 1, 0),

            2: createCellDesc(2, 3, 2, 3),
            3: createCellDesc(3, 2, 3, 2),

            4: createCellDesc(4, 5, 6, 7),
            5: createCellDesc(5, 6, 7, 4),
            6: createCellDesc(6, 7, 4, 5),
            7: createCellDesc(7, 4, 5, 6),

            8: createCellDesc(8, 9, 10, 11),
            9: createCellDesc(9, 10, 11, 8),
            10: createCellDesc(10, 11, 8, 9),
            11: createCellDesc(11, 8, 9, 10),

            12: createCellDesc(12, 13, 14, 15),
            13: createCellDesc(13, 14, 15, 12),
            14: createCellDesc(14, 15, 12, 13),
            15: createCellDesc(15, 12, 13, 14),

            16: createCellDesc(16, 17, 18, 19),
            17: createCellDesc(17, 18, 19, 16),
            18: createCellDesc(18, 19, 16, 17),
            19: createCellDesc(19, 16, 17, 18),

            20: createCellDesc(20, 21, 22, 23),
            21: createCellDesc(21, 22, 23, 20),
            22: createCellDesc(22, 23, 20, 21),
            23: createCellDesc(23, 20, 21, 22)
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

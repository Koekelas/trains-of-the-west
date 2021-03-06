/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,
        directions = require("game/constants").directions,

        PATH = "resources/images/spriteSheets/tracks{{scaleFactor}}x.png",

        createCellDesc = function createCellDesc(rotationNorth, rotationEast, rotationSouth, rotationWest, emptyCorner) {

            var rotations = {},
                cellDesc = {

                    rotations: rotations
                };

            rotations[directions.NORTH] = rotationNorth;
            rotations[directions.EAST] = rotationEast;
            rotations[directions.SOUTH] = rotationSouth;
            rotations[directions.WEST] = rotationWest;

            if (emptyCorner !== undefined) {

                cellDesc.emptyCorner = emptyCorner;
            }

            return cellDesc;
        },

        metadata = {

            //auto generated
            0: createCellDesc(0, 1, 0, 1),
            1: createCellDesc(1, 0, 1, 0),
            2: createCellDesc(2, 3, 4, 5),
            3: createCellDesc(3, 4, 5, 2),
            4: createCellDesc(4, 5, 2, 3),
            5: createCellDesc(5, 2, 3, 4),
            6: createCellDesc(6, 7, 8, 9),
            7: createCellDesc(7, 8, 9, 6),
            8: createCellDesc(8, 9, 6, 7),
            9: createCellDesc(9, 6, 7, 8),
            10: createCellDesc(10, 11, 12, 13, directions.WEST),
            11: createCellDesc(11, 12, 13, 10, directions.NORTH),
            12: createCellDesc(12, 13, 10, 11, directions.EAST),
            13: createCellDesc(13, 10, 11, 12, directions.SOUTH),
            14: createCellDesc(14, 15, 16, 17, directions.EAST),
            15: createCellDesc(15, 16, 17, 14, directions.SOUTH),
            16: createCellDesc(16, 17, 14, 15, directions.WEST),
            17: createCellDesc(17, 14, 15, 16, directions.NORTH),
            18: createCellDesc(18, 19, 20, 21),
            19: createCellDesc(19, 20, 21, 18),
            20: createCellDesc(20, 21, 18, 19),
            21: createCellDesc(21, 18, 19, 20),
            22: createCellDesc(22, 23, 24, 25, directions.EAST),
            23: createCellDesc(23, 24, 25, 22, directions.SOUTH),
            24: createCellDesc(24, 25, 22, 23, directions.WEST),
            25: createCellDesc(25, 22, 23, 24, directions.NORTH),
            26: createCellDesc(26, 27, 28, 29, directions.WEST),
            27: createCellDesc(27, 28, 29, 26, directions.NORTH),
            28: createCellDesc(28, 29, 26, 27, directions.EAST),
            29: createCellDesc(29, 26, 27, 28, directions.SOUTH),
            30: createCellDesc(30, 31, 32, 33),
            31: createCellDesc(31, 32, 33, 30),
            32: createCellDesc(32, 33, 30, 31),
            33: createCellDesc(33, 30, 31, 32),
            34: createCellDesc(34, 35, 36, 37),
            35: createCellDesc(35, 36, 37, 34),
            36: createCellDesc(36, 37, 34, 35),
            37: createCellDesc(37, 34, 35, 36),
            38: createCellDesc(38, 39, 40, 41),
            39: createCellDesc(39, 40, 41, 38),
            40: createCellDesc(40, 41, 38, 39),
            41: createCellDesc(41, 38, 39, 40),
            42: createCellDesc(42, 43, 44, 45),
            43: createCellDesc(43, 44, 45, 42),
            44: createCellDesc(44, 45, 42, 43),
            45: createCellDesc(45, 42, 43, 44),
            46: createCellDesc(46, 47, 48, 49, directions.SOUTH),
            47: createCellDesc(47, 48, 49, 46, directions.WEST),
            48: createCellDesc(48, 49, 46, 47, directions.NORTH),
            49: createCellDesc(49, 46, 47, 48, directions.EAST),
            50: createCellDesc(50, 51, 52, 53, directions.NORTH),
            51: createCellDesc(51, 52, 53, 50, directions.EAST),
            52: createCellDesc(52, 53, 50, 51, directions.SOUTH),
            53: createCellDesc(53, 50, 51, 52, directions.WEST),
            54: createCellDesc(54, 55, 56, 57),
            55: createCellDesc(55, 56, 57, 54),
            56: createCellDesc(56, 57, 54, 55),
            57: createCellDesc(57, 54, 55, 56),
            58: createCellDesc(58, 59, 60, 61, directions.NORTH),
            59: createCellDesc(59, 60, 61, 58, directions.EAST),
            60: createCellDesc(60, 61, 58, 59, directions.SOUTH),
            61: createCellDesc(61, 58, 59, 60, directions.WEST),
            62: createCellDesc(62, 63, 64, 65, directions.SOUTH),
            63: createCellDesc(63, 64, 65, 62, directions.WEST),
            64: createCellDesc(64, 65, 62, 63, directions.NORTH),
            65: createCellDesc(65, 62, 63, 64, directions.EAST),
            66: createCellDesc(66, 67, 68, 69),
            67: createCellDesc(67, 68, 69, 66),
            68: createCellDesc(68, 69, 66, 67),
            69: createCellDesc(69, 66, 67, 68),
            70: createCellDesc(70, 71, 72, 73),
            71: createCellDesc(71, 72, 73, 70),
            72: createCellDesc(72, 73, 70, 71),
            73: createCellDesc(73, 70, 71, 72),
            74: createCellDesc(74, 75, 76, 77, directions.WEST),
            75: createCellDesc(75, 76, 77, 74, directions.NORTH),
            76: createCellDesc(76, 77, 74, 75, directions.EAST),
            77: createCellDesc(77, 74, 75, 76, directions.SOUTH),
            78: createCellDesc(78, 79, 80, 81, directions.SOUTH),
            79: createCellDesc(79, 80, 81, 78, directions.WEST),
            80: createCellDesc(80, 81, 78, 79, directions.NORTH),
            81: createCellDesc(81, 78, 79, 80, directions.EAST),
            82: createCellDesc(82, 83, 84, 85, directions.NORTH),
            83: createCellDesc(83, 84, 85, 82, directions.EAST),
            84: createCellDesc(84, 85, 82, 83, directions.SOUTH),
            85: createCellDesc(85, 82, 83, 84, directions.WEST),
            86: createCellDesc(86, 87, 88, 89),
            87: createCellDesc(87, 88, 89, 86),
            88: createCellDesc(88, 89, 86, 87),
            89: createCellDesc(89, 86, 87, 88),
            90: createCellDesc(90, 91, 92, 93),
            91: createCellDesc(91, 92, 93, 90),
            92: createCellDesc(92, 93, 90, 91),
            93: createCellDesc(93, 90, 91, 92),
            94: createCellDesc(94, 95, 96, 97, directions.EAST),
            95: createCellDesc(95, 96, 97, 94, directions.SOUTH),
            96: createCellDesc(96, 97, 94, 95, directions.WEST),
            97: createCellDesc(97, 94, 95, 96, directions.NORTH),
            98: createCellDesc(98, 99, 100, 101, directions.WEST),
            99: createCellDesc(99, 100, 101, 98, directions.NORTH),
            100: createCellDesc(100, 101, 98, 99, directions.EAST),
            101: createCellDesc(101, 98, 99, 100, directions.SOUTH),
            102: createCellDesc(102, 103, 104, 105, directions.EAST),
            103: createCellDesc(103, 104, 105, 102, directions.SOUTH),
            104: createCellDesc(104, 105, 102, 103, directions.WEST),
            105: createCellDesc(105, 102, 103, 104, directions.NORTH),
            106: createCellDesc(106, 107, 108, 109),
            107: createCellDesc(107, 108, 109, 106),
            108: createCellDesc(108, 109, 106, 107),
            109: createCellDesc(109, 106, 107, 108),
            110: createCellDesc(110, 111, 112, 113),
            111: createCellDesc(111, 112, 113, 110),
            112: createCellDesc(112, 113, 110, 111),
            113: createCellDesc(113, 110, 111, 112),
            114: createCellDesc(114, 115, 116, 117, directions.NORTH),
            115: createCellDesc(115, 116, 117, 114, directions.EAST),
            116: createCellDesc(116, 117, 114, 115, directions.SOUTH),
            117: createCellDesc(117, 114, 115, 116, directions.WEST),
            118: createCellDesc(118, 119, 120, 121, directions.SOUTH),
            119: createCellDesc(119, 120, 121, 118, directions.WEST),
            120: createCellDesc(120, 121, 118, 119, directions.NORTH),
            121: createCellDesc(121, 118, 119, 120, directions.EAST),
            122: createCellDesc(122, 123, 124, 125, directions.NORTH),
            123: createCellDesc(123, 124, 125, 122, directions.EAST),
            124: createCellDesc(124, 125, 122, 123, directions.SOUTH),
            125: createCellDesc(125, 122, 123, 124, directions.WEST),
            126: createCellDesc(126, 127, 128, 129),
            127: createCellDesc(127, 128, 129, 126),
            128: createCellDesc(128, 129, 126, 127),
            129: createCellDesc(129, 126, 127, 128),
            130: createCellDesc(130, 131, 132, 133),
            131: createCellDesc(131, 132, 133, 130),
            132: createCellDesc(132, 133, 130, 131),
            133: createCellDesc(133, 130, 131, 132),
            134: createCellDesc(134, 135, 136, 137),
            135: createCellDesc(135, 136, 137, 134),
            136: createCellDesc(136, 137, 134, 135),
            137: createCellDesc(137, 134, 135, 136),
            138: createCellDesc(138, 139, 140, 141, directions.WEST),
            139: createCellDesc(139, 140, 141, 138, directions.NORTH),
            140: createCellDesc(140, 141, 138, 139, directions.EAST),
            141: createCellDesc(141, 138, 139, 140, directions.SOUTH),
            142: createCellDesc(142, 143, 144, 145, directions.EAST),
            143: createCellDesc(143, 144, 145, 142, directions.SOUTH),
            144: createCellDesc(144, 145, 142, 143, directions.WEST),
            145: createCellDesc(145, 142, 143, 144, directions.NORTH),
            146: createCellDesc(146, 147, 148, 149),
            147: createCellDesc(147, 148, 149, 146),
            148: createCellDesc(148, 149, 146, 147),
            149: createCellDesc(149, 146, 147, 148),
            150: createCellDesc(150, 151, 152, 153),
            151: createCellDesc(151, 152, 153, 150),
            152: createCellDesc(152, 153, 150, 151),
            153: createCellDesc(153, 150, 151, 152),
            154: createCellDesc(154, 155, 156, 157),
            155: createCellDesc(155, 156, 157, 154),
            156: createCellDesc(156, 157, 154, 155),
            157: createCellDesc(157, 154, 155, 156),
            158: createCellDesc(158, 159, 160, 161),
            159: createCellDesc(159, 160, 161, 158),
            160: createCellDesc(160, 161, 158, 159),
            161: createCellDesc(161, 158, 159, 160),
            162: createCellDesc(162, 163, 164, 165, directions.SOUTH),
            163: createCellDesc(163, 164, 165, 162, directions.WEST),
            164: createCellDesc(164, 165, 162, 163, directions.NORTH),
            165: createCellDesc(165, 162, 163, 164, directions.EAST),
            166: createCellDesc(166, 167, 168, 169, directions.NORTH),
            167: createCellDesc(167, 168, 169, 166, directions.EAST),
            168: createCellDesc(168, 169, 166, 167, directions.SOUTH),
            169: createCellDesc(169, 166, 167, 168, directions.WEST),
            170: createCellDesc(170, 171, 172, 173),
            171: createCellDesc(171, 172, 173, 170),
            172: createCellDesc(172, 173, 170, 171),
            173: createCellDesc(173, 170, 171, 172),
            174: createCellDesc(174, 175, 176, 177),
            175: createCellDesc(175, 176, 177, 174),
            176: createCellDesc(176, 177, 174, 175),
            177: createCellDesc(177, 174, 175, 176),
            178: createCellDesc(178, 179, 180, 181),
            179: createCellDesc(179, 180, 181, 178),
            180: createCellDesc(180, 181, 178, 179),
            181: createCellDesc(181, 178, 179, 180),
            182: createCellDesc(182, 183, 184, 185),
            183: createCellDesc(183, 184, 185, 182),
            184: createCellDesc(184, 185, 182, 183),
            185: createCellDesc(185, 182, 183, 184),
            186: createCellDesc(186, 187, 188, 189),
            187: createCellDesc(187, 188, 189, 186),
            188: createCellDesc(188, 189, 186, 187),
            189: createCellDesc(189, 186, 187, 188),
            190: createCellDesc(190, 191, 192, 193),
            191: createCellDesc(191, 192, 193, 190),
            192: createCellDesc(192, 193, 190, 191),
            193: createCellDesc(193, 190, 191, 192),
            194: createCellDesc(194, 195, 196, 197),
            195: createCellDesc(195, 196, 197, 194),
            196: createCellDesc(196, 197, 194, 195),
            197: createCellDesc(197, 194, 195, 196),
            198: createCellDesc(198, 199, 200, 201),
            199: createCellDesc(199, 200, 201, 198),
            200: createCellDesc(200, 201, 198, 199),
            201: createCellDesc(201, 198, 199, 200)
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

/*jslint browser: true, plusplus: true*/
/*global define*/

define(function () {

    "use strict";

    var constants =  {

        messageKeys: {

            TYPE: 0,
            DATA: 1
        },

        messageTypes: {

            LOAD_CHUNK: 0,
            MODIFY_TERRAIN: 1,
            BUILD_DECORATION: 2,
            DEMOLISH_DECORATION: 3
        },

        messageDataKeysRequest: {},
        messageDataKeysResponse: {},

        directions: {

            NORTH: 0,
            NORTH_EAST: 1,
            EAST: 2,
            SOUTH_EAST: 3,
            SOUTH: 4,
            SOUTH_WEST: 5,
            WEST: 6,
            NORTH_WEST: 7,
            CLOCKWISE: 8,
            COUNTERCLOCKWISE: 9
        },

        decorationLocations: {

            NORTH_NORTH: 0,
            NORTH_EAST: 1,
            NORTH_SOUTH: 2,
            NORTH_WEST: 3,
            EAST_NORTH: 4,
            EAST_EAST: 5,
            EAST_SOUTH: 6,
            EAST_WEST: 7,
            SOUTH_NORTH: 8,
            SOUTH_EAST: 9,
            SOUTH_SOUTH: 10,
            SOUTH_WEST: 11,
            WEST_NORTH: 12,
            WEST_EAST: 13,
            WEST_SOUTH: 14,
            WEST_WEST: 15
        },

        modifyTerrainModifiers: {

            SMOOTH: 0,
            ROUGH: 1
        },

        terrainDesc: {

            terrainDimensions: {

                ROWS: 10,
                COLUMNS: 10
            },

            chunkDimensions: {

                ROWS: 10,
                COLUMNS: 10
            },

            tileHeightLevels: {

                MINIMUM: 0,
                MAXIMUM: 10
            },

            cellHeightLevels: {

                MINIMUM: 0,
                MAXIMUM: 2
            }
        }
    };

    //Request
    //LOAD_CHUNK
    constants.messageDataKeysRequest[constants.messageTypes.LOAD_CHUNK] = {};
    constants.messageDataKeysRequest[constants.messageTypes.LOAD_CHUNK].ROW = 0;
    constants.messageDataKeysRequest[constants.messageTypes.LOAD_CHUNK].COLUMN = 1;

    //MODIFY_TERRAIN
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN] = {};
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].LOCATION = 0;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].CORNERS = 1;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].MODIFIER = 2;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].LOCATION_ROW = 0;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].LOCATION_COLUMN = 1;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].CORNERS_NORTH = 0;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].CORNERS_EAST = 1;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].CORNERS_SOUTH = 2;
    constants.messageDataKeysRequest[constants.messageTypes.MODIFY_TERRAIN].CORNERS_WEST = 3;

    //BUILD_DECORATION
    constants.messageDataKeysRequest[constants.messageTypes.BUILD_DECORATION] = {};
    constants.messageDataKeysRequest[constants.messageTypes.BUILD_DECORATION].LOCATION = 0;
    constants.messageDataKeysRequest[constants.messageTypes.BUILD_DECORATION].LOCATION_ROW = 0;
    constants.messageDataKeysRequest[constants.messageTypes.BUILD_DECORATION].LOCATION_COLUMN = 1;

    //DEMOLISH_DECORATION
    constants.messageDataKeysRequest[constants.messageTypes.DEMOLISH_DECORATION] = {};
    constants.messageDataKeysRequest[constants.messageTypes.DEMOLISH_DECORATION].LOCATION = 0;
    constants.messageDataKeysRequest[constants.messageTypes.DEMOLISH_DECORATION].LOCATION_ROW = 0;
    constants.messageDataKeysRequest[constants.messageTypes.DEMOLISH_DECORATION].LOCATION_COLUMN = 1;

    //Response
    //LOAD_CHUNK
    constants.messageDataKeysResponse[constants.messageTypes.LOAD_CHUNK] = {};
    constants.messageDataKeysResponse[constants.messageTypes.LOAD_CHUNK].LOCATION = 0;
    constants.messageDataKeysResponse[constants.messageTypes.LOAD_CHUNK].TILES = 1;
    constants.messageDataKeysResponse[constants.messageTypes.LOAD_CHUNK].LOCATION_ROW = 0;
    constants.messageDataKeysResponse[constants.messageTypes.LOAD_CHUNK].LOCATION_COLUMN = 1;
    constants.messageDataKeysResponse[constants.messageTypes.LOAD_CHUNK].TILES_TILE_SPRITE_SHEET_CELL = 0;
    constants.messageDataKeysResponse[constants.messageTypes.LOAD_CHUNK].TILES_TILE_HEIGHT = 1;

    //MODIFY_TERRAIN
    constants.messageDataKeysResponse[constants.messageTypes.MODIFY_TERRAIN] = {};
    constants.messageDataKeysResponse[constants.messageTypes.MODIFY_TERRAIN].LOCATION = 0;
    constants.messageDataKeysResponse[constants.messageTypes.MODIFY_TERRAIN].SPRITE_SHEET_CELL = 1;
    constants.messageDataKeysResponse[constants.messageTypes.MODIFY_TERRAIN].HEIGHT = 2;
    constants.messageDataKeysResponse[constants.messageTypes.MODIFY_TERRAIN].LOCATION_ROW = 0;
    constants.messageDataKeysResponse[constants.messageTypes.MODIFY_TERRAIN].LOCATION_COLUMN = 1;

    //BUILD_DECORATION
    constants.messageDataKeysResponse[constants.messageTypes.BUILD_DECORATION] = {};
    constants.messageDataKeysResponse[constants.messageTypes.BUILD_DECORATION].LOCATION = 0;
    constants.messageDataKeysResponse[constants.messageTypes.BUILD_DECORATION].LOCATION_ROW = 0;
    constants.messageDataKeysResponse[constants.messageTypes.BUILD_DECORATION].LOCATION_COLUMN = 1;

    //DEMOLISH_DECORATION
    constants.messageDataKeysResponse[constants.messageTypes.DEMOLISH_DECORATION] = {};
    constants.messageDataKeysResponse[constants.messageTypes.DEMOLISH_DECORATION].LOCATION = 0;
    constants.messageDataKeysResponse[constants.messageTypes.DEMOLISH_DECORATION].LOCATION_ROW = 0;
    constants.messageDataKeysResponse[constants.messageTypes.DEMOLISH_DECORATION].LOCATION_COLUMN = 1;

    return constants;
});

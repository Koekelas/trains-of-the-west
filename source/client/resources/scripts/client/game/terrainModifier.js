/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,
        messageTypes = require("game/constants").messageTypes,
        messageDataKeysResponse = require("game/constants").messageDataKeysResponse[messageTypes.MODIFY_TERRAIN],
        connection = require("core/connection"),
        pocketKnife = require("support/pocketKnife"),
        vector = require("support/vector"),
        logger = require("utilities/logger"),
        terrainModifierLogic = require("logic/terrainModifierLogic"),

        terrainModifier = function terrainModifier(terrain) {

            var logic = terrainModifierLogic(terrain),
                instance = {},

                modify = function modify(tile, corners, modifier) {

                    var culprit = logic.modify(tile, corners, modifier).culprit;

                    if (!culprit) {

                        connection.trigger(messageTypes.MODIFY_TERRAIN, [

                            [ tile.getRow(), tile.getColumn() ],
                            [ corners.get(directions.NORTH), corners.get(directions.EAST), corners.get(directions.SOUTH), corners.get(directions.WEST) ],
                            modifier
                        ]);
                    }

                    return culprit;
                },

                getModifyDescs = function getModifyDescs(data) {

                    var modifyDescs = vector(data),
                        modifyDscs = vector();

                    modifyDescs.each(function eachModifyDesc(modifyDesc) {

                        var modifyDsc = {},
                            location = modifyDesc[messageDataKeysResponse.LOCATION];

                        if (pocketKnife.isNumber(location[messageDataKeysResponse.LOCATION_ROW]) && pocketKnife.isNumber(location[messageDataKeysResponse.LOCATION_COLUMN])) {

                            modifyDsc.location = {

                                row: location[messageDataKeysResponse.LOCATION_ROW],
                                column: location[messageDataKeysResponse.LOCATION_COLUMN]
                            };
                        } else {

                            throw { message: "LOCATION_ROW and/or LOCATION_COLUMN is not a number" };
                        }

                        if (pocketKnife.isNumber(modifyDesc[messageDataKeysResponse.SPRITE_SHEET_CELL])) {

                            modifyDsc.spriteSheetCell = modifyDesc[messageDataKeysResponse.SPRITE_SHEET_CELL];
                        } else {

                            throw { message: "SPRITE_SHEET_CELL is not a number" };
                        }

                        if (pocketKnife.isNumber(modifyDesc[messageDataKeysResponse.HEIGHT])) {

                            modifyDsc.height = modifyDesc[messageDataKeysResponse.HEIGHT];
                        } else {

                            throw { message: "HEIGHT is not a number" };
                        }

                        modifyDscs.push(modifyDsc);
                    });

                    return modifyDscs;
                },

                addListeners = function addListeners() {

                    /*jslint unparam: true*/
                    connection.on(messageTypes.MODIFY_TERRAIN, function onModifyTerrain(event, data) {

                        var modifyDescs;

                        try {

                            modifyDescs = getModifyDescs(data);
                        } catch (exception) {

                            logger.logError("MODIFY_TERRAIN is ill-formed");
                            logger.group();
                            logger.logError(exception.message);
                            logger.ungroup();

                            return;
                        }

                        modifyDescs.each(function eachModifyDesc(modifyDesc) {

                            var location = modifyDesc.location,
                                tile = terrain.getTile(location.row, location.column);

                            if (tile) {

                                tile.setSpriteSheetCell(modifyDesc.spriteSheetCell);
                                tile.setHeight(modifyDesc.height);
                            }
                        });
                    });
                    /*jslint unparam: false*/
                },

                initialise = function initialise() {

                    addListeners();
                };

            instance.modify = modify;
            initialise();

            return instance;
        };

    return terrainModifier;
});

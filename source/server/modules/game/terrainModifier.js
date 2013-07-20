/*jslint node: true, plusplus: true*/

"use strict";

var directions = require("./constants").directions,
    messageTypes = require("./constants").messageTypes,
    messageDataKeysRequest = require("./constants").messageDataKeysRequest[messageTypes.MODIFY_TERRAIN],
    connections = require("../core/connections"),
    map = require("../support/map"),
    pocketKnife = require("../support/pocketKnife"),
    logger = require("../utilities/logger"),
    terrainModifierLogic = require("../logic/terrainModifierLogic"),

    terrainModifier = function terrainModifier(terrain) {

        var logic = terrainModifierLogic(terrain),
            instance = {},

            areCornersValid = function areCornersValid(corners) {

                return (

                    pocketKnife.isNumber(corners[messageDataKeysRequest.CORNERS_NORTH]) &&
                    pocketKnife.isNumber(corners[messageDataKeysRequest.CORNERS_EAST]) &&
                    pocketKnife.isNumber(corners[messageDataKeysRequest.CORNERS_SOUTH]) &&
                    pocketKnife.isNumber(corners[messageDataKeysRequest.CORNERS_WEST])
                );
            },

            getModifyDesc = function getModifyDesc(data) {

                var modifyDesc = {},
                    location = data[messageDataKeysRequest.LOCATION],
                    corners = data[messageDataKeysRequest.CORNERS],
                    crnrs = map();

                if (pocketKnife.isNumber(location[messageDataKeysRequest.LOCATION_ROW]) && pocketKnife.isNumber(location[messageDataKeysRequest.LOCATION_COLUMN])) {

                    modifyDesc.location = {

                        row: location[messageDataKeysRequest.LOCATION_ROW],
                        column: location[messageDataKeysRequest.LOCATION_COLUMN]
                    };
                } else {

                    throw { message: "LOCATION_ROW and/or LOCATION_COLUMN is not a number" };
                }

                if (areCornersValid(corners)) {

                    crnrs.set(directions.NORTH, corners[messageDataKeysRequest.CORNERS_NORTH]);
                    crnrs.set(directions.EAST, corners[messageDataKeysRequest.CORNERS_EAST]);
                    crnrs.set(directions.SOUTH, corners[messageDataKeysRequest.CORNERS_SOUTH]);
                    crnrs.set(directions.WEST, corners[messageDataKeysRequest.CORNERS_WEST]);
                    modifyDesc.corners = crnrs;
                } else {

                    throw { message: "CORNERS_NORTH, CORNERS_EAST, CORNERS_SOUTH and/or CORNERS_WEST is not a number" };
                }

                if (pocketKnife.isNumber(data[messageDataKeysRequest.MODIFIER])) {

                    modifyDesc.modifier = data[messageDataKeysRequest.MODIFIER];
                } else {

                    throw { message: "MODIFIER is not a number" };
                }

                return modifyDesc;
            },

            addListeners = function addListeners() {

                /*jslint unparam: true*/
                connections.on(messageTypes.MODIFY_TERRAIN, function onModifyTerrain(event, data) {

                    var modifyDesc,
                        location,
                        tile,
                        modifyResultDesc,
                        modifyDescs;

                    try {

                        modifyDesc = getModifyDesc(data);
                    } catch (exception) {

                        logger.logError("MODIFY_TERRAIN is ill-formed");
                        logger.logError(exception.message, 1);

                        return;
                    }

                    location = modifyDesc.location;
                    tile = terrain.getTile(location.row, location.column);

                    if (tile) {

                        modifyResultDesc = logic.modify(tile, modifyDesc.corners, modifyDesc.modifier);

                        if (!modifyResultDesc.culprit) {

                            modifyDescs = [];
                            modifyResultDesc.modifiedTiles.each(function eachModifiedTile(modifiedTile) {

                                modifyDescs.push([

                                    [ modifiedTile.getRow(), modifiedTile.getColumn() ],
                                    modifiedTile.getSpriteSheetCell(),
                                    modifiedTile.getHeight()
                                ]);
                            });

                            connections.trigger(messageTypes.MODIFY_TERRAIN, modifyDescs);
                        }
                    }
                });
                /*jslint unparam: false*/
            },

            initialise = function initialise() {

                addListeners();
            };

        initialise();

        return instance;
    };

module.exports = terrainModifier;

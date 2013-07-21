/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,
        modifyTerrainModifiers = require("game/constants").modifyTerrainModifiers,
        cellHeightLevels = require("game/constants").terrainDesc.cellHeightLevels,
        chunkDimensions = require("game/constants").terrainDesc.chunkDimensions,
        terrainDimensions = require("game/constants").terrainDesc.terrainDimensions,
        tileHeightLevels = require("game/constants").terrainDesc.tileHeightLevels,
        map = require("support/map"),
        vector = require("support/vector"),
        rotationWalker = require("game/rotationWalker"),
        terrainWalker = require("game/terrainWalker"),

        terrainModifierLogic = function terrainModifierLogic(terrain) {

            var relations = {

                    REFERENCE: 0,
                    CLOCKWISE: 1,
                    OPPOSITE: 2,
                    COUNTERCLOCKWISE: 3
                },
                instance = {},

                createTileDesc = function createTileDesc(tile, corner, modifyTileDescs) {

                    var modifyTileDesc = modifyTileDescs.get(tile),
                        tileHeights,
                        cellHeights,
                        heightOffset;

                    if (modifyTileDesc) {

                        tileHeights = modifyTileDesc.tileHeights;
                    } else {

                        tileHeights = map();
                        cellHeights = tile.getMetadata("heights");
                        heightOffset = tile.getHeight() - cellHeightLevels.MAXIMUM;
                        tileHeights.set(directions.NORTH, cellHeights[directions.NORTH]);
                        tileHeights.set(directions.EAST, cellHeights[directions.EAST]);
                        tileHeights.set(directions.SOUTH, cellHeights[directions.SOUTH]);
                        tileHeights.set(directions.WEST, cellHeights[directions.WEST]);
                        tileHeights.each(function eachTileHeight(tileHeight, crnr) {

                            tileHeights.set(crnr, tileHeight + heightOffset);
                        });
                    }

                    return { tile: tile, corner: corner, tileHeights: tileHeights };
                },

                createSurroundingTileDesc = function createSurroundingTileDesc(direction, relation, corner) {

                    return { direction: direction, relation: relation, corner: corner };
                },

                createTileDescsByGridPoint = function createTileDescsByGridPoint(tile, corner, modifyTileDescs) {

                    var tileDescs = map(),
                        surroundingTileDescs = vector(),
                        terrainWlkr = terrainWalker();

                    tileDescs.set(relations.REFERENCE, createTileDesc(tile, corner, modifyTileDescs));

                    switch (corner) {

                    case directions.NORTH:

                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.NORTH_WEST,
                            relations.CLOCKWISE,
                            directions.EAST
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.NORTH,
                            relations.OPPOSITE,
                            directions.SOUTH
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.NORTH_EAST,
                            relations.COUNTERCLOCKWISE,
                            directions.WEST
                        ));

                        break;

                    case directions.EAST:

                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.NORTH_EAST,
                            relations.CLOCKWISE,
                            directions.SOUTH
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.EAST,
                            relations.OPPOSITE,
                            directions.WEST
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.SOUTH_EAST,
                            relations.COUNTERCLOCKWISE,
                            directions.NORTH
                        ));

                        break;

                    case directions.SOUTH:

                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.SOUTH_EAST,
                            relations.CLOCKWISE,
                            directions.WEST
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.SOUTH,
                            relations.OPPOSITE,
                            directions.NORTH
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.SOUTH_WEST,
                            relations.COUNTERCLOCKWISE,
                            directions.EAST
                        ));

                        break;

                    case directions.WEST:

                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.SOUTH_WEST,
                            relations.CLOCKWISE,
                            directions.NORTH
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.WEST,
                            relations.OPPOSITE,
                            directions.EAST
                        ));
                        surroundingTileDescs.push(createSurroundingTileDesc(

                            directions.NORTH_WEST,
                            relations.COUNTERCLOCKWISE,
                            directions.SOUTH
                        ));

                        break;
                    }

                    surroundingTileDescs.each(function eachSurroundingTileDesc(surroundingTileDesc) {

                        var tl = terrainWlkr.walk(terrain, tile, surroundingTileDesc.direction);

                        if (tl) {

                            tileDescs.set(

                                surroundingTileDesc.relation,
                                createTileDesc(tl, surroundingTileDesc.corner, modifyTileDescs)
                            );
                        }
                    });

                    return tileDescs;
                },

                getAffectedTileDescsModeSmoothUp = function getAffectedTileDescsModeSmoothUp(referenceHeight, potentiallyAffectedTileDescs) {

                    var lowestHeightDelta = 0,
                        affectedTileDescs = map();

                    potentiallyAffectedTileDescs.each(function eachTileDesc(tileDesc) {

                        var heightDelta = tileDesc.tileHeights.get(tileDesc.corner) - referenceHeight;

                        if (heightDelta < lowestHeightDelta) {

                            lowestHeightDelta = heightDelta;
                            affectedTileDescs = map();
                        }

                        if (heightDelta === lowestHeightDelta) {

                            affectedTileDescs.set(tileDesc.tile, tileDesc);
                        }
                    });

                    return affectedTileDescs;
                },

                getAffectedTileDescsModeSmoothDown = function getAffectedTileDescsModeSmoothDown(referenceHeight, potentiallyAffectedTileDescs) {

                    var highestHeightDelta = 0,
                        affectedTileDescs = map();

                    potentiallyAffectedTileDescs.each(function eachTileDesc(tileDesc) {

                        var heightDelta = tileDesc.tileHeights.get(tileDesc.corner) - referenceHeight;

                        if (heightDelta > highestHeightDelta) {

                            highestHeightDelta = heightDelta;
                            affectedTileDescs = map();
                        }

                        if (heightDelta === highestHeightDelta) {

                            affectedTileDescs.set(tileDesc.tile, tileDesc);
                        }
                    });

                    return affectedTileDescs;
                },

                getAffectedTileDescsModeRoughUp = function getAffectedTileDescsModeRoughUp(referenceHeight, potentiallyAffectedTileDescs) {

                    var referenceTileDesc = potentiallyAffectedTileDescs.get(relations.REFERENCE),
                        affectedTileDescs = map();

                    affectedTileDescs.set(referenceTileDesc.tile, referenceTileDesc);
                    potentiallyAffectedTileDescs.each(function eachTileDesc(tileDesc, relation) {

                        var heightDelta = tileDesc.tileHeights.get(tileDesc.corner) - referenceHeight;

                        if (relation === relations.CLOCKWISE || relation === relations.COUNTERCLOCKWISE) {

                            if (heightDelta <= cellHeightLevels.MAXIMUM * -1) {

                                affectedTileDescs.set(tileDesc.tile, tileDesc);
                            }
                        } else if (relation === relations.OPPOSITE) {

                            if (heightDelta <= cellHeightLevels.MAXIMUM * 2 * -1) {

                                affectedTileDescs.set(tileDesc.tile, tileDesc);
                            }
                        }
                    });

                    return affectedTileDescs;
                },

                getAffectedTileDescsModeRoughDown = function getAffectedTileDescsModeRoughDown(referenceHeight, potentiallyAffectedTileDescs) {

                    var referenceTileDesc = potentiallyAffectedTileDescs.get(relations.REFERENCE),
                        affectedTileDescs = map();

                    affectedTileDescs.set(referenceTileDesc.tile, referenceTileDesc);
                    potentiallyAffectedTileDescs.each(function eachTileDesc(tileDesc, relation) {

                        var heightDelta = tileDesc.tileHeights.get(tileDesc.corner) - referenceHeight;

                        if (relation === relations.CLOCKWISE || relation === relations.COUNTERCLOCKWISE) {

                            if (heightDelta >= cellHeightLevels.MAXIMUM) {

                                affectedTileDescs.set(tileDesc.tile, tileDesc);
                            }
                        } else if (relation === relations.OPPOSITE) {

                            if (heightDelta >= cellHeightLevels.MAXIMUM * 2) {

                                affectedTileDescs.set(tileDesc.tile, tileDesc);
                            }
                        }
                    });

                    return affectedTileDescs;
                },

                getAffectedTileDescs = function getAffectedTileDescs(tile, corner, modifier, up, modifyTileDescs) {

                    var getAffectedTileDescsModeImplementation,
                        potentiallyAffectedTileDescs = createTileDescsByGridPoint(tile, corner, modifyTileDescs),
                        referenceTileDesc = potentiallyAffectedTileDescs.get(relations.REFERENCE);

                    if (modifier === modifyTerrainModifiers.SMOOTH) {

                        if (up) {

                            getAffectedTileDescsModeImplementation = getAffectedTileDescsModeSmoothUp;
                        } else {

                            getAffectedTileDescsModeImplementation = getAffectedTileDescsModeSmoothDown;
                        }
                    } else {

                        if (up) {

                            getAffectedTileDescsModeImplementation = getAffectedTileDescsModeRoughUp;
                        } else {

                            getAffectedTileDescsModeImplementation = getAffectedTileDescsModeRoughDown;
                        }
                    }

                    return getAffectedTileDescsModeImplementation(

                        referenceTileDesc.tileHeights.get(referenceTileDesc.corner),
                        potentiallyAffectedTileDescs
                    );
                },

                createNewTileHeightsDesc = function createNewTileHeightsDesc(tileDesc, up) {

                    var rotationWlkr = rotationWalker(),
                        corner = tileDesc.corner,
                        cornerCounterclockwise = rotationWlkr.walk(corner, directions.COUNTERCLOCKWISE),
                        cornerClockwise = rotationWlkr.walk(corner, directions.CLOCKWISE),
                        cornerOpposite = rotationWlkr.walk(corner, directions.CLOCKWISE, 4),
                        tileHeights = tileDesc.tileHeights.clone(),
                        secondaryCorners = vector();

                    if (up) {

                        tileHeights.set(corner, tileHeights.get(corner) + 1);

                        if (tileHeights.get(corner) - tileHeights.get(cornerCounterclockwise) > 1) {

                            tileHeights.set(cornerCounterclockwise, tileHeights.get(cornerCounterclockwise) + 1);
                            secondaryCorners.push(cornerCounterclockwise);
                        }

                        if (tileHeights.get(corner) - tileHeights.get(cornerClockwise) > 1) {

                            tileHeights.set(cornerClockwise, tileHeights.get(cornerClockwise) + 1);
                            secondaryCorners.push(cornerClockwise);
                        }

                        if (tileHeights.get(cornerCounterclockwise) - tileHeights.get(cornerOpposite) > 1 || tileHeights.get(cornerClockwise) - tileHeights.get(cornerOpposite) > 1) {

                            tileHeights.set(cornerOpposite, tileHeights.get(cornerOpposite) + 1);
                            secondaryCorners.push(cornerOpposite);
                        }
                    } else {

                        tileHeights.set(corner, tileHeights.get(corner) - 1);

                        if ((tileHeights.get(cornerCounterclockwise) + 1) - (tileHeights.get(corner) + 1) > 1) {

                            tileHeights.set(cornerCounterclockwise, tileHeights.get(cornerCounterclockwise) - 1);
                            secondaryCorners.push(cornerCounterclockwise);
                        }

                        if ((tileHeights.get(cornerClockwise) + 1) - (tileHeights.get(corner) + 1) > 1) {

                            tileHeights.set(cornerClockwise, tileHeights.get(cornerClockwise) - 1);
                            secondaryCorners.push(cornerClockwise);
                        }

                        if (tileHeights.get(cornerOpposite) - tileHeights.get(cornerCounterclockwise) > 1 || tileHeights.get(cornerOpposite) - tileHeights.get(cornerClockwise) > 1) {

                            tileHeights.set(cornerOpposite, tileHeights.get(cornerOpposite) - 1);
                            secondaryCorners.push(cornerOpposite);
                        }
                    }

                    return { tileHeights: tileHeights, secondaryCorners: secondaryCorners };
                },

                findHighestCorner = function findHighestCorner(tileHeights) {

                    var highestCorner = directions.NORTH;

                    tileHeights.each(function eachTileHeight(tileHeight, corner) {

                        if (tileHeight > tileHeights.get(highestCorner)) {

                            highestCorner = corner;
                        }
                    });

                    return highestCorner;
                },

                areCellHeightsEqual = function areCellHeightsEqual(cellHeightsAsObject, cellHeightsAsMap) {

                    return (

                        cellHeightsAsObject[directions.NORTH] === cellHeightsAsMap.get(directions.NORTH) &&
                        cellHeightsAsObject[directions.EAST] === cellHeightsAsMap.get(directions.EAST) &&
                        cellHeightsAsObject[directions.SOUTH] === cellHeightsAsMap.get(directions.SOUTH) &&
                        cellHeightsAsObject[directions.WEST] === cellHeightsAsMap.get(directions.WEST)
                    );
                },

                findNewSpriteSheetCell = function findNewSpriteSheetCell(tileHeights) {

                    var targetCellHeights = tileHeights.clone(),
                        heightOffset = cellHeightLevels.MAXIMUM - tileHeights.get(findHighestCorner(tileHeights)),
                        terrainDataStore = terrain.getTerrainDataStore(),
                        spriteSheetCell,
                        numberOfSpriteSheetCells,
                        spriteSheetCll;

                    targetCellHeights.each(function eachCellHeight(cellHeight, corner) {

                        targetCellHeights.set(corner, cellHeight + heightOffset);
                    });

                    for (spriteSheetCell = 0, numberOfSpriteSheetCells = terrainDataStore.getNumberOfCells(); spriteSheetCell < numberOfSpriteSheetCells; ++spriteSheetCell) {

                        if (areCellHeightsEqual(terrainDataStore.getMetadata(spriteSheetCell, "heights"), targetCellHeights)) {

                            spriteSheetCll = spriteSheetCell;

                            break;
                        }
                    }

                    return spriteSheetCll;
                },

                findLowestCorner = function findLowestCorner(tileHeights) {

                    var lowestCorner = directions.NORTH;

                    tileHeights.each(function eachTileHeight(tileHeight, corner) {

                        if (tileHeight < tileHeights.get(lowestCorner)) {

                            lowestCorner = corner;
                        }
                    });

                    return lowestCorner;
                },

                isModifyValid = function isModifyValid(tile, modifyTileDesc) {

                    var row = tile.getRow(),
                        column = tile.getColumn(),
                        newTileHeights = modifyTileDesc.newTileHeights;

                    return (

                        row > 0 && row < chunkDimensions.ROWS * terrainDimensions.ROWS - 1 &&
                        column > 0 && column < chunkDimensions.COLUMNS * terrainDimensions.COLUMNS - 1 &&

                        modifyTileDesc.newSpriteSheetCell !== undefined &&

                        newTileHeights.get(findHighestCorner(newTileHeights)) <= tileHeightLevels.MAXIMUM &&
                        newTileHeights.get(findLowestCorner(newTileHeights)) >= tileHeightLevels.MINIMUM
                    );
                },

                processSecondaryCorners = function processSecondaryCorners(affectedTileDescs, tile, secondaryCorners, modifier, up, modifyTileDescs) {

                    secondaryCorners.each(function eachSecondaryCorner(secondaryCorner) {

                        affectedTileDescs.merge(

                            getAffectedTileDescs(tile, secondaryCorner, modifier, up, modifyTileDescs),
                            function mergeTileDesc(tileDesc) {

                                return !affectedTileDescs.get(tileDesc.tile);
                            }
                        );
                    });
                },

                createModifyTilesDesc = function createModifyTilesDesc(tile, corner, modifier, up) {

                    var modifyTileDescs = map(),
                        affectedTileDescs = getAffectedTileDescs(tile, corner, modifier, up, modifyTileDescs),
                        culprit;

                    affectedTileDescs.each(function eachTileDesc(tileDesc) {

                        var newTileHeightsDesc = createNewTileHeightsDesc(tileDesc, up),
                            modifyTileDesc = {},
                            tl = tileDesc.tile;

                        modifyTileDesc.tile = tl;
                        modifyTileDesc.tileHeights = tileDesc.tileHeights;
                        modifyTileDesc.newTileHeights = newTileHeightsDesc.tileHeights;
                        modifyTileDesc.newSpriteSheetCell = findNewSpriteSheetCell(modifyTileDesc.newTileHeights);

                        if (isModifyValid(tl, modifyTileDesc)) {

                            modifyTileDescs.set(tl, modifyTileDesc);
                            processSecondaryCorners(

                                affectedTileDescs,
                                tl,
                                newTileHeightsDesc.secondaryCorners,
                                modifier,
                                up,
                                modifyTileDescs
                            );
                        } else {

                            culprit = tl;
                            modifyTileDescs = undefined;

                            return false;
                        }

                        return true;
                    });

                    return { culprit: culprit, modifyTileDescs: modifyTileDescs };
                },

                modify = function modify(tile, corners, modifier) {

                    var modifyTileDescs = map(),
                        culprit,
                        modifiedTiles;

                    corners.each(function eachDelta(delta, corner) {

                        if (delta !== 0) {

                            var modifyTilesDesc = createModifyTilesDesc(tile, corner, modifier, delta > 0);

                            if (!modifyTilesDesc.culprit) {

                                modifyTileDescs.merge(modifyTilesDesc.modifyTileDescs);
                            } else {

                                culprit = modifyTilesDesc.culprit;
                                modifyTileDescs = undefined;

                                return false;
                            }
                        }

                        return true;
                    });

                    if (modifyTileDescs) {

                        modifiedTiles = vector();
                        modifyTileDescs.each(function eachModifyTileDesc(modifyTileDesc) {

                            var tl = modifyTileDesc.tile,
                                newTileHeights = modifyTileDesc.newTileHeights;

                            tl.setSpriteSheetCell(modifyTileDesc.newSpriteSheetCell);
                            tl.setHeight(newTileHeights.get(findHighestCorner(newTileHeights)));
                            modifiedTiles.push(tl);
                        });
                    }

                    return { culprit: culprit, modifiedTiles: modifiedTiles };
                };

            instance.modify = modify;

            return instance;
        };

    return terrainModifierLogic;
});

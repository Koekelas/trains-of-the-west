/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,
        chunkDimensions = require("game/constants").terrainDesc.chunkDimensions,
        terrainDimensions = require("game/constants").terrainDesc.terrainDimensions,
        decorationsLargeDescs = require("spriteSheets/decorationsLargeDescs"),
        decorationsSmallDescs = require("spriteSheets/decorationsSmallDescs"),
        terrainDescs = require("spriteSheets/terrainDescs"),
        tracksDescs = require("spriteSheets/tracksDescs"),
        listenable = require("support/listenable"),
        resourceManager = require("core/resourceManager"),
        map = require("support/map"),
        vector = require("support/vector"),
        terrainClickHelper = require("game/terrainClickHelper"),
        terrainSpriteSheetAnalyser = require("game/terrainSpriteSheetAnalyser"),
        terrainStreamer = require("game/terrainStreamer"),
        terrainUpdateHelper = require("game/terrainUpdateHelper"),
        tile = require("game/tile"),

        terrain = function terrain(gameScene, maximumZoom) {

            var spriteSheetManager = function spriteSheetManager(maximumZm) {

                    var spriteSheets = map(),
                        instance = {},

                        load = function load(name, spriteSheetDescs, onLoad) {

                            var spriteShts = map();

                            vector([ zoomLevels.MINIMUM, zoomLevels.MEDIUM, zoomLevels.MAXIMUM ])
                                .each(function eachZoomLevel(zoomLevel) {

                                    spriteShts.set(

                                        zoomLevel,
                                        resourceManager.createSpriteSheet(spriteSheetDescs[zoomLevel], onLoad)
                                    );

                                    return zoomLevel !== maximumZm;
                                });
                            spriteSheets.set(name, spriteShts);
                        },

                        get = function get(name, zoomLevel) {

                            return spriteSheets.get(name) ? spriteSheets.get(name).get(zoomLevel) : undefined;
                        };

                    instance.load = load;
                    instance.get = get;

                    return instance;
                },

                spriteSheetMngr,
                grid = {},
                activeCameraDesc,
                terrainStrmr,
                terrainUpdateHlpr,
                terrainClickHlpr,
                instance = listenable(),
                super_trigger = instance._superior("trigger"),

                getTile = function getTile(row, column) {

                    return grid[row] ? grid[row][column] : undefined;
                },

                createTile = function createTile(chunkRow, chunkColumn, row, column, spriteSheetCell, height) {

                    var actualRow = chunkRow * chunkDimensions.ROWS + row,
                        actualColumn = chunkColumn * chunkDimensions.COLUMNS + column,
                        tl = getTile(actualRow, actualColumn);

                    if (!tl) {

                        tl = tile(instance, actualRow, actualColumn, spriteSheetCell, height);
                        tl.on("click", terrainClickHlpr.onClick);

                        if (!grid[actualRow]) {

                            grid[actualRow] = {};
                        }

                        grid[actualRow][actualColumn] = tl;
                    } else {

                        tl.setSpriteSheetCell(spriteSheetCell);
                        tl.setHeight(height);
                    }
                },

                activate = function activate() { /*empty*/ },

                update = function update(cameraDesc) {

                    activeCameraDesc = cameraDesc;
                    terrainUpdateHlpr.update(activeCameraDesc);
                },

                deactivate = function deactivate() { /*empty*/ },

                isReady = function isReady() {

                    return terrainStrmr.isReady();
                },

                getDataStore = function getDataStore(name) {

                    return spriteSheetMngr.get(name, zoomLevels.MINIMUM);
                },

                getTerrainDataStore = function getTerrainDataStore() {

                    return getDataStore("terrain");
                },

                getTracksDataStore = function getTracksDataStore() {

                    return getDataStore("tracks");
                },

                getDecorationsLargeDataStore = function getDecorationsLargeDataStore() {

                    return getDataStore("decorationsLarge");
                },

                getDecorationsSmallDataStore = function getDecorationsSmallDataStore() {

                    return getDataStore("decorationsSmall");
                },

                getActiveSpriteSheet = function getActiveSpriteSheet(name) {

                    return spriteSheetMngr.get(name, activeCameraDesc ? activeCameraDesc.zoom : zoomLevels.MINIMUM);
                },

                getActiveTerrainSpriteSheet = function getActiveTerrainSpriteSheet() {

                    return getActiveSpriteSheet("terrain");
                },

                getActiveTracksSpriteSheet = function getActiveTracksSpriteSheet() {

                    return getActiveSpriteSheet("tracks");
                },

                getActiveDecorationsLargeSpriteSheet = function getActiveDecorationsLargeSpriteSheet() {

                    return getActiveSpriteSheet("decorationsLarge");
                },

                getActiveDecorationsSmallSpriteSheet = function getActiveDecorationsSmallSpriteSheet() {

                    return getActiveSpriteSheet("decorationsSmall");
                },

                getActiveCameraRotation = function getActiveCameraRotation() {

                    return activeCameraDesc.rotation;
                },

                getNumberOfResourcesToLoad = function getNumberOfResourcesToLoad() {

                    return terrainStrmr.getNumberOfChunksToLoad();
                },

                getNumberOfResourcesLoaded = function getNumberOfResourcesLoaded() {

                    return terrainStrmr.getNumberOfChunksLoaded();
                },

                addListeners = function addListeners() {

                    terrainStrmr.on("load", function onLoadTerrainStreamer() {

                        super_trigger("load");
                    });
                },

                loadTerrain = function loadTerrain() {

                    var row,
                        numberOfRows,
                        column,
                        numberOfColumns;

                    for (row = 0, numberOfRows = terrainDimensions.ROWS; row < numberOfRows; ++row) {

                        for (column = 0, numberOfColumns = terrainDimensions.COLUMNS; column < numberOfColumns; ++column) {

                            terrainStrmr.loadChunk(row, column);
                        }
                    }
                },

                loadResources = function loadResources() {

                    spriteSheetMngr.load("terrain", terrainDescs, function onLoadTerrainSpriteSheet(spriteSheet) {

                        terrainSpriteSheetAnalyser().analyse(spriteSheet);
                    });
                    spriteSheetMngr.load("tracks", tracksDescs);
                    spriteSheetMngr.load("decorationsLarge", decorationsLargeDescs);
                    spriteSheetMngr.load("decorationsSmall", decorationsSmallDescs);
                },

                initialise = function initialise() {

                    spriteSheetMngr = spriteSheetManager(maximumZoom);
                    terrainStrmr = terrainStreamer(instance);
                    terrainUpdateHlpr = terrainUpdateHelper(instance);
                    terrainClickHlpr = terrainClickHelper(gameScene, instance);
                    addListeners();
                    loadTerrain();
                    loadResources();
                };

            instance.createTile = createTile;
            instance.activate = activate;
            instance.update = update;
            instance.deactivate = deactivate;
            instance.isReady = isReady;
            instance.getTile = getTile;
            instance.getTerrainDataStore = getTerrainDataStore;
            instance.getTracksDataStore = getTracksDataStore;
            instance.getDecorationsLargeDataStore = getDecorationsLargeDataStore;
            instance.getDecorationsSmallDataStore = getDecorationsSmallDataStore;
            instance.getActiveTerrainSpriteSheet = getActiveTerrainSpriteSheet;
            instance.getActiveTracksSpriteSheet = getActiveTracksSpriteSheet;
            instance.getActiveDecorationsLargeSpriteSheet = getActiveDecorationsLargeSpriteSheet;
            instance.getActiveDecorationsSmallSpriteSheet = getActiveDecorationsSmallSpriteSheet;
            instance.getActiveCameraRotation = getActiveCameraRotation;
            instance.getNumberOfResourcesToLoad = getNumberOfResourcesToLoad;
            instance.getNumberOfResourcesLoaded = getNumberOfResourcesLoaded;
            initialise();

            return instance;
        };

    return terrain;
});

/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var listenable = require("support/listenable"),
        connection = require("core/connection"),
        layerManager = require("core/layerManager"),
        resourceManager = require("core/resourceManager"),
        keyboard = require("input/keyboard"),
        map = require("support/map"),
        camera = require("game/camera"),
        statistics = require("entities/statistics"),
        terrain = require("entities/terrain"),
        toolbar = require("entities/toolbar"),

        gameScene = function gameScene(client) {

            var weight = {

                    RESOURCE_MANAGER: 0.5,
                    ENTITIES: 0.5
                },
                startScene = require("scenes/startScene"), //circular dependency!
                cmr,
                entities = map(),
                instance = listenable(),
                super_trigger = instance.superior("trigger"),

                switchScene = function switchScene() {

                    client.setScene(startScene(client));
                },

                addPostActivateListeners = function addPostActivateListeners() {

                    connection.one("close", function onClose() {

                        switchScene();
                    });
                },

                activate = function activate() {

                    addPostActivateListeners();
                    entities.each(function eachEntity(entity) {

                        entity.activate();
                    });
                },

                update = function update(deltaTime) {

                    entities.get("toolbar").checkSynchronousInput(deltaTime);

                    var cameraDesc = cmr.toDesc();

                    entities.each(function eachEntity(entity) {

                        entity.update(cameraDesc, deltaTime);
                    });
                },

                deactivate = function deactivate() {

                    entities.each(function eachEntity(entity) {

                        entity.deactivate();
                    });
                },

                isReady = function isReady() {

                    return resourceManager.isReady() && entities.get("terrain").isReady();
                },

                getNumberOfResourcesToLoad = function getNumberOfResourcesToLoad() {

                    return resourceManager.getNumberOfResourcesToLoad() + entities.get("terrain").getNumberOfResourcesToLoad();
                },

                getNumberOfResourcesLoaded = function getNumberOfResourcesLoaded() {

                    return resourceManager.getNumberOfResourcesLoaded() + entities.get("terrain").getNumberOfResourcesLoaded();
                },

                getPercentageComplete = function getPercentageComplete() {

                    var trrn = entities.get("terrain");

                    return Math.round(

                        (

                            (resourceManager.getNumberOfResourcesToLoad() ? resourceManager.getNumberOfResourcesLoaded() / resourceManager.getNumberOfResourcesToLoad() : 0) * weight.RESOURCE_MANAGER +
                            (trrn.getNumberOfResourcesToLoad() ? trrn.getNumberOfResourcesLoaded() / trrn.getNumberOfResourcesToLoad() : 0) * weight.ENTITIES
                        ) * 100
                    );
                },

                getEntity = function getEntity(name) {

                    return entities.get(name);
                },

                setLayers = function setLayers() {

                    layerManager.setLayer("terrainStart", 1000);
                },

                setKeyMappings = function setKeyMappings() {

                    keyboard.map("option", [ keyboard.keys.SHIFT ]);
                    keyboard.map("panUp", [ keyboard.keys.UP ]);
                    keyboard.map("panDown", [ keyboard.keys.DOWN ]);
                    keyboard.map("panLeft", [ keyboard.keys.LEFT ]);
                    keyboard.map("panRight", [ keyboard.keys.RIGHT ]);
                    keyboard.map("toggleOppositeMode", [ keyboard.keys.CTRL ]);
                    keyboard.map("deselectTool", [ keyboard.keys.ESC ]);
                    keyboard.map("zoomIn", [ keyboard.keys.PAGE_UP ]);
                    keyboard.map("zoomOut", [ keyboard.keys.PAGE_DOWN ]);
                    keyboard.map("rotate", [ keyboard.keys.R ]);
                    keyboard.map("cycleModeTerrainTool", [ keyboard.keys.ONE ]);
                    keyboard.map("cycleModeTrackTool", [ keyboard.keys.TWO ]);
                    keyboard.map("cycleModeDecorationTool", [ keyboard.keys.THREE ]);
                    keyboard.map("enableFullScreen", [ keyboard.keys.F ]);
                },

                createEntities = function createEntities() {

                    entities.set("terrain", terrain(instance, cmr.getMaximumZoom()));
                    entities.set("toolbar", toolbar(cmr));
                    //>>excludeStart("release", pragmas.release);
                    entities.set("statistics", statistics());
                    //>>excludeEnd("release");
                },

                addListeners = function addListeners() {

                    resourceManager.on("ready", function onLoadResourceManager() {

                        super_trigger("load");
                    });
                    /*jslint unparam: true*/
                    resourceManager.on("error", function onError(event, path) {

                        super_trigger("error", path);
                    });
                    /*jslint unparam: false*/
                    entities.get("terrain").on("load", function onLoadTerrain() {

                        super_trigger("load");
                    });
                },

                initialise = function initialise() {

                    cmr = camera();
                    setLayers();
                    setKeyMappings();
                    createEntities();
                    addListeners();
                };

            instance.activate = activate;
            instance.update = update;
            instance.deactivate = deactivate;
            instance.isReady = isReady;
            instance.getNumberOfResourcesToLoad = getNumberOfResourcesToLoad;
            instance.getNumberOfResourcesLoaded = getNumberOfResourcesLoaded;
            instance.getPercentageComplete = getPercentageComplete;
            instance.getEntity = getEntity;
            initialise();

            return instance;
        };

    return gameScene;
});

/*jslint browser: true, plusplus: true*/
/*global define*/

define(function (require) {

    "use strict";

    var zoomLevels = require("game/clientConstants").zoomLevels,
        directions = require("game/constants").directions,
        chunkDimensions = require("game/constants").terrainDesc.chunkDimensions,
        terrainDimensions = require("game/constants").terrainDesc.terrainDimensions,
        viewport = require("core/viewport"),
        browser = require("support/browser"),
        math = require("support/math"),
        rotationWalker = require("game/rotationWalker"),

        camera = function camera(x, y, zoom, rotation) {

            var TERRAIN1X_SPRITE_SHEET_CELL_WIDTH = 128,
                SPEED = 750,
                bounds = {},
                minimumZoom = zoomLevels.MINIMUM,
                maximumZoom = zoomLevels.MAXIMUM,
                position = {},
                instance = {},

                setPosition = function setPosition(x, y) {

                    var halfViewportWidth = viewport.getWidth() / 2,
                        halfViewportHeight = viewport.getHeight() / 2;

                    position.x = math.clamp(x, bounds[directions.WEST] + halfViewportWidth, bounds[directions.EAST] * zoom - halfViewportWidth);
                    position.y = math.clamp(y, bounds[directions.NORTH] + halfViewportHeight, bounds[directions.SOUTH] * zoom - halfViewportHeight - 1);
                },

                changePosition = function changePosition(deltaX, deltaY) {

                    setPosition(position.x + deltaX, position.y + deltaY);
                },

                panUp = function panUp(deltaTime) {

                    changePosition(0, SPEED * deltaTime * -1);
                },

                panDown = function panDown(deltaTime) {

                    changePosition(0, SPEED * deltaTime);
                },

                panLeft = function panLeft(deltaTime) {

                    changePosition(SPEED * deltaTime * -1, 0);
                },

                panRight = function panRight(deltaTime) {

                    changePosition(SPEED * deltaTime, 0);
                },

                setZoom = function setZoom(zm) {

                    zoom = math.clamp(zm, minimumZoom, maximumZoom);
                },

                changeZoom = function changeZoom(zoomIn) {

                    var oldZoom = zoom;

                    if (zoomIn) {

                        setZoom(zoom + 1);
                    } else {

                        setZoom(zoom - 1);
                    }

                    setPosition(position.x / oldZoom * zoom, position.y / oldZoom * zoom);
                },

                setRotation = function setRotation(rttn) {

                    rotation = rttn;
                },

                calculateWorldOrigin = function calculateWorldOrigin() {

                    return { x: bounds[directions.EAST] * zoom / 2, y: (bounds[directions.SOUTH] * zoom - 1) / 2 };
                },

                changeRotation = function changeRotation(direction) {

                    var worldOrigin = calculateWorldOrigin(),
                        worldOriginX = worldOrigin.x,
                        worldOriginY = worldOrigin.y,
                        positionX = position.x,
                        positionY = position.y,
                        offsetX = positionX - worldOriginX,
                        offsetY = positionY - worldOriginY,
                        swap;

                    setRotation(rotationWalker().walk(rotation, direction));
                    swap = offsetX;

                    if (direction === directions.CLOCKWISE) {

                        offsetX = offsetY * -2;
                        offsetY = swap / 2;
                    } else {

                        offsetX = offsetY * 2;
                        offsetY = swap / -2;
                    }

                    setPosition(worldOriginX + offsetX, worldOriginY + offsetY);
                },

                getX = function getX() {

                    return Math.round(position.x - viewport.getWidth() / 2);
                },

                getY = function getY() {

                    return Math.round(position.y - viewport.getHeight() / 2);
                },

                getMinimumZoom = function getMinimumZoom() {

                    return minimumZoom;
                },

                getMaximumZoom = function getMaximumZoom() {

                    return maximumZoom;
                },

                getZoom = function getZoom() {

                    return zoom;
                },

                getRotation = function getRotation() {

                    return rotation;
                },

                getViewportWidth = function getViewportWidth() {

                    return viewport.getWidth();
                },

                getViewportHeight = function getViewportHeight() {

                    return viewport.getHeight();
                },

                toDesc = function toDesc() {

                    return {

                        x: getX(),
                        y: getY(),
                        zoom: getZoom(),
                        rotation: getRotation(),
                        viewportWidth: getViewportWidth(),
                        viewportHeight: getViewportHeight()
                    };
                },

                initialise = function initialise() {

                    bounds[directions.NORTH] = 0;
                    bounds[directions.SOUTH] = chunkDimensions.ROWS * terrainDimensions.ROWS * (TERRAIN1X_SPRITE_SHEET_CELL_WIDTH / 2);
                    bounds[directions.WEST] = 0;
                    bounds[directions.EAST] = chunkDimensions.COLUMNS * terrainDimensions.COLUMNS * TERRAIN1X_SPRITE_SHEET_CELL_WIDTH;

                    if (browser.isMobile()) {

                        maximumZoom = zoomLevels.MINIMUM;
                    }

                    setZoom(zoom || minimumZoom);
                    setRotation(rotation || directions.NORTH);

                    var worldOrigin = calculateWorldOrigin();

                    setPosition(x || worldOrigin.x, y || worldOrigin.y);
                };

            instance.changePosition = changePosition;
            instance.panUp = panUp;
            instance.panDown = panDown;
            instance.panLeft = panLeft;
            instance.panRight = panRight;
            instance.changeZoom = changeZoom;
            instance.changeRotation = changeRotation;
            instance.getX = getX;
            instance.getY = getY;
            instance.getMinimumZoom = getMinimumZoom;
            instance.getMaximumZoom = getMaximumZoom;
            instance.getZoom = getZoom;
            instance.getRotation = getRotation;
            instance.getViewportWidth = getViewportWidth;
            instance.getViewportHeight = getViewportHeight;
            instance.toDesc = toDesc;
            initialise();

            return instance;
        };

    return camera;
});

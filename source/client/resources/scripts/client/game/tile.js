/*jslint browser: true, plusplus: true, nomen: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var chunkDimensions = require("game/constants").terrainDesc.chunkDimensions,
        terrainDimensions = require("game/constants").terrainDesc.terrainDimensions,
        tileHeightLevels = require("game/constants").terrainDesc.tileHeightLevels,
        listenable = require("support/listenable"),
        elementPool = require("core/elementPool"),
        map = require("support/map"),
        math = require("support/math"),
        pocketKnife = require("support/pocketKnife"),
        decorations = require("entities/tileEntities/decorations"),
        highlight = require("entities/tileEntities/highlight"),
        track = require("entities/tileEntities/track"),

        terrain,

        prototype = listenable(),

        create = function create(trrn, row, column, spriteSheetCell, height) {

            if (terrain !== trrn) {

                terrain = trrn;
            }

            return pocketKnife.create(prototype)._initialise(row, column, spriteSheetCell, height);
        };

    prototype.removeTileEntity = function removeTileEntity(name) {

        this._tileEntities.erase(name);
    };

    prototype.createTrack = function createTrack(spriteSheetCell) {

        var trck = this._tileEntities.get("track");

        if (!trck) {

            if (this._tileEntities.get("decorations")) {

                this.removeTileEntity("decorations");
            }

            trck = track(terrain, this, spriteSheetCell);
            this._tileEntities.set("track", trck);
        } else {

            trck.setSpriteSheetCell(spriteSheetCell);
        }
    };

    prototype.createHighlight = function createHighlight() {

        if (!this._tileEntities.get("highlight")) {

            this._tileEntities.set("highlight", highlight(this));
        }
    };

    prototype._createDecoration = function _createDecoration(large, location, spriteSheetCell) {

        if (this._tileEntities.get("track")) {

            this.createHighlight();

            return;
        }

        var dcrtns = this._tileEntities.get("decorations");

        if (!dcrtns) {

            dcrtns = decorations(terrain);
            this._tileEntities.set("decorations", dcrtns);
        }

        if (large) {

            dcrtns.createLarge(location, spriteSheetCell);
        } else {

            dcrtns.createSmall(location, spriteSheetCell);
        }
    };

    prototype.createDecorationLarge = function createDecorationLarge(location, spriteSheetCell) {

        this._createDecoration(true, location, spriteSheetCell);
    };

    prototype.createDecorationSmall = function createDecorationSmall(location, spriteSheetCell) {

        this._createDecoration(false, location, spriteSheetCell);
    };

    prototype.hasAcquiredElements = function hasAcquiredElements() {

        return !!this._element;
    };

    prototype._getRotatedSpriteSheetCell = function _getRotatedSpriteSheetCell() {

        return this.getMetadata("rotations")[terrain.getActiveCameraRotation()];
    };

    prototype.getMetadata = function getMetadata(key, cameraRotationAligned) {

        return terrain.getActiveTerrainSpriteSheet().getMetadata(

            !(cameraRotationAligned || false) ? this._spriteSheetCell : this._getRotatedSpriteSheetCell(),
            key
        );
    };

    prototype._onClick = function _onClick(event, mouse) {

        var elementX = this._element.getX(),
            elementY = this._element.getY(),
            spriteSheet = terrain.getActiveTerrainSpriteSheet();

        if (math.isInInterval(mouse.x, elementX, elementX + spriteSheet.getCellWidth()) && math.isInInterval(mouse.y, elementY, elementY + spriteSheet.getCellHeight())) {

            if (spriteSheet.isOpaque(this._getRotatedSpriteSheetCell(), mouse.x - elementX, mouse.y - elementY)) {

                if (this.trigger("click", { x: mouse.x - elementX, y: mouse.y - elementY }) === false) {

                    event.stopImmediatePropagation();
                }
            }
        }
    };

    prototype.update = function update(x, y, layer, cameraRotation) {

        var numberOfLayersAcquired = 0;

        if (!this.hasAcquiredElements()) {

            this._element = elementPool.acquireElement();
            this._element.on("click", pocketKnife.bind(prototype._onClick, this));
        }

        this._element.setCssClass(

            terrain.getActiveTerrainSpriteSheet().getCssClass(this.getMetadata("rotations")[cameraRotation])
        );
        this._element.setPosition(x, y);
        this._element.setLayer(layer);
        ++numberOfLayersAcquired;
        this._tileEntities.each(function eachTileEntity(tileEntity) {

            numberOfLayersAcquired += tileEntity.update(x, y, layer + numberOfLayersAcquired, cameraRotation);
        });

        return numberOfLayersAcquired;
    };

    prototype.releaseElements = function releaseElements() {

        elementPool.releaseElement(this._element);
        this._element = undefined;
        this._tileEntities.each(function eachTileEntity(tileEntity) {

            tileEntity.releaseElements();
        });
    };

    prototype.setSpriteSheetCell = function setSpriteSheetCell(spriteSheetCell) {

        //todo: check if spriteSheetCell is valid
        this._spriteSheetCell = spriteSheetCell;
    };

    prototype.setHeight = function setHeight(height) {

        if (math.isInInterval(height, tileHeightLevels.MINIMUM, tileHeightLevels.MAXIMUM + 1)) {

            this._height = height;
        }
    };

    prototype.getX = function getX() {

        return this._element.getX();
    };

    prototype.getY = function getY() {

        return this._element.getY();
    };

    prototype.getRow = function getRow() {

        return this._location.row;
    };

    prototype.getColumn = function getColumn() {

        return this._location.column;
    };

    prototype.getHeight = function getHeight() {

        return this._height;
    };

    prototype.toString = function toString() {

        return this._hash;
    };

    prototype._initialise = function _initialise(row, column, spriteSheetCell, height) {

        this._superior("_initialise")();
        this._location = { row: row, column: column };
        this._tileEntities = map();
        this._hash = (chunkDimensions.COLUMNS * terrainDimensions.COLUMNS * row + column).toString();
        this.setSpriteSheetCell(spriteSheetCell);
        this.setHeight(height);

        return this;
    };

    return create;
});

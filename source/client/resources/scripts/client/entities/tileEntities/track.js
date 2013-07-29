/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var directions = require("game/constants").directions,
        elementPool = require("core/elementPool"),
        pocketKnife = require("support/pocketKnife"),

        terrain,

        prototype = {

            _getRotatedSpriteSheetCell: function _getRotatedSpriteSheetCell() {

                return this._getMetadata("rotations")[terrain.getActiveCameraRotation()];
            },

            _getMetadata: function _getMetadata(key, cameraRotationAligned) {

                return terrain.getActiveTracksSpriteSheet().getMetadata(

                    !(cameraRotationAligned || false) ? this._spriteSheetCell : this._getRotatedSpriteSheetCell(),
                    key
                );
            },

            update: function update(x, y, layer, cameraRotation) {

                var surfaceY,
                    spriteSheet = terrain.getActiveTracksSpriteSheet();

                if (!this._element) {

                    this._element = elementPool.acquireElement();
                }

                if (this._getMetadata("emptyCorner", true) !== directions.SOUTH) {

                    surfaceY = this._tile.getMetadata("corners", true)[directions.SOUTH].y;
                } else {

                    surfaceY = this._tile.getMetadata("corners", true)[directions.NORTH].y + Math.floor(terrain.getActiveTerrainSpriteSheet().getCellHeight() / 3) - 1;
                }

                this._element.setCssClass(spriteSheet.getCssClass(this._getMetadata("rotations")[cameraRotation]));
                this._element.setPosition(x, y + surfaceY - spriteSheet.getCellHeight());
                this._element.setLayer(layer);
                ++layer;

                return layer;
            },

            releaseElements: function releaseElements() {

                elementPool.releaseElement(this._element);
                this._element = undefined;
            },

            setSpriteSheetCell: function setSpriteSheetCell(spriteSheetCell) {

                //todo: check if spriteSheetCell is valid
                //this._spriteSheetCell = spriteSheetCell;

                //tmp
                this._spriteSheetCell = this._spriteSheetCell !== undefined ? (this._spriteSheetCell + 1) % (terrain.getTracksDataStore().getNumberOfCells() - 2) : spriteSheetCell;
            },

            initialise: function initialise(tile, spriteSheetCell) {

                this._tile = tile;
                this.setSpriteSheetCell(spriteSheetCell);

                return this;
            }
        },

        create = function create(trrn, tile, spriteSheetCell) {

            if (terrain !== trrn) {

                terrain = trrn;
            }

            return pocketKnife.create(prototype).initialise(tile, spriteSheetCell);
        };

    return create;
});

/*jslint browser: true, plusplus: true, nomen: true*/
/*global define*/

define(function (require) {

    "use strict";

    var jquery = require("jquery"),
        listenable = require("support/listenable"),
        layerManager = require("core/layerManager"),
        pocketKnife = require("support/pocketKnife"),

        prototype = listenable(),

        create = function create() {

            return pocketKnife.create(prototype).initialise();
        };

    prototype.setCssClass = function setCssClass(cssClass) {

        if (cssClass !== this._cssClass) {

            this._element.className = this._cssClass = cssClass;
        }
    };

    prototype.setPosition = function setPosition(x, y) {

        if (this._position.x !== x || this._position.y !== y) {

            var style = this._element.style;

            this._position.x = x;
            this._position.y = y;
            style.top = y + "px";
            style.left = x + "px";
        }
    };

    prototype.setLayer = function setLayer(layer) {

        if (layer !== this._layer) {

            this._element.style.zIndex = this._layer = layer;
        }
    };

    prototype.getX = function getX() {

        return this._position.x;
    };

    prototype.getY = function getY() {

        return this._position.y;
    };

    prototype.getLayer = function getLayer() {

        return this._layer;
    };

    prototype._createElements = function _createElements() {

        this._element = jquery("<div>").get(0);
        jquery("#elements").append(this._element);
    };

    prototype.reset = function reset() {

        this.setCssClass("displayNone");
        this.setPosition(0, 0);
        this.setLayer(layerManager.getLayer("default"));
        this.off();
    };

    prototype._super_initialise = prototype.initialise;

    prototype.initialise = function initialise() {

        this._super_initialise();
        this._position = {};
        this._createElements();
        this.reset();

        return this;
    };

    return create;
});

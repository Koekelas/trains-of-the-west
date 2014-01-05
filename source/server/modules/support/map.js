/*jslint node: true, plusplus: true, nomen: true*/

"use strict";

var pocketKnife = require("./pocketKnife"),
    vector = require("./vector"),

    prototype,

    create = function create(keys, values) {

        return pocketKnife.create(prototype)._initialise(keys, values);
    };

prototype = {

    set: function set(key, value) {

        if (pocketKnife.isObject(key)) {

            key = key.toString();
        }

        if (this._values[key] === undefined) {

            this._keys.push(key);
        }

        this._values[key] = value;
    },

    _mergeWithCallback: function _mergeWithCallback(map, callback) {

        var that = this;

        map.each(function eachPair(value, key) {

            if (callback(value, key)) {

                that.set(key, value);
            }
        });
    },

    _mergeWithoutCallback: function _mergeWithoutCallback(map) {

        var that = this;

        map.each(function eachPair(value, key) {

            that.set(key, value);
        });
    },

    merge: function merge(map, callback) {

        if (pocketKnife.isFunction(callback)) {

            this._mergeWithCallback(map, callback);
        } else {

            this._mergeWithoutCallback(map);
        }

        return this;
    },

    erase: function erase(key) {

        var value,
            that = this;

        if (pocketKnife.isObject(key)) {

            key = key.toString();
        }

        this._keys.each(function eachKey(ky, index) {

            if (ky === key) {

                value = that._values[ky];
                that._keys.erase(index);
                delete that._values[ky];

                return false;
            }

            return true;
        });

        return value;
    },

    each: function each(callback) {

        var that = this;

        this._keys.each(function eachKey(key) {

            return callback(that._values[key], key);
        });
    },

    clone: function clone() {

        return create(this._keys.clone(), pocketKnife.clone(this._values));
    },

    getSize: function getSize() {

        return this._keys.getLength();
    },

    get: function get(key) {

        return this._values[key];
    },

    _initialise: function _initialise(keys, values) {

        this._keys = keys || vector();
        this._values = values || {};

        return this;
    }
};

module.exports = create;

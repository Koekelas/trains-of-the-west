/*jslint node: true, plusplus: true, nomen: true*/

"use strict";

var pocketKnife = require("./pocketKnife"),

    prototype,

    create = function create(array) {

        return pocketKnife.create(prototype)._initialise(array);
    };

prototype = {

    push: function push(value) {

        return this._array.push(value);
    },

    _mergeWithCallback: function _mergeWithCallback(vector, callback) {

        var that = this;

        vector.each(function eachElement(element, index) {

            if (callback(element, index)) {

                that.push(element);
            }
        });
    },

    _mergeWithoutCallback: function _mergeWithoutCallback(vector) {

        var that = this;

        vector.each(function eachElement(element) {

            that.push(element);
        });
    },

    merge: function merge(vector, callback) {

        if (pocketKnife.isFunction(callback)) {

            this._mergeWithCallback(vector, callback);
        } else {

            this._mergeWithoutCallback(vector);
        }

        return this;
    },

    erase: function erase(index) {

        return this._array.splice(index, 1)[0];
    },

    shift: function shift() {

        return this._array.shift();
    },

    pop: function pop() {

        return this._array.pop();
    },

    each: function each(callback) {

        var i;

        for (i = 0; i < this._array.length; ++i) {

            if (callback(this._array[i], i) === false) {

                break;
            }
        }
    },

    sort: function sort(comparer) {

        this._array.sort(comparer);
    },

    clone: function clone() {

        return create(pocketKnife.clone(this._array));
    },

    set: function set(index, value) {

        this._array[index] = value;
    },

    getLength: function getLength() {

        return this._array.length;
    },

    get: function get(index) {

        return this._array[index];
    },

    _initialise: function _initialise(array) {

        this._array = array || [];

        return this;
    }
};

module.exports = create;

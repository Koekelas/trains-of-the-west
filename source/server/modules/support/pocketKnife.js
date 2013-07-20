/*jslint node: true, plusplus: true*/

"use strict";

var pocketKnife = function pocketKnife() {

    var instance = {},

        isBoolean = function isBoolean(x) {

            return typeof x === "boolean";
        },

        isNumber = function isNumber(x) {

            return typeof x === "number";
        },

        isString = function isString(x) {

            return typeof x === "string";
        },

        isPrimitive = function isPrimitive(x) {

            return isBoolean(x) || isNumber(x) || isString(x);
        },

        isObject = function isObject(x) {

            return typeof x === "object" && x.constructor === Object;
        },

        isArray = function isArray(x) {

            return typeof x === "object" && x.constructor === Array;
        },

        isFunction = function isFunction(x) {

            return typeof x === "function";
        },

        getType = function getType(x) {

            var type;

            if (isPrimitive(x)) {

                type = "primitive";
            } else if (isObject(x)) {

                type = "object";
            } else if (isArray(x)) {

                type = "array";
            }

            return type;
        },

        areEqual,

        areObjectsEqual = function (leftObject, rightObject) {

            var propertyName,
                areQl = true;

            if (leftObject !== rightObject) {

                for (propertyName in leftObject) {

                    if (leftObject.hasOwnProperty(propertyName) && rightObject.hasOwnProperty(propertyName)) {

                        if (!areEqual(leftObject[propertyName], rightObject[propertyName])) {

                            areQl = false;

                            break;
                        }
                    }
                }
            }

            return areQl;
        },

        areArraysEqual = function areArraysEqual(leftArray, rightArray) {

            var i,
                numberOfProperties,
                areQl = true;

            if (leftArray !== rightArray) {

                if (leftArray.length === rightArray.length) {

                    for (i = 0, numberOfProperties = leftArray.length; i < numberOfProperties; ++i) {

                        if (!areEqual(leftArray[i], rightArray[i])) {

                            areQl = false;

                            break;
                        }
                    }
                } else {

                    areQl = false;
                }
            }

            return areQl;
        },

        clone,

        cloneObject = function cloneObject(bjct) {

            var propertyName,
                clonedProperty,
                cln = {};

            for (propertyName in bjct) {

                if (bjct.hasOwnProperty(propertyName)) {

                    clonedProperty = clone(bjct[propertyName]);

                    if (clonedProperty !== undefined) {

                        cln[propertyName] = clonedProperty;
                    }
                }
            }

            return cln;
        },

        cloneArray = function cloneArray(array) {

            var i,
                numberOfProperties,
                clonedProperty,
                cln = [];

            for (i = 0, numberOfProperties = array.length; i < numberOfProperties; ++i) {

                clonedProperty = clone(array[i]);

                if (clonedProperty !== undefined) {

                    cln[i] = clonedProperty;
                }
            }

            return cln;
        },

        create = function create(prototype) {

            var instance,
                Fnctn;

            if (Object.create) {

                instance = Object.create(prototype);
            } else {

                Fnctn = function () {};
                Fnctn.prototype = prototype;
                instance = new Fnctn();
            }

            return instance;
        },

        arrayify = function arrayify(phoneyArray, firstIndex, lastIndex) {

            return Array.prototype.slice.call(phoneyArray, firstIndex, lastIndex);
        },

        bind = function bind(fnctn, that) {

            var boundArguments = arrayify(arguments, 2);

            return function () {

                fnctn.apply(that, boundArguments.concat(arrayify(arguments)));
            };
        };

    areEqual = function areEqual(x, y) {

        var typeX = getType(x),
            typeY = getType(y),
            areQl = false;

        if (typeX === typeY) {

            switch (typeX) {

            case "primitive":

                areQl = x === y;

                break;
            case "object":

                areQl = areObjectsEqual(x, y);

                break;
            case "array":

                areQl = areArraysEqual(x, y);

                break;
            }
        }

        return areQl;
    };

    clone = function clone(x) {

        var cln;

        switch (getType(x)) {

        case "primitive":

            cln = x;

            break;
        case "object":

            cln = cloneObject(x);

            break;
        case "array":

            cln = cloneArray(x);

            break;
        }

        return cln;
    };

    instance.isBoolean = isBoolean;
    instance.isNumber = isNumber;
    instance.isString = isString;
    instance.isPrimitive = isPrimitive;
    instance.isObject = isObject;
    instance.isArray = isArray;
    instance.isFunction = isFunction;
    instance.clone = clone;
    instance.areEqual = areEqual;
    instance.create = create;
    instance.arrayify = arrayify;
    instance.bind = bind;

    return instance;
};

module.exports = pocketKnife();

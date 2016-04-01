/*
 * Math-Related Module
 */

var Ms = {};
var C = require('./minicore');
var E = require('./stacktrace');

/**
 * Sum a list of number
 *
 * @static
 * @memberof H
 * @param {Array} list
 * @returns {number}
 */
Ms.sum = function(list) {
    if (!C.isArrayLike(list)) return 0;
    var sum = 0;
    var length = list.length;
    length++;
    while(--length) {
        sum += list[length - 1];
    }
    if (isNaN(sum)) {
        E.printStackTrace("NaN!");
        return 0;
    }
    return sum;
};

/**
 * Hypot polyfill.
 *
 * @static
 * @memberof H
 * @type {Function}
 */
Ms.hypot = Math.hypot || function() {
        return Math.sqrt(Ms.sum(C.arrayEach(arguments, function(arg) {
            return arg * arg;
        })));
    };

/**
 * Log2 polyfill
 *
 * @static
 * @memberof H
 * @type {Function}
 */
Ms.log2 = Math.log2 || function(number) {
        return Math.log(number) / Math.log(2);
    };

/**
 * Check if a variable between given two numbers
 *
 * @static
 * @memberof H
 * @param {Number} v number to check
 * @param {Number} v0 margin 1
 * @param {Number} v1 margin 2
 * @returns {boolean}
 */
Ms.varInRange = function(v, v0, v1) {
    return (v - v0) * (v - v1) < 0;
};

/**
 * Check if a point [x, y] is inside the rectangle of two given points.
 *
 * @static
 * @memberof H
 * @param {Object} p point to check
 * @param {Object} p0 point 1
 * @param {Object} p1 point 2
 * @returns {boolean}
 */
Ms.pointInRect = function(p, p0, p1) {
    var result = true;
    C.arrayEach(p, function(ele, index) {
        result &= Ms.varInRange(ele, p0[index], p1[index]);
    });
    return result;
};

/**
 * Extract max value. Object not supported
 *
 * @static
 * @memberof H
 * @param list
 * @returns {number}
 */
Ms.max = function(list) {
    var mx = -Infinity;
    C.arrayEach(list, function(v) {
        if (v > mx) mx = v;
    });
    return mx;
};

/**
 * Extract min value. Object not supported
 *
 * @static
 * @memberof H
 * @param list
 * @returns {number}
 */
Ms.min = function(list) {
    var mx = Infinity;
    C.arrayEach(list, function(v) {
        if (v < mx) mx = v;
    });
    return mx;
};

//dependes on `keys` and `values`
// Ms.maxValue = function(obj) {
//     return Ms.max(C.values(obj));
// };
//
// Ms.minValue = function(obj) {
//     return Ms.min(C.values(obj));
// };

/*
 * Individual Functions
 */

/**
 * Degree to radian
 *
 * @static
 * @memberof H
 * @param {Number} degree degree value
 * @returns {number} radian value
 */
Ms.degToRad = function(degree) {
    return (degree / 180.0) * Math.PI;
};

/**
 * Radian to degree
 *
 * @static
 * @memberof H
 * @param {Number} rad radian value
 * @returns {number} degree value
 */
Ms.radToDeg = function(rad) {
    return rad * 180.0 / Math.PI;
};

/**
 * Normalize degree value to [0, 360)
 *
 * @static
 * @memberof H
 * @param {Number} degree degree value
 * @returns {number} normalized degree value
 */
Ms.standardizeDegree = function(degree) {
    var floor = Math.floor(degree / 360.0);
    return degree - floor * 360.0;
};

/**
 * Normalize radian value to [0, 2*PI)
 *
 * @static
 * @memberof H
 * @param {Number} rad radian value
 * @returns {number} normalized radian value
 */
Ms.standardizeRad = function(rad) {
    var floor = Math.floor(rad / (2 * Math.PI));
    return rad - floor * 2 * Math.PI;
};

/**
 * Convert point in rectangle coordinates to polar coordinates. (in radian)
 *
 * @static
 * @memberof H
 * @param {Array} coor rect coordinates
 * @returns {*[]} polar coordinates
 */
Ms.rectToPolar = function(coor) {
    var r = Ms.hypot(coor[0], coor[1]);
    var absTheta = Math.atan2(Math.abs(coor[1]), Math.abs(coor[0])); // in rad
    var signal = coor[0] * coor[1] < 0;
    if (coor[0] >= 0) {
        if (coor[1] >= 0) {
            return [r, absTheta];
        } else {
            return [r, 2 * Math.PI - absTheta];
        }
    } else {
        return [r, Math.PI + (signal ? -1 : 1) * absTheta];
    }
};

/**
 * Convert point in polar coordinates to rectangle coordinates.
 *
 * @static
 * @memberof H
 * @param {Array} coor polar coordinates
 * @returns {*[]} rectangle coordinates
 */
Ms.polarToRect = function(coor) {
    var cA = Math.cos(coor[1]);
    var sA = Math.sin(coor[1]);
    return [coor[0] * cA, coor[0] * sA];
};

/**
 * Convert distance in latitude to meter
 *
 * @static
 * @memberof H
 * @param {Number} delta distance represented in latitude
 * @returns {number} distance in meter
 */
Ms.latToMeter = function(delta) {//in meters
    return 40008000 * delta / 360.0;
};

/**
 * Convert distance in longtitude around some latitude to meter
 *
 * @static
 * @memberof H
 * @param {Number} lat latitude
 * @param {Number} delta distance in longtitude
 * @returns {number} distance in meter
 */
Ms.lngToMeterAtLat = function(lat, delta) {
    return delta * Math.cos(Math.PI * Math.abs(lat) / 180) * 40075040 / 360.0;
};

/**
 * Convert distance in meter to distance in latitude
 *
 * @static
 * @memberof H
 * @param {Number} meter distance in meter
 * @returns {number} distance in latitude
 */
Ms.meterToLat = function(meter) {
    return 360.0 * meter / 40008000;
};

/**
 * Convert distance in meter to distance in longtitude around some latitude
 *
 * @static
 * @memberof H
 * @param {Number} lat latitude
 * @param {Number} meter distance in meter
 * @returns {number} distance in longtitude
 */
Ms.meterToLngAtLat = function(lat, meter) {
    return 360.0 * meter / (40075040 * Math.cos(Math.PI * Math.abs(lat) / 180));
};

/**
 * Calculate the distance between two points on earth.
 * Points are represented in 2-element arrays ([longtitude, latitude])
 * Assuming the earth a perfect sphere.
 *
 * @static
 * @memberof H
 * @param {Array} p0 point 1
 * @param {Array} p1 point 2
 * @returns {number} distance in meters
 */
Ms.distOnEarth = function(p0, p1) {
    //[lng, lat], assuming earth a sphere
    return Math.PI * 6400000 * Math.acos(Math.cos(p0[0] - p1[0]) + Math.cos(p0[1] - p1[1]) - 1) / 180.0;
};

module.exports = Ms;
/*
 * Math-Related Module
 */

var Ms = {};
var C = require('./minicore');

Ms.hypot = Math.hypot || function() {
        return Math.sqrt(C.each(arguments, function(arg) {
            return arg * arg;
        }).sum());
    };

Ms.log2 = Math.log2 || function(number) {
        return Math.log(number) / Math.log(2);
    };

Ms.varInRange = function(v, v0, v1) {
    return (v - v0) * (v - v1) < 0;
};

Ms.pointInRect = function(p, p0, p1) {
    var result = true;
    C.each(p, function(ele, index) {
        result &= Ms.varInRange(ele, p0[index], p1[index]);
    });
    return result;
};

/**
 * Extract max value. Support object
 * @param list
 * @returns {number}
 */
Ms.max = function(list) {
    var mx = -Infinity;
    C.each(list, function(v) {
        if (v > mx) mx = v;
    });
    return mx;
};

Ms.min = function(list) {
    var mx = Infinity;
    C.each(list, function(v) {
        if (v < mx) mx = v;
    });
    return mx;
};

Ms.maxValue = function(obj) {
    return Ms.max(C.values(obj));
};

Ms.minValue = function(obj) {
    return Ms.min(C.values(obj));
};

/*
 * Individual Functions
 */

Ms.degToRad = function(degree) {
    return (degree / 180.0) * Math.PI;
};

Ms.radToDeg = function(rad) {
    return rad * 180.0 / Math.PI;
};

Ms.standardizeDegree = function(degree) {
    var floor = Math.floor(degree / 360.0);
    return degree - floor * 360.0;
};

Ms.standardizeRad = function(rad) {
    var floor = Math.floor(rad / (2 * Math.PI));
    return rad - floor * 2 * Math.PI;
};

//in rad
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

Ms.polarToRect = function(coor) {
    var cA = Math.cos(coor[1]);
    var sA = Math.sin(coor[1]);
    return [coor[0] * cA, coor[0] * sA];
};

Ms.latToMeter = function(delta) {//in meters
    return 40008000 * delta / 360.0;
};

Ms.lngToMeterAtLat = function(lat, delta) {
    return delta * Math.cos(Math.PI * Math.abs(lat) / 180) * 40075040 / 360.0;
};

Ms.meterToLat = function(meter) {
    return 360.0 * meter / 40008000;
};

Ms.meterToLngAtLat = function(lat, meter) {
    return 360.0 * meter / (40075040 * Math.cos(Math.PI * Math.abs(lat) / 180));
};

Ms.distOnEarth = function(p0, p1) {
    //[lng, lat], assuming earth a sphere
    return Math.PI * 6400000 * Math.acos(Math.cos(p0[0] - p1[0]) + Math.cos(p0[1] - p1[1]) - 1) / 180.0;
};


module.exports = Ms;
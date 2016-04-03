/*
 * ResultSet: Array or Element, they share the same filter/checker
 */

var ARS = {};

var Mini = require('../mini');
var H = require('./shims');

ARS.modules = {};
ARS.checkTargets = {};
ARS.checkers = {};

var MODULE = '__Module__';

ARS.registerChannel = function(identifier, targets, valuePrechecker) {
    ARS.modules[identifier] = {};
    ARS.checkTargets[identifier] = targets;
    ARS.checkers[identifier] = valuePrechecker;

    Mini.arrayEach(targets || [], function(target) {
        if (!target[MODULE]) {
            H.addProperty(target, MODULE, Mini.hiddenProperty(MODULE));
        }
    });
};

function preCheck(object) {
    return (ARS.checkers[object[MODULE] || ""] || function() {})(object);
}

ARS.registerChannelFunction = function(channel, name, funcGen) {
    Mini.arrayEach(ARS.checkTargets[channel] || [], function(target) {
        if (target[name]) {
            //exist, do nothing. cuz preChecker is relative to current module
        } else {
            //not exist, add func to target
            // target[name] = funcGen(ARS.checkers[channel]);
            H.addProperty(target, name, Mini.hiddenProperty(funcGen(preCheck)));
        }
    });
};

module.exports = ARS;
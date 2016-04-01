/*
 * Core Module Interface
 */
var Core = require('./core');

var _ = require('lodash');
var Encodings = require('./encoding');

_.extend(_, Core);
_.extend(_, Encodings);

//require('../advanced');
//require('../algorithms');
//require('../network');
//require('../crypt');
//require('../dom');
//require('../m3d');

Core.root.H = _;

module.exports = _;
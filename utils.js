/*
 * Core Module Interface
 */
var Core = require('./core');

var _ = require('lodash');
var Encodings = require('./src/encoding');

_.extend(_, Core);
_.extend(_, Encodings);

//require('../advanced');
//require('../algorithms');
//require('../network');
//require('../crypt');
//require('../dom');
//require('../m3d');

Core.root[Core.__name] = _;

module.exports = _;
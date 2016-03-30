/*
 * Core Module Interface
 */

var Core = require('./core');

//require('../advanced');
//require('../algorithms');
//require('../network');
//require('../crypt');
require('../shims/raf');
//require('../dom');
//require('../m3d');

Core.extend(Core, require('./advanced'));
Core.extend(Core, require('./array'));
Core.extend(Core, require('./arraybuffer'));
Core.extend(Core, require('./encoding'));
Core.extend(Core, require('./event'));
Core.extend(Core, require('./iterator'));
Core.extend(Core, require('./math'));
Core.extend(Core, require('./object'));
//Core.extend(require('./resultset'));
//Core.extend(require('./resultset'));

Core.root.H = Core;

module.exports = Core;
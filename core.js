var Core = require('./src/core');

Core.extend(Core, require('./src/iterator'));

Core.root.H = Core;

module.exports = Core;
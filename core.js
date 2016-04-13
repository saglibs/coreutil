var Core = require('./src/core');

Core.extend(Core, require('./src/iterator'));

Core.root[Core.__name] = Core;

module.exports = Core;
var Core = require('./src/main/javascript/core');

Core.extend(Core, require('./src/main/javascript/iterator'));

Core.root[Core.__name] = Core;

module.exports = Core;
var Core = require('./src/core');

Core.extend(Core, require('./src/iterator'));

module.exports = Core;
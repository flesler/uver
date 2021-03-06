var fs = require('fs'),
	path = require('path');

module.exports = function(opts) {
	if (typeof opts === 'string') {
		opts = {ver:opts};
	} else {
		opts = opts || {};
	}

	//- Options
	var filename = opts.filename || 'package.json';
	var root = opts.root || process.cwd();
	var inc = opts.revert ? -1 : 1;
	var index = ('index' in opts) ? opts.index :
		opts.major ? 0 : 
		opts.minor ? 1 : 
		             2 ;

	var source = path.join(root, filename);
	var contents = fs.readFileSync(source, {encoding:'utf8'});

	var newVer = null;
	var updated = contents.replace(/version[" :=]+(\d+\.[^\s"]+)/, function(line, ver) {
		// Set a fixed version number
		if (opts.ver) {
			newVer = opts.ver;
		} else {
			var vers = ver.split('.');
			vers[index] = parseInt(vers[index] || 0, 10) + inc;
			// Reset to 0 all the ones on the right
			for (var i = index + 1; i < vers.length; i++) {
				vers[i] = 0;
			}
			newVer = vers.join('.');
		}
		return line.replace(ver, newVer);
	});

	if (newVer) {
		// Write to a stream
		if (opts.stream) {
			opts.stream.write(updated);
		} else {
			var out = opts.output || source;
			fs.writeFileSync(out, updated);
		}
	}

	return newVer;
};

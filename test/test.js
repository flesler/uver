var fs = require('fs'),
	expect = require('chai').expect,
	uver = require('../'),
	original;

// Default version
const DEF = '1.1.1';

describe('uver', function() {
	before(function() {
		process.chdir(__dirname);
		original = fs.readFileSync('../package.json', {encoding:'utf8'});
		// Use module's package.json but normalize version to 1.1.1 for determinism
		var ver = JSON.parse(original).version;
		original = original.replace(ver, DEF);
	});

	function assert(opts, expected, version) {
		var source = version ? original.replace(DEF, version) : original;
		fs.writeFileSync('package.json', source);

		var newVer = uver(opts);
		expect(expected).to.equal(newVer);

		if (expected) {
			var saved = fs.readFileSync('package.json', {encoding:'utf8'});
			var result = original.replace(DEF, expected);
			expect(saved).to.equal(result);
		}
	}

	it('should increment patch when no option is given', function() {
		assert(undefined, '1.1.2');
		assert({}, '1.1.2');
	});

	it('should increment patch when `patch` is true', function() {
		assert({patch:true}, '1.1.2');
	});

	it('should increment minor when `minor` is true', function() {
		assert({minor:true}, '1.2.0');
	});

	it('should increment major when `major` is true', function() {
		assert({major:true}, '2.0.0');
	});

	it('should increment based on `index` when given', function() {
		assert({index:0}, '2.0.0');
		assert({index:1}, '1.2.0');
		assert({index:2}, '1.1.2');
	});

	it('should increment as if 0 when `index` is out of bounds', function() {
		assert({index:3}, '1.1.1.1');
	});

	it('should decrement when `revert` is true', function() {
		assert({major:true, revert:true}, '0.0.0');
		assert({minor:true, revert:true}, '1.0.0');
		assert({patch:true, revert:true}, '1.1.0');
	});

	it('should clear anything other than a number from versions', function() {
		assert({minor:true}, '1.2.0', '1.1.1-rc2');
		assert({patch:true}, '1.1.2', '1.1.1-rc2');
	});

	it('should set a fixed version when `ver` is given', function() {
		assert({ver:'1.2.3'}, '1.2.3');
		assert({ver:'1.2.3'}, '1.2.3', '1.1.1');
	});

	it('should set a fixed version when argument is a string', function() {
		assert('1.2.3', '1.2.3');
	});

	it('should return null when version was not found', function() {
		// Simulate an invalid package.json version
		assert('1.1.2', null, 'BAD_VERSION');
	});

	it('should read the specified file when `filename` is given', function() {
		expect(function() {
			uver({filename:'non-existent'});
		}).to.throw(/ENOENT.+non-existent/);
	});

	it('should read from the specified folder when `root` is given', function() {
		expect(function() {
			uver({root:'root'});
		}).to.throw(/ENOENT.+root.package\.json/);
	});

	it('should write to a stream instead of source when `stream` is given', function() {
		var called = false;
		var stream = {
			write: function(file) {
				called = true;
				expect(file).to.equal(original);
			}
		};
		assert({stream:stream, ver:DEF}, DEF);
		expect(called).to.be.true;
	});

	it('should support JSDoc kind of version', function() {
		var _original = original;
		original = original.replace('"version": "1.1.1",', 'version 1.1.1');
		assert({}, '1.1.2');
		original = _original;
	});

	after(function() {
		fs.unlinkSync('package.json');
		process.chdir('..');
	});
 });
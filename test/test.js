var fs = require('fs'),
	expect = require('chai').expect,
	uver = require('../'),
	original;


describe('uver', function() {
	before(function() {
		process.chdir(__dirname);
		original = fs.readFileSync('../package.json', {encoding:'utf8'});
		// Use module's package.json but normalize version to 1.1.1 for determinism
		var ver = JSON.parse(original).version;
		original = original.replace(ver, '1.1.1');
	});

	function assert(opts, expected) {
		fs.writeFileSync('package.json', original);

		var newVer = uver(opts);
		expect(expected).to.equal(newVer);

		var saved = fs.readFileSync('package.json', {encoding:'utf8'});
		expect(saved).to.equal(original.replace('1.1.1', expected));
	}

	it('should increment patch when no option is given', function() {
		assert(undefined, '1.1.2');
		assert({}, '1.1.2');
	});

	it('should increment patch when `patch` is true', function() {
		assert({patch:true}, '1.1.2');
	});

	it('should increment minor when `minor` is true', function() {
		assert({minor:true}, '1.2.1');
	});

	it('should increment major when `major` is true', function() {
		assert({major:true}, '2.1.1');
	});

	it('should increment based on `index` when given', function() {
		assert({index:0}, '2.1.1');
		assert({index:1}, '1.2.1');
		assert({index:2}, '1.1.2');
	});

	it('should increment as if 0 when `index` is out of bounds', function() {
		assert({index:3}, '1.1.1.1');
	});

	it('should decrement when `revert` is true', function() {
		assert({major:true, revert:true}, '0.1.1');
		assert({minor:true, revert:true}, '1.0.1');
		assert({patch:true, revert:true}, '1.1.0');
	});

	it('should set a fixed version when `ver` is given', function() {
		assert({ver:'1.2.3'}, '1.2.3');
	});

	it('should set a fixed version when argument is a string', function() {
		assert('1.2.3', '1.2.3');
	});

	it('should return null when version was not modified', function() {
		var o = original;
		// Simulate an invalid package.json
		original = '{}';
		assert('1.1.2', null);
		original = o;
	});

	it('should read the specified file when `filename` is given', function() {
		expect(function() {
			uver({filename:'non-existent'})
		}).to.throw(/ENOENT.+non-existent/);
	});

	it('should read from the specified folder when `root` is given', function() {
		expect(function() {
			uver({root:'root'})
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
		assert({stream:stream, ver:'1.1.1'}, '1.1.1');
		expect(called).to.be.true;
	});

	after(function() {
		fs.unlinkSync('package.json');
		process.chdir('..');
	});
 });
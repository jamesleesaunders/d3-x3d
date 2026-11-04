import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Volume Slice Component, component.volumeSlice()", function() {
	let volumeSlice = d3X3d.component.volumeSlice();

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("Default dimensions", function(done) {
			chai.expect(volumeSlice.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("Changed dimensions", function(done) {
			volumeSlice.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(volumeSlice.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test imageUrl getter / setter function
	test.describe("#imageUrl()", function() {
		test.it("Default imageUrl is undefined", function(done) {
			chai.expect(volumeSlice.imageUrl()).to.be.undefined;
			done();
		});
		test.it("Changed imageUrl is set", function(done) {
			volumeSlice.imageUrl("assets/scan2.png");
			chai.expect(volumeSlice.imageUrl()).to.equal("assets/scan2.png");
			done();
		});
	});

	// Test numberOfSlices getter / setter function
	test.describe("#numberOfSlices()", function() {
		test.it("Default numberOfSlices is undefined", function(done) {
			chai.expect(volumeSlice.numberOfSlices()).to.be.undefined;
			done();
		});
		test.it("Changed numberOfSlices is set", function(done) {
			volumeSlice.numberOfSlices(35);
			chai.expect(volumeSlice.numberOfSlices()).to.equal(35);
			done();
		});
	});

	// Test slicesOverX getter / setter function
	test.describe("#slicesOverX()", function() {
		test.it("Default slicesOverX is undefined", function(done) {
			chai.expect(volumeSlice.slicesOverX()).to.be.undefined;
			done();
		});
		test.it("Changed slicesOverX is set", function(done) {
			volumeSlice.slicesOverX(7);
			chai.expect(volumeSlice.slicesOverX()).to.equal(7);
			done();
		});
	});

	// Test slicesOverY getter / setter function
	test.describe("#slicesOverY()", function() {
		test.it("Default slicesOverY is undefined", function(done) {
			chai.expect(volumeSlice.slicesOverY()).to.be.undefined;
			done();
		});
		test.it("Changed slicesOverY is set", function(done) {
			volumeSlice.slicesOverY(5);
			chai.expect(volumeSlice.slicesOverY()).to.equal(5);
			done();
		});
	});

	// Test volumeStyle getter / setter function
	test.describe("#volumeStyle()", function() {
		test.it("Default volumeStyle", function(done) {
			chai.expect(volumeSlice.volumeStyle()).to.equal("OpacityMap");
			done();
		});
		test.it("Changed volumeStyle", function(done) {
			volumeSlice.volumeStyle("MPRVolume");
			chai.expect(volumeSlice.volumeStyle()).to.equal("MPRVolume");
			done();
		});
	});
});

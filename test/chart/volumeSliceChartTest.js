import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Volume Slice Chart, chart.volumeSliceChart()", function() {
	let volumeSliceChart = d3X3d.chart.volumeSliceChart();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(volumeSliceChart.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			volumeSliceChart.width(300);
			chai.expect(volumeSliceChart.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(volumeSliceChart.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			volumeSliceChart.height(300);
			chai.expect(volumeSliceChart.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(volumeSliceChart.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 40, y: 40, z: 30 }", function(done) {
			volumeSliceChart.dimensions({ x: 40, y: 40, z: 30 });
			chai.expect(volumeSliceChart.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(volumeSliceChart.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			volumeSliceChart.xScale(0.2);
			chai.expect(volumeSliceChart.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(volumeSliceChart.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			volumeSliceChart.yScale(0.1);
			chai.expect(volumeSliceChart.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(volumeSliceChart.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			volumeSliceChart.zScale(0.2);
			chai.expect(volumeSliceChart.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test imageUrl getter / setter function
	test.describe("#imageUrl()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(volumeSliceChart.imageUrl()).to.be.undefined;
			done();
		});
		test.it("should be changed to \"assets/scan2.png\"", function(done) {
			volumeSliceChart.imageUrl("assets/scan2.png");
			chai.expect(volumeSliceChart.imageUrl()).to.equal("assets/scan2.png");
			done();
		});
	});

	// Test numberOfSlices getter / setter function
	test.describe("#numberOfSlices()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(volumeSliceChart.numberOfSlices()).to.be.undefined;
			done();
		});
		test.it("should be changed to 35", function(done) {
			volumeSliceChart.numberOfSlices(35);
			chai.expect(volumeSliceChart.numberOfSlices()).to.equal(35);
			done();
		});
	});

	// Test slicesOverX getter / setter function
	test.describe("#slicesOverX()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(volumeSliceChart.slicesOverX()).to.be.undefined;
			done();
		});
		test.it("should be changed to 7", function(done) {
			volumeSliceChart.slicesOverX(7);
			chai.expect(volumeSliceChart.slicesOverX()).to.equal(7);
			done();
		});
	});

	// Test slicesOverY getter / setter function
	test.describe("#slicesOverY()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(volumeSliceChart.slicesOverY()).to.be.undefined;
			done();
		});
		test.it("should be changed to 5", function(done) {
			volumeSliceChart.slicesOverY(5);
			chai.expect(volumeSliceChart.slicesOverY()).to.equal(5);
			done();
		});
	});

	// Test volumeStyle getter / setter function
	test.describe("#volumeStyle()", function() {
		test.it("should default to OpacityMap", function(done) {
			chai.expect(volumeSliceChart.volumeStyle()).to.equal("OpacityMap");
			done();
		});
		test.it("should be changed to MPRVolume", function(done) {
			volumeSliceChart.volumeStyle("MPRVolume");
			chai.expect(volumeSliceChart.volumeStyle()).to.equal("MPRVolume");
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(volumeSliceChart.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			volumeSliceChart.debug(true);
			chai.expect(volumeSliceChart.debug()).to.be.true;
			done();
		});
	});
});

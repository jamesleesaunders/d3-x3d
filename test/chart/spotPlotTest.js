import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Spot Plot, chart.spotPlot()", function() {
	let spotPlot = d3X3d.chart.spotPlot();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(spotPlot.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			spotPlot.width(300);
			chai.expect(spotPlot.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(spotPlot.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			spotPlot.height(300);
			chai.expect(spotPlot.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(spotPlot.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 10, y: 20, z: 30 }", function(done) {
			spotPlot.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(spotPlot.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(spotPlot.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			spotPlot.xScale(0.2);
			chai.expect(spotPlot.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(spotPlot.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			spotPlot.yScale(0.1);
			chai.expect(spotPlot.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(spotPlot.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			spotPlot.zScale(0.2);
			chai.expect(spotPlot.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(spotPlot.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			spotPlot.colorScale(2);
			chai.expect(spotPlot.colorScale()).to.equal(2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(spotPlot.sizeScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			spotPlot.sizeScale(2);
			chai.expect(spotPlot.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("should default to [0.5, 3.5]", function(done) {
			chai.expect(spotPlot.sizeRange()).to.be.deep.equal([0.5, 3.5]);
			done();
		});
		test.it("should be changed to [0.2, 5.0]", function(done) {
			spotPlot.sizeRange([0.2, 5.0]);
			chai.expect(spotPlot.sizeRange()).to.be.deep.equal([0.2, 5.0]);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to ...", function(done) {
			chai.expect(spotPlot.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("should be changed to ...", function(done) {
			spotPlot.colors(["orange", "yellow", "red", "steelblue", "green"]);
			chai.expect(spotPlot.colors()).to.be.deep.equal(["orange", "yellow", "red", "steelblue", "green"]);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(spotPlot.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			spotPlot.debug(true);
			chai.expect(spotPlot.debug()).to.be.true;
			done();
		});
	});
});

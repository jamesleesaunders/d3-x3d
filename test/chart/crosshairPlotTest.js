import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Crosshair Plot, chart.crosshairPlot()", function() {
	let crosshairPlot = d3X3d.chart.crosshairPlot();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(crosshairPlot.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			crosshairPlot.width(300);
			chai.expect(crosshairPlot.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(crosshairPlot.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			crosshairPlot.height(300);
			chai.expect(crosshairPlot.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(crosshairPlot.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 10, y: 20, z: 30 }", function(done) {
			crosshairPlot.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(crosshairPlot.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(crosshairPlot.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			crosshairPlot.xScale(0.2);
			chai.expect(crosshairPlot.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(crosshairPlot.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			crosshairPlot.yScale(0.1);
			chai.expect(crosshairPlot.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(crosshairPlot.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			crosshairPlot.zScale(0.2);
			chai.expect(crosshairPlot.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(crosshairPlot.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			crosshairPlot.debug(true);
			chai.expect(crosshairPlot.debug()).to.be.true;
			done();
		});
	});
});

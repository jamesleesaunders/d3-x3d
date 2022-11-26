import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"
test.describe("Test Bubble Chart, chart.bubbleChart()", function() {
	let bubbleChart = d3X3d.chart.bubbleChart();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(bubbleChart.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			bubbleChart.width(300);
			chai.expect(bubbleChart.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(bubbleChart.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			bubbleChart.height(300);
			chai.expect(bubbleChart.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(bubbleChart.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 20, y: 20, z: 20 }", function(done) {
			bubbleChart.dimensions({ x: 20, y: 20, z: 20 });
			chai.expect(bubbleChart.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 20 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(bubbleChart.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			bubbleChart.xScale(0.2);
			chai.expect(bubbleChart.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(bubbleChart.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			bubbleChart.yScale(0.1);
			chai.expect(bubbleChart.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(bubbleChart.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			bubbleChart.zScale(0.2);
			chai.expect(bubbleChart.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(bubbleChart.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			bubbleChart.colorScale(2);
			chai.expect(bubbleChart.colorScale()).to.equal(2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(bubbleChart.sizeScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			bubbleChart.sizeScale(2);
			chai.expect(bubbleChart.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("should default to [0.5, 3.5]", function(done) {
			chai.expect(bubbleChart.sizeRange()).to.be.deep.equal([0.5, 3.5]);
			done();
		});
		test.it("should be changed to [0.2, 5.0]", function(done) {
			bubbleChart.sizeRange([0.2, 5.0]);
			chai.expect(bubbleChart.sizeRange()).to.be.deep.equal([0.2, 5.0]);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to ...", function(done) {
			chai.expect(bubbleChart.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("should be changed to ...", function(done) {
			bubbleChart.colors(["orange", "yellow", "red", "steelblue", "green"]);
			chai.expect(bubbleChart.colors()).to.be.deep.equal(["orange", "yellow", "red", "steelblue", "green"]);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(bubbleChart.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			bubbleChart.debug(true);
			chai.expect(bubbleChart.debug()).to.be.true;
			done();
		});
	});
});

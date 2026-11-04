import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Donut Chart, chart.donutChart()", function() {
	let donutChart = d3X3d.chart.donutChart();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(donutChart.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			donutChart.width(300);
			chai.expect(donutChart.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(donutChart.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			donutChart.height(300);
			chai.expect(donutChart.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(donutChart.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 20, y: 20, z: 20 }", function(done) {
			donutChart.dimensions({ x: 20, y: 20, z: 20 });
			chai.expect(donutChart.dimensions()).to.be.deep.equal({ x: 20, y: 20, z: 20 });
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to ...", function(done) {
			chai.expect(donutChart.colors()).to.be.deep.equal(["green", "red", "yellow", "steelblue", "orange"]);
			done();
		});
		test.it("should be changed to ...", function(done) {
			donutChart.colors(["orange", "yellow", "red", "steelblue", "green"]);
			chai.expect(donutChart.colors()).to.be.deep.equal(["orange", "yellow", "red", "steelblue", "green"]);
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(donutChart.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			donutChart.debug(true);
			chai.expect(donutChart.debug()).to.be.true;
			done();
		});
	});
});

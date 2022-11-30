import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Vector Field Chart, chart.vectorFieldChart()", function() {
	let vectorFieldChart = d3X3d.chart.vectorFieldChart();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(vectorFieldChart.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			vectorFieldChart.width(300);
			chai.expect(vectorFieldChart.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(vectorFieldChart.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			vectorFieldChart.height(300);
			chai.expect(vectorFieldChart.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 40, z: 40 }", function(done) {
			chai.expect(vectorFieldChart.dimensions()).to.be.deep.equal({ x: 40, y: 40, z: 40 });
			done();
		});
		test.it("should be changed to { x: 10, y: 20, z: 30 }", function(done) {
			vectorFieldChart.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(vectorFieldChart.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(vectorFieldChart.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			vectorFieldChart.xScale(0.2);
			chai.expect(vectorFieldChart.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(vectorFieldChart.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			vectorFieldChart.yScale(0.1);
			chai.expect(vectorFieldChart.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(vectorFieldChart.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			vectorFieldChart.zScale(0.2);
			chai.expect(vectorFieldChart.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(vectorFieldChart.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			vectorFieldChart.colorScale(2);
			chai.expect(vectorFieldChart.colorScale()).to.equal(2);
			done();
		});
	});

	// Test sizeScale getter / setter function
	test.describe("#sizeScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(vectorFieldChart.sizeScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			vectorFieldChart.sizeScale(2);
			chai.expect(vectorFieldChart.sizeScale()).to.equal(2);
			done();
		});
	});

	// Test sizeRange getter / setter function
	test.describe("#sizeRange()", function() {
		test.it("should default to [2.0, 5.0]", function(done) {
			chai.expect(vectorFieldChart.sizeRange()).to.be.deep.equal([2.0, 5.0]);
			done();
		});
		test.it("should be changed to [3.5, 7.0]", function(done) {
			vectorFieldChart.sizeRange([3.5, 7.0]);
			chai.expect(vectorFieldChart.sizeRange()).to.be.deep.equal([3.5, 7.0]);
			done();
		});
	});

	// Test vectorFunction getter / setter function
	test.describe("#vectorFunction()", function() {
		test.it("show return a function", function(done) {
			chai.expect(vectorFieldChart.vectorFunction()).to.be.a("function");
			done();
		});
		test.it("should return a function that returns \"Hello World\"", function(done) {
			vectorFieldChart.vectorFunction(() => "Hello World");
			chai.expect(vectorFieldChart.vectorFunction()()).to.equal("Hello World");
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(vectorFieldChart.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			vectorFieldChart.debug(true);
			chai.expect(vectorFieldChart.debug()).to.be.true;
			done();
		});
	});
});

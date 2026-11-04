import test from "mocha";
import * as chai from "chai";
import d3X3d from "../../index.js"

test.describe("Test Heat Map, chart.heatMap()", function() {
	let heatMap = d3X3d.chart.heatMap();

	// Test width getter / setter function
	test.describe("#width()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(heatMap.width()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			heatMap.width(300);
			chai.expect(heatMap.width()).to.equal(300);
			done();
		});
	});

	// Test height getter / setter function
	test.describe("#height()", function() {
		test.it("should default to 500", function(done) {
			chai.expect(heatMap.height()).to.equal(500);
			done();
		});
		test.it("should be changed to 300", function(done) {
			heatMap.height(300);
			chai.expect(heatMap.height()).to.equal(300);
			done();
		});
	});

	// Test dimensions getter / setter function
	test.describe("#dimensions()", function() {
		test.it("should default to { x: 40, y: 20, z: 40 }", function(done) {
			chai.expect(heatMap.dimensions()).to.be.deep.equal({ x: 40, y: 20, z: 40 });
			done();
		});
		test.it("should be changed to { x: 10, y: 20, z: 30 }", function(done) {
			heatMap.dimensions({ x: 10, y: 20, z: 30 });
			chai.expect(heatMap.dimensions()).to.be.deep.equal({ x: 10, y: 20, z: 30 });
			done();
		});
	});

	// Test xScale getter / setter function
	test.describe("#xScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(heatMap.xScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			heatMap.xScale(0.2);
			chai.expect(heatMap.xScale()).to.equal(0.2);
			done();
		});
	});

	// Test yScale getter / setter function
	test.describe("#yScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(heatMap.yScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.1", function(done) {
			heatMap.yScale(0.1);
			chai.expect(heatMap.yScale()).to.equal(0.1);
			done();
		});
	});

	// Test zScale getter / setter function
	test.describe("#zScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(heatMap.zScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 0.2", function(done) {
			heatMap.zScale(0.2);
			chai.expect(heatMap.zScale()).to.equal(0.2);
			done();
		});
	});

	// Test colorScale getter / setter function
	test.describe("#colorScale()", function() {
		test.it("should default to undefined", function(done) {
			chai.expect(heatMap.colorScale()).to.be.undefined;
			done();
		});
		test.it("should be changed to 2", function(done) {
			heatMap.colorScale(2);
			chai.expect(heatMap.colorScale()).to.equal(2);
			done();
		});
	});

	// Test colors getter / setter function
	test.describe("#colors()", function() {
		test.it("should default to [\"#1e253f\", \"#e33b30\"]", function(done) {
			chai.expect(heatMap.colors()).to.be.deep.equal(["#1e253f", "#e33b30"]);
			done();
		});
		test.it("should be changed to [\"orange\", \"yellow\"]", function(done) {
			heatMap.colors(["orange", "yellow"]);
			chai.expect(heatMap.colors()).to.be.deep.equal(["orange", "yellow"]);
			done();
		});
	});

	// Test labelPosition getter / setter function
	test.describe("#labelPosition()", function() {
		test.it("should default to distal", function(done) {
			chai.expect(heatMap.labelPosition()).to.equal("distal");
			done();
		});
		test.it("should be changed to proximal", function(done) {
			heatMap.labelPosition("proximal");
			chai.expect(heatMap.labelPosition()).to.equal("proximal");
			done();
		});
	});

	// Test debug getter / setter function
	test.describe("#debug()", function() {
		test.it("should default to false", function(done) {
			chai.expect(heatMap.debug()).to.be.false;
			done();
		});
		test.it("should be changed to true", function(done) {
			heatMap.debug(true);
			chai.expect(heatMap.debug()).to.be.true;
			done();
		});
	});
});

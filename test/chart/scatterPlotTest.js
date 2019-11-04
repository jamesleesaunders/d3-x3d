let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Scatter Plot Chart, chart.scatterPlot()", function(t) {
	let scatterPlot = d3X3d.chart.scatterPlot();

	// Test width getter / setter function
	t.equal(scatterPlot.width(), 500, "Default width");
	scatterPlot.width(300);
	t.equal(scatterPlot.width(), 300, "Changed width");

	// Test height getter / setter function
	t.equal(scatterPlot.height(), 500, "Default height");
	scatterPlot.height(300);
	t.equal(scatterPlot.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(scatterPlot.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	scatterPlot.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(scatterPlot.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(scatterPlot.xScale(), undefined, "Default xScale is undefined");
	scatterPlot.xScale(0.2);
	t.equal(scatterPlot.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(scatterPlot.yScale(), undefined, "Default yScale is undefined");
	scatterPlot.yScale(0.1);
	t.equal(scatterPlot.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(scatterPlot.zScale(), undefined, "Default zScale is undefined");
	scatterPlot.zScale(0.1);
	t.equal(scatterPlot.zScale(), 0.1, "Changed zScale is set");

	// Test color getter / setter function
	t.equal(scatterPlot.color(), undefined, "Default color");
	scatterPlot.color("red");
	t.equal(scatterPlot.color(), "red", "Changed color");

	// Test colors getter / setter function
	t.deepEqual(scatterPlot.colors(), ["orange"], "Default colors");
	scatterPlot.colors(["red", "green"]);
	t.deepEqual(scatterPlot.colors(), ["red", "green"], "Changed colors");

	// Test debug getter / setter function
	t.equal(scatterPlot.debug(), false, "Debug mode is false");
	scatterPlot.debug(true);
	t.equal(scatterPlot.debug(), true, "Debug mode is true");

	t.end();
});

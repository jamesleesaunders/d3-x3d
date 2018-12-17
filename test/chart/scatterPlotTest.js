let test = require('tape');
let d3X3dom = require("../../");

test("Test Scatter Plot Chart, chart.scatterPlot()", function(t) {
	let scatterPlot = d3X3dom.chart.scatterPlot();

	// Test width getter / setter function
	t.deepEqual(scatterPlot.width(), 500, "Default width");
	scatterPlot.width(300);
	t.deepEqual(scatterPlot.width(), 300, "Changed width");

	// Test height getter / setter function
	t.deepEqual(scatterPlot.height(), 500, "Default height");
	scatterPlot.height(300);
	t.deepEqual(scatterPlot.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(scatterPlot.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	scatterPlot.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(scatterPlot.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.deepEqual(scatterPlot.xScale(), undefined, "Default xScale is undefined");
	scatterPlot.xScale(0.2);
	t.deepEqual(scatterPlot.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.deepEqual(scatterPlot.yScale(), undefined, "Default yScale is undefined");
	scatterPlot.yScale(0.1);
	t.deepEqual(scatterPlot.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.deepEqual(scatterPlot.zScale(), undefined, "Default zScale is undefined");
	scatterPlot.zScale(0.1);
	t.deepEqual(scatterPlot.zScale(), 0.1, "Changed zScale is set");

	// Test color getter / setter function
	t.deepEqual(scatterPlot.color(), "orange", "Default color");
	scatterPlot.color("red");
	t.deepEqual(scatterPlot.color(), "red", "Changed color");

	// Test debug getter / setter function
	t.deepEqual(scatterPlot.debug(), false, "Debug mode is false");
	scatterPlot.debug(true);
	t.deepEqual(scatterPlot.debug(), true, "Debug mode is true");

	t.end();
});

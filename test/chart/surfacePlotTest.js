let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Surface Plot Chart, chart.surfacePlot()", function(t) {
	let surfacePlot = d3X3d.chart.surfacePlot();

	// Test width getter / setter function
	t.equal(surfacePlot.width(), 500, "Default width");
	surfacePlot.width(300);
	t.equal(surfacePlot.width(), 300, "Changed width");

	// Test height getter / setter function
	t.equal(surfacePlot.height(), 500, "Default height");
	surfacePlot.height(300);
	t.equal(surfacePlot.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(surfacePlot.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	surfacePlot.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(surfacePlot.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(surfacePlot.xScale(), undefined, "Default xScale is undefined");
	surfacePlot.xScale(0.2);
	t.equal(surfacePlot.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(surfacePlot.yScale(), undefined, "Default yScale is undefined");
	surfacePlot.yScale(0.1);
	t.equal(surfacePlot.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(surfacePlot.zScale(), undefined, "Default zScale is undefined");
	surfacePlot.zScale(0.1);
	t.equal(surfacePlot.zScale(), 0.1, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.equal(surfacePlot.colorScale(), undefined, "Default colorScale is undefined");
	surfacePlot.colorScale(2);
	t.equal(surfacePlot.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(surfacePlot.colors(), ["blue", "red"], "Default colors");
	surfacePlot.colors(["orange", "yellow"]);
	t.deepEqual(surfacePlot.colors(), ["orange", "yellow"], "Changed colors");

	// Test debug getter / setter function
	t.equal(surfacePlot.debug(), false, "Debug mode is false");
	surfacePlot.debug(true);
	t.equal(surfacePlot.debug(), true, "Debug mode is true");

	t.end();
});

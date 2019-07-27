let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Vertical Bar Chart, chart.barChartVertical()", function(t) {
	let barChartVertical = d3X3d.chart.barChartVertical();

	// Test width getter / setter function
	t.equal(barChartVertical.width(), 500, "Default width");
	barChartVertical.width(300);
	t.equal(barChartVertical.width(), 300, "Changed width");

	// Test height getter / setter function
	t.equal(barChartVertical.height(), 500, "Default height");
	barChartVertical.height(300);
	t.equal(barChartVertical.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(barChartVertical.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	barChartVertical.dimensions({ x: 20, y: 20, z: 20 });
	t.deepEqual(barChartVertical.dimensions(), { x: 20, y: 20, z: 20 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(barChartVertical.xScale(), undefined, "Default xScale is undefined");
	barChartVertical.xScale(0.2);
	t.equal(barChartVertical.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(barChartVertical.yScale(), undefined, "Default yScale is undefined");
	barChartVertical.yScale(0.1);
	t.equal(barChartVertical.yScale(), 0.1, "Changed yScale is set");

	// Test colorScale getter / setter function
	t.equal(barChartVertical.colorScale(), undefined, "Default colorScale is undefined");
	barChartVertical.colorScale(2);
	t.equal(barChartVertical.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(barChartVertical.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	barChartVertical.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(barChartVertical.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test debug getter / setter function
	t.equal(barChartVertical.debug(), false, "Debug mode is false");
	barChartVertical.debug(true);
	t.equal(barChartVertical.debug(), true, "Debug mode is true");

	t.end();
});

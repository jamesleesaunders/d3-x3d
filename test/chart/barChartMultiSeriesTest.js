let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3dom = require("../../");

test("Test Multi Series Bar Chart, chart.barChartMultiSeries()", function(t) {
	let barChartMultiSeries = d3X3dom.chart.barChartMultiSeries();

	// Test width getter / setter function
	t.equal(barChartMultiSeries.width(), 500, "Default width");
	barChartMultiSeries.width(300);
	t.equal(barChartMultiSeries.width(), 300, "Changed width");

	// Test height getter / setter function
	t.equal(barChartMultiSeries.height(), 500, "Default height");
	barChartMultiSeries.height(300);
	t.equal(barChartMultiSeries.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(barChartMultiSeries.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	barChartMultiSeries.dimensions({ x: 20, y: 20, z: 20 });
	t.deepEqual(barChartMultiSeries.dimensions(), { x: 20, y: 20, z: 20 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(barChartMultiSeries.xScale(), undefined, "Default xScale is undefined");
	barChartMultiSeries.xScale(0.2);
	t.equal(barChartMultiSeries.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(barChartMultiSeries.yScale(), undefined, "Default yScale is undefined");
	barChartMultiSeries.yScale(0.1);
	t.equal(barChartMultiSeries.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(barChartMultiSeries.zScale(), undefined, "Default zScale is undefined");
	barChartMultiSeries.zScale(0.2);
	t.equal(barChartMultiSeries.zScale(), 0.2, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.equal(barChartMultiSeries.colorScale(), undefined, "Default colorScale is undefined");
	barChartMultiSeries.colorScale(2);
	t.equal(barChartMultiSeries.colorScale(), 2, "Changed colorScale is set");

	// Test colors getter / setter function
	t.deepEqual(barChartMultiSeries.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	barChartMultiSeries.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(barChartMultiSeries.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test debug getter / setter function
	t.equal(barChartMultiSeries.debug(), false, "Debug mode is false");
	barChartMultiSeries.debug(true);
	t.equal(barChartMultiSeries.debug(), true, "Debug mode is true");

	t.end();
});

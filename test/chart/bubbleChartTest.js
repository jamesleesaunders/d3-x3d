let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../../");

test("Test Bubble Chart, chart.bubbleChart()", function(t) {
	let bubbleChart = d3X3d.chart.bubbleChart();

	// Test width getter / setter function
	t.equal(bubbleChart.width(), 500, "Default width");
	bubbleChart.width(300);
	t.equal(bubbleChart.width(), 300, "Changed width");

	// Test height getter / setter function
	t.equal(bubbleChart.height(), 500, "Default height");
	bubbleChart.height(300);
	t.equal(bubbleChart.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(bubbleChart.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	bubbleChart.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(bubbleChart.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(bubbleChart.xScale(), undefined, "Default xScale is undefined");
	bubbleChart.xScale(0.2);
	t.equal(bubbleChart.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(bubbleChart.yScale(), undefined, "Default yScale is undefined");
	bubbleChart.yScale(0.1);
	t.equal(bubbleChart.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(bubbleChart.zScale(), undefined, "Default zScale is undefined");
	bubbleChart.zScale(0.2);
	t.equal(bubbleChart.zScale(), 0.2, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.equal(bubbleChart.colorScale(), undefined, "Default colorScale is undefined");
	bubbleChart.colorScale(2);
	t.equal(bubbleChart.colorScale(), 2, "Changed colorScale is set");

	// Test sizeScale getter / setter function
	t.equal(bubbleChart.sizeScale(), undefined, "Default sizeScale is undefined");
	bubbleChart.sizeScale(2);
	t.equal(bubbleChart.sizeScale(), 2, "Changed sizeScale is set");

	// Test sizeRange getter / setter function
	t.deepEqual(bubbleChart.sizeRange(), [0.5, 3.5], "Default sizeRange");
	bubbleChart.sizeRange([0.2, 5.0]);
	t.deepEqual(bubbleChart.sizeRange(), [0.2, 5.0], "Changed sizeRange");

	// Test colors getter / setter function
	t.deepEqual(bubbleChart.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	bubbleChart.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(bubbleChart.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test debug getter / setter function
	t.equal(bubbleChart.debug(), false, "Debug mode is false");
	bubbleChart.debug(true);
	t.equal(bubbleChart.debug(), true, "Debug mode is true");

	t.end();
});

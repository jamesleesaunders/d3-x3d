let test = require('tape');
let window = require('browser-env')();
let d3X3dom = require("../../");

test("Test Bubble Chart, chart.bubbleChart()", function(t) {
	let bubbleChart = d3X3dom.chart.bubbleChart();

	// Test width getter / setter function
	t.deepEqual(bubbleChart.width(), 500, "Default width");
	bubbleChart.width(300);
	t.deepEqual(bubbleChart.width(), 300, "Changed width");

	// Test height getter / setter function
	t.deepEqual(bubbleChart.height(), 500, "Default height");
	bubbleChart.height(300);
	t.deepEqual(bubbleChart.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(bubbleChart.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	bubbleChart.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(bubbleChart.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.deepEqual(bubbleChart.xScale(), undefined, "Default xScale is undefined");
	bubbleChart.xScale(0.2);
	t.deepEqual(bubbleChart.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.deepEqual(bubbleChart.yScale(), undefined, "Default yScale is undefined");
	bubbleChart.yScale(0.1);
	t.deepEqual(bubbleChart.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.deepEqual(bubbleChart.zScale(), undefined, "Default zScale is undefined");
	bubbleChart.zScale(0.2);
	t.deepEqual(bubbleChart.zScale(), 0.2, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.deepEqual(bubbleChart.colorScale(), undefined, "Default colorScale is undefined");
	bubbleChart.colorScale(2);
	t.deepEqual(bubbleChart.colorScale(), 2, "Changed colorScale is set");

	// Test sizeScale getter / setter function
	t.deepEqual(bubbleChart.sizeScale(), undefined, "Default sizeScale is undefined");
	bubbleChart.sizeScale(2);
	t.deepEqual(bubbleChart.sizeScale(), 2, "Changed sizeScale is set");

	// Test sizeDomain getter / setter function
	t.deepEqual(bubbleChart.sizeDomain(), [0.5, 3.5], "Default sizeDdomain");
	bubbleChart.sizeDomain([0.2, 5.0]);
	t.deepEqual(bubbleChart.sizeDomain(), [0.2, 5.0], "Changed sizeDdomain");

	// Test colors getter / setter function
	t.deepEqual(bubbleChart.colors(), ["green", "red", "yellow", "steelblue", "orange"], "Default colors");
	bubbleChart.colors(["orange", "yellow", "red", "steelblue", "green"]);
	t.deepEqual(bubbleChart.colors(), ["orange", "yellow", "red", "steelblue", "green"], "Changed colors");

	// Test debug getter / setter function
	t.deepEqual(bubbleChart.debug(), false, "Debug mode is false");
	bubbleChart.debug(true);
	t.deepEqual(bubbleChart.debug(), true, "Debug mode is true");

	t.end();
});

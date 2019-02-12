let test = require('tape');
let window = require('browser-env')();
let d3 = require('d3');
let d3X3dom = require("../../");

test("Test Vector Field Chart, chart.vectorFieldChart()", function(t) {
	let vectorFieldChart = d3X3dom.chart.vectorFieldChart();

	// Test width getter / setter function
	t.equal(vectorFieldChart.width(), 500, "Default width");
	vectorFieldChart.width(300);
	t.equal(vectorFieldChart.width(), 300, "Changed width");

	// Test height getter / setter function
	t.equal(vectorFieldChart.height(), 500, "Default height");
	vectorFieldChart.height(300);
	t.equal(vectorFieldChart.height(), 300, "Changed height");

	// Test dimensions getter / setter function
	t.deepEqual(vectorFieldChart.dimensions(), { x: 40, y: 40, z: 40 }, "Default dimensions");
	vectorFieldChart.dimensions({ x: 10, y: 20, z: 30 });
	t.deepEqual(vectorFieldChart.dimensions(), { x: 10, y: 20, z: 30 }, "Changed dimensions");

	// Test xScale getter / setter function
	t.equal(vectorFieldChart.xScale(), undefined, "Default xScale is undefined");
	vectorFieldChart.xScale(0.2);
	t.equal(vectorFieldChart.xScale(), 0.2, "Changed xScale is set");

	// Test yScale getter / setter function
	t.equal(vectorFieldChart.yScale(), undefined, "Default yScale is undefined");
	vectorFieldChart.yScale(0.1);
	t.equal(vectorFieldChart.yScale(), 0.1, "Changed yScale is set");

	// Test zScale getter / setter function
	t.equal(vectorFieldChart.zScale(), undefined, "Default zScale is undefined");
	vectorFieldChart.zScale(0.2);
	t.equal(vectorFieldChart.zScale(), 0.2, "Changed zScale is set");

	// Test colorScale getter / setter function
	t.equal(vectorFieldChart.colorScale(), undefined, "Default colorScale is undefined");
	vectorFieldChart.colorScale(2);
	t.equal(vectorFieldChart.colorScale(), 2, "Changed colorScale is set");

	// Test sizeScale getter / setter function
	t.equal(vectorFieldChart.sizeScale(), undefined, "Default sizeScale is undefined");
	vectorFieldChart.sizeScale(2);
	t.equal(vectorFieldChart.sizeScale(), 2, "Changed sizeScale is set");

	// Test sizeDomain getter / setter function
	t.deepEqual(vectorFieldChart.sizeDomain(), [2.0, 5.0], "Default sizeDomain");
	vectorFieldChart.sizeDomain([3.5, 7.0]);
	t.deepEqual(vectorFieldChart.sizeDomain(), [3.5, 7.0], "Changed sizeDomain");

	// Test vectorFunction getter / setter function
	t.equal(typeof vectorFieldChart.vectorFunction(), "function", "Default vectorFunction");
	vectorFieldChart.vectorFunction(() => "Hello World");
	t.equal(vectorFieldChart.vectorFunction()(), "Hello World", "Changed vectorFunction");

	// Test debug getter / setter function
	t.equal(vectorFieldChart.debug(), false, "Debug mode is false");
	vectorFieldChart.debug(true);
	t.equal(vectorFieldChart.debug(), true, "Debug mode is true");

	t.end();
});

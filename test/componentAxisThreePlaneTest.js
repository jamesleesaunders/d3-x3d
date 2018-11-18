/*
 * *
 *  @Joe N Ngigi <joenyugoh at gmail dot com>
 *  @copyright Copyright (C) 2018
 *  @QueBase Tech
 * /
 */

let test = require('tape'),
	d3X3dom = require("../");

test("componentAxisThreePlane()", function(test) {
	let axisThreePlane = d3X3dom.component.axisThreePlane();

	// Test for Getter and setter function for colors
	test.deepEqual(axisThreePlane.colors(), ["blue", "red", "green"], "Returns default color");
	axisThreePlane.colors(["yellow", "blue", "green"]);
	test.deepEqual(axisThreePlane.colors(), ["yellow", "blue", "green"], "Axis colors changed");

	// Test for Getter and setter function for dimensions
	test.deepEqual(axisThreePlane.dimensions(), { x: 40, y: 40, z: 40 }, "Returns default dimensions");
	axisThreePlane.dimensions({ x: 10, y: 20, z: 30 });
	test.deepEqual(axisThreePlane.dimensions(), { x: 10, y: 20, z: 30 }, "Dimensions changed");

	// Test for Getter and setter function for xScale
	test.deepEqual(axisThreePlane.xScale(), undefined, "xScale is undefined");
	axisThreePlane.xScale(0.2);
	test.deepEqual(axisThreePlane.xScale(), 0.2, "xScale changed");

	// Test for Getter and setter function for yScale
	test.deepEqual(axisThreePlane.yScale(), undefined, "yScale is undefined");
	axisThreePlane.yScale(0.1);
	test.deepEqual(axisThreePlane.yScale(), 0.1, "xScale changed");

	// Test for Getter and setter function for zScale
	test.deepEqual(axisThreePlane.zScale(), undefined, "zScale is undefined");
	axisThreePlane.zScale(0.2);
	test.deepEqual(axisThreePlane.zScale(), 0.2, "zScale changed");

	// Test for Getter and setter function for color Scale
	test.deepEqual(axisThreePlane.colorScale(), undefined, "colorScale is undefined");
	axisThreePlane.colorScale(2);
	test.deepEqual(axisThreePlane.colorScale(), 2, "colorScale changed");
	test.end();
});

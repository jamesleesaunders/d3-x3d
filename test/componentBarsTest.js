let d3X3dom = require("../");
let tape = require("tape");

tape("Test Bars Component Base", function(test) {
	let bars = d3X3dom.component.bars();

	test.deepEqual(bars.dimensions(), { x: 40, y: 40, z: 2 }, "Returns default dimensions");
	test.deepEqual(bars.colors(), ["orange", "red", "yellow", "steelblue", "green"], "Returns default colors");

	test.end();
});

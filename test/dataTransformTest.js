import test from "mocha";
import * as chai from "chai";
import * as d3 from "d3";
import d3X3d from "../index.js"

import { createSVGWindow } from "svgdom";
global.document = createSVGWindow().document;

// import dataTransform from "../src/dataTransform.js";
let dataTransform = d3X3d.dataTransform;

let dataset1 = {
	key: "UK",
	values: [
		{ key: "Apples", value: 9.11, x: 1, y: 5, z: 2 },
		{ key: "Oranges", value: 3.32, x: 2, y: 3, z: 4 },
		{ key: "Pears", value: 5.5, x: 3, y: 3, z: 3 },
		{ key: "Bananas", value: 7.0, x: 6, y: 0, z: 1 }
	]
};

let dataset2 = [{
	key: "UK",
	values: [
		{ key: "Apples", value: 9.11, x: 1, y: 5, z: 2 },
		{ key: "Oranges", value: 3.32, x: 2, y: 3, z: 4 },
		{ key: "Pears", value: 5.5, x: 3, y: 3, z: 3 },
		{ key: "Bananas", value: 7.0, x: 6, y: 0, z: 1 }
	]
}, {
	key: "France",
	values: [
		{ key: "Apples", value: 2.02, x: 2, y: 7, z: 3 },
		{ key: "Oranges", value: 10.14, x: 1, y: 1, z: 8 },
		{ key: "Pears", value: 0, x: 9, y: 12, z: 4 },
		{ key: "Bananas", value: 12.1, x: 1, y: 9, z: 7 }
	]
}, {
	key: "Spain",
	values: [
		{ key: "Apples", value: 18.3, x: 3, y: 3, z: 16 },
		{ key: "Oranges", value: 2.121, x: 9, y: 3, z: 1 },
		{ key: "Pears", value: 8.6, x: 5, y: 2, z: 10 },
		{ key: "Bananas", value: 2.0, x: 1, y: 2, z: 10 }
	]
}, {
	key: "Germany",
	values: [
		{ key: "Apples", value: 5.55, x: 4, y: 4, z: 4 },
		{ key: "Oranges", value: 3.326, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 3.01, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 9.02, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Italy",
	values: [
		{ key: "Apples", value: 7.001, x: 5, y: 1, z: 9 },
		{ key: "Oranges", value: 4.2, x: 0, y: 9, z: 6 },
		{ key: "Pears", value: 6.3, x: 4, y: 2, z: 2 },
		{ key: "Bananas", value: 7.5, x: 3, y: 2, z: 1 }
	]
}, {
	key: "Portugal",
	values: [
		{ key: "Apples", value: 2, x: 3, y: 6, z: 16 },
		{ key: "Oranges", value: 5.1, x: 2, y: 4, z: 22 },
		{ key: "Pears", value: 10.02, x: 7, y: 8, z: 9 },
		{ key: "Bananas", value: 4.7, x: 9, y: 8, z: 7 }
	]
}];

let dataset3 = [{
	key: "Apples",
	values: [
		{ key: "UK", value: 9.11, x: 1, y: 5, z: 2 },
		{ key: "France", value: 2.02, x: 2, y: 7, z: 3 },
		{ key: "Spain", value: 18.3, x: 3, y: 3, z: 16 },
		{ key: "Germany", value: 5.55, x: 4, y: 4, z: 4 },
		{ key: "Italy", value: 7.001, x: 5, y: 1, z: 9 },
		{ key: "Portugal", value: 2, x: 3, y: 6, z: 16 }
	]
}, {
	key: "Oranges",
	values: [
		{ key: "UK", value: 3.32, x: 2, y: 3, z: 4 },
		{ key: "France", value: 10.14, x: 1, y: 1, z: 8 },
		{ key: "Spain", value: 2.121, x: 9, y: 3, z: 1 },
		{ key: "Germany", value: 3.326, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 4.2, x: 0, y: 9, z: 6 },
		{ key: "Portugal", value: 5.1, x: 2, y: 4, z: 22 }
	]
}, {
	key: "Pears",
	values: [
		{ key: "UK", value: 5.5, x: 3, y: 3, z: 3 },
		{ key: "France", value: 0, x: 9, y: 12, z: 4 },
		{ key: "Spain", value: 8.6, x: 5, y: 2, z: 10 },
		{ key: "Germany", value: 3.01, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 6.3, x: 4, y: 2, z: 2 },
		{ key: "Portugal", value: 10.02, x: 7, y: 8, z: 9 }
	]
}, {
	key: "Bananas",
	values: [
		{ key: "UK", value: 7, x: 6, y: 0, z: 1 },
		{ key: "France", value: 12.1, x: 1, y: 9, z: 7 },
		{ key: "Spain", value: 2, x: 1, y: 2, z: 10 },
		{ key: "Germany", value: 9.02, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 7.5, x: 3, y: 2, z: 1 },
		{ key: "Portugal", value: 4.7, x: 9, y: 8, z: 7 }
	]
}];

test.describe("Test Summary Single Dimension", function() {
	let actual = dataTransform(dataset1).summary();
	let expected = {
		dataType: 1,
		rowKey: "UK",
		rowTotal: 24.93,
		columnKeys: ["Apples", "Oranges", "Pears", "Bananas"],
		valueMin: 3.32,
		valueMax: 9.11,
		valueExtent: [3.32, 9.11],
		coordinatesMin: { x: 1, y: 0, z: 1 },
		coordinatesMax: { x: 6, y: 5, z: 4 },
		coordinatesExtent: { x: [1, 6], y: [0, 5], z: [1, 4] },
		maxDecimalPlace: 2,
		thresholds: [4.19, 5.64, 6.5, 8.53],
		rowValuesKeys: ["key", "value", "x", "y", "z"]
	};
	test.it("should be equivalent", function(done) {
		chai.expect(actual).to.be.deep.equal(expected);
		done();
	});
});

test.describe("Test Summary Multi Dimension", function() {
	let actual = dataTransform(dataset2).summary();
	let expected = {
		dataType: 2,
		rowKeys: ["UK", "France", "Spain", "Germany", "Italy", "Portugal"],
		rowTotals: {
			UK: 24.93,
			France: 24.259999999999998,
			Spain: 31.021,
			Germany: 20.906,
			Italy: 25.001,
			Portugal: 21.819999999999997
		},
		rowTotalsMax: 31.021,
		columnKeys: ["Apples", "Oranges", "Pears", "Bananas"],
		columnTotals: {
			Apples: 43.980999999999995,
			Oranges: 28.207,
			Pears: 33.43,
			Bananas: 42.32000000000001
		},
		columnTotalsMax: 43.980999999999995,
		valueMin: 0,
		valueMax: 18.3,
		valueExtent: [0, 18.3],
		coordinatesMin: { x: 0, y: 0, z: 1 },
		coordinatesMax: { x: 9, y: 12, z: 22 },
		coordinatesExtent: { x: [0, 9], y: [0, 12], z: [1, 22] },
		maxDecimalPlace: 3,
		thresholds: [2.745, 7.32, 10.065, 16.47],
		rowValuesKeys: ["key", "value", "x", "y", "z"]
	};
	test.it("should be equivalent", function(done) {
		chai.expect(actual).to.be.deep.equal(expected);
		done();
	});
});

test.describe("Test Rotate", function() {
	test.it("should return Dataset 3", function(done) {
		chai.expect(dataTransform(dataset2).rotate()).to.be.deep.equal(dataset3);
		done();
	});
	test.it("should return Dataset 2", function(done) {
		chai.expect(dataTransform(dataset3).rotate()).to.be.deep.equal(dataset2);
		done();
	});
});

test.describe("Test Stacker", function() {
	let data = {
		key: "Cheeses",
		values: [
			{ key: "Cheddar", value: 1.5 },
			{ key: "Edam", value: 2.0 },
			{ key: "Wensleydale", value: 3.2 }
		]
	}
	let expect = {
		key: "Cheeses",
		values: [
			{ key: "Cheddar", value: 1.5, y0: 0, y1: 1.5 },
			{ key: "Edam", value: 2.0, y0: 1.5, y1: 3.5 },
			{ key: "Wensleydale", value: 3.2, y0: 3.5, y1: 6.7 }
		]
	}
	test.it("should return stacked values", function(done) {
		chai.expect(dataTransform(data).stacked()).to.be.deep.equal(expect);
		done();
	});
});

test.describe("Test Curve", function() {
	const actual = dataTransform(dataset1).smooth(d3.curveMonotoneX, 10);
	const expected = {
		key: "UK",
		values: [
			{ key: 1, value: 9.103022569083706 },
			{ key: 2, value: 6.58532040849479 },
			{ key: 3, value: 4.523589199972466 },
			{ key: 4, value: 3.402969473977448 },
			{ key: 5, value: 3.486248497717562 },
			{ key: 6, value: 4.176387038531816 },
			{ key: 7, value: 5.033513043547716 },
			{ key: 8, value: 5.676456068597839 },
			{ key: 9, value: 6.168354377140601 },
			{ key: 10, value: 6.595825099518567 }
		]
	};

	test.it("should return smoothed curve", function(done) {
		chai.expect(actual).to.be.deep.equal(expected);
		done();
	});
});


/* Custom Test for Reddit user pranavk26 */

let dataset4 = [
	{ row: 1, column: 1, val: 2 },
	{ row: 3, column: 1, val: 4 },
	{ row: 1, column: 3, val: 7 },
	{ row: 1, column: 4, val: 2 },
	{ row: 1, column: 5, val: 4 },
	{ row: 3, column: 2, val: 7 },
	// { row: 2, column: 1, val: 7 },
	// { row: 2, column: 2, val: 2 },
	{ row: 2, column: 3, val: 4 },
	{ row: 2, column: 4, val: 7 },
	{ row: 2, column: 5, val: 2 },
	{ row: 3, column: 3, val: 2 },
	// { row: 3, column: 4, val: 4 },
	{ row: 1, column: 2, val: 4 },
	{ row: 3, column: 5, val: 7 }
];

let formatData = Array.from(d3.rollup(
	dataset4.sort((a, b) => +a.row - +b.row),
	(d) => ({
		key: String(d[0].row),
		values: Array.from(d3.rollup(
			d.sort((a, b) => +a.column - +b.column),
			(d) => ({ key: String(d[0].column), value: d[0].val }),
			(d) => d.column).values())
	}),
	(d) => d.row
).values());

test.describe("Test rowKeys remain in order", function() {
	let actual = dataTransform(formatData).summary().rowKeys;
	let expected = ["1", "2", "3"];

	test.it("should be equivalent", function(done) {
		chai.expect(actual).to.be.deep.equal(expected);
		done();
	});
});

test.describe("Test columnKeys remain in order", function() {
	let actual = dataTransform(formatData).summary().columnKeys;
	let expected = ["1", "2", "3", "4", "5"];

	test.it("should be equivalent", function(done) {
		chai.expect(actual).to.be.deep.equal(expected);
		done();
	});
});

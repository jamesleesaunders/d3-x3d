let test = require("tape");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3dom = require("../");

let dataset1 = {
	key: "Fruit",
	values: [
		{ key: "Apples", value: 9, x: 1, y: 1, z: 1 },
		{ key: "Oranges", value: 3, x: 2, y: 2, z: 2 },
		{ key: "Pears", value: 5, x: 3, y: 3, z: 3 },
		{ key: "Bananas", value: 7, x: 4, y: 4, z: 4 }
	]
};

let dataset2 = [{
	key: "Apples",
	values: [
		{ key: "UK", value: 9, x: 1, y: 1, z: 1 },
		{ key: "France", value: 2, x: 2, y: 2, z: 2 },
		{ key: "Spain", value: 18, x: 3, y: 3, z: 3 },
		{ key: "Germany", value: 5, x: 4, y: 4, z: 4 },
		{ key: "Italy", value: 7, x: 5, y: 5, z: 5 },
		{ key: "Portugal", value: 2, x: 6, y: 6, z: 6 }
	]
}, {
	key: "Oranges",
	values: [
		{ key: "UK", value: 10, x: 1, y: 1, z: 1 },
		{ key: "France", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 2, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 4, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 5, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Pears",
	values: [
		{ key: "UK", value: 18, x: 1, y: 1, z: 1 },
		{ key: "France", value: 0, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 8, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 6, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 10, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Bananas",
	values: [
		{ key: "UK", value: 13, x: 1, y: 1, z: 1 },
		{ key: "France", value: 12, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 2, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 9, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 7, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 4, x: 1, y: 1, z: 1 }
	]
}];

let dataset3 = [{
	key: "UK",
	values: [
		{ key: "Apples", value: 9, x: 1, y: 1, z: 1 },
		{ key: "Oranges", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 18, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 13, x: 1, y: 1, z: 1 }
	]
}, {
	key: "France",
	values: [
		{ key: "Apples", value: 2, x: 2, y: 2, z: 2 },
		{ key: "Oranges", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 0, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 12, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Spain",
	values: [
		{ key: "Apples", value: 18, x: 3, y: 3, z: 3 },
		{ key: "Oranges", value: 2, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 8, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 2, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Germany",
	values: [
		{ key: "Apples", value: 5, x: 4, y: 4, z: 4 },
		{ key: "Oranges", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 9, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Italy",
	values: [
		{ key: "Apples", value: 7, x: 5, y: 5, z: 5 },
		{ key: "Oranges", value: 4, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 6, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 7, x: 1, y: 1, z: 1 }
	]
}, {
	key: "Portugal",
	values: [
		{ key: "Apples", value: 2, x: 6, y: 6, z: 6 },
		{ key: "Oranges", value: 5, x: 1, y: 1, z: 1 },
		{ key: "Pears", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 4, x: 1, y: 1, z: 1 }
	]
}];

test("Test Summary Single Dimension", function(t) {
	let actual = d3X3dom.dataTransform(dataset1).summary();
	let expected = {
		dataType: 1,
		rowKey: "Fruit",
		rowTotal: 24,
		rowKeys: undefined,
		rowTotals: undefined,
		rowTotalsMax: undefined,
		rowValuesKeys: ["key", "value", "x", "y", "z"],
		columnKeys: ["Apples", "Oranges", "Pears", "Bananas"],
		columnTotals: undefined,
		columnTotalsMax: undefined,
		valueMin: 3,
		valueMax: 9,
		valueExtent: [3, 9],
		coordinatesMin: { x: 1, y: 1, z: 1 },
		coordinatesMax: { x: 4, y: 4, z: 4 },
		coordinatesExtent: { x: [1, 4], y: [1, 4], z: [1, 4] },
		maxDecimalPlace: 0,
		thresholds: [4, 5, 6, 8]
	};
	t.deepEqual(actual, expected);

	t.end();
});

test("Test Summary Multi Dimension", function(t) {
	let actual = d3X3dom.dataTransform(dataset2).summary();
	let expected = {
		dataType: 2,
		rowKey: undefined,
		rowTotal: undefined,
		rowKeys: ["Apples", "Oranges", "Pears", "Bananas"],
		rowTotals: { Apples: 43, Oranges: 34, Pears: 45, Bananas: 47 },
		rowTotalsMax: 47,
		rowValuesKeys: ["key", "value", "x", "y", "z"],
		columnKeys: ["UK", "France", "Spain", "Germany", "Italy", "Portugal"],
		columnTotals: { UK: 50, France: 24, Spain: 30, Germany: 20, Italy: 24, Portugal: 21 },
		columnTotalsMax: 50,
		valueMin: 0,
		valueMax: 18,
		valueExtent: [0, 18],
		coordinatesMin: { x: 1, y: 1, z: 1 },
		coordinatesMax: { x: 6, y: 6, z: 6 },
		coordinatesExtent: { x: [1, 6], y: [1, 6], z: [1, 6] },
		maxDecimalPlace: 0,
		thresholds: [3, 7, 10, 16]
	};
	t.deepEqual(actual, expected);

	t.end();
});

test("Test Rotate", function(t) {
	t.deepEqual(d3X3dom.dataTransform(dataset2).rotate(), dataset3);
	t.deepEqual(d3X3dom.dataTransform(dataset3).rotate(), dataset2);

	t.end();
});

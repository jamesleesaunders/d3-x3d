let d3X3dom = require("../");
let tape = require("tape");

let dataset1 = {
	key: "Fruit",
	values: [
		{ key: "Apples", value: 9, x: 1, y: 1, z: 1 },
		{ key: "Oranges", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Grapes", value: 5, x: 1, y: 1, z: 1 },
		{ key: "Bananas", value: 7, x: 1, y: 1, z: 1 }
	]
};

let dataset2 = [{
	key: "2000",
	values: [
		{ key: "UK", value: 9, x: 1, y: 1, z: 1 },
		{ key: "France", value: 2, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 18, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 5, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 7, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 2, x: 1, y: 1, z: 1 }
	]
}, {
	key: "2001",
	values: [
		{ key: "UK", value: 10, x: 1, y: 1, z: 1 },
		{ key: "France", value: 10, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 2, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 4, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 5, x: 1, y: 1, z: 1 }
	]
}, {
	key: "2002",
	values: [
		{ key: "UK", value: 18, x: 1, y: 1, z: 1 },
		{ key: "France", value: 0, x: 1, y: 1, z: 1 },
		{ key: "Spain", value: 8, x: 1, y: 1, z: 1 },
		{ key: "Germany", value: 3, x: 1, y: 1, z: 1 },
		{ key: "Italy", value: 6, x: 1, y: 1, z: 1 },
		{ key: "Portugal", value: 10, x: 1, y: 1, z: 1 }
	]
}, {
	key: "2003",
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
	key: 'UK',
	values: [
		{ key: '2000', value: 9, x: 1, y: 1, z: 1 },
		{ key: '2001', value: 10, x: 1, y: 1, z: 1 },
		{ key: '2002', value: 18, x: 1, y: 1, z: 1 },
		{ key: '2003', value: 13, x: 1, y: 1, z: 1 }
	]
}, {
	key: 'France',
	values: [
		{ key: '2000', value: 2, x: 1, y: 1, z: 1 },
		{ key: '2001', value: 10, x: 1, y: 1, z: 1 },
		{ key: '2002', value: 0, x: 1, y: 1, z: 1 },
		{ key: '2003', value: 12, x: 1, y: 1, z: 1 }
	]
}, {
	key: 'Spain',
	values: [
		{ key: '2000', value: 18, x: 1, y: 1, z: 1 },
		{ key: '2001', value: 2, x: 1, y: 1, z: 1 },
		{ key: '2002', value: 8, x: 1, y: 1, z: 1 },
		{ key: '2003', value: 2, x: 1, y: 1, z: 1 }
	]
}, {
	key: 'Germany',
	values: [
		{ key: '2000', value: 5, x: 1, y: 1, z: 1 },
		{ key: '2001', value: 3, x: 1, y: 1, z: 1 },
		{ key: '2002', value: 3, x: 1, y: 1, z: 1 },
		{ key: '2003', value: 9, x: 1, y: 1, z: 1 }
	]
}, {
	key: 'Italy',
	values: [
		{ key: '2000', value: 7, x: 1, y: 1, z: 1 },
		{ key: '2001', value: 4, x: 1, y: 1, z: 1 },
		{ key: '2002', value: 6, x: 1, y: 1, z: 1 },
		{ key: '2003', value: 7, x: 1, y: 1, z: 1 }
	]
}, {
	key: 'Portugal',
	values: [
		{ key: '2000', value: 2, x: 1, y: 1, z: 1 },
		{ key: '2001', value: 5, x: 1, y: 1, z: 1 },
		{ key: '2002', value: 10, x: 1, y: 1, z: 1 },
		{ key: '2003', value: 4, x: 1, y: 1, z: 1 }
	]
}];

tape("Test Summary 1", function(t) {
	let actual = d3X3dom.dataTransform(dataset1).summary();
	let expected = {
		dataStructure: 1,
		rowKey: "Fruit",
		rowTotal: 24,
		rowKeys: undefined,
		rowTotals: undefined,
		rowTotalsMax: undefined,
		columnKeys: ["Apples", "Oranges", "Grapes", "Bananas"],
		columnTotals: undefined,
		columnTotalsMax: undefined,
		minValue: 3,
		maxValue: 9,
		maxCoordinates: { x: 1, y: 1, z: 1 },
		maxDecimalPlace: 0,
		thresholds: [4, 5, 6, 8]
	};
	t.deepEqual(actual, expected);

	t.end();
});

tape("Test Summary 2", function(t) {
	let actual = d3X3dom.dataTransform(dataset2).summary();
	let expected = {
		dataStructure: 2,
		rowKey: undefined,
		rowTotal: undefined,
		rowKeys: ["2000", "2001", "2002", "2003"],
		rowTotals: { 2000: 43, 2001: 34, 2002: 45, 2003: 47 },
		rowTotalsMax: 47,
		columnKeys: ["UK", "France", "Spain", "Germany", "Italy", "Portugal"],
		columnTotals: { UK: 50, France: 24, Spain: 30, Germany: 20, Italy: 24, Portugal: 21 },
		columnTotalsMax: 50,
		minValue: 0,
		maxValue: 18,
		maxCoordinates: { x: 1, y: 1, z: 1 },
		maxDecimalPlace: 0,
		thresholds: [3, 7, 10, 16]
	};
	t.deepEqual(actual, expected);

	t.end();
});

tape("Test Rotate", function(t) {
	t.deepEqual(d3X3dom.dataTransform(dataset2).rotate(), dataset3);
	t.deepEqual(d3X3dom.dataTransform(dataset3).rotate(), dataset2);

	t.end();
});

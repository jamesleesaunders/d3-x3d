let test = require("mocha");
let chai = require("chai");
let window = require("browser-env")();
let d3 = require("d3");
let d3X3d = require("../");

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
	let actual = d3X3d.dataTransform(dataset1).summary();
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
	let actual = d3X3d.dataTransform(dataset2).summary();
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
		chai.expect(d3X3d.dataTransform(dataset2).rotate()).to.be.deep.equal(dataset3);
		done();
	});
	test.it("should return Dataset 2", function(done) {
		chai.expect(d3X3d.dataTransform(dataset3).rotate()).to.be.deep.equal(dataset2);
		done();
	});
});










/* Custom Test for Reddit user pranavk26 */

function groupBy(array, f) {
	var groups = {};
	array.forEach(function(o) {
		var group = JSON.stringify(f(o));
		groups[group] = groups[group] || [];
		groups[group].push(o);
	});
	return Object.keys(groups).map(function(group) {
		return groups[group];
	})
}

function sortByRow(array) {
	return array.sort(function(a, b) {
		var x = a.row;
		var y = b.row;
		return ((x < y) ? -1 : ((x > y ? 1 : 0)));
	});
}

function sortByColumn(array) {
	return array.sort(function(a, b) {
		var x = a.column;
		var y = b.column;
		return ((x < y) ? -1 : ((x > y ? 1 : 0)));
	});
}

function arrToJSON(array) {
	var result = [];
	sortByRow(array);
	var columns = groupBy(array, function(item) {
		return [item.row];
	});
	for (var a = 0; a < columns.length; a++) {
		sortByColumn(columns[a]);
		result.push({ key: columns[a][0]['row'].toString(), values: [] });
		for (var b = 0; b < columns[a].length; b++) {
			result[a]['values'].push({ key: columns[a][b]['column'].toString(), value: columns[a][b]['val'] });
		}
	}
	return result;
}

var data = [
	{ row: 1, column: 1, val: 2 },
	{ row: 1, column: 2, val: 4 },
	{ row: 1, column: 3, val: 7 },
	{ row: 1, column: 4, val: 2 },
	{ row: 1, column: 5, val: 4 },
	{ row: 1, column: 6, val: 7 },
	{ row: 1, column: 7, val: 2 },
	{ row: 1, column: 8, val: 4 },
	{ row: 1, column: 9, val: 7 },
	{ row: 1, column: 10, val: 2 },
	{ row: 1, column: 11, val: 4 },
	{ row: 1, column: 12, val: 7 },
	{ row: 1, column: 13, val: 2 },
	{ row: 1, column: 14, val: 4 },
	{ row: 1, column: 15, val: 7 },
	{ row: 1, column: 16, val: 2 },
	{ row: 1, column: 17, val: 4 },
	{ row: 1, column: 18, val: 7 },
	{ row: 1, column: 19, val: 2 },
	{ row: 1, column: 20, val: 4 },
	{ row: 1, column: 21, val: 7 },
	{ row: 1, column: 22, val: 2 },
	{ row: 1, column: 23, val: 4 },
	{ row: 1, column: 24, val: 7 },
	{ row: 2, column: 1, val: 2 },
	{ row: 2, column: 2, val: 4 },
	{ row: 2, column: 3, val: 7 },
	{ row: 2, column: 4, val: 2 },
	{ row: 2, column: 5, val: 4 },
	{ row: 2, column: 6, val: 7 },
	{ row: 2, column: 7, val: 2 },
	{ row: 2, column: 8, val: 4 },
	{ row: 2, column: 9, val: 7 },
	{ row: 2, column: 10, val: 2 },
	{ row: 2, column: 11, val: 4 },
	{ row: 2, column: 12, val: 7 },
	{ row: 2, column: 13, val: 2 },
	{ row: 2, column: 14, val: 4 },
	{ row: 2, column: 15, val: 7 },
	{ row: 2, column: 16, val: 2 },
	{ row: 2, column: 17, val: 4 },
	{ row: 2, column: 18, val: 7 },
	{ row: 2, column: 19, val: 2 },
	{ row: 2, column: 20, val: 4 },
	{ row: 2, column: 21, val: 7 },
	{ row: 2, column: 22, val: 2 },
	{ row: 2, column: 23, val: 4 },
	{ row: 2, column: 24, val: 7 },
	{ row: 2, column: 25, val: 2 },
];

let formatData = arrToJSON(data);

test.describe("Test columnKeys remain in order", function() {
	let actual = d3X3d.dataTransform(formatData).summary().columnKeys;
	let expected = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25"];

	test.it("should be equivalent", function(done) {
		chai.expect(actual).to.be.deep.equal(expected);
		done();
	});
});

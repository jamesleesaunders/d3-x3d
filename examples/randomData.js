/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv3
 */
"use strict";

var countries = ["UK", "France", "Spain", "Germany", "Italy", "Portugal"];
var fruit = ["Apples", "Oranges", "Pears", "Kiwis"];

/**
 * Random Number Generator between 1 and 10
 *
 * @returns {number}
 */
function randomNum() {
	return Math.floor(Math.random() * 10) + 1;
}

/**
 * Random Dataset - Single Series
 *
 * @returns {{key: string, values: (Array|{key: string, value: number, x: number, y: number, z: number}[])}}
 */
function randomDataset1() {
	var data = {
		key: "Fruit",
		values: fruit.map(function(d) {
			return {
				key: d,
				value: randomNum(),
				x: randomNum(),
				y: randomNum(),
				z: randomNum()
			};
		})
	};

	return data;
}

/**
 * Random Dataset - Multi Series
 *
 * @returns {Array|{key: string, values: (Array|{key: string, value: number, x: number, y: number, z: number}[])}[]}
 */
function randomDataset2() {
	var data = countries.map(function(d) {
		return {
			key: d,
			values: fruit.map(function(d) {
				return {
					key: d,
					value: randomNum(),
					x: randomNum(),
					y: randomNum(),
					z: randomNum()
				};
			})
		}
	});

	return data;
}

/**
 * Random Dataset - Single Series ScatterPlot
 *
 * @returns {{key: string, values: (Array|{key: string, value: number, x: number, y: number, z: number}[])}[]}
 */
function randomDataset3() {
	var n = 100;
	var data = {
		key: "Fruit",
		values: d3.range(n).map(function(d, i) {
			return {
				key: i,
				value: randomNum(),
				x: randomNum(),
				y: randomNum(),
				z: randomNum()
			};
		})
	};

	return data;
}

/**
 * Random Dataset - Surface Area 2
 *
 * @returns {*}
 */
function randomDataset4() {
	var data = [
		{
			key: 'a',
			values: [
				{ key: '1', value: 4 },
				{ key: '2', value: 0 },
				{ key: '3', value: 2 },
				{ key: '4', value: 0 },
				{ key: '5', value: 0 }
			]
		}, {
			key: 'b',
			values: [
				{ key: '1', value: 4 },
				{ key: '2', value: 0 },
				{ key: '3', value: 2 },
				{ key: '4', value: 0 },
				{ key: '5', value: 0 }
			]
		}, {
			key: 'c',
			values: [
				{ key: '1', value: 1 },
				{ key: '2', value: 0 },
				{ key: '3', value: 1 },
				{ key: '4', value: 0 },
				{ key: '5', value: 0 }
			]
		}, {
			key: 'd',
			values: [
				{ key: '1', value: 4 },
				{ key: '2', value: 0 },
				{ key: '3', value: 2 },
				{ key: '4', value: 0 },
				{ key: '5', value: 0 }
			]
		}, {
			key: 'e',
			values: [
				{ key: '1', value: 1 },
				{ key: '2', value: 1 },
				{ key: '3', value: 1 },
				{ key: '4', value: 1 },
				{ key: '5', value: 1 }
			]
		}
	];

	return data;
}

/**
 * Random Dataset - Surface Area
 *
 * @returns {*}
 */
function randomDataset5() {
	var cx = 0.8;
	var cy = 0.3;
	var f = function(vx, vz) {
		return ((vx - cx) * (vx - cx) + (vz - cy) * (vx - cx)) * Math.random();
	};

	var xRange = d3.range(0, 1.05, 0.1);
	var zRange = d3.range(0, 1.05, 0.1);
	var nx = xRange.length;
	var nz = zRange.length;

	var data = d3.range(nx).map(function(i) {

		var values = d3.range(nz).map(
			function(j) {
				return {
					key: j,
					value: f(xRange[i], zRange[j])
				};
			});

		return {
			key: i,
			values: values
		};
	});

	return data;
}

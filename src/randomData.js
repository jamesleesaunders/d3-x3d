import * as d3 from "d3";

/**
 * List of Countries
 *
 * @type {Array}
 */
export const countries = ["UK", "France", "Spain", "Germany", "Italy", "Portugal"];

/**
 * List of Fruit
 *
 * @type {Array}
 */
export const fruit = ["Apples", "Oranges", "Pears", "Bananas"];

/**
 * Random Number Generator between 1 and 10
 *
 * @returns {number}
 */
export function randomNum() {
	return Math.floor(Math.random() * 10) + 1;
}

/**
 * Random Dataset - Single Series
 *
 * @returns {Array}
 */
export function dataset1() {
	let data = {
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
 * @returns {Array}
 */
export function dataset2() {
	let data = countries.map(function(d) {
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
 * Random Dataset - Single Series Scatter Plot
 *
 * @param {number} points - Number of data points.
 * @returns {Array}
 */
export function dataset3(points = 10) {
	let data = {
		key: "Bubbles",
		values: d3.range(points).map(function(d, i) {
			return {
				key: "Point" + i,
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
 * Random Dataset - Single Series Scatter Plot (with size and color values)
 *
 * @param {number} points - Number of data points.
 * @returns {Array}
 */
export function dataset6(points = 10) {
	let data = {
		key: "Bubbles",
		values: d3.range(points).map(function(d, i) {
			return {
				key: "Point" + i,
				values: [
					{ key: "x", value: randomNum() },
					{ key: "y", value: randomNum() },
					{ key: "z", value: randomNum() },
					{ key: "size", value: randomNum() },
					{ key: "color", value: randomNum() }
				]
			};
		})
	};

	return data;
}

/**
 * Random Dataset - Surface Plot 1
 *
 * @returns {Array}
 */
export function dataset4() {
	let data = [
		{
			key: "a",
			values: [
				{ key: "1", value: 4 },
				{ key: "2", value: 0 },
				{ key: "3", value: 2 },
				{ key: "4", value: 0 },
				{ key: "5", value: 0 }
			]
		}, {
			key: "b",
			values: [
				{ key: "1", value: 4 },
				{ key: "2", value: 0 },
				{ key: "3", value: 2 },
				{ key: "4", value: 0 },
				{ key: "5", value: 0 }
			]
		}, {
			key: "c",
			values: [
				{ key: "1", value: 1 },
				{ key: "2", value: 0 },
				{ key: "3", value: 1 },
				{ key: "4", value: 0 },
				{ key: "5", value: 0 }
			]
		}, {
			key: "d",
			values: [
				{ key: "1", value: 4 },
				{ key: "2", value: 0 },
				{ key: "3", value: 2 },
				{ key: "4", value: 0 },
				{ key: "5", value: 0 }
			]
		}, {
			key: "e",
			values: [
				{ key: "1", value: 1 },
				{ key: "2", value: 1 },
				{ key: "3", value: 1 },
				{ key: "4", value: 1 },
				{ key: "5", value: 1 }
			]
		}
	];

	return data;
}

/**
 * Random Dataset - Surface Plot 2
 *
 * @returns {Array}
 */
export function dataset5() {
	let cx = 0.8;
	let cy = 0.3;
	let f = function(vx, vz) {
		return ((vx - cx) * (vx - cx) + (vz - cy) * (vx - cx)) * Math.random();
	};

	let xRange = d3.range(0, 1.05, 0.1);
	let zRange = d3.range(0, 1.05, 0.1);
	let nx = xRange.length;
	let nz = zRange.length;

	let data = d3.range(nx).map(function(i) {

		let values = d3.range(nz).map(
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

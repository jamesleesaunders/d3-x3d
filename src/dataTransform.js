import * as d3 from "d3";
import * as d3Interpolate from "d3-interpolate-curve";

/**
 * Data Transform
 *
 * @module
 * @returns {Object}
 */
export default function dataTransform(data) {

	const SINGLE_SERIES = 1;
	const MULTI_SERIES = 2;
	const coordinates = ["x", "y", "z"];

	/**
	 * Data Type (Single or Multi Series)
	 *
	 * @param data
	 */
	const dataType = function(data) {
		return data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;
	};

	/************* HELPER FUNCTIONS *******************/

	/**
	 * Union Two Arrays
	 *
	 * @private
	 * @param {Array} array1 - First Array.
	 * @param {Array} array2 - Second Array.
	 * @returns {Array}
	 */
	const union = function(array1, array2) {
		const ret = [];
		let arr;

		if (array1.length > array2.length) {
			arr = array2.concat(array1);
		} else {
			arr = array1.concat(array2);
		}

		let len = arr.length;
		const assoc = {};

		while (len--) {
			const item = arr[len];

			if (!assoc[item]) {
				ret.unshift(item);
				assoc[item] = true;
			}
		}

		return ret;
	};

	/**
	 * How Many Decimal Places?
	 *
	 * @private
	 * @param {number} num - Float Number.
	 * @returns {number}
	 */
	const decimalPlaces = function(num) {
		const match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) {
			return 0;
		}

		return Math.max(
			0,
			// Number of digits right of decimal point.
			(match[1] ? match[1].length : 0)
			// Adjust for scientific notation.
			-
			(match[2] ? +match[2] : 0)
		);
	};

	/************* SINGLE SERIES FUNCTIONS ************/

	/**
	 * Row Key (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleRowKey = function(data) {
		return d3.values(data)[0];
	};

	/**
	 * Row Total (Single Series)
	 *
	 * @returns {number}
	 */
	const singleRowTotal = function(data) {
		return d3.sum(data.values, (d) => d.value);
	};

	/**
	 * Row Value Keys (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleRowValueKeys = function(data) {
		return data.values.length ? Object.keys(data.values[0]) : [];
	};

	/**
	 * Column Keys (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleColumnKeys = function(data) {
		return d3.values(data.values).map((d) => d.key);
	};

	/**
	 * Value Min (Single Series)
	 *
	 * @returns {number}
	 */
	const singleValueMin = function(data) {
		return d3.min(data.values, (d) => +d.value);
	};

	/**
	 * Value Max (Single Series)
	 *
	 * @returns {number}
	 */
	const singleValueMax = function(data) {
		return d3.max(data.values, (d) => +d.value);
	};

	/**
	 * Value Extent (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleValueExtent = function(data) {
		return d3.extent(data.values, (d) => +d.value);
	};

	/**
	 * Coordinates Min (Single Series)
	 *
	 * @returns {Object}
	 */
	const singleCoordinatesMin = function(data) {
		return coordinates.reduce((maximums, coord) => {
			maximums[coord] = d3.min(data.values, (d) => +d[coord]);
			return maximums;
		}, {});
	};

	/**
	 * Coordinates Max (Single Series)
	 *
	 * @returns {Object}
	 */
	const singleCoordinatesMax = function(data) {
		return coordinates.reduce((maximums, coord) => {
			maximums[coord] = d3.max(data.values, (d) => +d[coord]);
			return maximums;
		}, {});
	};

	/**
	 * Coordinates Extent (Single Series)
	 *
	 * @returns {Object}
	 */
	const singleCoordinatesExtent = function(data) {
		return coordinates.reduce((extents, coord) => {
			extents[coord] = d3.extent(data.values, (d) => +d[coord]);
			return extents;
		}, {});
	};

	/**
	 * Thresholds (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleThresholds = function(data) {
		const bands = [0.15, 0.40, 0.55, 0.90];
		const min = singleValueMin(data);
		const max = singleValueMax(data);
		const distance = max - min;

		return bands.map((v) => Number((min + (v * distance)).toFixed(singleMaxDecimalPlace(data))));
	};

	/**
	 * Max Decimal Place (Single Series)
	 *
	 * @returns {number}
	 */
	const singleMaxDecimalPlace = function(data) {
		return data.values.reduce((places, d) => {
			places = d3.max([places, decimalPlaces(d.value)]);

			// toFixed must be between 0 and 20
			return places > 20 ? 20 : places;
		}, 0);
	};

	/**
	 * Single Series Summary
	 *
	 * @returns {Object}
	 */
	const singleSummary = function(data) {
		return {
			dataType: dataType(data),
			rowKey: singleRowKey(data),
			rowTotal: singleRowTotal(data),
			columnKeys: singleColumnKeys(data),
			valueMin: singleValueMin(data),
			valueMax: singleValueMax(data),
			valueExtent: singleValueExtent(data),
			coordinatesMin: singleCoordinatesMin(data),
			coordinatesMax: singleCoordinatesMax(data),
			coordinatesExtent: singleCoordinatesExtent(data),
			maxDecimalPlace: singleMaxDecimalPlace(data),
			thresholds: singleThresholds(data),
			rowValuesKeys: singleRowValueKeys(data)
		}
	};

	/************* MULTI SERIES FUNCTIONS *************/

	/**
	 * Row Keys (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiRowKeys = function(data) {
		return data.map((d) => d.key);
	};

	/**
	 * Row Totals (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiRowTotals = function(data) {
		return data.reduce((totals, row) => {
			totals[row.key] = singleRowTotal(row);
			return totals;
		}, {});
	};

	/**
	 * Row Totals Max (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiRowTotalsMax = function(data) {
		return d3.max(d3.values(multiRowTotals(data)));
	};

	/**
	 * Row Value Keys (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiRowValueKeys = function(data) {
		return data.length ? Object.keys(data[0].values[0]) : [];
	};

	/**
	 * Column Keys (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiColumnKeys = function(data) {
		return data.reduce((keys, row) => {
			const tmp = [];
			row.values.forEach((d, i) => {
				tmp[i] = d.key;
			});

			keys = union(keys, tmp);

			return keys;
		}, []);
	};

	/**
	 * Column Totals (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiColumnTotals = function(data) {
		return data.reduce((totals, row) => {
			row.values.forEach((d) => {
				const columnName = d.key;
				totals[columnName] = (typeof totals[columnName] === "undefined" ? 0 : totals[columnName]);
				totals[columnName] += d.value;
			});

			return totals;
		}, {});
	};

	/**
	 * Column Totals Max (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiColumnTotalsMax = function(data) {
		return d3.max(d3.values(multiColumnTotals(data)));
	};

	/**
	 * Value Min (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiValueMin = function(data) {
		return d3.min(data.map((row) => singleValueMin(row)));
	};

	/**
	 * Value Max (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiValueMax = function(data) {
		return d3.max(data.map((row) => singleValueMax(row)));
	};

	/**
	 * Value Extent (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiValueExtent = function(data) {
		return [multiValueMin(data), multiValueMax(data)];
	};

	/**
	 * Coordinates Min (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiCoordinatesMin = function(data) {
		return data.map((row) => singleCoordinatesMin(row)).reduce((minimums, row) => {
			coordinates.forEach((coord) => {
				minimums[coord] = (coord in minimums ? d3.min([minimums[coord], +row[coord]]) : row[coord]);
			});

			return minimums;
		}, {});
	};

	/**
	 * Coordinates Max (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiCoordinatesMax = function(data) {
		return data.map((row) => singleCoordinatesMax(row)).reduce((maximums, row) => {
			coordinates.forEach((coord) => {
				maximums[coord] = (coord in maximums ? d3.max([maximums[coord], +row[coord]]) : row[coord]);
			});

			return maximums;
		}, {});
	};

	/**
	 * Coordinates Extent (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiCoordinatesExtent = function(data) {
		return coordinates.reduce((extents, coord) => {
			extents[coord] = [multiCoordinatesMin(data)[coord], multiCoordinatesMax(data)[coord]];

			return extents;
		}, {});
	};

	/**
	 * Thresholds (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiThresholds = function(data) {
		const bands = [0.15, 0.40, 0.55, 0.90];
		const min = multiValueMin(data);
		const max = multiValueMax(data);
		const distance = max - min;

		return bands.map((v) => Number((min + (v * distance)).toFixed(multiMaxDecimalPlace(data))));
	};

	/**
	 * Max Decimal Place (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiMaxDecimalPlace = function(data) {
		return d3.max(d3.map(data).values().reduce((places, row, i) => {
			places[i] = singleMaxDecimalPlace(row);

			return places;
		}, []));
	};

	/**
	 * Multi Series Summary
	 *
	 * @returns {Object}
	 */
	const multiSummary = function(data) {
		return {
			dataType: dataType(data),
			rowKeys: multiRowKeys(data),
			rowTotals: multiRowTotals(data),
			rowTotalsMax: multiRowTotalsMax(data),
			columnKeys: multiColumnKeys(data),
			columnTotals: multiColumnTotals(data),
			columnTotalsMax: multiColumnTotalsMax(data),
			valueMin: multiValueMin(data),
			valueMax: multiValueMax(data),
			valueExtent: multiValueExtent(data),
			coordinatesMin: multiCoordinatesMin(data),
			coordinatesMax: multiCoordinatesMax(data),
			coordinatesExtent: multiCoordinatesExtent(data),
			maxDecimalPlace: multiMaxDecimalPlace(data),
			thresholds: multiThresholds(data),
			rowValuesKeys: multiRowValueKeys(data)
		}
	};

	/************* MAIN FUNCTIONS **********************/

	/**
	 * Summary
	 *
	 * @returns {Object}
	 */
	const summary = function() {
		if (dataType(data) === SINGLE_SERIES) {
			return singleSummary(data);
		} else {
			return multiSummary(data);
		}
	};

	/**
	 * Rotate Data
	 *
	 * @returns {Array}
	 */
	const rotate = function() {
		const columnKeys = data.map((d) => d.key);
		const rowKeys = data[0].values.map((d) => d.key);

		const rotated = rowKeys.map((rowKey, rowIndex) => {
			const values = columnKeys.map((columnKey, columnIndex) => {
				// Copy the values from the original object
				const values = Object.assign({}, data[columnIndex].values[rowIndex]);
				// Swap the key over
				values.key = columnKey;

				return values;
			});

			return {
				key: rowKey,
				values: values
			};
		});

		return rotated;
	};

	/**
	 * Smooth Data
	 *
	 * Returns a copy of the input data series which is subsampled into a 100 samples,
	 * and has the smoothed values based on a provided d3.curve function.
	 *
	 * @param curveFunction
	 * @returns {{values: *, key: *}}
	 */
	const smooth = function(curveFunction) {
		const epsilon = 0.00001;
		const samples = 100;

		const values = data.values.map((d) => d.value);

		const sampler = d3.range(0, 1, 1 / samples);
		const keyPolator = (t) => (Number((t * samples).toFixed(0)) + 1);

		const valuePolator = d3Interpolate.interpolateFromCurve(values, curveFunction, epsilon, samples);

		const smoothed = {
			key: data.key,
			values: sampler.map((t) => ({
				key: keyPolator(t),
				value: valuePolator(t)
			}))
		};

		return smoothed;
	};

	return {
		summary: summary,
		rotate: rotate,
		smooth: smooth
	};
}



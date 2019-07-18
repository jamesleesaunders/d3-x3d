import * as d3 from "d3";
import * as d3Interpolate from "d3-interpolate-curve";

/**
 * Union Two Arrays
 *
 * @private
 * @param {Array} array1 - First Array.
 * @param {Array} array2 - First Array.
 * @returns {Array}
 */
const union = function(array1, array2) {
	const ret = [];
	const arr = array1.concat(array2);
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
 * @param {number} num - Float.
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

/**
 * Data Transform
 *
 * @module
 * @returns {Array}
 */
export default function dataTransform(data) {

	const SINGLE_SERIES = 1;
	const MULTI_SERIES = 2;
	const coordinateKeys = ['x', 'y', 'z'];

	/**
	 * Data Type
	 *
	 * @type {Number}
	 */
	const dataType = data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;

	/**
	 * ************ SINGLE SERIES FUNCTIONS ************
	 */

	/**
	 * Row Key (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleRowKey = function() {
		return d3.values(data)[0];
	};

	/**
	 * Row Total (Single Series)
	 *
	 * @returns {number}
	 */
	const singleRowTotal = function() {
		return d3.sum(data.values, (d) => d.value);
	};

	/**
	 * Row Value Keys (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleRowValuesKeys = function() {
		return Object.keys(data.values[0]);
	};

	/**
	 * Column Keys (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleColumnKeys = function() {
		return d3.values(data.values).map((d) => d.key);
	};

	/**
	 * Value Min (Single Series)
	 *
	 * @returns {number}
	 */
	const singleValueMin = function() {
		return d3.min(data.values, (d) => +d.value);
	};

	/**
	 * Value Max (Single Series)
	 *
	 * @returns {number}
	 */
	const singleValueMax = function() {
		return d3.max(data.values, (d) => +d.value);
	};

	/**
	 * Value Extent (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleValueExtent = function() {
		return d3.extent(data.values, (d) => +d.value);
	};

	/**
	 * Coordinates Min (Single Series)
	 *
	 * @returns {Object}
	 */
	const singleCoordinatesMin = function() {
		let minimums = {};

		coordinateKeys.forEach((key) => {
			minimums[key] = d3.min(data.values, (d) => +d[key]);
		});

		return minimums;
	};

	/**
	 * Coordinates Max (Single Series)
	 *
	 * @returns {Object}
	 */
	const singleCoordinatesMax = function() {
		let maximums = {};

		coordinateKeys.forEach((key) => {
			maximums[key] = d3.max(data.values, (d) => +d[key]);
		});

		return maximums;
	};

	/**
	 * Coordinates Extent (Single Series)
	 *
	 * @returns {Object}
	 */
	const singleCoordinatesExtent = function() {
		return coordinateKeys.reduce((extents, key) => {
			extents[key] = d3.extent(data.values, (d) => +d[key]);
			return extents;
		}, {});
	};

	/**
	 * Thresholds (Single Series)
	 *
	 * @returns {Array}
	 */
	const singleThresholds = function() {
		const bands = [0.15, 0.40, 0.55, 0.90];
		let distance = singleValueMax() - singleValueMin();

		return bands.map((v) => Number((singleValueMin() + (v * distance)).toFixed(singleMaxDecimalPlace())));
	};

	/**
	 * Max Decimal Place (Single Series)
	 *
	 * @returns {number}
	 */
	const singleMaxDecimalPlace = function() {
		let places = 0;

		data.values.forEach((d) => {
			places = d3.max([places, decimalPlaces(d.value)])
		});

		// toFixed must be between 0 and 20
		return places > 20 ? 20 : places;
	};

	/**
	 * Single Series Summary
	 *
	 * @returns {Object}
	 */
	const singleSummary = function() {
		return {
			dataType: dataType,
			rowKey: singleRowKey(),
			rowTotal: singleRowTotal(),
			rowValuesKeys: singleRowValuesKeys(),
			columnKeys: singleColumnKeys(),
			valueMin: singleValueMin(),
			valueMax: singleValueMax(),
			valueExtent: singleValueExtent(),
			coordinatesMin: singleCoordinatesMin(),
			coordinatesMax: singleCoordinatesMax(),
			coordinatesExtent: singleCoordinatesExtent(),
			maxDecimalPlace: singleMaxDecimalPlace(),
			thresholds: singleThresholds()
		}
	};

	/**
	 * ************ MULTI SERIES FUNCTIONS ************
	 */

	/**
	 * Row Keys (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiRowKeys = function() {
		return data.map((d) => d.key);
	};

	/**
	 * Row Totals (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiRowTotals = function() {
		const totals = {};

		d3.map(data).values().forEach((d) => {
			const rowKey = d.key;
			d.values.forEach((d) => {
				totals[rowKey] = (typeof totals[rowKey] === "undefined") ? 0 : totals[rowKey];
				totals[rowKey] += d.value;
			});
		});

		return totals;
	};

	/**
	 * Row Totals Max (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiRowTotalsMax = function() {
		return d3.max(d3.values(multiRowTotals()));
	};

	/**
	 * Row Value Keys (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiRowValuesKeys = function() {
		return Object.keys(data[0].values[0]);
	};

	/**
	 * Column Keys (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiColumnKeys = function() {
		let keys = [];

		d3.map(data).values().forEach((d) => {
			const tmp = [];
			d.values.forEach((d, i) => {
				tmp[i] = d.key;
			});
			keys = union(tmp, keys);
		});

		return keys;
	};

	/**
	 * Column Totals (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiColumnTotals = function() {
		let totals = {};

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				const columnName = d.key;
				totals[columnName] = (typeof (totals[columnName]) === "undefined" ? 0 : totals[columnName]);
				totals[columnName] += d.value;
			});
		});

		return totals;
	};

	/**
	 * Column Totals Max (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiColumnTotalsMax = function() {
		return d3.max(d3.values(multiColumnTotals()));
	};

	/**
	 * Value Min (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiValueMin = function() {
		let minimum = undefined;

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				minimum = (typeof (minimum) === "undefined" ? d.value : d3.min([minimum, +d.value]));
			});
		});

		return minimum;
	};

	/**
	 * Value Max (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiValueMax = function() {
		let maximum = undefined;

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				maximum = (typeof maximum !== "undefined" ? d3.max([maximum, +d.value]) : +d.value);
			});
		});

		return maximum;
	};

	/**
	 * Value Extent (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiValueExtent = function() {
		return [multiValueMin(), multiValueMax()];
	};

	/**
	 * Coordinates Min (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiCoordinatesMin = function() {
		let minimums = {};

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				coordinateKeys.forEach((key) => {
					minimums[key] = (key in minimums ? d3.min([minimums[key], +d[key]]) : d[key]);
				});
			});
		});

		return minimums;
	};

	/**
	 * Coordinates Max (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiCoordinatesMax = function() {
		let maximums = {};

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				coordinateKeys.forEach((key) => {
					maximums[key] = (key in maximums ? d3.max([maximums[key], +d[key]]) : d[key]);
				});
			});
		});

		return maximums;
	};

	/**
	 * Coordinates Extent (Multi Series)
	 *
	 * @returns {Object}
	 */
	const multiCoordinatesExtent = function() {
		let extents = {};

		coordinateKeys.forEach(function(key) {
			extents[key] = [multiCoordinatesMin()[key], multiCoordinatesMax()[key]];
		});

		return extents;
	};

	/**
	 * Thresholds (Multi Series)
	 *
	 * @returns {Array}
	 */
	const multiThresholds = function() {
		const bands = [0.15, 0.40, 0.55, 0.90];
		const distance = multiValueMax() - multiValueMin();

		return bands.map((v) => Number((multiValueMin() + (v * distance)).toFixed(multiMaxDecimalPlace())));
	};

	/**
	 * Max Decimal Place (Multi Series)
	 *
	 * @returns {number}
	 */
	const multiMaxDecimalPlace = function() {
		let places = 0;

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				places = d3.max([places, decimalPlaces(d.value)])
			});
		});

		// toFixed must be between 0 and 20
		return places > 20 ? 20 : places;
	};

	/**
	 * Multi Series Summary
	 *
	 * @returns {Object}
	 */
	const multiSummary = function() {
		return {
			dataType: dataType,
			rowKeys: multiRowKeys(),
			rowTotals: multiRowTotals(),
			rowTotalsMax: multiRowTotalsMax(),
			rowValuesKeys: multiRowValuesKeys(),
			columnKeys: multiColumnKeys(),
			columnTotals: multiColumnTotals(),
			columnTotalsMax: multiColumnTotalsMax(),
			valueMin: multiValueMin(),
			valueMax: multiValueMax(),
			valueExtent: multiValueExtent(),
			coordinatesMin: multiCoordinatesMin(),
			coordinatesMax: multiCoordinatesMax(),
			coordinatesExtent: multiCoordinatesExtent(),
			maxDecimalPlace: multiMaxDecimalPlace(),
			thresholds: multiThresholds()
		}
	};


	/**
	 * Summary
	 *
	 * @returns {Object}
	 */
	const summary = function() {
		if (dataType === SINGLE_SERIES) {
			return singleSummary();
		} else {
			return multiSummary();
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

		// const valuePolator = d3.interpolateBasis(values);
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



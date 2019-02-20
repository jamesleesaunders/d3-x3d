import * as d3 from "d3";

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
	 * Row Key
	 *
	 * @returns {Array}
	 */
	const rowKey = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data)[0];
		}
	}();

	/**
	 * Row Total
	 *
	 * @returns {Array}
	 */
	const rowTotal = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.sum(data.values, (d) => d.value);
		}
	}();

	/**
	 * Row Keys
	 *
	 * @returns {Array}
	 */
	const rowKeys = function() {
		if (dataType === MULTI_SERIES) {
			return data.map((d) => d.key);
		}
	}();

	/**
	 * Row Totals
	 *
	 * @returns {Array}
	 */
	const rowTotals = function() {
		if (dataType === MULTI_SERIES) {
			const ret = {};
			d3.map(data).values().forEach((d) => {
				const rowKey = d.key;
				d.values.forEach((d) => {
					ret[rowKey] = (typeof ret[rowKey] === "undefined") ? 0 : ret[rowKey];
					ret[rowKey] += d.value;
				});
			});
			return ret;
		}
	}();

	/**
	 * Row Totals Max
	 *
	 * @returns {number}
	 */
	const rowTotalsMax = function() {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(rowTotals));
		}
	}();

	/**
	 * Row Value Keys
	 *
	 * @returns {Array}
	 */
	const rowValuesKeys = function() {
		if (dataType === SINGLE_SERIES) {
			return Object.keys(data.values[0]);
		} else {
			return Object.keys(data[0].values[0]);
		}
	}();

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
	 * Column Keys
	 *
	 * @returns {Array}
	 */
	const columnKeys = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data.values).map((d) => d.key);
		}

		let ret = [];
		d3.map(data).values().forEach((d) => {
			const tmp = [];
			d.values.forEach((d, i) => {
				tmp[i] = d.key;
			});
			ret = union(tmp, ret);
		});

		return ret;
	}();

	/**
	 * Column Totals
	 *
	 * @returns {Array}
	 */
	const columnTotals = function() {
		if (dataType !== MULTI_SERIES) {
			return;
		}

		let ret = {};
		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				const columnName = d.key;
				ret[columnName] = (typeof (ret[columnName]) === "undefined" ? 0 : ret[columnName]);
				ret[columnName] += d.value;
			});
		});

		return ret;
	}();

	/**
	 * Column Totals Max
	 *
	 * @returns {Array}
	 */
	const columnTotalsMax = function() {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(columnTotals));
		}
	}();

	/**
	 * Value Min
	 *
	 * @returns {number}
	 */
	const valueMin = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.min(data.values, (d) => +d.value);
		}

		let ret;
		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				ret = (typeof (ret) === "undefined" ? d.value : d3.min([ret, +d.value]));
			});
		});

		return +ret;
	}();

	/**
	 * Value Max
	 *
	 * @returns {number}
	 */
	const valueMax = function() {
		let ret;

		if (dataType === SINGLE_SERIES) {
			ret = d3.max(data.values, (d) => +d.value);
		} else {
			d3.map(data).values().forEach((d) => {
				d.values.forEach((d) => {
					ret = (typeof ret !== "undefined" ? d3.max([ret, +d.value]) : +d.value);
				});
			});
		}

		return ret;
	}();

	/**
	 * Value Extent
	 *
	 * @returns {Array}
	 */
	const valueExtent = function() {
		return [valueMin, valueMax];
	}();

	/**
	 * Coordinates Min
	 *
	 * @returns {Array}
	 */
	const coordinatesMin = function() {
		let ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach((key) => {
				ret[key] = d3.min(data.values, (d) => +d[key]);
			});
			return ret;

		} else {
			d3.map(data).values().forEach((d) => {
				d.values.forEach((d) => {
					coordinateKeys.forEach((key) => {
						ret[key] = (key in ret ? d3.min([ret[key], +d[key]]) : d[key]);
					});
				});
			});
		}

		return ret;
	}();

	/**
	 * Coordinates Max
	 *
	 * @returns {Array}
	 */
	const coordinatesMax = function() {
		let ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach((key) => {
				ret[key] = d3.max(data.values, (d) => +d[key]);
			});
			return ret;

		} else {
			d3.map(data).values().forEach((d) => {
				d.values.forEach((d) => {
					coordinateKeys.forEach((key) => {
						ret[key] = (key in ret ? d3.max([ret[key], +d[key]]) : d[key]);
					});
				});
			});
		}

		return ret;
	}();

	/**
	 * Coordinates Extent
	 *
	 * @returns {Array}
	 */
	const coordinatesExtent = function() {
		let ret = {};
		coordinateKeys.forEach(function(key) {
			ret[key] = [coordinatesMin[key], coordinatesMax[key]]
		});

		return ret;
	}();

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
	 * Max Decimal Place
	 *
	 * @returns {number}
	 */
	const maxDecimalPlace = function() {
		let ret = 0;
		if (dataType === MULTI_SERIES) {
			d3.map(data).values().forEach((d) => {
				d.values.forEach((d) => {
					ret = d3.max([ret, decimalPlaces(d.value)])
				});
			});
		}

		// toFixed must be between 0 and 20
		return ret > 20 ? 20 : ret;
	}();


	/**
	 * Thresholds
	 *
	 * @returns {Array}
	 */
	const thresholds = function() {
		const distance = valueMax - valueMin;
		const bands = [0.15, 0.40, 0.55, 0.90];

		return bands.map((v) => Number((valueMin + (v * distance)).toFixed(maxDecimalPlace)));
	}();


	/**
	 * Summary
	 *
	 * @returns {Array}
	 */
	const summary = function() {
		return {
			dataType: dataType,
			rowKey: rowKey,
			rowTotal: rowTotal,
			rowKeys: rowKeys,
			rowTotals: rowTotals,
			rowTotalsMax: rowTotalsMax,
			rowValuesKeys: rowValuesKeys,
			columnKeys: columnKeys,
			columnTotals: columnTotals,
			columnTotalsMax: columnTotalsMax,
			valueMin: valueMin,
			valueMax: valueMax,
			valueExtent: valueExtent,
			coordinatesMin: coordinatesMin,
			coordinatesMax: coordinatesMax,
			coordinatesExtent: coordinatesExtent,
			maxDecimalPlace: maxDecimalPlace,
			thresholds: thresholds
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

	return {
		summary: summary,
		rotate: rotate
	};

}

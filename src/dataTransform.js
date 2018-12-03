import * as d3 from "d3";

/**
 * Data Analysis
 *
 * @module
 * @returns {Array}
 */
export default function dataTransform(data) {

	const SINGLE_SERIES = 1;
	const MULTI_SERIES = 2;

	/**
	 * Row or Rows?
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
		if (MULTI_SERIES === dataType) {
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
	 * Join two arrays
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
	 * Row Totals
	 *
	 * @returns {Array}
	 */
	const rowTotal = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.sum(data.values, (d) => d.value);
		}
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
				ret[columnName] = (typeof(ret[columnName]) === "undefined" ? 0 : ret[columnName]);
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
	 * Min Value
	 *
	 * @returns {number}
	 */
	const minValue = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.min(data.values, (d) => +d.value);
		}

		let ret;
		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, +d.value]));
			});
		});

		return +ret;
	}();

	/**
	 * Max Value
	 *
	 * @returns {number}
	 */
	const maxValue = function() {
		if (dataType === SINGLE_SERIES) {
			return d3.max(data.values, (d) => +d.value);
		}

		let ret;
		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				ret = (typeof(ret) === "undefined" ? d.value : d3.max([ret, +d.value]));
			});
		});

		return +ret;
	}();

	/**
	 * Max Coordinates
	 *
	 * @returns {Array}
	 */
	const maxCoordinates = function() {
		let maxX, maxY, maxZ;

		if (dataType === SINGLE_SERIES) {
			maxX = d3.max(data.values, (d) => +d.x);
			maxY = d3.max(data.values, (d) => +d.y);
			maxZ = d3.max(data.values, (d) => +d.z);
		} else {
			d3.map(data).values().forEach((d) => {
				d.values.forEach((d) => {
					maxX = (typeof(maxX) === "undefined" ? d.x : d3.max([maxX, +d.x]));
					maxY = (typeof(maxY) === "undefined" ? d.y : d3.max([maxY, +d.y]));
					maxZ = (typeof(maxZ) === "undefined" ? d.z : d3.max([maxZ, +d.z]));
				});
			});
		}

		return { x: maxX, y: maxY, z: maxZ };
	}();

	/**
	 * How many decimal places?
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
	 * Max decimal place
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
	 * Attempt to auto-calculate some thresholds
	 *
	 * @returns {Array}
	 */
	const thresholds = function() {
		const distance = maxValue - minValue;

		return [
			+(minValue + (0.15 * distance)).toFixed(maxDecimalPlace),
			+(minValue + (0.40 * distance)).toFixed(maxDecimalPlace),
			+(minValue + (0.55 * distance)).toFixed(maxDecimalPlace),
			+(minValue + (0.90 * distance)).toFixed(maxDecimalPlace)
		];
	}();

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
			columnKeys: columnKeys,
			columnTotals: columnTotals,
			columnTotalsMax: columnTotalsMax,
			minValue: minValue,
			maxValue: maxValue,
			maxCoordinates: maxCoordinates,
			maxDecimalPlace: maxDecimalPlace,
			thresholds: thresholds
		}
	};

	return {
		summary: summary,
		rotate: rotate
	};

}

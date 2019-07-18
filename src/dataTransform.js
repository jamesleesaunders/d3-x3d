import * as d3 from "d3";
import * as d3Interpolate from "d3-interpolate-curve";

/**
 * Data Transform
 *
 * @module
 * @returns {Array}
 */
export default function dataTransform(data) {

	/**
	 * ************ SINGLE SERIES FUNCTIONS ************
	 */

	/**
	 * Row Key
	 *
	 * @returns {Array}
	 */
	const singleRowKey = function() {
		return d3.values(data)[0];
	};

	/**
	 * Row Total
	 *
	 * @returns {Array}
	 */
	const singleRowTotal = function() {
		return d3.sum(data.values, (d) => d.value);
	};

	/**
	 * Row Value Keys
	 *
	 * @returns {Array}
	 */
	const singleRowValuesKeys = function() {
		return Object.keys(data.values[0]);
	};

	/**
	 * Column Keys
	 *
	 * @returns {Array}
	 */
	const singleColumnKeys = function() {
		return d3.values(data.values).map((d) => d.key);
	};

	/**
	 * Value Min
	 *
	 * @returns {number}
	 */
	const singleValueMin = function() {
		return d3.min(data.values, (d) => +d.value);
	};

	/**
	 * Coordinates Max
	 *
	 * @returns {Array}
	 */
	const singleCoordinatesMax = function() {
		let ret = {};

		coordinateKeys.forEach((key) => {
			ret[key] = d3.max(data.values, (d) => +d[key]);
		});

		return ret;
	};

	/**
	 * Value Max
	 *
	 * @returns {number}
	 */
	const singleValueMax = function() {
		return d3.max(data.values, (d) => +d.value);
	};

	/**
	 * Coordinates Min
	 *
	 * @returns {Array}
	 */
	const singleCoordinatesMin = function() {
		let ret = {};

		coordinateKeys.forEach((key) => {
			ret[key] = d3.min(data.values, (d) => +d[key]);
		});

		return ret;
	};

	/**
	 * ************ MULTI SERIES FUNCTIONS ************
	 */

	/**
	 * Row Keys
	 *
	 * @returns {Array}
	 */
	const multiRowKeys = function() {
		return data.map((d) => d.key);
	};

	/**
	 * Row Totals
	 *
	 * @returns {Array}
	 */
	const multiRowTotals = function() {
		const ret = {};

		d3.map(data).values().forEach((d) => {
			const rowKey = d.key;
			d.values.forEach((d) => {
				ret[rowKey] = (typeof ret[rowKey] === "undefined") ? 0 : ret[rowKey];
				ret[rowKey] += d.value;
			});
		});

		return ret;
	};

	/**
	 * Row Totals Max
	 *
	 * @returns {number}
	 */
	const multiRowTotalsMax = function() {
		return d3.max(d3.values(multiRowTotals()));
	};

	/**
	 * Row Value Keys
	 *
	 * @returns {Array}
	 */
	const multiRowValuesKeys = function() {
		return Object.keys(data[0].values[0]);
	};

	/**
	 * Column Keys
	 *
	 * @returns {Array}
	 */
	const multiColumnKeys = function() {
		let ret = [];

		d3.map(data).values().forEach((d) => {
			const tmp = [];
			d.values.forEach((d, i) => {
				tmp[i] = d.key;
			});
			ret = union(tmp, ret);
		});

		return ret;
	};

	/**
	 * Column Totals
	 *
	 * @returns {Array}
	 */
	const multiColumnTotals = function() {
		let ret = {};

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				const columnName = d.key;
				ret[columnName] = (typeof (ret[columnName]) === "undefined" ? 0 : ret[columnName]);
				ret[columnName] += d.value;
			});
		});

		return ret;
	};

	/**
	 * Column Totals Max
	 *
	 * @returns {Array}
	 */
	const multiColumnTotalsMax = function() {
		return d3.max(d3.values(multiColumnTotals()));
	};

	/**
	 * Value Min
	 *
	 * @returns {number}
	 */
	const multiValueMin = function() {
		let ret;

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				ret = (typeof (ret) === "undefined" ? d.value : d3.min([ret, +d.value]));
			});
		});

		return +ret;
	};

	/**
	 * Coordinates Max
	 *
	 * @returns {Array}
	 */
	const multiCoordinatesMax = function() {
		let ret = {};

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				coordinateKeys.forEach((key) => {
					ret[key] = (key in ret ? d3.max([ret[key], +d[key]]) : d[key]);
				});
			});
		});

		return ret;
	};

	/**
	 * Value Max
	 *
	 * @returns {number}
	 */
	const multiValueMax = function() {
		let ret;

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				ret = (typeof ret !== "undefined" ? d3.max([ret, +d.value]) : +d.value);
			});
		});

		return ret;
	};

	/**
	 * Coordinates Min
	 *
	 * @returns {Array}
	 */
	const multiCoordinatesMin = function() {
		let ret = {};

		d3.map(data).values().forEach((d) => {
			d.values.forEach((d) => {
				coordinateKeys.forEach((key) => {
					ret[key] = (key in ret ? d3.min([ret[key], +d[key]]) : d[key]);
				});
			});
		});

		return ret;
	};

	/**
	 * ************ HELPER FUNCTIONS ************
	 */

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
	 * ************ ORIGINAL FUNCTIONS ************
	 */

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
	 * @done
	 */
	const rowKey = function() {
		if (dataType === SINGLE_SERIES) {
			return singleRowKey();
		} else {
			return undefined;
		}
	}();

	/**
	 * Row Total
	 *
	 * @returns {Array}
	 * @done
	 */
	const rowTotal = function() {
		if (dataType === SINGLE_SERIES) {
			return singleRowTotal();
		} else {
			return undefined;
		}
	}();

	/**
	 * Row Keys
	 *
	 * @returns {Array}
	 * @done
	 */
	const rowKeys = function() {
		if (dataType === SINGLE_SERIES) {
			return undefined;
		} else {
			return multiRowKeys();
		}
	}();

	/**
	 * Row Totals
	 *
	 * @returns {Array}
	 * @done
	 */
	const rowTotals = function() {
		if (dataType === SINGLE_SERIES) {
			return undefined;
		} else {
			return multiRowTotals();
		}
	}();

	/**
	 * Row Totals Max
	 *
	 * @returns {number}
	 * @done
	 */
	const rowTotalsMax = function() {
		if (dataType === SINGLE_SERIES) {
			return undefined;
		} else {
			return multiRowTotalsMax();
		}
	}();

	/**
	 * Row Value Keys
	 *
	 * @returns {Array}
	 * @done
	 */
	const rowValuesKeys = function() {
		if (dataType === SINGLE_SERIES) {
			return singleRowValuesKeys();
		} else {
			return multiRowValuesKeys();
		}
	}();

	/**
	 * Column Keys
	 *
	 * @returns {Array}
	 * @done
	 */
	const columnKeys = function() {
		if (dataType === SINGLE_SERIES) {
			return singleColumnKeys();
		} else {
			return multiColumnKeys();
		}
	}();

	/**
	 * Column Totals
	 *
	 * @returns {Array}
	 * @done
	 */
	const columnTotals = function() {
		if (dataType === SINGLE_SERIES) {
			return undefined;
		} else {
			return multiColumnTotals();
		}
	}();

	/**
	 * Column Totals Max
	 *
	 * @returns {Array}
	 * @done
	 */
	const columnTotalsMax = function() {
		if (dataType === SINGLE_SERIES) {
			return undefined;
		} else {
			return multiColumnTotalsMax();
		}
	}();

	/**
	 * Value Min
	 *
	 * @returns {number}
	 * @done
	 */
	const valueMin = function() {
		if (dataType === SINGLE_SERIES) {
			return singleValueMin();
		} else {
			return multiValueMin();
		}
	}();

	/**
	 * Value Max
	 *
	 * @returns {number}
	 * @done
	 */
	const valueMax = function() {
		if (dataType === SINGLE_SERIES) {
			return singleValueMax();
		} else {
			return multiValueMax();
		}
	}();

	/**
	 * Value Extent
	 *
	 * @returns {Array}
	 * @done
	 */
	const valueExtent = function() {
		if (dataType === SINGLE_SERIES) {
			return [singleValueMin(), singleValueMax()];
		} else {
			return [multiValueMin(), multiValueMax()];
		}
	}();

	/**
	 * Coordinates Min
	 *
	 * @returns {Array}
	 * @done
	 */
	const coordinatesMin = function() {
		if (dataType === SINGLE_SERIES) {
			return singleCoordinatesMin();
		} else {
			return multiCoordinatesMin();
		}
	}();

	/**
	 * Coordinates Max
	 *
	 * @returns {Array}
	 * @done
	 */
	const coordinatesMax = function() {
		if (dataType === SINGLE_SERIES) {
			return singleCoordinatesMax();
		} else {
			return multiCoordinatesMax();
		}
	}();

	/**
	 * Coordinates Extent
	 *
	 * @returns {Array}
	 * @done
	 */
	const coordinatesExtent = function() {
		let ret = {};
		coordinateKeys.forEach(function(key) {
			if (dataType === SINGLE_SERIES) {
				ret[key] = [singleCoordinatesMin()[key], singleCoordinatesMax()[key]];
			} else {
				ret[key] = [multiCoordinatesMin()[key], multiCoordinatesMax()[key]];
			}
		});

		return ret;
	}();

	/**
	 * Max Decimal Place
	 *
	 * @returns {number}
	 * @todo Refactor.
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
	 * @todo Refactor.
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
		const type = data.key !== undefined ? "single" : "multi";

		if (type === "single") {
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
		} else {
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



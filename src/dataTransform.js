import * as d3 from "d3";

/**
 * Data Analysis
 *
 */
export default function(data) {

	const SINGLE_SERIES = 1;
	const MULTI_SERIES = 2;

	/**
	 * Row or Rows?
	 */
	let dataStructure = (function() {
		if (data["key"] !== undefined) {
			return SINGLE_SERIES;
		} else {
			return MULTI_SERIES;
		}
	})();

	/**
	 * Row Key
	 */
	let rowKey = (function() {
		let ret;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.values(data)[0];
		}

		return ret;
	})();

	/**
	 * Row Keys
	 */
	let rowKeys = (function() {
		let ret;
		if (MULTI_SERIES === dataStructure) {
			ret = data.map(function(d) {
				return d.key;
			});
		}

		return ret;
	})();

	/**
	 * Row Totals
	 */
	let rowTotals = (function() {
		let ret;
		if (MULTI_SERIES === dataStructure) {
			ret = {};
			d3.map(data).values().forEach(function(d) {
				let rowKey = d.key;
				d.values.forEach(function(d) {
					ret[rowKey] = (typeof(ret[rowKey]) === "undefined" ? 0 : ret[rowKey]);
					ret[rowKey] += d.value;
				});
			});
		}

		return ret;
	})();

	/**
	 * Row Totals Max
	 */
	let rowTotalsMax = (function() {
		let ret;
		if (MULTI_SERIES === dataStructure) {
			ret = d3.max(d3.values(rowTotals));
		}

		return ret;
	})();

	/**
	 * Join two arrays
	 */
	let union = function(array1, array2) {
		let ret = [];
		let arr = array1.concat(array2);
		let len = arr.length;
		let assoc = {};

		while (len--) {
			let item = arr[len];

			if (!assoc[item]) {
				ret.unshift(item);
				assoc[item] = true;
			}
		}

		return ret;
	};

	/**
	 * Column Keys
	 */
	let columnKeys = (function() {
		let ret = [];
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.values(data.values).map(function(d) {
				return d.key;
			});

		} else {
			d3.map(data).values().forEach(function(d) {
				let tmp = [];
				d.values.forEach(function(d, i) {
					tmp[i] = d.key;
				});

				ret = union(tmp, ret);
			});
		}

		return ret;
	})();

	/**
	 * Row Totals
	 */
	let rowTotal = (function() {
		let ret;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.sum(data.values, function(d) {
				return d.value;
			});
		}

		return ret;
	})();

	/**
	 * Column Totals
	 */
	let columnTotals = (function() {
		let ret;
		if (MULTI_SERIES === dataStructure) {
			ret = {};
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					let columnName = d.key;
					ret[columnName] = (typeof(ret[columnName]) === "undefined" ? 0 : ret[columnName]);
					ret[columnName] += d.value;
				});
			});
		}

		return ret;
	})();

	/**
	 * Column Totals Max
	 */
	let columnTotalsMax = (function() {
		let ret;
		if (MULTI_SERIES === dataStructure) {
			ret = d3.max(d3.values(columnTotals));
		}

		return ret;
	})();

	/**
	 * Min Value
	 */
	let minValue = (function() {
		let ret;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.min(data.values, function(d) {
				return +d.value;
			});
		} else {
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, +d.value]));
				});
			});
		}

		return +ret;
	})();

	/**
	 * Max Value
	 */
	let maxValue = (function() {
		let ret;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.max(data.values, function(d) {
				return +d.value;
			});

		} else {
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					ret = (typeof(ret) === "undefined" ? d.value : d3.max([ret, +d.value]));
				});
			});
		}

		return +ret;
	})();

	/**
	 * Max Coordinates
	 */
	let maxCoordinates = (function() {
		let maxX, maxY, maxZ;

		if (SINGLE_SERIES === dataStructure) {
			maxX = d3.max(data.values, function(d) { return +d.x; });
			maxY = d3.max(data.values, function(d) { return +d.y; });
			maxZ = d3.max(data.values, function(d) { return +d.z; });
		} else {
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					maxX = (typeof(maxX) === "undefined" ? d.x : d3.max([maxX, +d.x]));
					maxY = (typeof(maxY) === "undefined" ? d.y : d3.max([maxY, +d.y]));
					maxZ = (typeof(maxZ) === "undefined" ? d.z : d3.max([maxZ, +d.z]));
				});
			});
		}

		return { x: maxX, y: maxY, z: maxZ };
	})();

	/**
	 * How many decimal places?
	 */
	let decimalPlaces = function(num) {
		let match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
		if (!match) {
			return 0;
		}

		return Math.max(
			0,
			// Number of digits right of decimal point.
			(match[1] ? match[1].length : 0)
			// Adjust for scientific notation.
			-
			(match[2] ? +match[2] : 0));
	};

	/**
	 * Max decimal place
	 */
	let maxDecimalPlace = (function() {
		let ret = 0;
		if (MULTI_SERIES === dataStructure) {
			d3.map(data).values().forEach(function(d) {
				d.values.forEach(function(d) {
					ret = d3.max([ret, decimalPlaces(d.value)])
				});
			});
		}

		return ret;
	})();

	// If thresholds values are not already set attempt to auto-calculate some thresholds
	let thresholds = (function() {
		let distance = maxValue - minValue;

		return [
			+(minValue + (0.15 * distance)).toFixed(maxDecimalPlace),
			+(minValue + (0.40 * distance)).toFixed(maxDecimalPlace),
			+(minValue + (0.55 * distance)).toFixed(maxDecimalPlace),
			+(minValue + (0.90 * distance)).toFixed(maxDecimalPlace)
		];
	})();

	/**
	 * Rotate Data
	 */
	let rotate = function() {
		let columnKeys = data.map(function(d) {
			return d.key;
		});

		let rowKeys = data[0].values.map(function(d) {
			return d.key
		});

		let rotated = rowKeys.map(function(rowKey, rowIndex) {
			let values = columnKeys.map(function(columnKey, columnIndex) {
				// Copy the values from the original object
				let values = Object.assign({}, data[columnIndex].values[rowIndex]);
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
	 */
	let summary = function() {
		return {
			dataStructure: dataStructure,
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

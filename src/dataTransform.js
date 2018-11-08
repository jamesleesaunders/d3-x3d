import * as d3 from "d3";

/**
 * Data Analysis
 *
 */
export default function dataTransform(data) {

	const SINGLE_SERIES = 1;
	const MULTI_SERIES = 2;

	/**
	 * Row or Rows?
	 */
	const dataStructure = data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;

	/**
	 * Row Key
	 */
	const rowKey = (() => {
		if (dataStructure === SINGLE_SERIES) {
			return d3.values(data)[0];
		}
	})();

	/**
	 * Row Keys
	 */
	const rowKeys = (() => {
		if (dataStructure === MULTI_SERIES) {
			return data.map(d => d.key);
		}
	})();

	/**
	 * Row Totals
	 */
	const rowTotals = (() => {
		if (MULTI_SERIES === dataStructure) {
			const ret = {};
			d3.map(data).values().forEach(d => {
				const rowKey = d.key;
				d.values.forEach(d => {
					ret[rowKey] = (typeof(ret[rowKey]) === "undefined" ? 0 : ret[rowKey]);
					ret[rowKey] += d.value;
				});
			});
			return ret;
		}
	})();

	/**
	 * Row Totals Max
	 */
	const rowTotalsMax = (() => {
		if (dataStructure === MULTI_SERIES) {
			return d3.max(d3.values(rowTotals));
		}
	})();

	/**
	 * Join two arrays
	 */
	const union = function(array1, array2) {
		const ret = [];
		const arr = array1.concat(array2);
		const len = arr.length;
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
	 */
	const columnKeys = (() => {
		if (dataStructure === SINGLE_SERIES) {
			return d3.values(data.values).map(function(d) {
				return d.key;
			});
		}
		
		let ret = [];
		d3.map(data).values().forEach(d => {
			const tmp = [];
			d.values.forEach((d, i) => {
				tmp[i] = d.key;
			});
			ret = union(tmp, ret);
		});

		return ret;
	})();

	/**
	 * Row Totals
	 */
	const rowTotal = (() => {
		if (dataStructure === SINGLE_SERIES) {
			return d3.sum(data.values, d => d.value);
		}
	})();

	/**
	 * Column Totals
	 */
	const columnTotals = (() => {
		if (dataStructure === MULTI_SERIES) {
			return;
		}

		let ret = {};
		d3.map(data).values().forEach(d => {
			d.values.forEach(d => {
				const columnName = d.key;
				ret[columnName] = (typeof(ret[columnName]) === "undefined" ? 0 : ret[columnName]);
				ret[columnName] += d.value;
			});
		});

		return ret;
	})();

	/**
	 * Column Totals Max
	 */
	const columnTotalsMax = (() => {
		if (dataStructure === MULTI_SERIES) {
			return d3.max(d3.values(columnTotals));
		}
	})();

	/**
	 * Min Value
	 */
	const minValue = (() => {
		if (dataStructure === SINGLE_SERIES) {
			return d3.min(data.values, d => +d.value);
		}

		let ret;
		d3.map(data).values().forEach(d => {
			d.values.forEach(d => {
				ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, +d.value]));
			});
		});

		return +ret;
	})();

	/**
	 * Max Value
	 */
	const maxValue = (() => {
		if (dataStructure === SINGLE_SERIES) {
			return d3.max(data.values, d => +d.value);
		}

		let ret;
		d3.map(data).values().forEach(d => {
			d.values.forEach(d => {
				ret = (typeof(ret) === "undefined" ? d.value : d3.max([ret, +d.value]));
			});
		});

		return +ret;
	})();

	/**
	 * Max Coordinates
	 */
	const maxCoordinates = (() => {
		let maxX, maxY, maxZ;

		if (dataStructure === SINGLE_SERIES) {
			maxX = d3.max(data.values, d => +d.x);
			maxY = d3.max(data.values, d => +d.y);
			maxZ = d3.max(data.values, d => +d.z);
		} else {
			d3.map(data).values().forEach(d => {
				d.values.forEach(d => {
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
	const decimalPlaces = num => {
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
	 */
	const maxDecimalPlace = (() => {
		let ret = 0;
		if (dataStructure === MULTI_SERIES) {
			d3.map(data).values().forEach(d => {
				d.values.forEach(d => {
					ret = d3.max([ret, decimalPlaces(d.value)])
				});
			});
		}

		// toFixed must be between 0 and 20
		return ret > 20 ? 20 : ret;
	})();


	/**
	 * Attempt to auto-calculate some thresholds
	 */
	const thresholds = (() => {
		const distance = maxValue - minValue;

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
	const rotate = () => {
		const columnKeys = data.map(d => d.key);
		const rowKeys = data[0].values.map(d => d.key);

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
	 */
	const summary = () => ({
		dataStructure,
		rowKey,
		rowTotal,
		rowKeys,
		rowTotals,
		rowTotalsMax,
		columnKeys,
		columnTotals,
		columnTotalsMax,
		minValue,
		maxValue,
		maxCoordinates,
		maxDecimalPlace,
		thresholds
	});

	return {
		summary,
		rotate
	};
}

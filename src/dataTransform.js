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

	/**
	 * Smooth Data (Basic Version)
	 *
	 * Returns a copy of the input data series which is subsampled into a 100 samples,
	 * and has the smoothed values based on a provided d3.curve function.
	 *
	 * @returns {{values: *, key: *}}
	 */
	const smoothBasic = function() {
		const maxIter = 100;

		const vals = data.values.map((d) => d.value);
		const splinePolator = d3.interpolateBasis(vals);

		const keyPolator = function(t) {
			return Number((t * maxIter).toFixed(0)) + 1;
		};

		const sampler = d3.range(0, 1, 1 / maxIter);

		return {
			key: data.key,
			values: sampler.map((t) => ({
				key: keyPolator(t),
				value: splinePolator(t)
			}))
		};
	};

	/**
	 * Smooth Data (Advanced Version)
	 *
	 * Returns a copy of the input data series which is subsampled into a 100 samples,
	 * and has the smoothed values based on a provided d3.curve function.
	 *
	 * @param curve
	 * @returns {{values: *, key: *}}
	 */
	const smoothAdvanced = function(curve) {
		const epsilon = 0.00001;
		const samples = 100;

		const values = data.values.map((d) => d.value);
		const valuePolator = interpolateCurve(values, curve, epsilon, samples);

		const keyPolator = function(t) {
			return Number((t * samples).toFixed(0)) + 1;
		};

		const sampler = d3.range(0, 1, 1 / samples);

		return {
			key: data.key,
			values: sampler.map((t) => ({
				key: keyPolator(t),
				value: valuePolator(t).y
			}))
		};
	};

	/**
	 * Interpolate Curve
	 *
	 * Returns an interpolator function similar to d3.interpoleBasis(values).
	 * The returned function expects input in the range [0, 1] and returns a smoothed value. For example:
	 *
	 * - interpolateCurve(values)(0) returns the the first value.
	 *
	 * - interpolateCurve uses curvePolator(points) which returns a similar interpolator function.
	 *   However, the returned function works in the arbitrary domain defined by the provided points
	 *   and expects an input x in this domain.
	 *
	 * - curvePolator uses svgPathInterpolator(svgpath) which returns a similar interpolator function.
	 *   However, the returned function is constructed based on an SVG path string.
	 *   d3.line(points) outputs such SVG path strings.
	 *
	 * @private
	 *
	 * @param values
	 * @param curve
	 * @param epsilon
	 * @param samples
	 *
	 * @returns {*}
	 */
	const interpolateCurve = function(values, curve, epsilon, samples) {
		const length = values.length;
		const xrange = d3.range(length).map(function(d, i) { return i * (1 / (length - 1)); });
		const points = values.map((v, i) => [xrange[i], v]);

		return curvePolator(points, curve, epsilon, samples);
	};

	/**
	 * Curve Polator
	 *
	 * @private
	 *
	 * @param points
	 * @param curve
	 * @param epsilon
	 * @param samples
	 *
	 * @returns {*}
	 */
	const curvePolator = function(points, curve, epsilon, samples) {
		const path = d3.line().curve(curve)(points);

		return svgPathInterpolator(path, epsilon, samples);
	};

	/**
	 * SVG Path Interpolator
	 *
	 * @private
	 *
	 * @param path
	 * @param epsilon
	 * @param samples
	 *
	 * @returns {interpolator}
	 */
	const svgPathInterpolator = function(path, epsilon, samples) {
		// Create SVG Path
		path = path || "M0,0L1,1";
		const area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		area.innerHTML = `<path d='${path}'></path>`;
		const svgpath = area.querySelector('path');
		svgpath.setAttribute('d', path);

		// Calculate lengths and max points
		const totalLength = svgpath.getTotalLength();
		const minPoint = svgpath.getPointAtLength(0);
		const maxPoint = svgpath.getPointAtLength(totalLength);
		let reverse = maxPoint.x < minPoint.x;
		const range = reverse ? [maxPoint, minPoint] : [minPoint, maxPoint];
		reverse = reverse ? -1 : 1;

		// Return function
		return function(x) {
			const targetX = x === 0 ? 0 : x || minPoint.x; // Check for 0 and null/undefined
			if (targetX < range[0].x) return range[0];     // Clamp
			if (targetX > range[1].x) return range[1];

			function estimateLength(l, mn, mx) {
				let delta = svgpath.getPointAtLength(l).x - targetX;
				let nextDelta = 0;
				let iter = 0;
				// console.log(delta, targetX, epsilon);
				while (Math.abs(delta) > epsilon && iter < samples) {
					iter++;
					// console.log(iter, Math.abs(delta) > epsilon);
					if (reverse * delta < 0) {
						mn = l;
						l = (l + mx) / 2;
					} else {
						mx = l;
						l = (mn + l) / 2;
					}
					nextDelta = svgpath.getPointAtLength(l).x - targetX;
					if (Math.abs(Math.abs(delta) - Math.abs(nextDelta)) < epsilon) break; // Not improving, targetX may be in a gap
					delta = nextDelta;
				}

				return l;
			}

			const estimatedLength = estimateLength(totalLength / 2, 0, totalLength);
			return svgpath.getPointAtLength(estimatedLength);
		}
	};

	return {
		summary: summary,
		rotate: rotate,
		smooth: smoothBasic
	};
}



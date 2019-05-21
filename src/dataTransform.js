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
	 * Basis Interpolate Values
	 *
	 * @private
	 * @param {Array} values
	 */
	const interpolateBasis = function(values) {
		let vals = values.map((d) => d.value);

		let splinePolator = d3.interpolateBasis(vals);

		let keyPolator = function(t) {
			return Number((t * 100).toFixed(0)) + 1;
		};

		let sampler = d3.range(0, 1, 0.01);

		return sampler.map((t) => ({
			key: keyPolator(t),
			value: splinePolator(t)
		}));
	};

	/**
	 * smoothData(data) returns a copy of the input data series which is subsampled into a 100 samples,
	 * and has the smoothed values based on a provided d3.curve.
	 *
	 * @param areaData
	 * @returns {{values: *, key: *}}
	 */
	const smoothData = function(areaData) {
		var curve = this.curve;
		var values = areaData.values;
		var keys = values.map((v) => v.key);
		var valuePolator = interpolateCurve(values.map((v) => v.value), curve);
		var keyPicker = d3.interpolateDiscrete(keys);
		var keyPolator = function(t) { return d3.interpolate(keyPicker(t), keyPicker(t + 1 / keys.length))(t) };
		var sampler = d3.range(0, 1, 0.01); // 100 samples

		return {
			key: areaData.key + this.suffix,
			values: sampler.map((t) => ({ key: keyPolator(t), value: valuePolator(t).y }))
		};
	};

	/**
	 * smoothData uses interpolateCurve(values) which returns an interpolator function similar to d3.interpoleBasis(values).
	 * The returned function expects input in the range [0,1] and returns a smoothed value.
	 * For example, interpolateCurve(values)(0) returns the the first value.
	 * interpolateCurve uses curvePolator(points) which returns a similar interpolator function. However, the returned
	 * function works in the arbitrary domain defined by the provided points and expects an input x in this domain.
	 * curvePolator uses svgPathInterpolator(svgpath) which returns a similar interpolator function. However, the returned
	 * function is constructed based on an svgpath string. d3.line(points) outputs such svgpath strings.
	 *
	 * @param values
	 * @param curve
	 * @param eps
	 * @param maxIter
	 * @returns {*}
	 */
	const interpolateCurve = function(values, curve, eps, maxIter) {
		const xrange = d3.range(0, 1, 1 / values.length);
		const points = values.map((v, i) => [xrange[i], v]);

		return curvePolator(points, curve, eps, maxIter);
	};

	/**
	 * Curve Polator
	 *
	 * @param points
	 * @param curve
	 * @param eps
	 * @param maxIter
	 * @returns {*}
	 */
	const curvePolator = function(points, curve, eps, maxIter) {
		curve = curve || d3.curveBasis;
		const path = d3.line().curve(curve)(points);

		return svgPathInterpolator(path, eps, maxIter);
	};

	/**
	 * svgPathInterpolator
	 *
	 * @param path
	 * @param eps
	 * @param maxIter
	 * @returns {interpolator}
	 * @constructor
	 */
	const svgPathInterpolator = function(path, eps, maxIter) {
		const safeIter = maxIter || 100;
		const epsilon = eps || 0.00001;
		const pathString = path || "M0,0L1,1";
		const area = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		area.innerHTML = `<path d='${pathString}'></path>`;
		const svgpath = area.querySelector('path');
		svgpath.setAttribute('d', pathString);
		const totalLength = svgpath.getTotalLength();
		const minPoint = svgpath.getPointAtLength(0);
		const maxPoint = svgpath.getPointAtLength(totalLength);
		let reverse = maxPoint.x < minPoint.x;
		const range = reverse ? [maxPoint, minPoint] : [minPoint, maxPoint];
		reverse = reverse ? -1 : 1;

		return function interpolator(x) {
			const targetX = x === 0 ? 0 : x || minPoint.x; // check for 0 and null/undefined
			if (targetX < range[0].x) return range[0]; // clamp
			if (targetX > range[1].x) return range[1];
			const estimatedLength = estimateLength(totalLength / 2, 0, totalLength);
			return svgpath.getPointAtLength(estimatedLength);

			function estimateLength(l, mn, mx) {
				let delta = svgpath.getPointAtLength(l).x - targetX;
				let nextDelta = 0;
				let iter = 0;
				//console.log(delta, targetX, epsilon);
				while (Math.abs(delta) > epsilon && iter < safeIter) {
					iter++;
					//console.log(iter, Math.abs(delta) > epsilon);
					if (reverse * delta < 0) {
						mn = l;
						l = (l + mx) / 2;
					} else {
						mx = l;
						l = (mn + l) / 2;
					}
					nextDelta = svgpath.getPointAtLength(l).x - targetX;
					if (Math.abs(Math.abs(delta) - Math.abs(nextDelta)) < epsilon) break; // not improving, targetX may be in a gap;
					delta = nextDelta;
				}
				return l;
				// if (Math.abs(delta) < epsilon) return resultLength
				// if (reverse * delta < 0) return estimateLength((totalLength + max)/2, resultLength, max)
				// return estimateLength((min + resultLength)/2, min, resultLength)
			}
		}
	};

	/**
	 * Interpolate
	 *
	 * @returns {number}
	 */
	const interpolate = function() {
		if (dataType === MULTI_SERIES) {
			return data.map((d) => ({ key: d.key, values: interpolateBasis(d.values) }));
		} else {
			return interpolateBasis(data.values);
		}
	};

	return {
		summary: summary,
		rotate: rotate,
		interpolate: interpolate
	};

}



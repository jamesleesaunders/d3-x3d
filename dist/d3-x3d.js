/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2019 James Saunders
 * @license GPLv2
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('d3-shape'), require('d3-array'), require('d3-interpolate')) :
  typeof define === 'function' && define.amd ? define(['d3', 'd3-shape', 'd3-array', 'd3-interpolate'], factory) :
  (global = global || self, (global.d3 = global.d3 || {}, global.d3.x3d = factory(global.d3, global.d3, global.d3, global.d3)));
}(this, function (d3, d3Shape, d3Array, d3Interpolate) { 'use strict';

  var version = "2.0.3";
  var license = "GPL-2.0";

  /**
   * Curve Polator
   *
   * @param points
   * @param curveFunction
   * @param epsilon
   * @param samples
   * @returns {Function}
   */
  function curvePolator(points, curveFunction, epsilon, samples) {
    // eslint-disable-line max-params
    var path = d3Shape.line().curve(curveFunction)(points);

    return svgPathInterpolator(path, epsilon, samples);
  }

  /**
   * SVG Path Interpolator
   *
   * @param path
   * @param epsilon
   * @param samples
   * @returns {Function}
   */
  function svgPathInterpolator(path, epsilon, samples) {
    // Create detached SVG path
    path = path || "M0,0L1,1";

    var area = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    area.innerHTML = "<path></path>";
    var svgpath = area.querySelector("path");
    svgpath.setAttribute("d", path);

    // Calculate lengths and max points
    var totalLength = svgpath.getTotalLength();
    var minPoint = svgpath.getPointAtLength(0);
    var maxPoint = svgpath.getPointAtLength(totalLength);
    var reverse = maxPoint.x < minPoint.x;
    var range = reverse ? [maxPoint, minPoint] : [minPoint, maxPoint];
    reverse = reverse ? -1 : 1;

    // Return function
    return function (x) {
      // Check for 0 and null/undefined
      var targetX = x === 0 ? 0 : x || minPoint.x;
      // Clamp
      if (targetX < range[0].x) return range[0];
      if (targetX > range[1].x) return range[1];

      function estimateLength(l, mn, mx) {
        var delta = svgpath.getPointAtLength(l).x - targetX;
        var nextDelta = 0;
        var iter = 0;

        while (Math.abs(delta) > epsilon && iter < samples) {
          if (iter > samples) return false;
          iter++;

          if (reverse * delta < 0) {
            mn = l;
            l = (l + mx) / 2;
          } else {
            mx = l;
            l = (mn + l) / 2;
          }
          nextDelta = svgpath.getPointAtLength(l).x - targetX;

          delta = nextDelta;
        }

        return l;
      }

      var estimatedLength = estimateLength(totalLength / 2, 0, totalLength);

      return svgpath.getPointAtLength(estimatedLength).y;
    };
  }

  /**
   * Interpolate From Curve
   *
   * @param values
   * @param curveFunction
   * @param epsilon
   * @param samples
   * @returns {Function}
   */
  function fromCurve (values, curveFunction) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.00001;
    var samples = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    // eslint-disable-line max-params
    var length = values.length;
    var xrange = d3Array.range(length).map(function (d, i) {
      return i * (1 / (length - 1));
    });
    var points = values.map(function (v, i) {
      return [xrange[i], v];
    });

    // If curveFunction is curveBasis then reach straight for D3's native 'interpolateBasis' function (it's faster!)
    if (curveFunction === d3Shape.curveBasis) {
      return d3Interpolate.interpolateBasis(values);
    } else {
      return curvePolator(points, curveFunction, epsilon, samples);
    }
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  /**
   * Data Transform
   *
   * @module
   * @returns {Object}
   */
  function dataTransform(data) {

  	var SINGLE_SERIES = 1;
  	var MULTI_SERIES = 2;
  	var coordinates = ['x', 'y', 'z'];

  	/**
    * Data Type (Single or Multi Series)
    *
    * @param data
    */
  	var dataType = function dataType(data) {
  		return data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;
  	};

  	/************* HELPER FUNCTIONS *******************/

  	/**
    * Union Two Arrays
    *
    * @private
    * @param {Array} array1 - First Array.
    * @param {Array} array2 - First Array.
    * @returns {Array}
    */
  	var union = function union(array1, array2) {
  		var ret = [];
  		var arr = array1.concat(array2);
  		var len = arr.length;
  		var assoc = {};

  		while (len--) {
  			var item = arr[len];

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
  	var decimalPlaces = function decimalPlaces(num) {
  		var match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  		if (!match) {
  			return 0;
  		}

  		return Math.max(0,
  		// Number of digits right of decimal point.
  		(match[1] ? match[1].length : 0) - (
  		// Adjust for scientific notation.
  		match[2] ? +match[2] : 0));
  	};

  	/************* SINGLE SERIES FUNCTIONS ************/

  	/**
    * Row Key (Single Series)
    *
    * @returns {Array}
    */
  	var singleRowKey = function singleRowKey(data) {
  		return d3.values(data)[0];
  	};

  	/**
    * Row Total (Single Series)
    *
    * @returns {number}
    */
  	var singleRowTotal = function singleRowTotal(data) {
  		return d3.sum(data.values, function (d) {
  			return d.value;
  		});
  	};

  	/**
    * Row Value Keys (Single Series)
    *
    * @returns {Array}
    */
  	var singleRowValueKeys = function singleRowValueKeys(data) {
  		return data.values.length ? Object.keys(data.values[0]) : [];
  	};

  	/**
    * Column Keys (Single Series)
    *
    * @returns {Array}
    */
  	var singleColumnKeys = function singleColumnKeys(data) {
  		return d3.values(data.values).map(function (d) {
  			return d.key;
  		});
  	};

  	/**
    * Value Min (Single Series)
    *
    * @returns {number}
    */
  	var singleValueMin = function singleValueMin(data) {
  		return d3.min(data.values, function (d) {
  			return +d.value;
  		});
  	};

  	/**
    * Value Max (Single Series)
    *
    * @returns {number}
    */
  	var singleValueMax = function singleValueMax(data) {
  		return d3.max(data.values, function (d) {
  			return +d.value;
  		});
  	};

  	/**
    * Value Extent (Single Series)
    *
    * @returns {Array}
    */
  	var singleValueExtent = function singleValueExtent(data) {
  		return d3.extent(data.values, function (d) {
  			return +d.value;
  		});
  	};

  	/**
    * Coordinates Min (Single Series)
    *
    * @returns {Object}
    */
  	var singleCoordinatesMin = function singleCoordinatesMin(data) {
  		return coordinates.reduce(function (maximums, coord) {
  			maximums[coord] = d3.min(data.values, function (d) {
  				return +d[coord];
  			});
  			return maximums;
  		}, {});
  	};

  	/**
    * Coordinates Max (Single Series)
    *
    * @returns {Object}
    */
  	var singleCoordinatesMax = function singleCoordinatesMax(data) {
  		return coordinates.reduce(function (maximums, coord) {
  			maximums[coord] = d3.max(data.values, function (d) {
  				return +d[coord];
  			});
  			return maximums;
  		}, {});
  	};

  	/**
    * Coordinates Extent (Single Series)
    *
    * @returns {Object}
    */
  	var singleCoordinatesExtent = function singleCoordinatesExtent(data) {
  		return coordinates.reduce(function (extents, coord) {
  			extents[coord] = d3.extent(data.values, function (d) {
  				return +d[coord];
  			});
  			return extents;
  		}, {});
  	};

  	/**
    * Thresholds (Single Series)
    *
    * @returns {Array}
    */
  	var singleThresholds = function singleThresholds(data) {
  		var bands = [0.15, 0.40, 0.55, 0.90];
  		var min = singleValueMin(data);
  		var max = singleValueMax(data);
  		var distance = max - min;

  		return bands.map(function (v) {
  			return Number((min + v * distance).toFixed(singleMaxDecimalPlace(data)));
  		});
  	};

  	/**
    * Max Decimal Place (Single Series)
    *
    * @returns {number}
    */
  	var singleMaxDecimalPlace = function singleMaxDecimalPlace(data) {
  		return data.values.reduce(function (places, d) {
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
  	var singleSummary = function singleSummary(data) {
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
  		};
  	};

  	/************* MULTI SERIES FUNCTIONS *************/

  	/**
    * Row Keys (Multi Series)
    *
    * @returns {Array}
    */
  	var multiRowKeys = function multiRowKeys(data) {
  		return data.map(function (d) {
  			return d.key;
  		});
  	};

  	/**
    * Row Totals (Multi Series)
    *
    * @returns {Object}
    */
  	var multiRowTotals = function multiRowTotals(data) {
  		return data.reduce(function (totals, row) {
  			totals[row.key] = singleRowTotal(row);
  			return totals;
  		}, {});
  	};

  	/**
    * Row Totals Max (Multi Series)
    *
    * @returns {number}
    */
  	var multiRowTotalsMax = function multiRowTotalsMax(data) {
  		return d3.max(d3.values(multiRowTotals(data)));
  	};

  	/**
    * Row Value Keys (Multi Series)
    *
    * @returns {Array}
    */
  	var multiRowValueKeys = function multiRowValueKeys(data) {
  		return data.length ? Object.keys(data[0].values[0]) : [];
  	};

  	/**
    * Column Keys (Multi Series)
    *
    * @returns {Array}
    */
  	var multiColumnKeys = function multiColumnKeys(data) {
  		return data.reduce(function (keys, row) {
  			var tmp = [];
  			row.values.forEach(function (d, i) {
  				tmp[i] = d.key;
  			});
  			keys = union(tmp, keys);

  			return keys;
  		}, []);
  	};

  	/**
    * Column Totals (Multi Series)
    *
    * @returns {Object}
    */
  	var multiColumnTotals = function multiColumnTotals(data) {
  		return data.reduce(function (totals, row) {
  			row.values.forEach(function (d) {
  				var columnName = d.key;
  				totals[columnName] = typeof totals[columnName] === "undefined" ? 0 : totals[columnName];
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
  	var multiColumnTotalsMax = function multiColumnTotalsMax(data) {
  		return d3.max(d3.values(multiColumnTotals(data)));
  	};

  	/**
    * Value Min (Multi Series)
    *
    * @returns {number}
    */
  	var multiValueMin = function multiValueMin(data) {
  		return d3.min(data.map(function (row) {
  			return singleValueMin(row);
  		}));
  	};

  	/**
    * Value Max (Multi Series)
    *
    * @returns {number}
    */
  	var multiValueMax = function multiValueMax(data) {
  		return d3.max(data.map(function (row) {
  			return singleValueMax(row);
  		}));
  	};

  	/**
    * Value Extent (Multi Series)
    *
    * @returns {Array}
    */
  	var multiValueExtent = function multiValueExtent(data) {
  		return [multiValueMin(data), multiValueMax(data)];
  	};

  	/**
    * Coordinates Min (Multi Series)
    *
    * @returns {Object}
    */
  	var multiCoordinatesMin = function multiCoordinatesMin(data) {
  		return data.map(function (row) {
  			return singleCoordinatesMin(row);
  		}).reduce(function (minimums, row) {
  			coordinates.forEach(function (coord) {
  				minimums[coord] = coord in minimums ? d3.min([minimums[coord], +row[coord]]) : row[coord];
  			});

  			return minimums;
  		}, {});
  	};

  	/**
    * Coordinates Max (Multi Series)
    *
    * @returns {Object}
    */
  	var multiCoordinatesMax = function multiCoordinatesMax(data) {
  		return data.map(function (row) {
  			return singleCoordinatesMax(row);
  		}).reduce(function (maximums, row) {
  			coordinates.forEach(function (coord) {
  				maximums[coord] = coord in maximums ? d3.max([maximums[coord], +row[coord]]) : row[coord];
  			});

  			return maximums;
  		}, {});
  	};

  	/**
    * Coordinates Extent (Multi Series)
    *
    * @returns {Object}
    */
  	var multiCoordinatesExtent = function multiCoordinatesExtent(data) {
  		return coordinates.reduce(function (extents, coord) {
  			extents[coord] = [multiCoordinatesMin(data)[coord], multiCoordinatesMax(data)[coord]];

  			return extents;
  		}, {});
  	};

  	/**
    * Thresholds (Multi Series)
    *
    * @returns {Array}
    */
  	var multiThresholds = function multiThresholds(data) {
  		var bands = [0.15, 0.40, 0.55, 0.90];
  		var min = multiValueMin(data);
  		var max = multiValueMax(data);
  		var distance = max - min;

  		return bands.map(function (v) {
  			return Number((min + v * distance).toFixed(multiMaxDecimalPlace(data)));
  		});
  	};

  	/**
    * Max Decimal Place (Multi Series)
    *
    * @returns {number}
    */
  	var multiMaxDecimalPlace = function multiMaxDecimalPlace(data) {
  		return d3.max(d3.map(data).values().reduce(function (places, row, i) {
  			places[i] = singleMaxDecimalPlace(row);

  			return places;
  		}, []));
  	};

  	/**
    * Multi Series Summary
    *
    * @returns {Object}
    */
  	var multiSummary = function multiSummary(data) {
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
  		};
  	};

  	/************* MAIN FUNCTIONS **********************/

  	/**
    * Summary
    *
    * @returns {Object}
    */
  	var summary = function summary() {
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
  	var rotate = function rotate() {
  		var columnKeys = data.map(function (d) {
  			return d.key;
  		});
  		var rowKeys = data[0].values.map(function (d) {
  			return d.key;
  		});

  		var rotated = rowKeys.map(function (rowKey, rowIndex) {
  			var values = columnKeys.map(function (columnKey, columnIndex) {
  				// Copy the values from the original object
  				var values = _extends({}, data[columnIndex].values[rowIndex]);
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
  	var smooth = function smooth(curveFunction) {
  		var epsilon = 0.00001;
  		var samples = 100;

  		var values = data.values.map(function (d) {
  			return d.value;
  		});

  		var sampler = d3.range(0, 1, 1 / samples);
  		var keyPolator = function keyPolator(t) {
  			return Number((t * samples).toFixed(0)) + 1;
  		};

  		var valuePolator = fromCurve(values, curveFunction, epsilon, samples);

  		var smoothed = {
  			key: data.key,
  			values: sampler.map(function (t) {
  				return {
  					key: keyPolator(t),
  					value: valuePolator(t)
  				};
  			})
  		};

  		return smoothed;
  	};

  	return {
  		summary: summary,
  		rotate: rotate,
  		smooth: smooth
  	};
  }

  // @formatter:off
  /**
   * Definition of CSS color names
   * @type {Array}
   */
  var colorNames = {
  	aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff',
  	aquamarine: '#7fffd4', azure: '#f0ffff', beige: '#f5f5dc',
  	bisque: '#ffe4c4', black: '#000000', blanchedalmond: '#ffebcd',
  	blue: '#0000ff', blueviolet: '#8a2be2', brown: '#a52a2a',
  	burlywood: '#deb887', cadetblue: '#5f9ea0', chartreuse: '#7fff00',
  	chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed',
  	cornsilk: '#fff8dc', crimson: '#dc143c', cyan: '#00ffff',
  	darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b',
  	darkgray: '#a9a9a9', darkgreen: '#006400', darkkhaki: '#bdb76b',
  	darkmagenta: '#8b008b', darkolivegreen: '#556b2f', darkorange: '#ff8c00',
  	darkorchid: '#9932cc', darkred: '#8b0000', darksalmon: '#e9967a',
  	darkseagreen: '#8fbc8f', darkslateblue: '#483d8b', darkslategray: '#2f4f4f',
  	darkturquoise: '#00ced1', darkviolet: '#9400d3', deeppink: '#ff1493',
  	deepskyblue: '#00bfff', dimgray: '#696969', dodgerblue: '#1e90ff',
  	feldspar: '#d19275', firebrick: '#b22222', floralwhite: '#fffaf0',
  	forestgreen: '#228b22', fuchsia: '#ff00ff', gainsboro: '#dcdcdc',
  	ghostwhite: '#f8f8ff', gold: '#ffd700', goldenrod: '#daa520',
  	gray: '#808080', green: '#008000', greenyellow: '#adff2f',
  	honeydew: '#f0fff0', hotpink: '#ff69b4', indianred: '#cd5c5c',
  	indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c',
  	lavender: '#e6e6fa', lavenderblush: '#fff0f5', lawngreen: '#7cfc00',
  	lemonchiffon: '#fffacd', lightblue: '#add8e6', lightcoral: '#f08080',
  	lightcyan: '#e0ffff', lightgoldenrodyellow: '#fafad2', lightgrey: '#d3d3d3',
  	lightgreen: '#90ee90', lightpink: '#ffb6c1', lightsalmon: '#ffa07a',
  	lightseagreen: '#20b2aa', lightskyblue: '#87cefa', lightslateblue: '#8470ff',
  	lightslategray: '#778899', lightsteelblue: '#b0c4de', lightyellow: '#ffffe0',
  	lime: '#00ff00', limegreen: '#32cd32', linen: '#faf0e6',
  	magenta: '#ff00ff', maroon: '#800000', mediumaquamarine: '#66cdaa',
  	mediumblue: '#0000cd', mediumorchid: '#ba55d3', mediumpurple: '#9370d8',
  	mediumseagreen: '#3cb371', mediumslateblue: '#7b68ee', mediumspringgreen: '#00fa9a',
  	mediumturquoise: '#48d1cc', mediumvioletred: '#c71585', midnightblue: '#191970',
  	mintcream: '#f5fffa', mistyrose: '#ffe4e1', moccasin: '#ffe4b5',
  	navajowhite: '#ffdead', navy: '#000080', oldlace: '#fdf5e6',
  	olive: '#808000', olivedrab: '#6b8e23', orange: '#ffa500',
  	orangered: '#ff4500', orchid: '#da70d6', palegoldenrod: '#eee8aa',
  	palegreen: '#98fb98', paleturquoise: '#afeeee', palevioletred: '#d87093',
  	papayawhip: '#ffefd5', peachpuff: '#ffdab9', peru: '#cd853f',
  	pink: '#ffc0cb', plum: '#dda0dd', powderblue: '#b0e0e6',
  	purple: '#800080', red: '#ff0000', rosybrown: '#bc8f8f',
  	royalblue: '#4169e1', saddlebrown: '#8b4513', salmon: '#fa8072',
  	sandybrown: '#f4a460', seagreen: '#2e8b57', seashell: '#fff5ee',
  	sienna: '#a0522d', silver: '#c0c0c0', skyblue: '#87ceeb',
  	slateblue: '#6a5acd', slategray: '#708090', snow: '#fffafa',
  	springgreen: '#00ff7f', steelblue: '#4682b4', tan: '#d2b48c',
  	teal: '#008080', thistle: '#d8bfd8', tomato: '#ff6347',
  	turquoise: '#40e0d0', violet: '#ee82ee', violetred: '#d02090',
  	wheat: '#f5deb3', white: '#ffffff', whitesmoke: '#f5f5f5',
  	yellow: '#ffff00', yellowgreen: '#9acd32'
  };

  /**
   * X3D Color Parser
   *
   * @param {Rgb|Hsl|null} color
   * @returns {string}
   */
  function colorParse(color) {
  	var red = 0;
  	var green = 0;
  	var blue = 0;
  	var alpha = 0;

  	// Already matches X3D RGB
  	var x3dMatch = /^(0+\.?\d*|1\.?0*)\s+(0+\.?\d*|1\.?0*)\s+(0+\.?\d*|1\.?0*)$/.exec(color);
  	if (x3dMatch !== null) {
  		red = +x3dMatch[1];
  		green = +x3dMatch[2];
  		blue = +x3dMatch[3];
  	}

  	// Matches CSS rgb() function
  	var rgbMatch = /^rgb\((\d{1,3}),\s{0,1}(\d{1,3}),\s{0,1}(\d{1,3})\)$/.exec(color);
  	if (rgbMatch !== null) {
  		red = rgbMatch[1] / 255.0;
  		green = rgbMatch[2] / 255.0;
  		blue = rgbMatch[3] / 255.0;
  	}

  	// Matches CSS color name
  	if (colorNames[color]) {
  		color = colorNames[color];
  	}

  	// Hexadecimal color codes
  	if (color.substr && color.substr(0, 1) === "#") {
  		var hex = color.substr(1);
  		var len = hex.length;

  		if (len === 8) {
  			red = parseInt("0x" + hex.substr(0, 2), 16) / 255.0;
  			green = parseInt("0x" + hex.substr(2, 2), 16) / 255.0;
  			blue = parseInt("0x" + hex.substr(4, 2), 16) / 255.0;
  			alpha = parseInt("0x" + hex.substr(6, 2), 16) / 255.0;
  		} else if (len === 6) {
  			red = parseInt("0x" + hex.substr(0, 2), 16) / 255.0;
  			green = parseInt("0x" + hex.substr(2, 2), 16) / 255.0;
  			blue = parseInt("0x" + hex.substr(4, 2), 16) / 255.0;
  			alpha = 1.0;
  		} else if (len === 4) {
  			red = parseInt("0x" + hex.substr(0, 1), 16) / 15.0;
  			green = parseInt("0x" + hex.substr(1, 1), 16) / 15.0;
  			blue = parseInt("0x" + hex.substr(2, 1), 16) / 15.0;
  			alpha = parseInt("0x" + hex.substr(3, 1), 16) / 15.0;
  		} else if (len === 3) {
  			red = parseInt("0x" + hex.substr(0, 1), 16) / 15.0;
  			green = parseInt("0x" + hex.substr(1, 1), 16) / 15.0;
  			blue = parseInt("0x" + hex.substr(2, 1), 16) / 15.0;
  			alpha = 1.0;
  		}
  	}

  	red = red.toFixed(4);
  	green = green.toFixed(4);
  	blue = blue.toFixed(4);

  	return red + ' ' + green + ' ' + blue;
  }

  var colorHelper = /*#__PURE__*/Object.freeze({
    colorParse: colorParse
  });

  /**
   * Reusable 3D Area Chart Component
   *
   * @module
   */
  function componentArea () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 5 };
  	var color = "blue";
  	var transparency = 0.1;
  	var classed = "d3X3dArea";
  	var smoothed = d3.curveMonotoneX;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y;


  		if (typeof xScale === "undefined") {
  			xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);
  		}

  		if (typeof yScale === "undefined") {
  			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);
  		}
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias area
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var areaData = function areaData(data) {
  				var dimensionX = dimensions.x;

  				if (smoothed) {
  					data = dataTransform(data).smooth(smoothed);

  					var keys = d3.extent(data.values.map(function (d) {
  						return d.key;
  					}));
  					xScale = d3.scaleLinear().domain(keys).range([0, dimensionX]);
  				}

  				var values = data.values;

  				// Convert values into IFS coordinates
  				var coords = values.map(function (pointThis, indexThis, array) {
  					var indexNext = indexThis + 1;
  					if (indexNext >= array.length) {
  						return null;
  					}
  					var pointNext = array[indexNext];

  					var x1 = xScale(pointThis.key);
  					var x2 = xScale(pointNext.key);
  					var y1 = yScale(pointThis.value);
  					var y2 = yScale(pointNext.value);

  					return [x1, 0, 0, x1, y1, 0, x2, y2, 0, x2, 0, 0];
  				}).filter(function (d) {
  					return d !== null;
  				});

  				data.point = coords.map(function (d) {
  					return d.join(" ");
  				}).join(" ");
  				data.coordIndex = coords.map(function (d, i) {
  					var offset = i * 4;
  					return [offset, offset + 1, offset + 2, offset + 3, -1].join(" ");
  				}).join(" ");

  				return [data];
  			};

  			var shape = function shape(el) {
  				var shape = el.append("Shape");

  				/*
      // FIXME: x3dom cannot have empty IFS nodes, we must to use .html() rather than .append() & .attr().
      shape.append("IndexedFaceset")
      	.attr("coordIndex", (d) => d.coordIndex)
      	.append("Coordinate")
      	.attr("point", (d) => d.point);
      	shape.append("Appearance")
      	.append("Material")
      	.attr("diffuseColor", colorParse(color))
      	.attr("transparency", transparency);
      */

  				shape.html(function (d) {
  					return "\n\t\t\t\t\t<IndexedFaceset coordIndex=\"" + d.coordIndex + "\" solid=\"false\">\n\t\t\t\t\t\t<Coordinate point=\"" + d.point + "\"></Coordinate>\n\t\t\t\t\t</IndexedFaceset>\n\t\t\t\t\t<Appearance>\n\t\t\t\t\t\t<Material diffuseColor=\"" + colorParse(color) + "\" transparency=\"" + transparency + "\"></Material>\n\t\t\t\t\t</Appearance>\n\t\t\t\t";
  				});
  			};

  			var area = element.selectAll(".area").data(function (d) {
  				return areaData(d);
  			}, function (d) {
  				return d.key;
  			});

  			area.enter().append("Group").classed("area", true).call(shape).merge(area);

  			var areaTransition = area.transition().select("Shape");

  			areaTransition.select("IndexedFaceset").attr("coordIndex", function (d) {
  				return d.coordIndex;
  			}).select("Coordinate").attr("point", function (d) {
  				return d.point;
  			});

  			areaTransition.select("Appearance").select("Material").attr("diffuseColor", colorParse(color));

  			area.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: {number}, y: {number}, z: {number}}} _v - 3D Object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Color Getter / Setter
    *
    * @param {string} _v - Color (e.g. 'red' or '#ff0000').
    * @returns {*}
    */
  	my.color = function (_v) {
  		if (!arguments.length) return color;
  		color = _v;
  		return my;
  	};

  	/**
    * Smooth Interpolation Getter / Setter
    *
    * Options:
    *   d3.curveBasis
    *   d3.curveLinear
    *   d3.curveMonotoneX
    *
    * @param {d3.curve} _v.
    * @returns {*}
    */
  	my.smoothed = function (_v) {
  		if (!arguments.length) return smoothed;
  		smoothed = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Multi Series Area Chart Component
   *
   * @module
   */
  function componentAreaMultiSeries () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["orange", "red", "yellow", "steelblue", "green"];
  	var classed = "d3X3dAreaMultiSeries";
  	var smoothed = d3.curveMonotoneX;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;
  	var colorDomain = [];

  	/* Components */
  	var area = componentArea();

  	/**
    * Unique Array
    *
    * @param {array} array1
    * @param {array} array2
    * @returns {array}
    */
  	var arrayUnique = function arrayUnique(array1, array2) {
  		var array = array1.concat(array2);

  		var a = array.concat();
  		for (var i = 0; i < a.length; ++i) {
  			for (var j = i + 1; j < a.length; ++j) {
  				if (a[i] === a[j]) {
  					a.splice(j--, 1);
  				}
  			}
  		}

  		return a;
  	};

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);

  		zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);

  		colorDomain = arrayUnique(colorDomain, rowKeys);
  		colorScale = d3.scaleOrdinal().domain(colorDomain).range(colors);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias areaMultiSeries
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true);

  			area.xScale(xScale).yScale(yScale).dimensions({
  				x: dimensions.x,
  				y: dimensions.y,
  				z: zScale.bandwidth()
  			}).smoothed(smoothed);

  			var addArea = function addArea(d) {
  				var color = colorScale(d.key);
  				area.color(color);
  				d3.select(this).call(area);
  			};

  			var areaGroup = element.selectAll(".areaGroup").data(function (d) {
  				return d;
  			}, function (d) {
  				return d.key;
  			});

  			areaGroup.enter().append("Transform").classed("areaGroup", true).merge(areaGroup).transition().attr("translation", function (d) {
  				var x = 0;
  				var y = 0;
  				var z = zScale(d.key);
  				return x + " " + y + " " + z;
  			}).each(addArea);

  			areaGroup.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Smooth Interpolation Getter / Setter
    *
    * Options:
    *   d3.curveBasis
    *   d3.curveLinear
    *   d3.curveMonotoneX
    *
    * @param {d3.curve} _v.
    * @returns {*}
    */
  	my.smoothed = function (_v) {
  		if (!arguments.length) return smoothed;
  		smoothed = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Axis Component
   *
   * @module
   */
  function componentAxis () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var color = "black";
  	var classed = "d3X3dAxis";
  	var labelPosition = "proximal";
  	var labelInset = labelPosition === "distal" ? 1 : -1;

  	/* Scale and Axis Options */
  	var scale = void 0;
  	var direction = void 0;
  	var tickDirection = void 0;
  	var tickArguments = [];
  	var tickValues = null;
  	var tickFormat = null;
  	var tickSize = 1.5;
  	var tickPadding = 2.0;

  	var axisDirectionVectors = {
  		x: [1, 0, 0],
  		y: [0, 1, 0],
  		z: [0, 0, 1]
  	};

  	var axisRotationVectors = {
  		x: [1, 1, 0, Math.PI],
  		y: [0, 0, 0, 0],
  		z: [0, 1, 1, Math.PI]
  	};

  	/**
    * Get Axis Direction Vector
    *
    * @private
    * @param {string} axisDir
    * @returns {number[]}
    */
  	var getAxisDirectionVector = function getAxisDirectionVector(axisDir) {
  		return axisDirectionVectors[axisDir];
  	};

  	/**
    * Get Axis Rotation Vector
    *
    * @private
    * @param {string} axisDir
    * @returns {number[]}
    */
  	var getAxisRotationVector = function getAxisRotationVector(axisDir) {
  		return axisRotationVectors[axisDir];
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias axis
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function () {

  			var element = d3.select(this).classed(classed, true);

  			var range = scale.range();
  			var range0 = range[0];
  			var range1 = range[range.length - 1];

  			var axisDirectionVector = getAxisDirectionVector(direction);
  			var tickDirectionVector = getAxisDirectionVector(tickDirection);
  			var axisRotationVector = getAxisRotationVector(direction);
  			var tickRotationVector = getAxisRotationVector(tickDirection);

  			/*
     // FIXME: Currently the tickArguments option does not work.
     const tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
     tickValues = tickValues === null ? tickValuesDefault : tickValues;
     */
  			tickValues = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();

  			var tickFormatDefault = scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : function (d) {
  				return d;
  			};
  			tickFormat = tickFormat === null ? tickFormatDefault : tickFormat;

  			var shape = function shape(el, radius, height, color) {
  				var shape = el.append("Shape");

  				shape.append("Cylinder").attr("radius", radius).attr("height", height);

  				shape.append("Appearance").append("Material").attr("diffuseColor", colorParse(color));
  			};

  			var makeSolid = function makeSolid(el, color) {
  				el.append("Appearance").append("Material").attr("diffuseColor", colorParse(color) || "0 0 0");
  			};

  			// Main Lines
  			var domain = element.selectAll(".domain").data([null]);

  			domain.enter().append("Transform").attr("class", "domain").attr("rotation", axisRotationVector.join(" ")).attr("translation", axisDirectionVector.map(function (d) {
  				return d * (range0 + range1) / 2;
  			}).join(" ")).call(shape, 0.1, range1 - range0, color).merge(domain);

  			domain.exit().remove();

  			// Tick Lines
  			var ticks = element.selectAll(".tick").data(tickValues, function (d) {
  				return d;
  			});

  			ticks.enter().append("Transform").attr("class", "tick").attr("translation", function (t) {
  				return axisDirectionVector.map(function (a) {
  					return scale(t) * a;
  				}).join(" ");
  			}).append("Transform").attr("translation", tickDirectionVector.map(function (d) {
  				return d * tickSize / 2;
  			}).join(" ")).attr("rotation", tickRotationVector.join(" ")).call(shape, 0.05, tickSize, "#e3e3e3").merge(ticks);

  			ticks.transition().attr("translation", function (t) {
  				return axisDirectionVector.map(function (a) {
  					return scale(t) * a;
  				}).join(" ");
  			});

  			ticks.exit().remove();

  			// Labels
  			if (tickFormat !== "") {
  				var labels = element.selectAll(".label").data(tickValues, function (d) {
  					return d;
  				});

  				labels.enter().append("Transform").attr("class", "label").attr("translation", function (t) {
  					return axisDirectionVector.map(function (a) {
  						return scale(t) * a;
  					}).join(" ");
  				}).append("Transform").attr("translation", tickDirectionVector.map(function (d, i) {
  					return labelInset * d * tickPadding + (labelInset + 1) / 2 * tickSize * tickDirectionVector[i];
  				})).append("Billboard").attr("axisOfRotation", "0 0 0").append("Shape").call(makeSolid, "black").append("Text").attr("string", function (d) {
  					return "\"" + tickFormat(d) + "\"";
  				}).append("FontStyle").attr("size", 1.3).attr("family", "\"SANS\"").attr("style", "BOLD").attr("justify", "\"MIDDLE\" \"MIDDLE\"").merge(labels);

  				labels.transition().attr("translation", function (t) {
  					return axisDirectionVector.map(function (a) {
  						return scale(t) * a;
  					}).join(" ");
  				}).select("Transform").attr("translation", tickDirectionVector.map(function (d, i) {
  					return labelInset * d * tickPadding + (labelInset + 1) / 2 * tickSize * tickDirectionVector[i];
  				})).on("start", function () {
  					d3.select(this).select("Billboard").select("Shape").select("Text").attr("string", function (d) {
  						return "\"" + tickFormat(d) + "\"";
  					});
  				});

  				labels.exit().remove();
  			} else {
  				element.selectAll(".label").remove();
  			}
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return my;
  	};

  	/**
    * Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 Scale.
    * @returns {*}
    */
  	my.scale = function (_v) {
  		if (!arguments.length) return scale;
  		scale = _v;
  		return my;
  	};

  	/**
    * Direction Getter / Setter
    *
    * @param {string} _v - Direction of Axis (e.g. 'x', 'y', 'z').
    * @returns {*}
    */
  	my.direction = function (_v) {
  		if (!arguments.length) return direction;
  		direction = _v;
  		return my;
  	};

  	/**
    * Tick Direction Getter / Setter
    *
    * @param {string} _v - Direction of Ticks (e.g. 'x', 'y', 'z').
    * @returns {*}
    */
  	my.tickDirection = function (_v) {
  		if (!arguments.length) return tickDirection;
  		tickDirection = _v;
  		return my;
  	};

  	/**
    * Tick Arguments Getter / Setter
    *
    * @param {Array} _v - Tick arguments.
    * @returns {Array<*>}
    */
  	my.tickArguments = function (_v) {
  		if (!arguments.length) return tickArguments;
  		tickArguments = _v;
  		return my;
  	};

  	/**
    * Tick Values Getter / Setter
    *
    * @param {Array} _v - Tick values.
    * @returns {*}
    */
  	my.tickValues = function (_v) {
  		if (!arguments.length) return tickValues;
  		tickValues = _v;
  		return my;
  	};

  	/**
    * Tick Format Getter / Setter
    *
    * @param {string} _v - Tick format.
    * @returns {*}
    */
  	my.tickFormat = function (_v) {
  		if (!arguments.length) return tickFormat;
  		tickFormat = _v;
  		return my;
  	};

  	/**
    * Tick Size Getter / Setter
    *
    * @param {number} _v - Tick length.
    * @returns {*}
    */
  	my.tickSize = function (_v) {
  		if (!arguments.length) return tickSize;
  		tickSize = _v;
  		return my;
  	};

  	/**
    * Tick Padding Getter / Setter
    *
    * @param {number} _v - Tick padding size.
    * @returns {*}
    */
  	my.tickPadding = function (_v) {
  		if (!arguments.length) return tickPadding;
  		tickPadding = _v;
  		return my;
  	};

  	/**
    * Color Getter / Setter
    *
    * @param {string} _v - Color (e.g. 'red' or '#ff0000').
    * @returns {*}
    */
  	my.color = function (_v) {
  		if (!arguments.length) return color;
  		color = _v;
  		return my;
  	};

  	/**
    * Label Position Getter / Setter
    *
    * @param {string} _v - Position ('proximal' or 'distal')
    * @returns {*}
    */
  	my.labelPosition = function (_v) {
  		if (!arguments.length) return labelPosition;
  		labelPosition = _v;
  		labelInset = labelPosition === "distal" ? 1 : -1;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Multi Plane Axis Component
   *
   * @module
   */
  function componentAxisThreePlane () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["blue", "red", "green"];
  	var classed = "d3X3dAxisThreePlane";
  	var labelPosition = "proximal";

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;

  	/* Components */
  	var xzAxis = componentAxis();
  	var yzAxis = componentAxis();
  	var yxAxis = componentAxis();
  	var zxAxis = componentAxis();

  	/**
    * Constructor
    *
    * @constructor
    * @alias axisThreePlane
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function () {

  			var element = d3.select(this).classed(classed, true);

  			var layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
  			element.selectAll("group").data(layers).enter().append("Group").attr("class", function (d) {
  				return d;
  			});

  			xzAxis.scale(xScale).direction("x").tickDirection("z").tickSize(zScale.range()[1] - zScale.range()[0]).color("blue").labelPosition(labelPosition);

  			yzAxis.scale(yScale).direction("y").tickDirection("z").tickSize(zScale.range()[1] - zScale.range()[0]).color("red").labelPosition(labelPosition);

  			yxAxis.scale(yScale).direction("y").tickDirection("x").tickSize(xScale.range()[1] - xScale.range()[0]).color("red").labelPosition(labelPosition);

  			zxAxis.scale(zScale).direction("z").tickDirection("x").tickSize(xScale.range()[1] - xScale.range()[0]).color("black").labelPosition(labelPosition);

  			// We only want 2 sets of labels on the y axis if they are in distal position.
  			if (labelPosition === "proximal") {
  				yxAxis.tickFormat("");
  			} else {
  				yxAxis.tickFormat(function (d) {
  					return d;
  				});
  			}

  			element.select(".xzAxis").call(xzAxis);

  			element.select(".yzAxis").call(yzAxis);

  			element.select(".yxAxis").call(yxAxis);

  			element.select(".zxAxis").call(zxAxis);
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Label Position Getter / Setter
    *
    * @param {string} _v - Position ('proximal' or 'distal')
    * @returns {*}
    */
  	my.labelPosition = function (_v) {
  		if (!arguments.length) return labelPosition;
  		labelPosition = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Custom Dispatch Events
   *
   * @type {d3.dispatch}
   */
  var dispatch = d3.dispatch("d3X3dClick", "d3X3dMouseOver", "d3X3dMouseOut");

  /**
   * Attach Event Listeners to Shape
   *
   * Detect X3DOM events and convert them into D3 dispatch events.
   *
   * @param el
   */
  function attachEventListners(el) {
  	el.attr("onclick", "d3.x3d.events.forwardEvent(event);").on("click", function (e) {
  		dispatch.call("d3X3dClick", this, e);
  	});

  	el.attr("onmouseover", "d3.x3d.events.forwardEvent(event);").on("mouseover", function (e) {
  		dispatch.call("d3X3dMouseOver", this, e);
  	});

  	el.attr("onmouseout", "d3.x3d.events.forwardEvent(event);").on("mouseout", function (e) {
  		dispatch.call("d3X3dMouseOut", this, e);
  	});
  }

  /**
   * Forward X3DOM Event to D3
   *
   * In X3DOM, it is the canvas which captures onclick events, therefore defining a D3 event handler
   * on an single X3DOM element does not work. A workaround is to define an onclick handler which then
   * forwards the call to the D3 'click' event handler with the event.
   * Note: X3DOM and D3 event members slightly differ, so d3.mouse() function does not work.
   *
   * @param {event} event
   * @see https://bl.ocks.org/hlvoorhees/5376764
   */
  function forwardEvent(event) {
  	var type = event.type;
  	var target = d3.select(event.target);
  	target.on(type)(event);
  }

  /**
   * Show Alert With Event Coordinate
   *
   * @param {event} event
   * @returns {{canvas: {x: (*|number), y: (*|number)}, world: {x: *, y: *, z: *}, page: {x: number, y: number}}}
   */
  function getEventCoordinates(event) {
  	var pagePoint = getEventPagePoint(event);

  	return {
  		world: { x: event.hitPnt[0], y: event.hitPnt[1], z: event.hitPnt[2] },
  		canvas: { x: event.layerX, y: event.layerY },
  		page: { x: pagePoint.x, y: pagePoint.y }
  	};
  }

  /**
   * Inverse of coordinate transform defined by function mousePosition(evt) in x3dom.js
   *
   * @param {event} event
   * @returns {{x: number, y: number}}
   */
  function getEventPagePoint(event) {
  	var pageX = -1;
  	var pageY = -1;

  	var convertPoint = window.webkitConvertPointFromPageToNode;

  	if ("getBoundingClientRect" in document.documentElement) {
  		var holder = getX3domHolder(event);
  		var computedStyle = document.defaultView.getComputedStyle(holder, null);
  		var paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left'));
  		var borderLeftWidth = parseFloat(computedStyle.getPropertyValue('border-left-width'));
  		var paddingTop = parseFloat(computedStyle.getPropertyValue('padding-top'));
  		var borderTopWidth = parseFloat(computedStyle.getPropertyValue('border-top-width'));
  		var box = holder.getBoundingClientRect();
  		var scrolLeft = window.pageXOffset || document.body.scrollLeft;
  		var scrollTop = window.pageYOffset || document.body.scrollTop;
  		pageX = Math.round(event.layerX + (box.left + paddingLeft + borderLeftWidth + scrolLeft));
  		pageY = Math.round(event.layerY + (box.top + paddingTop + borderTopWidth + scrollTop));
  	} else if (convertPoint) {
  		var pagePoint = convertPoint(event.target, new WebKitPoint(0, 0));
  		pageX = Math.round(pagePoint.x);
  		pageY = Math.round(pagePoint.y);
  	} else {
  		x3dom.debug.logError('Unable to find getBoundingClientRect or webkitConvertPointFromPageToNode');
  	}

  	return { x: pageX, y: pageY };
  }

  /**
   * Return the x3d Parent Holder
   *
   * Find clicked element, walk up DOM until we find the parent x3d.
   * Then return the x3d's parent.
   *
   * @param event
   * @returns {*}
   */
  function getX3domHolder(event) {
  	var target = d3.select(event.target);

  	var x3d = target.select(function () {
  		var el = this;
  		while (el.nodeName.toLowerCase() !== "x3d") {
  			el = el.parentElement;
  		}

  		return el;
  	});

  	return x3d.select(function () {
  		return this.parentNode;
  	}).node();
  }

  var events = /*#__PURE__*/Object.freeze({
    dispatch: dispatch,
    attachEventListners: attachEventListners,
    forwardEvent: forwardEvent,
    getEventCoordinates: getEventCoordinates,
    getEventPagePoint: getEventPagePoint,
    getX3domHolder: getX3domHolder
  });

  /**
   * Reusable 3D Bar Chart Component
   *
   * @module
   */
  function componentBars () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 2 };
  	var colors = ["orange", "red", "yellow", "steelblue", "green"];
  	var classed = "d3X3dBars";

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var colorScale = void 0;

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y;


  		if (typeof xScale === "undefined") {
  			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.3);
  		}

  		if (typeof yScale === "undefined") {
  			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);
  		}

  		if (typeof colorScale === "undefined") {
  			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
  		}
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias bars
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var shape = function shape(el) {
  				var shape = el.append("Shape");

  				attachEventListners(shape);

  				shape.append("Box").attr("size", "1.0 1.0 1.0");

  				shape.append("Appearance").append("Material").attr("diffuseColor", function (d) {
  					return colorParse(colorScale(d.key));
  				}).attr("ambientIntensity", 0.1);

  				return shape;
  			};

  			var bars = element.selectAll(".bar").data(function (d) {
  				return d.values;
  			}, function (d) {
  				return d.key;
  			});

  			bars.enter().append("Transform").classed("bar", true).call(shape).merge(bars).transition().attr("scale", function (d) {
  				var x = xScale.bandwidth();
  				var y = yScale(d.value);
  				var z = dimensions.z;
  				return x + " " + y + " " + z;
  			}).attr("translation", function (d) {
  				var x = xScale(d.key);
  				var y = yScale(d.value) / 2;
  				var z = 0.0;
  				return x + " " + y + " " + z;
  			});

  			bars.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  /**
   * Reusable 3D Multi Series Bar Chart Component
   *
   * @module
   */
  function componentBarsMultiSeries () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["orange", "red", "yellow", "steelblue", "green"];
  	var classed = "d3X3dBarsMultiSeries";

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;

  	/* Components */
  	var bars = componentBars();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.5);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();

  		zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.7);

  		colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias barsMultiSeries
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true);

  			bars.xScale(xScale).yScale(yScale).dimensions({
  				x: dimensions.x,
  				y: dimensions.y,
  				z: zScale.bandwidth()
  			}).colors(colors);

  			var addBars = function addBars() {
  				d3.select(this).call(bars);
  			};

  			var barGroup = element.selectAll(".barGroup").data(function (d) {
  				return d;
  			}, function (d) {
  				return d.key;
  			});

  			barGroup.enter().append("Transform").classed("barGroup", true).merge(barGroup).transition().attr("translation", function (d) {
  				var x = 0;
  				var y = 0;
  				var z = zScale(d.key);
  				return x + " " + y + " " + z;
  			}).each(addBars);

  			barGroup.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Bubble Chart Component
   *
   * @module
   */
  function componentBubbles () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var color = "orange";
  	var classed = "d3X3dBubbles";

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var sizeScale = void 0;
  	var sizeDomain = [0.5, 4.0];

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    valueExtent = _dataTransform$summar.valueExtent,
  		    coordinatesMax = _dataTransform$summar.coordinatesMax;

  		var maxX = coordinatesMax.x,
  		    maxY = coordinatesMax.y,
  		    maxZ = coordinatesMax.z;
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		if (typeof xScale === "undefined") {
  			xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);
  		}

  		if (typeof yScale === "undefined") {
  			yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);
  		}

  		if (typeof zScale === "undefined") {
  			zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
  		}

  		if (typeof sizeScale === "undefined") {
  			sizeScale = d3.scaleLinear().domain(valueExtent).range(sizeDomain);
  		}
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias bubbles
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var shape = function shape(el) {
  				var shape = el.append("Shape");

  				attachEventListners(shape);

  				shape.append("Sphere").attr("radius", function (d) {
  					return sizeScale(d.value);
  				});

  				shape.append("Appearance").append("Material").attr("diffuseColor", colorParse(color)).attr("ambientIntensity", 0.1);

  				return shape;
  			};

  			var bubbles = element.selectAll(".bubble").data(function (d) {
  				return d.values;
  			}, function (d) {
  				return d.key;
  			});

  			bubbles.enter().append("Transform").attr("class", "bubble").call(shape).merge(bubbles).transition().attr("translation", function (d) {
  				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
  			}).select("Shape").select("Appearance").select("Material").attr("diffuseColor", colorParse(color));

  			bubbles.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Size Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 size scale.
    * @returns {*}
    */
  	my.sizeScale = function (_v) {
  		if (!arguments.length) return sizeScale;
  		sizeScale = _v;
  		return my;
  	};

  	/**
    * Size Domain Getter / Setter
    *
    * @param {number[]} _v - Size min and max (e.g. [1, 9]).
    * @returns {*}
    */
  	my.sizeDomain = function (_v) {
  		if (!arguments.length) return sizeDomain;
  		sizeDomain = _v;
  		return my;
  	};

  	/**
    * Color Getter / Setter
    *
    * @param {string} _v - Color (e.g. 'red' or '#ff0000').
    * @returns {*}
    */
  	my.color = function (_v) {
  		if (!arguments.length) return color;
  		color = _v;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  /**
   * Reusable 3D Multi Series Bubble Chart Component
   *
   * @module
   */
  function componentBubblesMultiSeries () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["green", "red", "yellow", "steelblue", "orange"];
  	var classed = "d3X3dBubblesMultiSeries";

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;
  	var sizeScale = void 0;
  	var sizeDomain = [0.5, 3.0];
  	var colorDomain = [];

  	/* Components */
  	var bubbles = componentBubbles();

  	/**
    * Unique Array
    *
    * @param {array} array1
    * @param {array} array2
    * @returns {array}
    */
  	var arrayUnique = function arrayUnique(array1, array2) {
  		var array = array1.concat(array2);

  		var a = array.concat();
  		for (var i = 0; i < a.length; ++i) {
  			for (var j = i + 1; j < a.length; ++j) {
  				if (a[i] === a[j]) {
  					a.splice(j--, 1);
  				}
  			}
  		}

  		return a;
  	};

  	/**
   	 /**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    valueExtent = _dataTransform$summar.valueExtent,
  		    coordinatesMax = _dataTransform$summar.coordinatesMax;

  		var maxX = coordinatesMax.x,
  		    maxY = coordinatesMax.y,
  		    maxZ = coordinatesMax.z;
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);

  		zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);

  		colorDomain = arrayUnique(colorDomain, rowKeys);
  		colorScale = d3.scaleOrdinal().domain(colorDomain).range(colors);

  		sizeScale = d3.scaleLinear().domain(valueExtent).range(sizeDomain);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias bubblesMultiSeries
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true);

  			bubbles.xScale(xScale).yScale(yScale).zScale(zScale).sizeScale(sizeScale);

  			var addBubbles = function addBubbles(d) {
  				var color = colorScale(d.key);
  				bubbles.color(color);
  				d3.select(this).datum(d).call(bubbles);
  			};

  			var bubbleGroup = element.selectAll(".bubbleGroup").data(function (d) {
  				return d;
  			}, function (d) {
  				return d.key;
  			});

  			bubbleGroup.enter().append("Group").classed("bubbleGroup", true).merge(bubbleGroup).transition().each(addBubbles);

  			bubbleGroup.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 Scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 Scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Size Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 size scale.
    * @returns {*}
    */
  	my.sizeScale = function (_v) {
  		if (!arguments.length) return sizeScale;
  		sizeScale = _v;
  		return my;
  	};

  	/**
    * Size Domain Getter / Setter
    *
    * @param {number[]} _v - Size min and max (e.g. [0.5, 3.0]).
    * @returns {*}
    */
  	my.sizeDomain = function (_v) {
  		if (!arguments.length) return sizeDomain;
  		sizeDomain = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  /**
   * Reusable 3D Crosshair Component
   *
   * @module
   */
  function componentCrosshair () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["blue", "red", "green"];
  	var classed = "d3X3dCrosshair";
  	var radius = 0.1;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;

  	/**
    * Constructor
    *
    * @constructor
    * @alias crosshair
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var xOff = dimensions["x"] / 2;
  			var yOff = dimensions["y"] / 2;
  			var zOff = dimensions["z"] / 2;
  			var xVal = xScale(data.x);
  			var yVal = yScale(data.y);
  			var zVal = zScale(data.z);

  			var positionVectors = {
  				x: [xOff, yVal, zVal],
  				y: [xVal, yOff, zVal],
  				z: [xVal, yVal, zOff]
  			};

  			function getPositionVector(axisDir) {
  				return positionVectors[axisDir].join(" ");
  			}

  			var rotationVectors = {
  				x: [1, 1, 0, Math.PI],
  				y: [0, 0, 0, 0],
  				z: [0, 1, 1, Math.PI]
  			};

  			function getRotationVector(axisDir) {
  				return rotationVectors[axisDir].join(" ");
  			}

  			var colorScale = d3.scaleOrdinal().domain(Object.keys(dimensions)).range(colors);

  			// Origin Ball
  			var ballSelect = element.selectAll(".ball").data([data]);

  			var ball = ballSelect.enter().append("Transform").attr("translation", function (d) {
  				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
  			}).classed("ball", true).append("Shape");

  			ball.append("Appearance").append("Material").attr("diffuseColor", colorParse("blue"));

  			ball.append("Sphere").attr("radius", 0.3);

  			ball.merge(ballSelect);

  			ballSelect.transition().ease(d3.easeQuadOut).attr("translation", function (d) {
  				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
  			});

  			// Crosshair Lines
  			var lineSelect = element.selectAll(".line").data(Object.keys(dimensions));

  			var line = lineSelect.enter().append("Transform").classed("line", true).attr("translation", function (d) {
  				return getPositionVector(d);
  			}).attr("rotation", function (d) {
  				return getRotationVector(d);
  			}).append("Shape");

  			line.append("cylinder").attr("radius", radius).attr("height", function (d) {
  				return dimensions[d];
  			});

  			line.append("Appearance").append("Material").attr("diffuseColor", function (d) {
  				return colorParse(colorScale(d));
  			});

  			line.merge(lineSelect);

  			lineSelect.transition().ease(d3.easeQuadOut).attr("translation", function (d) {
  				return getPositionVector(d);
  			});
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Label Component
   *
   * @module
   */
  function componentLabel () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var color = "black";
  	var classed = "d3X3dLabel";
  	var offset = 0;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;

  	/**
    * Constructor
    *
    * @constructor
    * @alias label
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var makeSolid = function makeSolid(el, color) {
  				el.append("Appearance").append("Material").attr("diffuseColor", colorParse(color) || "0 0 0");
  			};

  			var labelSelect = element.selectAll(".label").data([data]);

  			var label = labelSelect.enter().append("Transform").attr("translation", function (d) {
  				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
  			}).classed("label", true).append("Billboard").attr("axisOfRotation", "0 0 0").append("Transform").attr("translation", function (d) {
  				return offset + " " + offset + " " + offset;
  			}).append("Shape").call(makeSolid, color).append("Text").attr("string", function (d) {
  				return d.key;
  			}).append("FontStyle").attr("size", 1).attr("family", "SANS").attr("style", "BOLD").attr("justify", "START");

  			label.merge(labelSelect);

  			labelSelect.transition().ease(d3.easeQuadOut).attr("translation", function (d) {
  				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
  			});
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Getter / Setter
    *
    * @param {string} _v - Color (e.g. 'red' or '#ff0000').
    * @returns {*}
    */
  	my.color = function (_v) {
  		if (!arguments.length) return color;
  		color = _v;
  		return my;
  	};

  	/**
    * Offset Getter / Setter
    *
    * @param {number} _v - Label offset number.
    * @returns {*}
    */
  	my.offset = function (_v) {
  		if (!arguments.length) return offset;
  		offset = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable X3D Light Component
   *
   * @module
   */
  function componentLight () {

  	/* Default Properties */
  	var direction = "1 0 -1";
  	var intensity = 0.5;
  	var shadowIntensity = 0;

  	/**
    * Constructor
    *
    * @constructor
    * @alias light
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function () {
  			var light = d3.select(this).selectAll("DirectionalLight").data([null]);

  			light.enter().append("DirectionalLight").attr("on", true).attr("direction", direction).attr("intensity", intensity).attr("shadowIntensity", shadowIntensity).merge(light);
  		});
  	};

  	/**
    * Light Direction Getter / Setter
    *
    * @param {string} _v - Direction vector (e.g. "1 0 -1").
    * @returns {*}
    */
  	my.direction = function (_v) {
  		if (!arguments.length) return direction;
  		direction = _v;
  		return my;
  	};

  	/**
    * Light Intensity Getter / Setter
    *
    * @param {number} _v - Intensity value.
    * @returns {*}
    */
  	my.intensity = function (_v) {
  		if (!arguments.length) return intensity;
  		intensity = _v;
  		return my;
  	};

  	/**
    * Shadow Intensity Getter / Setter
    *
    * @param {number} _v - Intensity value.
    * @returns {*}
    */
  	my.shadowIntensity = function (_v) {
  		if (!arguments.length) return shadowIntensity;
  		shadowIntensity = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Ribbon Chart Component
   *
   * @module
   */
  function componentRibbon () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 5 };
  	var color = "red";
  	var transparency = 0.1;
  	var classed = "d3X3dRibbon";
  	var smoothed = d3.curveBasis;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y;


  		if (typeof xScale === "undefined") {
  			xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);
  		}

  		if (typeof yScale === "undefined") {
  			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);
  		}
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias ribbon
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var ribbonData = function ribbonData(data) {
  				var dimensionX = dimensions.x;

  				if (smoothed) {
  					data = dataTransform(data).smooth(smoothed);

  					var keys = d3.extent(data.values.map(function (d) {
  						return d.key;
  					}));
  					xScale = d3.scaleLinear().domain(keys).range([0, dimensionX]);
  				}

  				var values = data.values;

  				// Convert values into IFS coordinates
  				var coords = values.map(function (pointThis, indexThis, array) {
  					var indexNext = indexThis + 1;
  					if (indexNext >= array.length) {
  						return null;
  					}
  					var pointNext = array[indexNext];

  					var x1 = xScale(pointThis.key);
  					var x2 = xScale(pointNext.key);
  					var y1 = yScale(pointThis.value);
  					var y2 = yScale(pointNext.value);
  					var z1 = 1 - dimensions.z / 2;
  					var z2 = dimensions.z / 2;

  					return [x1, y1, z1, x1, y1, z2, x2, y2, z2, x2, y2, z1];
  				}).filter(function (d) {
  					return d !== null;
  				});

  				data.point = coords.map(function (d) {
  					return d.join(" ");
  				}).join(" ");
  				data.coordIndex = coords.map(function (d, i) {
  					var offset = i * 4;
  					return [offset, offset + 1, offset + 2, offset + 3, -1].join(" ");
  				}).join(" ");

  				return [data];
  			};

  			var shape = function shape(el) {
  				var shape = el.append("Shape");

  				/*
      // FIXME: x3dom cannot have empty IFS nodes, we must to use .html() rather than .append() & .attr().
      shape.append("IndexedFaceset")
      	.attr("coordIndex", (d) => d.coordIndex)
      	.append("Coordinate")
      	.attr("point", (d) => d.point);
      	shape.append("Appearance")
      	.append("Material")
      	.attr("diffuseColor", colorParse(color))
      	.attr("transparency", transparency);
      */

  				shape.html(function (d) {
  					return "\n\t\t\t\t\t<IndexedFaceset coordIndex=\"" + d.coordIndex + "\"  solid=\"false\">\n\t\t\t\t\t\t<Coordinate point=\"" + d.point + "\"></Coordinate>\n\t\t\t\t\t</IndexedFaceset>\n\t\t\t\t\t<Appearance>\n\t\t\t\t\t\t<Material diffuseColor=\"" + colorParse(color) + "\" transparency=\"" + transparency + "\"></Material>\n\t\t\t\t\t</Appearance>\n\t\t\t\t";
  				});
  			};

  			var ribbon = element.selectAll(".ribbon").data(function (d) {
  				return ribbonData(d);
  			}, function (d) {
  				return d.key;
  			});

  			ribbon.enter().append("Group").classed("ribbon", true).call(shape).merge(ribbon);

  			var ribbonTransition = ribbon.transition().select("Shape");

  			ribbonTransition.select("IndexedFaceset").attr("coordIndex", function (d) {
  				return d.coordIndex;
  			}).select("Coordinate").attr("point", function (d) {
  				return d.point;
  			});

  			ribbonTransition.select("Appearance").select("Material").attr("diffuseColor", colorParse(color));

  			ribbon.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: {number}, y: {number}, z: {number}}} _v - 3D Object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Color Getter / Setter
    *
    * @param {string} _v - Color (e.g. 'red' or '#ff0000').
    * @returns {*}
    */
  	my.color = function (_v) {
  		if (!arguments.length) return color;
  		color = _v;
  		return my;
  	};

  	/**
    * Smooth Interpolation Getter / Setter
    *
    * Options:
    *   d3.curveBasis
    *   d3.curveLinear
    *   d3.curveMonotoneX
    *
    * @param {d3.curve} _v.
    * @returns {*}
    */
  	my.smoothed = function (_v) {
  		if (!arguments.length) return smoothed;
  		smoothed = _v;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  /**
   * Reusable 3D Multi Series Ribbon Chart Component
   *
   * @module
   */
  function componentRibbonMultiSeries () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["orange", "red", "yellow", "steelblue", "green"];
  	var classed = "d3X3dRibbonMultiSeries";
  	var smoothed = d3.curveBasis;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;
  	var colorDomain = [];

  	/* Components */
  	var ribbon = componentRibbon();

  	/**
    * Unique Array
    *
    * @param {array} array1
    * @param {array} array2
    * @returns {array}
    */
  	var arrayUnique = function arrayUnique(array1, array2) {
  		var array = array1.concat(array2);

  		var a = array.concat();
  		for (var i = 0; i < a.length; ++i) {
  			for (var j = i + 1; j < a.length; ++j) {
  				if (a[i] === a[j]) {
  					a.splice(j--, 1);
  				}
  			}
  		}

  		return a;
  	};

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);

  		zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);

  		colorDomain = arrayUnique(colorDomain, rowKeys);
  		colorScale = d3.scaleOrdinal().domain(colorDomain).range(colors);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias ribbonMultiSeries
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true);

  			ribbon.xScale(xScale).yScale(yScale).dimensions({
  				x: dimensions.x,
  				y: dimensions.y,
  				z: zScale.bandwidth()
  			}).smoothed(smoothed);

  			var addRibbon = function addRibbon(d) {
  				var color = colorScale(d.key);
  				ribbon.color(color);
  				d3.select(this).call(ribbon);
  			};

  			var ribbonGroup = element.selectAll(".ribbonGroup").data(function (d) {
  				return d;
  			}, function (d) {
  				return d.key;
  			});

  			ribbonGroup.enter().append("Transform").classed("ribbonGroup", true).merge(ribbonGroup).transition().attr("translation", function (d) {
  				var x = 0;
  				var y = 0;
  				var z = zScale(d.key);
  				return x + " " + y + " " + z;
  			}).each(addRibbon);

  			ribbonGroup.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Smooth Interpolation Getter / Setter
    *
    * Options:
    *   d3.curveBasis
    *   d3.curveLinear
    *   d3.curveMonotoneX
    *
    * @param {d3.curve} _v.
    * @returns {*}
    */
  	my.smoothed = function (_v) {
  		if (!arguments.length) return smoothed;
  		smoothed = _v;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  /**
   * Reusable 3D Surface Area Component
   *
   * @module
   */
  function componentSurface () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["orange", "maroon"];
  	var classed = "d3X3dSurface";

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;

  	/**
    * Array to String
    *
    * @private
    * @param {array} arr
    * @returns {string}
    */
  	var array2dToString = function array2dToString(arr) {
  		return arr.reduce(function (a, b) {
  			return a.concat(b);
  		}, []).reduce(function (a, b) {
  			return a.concat(b);
  		}, []).join(" ");
  	};

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		if (typeof xScale === "undefined") {
  			xScale = d3.scalePoint().domain(rowKeys).range([0, dimensionX]);
  		}

  		if (typeof yScale === "undefined") {
  			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);
  		}

  		if (typeof zScale === "undefined") {
  			zScale = d3.scalePoint().domain(columnKeys).range([0, dimensionZ]);
  		}

  		if (typeof colorScale === "undefined") {
  			colorScale = d3.scaleLinear().domain(valueExtent).range(colors).interpolate(d3.interpolateLab);
  		}
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias surface
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true);

  			var surfaceData = function surfaceData(data) {

  				var coordPoints = function coordPoints(Y) {
  					return Y.map(function (X) {
  						return X.values.map(function (d) {
  							return [xScale(X.key), yScale(d.value), zScale(d.key)];
  						});
  					});
  				};

  				var coordIndex = function coordIndex(Y) {
  					var ny = Y.length;
  					var nx = Y[0].values.length;

  					return Array.apply(0, Array(ny - 1)).map(function (_, j) {
  						return Array.apply(0, Array(nx - 1)).map(function (_, i) {
  							var start = i + j * nx;
  							return [start, start + 1, start + nx + 1, start + nx, start, -1];
  						});
  					});
  				};

  				var colorFaceSet = function colorFaceSet(Y) {
  					return Y.map(function (X) {
  						return X.values.map(function (d) {
  							var color = d3.color(colorScale(d.value));
  							return colorParse(color);
  						});
  					});
  				};

  				data.coordIndex = array2dToString(coordIndex(data));
  				data.point = array2dToString(coordPoints(data));
  				data.color = array2dToString(colorFaceSet(data));

  				return [data];
  			};

  			var surface = element.selectAll(".surface").data(function (d) {
  				return surfaceData(d);
  			}, function (d) {
  				return d.key;
  			});

  			var surfaceSelect = surface.enter().append("Shape").classed("surface", true).append("IndexedFaceset").attr("coordIndex", function (d) {
  				return d.coordIndex;
  			}).attr("solid", false);

  			surfaceSelect.append("Coordinate").attr("point", function (d) {
  				return d.point;
  			});

  			surfaceSelect.append("Color").attr("color", function (d) {
  				return d.color;
  			});

  			surfaceSelect.merge(surface);

  			var surfaceTransition = surface.transition().select("IndexedFaceset").attr("coordIndex", function (d) {
  				return d.coordIndex;
  			});

  			surfaceTransition.select("coordinate").attr("point", function (d) {
  				return d.point;
  			});

  			surfaceTransition.select("color").attr("color", function (d) {
  				return d.color;
  			});

  			surface.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  var config = {};
  config.EPSILON = 1e-12;
  config.debug = true;
  config.precision = 4;
  config.printTypes = false;
  config.printDegrees = false;
  config.printRowMajor = true;
  function checkNumber(value) {
    if (!Number.isFinite(value)) {
      throw new Error("Invalid number ".concat(value));
    }

    return value;
  }

  function round(value) {
    return Math.round(value / config.EPSILON) * config.EPSILON;
  }

  function formatValue(value) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$precision = _ref.precision,
        precision = _ref$precision === void 0 ? config.precision || 4 : _ref$precision;

    value = round(value);
    return parseFloat(value.toPrecision(precision));
  }
  function isArray(value) {
    return Array.isArray(value) || ArrayBuffer.isView(value) && value.length !== undefined;
  }
  function equals(a, b) {
    if (isArray(a) && isArray(b)) {
      if (a === b) {
        return true;
      }

      if (a.length !== b.length) {
        return false;
      }

      for (var i = 0; i < a.length; ++i) {
        if (!equals(a[i], b[i])) {
          return false;
        }
      }

      return true;
    }

    return Math.abs(a - b) <= config.EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
  }

  var MathArray = function (_Array) {
    _inherits(MathArray, _Array);

    function MathArray() {
      _classCallCheck(this, MathArray);

      return _possibleConstructorReturn(this, _getPrototypeOf(MathArray).apply(this, arguments));
    }

    _createClass(MathArray, [{
      key: "clone",
      value: function clone() {
        return new this.constructor().copy(this).check();
      }
    }, {
      key: "copy",
      value: function copy(array) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = array[i];
        }

        return this.check();
      }
    }, {
      key: "set",
      value: function set() {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = (i < 0 || arguments.length <= i ? undefined : arguments[i]) || 0;
        }

        return this.check();
      }
    }, {
      key: "fromArray",
      value: function fromArray(array) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = array[i + offset];
        }

        return this.check();
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.formatString(config);
      }
    }, {
      key: "formatString",
      value: function formatString(opts) {
        var string = '';

        for (var i = 0; i < this.ELEMENTS; ++i) {
          string += (i > 0 ? ', ' : '') + formatValue(this[i], opts);
        }

        return "".concat(opts.printTypes ? this.constructor.name : '', "[").concat(string, "]");
      }
    }, {
      key: "toArray",
      value: function toArray() {
        var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        for (var i = 0; i < this.ELEMENTS; ++i) {
          array[offset + i] = this[i];
        }

        return array;
      }
    }, {
      key: "toFloat32Array",
      value: function toFloat32Array() {
        return new Float32Array(this);
      }
    }, {
      key: "equals",
      value: function equals$1(array) {
        if (!array || this.length !== array.length) {
          return false;
        }

        for (var i = 0; i < this.ELEMENTS; ++i) {
          if (!equals(this[i], array[i])) {
            return false;
          }
        }

        return true;
      }
    }, {
      key: "exactEquals",
      value: function exactEquals(array) {
        if (!array || this.length !== array.length) {
          return false;
        }

        for (var i = 0; i < this.ELEMENTS; ++i) {
          if (this[i] !== array[i]) {
            return false;
          }
        }

        return true;
      }
    }, {
      key: "negate",
      value: function negate() {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = -this[i];
        }

        return this.check();
      }
    }, {
      key: "inverse",
      value: function inverse() {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = 1 / this[i];
        }

        return this.check();
      }
    }, {
      key: "lerp",
      value: function lerp(a, b, t) {
        if (t === undefined) {
          t = b;
          b = a;
          a = this;
        }

        for (var i = 0; i < this.ELEMENTS; ++i) {
          var ai = a[i];
          this[i] = ai + t * (b[i] - ai);
        }

        return this.check();
      }
    }, {
      key: "min",
      value: function min(vector) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = Math.min(vector[i], this[i]);
        }

        return this.check();
      }
    }, {
      key: "max",
      value: function max(vector) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = Math.max(vector[i], this[i]);
        }

        return this.check();
      }
    }, {
      key: "clamp",
      value: function clamp(minVector, maxVector) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = Math.min(Math.max(this[i], minVector[i]), maxVector[i]);
        }

        return this.check();
      }
    }, {
      key: "validate",
      value: function validate() {
        var valid = this.length === this.ELEMENTS;

        for (var i = 0; i < this.ELEMENTS; ++i) {
          valid = valid && Number.isFinite(this[i]);
        }

        return valid;
      }
    }, {
      key: "check",
      value: function check() {
        if (config.debug && !this.validate(this)) {
          throw new Error("math.gl: ".concat(this.constructor.name, " some fields set to invalid numbers'"));
        }

        return this;
      }
    }, {
      key: "sub",
      value: function sub(a) {
        return this.subtract(a);
      }
    }, {
      key: "setScalar",
      value: function setScalar(a) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = a;
        }

        return this.check();
      }
    }, {
      key: "addScalar",
      value: function addScalar(a) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] += a;
        }

        return this.check();
      }
    }, {
      key: "subScalar",
      value: function subScalar(a) {
        return this.addScalar(-a);
      }
    }, {
      key: "multiplyScalar",
      value: function multiplyScalar(a) {
        return this.scale(a);
      }
    }, {
      key: "divideScalar",
      value: function divideScalar(a) {
        return this.scale(1 / a);
      }
    }, {
      key: "clampScalar",
      value: function clampScalar(min, max) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = Math.min(Math.max(this[i], min), max);
        }

        return this.check();
      }
    }]);

    return MathArray;
  }(_wrapNativeSuper(Array));

  var assert = function assert(x, m) {
    if (!x) {
      throw new Error(m);
    }
  };

  var Vector = function (_MathArray) {
    _inherits(Vector, _MathArray);

    function Vector() {
      _classCallCheck(this, Vector);

      return _possibleConstructorReturn(this, _getPrototypeOf(Vector).apply(this, arguments));
    }

    _createClass(Vector, [{
      key: "len",
      value: function len() {
        return Math.sqrt(this.lengthSquared());
      }
    }, {
      key: "magnitude",
      value: function magnitude() {
        return Math.sqrt(this.lengthSquared());
      }
    }, {
      key: "lengthSquared",
      value: function lengthSquared() {
        var length = 0;

        for (var i = 0; i < this.ELEMENTS; ++i) {
          length += this[i] * this[i];
        }

        return length;
      }
    }, {
      key: "distance",
      value: function distance(mathArray) {
        return Math.sqrt(this.distanceSquared(mathArray));
      }
    }, {
      key: "distanceSquared",
      value: function distanceSquared(mathArray) {
        var length = 0;

        for (var i = 0; i < this.ELEMENTS; ++i) {
          var dist = this[i] - mathArray[i];
          length += dist * dist;
        }

        return checkNumber(length);
      }
    }, {
      key: "dot",
      value: function dot(mathArray) {
        var product = 0;

        for (var i = 0; i < this.ELEMENTS; ++i) {
          product += this[i] * mathArray[i];
        }

        return checkNumber(product);
      }
    }, {
      key: "normalize",
      value: function normalize() {
        var length = this.magnitude();

        if (length !== 0) {
          for (var i = 0; i < this.ELEMENTS; ++i) {
            this[i] /= length;
          }
        }

        return this.check();
      }
    }, {
      key: "add",
      value: function add() {
        for (var _len = arguments.length, vectors = new Array(_len), _key = 0; _key < _len; _key++) {
          vectors[_key] = arguments[_key];
        }

        for (var _i = 0; _i < vectors.length; _i++) {
          var vector = vectors[_i];

          for (var i = 0; i < this.ELEMENTS; ++i) {
            this[i] += vector[i];
          }
        }

        return this.check();
      }
    }, {
      key: "subtract",
      value: function subtract() {
        for (var _len2 = arguments.length, vectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          vectors[_key2] = arguments[_key2];
        }

        for (var _i2 = 0; _i2 < vectors.length; _i2++) {
          var vector = vectors[_i2];

          for (var i = 0; i < this.ELEMENTS; ++i) {
            this[i] -= vector[i];
          }
        }

        return this.check();
      }
    }, {
      key: "multiply",
      value: function multiply() {
        for (var _len3 = arguments.length, vectors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          vectors[_key3] = arguments[_key3];
        }

        for (var _i3 = 0; _i3 < vectors.length; _i3++) {
          var vector = vectors[_i3];

          for (var i = 0; i < this.ELEMENTS; ++i) {
            this[i] *= vector[i];
          }
        }

        return this.check();
      }
    }, {
      key: "divide",
      value: function divide() {
        for (var _len4 = arguments.length, vectors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          vectors[_key4] = arguments[_key4];
        }

        for (var _i4 = 0; _i4 < vectors.length; _i4++) {
          var vector = vectors[_i4];

          for (var i = 0; i < this.ELEMENTS; ++i) {
            this[i] /= vector[i];
          }
        }

        return this.check();
      }
    }, {
      key: "scale",
      value: function scale(_scale) {
        if (Array.isArray(_scale)) {
          return this.multiply(_scale);
        }

        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] *= _scale;
        }

        return this.check();
      }
    }, {
      key: "scaleAndAdd",
      value: function scaleAndAdd(vector, scale) {
        for (var i = 0; i < this.ELEMENTS; ++i) {
          this[i] = this[i] * scale + vector[i];
        }

        return this.check();
      }
    }, {
      key: "lengthSq",
      value: function lengthSq() {
        return this.lengthSquared();
      }
    }, {
      key: "distanceTo",
      value: function distanceTo(vector) {
        return this.distance(vector);
      }
    }, {
      key: "distanceToSquared",
      value: function distanceToSquared(vector) {
        return this.distanceSquared(vector);
      }
    }, {
      key: "getComponent",
      value: function getComponent(i) {
        assert(i >= 0 && i < this.ELEMENTS, 'index is out of range');
        return checkNumber(this[i]);
      }
    }, {
      key: "setComponent",
      value: function setComponent(i, value) {
        assert(i >= 0 && i < this.ELEMENTS, 'index is out of range');
        this[i] = value;
        return this.check();
      }
    }, {
      key: "addVectors",
      value: function addVectors(a, b) {
        return this.copy(a).add(b);
      }
    }, {
      key: "subVectors",
      value: function subVectors(a, b) {
        return this.copy(a).subtract(b);
      }
    }, {
      key: "multiplyVectors",
      value: function multiplyVectors(a, b) {
        return this.copy(a).multiply(b);
      }
    }, {
      key: "addScaledVector",
      value: function addScaledVector(a, b) {
        return this.add(new this.constructor(a).multiplyScalar(b));
      }
    }, {
      key: "x",
      get: function get() {
        return this[0];
      },
      set: function set(value) {
        return this[0] = checkNumber(value);
      }
    }, {
      key: "y",
      get: function get() {
        return this[1];
      },
      set: function set(value) {
        return this[1] = checkNumber(value);
      }
    }]);

    return Vector;
  }(MathArray);

  /**
   * Common utilities
   * @module glMatrix
   */
  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
  var degree = Math.PI / 180;
  if (!Math.hypot) Math.hypot = function () {
    var y = 0,
        i = arguments.length;

    while (i--) {
      y += arguments[i] * arguments[i];
    }

    return Math.sqrt(y);
  };

  /**
   * 2 Dimensional Vector
   * @module vec2
   */

  /**
   * Creates a new, empty vec2
   *
   * @returns {vec2} a new 2D vector
   */

  function create() {
    var out = new ARRAY_TYPE(2);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }

    return out;
  }
  /**
   * Computes the cross product of two vec2's
   * Note that the cross product must by definition produce a 3D vector
   *
   * @param {vec3} out the receiving vector
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @returns {vec3} out
   */

  function cross(out, a, b) {
    var z = a[0] * b[1] - a[1] * b[0];
    out[0] = out[1] = 0;
    out[2] = z;
    return out;
  }
  /**
   * Transforms the vec2 with a mat3
   * 3rd vector component is implicitly '1'
   *
   * @param {vec2} out the receiving vector
   * @param {vec2} a the vector to transform
   * @param {mat3} m matrix to transform with
   * @returns {vec2} out
   */

  function transformMat3(out, a, m) {
    var x = a[0],
        y = a[1];
    out[0] = m[0] * x + m[3] * y + m[6];
    out[1] = m[1] * x + m[4] * y + m[7];
    return out;
  }
  /**
   * Perform some operation over an array of vec2s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach = function () {
    var vec = create();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 2;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
      }

      return a;
    };
  }();

  var Vector2 = function (_Vector) {
    _inherits(Vector2, _Vector);

    function Vector2() {
      var _this;

      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      _classCallCheck(this, Vector2);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Vector2).call(this, 2));

      if (Array.isArray(x) && arguments.length === 1) {
        _this.copy(x);
      } else {
        _this.set(x, y);
      }

      return _this;
    }

    _createClass(Vector2, [{
      key: "cross",
      value: function cross$1(vector) {
        cross(this, this, vector);
        return this.check();
      }
    }, {
      key: "horizontalAngle",
      value: function horizontalAngle() {
        return Math.atan2(this.y, this.x);
      }
    }, {
      key: "verticalAngle",
      value: function verticalAngle() {
        return Math.atan2(this.x, this.y);
      }
    }, {
      key: "operation",
      value: function operation(_operation) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _operation.apply(void 0, [this, this].concat(args));

        return this.check();
      }
    }, {
      key: "ELEMENTS",
      get: function get() {
        return 2;
      }
    }]);

    return Vector2;
  }(Vector);

  /**
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */

  function create$1() {
    var out = new ARRAY_TYPE(3);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    return out;
  }
  /**
   * Calculates the length of a vec3
   *
   * @param {vec3} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.hypot(x, y, z);
  }
  /**
   * Creates a new vec3 initialized with the given values
   *
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @returns {vec3} a new 3D vector
   */

  function fromValues(x, y, z) {
    var out = new ARRAY_TYPE(3);
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  }
  /**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to normalize
   * @returns {vec3} out
   */

  function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec3's
   *
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the first operand
   * @param {vec3} b the second operand
   * @returns {vec3} out
   */

  function cross$1(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2];
    var bx = b[0],
        by = b[1],
        bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  /**
   * Transforms the vec3 with a mat3.
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to transform
   * @param {mat3} m the 3x3 matrix to transform with
   * @returns {vec3} out
   */

  function transformMat3$1(out, a, m) {
    var x = a[0],
        y = a[1],
        z = a[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  /**
   * Rotate a 3D vector around the x-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */

  function rotateX(out, a, b, c) {
    var p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[0];
    r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
    r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c); //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  /**
   * Rotate a 3D vector around the y-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */

  function rotateY(out, a, b, c) {
    var p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c); //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  /**
   * Rotate a 3D vector around the z-axis
   * @param {vec3} out The receiving vec3
   * @param {vec3} a The vec3 point to rotate
   * @param {vec3} b The origin of the rotation
   * @param {Number} c The angle of rotation
   * @returns {vec3} out
   */

  function rotateZ(out, a, b, c) {
    var p = [],
        r = []; //Translate point to the origin

    p[0] = a[0] - b[0];
    p[1] = a[1] - b[1];
    p[2] = a[2] - b[2]; //perform rotation

    r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
    r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
    r[2] = p[2]; //translate to correct position

    out[0] = r[0] + b[0];
    out[1] = r[1] + b[1];
    out[2] = r[2] + b[2];
    return out;
  }
  /**
   * Get the angle between two 3D vectors
   * @param {vec3} a The first operand
   * @param {vec3} b The second operand
   * @returns {Number} The angle in radians
   */

  function angle(a, b) {
    var tempA = fromValues(a[0], a[1], a[2]);
    var tempB = fromValues(b[0], b[1], b[2]);
    normalize(tempA, tempA);
    normalize(tempB, tempB);
    var cosine = dot(tempA, tempB);

    if (cosine > 1.0) {
      return 0;
    } else if (cosine < -1.0) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  }
  /**
   * Alias for {@link vec3.length}
   * @function
   */

  var len = length;
  /**
   * Perform some operation over an array of vec3s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$1 = function () {
    var vec = create$1();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 3;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }

      return a;
    };
  }();

  var ORIGIN = [0, 0, 0];

  var Vector3 = function (_Vector) {
    _inherits(Vector3, _Vector);

    function Vector3() {
      var _this;

      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      _classCallCheck(this, Vector3);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Vector3).call(this, 3));

      if (Array.isArray(x) && arguments.length === 1) {
        _this.copy(x);
      } else {
        _this.set(x, y, z);
      }

      return _this;
    }

    _createClass(Vector3, [{
      key: "angle",
      value: function angle$1(vector) {
        return angle(this, vector);
      }
    }, {
      key: "cross",
      value: function cross(vector) {
        cross$1(this, this, vector);
        return this.check();
      }
    }, {
      key: "rotateX",
      value: function rotateX$1(_ref) {
        var radians = _ref.radians,
            _ref$origin = _ref.origin,
            origin = _ref$origin === void 0 ? ORIGIN : _ref$origin;
        rotateX(this, this, origin, radians);
        return this.check();
      }
    }, {
      key: "rotateY",
      value: function rotateY$1(_ref2) {
        var radians = _ref2.radians,
            _ref2$origin = _ref2.origin,
            origin = _ref2$origin === void 0 ? ORIGIN : _ref2$origin;
        rotateY(this, this, origin, radians);
        return this.check();
      }
    }, {
      key: "rotateZ",
      value: function rotateZ$1(_ref3) {
        var radians = _ref3.radians,
            _ref3$origin = _ref3.origin,
            origin = _ref3$origin === void 0 ? ORIGIN : _ref3$origin;
        rotateZ(this, this, origin, radians);
        return this.check();
      }
    }, {
      key: "operation",
      value: function operation(_operation) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _operation.apply(void 0, [this, this].concat(args));

        return this.check();
      }
    }, {
      key: "ELEMENTS",
      get: function get() {
        return 3;
      }
    }, {
      key: "z",
      get: function get() {
        return this[2];
      },
      set: function set(value) {
        return this[2] = checkNumber(value);
      }
    }]);

    return Vector3;
  }(Vector);

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function validateVector(v, length) {
    if (v.length !== length) {
      return false;
    }

    return v.every(Number.isFinite);
  }

  /**
   * 3x3 Matrix
   * @module mat3
   */

  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */

  function create$2() {
    var out = new ARRAY_TYPE(9);

    if (ARRAY_TYPE != Float32Array) {
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[5] = 0;
      out[6] = 0;
      out[7] = 0;
    }

    out[0] = 1;
    out[4] = 1;
    out[8] = 1;
    return out;
  }
  /**
   * Transpose the values of a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */

  function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
      var a01 = a[1],
          a02 = a[2],
          a12 = a[5];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a01;
      out[5] = a[7];
      out[6] = a02;
      out[7] = a12;
    } else {
      out[0] = a[0];
      out[1] = a[3];
      out[2] = a[6];
      out[3] = a[1];
      out[4] = a[4];
      out[5] = a[7];
      out[6] = a[2];
      out[7] = a[5];
      out[8] = a[8];
    }

    return out;
  }
  /**
   * Inverts a mat3
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the source matrix
   * @returns {mat3} out
   */

  function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    var b01 = a22 * a11 - a12 * a21;
    var b11 = -a22 * a10 + a12 * a20;
    var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

    var det = a00 * b01 + a01 * b11 + a02 * b21;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
    return out;
  }
  /**
   * Calculates the determinant of a mat3
   *
   * @param {mat3} a the source matrix
   * @returns {Number} determinant of a
   */

  function determinant(a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
  }
  /**
   * Multiplies two mat3's
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the first operand
   * @param {mat3} b the second operand
   * @returns {mat3} out
   */

  function multiply(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2];
    var a10 = a[3],
        a11 = a[4],
        a12 = a[5];
    var a20 = a[6],
        a21 = a[7],
        a22 = a[8];
    var b00 = b[0],
        b01 = b[1],
        b02 = b[2];
    var b10 = b[3],
        b11 = b[4],
        b12 = b[5];
    var b20 = b[6],
        b21 = b[7],
        b22 = b[8];
    out[0] = b00 * a00 + b01 * a10 + b02 * a20;
    out[1] = b00 * a01 + b01 * a11 + b02 * a21;
    out[2] = b00 * a02 + b01 * a12 + b02 * a22;
    out[3] = b10 * a00 + b11 * a10 + b12 * a20;
    out[4] = b10 * a01 + b11 * a11 + b12 * a21;
    out[5] = b10 * a02 + b11 * a12 + b12 * a22;
    out[6] = b20 * a00 + b21 * a10 + b22 * a20;
    out[7] = b20 * a01 + b21 * a11 + b22 * a21;
    out[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return out;
  }
  /**
   * Translate a mat3 by the given vector
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to translate
   * @param {vec2} v vector to translate by
   * @returns {mat3} out
   */

  function translate(out, a, v) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a10 = a[3],
        a11 = a[4],
        a12 = a[5],
        a20 = a[6],
        a21 = a[7],
        a22 = a[8],
        x = v[0],
        y = v[1];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a10;
    out[4] = a11;
    out[5] = a12;
    out[6] = x * a00 + y * a10 + a20;
    out[7] = x * a01 + y * a11 + a21;
    out[8] = x * a02 + y * a12 + a22;
    return out;
  }
  /**
   * Rotates a mat3 by the given angle
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat3} out
   */

  function rotate(out, a, rad) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a10 = a[3],
        a11 = a[4],
        a12 = a[5],
        a20 = a[6],
        a21 = a[7],
        a22 = a[8],
        s = Math.sin(rad),
        c = Math.cos(rad);
    out[0] = c * a00 + s * a10;
    out[1] = c * a01 + s * a11;
    out[2] = c * a02 + s * a12;
    out[3] = c * a10 - s * a00;
    out[4] = c * a11 - s * a01;
    out[5] = c * a12 - s * a02;
    out[6] = a20;
    out[7] = a21;
    out[8] = a22;
    return out;
  }
  /**
   * Scales the mat3 by the dimensions in the given vec2
   *
   * @param {mat3} out the receiving matrix
   * @param {mat3} a the matrix to rotate
   * @param {vec2} v the vec2 to scale the matrix by
   * @returns {mat3} out
   **/

  function scale(out, a, v) {
    var x = v[0],
        y = v[1];
    out[0] = x * a[0];
    out[1] = x * a[1];
    out[2] = x * a[2];
    out[3] = y * a[3];
    out[4] = y * a[4];
    out[5] = y * a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    return out;
  }
  /**
  * Calculates a 3x3 matrix from the given quaternion
  *
  * @param {mat3} out mat3 receiving operation result
  * @param {quat} q Quaternion to create matrix from
  *
  * @returns {mat3} out
  */

  function fromQuat(out, q) {
    var x = q[0],
        y = q[1],
        z = q[2],
        w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[3] = yx - wz;
    out[6] = zx + wy;
    out[1] = yx + wz;
    out[4] = 1 - xx - zz;
    out[7] = zy - wx;
    out[2] = zx - wy;
    out[5] = zy + wx;
    out[8] = 1 - xx - yy;
    return out;
  }

  var IDENTITY = [1, 0, 0, 0, 1, 0, 0, 0, 1];

  var Matrix3 = function (_MathArray) {
    _inherits(Matrix3, _MathArray);

    function Matrix3() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _classCallCheck(this, Matrix3);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Matrix3).call(this, 9));

      if (Array.isArray(args[0]) && arguments.length === 1) {
        _this.copy(args[0]);
      } else {
        _this.identity();
      }

      return _this;
    }

    _createClass(Matrix3, [{
      key: "setRowMajor",
      value: function setRowMajor() {
        var m00 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var m01 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var m02 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var m10 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var m11 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var m12 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var m20 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var m21 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var m22 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
        this[0] = m00;
        this[1] = m10;
        this[2] = m20;
        this[3] = m01;
        this[4] = m11;
        this[5] = m21;
        this[6] = m02;
        this[7] = m12;
        this[8] = m22;
        return this.check();
      }
    }, {
      key: "setColumnMajor",
      value: function setColumnMajor() {
        var m00 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var m10 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var m20 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var m01 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var m11 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var m21 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var m02 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var m12 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var m22 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
        this[0] = m00;
        this[1] = m10;
        this[2] = m20;
        this[3] = m01;
        this[4] = m11;
        this[5] = m21;
        this[6] = m02;
        this[7] = m12;
        this[8] = m22;
        return this.check();
      }
    }, {
      key: "copy",
      value: function copy(array) {
        return this.setColumnMajor.apply(this, _toConsumableArray(array));
      }
    }, {
      key: "set",
      value: function set() {
        return this.setColumnMajor.apply(this, arguments);
      }
    }, {
      key: "getElement",
      value: function getElement(i, j) {
        var columnMajor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        return columnMajor ? this[i * 3 + j] : this[j * 3 + i];
      }
    }, {
      key: "setElement",
      value: function setElement(i, j, value) {
        var columnMajor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (columnMajor) {
          this[i * 3 + j] = checkNumber(value);
        } else {
          this[j * 3 + i] = checkNumber(value);
        }

        return this;
      }
    }, {
      key: "determinant",
      value: function determinant$1() {
        return determinant(this);
      }
    }, {
      key: "identity",
      value: function identity() {
        for (var i = 0; i < IDENTITY.length; ++i) {
          this[i] = IDENTITY[i];
        }

        return this.check();
      }
    }, {
      key: "fromQuaternion",
      value: function fromQuaternion(q) {
        fromQuat(this, q);
        return this.check();
      }
    }, {
      key: "transpose",
      value: function transpose$1() {
        transpose(this, this);
        return this.check();
      }
    }, {
      key: "invert",
      value: function invert$1() {
        invert(this, this);
        return this.check();
      }
    }, {
      key: "multiplyLeft",
      value: function multiplyLeft(a) {
        multiply(this, a, this);
        return this.check();
      }
    }, {
      key: "multiplyRight",
      value: function multiplyRight(a) {
        multiply(this, this, a);
        return this.check();
      }
    }, {
      key: "rotate",
      value: function rotate$1(radians) {
        rotate(this, this, radians);
        return this.check();
      }
    }, {
      key: "scale",
      value: function scale$1(factor) {
        if (Array.isArray(factor)) {
          scale(this, this, factor);
        } else {
          scale(this, this, [factor, factor, factor]);
        }

        return this.check();
      }
    }, {
      key: "translate",
      value: function translate$1(vec) {
        translate(this, this, vec);
        return this.check();
      }
    }, {
      key: "transformVector2",
      value: function transformVector2(vector, out) {
        out = out || new Vector2();
        transformMat3(out, vector, this);
        validateVector(out, 2);
        return out;
      }
    }, {
      key: "transformVector3",
      value: function transformVector3(vector, out) {
        out = out || new Vector3();
        transformMat3$1(out, vector, this);
        validateVector(out, 3);
        return out;
      }
    }, {
      key: "transformVector",
      value: function transformVector(vector, out) {
        switch (vector.length) {
          case 2:
            return this.transformVector2(vector, out);

          case 3:
            return this.transformVector3(vector, out);

          default:
            throw new Error('Illegal vector');
        }
      }
    }, {
      key: "ELEMENTS",
      get: function get() {
        return 9;
      }
    }]);

    return Matrix3;
  }(MathArray);

  /**
   * 4 Dimensional Vector
   * @module vec4
   */

  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */

  function create$3() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }

    return out;
  }
  /**
   * Set the components of a vec4 to the given values
   *
   * @param {vec4} out the receiving vector
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {vec4} out
   */

  function set(out, x, y, z, w) {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }
  /**
   * Adds two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {vec4} out
   */

  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }
  /**
   * Scales a vec4 by a scalar number
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec4} out
   */

  function scale$1(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  /**
   * Calculates the length of a vec4
   *
   * @param {vec4} a vector to calculate length of
   * @returns {Number} length of a
   */

  function length$1(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return Math.hypot(x, y, z, w);
  }
  /**
   * Calculates the squared length of a vec4
   *
   * @param {vec4} a vector to calculate squared length of
   * @returns {Number} squared length of a
   */

  function squaredLength(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return x * x + y * y + z * z + w * w;
  }
  /**
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a vector to normalize
   * @returns {vec4} out
   */

  function normalize$1(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    var len = x * x + y * y + z * z + w * w;

    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }

    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
    return out;
  }
  /**
   * Calculates the dot product of two vec4's
   *
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @returns {Number} dot product of a and b
   */

  function dot$1(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  /**
   * Performs a linear interpolation between two vec4's
   *
   * @param {vec4} out the receiving vector
   * @param {vec4} a the first operand
   * @param {vec4} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {vec4} out
   */

  function lerp(out, a, b, t) {
    var ax = a[0];
    var ay = a[1];
    var az = a[2];
    var aw = a[3];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    out[3] = aw + t * (b[3] - aw);
    return out;
  }
  /**
   * Perform some operation over an array of vec4s.
   *
   * @param {Array} a the array of vectors to iterate over
   * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
   * @param {Number} offset Number of elements to skip at the beginning of the array
   * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
   * @param {Function} fn Function to call for each vector in the array
   * @param {Object} [arg] additional argument to pass to fn
   * @returns {Array} a
   * @function
   */

  var forEach$2 = function () {
    var vec = create$3();
    return function (a, stride, offset, count, fn, arg) {
      var i, l;

      if (!stride) {
        stride = 4;
      }

      if (!offset) {
        offset = 0;
      }

      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }

      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }

      return a;
    };
  }();

  /**
   * Quaternion
   * @module quat
   */

  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */

  function create$4() {
    var out = new ARRAY_TYPE(4);

    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }

    out[3] = 1;
    return out;
  }
  /**
   * Set a quat to the identity quaternion
   *
   * @param {quat} out the receiving quaternion
   * @returns {quat} out
   */

  function identity(out) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 1;
    return out;
  }
  /**
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out the receiving quaternion
   * @param {vec3} axis the axis around which to rotate
   * @param {Number} rad the angle in radians
   * @returns {quat} out
   **/

  function setAxisAngle(out, axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    out[0] = s * axis[0];
    out[1] = s * axis[1];
    out[2] = s * axis[2];
    out[3] = Math.cos(rad);
    return out;
  }
  /**
   * Multiplies two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {quat} out
   */

  function multiply$1(out, a, b) {
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    out[0] = ax * bw + aw * bx + ay * bz - az * by;
    out[1] = ay * bw + aw * by + az * bx - ax * bz;
    out[2] = az * bw + aw * bz + ax * by - ay * bx;
    out[3] = aw * bw - ax * bx - ay * by - az * bz;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the X axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */

  function rotateX$1(out, a, rad) {
    rad *= 0.5;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = Math.sin(rad),
        bw = Math.cos(rad);
    out[0] = ax * bw + aw * bx;
    out[1] = ay * bw + az * bx;
    out[2] = az * bw - ay * bx;
    out[3] = aw * bw - ax * bx;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the Y axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */

  function rotateY$1(out, a, rad) {
    rad *= 0.5;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var by = Math.sin(rad),
        bw = Math.cos(rad);
    out[0] = ax * bw - az * by;
    out[1] = ay * bw + aw * by;
    out[2] = az * bw + ax * by;
    out[3] = aw * bw - ay * by;
    return out;
  }
  /**
   * Rotates a quaternion by the given angle about the Z axis
   *
   * @param {quat} out quat receiving operation result
   * @param {quat} a quat to rotate
   * @param {number} rad angle (in radians) to rotate
   * @returns {quat} out
   */

  function rotateZ$1(out, a, rad) {
    rad *= 0.5;
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bz = Math.sin(rad),
        bw = Math.cos(rad);
    out[0] = ax * bw + ay * bz;
    out[1] = ay * bw - ax * bz;
    out[2] = az * bw + aw * bz;
    out[3] = aw * bw - az * bz;
    return out;
  }
  /**
   * Calculates the W component of a quat from the X, Y, and Z components.
   * Assumes that quaternion is 1 unit in length.
   * Any existing W component will be ignored.
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate W component of
   * @returns {quat} out
   */

  function calculateW(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2];
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return out;
  }
  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  function slerp(out, a, b, t) {
    // benchmarks:
    //    http://jsperf.com/quaternion-slerp-implementations
    var ax = a[0],
        ay = a[1],
        az = a[2],
        aw = a[3];
    var bx = b[0],
        by = b[1],
        bz = b[2],
        bw = b[3];
    var omega, cosom, sinom, scale0, scale1; // calc cosine

    cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    } // calculate coefficients


    if (1.0 - cosom > EPSILON) {
      // standard case (slerp)
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      // "from" and "to" quaternions are very close
      //  ... so we can do a linear interpolation
      scale0 = 1.0 - t;
      scale1 = t;
    } // calculate final values


    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  /**
   * Calculates the inverse of a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate inverse of
   * @returns {quat} out
   */

  function invert$1(out, a) {
    var a0 = a[0],
        a1 = a[1],
        a2 = a[2],
        a3 = a[3];
    var dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    var invDot = dot ? 1.0 / dot : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

    out[0] = -a0 * invDot;
    out[1] = -a1 * invDot;
    out[2] = -a2 * invDot;
    out[3] = a3 * invDot;
    return out;
  }
  /**
   * Calculates the conjugate of a quat
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quat to calculate conjugate of
   * @returns {quat} out
   */

  function conjugate(out, a) {
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    out[3] = a[3];
    return out;
  }
  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   * @param {quat} out the receiving quaternion
   * @param {mat3} m rotation matrix
   * @returns {quat} out
   * @function
   */

  function fromMat3(out, m) {
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    var fTrace = m[0] + m[4] + m[8];
    var fRoot;

    if (fTrace > 0.0) {
      // |w| > 1/2, may as well choose w > 1/2
      fRoot = Math.sqrt(fTrace + 1.0); // 2w

      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot; // 1/(4w)

      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      // |w| <= 1/2
      var i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      var j = (i + 1) % 3;
      var k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }

    return out;
  }
  /**
   * Set the components of a quat to the given values
   *
   * @param {quat} out the receiving quaternion
   * @param {Number} x X component
   * @param {Number} y Y component
   * @param {Number} z Z component
   * @param {Number} w W component
   * @returns {quat} out
   * @function
   */

  var set$1 = set;
  /**
   * Adds two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {quat} out
   * @function
   */

  var add$1 = add;
  /**
   * Scales a quat by a scalar number
   *
   * @param {quat} out the receiving vector
   * @param {quat} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {quat} out
   * @function
   */

  var scale$2 = scale$1;
  /**
   * Calculates the dot product of two quat's
   *
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @returns {Number} dot product of a and b
   * @function
   */

  var dot$2 = dot$1;
  /**
   * Performs a linear interpolation between two quat's
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   * @function
   */

  var lerp$1 = lerp;
  /**
   * Calculates the length of a quat
   *
   * @param {quat} a vector to calculate length of
   * @returns {Number} length of a
   */

  var length$2 = length$1;
  /**
   * Calculates the squared length of a quat
   *
   * @param {quat} a vector to calculate squared length of
   * @returns {Number} squared length of a
   * @function
   */

  var squaredLength$1 = squaredLength;
  /**
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a quaternion to normalize
   * @returns {quat} out
   * @function
   */

  var normalize$2 = normalize$1;
  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {vec3} a the initial vector
   * @param {vec3} b the destination vector
   * @returns {quat} out
   */

  var rotationTo = function () {
    var tmpvec3 = create$1();
    var xUnitVec3 = fromValues(1, 0, 0);
    var yUnitVec3 = fromValues(0, 1, 0);
    return function (out, a, b) {
      var dot$1 = dot(a, b);

      if (dot$1 < -0.999999) {
        cross$1(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross$1(tmpvec3, yUnitVec3, a);
        normalize(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross$1(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$1;
        return normalize$2(out, out);
      }
    };
  }();
  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {quat} a the first operand
   * @param {quat} b the second operand
   * @param {quat} c the third operand
   * @param {quat} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */

  var sqlerp = function () {
    var temp1 = create$4();
    var temp2 = create$4();
    return function (out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  }();
  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {vec3} view  the vector representing the viewing direction
   * @param {vec3} right the vector representing the local "right" direction
   * @param {vec3} up    the vector representing the local "up" direction
   * @returns {quat} out
   */

  var setAxes = function () {
    var matr = create$2();
    return function (out, view, right, up) {
      matr[0] = right[0];
      matr[3] = right[1];
      matr[6] = right[2];
      matr[1] = up[0];
      matr[4] = up[1];
      matr[7] = up[2];
      matr[2] = -view[0];
      matr[5] = -view[1];
      matr[8] = -view[2];
      return normalize$2(out, fromMat3(out, matr));
    };
  }();

  var IDENTITY_QUATERNION = [0, 0, 0, 1];

  var Quaternion = function (_MathArray) {
    _inherits(Quaternion, _MathArray);

    function Quaternion() {
      var _this;

      var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      _classCallCheck(this, Quaternion);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Quaternion).call(this, 4));

      if (Array.isArray(x) && arguments.length === 1) {
        _this.copy(x);
      } else {
        _this.set(x, y, z, w);
      }

      return _this;
    }

    _createClass(Quaternion, [{
      key: "fromMatrix3",
      value: function fromMatrix3(m) {
        fromMat3(this, m);
        return this.check();
      }
    }, {
      key: "fromValues",
      value: function fromValues(x, y, z, w) {
        return this.set(x, y, z, w);
      }
    }, {
      key: "identity",
      value: function identity$1() {
        identity(this);
        return this.check();
      }
    }, {
      key: "length",
      value: function length() {
        return length$2(this);
      }
    }, {
      key: "squaredLength",
      value: function squaredLength(a) {
        return squaredLength$1(this);
      }
    }, {
      key: "dot",
      value: function dot(a, b) {
        if (b !== undefined) {
          throw new Error('Quaternion.dot only takes one argument');
        }

        return dot$2(this, a);
      }
    }, {
      key: "rotationTo",
      value: function rotationTo$1(vectorA, vectorB) {
        rotationTo(this, vectorA, vectorB);
        return this.check();
      }
    }, {
      key: "add",
      value: function add(a, b) {
        if (b !== undefined) {
          throw new Error('Quaternion.add only takes one argument');
        }

        add$1(this, a);
        return this.check();
      }
    }, {
      key: "calculateW",
      value: function calculateW$1() {
        calculateW(this, this);
        return this.check();
      }
    }, {
      key: "conjugate",
      value: function conjugate$1() {
        conjugate(this, this);
        return this.check();
      }
    }, {
      key: "invert",
      value: function invert() {
        invert$1(this, this);
        return this.check();
      }
    }, {
      key: "lerp",
      value: function lerp(a, b, t) {
        lerp$1(this, a, b, t);
        return this.check();
      }
    }, {
      key: "multiply",
      value: function multiply(a, b) {
        if (b !== undefined) {
          throw new Error('Quaternion.multiply only takes one argument');
        }

        multiply$1(this, this, a);
        return this.check();
      }
    }, {
      key: "normalize",
      value: function normalize() {
        normalize$2(this, this);
        return this.check();
      }
    }, {
      key: "rotateX",
      value: function rotateX(rad) {
        rotateX$1(this, this, rad);
        return this.check();
      }
    }, {
      key: "rotateY",
      value: function rotateY(rad) {
        rotateY$1(this, this, rad);
        return this.check();
      }
    }, {
      key: "rotateZ",
      value: function rotateZ(rad) {
        rotateZ$1(this, this, rad);
        return this.check();
      }
    }, {
      key: "scale",
      value: function scale(b) {
        scale$2(this, this, b);
        return this.check();
      }
    }, {
      key: "set",
      value: function set(i, j, k, l) {
        set$1(this, i, j, k, l);
        return this.check();
      }
    }, {
      key: "setAxisAngle",
      value: function setAxisAngle$1(axis, rad) {
        setAxisAngle(this, axis, rad);
        return this.check();
      }
    }, {
      key: "slerp",
      value: function slerp$1(_ref) {
        var _ref$start = _ref.start,
            start = _ref$start === void 0 ? IDENTITY_QUATERNION : _ref$start,
            target = _ref.target,
            ratio = _ref.ratio;
        slerp(this, start, target, ratio);
        return this.check();
      }
    }, {
      key: "ELEMENTS",
      get: function get() {
        return 4;
      }
    }, {
      key: "x",
      get: function get() {
        return this[0];
      },
      set: function set(value) {
        return this[0] = checkNumber(value);
      }
    }, {
      key: "y",
      get: function get() {
        return this[1];
      },
      set: function set(value) {
        return this[1] = checkNumber(value);
      }
    }, {
      key: "z",
      get: function get() {
        return this[2];
      },
      set: function set(value) {
        return this[2] = checkNumber(value);
      }
    }, {
      key: "w",
      get: function get() {
        return this[3];
      },
      set: function set(value) {
        return this[3] = checkNumber(value);
      }
    }]);

    return Quaternion;
  }(MathArray);

  /**
   * Reusable 3D Vector Fields Component
   *
   * @module
   */
  function componentVectorFields () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = d3.interpolateRdYlGn;
  	var classed = "d3X3dVectorFields";

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;
  	var sizeScale = void 0;
  	var sizeDomain = [2.0, 5.0];

  	/**
    * Vector Field Function
    *
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} value
    * @returns {{vx: number, vy: number, vz: number}}
    */
  	var vectorFunction = function vectorFunction(x, y, z) {

  		return {
  			vx: x,
  			vy: y,
  			vz: z
  		};
  	};

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    coordinatesMax = _dataTransform$summar.coordinatesMax,
  		    coordinatesMin = _dataTransform$summar.coordinatesMin;

  		var minX = coordinatesMin.x,
  		    minY = coordinatesMin.y,
  		    minZ = coordinatesMin.z;
  		var maxX = coordinatesMax.x,
  		    maxY = coordinatesMax.y,
  		    maxZ = coordinatesMax.z;
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		var extent = d3.extent(data.values.map(function (f) {
  			var vx = void 0,
  			    vy = void 0,
  			    vz = void 0;
  			if ('vx' in f) {
  				vx = f.vx;
  				vy = f.vy;
  				vz = f.vz;
  			} else {
  				var _vectorFunction = vectorFunction(f.x, f.y, f.z, f.value);

  				vx = _vectorFunction.vx;
  				vy = _vectorFunction.vy;
  				vz = _vectorFunction.vz;
  			}

  			return new x3dom.fields.SFVec3f(vx, vy, vz).length();
  		}));

  		if (typeof xScale === "undefined") {
  			xScale = d3.scaleLinear().domain([minX, maxX]).range([0, dimensionX]);
  		}

  		if (typeof yScale === "undefined") {
  			yScale = d3.scaleLinear().domain([minY, maxY]).range([0, dimensionY]);
  		}

  		if (typeof zScale === "undefined") {
  			zScale = d3.scaleLinear().domain([minZ, maxZ]).range([0, dimensionZ]);
  		}

  		if (typeof colorScale === "undefined") {
  			colorScale = d3.scaleSequential().domain(extent.slice().reverse()).interpolator(colors);
  		}

  		if (typeof sizeScale === "undefined") {
  			sizeScale = d3.scaleLinear().domain(extent).range(sizeDomain);
  		}
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias vectorFields
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {
  			init(data);

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var vectorData = function vectorData(d) {
  				return d.values.map(function (f) {

  					var vx = void 0,
  					    vy = void 0,
  					    vz = void 0;
  					if ('vx' in f) {
  						vx = f.vx;
  						vy = f.vy;
  						vz = f.vz;
  					} else {
  						var _vectorFunction2 = vectorFunction(f.x, f.y, f.z, f.value);

  						vx = _vectorFunction2.vx;
  						vy = _vectorFunction2.vy;
  						vz = _vectorFunction2.vz;
  					}

  					var fromVector = new x3dom.fields.SFVec3f(0, 1, 0);
  					var toVector = new x3dom.fields.SFVec3f(vx, vy, vz);
  					var qDir = x3dom.fields.Quaternion.rotateFromTo(fromVector, toVector);
  					var rot = qDir.toAxisAngle();
  					console.log(rot);

  					var fromVector2 = new Vector3(0, 1, 0);
  					var toVector2 = new Vector3(vx, vy, vz);
  					var foo = fromVector2.cross(toVector2);
  					// let qDir2 = new Quaternion().rotationTo(toVector2, fromVector2);
  					var qDir2 = new Quaternion(vx, vy, vz).fromMatrix3(new Matrix3([0, 1, 0]));
  					console.log(qDir2);

  					/*
       const jim1 = new Vector3(vx, vy, vz).angle(new Matrix3([0, 1, 0]));
       console.log(jim1);
        */

  					var rot2 = [{ x: qDir2.x, y: qDir2.y, z: qDir2.z }, qDir2.w];
  					console.log(rot2);

  					if (!toVector.length()) {
  						// If there is no vector length return null (and filter them out after)
  						return null;
  					}

  					// Calculate transform-translation attr
  					f.translation = xScale(f.x) + " " + yScale(f.y) + " " + zScale(f.z);

  					// Calculate vector length
  					f.value = toVector.length();

  					// Calculate transform-rotation attr
  					//f.rotation = rot[0].x + " " + rot[0].y + " " + rot[0].z + " " + rot[1];
  					f.rotation = qDir2.x + " " + qDir2.y + " " + qDir2.z + " " + qDir2.w;

  					return f;
  				}).filter(function (f) {
  					return f !== null;
  				});
  			};

  			var arrows = element.selectAll(".arrow").data(vectorData);

  			var arrowsEnter = arrows.enter().append("Transform").attr("translation", function (d) {
  				return d.translation;
  			}).attr("rotation", function (d) {
  				return d.rotation;
  			}).attr("class", "arrow").append("Transform").attr("translation", function (d) {
  				var offset = sizeScale(d.value) / 2;
  				return "0 " + offset + " 0";
  			}).append("Group");

  			var arrowHead = arrowsEnter.append("Shape");

  			arrowHead.append("Appearance").append("Material").attr("diffuseColor", function (d) {
  				return colorParse(colorScale(d.value));
  			});

  			arrowHead.append("Cylinder").attr("height", function (d) {
  				return sizeScale(d.value);
  			}).attr("radius", 0.1);

  			var arrowShaft = arrowsEnter.append("Transform").attr("translation", function (d) {
  				var offset = sizeScale(d.value) / 2;
  				return "0 " + offset + " 0";
  			}).append("Shape");

  			arrowShaft.append("Appearance").append("Material").attr("diffuseColor", function (d) {
  				return colorParse(colorScale(d.value));
  			});

  			arrowShaft.append("cone").attr("height", 1).attr("bottomRadius", 0.4);

  			arrowsEnter.merge(arrows);

  			arrows.transition().attr("translation", function (d) {
  				return d.translation;
  			});

  			arrows.exit().remove();
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Size Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.sizeScale = function (_v) {
  		if (!arguments.length) return sizeScale;
  		sizeScale = _v;
  		return my;
  	};

  	/**
    * Size Domain Getter / Setter
    *
    * @param {number[]} _v - Size min and max (e.g. [1, 9]).
    * @returns {*}
    */
  	my.sizeDomain = function (_v) {
  		if (!arguments.length) return sizeDomain;
  		sizeDomain = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Vector Function Getter / Setter
    *
    * @param {function} _f - Vector Function.
    * @returns {*}
    */
  	my.vectorFunction = function (_f) {
  		if (!arguments.length) return vectorFunction;
  		vectorFunction = _f;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  /**
   * Reusable X3D Viewpoint Component
   *
   * @module
   */
  function componentViewpoint () {

  	/* Default Properties */
  	var centerOfRotation = [0.0, 0.0, 0.0];
  	var viewPosition = [80.0, 15.0, 80.0];
  	var viewOrientation = [0.0, 1.0, 0.0, 0.8];
  	var fieldOfView = 0.8;

  	/**
    * Constructor
    *
    * @constructor
    * @alias viewpoint
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function () {
  			var viewpoint = d3.select(this).selectAll("viewpoint").data([null]);

  			viewpoint.enter().append("Viewpoint").attr("centerOfRotation", centerOfRotation.join(" ")).attr("position", viewPosition.join(" ")).attr("orientation", viewOrientation.join(" ")).attr("fieldOfView", fieldOfView).attr("set_bind", "true").merge(viewpoint);
  		});
  	};

  	/**
    * Set Quick Viewpoint
    *
    * @param {string} view - 'left', 'side', 'top', 'dimetric'
    * @returns {my}
    */
  	my.quickView = function (view) {
  		switch (view) {
  			case "left":
  				centerOfRotation = [0.0, 0.0, 0.0];
  				viewPosition = [37.10119, 18.70484, 51.01594];
  				viewOrientation = [0.06724, 0.99767, -0.01148, 0.33908];
  				fieldOfView = 1.0;
  				break;

  			case "side":
  				centerOfRotation = [20.0, 0.0, 0.0];
  				viewPosition = [20.00000, 20.00000, 50.00000];
  				viewOrientation = [0.00000, 0.00000, 0.00000, 0.00000];
  				fieldOfView = 1.0;
  				break;

  			case "top":
  				centerOfRotation = [0.0, 0.0, 0.0];
  				viewPosition = [27.12955, 106.67181, 31.65828];
  				viewOrientation = [-0.86241, 0.37490, 0.34013, 1.60141];
  				fieldOfView = 1.0;
  				break;

  			case "dimetric":
  			default:
  				centerOfRotation = [0.0, 0.0, 0.0];
  				viewPosition = [80.0, 15.0, 80.0];
  				viewOrientation = [0.0, 1.0, 0.0, 0.8];
  				fieldOfView = 0.8;
  		}
  		return my;
  	};

  	/**
    * Centre of Rotation Getter / Setter
    *
    * @param {number[]} _v - Centre of rotation.
    * @returns {*}
    */
  	my.centerOfRotation = function (_v) {
  		if (!arguments.length) return centerOfRotation;
  		centerOfRotation = _v;
  		return my;
  	};

  	/**
    * View Position Getter / Setter
    *
    * @param {number[]} _v - View position.
    * @returns {*}
    */
  	my.viewPosition = function (_v) {
  		if (!arguments.length) return viewPosition;
  		viewPosition = _v;
  		return my;
  	};

  	/**
    * View Orientation Getter / Setter
    *
    * @param {number[]} _v - View orientation.
    * @returns {*}
    */
  	my.viewOrientation = function (_v) {
  		if (!arguments.length) return viewOrientation;
  		viewOrientation = _v;
  		return my;
  	};

  	/**
    * Field of View Getter / Setter
    *
    * @param {number} _v - Field of view.
    * @returns {*}
    */
  	my.fieldOfView = function (_v) {
  		if (!arguments.length) return fieldOfView;
  		fieldOfView = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Volume Slice Component
   *
   * @module
   */
  function componentVolumeSlice () {

  	/* Default Properties */
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var classed = "d3X3dVolumeSlice";

  	/* Other Volume Properties */
  	var imageUrl = void 0;
  	var numberOfSlices = void 0;
  	var slicesOverX = void 0;
  	var slicesOverY = void 0;
  	var volumeStyle = "OpacityMap";

  	/**
    * Constructor
    *
    * @constructor
    * @alias volumeSlice
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		selection.each(function (data) {

  			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
  				return d.key;
  			});

  			var _dimensions = dimensions,
  			    dimensionX = _dimensions.x,
  			    dimensionY = _dimensions.y,
  			    dimensionZ = _dimensions.z;


  			var volumedata = element.append("Transform").append("VolumeData").attr("dimensions", dimensionX + " " + dimensionY + " " + dimensionZ);

  			volumedata.append("ImageTextureAtlas").attr("crossOrigin", "anonymous").attr("containerField", "voxels").attr("url", imageUrl).attr("numberOfSlices", numberOfSlices).attr("slicesOverX", slicesOverX).attr("slicesOverY", slicesOverY);

  			switch (volumeStyle) {
  				case "MPRVolume":
  					volumedata.append("MPRVolumeStyle").attr("forceOpaic", true).selectAll(".plane").data(function (d) {
  						return d.values;
  					}).enter().append("MPRPlane").classed("plane", true).attr("normal", function (d) {
  						return d.x + " " + d.y + " " + d.z;
  					}).attr("position", function (d) {
  						return d.value;
  					});
  					break;

  				case "OpacityMap":
  				default:
  					volumedata.append("OpacityMapVolumeStyle").attr("lightFactor", 1.2).attr("opacityFactor", 6.0);
  					break;
  			}
  		});
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * Image URL Getter / Setter
    *
    * @param {string} _v - Image URL path.
    * @returns {*}
    */
  	my.imageUrl = function (_v) {
  		if (!arguments.length) return imageUrl;
  		imageUrl = _v;
  		return this;
  	};

  	/**
    * Number of Slices Getter / Setter
    *
    * @param {number} _v - Total number of slices.
    * @returns {*}
    */
  	my.numberOfSlices = function (_v) {
  		if (!arguments.length) return numberOfSlices;
  		numberOfSlices = _v;
  		return this;
  	};

  	/**
    * X Slices Getter / Setter
    *
    * @param {number} _v - Number of slices over X axis.
    * @returns {*}
    */
  	my.slicesOverX = function (_v) {
  		if (!arguments.length) return slicesOverX;
  		slicesOverX = _v;
  		return this;
  	};

  	/**
    * Y Slices Getter / Setter
    *
    * @param {number} _v - Number of slices over Y axis.
    * @returns {*}
    */
  	my.slicesOverY = function (_v) {
  		if (!arguments.length) return slicesOverY;
  		slicesOverY = _v;
  		return this;
  	};

  	/**
    * Volume Style Getter / Setter
    *
    * @param {string} _v - Volume render style (either 'MPRVolume' or 'OpacityMap')
    * @returns {*}
    */
  	my.volumeStyle = function (_v) {
  		if (!arguments.length) return volumeStyle;
  		volumeStyle = _v;
  		return this;
  	};

  	return my;
  }

  var component = {
  	area: componentArea,
  	areaMultiSeries: componentAreaMultiSeries,
  	axis: componentAxis,
  	axisThreePlane: componentAxisThreePlane,
  	bars: componentBars,
  	barsMultiSeries: componentBarsMultiSeries,
  	bubbles: componentBubbles,
  	bubblesMultiSeries: componentBubblesMultiSeries,
  	crosshair: componentCrosshair,
  	label: componentLabel,
  	light: componentLight,
  	ribbon: componentRibbon,
  	ribbonMultiSeries: componentRibbonMultiSeries,
  	surface: componentSurface,
  	vectorFields: componentVectorFields,
  	viewpoint: componentViewpoint,
  	volumeSlice: componentVolumeSlice
  };

  /**
   * Reusable 3D Multi Series Area Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.areaChartMultiSeries();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/nested-area-chart/
   */
  function chartAreaChartMultiSeries () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 60, y: 40, z: 40 };
  	var colors = ["green", "red", "yellow", "steelblue", "orange"];
  	var classed = "d3X3dAreaChartMultiSeries";
  	var debug = false;
  	var smoothed = d3.curveMonotoneX;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.axisThreePlane().labelPosition('distal');
  	var areas = component.areaMultiSeries();
  	var light = component.light();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();

  		zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);

  		colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
  	};

  	/**
    * Create X3D base and scene
    *
    * @param selection
    * @param layers
    */
  	function createBase(selection, layers) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false").attr("useGeoCache", false);

  		// Add a white background
  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Add layer groups
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});
  	}

  	/**
    * Constructor
    *
    * @constructor
    * @alias areaChartMultiSeries
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		var layers = ["axis", "areas"];
  		createBase(selection, layers);

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]).viewOrientation([-0.61021, 0.77568, 0.16115, 0.65629]).viewPosition([77.63865, 54.69470, 104.38314]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale);

  			scene.select(".axis").call(axis);

  			// Add Areas
  			areas.xScale(xScale).yScale(yScale).zScale(zScale).colors(colors).smoothed(smoothed).dimensions(dimensions);

  			scene.select(".areas").datum(data).call(areas);

  			// Add Light
  			scene.call(light);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Smooth Interpolation Getter / Setter
    *
    * Options:
    *   d3.curveBasis
    *   d3.curveLinear
    *   d3.curveMonotoneX
    *
    * @param {d3.curve} _v.
    * @returns {*}
    */
  	my.smoothed = function (_v) {
  		if (!arguments.length) return smoothed;
  		smoothed = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Multi Series Bar Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.barChartMultiSeries();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/3d-bar-chart/
   */
  function chartBarChartMultiSeries () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["green", "red", "yellow", "steelblue", "orange"];
  	var classed = "d3X3dBarChartMultiSeries";
  	var labelPosition = "distal";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.axisThreePlane();
  	var bars = component.barsMultiSeries();
  	var light = component.light();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.5);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();

  		zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.7);

  		colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias barChartMultiSeries
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "bars"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale).labelPosition(labelPosition);

  			scene.select(".axis").call(axis);

  			// Add Bars
  			bars.xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

  			scene.select(".bars").datum(data).call(bars);

  			// Add Light
  			scene.call(light);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Label Position Getter / Setter
    *
    * @param {string} _v - Position ('proximal' or 'distal')
    * @returns {*}
    */
  	my.labelPosition = function (_v) {
  		if (!arguments.length) return labelPosition;
  		labelPosition = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Vertical Bar Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.barChartVertical();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/3d-bar-chart/
   */
  function chartBarChartVertical () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["green", "red", "yellow", "steelblue", "orange"];
  	var classed = "d3X3dBarChartVertical";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var colorScale = void 0;

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var xAxis = component.axis();
  	var yAxis = component.axis();
  	var bars = component.bars();
  	var light = component.light();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y;


  		xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.5);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();

  		colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias barChartVertical
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["xAxis", "yAxis", "bars"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.quickView("left");

  			scene.call(viewpoint);

  			// Add Axis
  			xAxis.scale(xScale).direction('x').tickDirection('y').tickSize(0);

  			yAxis.scale(yScale).direction('y').tickDirection('x').tickSize(yScale.range()[1] - yScale.range()[0]);

  			scene.select(".xAxis").call(xAxis);

  			scene.select(".yAxis").call(yAxis);

  			// Add Bars
  			bars.xScale(xScale).yScale(yScale).colors(colors);

  			scene.select(".bars").datum(data).call(bars);

  			// Add Light
  			scene.call(light);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Bubble Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.bubbleChart();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/bubble-chart/
   */
  function chartBubbleChart () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["green", "red", "yellow", "steelblue", "orange"];
  	var classed = "d3X3dBubbleChart";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;
  	var sizeScale = void 0;
  	var sizeDomain = [0.5, 3.5];

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.axisThreePlane();
  	var bubbles = component.bubblesMultiSeries();
  	var light = component.light();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    valueExtent = _dataTransform$summar.valueExtent,
  		    coordinatesMax = _dataTransform$summar.coordinatesMax,
  		    rowKeys = _dataTransform$summar.rowKeys;

  		var maxX = coordinatesMax.x,
  		    maxY = coordinatesMax.y,
  		    maxZ = coordinatesMax.z;
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);

  		zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);

  		colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);

  		sizeScale = d3.scaleLinear().domain(valueExtent).range(sizeDomain);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias bubbleChart
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "bubbles"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale);

  			scene.select(".axis").call(axis);

  			// Add Bubbles
  			bubbles.xScale(xScale).yScale(yScale).zScale(zScale).sizeScale(sizeScale).colorScale(colorScale);

  			scene.select(".bubbles").datum(data).call(bubbles);

  			// Add Light
  			scene.call(light);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Size Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.sizeScale = function (_v) {
  		if (!arguments.length) return sizeScale;
  		sizeScale = _v;
  		return my;
  	};

  	/**
    * Size Domain Getter / Setter
    *
    * @param {number[]} _v - Size min and max (e.g. [0.5, 3.0]).
    * @returns {*}
    */
  	my.sizeDomain = function (_v) {
  		if (!arguments.length) return sizeDomain;
  		sizeDomain = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Crosshair Plot (Experimental) Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.crosshairPlot();
   *
   * chartHolder.datum(myData).call(myChart);
   */
  function chartCrosshairPlot () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var classed = "d3X3dCrosshairPlot";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.axisThreePlane();
  	var crosshair = component.crosshair();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    coordinatesMax = _dataTransform$summar.coordinatesMax;

  		var maxX = coordinatesMax.x,
  		    maxY = coordinatesMax.y,
  		    maxZ = coordinatesMax.z;
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);

  		zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias crosshairPlot
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "crosshairs"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale).dimensions(dimensions);

  			scene.select(".axis").call(axis);

  			// Add Crosshair
  			crosshair.xScale(xScale).yScale(yScale).zScale(zScale);

  			var crosshairs = scene.select(".crosshairs").datum(data).selectAll(".crosshair").data(function (d) {
  				return d.values;
  			});

  			crosshairs.enter().append("group").classed("crosshair", true).merge(crosshairs).transition().each(function () {
  				d3.select(this).call(crosshair);
  			});
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Multi Series Ribbon Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.ribbonChartMultiSeries();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/waterfall-plot/
   */
  function chartRibbonChartMultiSeries () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 60, y: 40, z: 40 };
  	var colors = ["green", "red", "yellow", "steelblue", "orange"];
  	var classed = "d3X3dRibbonChartMultiSeries";
  	var debug = false;
  	var smoothed = d3.curveBasis;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.axisThreePlane();
  	var ribbons = component.ribbonMultiSeries();
  	var light = component.light();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();

  		zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);

  		colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias ribbonChartMultiSeries
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "ribbons"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]).viewOrientation([-0.61021, 0.77568, 0.16115, 0.65629]).viewPosition([77.63865, 54.69470, 104.38314]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale);

  			scene.select(".axis").call(axis);

  			// Add Ribbons
  			ribbons.xScale(xScale).yScale(yScale).zScale(zScale).colors(colors).smoothed(smoothed).dimensions(dimensions);

  			scene.select(".ribbons").datum(data).call(ribbons);

  			// Add Light
  			scene.call(light);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Smooth Interpolation Getter / Setter
    *
    * Options:
    *   d3.curveBasis
    *   d3.curveLinear
    *   d3.curveMonotoneX
    *
    * @param {d3.curve} _v.
    * @returns {*}
    */
  	my.smoothed = function (_v) {
  		if (!arguments.length) return smoothed;
  		smoothed = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Scatter Plot Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.scatterPlot();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/3d-scatterplot/
   */
  function chartScatterPlot () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var color = "orange";
  	var classed = "d3X3dScatterPlot";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.axisThreePlane();
  	var crosshair = component.crosshair();
  	var label = component.label();
  	var bubbles = component.bubbles();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    coordinatesMax = _dataTransform$summar.coordinatesMax;

  		var maxX = coordinatesMax.x,
  		    maxY = coordinatesMax.y,
  		    maxZ = coordinatesMax.z;
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);

  		zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias scatterPlot
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "bubbles", "crosshair", "label"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale);

  			scene.select(".axis").call(axis);

  			// Add Crosshair
  			crosshair.xScale(xScale).yScale(yScale).zScale(zScale);

  			// Add Labels
  			label.xScale(xScale).yScale(yScale).zScale(zScale).offset(0.5);

  			// Add Bubbles
  			bubbles.xScale(xScale).yScale(yScale).zScale(zScale).color(color).sizeDomain([0.5, 0.5]).on("d3X3dClick", function (e) {
  				var d = d3.select(e.target).datum();
  				scene.select(".crosshair").datum(d).classed("crosshair", true).each(function () {
  					d3.select(this).call(crosshair);
  				});
  			}).on("d3X3dMouseOver", function (e) {
  				var d = d3.select(e.target).datum();
  				scene.select(".label").datum(d).each(function () {
  					d3.select(this).call(label);
  				});
  			}).on("d3X3dMouseOut", function (e) {
  				scene.select(".label").selectAll("*").remove();
  			});

  			scene.select(".bubbles").datum(data).call(bubbles);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Getter / Setter
    *
    * @param {string} _v - Color (e.g. 'red' or '#ff0000').
    * @returns {*}
    */
  	my.color = function (_v) {
  		if (!arguments.length) return color;
  		color = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	/**
    * Dispatch On Getter
    *
    * @returns {*}
    */
  	my.on = function () {
  		var value = dispatch.on.apply(dispatch, arguments);
  		return value === dispatch ? my : value;
  	};

  	return my;
  }

  /**
   * Reusable 3D Surface Plot Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.surfacePlot();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/three-dimensional-stream-graph/
   */
  function chartSurfacePlot () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = ["blue", "red"];
  	var classed = "d3X3dSurfacePlot";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.axisThreePlane();
  	var surface = component.surface();

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    rowKeys = _dataTransform$summar.rowKeys,
  		    columnKeys = _dataTransform$summar.columnKeys,
  		    valueMax = _dataTransform$summar.valueMax;

  		var valueExtent = [0, valueMax];
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		xScale = d3.scalePoint().domain(rowKeys).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();

  		zScale = d3.scalePoint().domain(columnKeys).range([0, dimensionZ]);

  		colorScale = d3.scaleLinear().domain(valueExtent).range(colors).interpolate(d3.interpolateLab);
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias surfacePlot
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "surface"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale).labelPosition("distal");

  			scene.select(".axis").call(axis);

  			// Add Surface Area
  			surface.xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

  			scene.select(".surface").datum(data).call(surface);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  // import * as x3dom from "x3dom";

  /**
   * Reusable 3D Vector Field Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let vectorFunction = (x, y, z, value) => {
   *    return {
   *       vx: Math.pow(x, 2) + y * Math.pow(x, 2),
   *       vy: Math.pow(y, 2) - x * Math.pow(z, 2),
   *       vz: Math.pow(z, 2)
   *    };
   * };
   *
   * let myChart = d3.x3d.chart.vectorFieldChart()
   *    .vectorFunction(vectorFunction);
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://mathinsight.org/vector_field_overview
   */
  function chartVectorField () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var colors = d3.interpolateRdYlGn;
  	var classed = "d3X3dVectorFieldChart";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var colorScale = void 0;
  	var sizeScale = void 0;
  	var sizeDomain = [2.0, 5.0];
  	var origin = { x: 0, y: 0, z: 0 };

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.crosshair();
  	var vectorFields = component.vectorFields();

  	/**
    * Vector Field Function
    *
    * @param {number} x
    * @param {number} y
    * @param {number} z
    * @param {number} value
    * @returns {{vx: number, vy: number, vz: number}}
    */
  	var vectorFunction = function vectorFunction(x, y, z) {

  		return {
  			vx: x,
  			vy: y,
  			vz: z
  		};
  	};

  	/**
    * Initialise Data and Scales
    *
    * @private
    * @param {Array} data - Chart data.
    */
  	var init = function init(data) {
  		var _dataTransform$summar = dataTransform(data).summary(),
  		    coordinatesMax = _dataTransform$summar.coordinatesMax,
  		    coordinatesMin = _dataTransform$summar.coordinatesMin;

  		var minX = coordinatesMin.x,
  		    minY = coordinatesMin.y,
  		    minZ = coordinatesMin.z;
  		var maxX = coordinatesMax.x,
  		    maxY = coordinatesMax.y,
  		    maxZ = coordinatesMax.z;
  		var _dimensions = dimensions,
  		    dimensionX = _dimensions.x,
  		    dimensionY = _dimensions.y,
  		    dimensionZ = _dimensions.z;


  		var extent = d3.extent(data.values.map(function (f) {
  			var vx = void 0,
  			    vy = void 0,
  			    vz = void 0;
  			if ('vx' in f) {
  				vx = f.vx;
  				vy = f.vy;
  				vz = f.vz;
  			} else {
  				var _vectorFunction = vectorFunction(f.x, f.y, f.z, f.value);

  				vx = _vectorFunction.vx;
  				vy = _vectorFunction.vy;
  				vz = _vectorFunction.vz;
  			}

  			return new x3dom.fields.SFVec3f(vx, vy, vz).length();
  		}));

  		xScale = d3.scaleLinear().domain([minX, maxX]).range([0, dimensionX]);

  		yScale = d3.scaleLinear().domain([minY, maxY]).range([0, dimensionY]);

  		zScale = d3.scaleLinear().domain([minZ, maxZ]).range([0, dimensionZ]);

  		colorScale = d3.scaleSequential().domain(extent.slice().reverse()).interpolator(colors);

  		sizeScale = d3.scaleLinear().domain(extent).range(sizeDomain);

  		// TODO: Have a think about whether this is appropriate?
  		// Or, do we always want the origin to be 0,0,0 ?
  		origin = {
  			x: minX < 0 ? 0 : minX,
  			y: minY < 0 ? 0 : minY,
  			z: minZ < 0 ? 0 : minZ
  		};
  	};

  	/**
    * Constructor
    *
    * @constructor
    * @alias vectorFieldChart
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "vectorFields"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {
  			init(data);

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.xScale(xScale).yScale(yScale).zScale(zScale).dimensions(dimensions);

  			scene.select(".axis").datum(origin).call(axis);

  			// Add Vector Fields
  			vectorFields.xScale(xScale).yScale(yScale).zScale(zScale).colorScale(colorScale).sizeScale(sizeScale).vectorFunction(vectorFunction);

  			scene.select(".vectorFields").datum(data).call(vectorFields);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Color Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.colorScale = function (_v) {
  		if (!arguments.length) return colorScale;
  		colorScale = _v;
  		return my;
  	};

  	/**
    * Colors Getter / Setter
    *
    * @param {Array} _v - Array of colours used by color scale.
    * @returns {*}
    */
  	my.colors = function (_v) {
  		if (!arguments.length) return colors;
  		colors = _v;
  		return my;
  	};

  	/**
    * Size Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 color scale.
    * @returns {*}
    */
  	my.sizeScale = function (_v) {
  		if (!arguments.length) return sizeScale;
  		sizeScale = _v;
  		return my;
  	};

  	/**
    * Size Domain Getter / Setter
    *
    * @param {number[]} _v - Size min and max (e.g. [0.5, 3.0]).
    * @returns {*}
    */
  	my.sizeDomain = function (_v) {
  		if (!arguments.length) return sizeDomain;
  		sizeDomain = _v;
  		return my;
  	};

  	/**
    * Vector Function Getter / Setter
    *
    * @param {function} _f - Vector Function.
    * @returns {*}
    */
  	my.vectorFunction = function (_f) {
  		if (!arguments.length) return vectorFunction;
  		vectorFunction = _f;
  		return my;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  /**
   * Reusable 3D Vertical Volume Slice Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myChart = d3.x3d.chart.volumeSliceChart();
   *    .dimensions({ x: 40, y: 40, z: 30 })
   *    .imageUrl("assets/scan2.png")
   *    .numberOfSlices(35)
   *    .slicesOverX(7)
   *    .slicesOverY(5);
   *
   * chartHolder.call(myChart);
   */
  function chartVolumeSlice () {

  	var x3d = void 0;
  	var scene = void 0;

  	/* Default Properties */
  	var width = 500;
  	var height = 500;
  	var dimensions = { x: 40, y: 40, z: 40 };
  	var classed = "d3X3dVolumeSliceChart";
  	var debug = false;

  	/* Scales */
  	var xScale = void 0;
  	var yScale = void 0;
  	var zScale = void 0;
  	var origin = { x: 0, y: 0, z: 0 };

  	/* Other Volume Properties */
  	var imageUrl = void 0;
  	var numberOfSlices = void 0;
  	var slicesOverX = void 0;
  	var slicesOverY = void 0;
  	var volumeStyle = "OpacityMap";

  	/* Components */
  	var viewpoint = component.viewpoint();
  	var axis = component.crosshair();
  	var volumeSlice = component.volumeSlice();

  	/**
    * Constructor
    *
    * @constructor
    * @alias volumeSliceChart
    * @param {d3.selection} selection - The chart holder D3 selection.
    */
  	var my = function my(selection) {
  		// Create x3d element (if it does not exist already)
  		if (!x3d) {
  			x3d = selection.append("X3D");
  			scene = x3d.append("Scene");
  		}

  		x3d.attr("width", width + "px").attr("useGeoCache", false).attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

  		scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

  		// Update the chart dimensions and add layer groups
  		var layers = ["axis", "volume"];
  		scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
  			return d;
  		});

  		selection.each(function (data) {

  			// Add Viewpoint
  			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

  			scene.call(viewpoint);

  			// Add Axis
  			axis.dimensions(dimensions).xScale(xScale).yScale(yScale).zScale(zScale);

  			scene.select(".axis").datum(origin).call(axis);

  			// Add Volume Slice
  			volumeSlice.dimensions(dimensions).imageUrl(imageUrl).numberOfSlices(numberOfSlices).slicesOverX(slicesOverX).slicesOverY(slicesOverY).volumeStyle(volumeStyle);

  			scene.select(".volume").append("transform").attr("translation", function () {
  				var x = dimensions.x / 2;
  				var y = dimensions.y / 2;
  				var z = dimensions.z / 2;
  				return x + " " + y + " " + z;
  			}).datum(function (d) {
  				return d;
  			}).call(volumeSlice);
  		});
  	};

  	/**
    * Width Getter / Setter
    *
    * @param {number} _v - X3D canvas width in px.
    * @returns {*}
    */
  	my.width = function (_v) {
  		if (!arguments.length) return width;
  		width = _v;
  		return this;
  	};

  	/**
    * Height Getter / Setter
    *
    * @param {number} _v - X3D canvas height in px.
    * @returns {*}
    */
  	my.height = function (_v) {
  		if (!arguments.length) return height;
  		height = _v;
  		return this;
  	};

  	/**
    * X Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.xScale = function (_v) {
  		if (!arguments.length) return xScale;
  		xScale = _v;
  		return my;
  	};

  	/**
    * Y Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.yScale = function (_v) {
  		if (!arguments.length) return yScale;
  		yScale = _v;
  		return my;
  	};

  	/**
    * Z Scale Getter / Setter
    *
    * @param {d3.scale} _v - D3 scale.
    * @returns {*}
    */
  	my.zScale = function (_v) {
  		if (!arguments.length) return zScale;
  		zScale = _v;
  		return my;
  	};

  	/**
    * Dimensions Getter / Setter
    *
    * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
    * @returns {*}
    */
  	my.dimensions = function (_v) {
  		if (!arguments.length) return dimensions;
  		dimensions = _v;
  		return this;
  	};

  	/**
    * Image URL Getter / Setter
    *
    * @param {string} _v - Image URL path.
    * @returns {*}
    */
  	my.imageUrl = function (_v) {
  		if (!arguments.length) return imageUrl;
  		imageUrl = _v;
  		return this;
  	};

  	/**
    * Number of Slices Getter / Setter
    *
    * @param {number} _v - Total number of slices.
    * @returns {*}
    */
  	my.numberOfSlices = function (_v) {
  		if (!arguments.length) return numberOfSlices;
  		numberOfSlices = _v;
  		return this;
  	};

  	/**
    * X Slices Getter / Setter
    *
    * @param {number} _v - Number of slices over X axis.
    * @returns {*}
    */
  	my.slicesOverX = function (_v) {
  		if (!arguments.length) return slicesOverX;
  		slicesOverX = _v;
  		return this;
  	};

  	/**
    * Y Slices Getter / Setter
    *
    * @param {number} _v - Number of slices over Y axis.
    * @returns {*}
    */
  	my.slicesOverY = function (_v) {
  		if (!arguments.length) return slicesOverY;
  		slicesOverY = _v;
  		return this;
  	};

  	/**
    * Volume Style Getter / Setter
    *
    * @param {string} _v - Volume render style (either 'MPRVolume' or 'OpacityMap')
    * @returns {*}
    */
  	my.volumeStyle = function (_v) {
  		if (!arguments.length) return volumeStyle;
  		volumeStyle = _v;
  		return this;
  	};

  	/**
    * Debug Getter / Setter
    *
    * @param {boolean} _v - Show debug log and stats. True/False.
    * @returns {*}
    */
  	my.debug = function (_v) {
  		if (!arguments.length) return debug;
  		debug = _v;
  		return my;
  	};

  	return my;
  }

  var chart = {
  	areaChartMultiSeries: chartAreaChartMultiSeries,
  	barChartMultiSeries: chartBarChartMultiSeries,
  	barChartVertical: chartBarChartVertical,
  	bubbleChart: chartBubbleChart,
  	crosshairPlot: chartCrosshairPlot,
  	ribbonChartMultiSeries: chartRibbonChartMultiSeries,
  	scatterPlot: chartScatterPlot,
  	surfacePlot: chartSurfacePlot,
  	vectorFieldChart: chartVectorField,
  	volumeSliceChart: chartVolumeSlice
  };

  /**
   * List of Countries
   *
   * @type {Array}
   */
  var countries = ["UK", "France", "Spain", "Germany", "Italy", "Portugal"];

  /**
   * List of Fruit
   *
   * @type {Array}
   */
  var fruit = ["Apples", "Oranges", "Pears", "Bananas"];

  /**
   * Random Number Generator between 1 and 10
   *
   * @returns {number}
   */
  function randomNum() {
  	return Math.floor(Math.random() * 10) + 1;
  }

  /**
   * Random Dataset - Single Series
   *
   * @returns {Array}
   */
  function dataset1() {
  	var data = {
  		key: "Fruit",
  		values: fruit.map(function (d) {
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
  function dataset2() {
  	var data = countries.map(function (d) {
  		return {
  			key: d,
  			values: fruit.map(function (d) {
  				return {
  					key: d,
  					value: randomNum(),
  					x: randomNum(),
  					y: randomNum(),
  					z: randomNum()
  				};
  			})
  		};
  	});

  	return data;
  }

  /**
   * Random Dataset - Single Series Scatter Plot
   *
   * @param {number} points - Number of data points.
   * @returns {Array}
   */
  function dataset3() {
  	var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

  	var data = {
  		key: "Bubbles",
  		values: d3.range(points).map(function (d, i) {
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
   * Random Dataset - Surface Plot 1
   *
   * @returns {Array}
   */
  function dataset4() {
  	var data = [{
  		key: 'a',
  		values: [{ key: '1', value: 4 }, { key: '2', value: 0 }, { key: '3', value: 2 }, { key: '4', value: 0 }, { key: '5', value: 0 }]
  	}, {
  		key: 'b',
  		values: [{ key: '1', value: 4 }, { key: '2', value: 0 }, { key: '3', value: 2 }, { key: '4', value: 0 }, { key: '5', value: 0 }]
  	}, {
  		key: 'c',
  		values: [{ key: '1', value: 1 }, { key: '2', value: 0 }, { key: '3', value: 1 }, { key: '4', value: 0 }, { key: '5', value: 0 }]
  	}, {
  		key: 'd',
  		values: [{ key: '1', value: 4 }, { key: '2', value: 0 }, { key: '3', value: 2 }, { key: '4', value: 0 }, { key: '5', value: 0 }]
  	}, {
  		key: 'e',
  		values: [{ key: '1', value: 1 }, { key: '2', value: 1 }, { key: '3', value: 1 }, { key: '4', value: 1 }, { key: '5', value: 1 }]
  	}];

  	return data;
  }

  /**
   * Random Dataset - Surface Plot 2
   *
   * @returns {Array}
   */
  function dataset5() {
  	var cx = 0.8;
  	var cy = 0.3;
  	var f = function f(vx, vz) {
  		return ((vx - cx) * (vx - cx) + (vz - cy) * (vx - cx)) * Math.random();
  	};

  	var xRange = d3.range(0, 1.05, 0.1);
  	var zRange = d3.range(0, 1.05, 0.1);
  	var nx = xRange.length;
  	var nz = zRange.length;

  	var data = d3.range(nx).map(function (i) {

  		var values = d3.range(nz).map(function (j) {
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

  var randomData = /*#__PURE__*/Object.freeze({
    countries: countries,
    fruit: fruit,
    randomNum: randomNum,
    dataset1: dataset1,
    dataset2: dataset2,
    dataset3: dataset3,
    dataset4: dataset4,
    dataset5: dataset5
  });

  /**
   * d3-x3d
   *
   * @author James Saunders [james@saunders-family.net]
   * @copyright Copyright (C) 2019 James Saunders
   * @license GPLv2
   */

  var author = "James Saunders";
  var year = new Date().getFullYear();
  var copyright = "Copyright (C) " + year + " " + author;

  var index = {
  	version: version,
  	author: author,
  	copyright: copyright,
  	license: license,
  	chart: chart,
  	component: component,
  	dataTransform: dataTransform,
  	randomData: randomData,
  	events: events,
  	colorHelper: colorHelper
  };

  return index;

}));

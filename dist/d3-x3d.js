/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2023 James Saunders
 * @license GPLv2
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('d3-shape'), require('d3-array'), require('d3-interpolate')) :
  typeof define === 'function' && define.amd ? define(['d3', 'd3-shape', 'd3-array', 'd3-interpolate'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.d3 = global.d3 || {}, global.d3.x3d = factory(global.d3, global.d3, global.d3, global.d3)));
})(this, (function (d3, d3Shape, d3Array, d3Interpolate) { 'use strict';

  function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n.default = e;
    return Object.freeze(n);
  }

  var d3__namespace = /*#__PURE__*/_interopNamespaceDefault(d3);

  var version$1="2.1.5";var license$1="GPL-2.0";var packageJson = {version:version$1,license:license$1};

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function (n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, e) {
    if ("object" != typeof t || !t) return t;
    var r;
    if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) {
      var i = r.call(t, e);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === e ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

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
    const path = d3Shape.line().curve(curveFunction)(points);
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
    const area = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    area.innerHTML = "<path></path>";
    const svgpath = area.querySelector("path");
    svgpath.setAttribute("d", path);

    // Calculate lengths and max points
    const totalLength = svgpath.getTotalLength();
    const minPoint = svgpath.getPointAtLength(0);
    const maxPoint = svgpath.getPointAtLength(totalLength);
    let reverse = maxPoint.x < minPoint.x;
    const range = reverse ? [maxPoint, minPoint] : [minPoint, maxPoint];
    reverse = reverse ? -1 : 1;

    // Return function
    return function (x) {
      // Check for 0 and null/undefined
      const targetX = x === 0 ? 0 : x || minPoint.x;
      // Clamp
      if (targetX < range[0].x) return range[0];
      if (targetX > range[1].x) return range[1];
      function estimateLength(l, mn, mx) {
        let delta = svgpath.getPointAtLength(l).x - targetX;
        let nextDelta = 0;
        let iter = 0;
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
      const estimatedLength = estimateLength(totalLength / 2, 0, totalLength);
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
  function fromCurve (values, curveFunction, epsilon = 0.00001, samples = 100) {
    // eslint-disable-line max-params
    const length = values.length;
    const xrange = d3Array.range(length).map(function (d, i) {
      return i * (1 / (length - 1));
    });
    const points = values.map((v, i) => [xrange[i], v]);

    // If curveFunction is curveBasis then reach straight for D3's native 'interpolateBasis' function (it's faster!)
    if (curveFunction === d3Shape.curveBasis) {
      return d3Interpolate.interpolateBasis(values);
    } else {
      return curvePolator(points, curveFunction, epsilon, samples);
    }
  }

  /**
   * Data Transform
   *
   * @module
   * @returns {Object}
   */
  function dataTransform(data) {
    var SINGLE_SERIES = 1;
    var MULTI_SERIES = 2;
    var coordinates = ["x", "y", "z"];

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
     * @param {Array} array2 - Second Array.
     * @returns {Array}
     */
    var union = function union(array1, array2) {
      var ret = [];
      var arr;
      if (array1.length > array2.length) {
        arr = array2.concat(array1);
      } else {
        arr = array1.concat(array2);
      }
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
      (match[1] ? match[1].length : 0
      // Adjust for scientific notation.
      ) - (match[2] ? +match[2] : 0));
    };

    /************* SINGLE SERIES FUNCTIONS ************/

    /**
     * Row Key (Single Series)
     *
     * @returns {Array}
     */
    var singleRowKey = function singleRowKey(data) {
      return Object.values(data)[0];
    };

    /**
     * Row Total (Single Series)
     *
     * @returns {number}
     */
    var singleRowTotal = function singleRowTotal(data) {
      return d3__namespace.sum(data.values, function (d) {
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
      return Object.values(data.values).map(function (d) {
        return d.key;
      });
    };

    /**
     * Value Min (Single Series)
     *
     * @returns {number}
     */
    var singleValueMin = function singleValueMin(data) {
      return d3__namespace.min(data.values, function (d) {
        return +d.value;
      });
    };

    /**
     * Value Max (Single Series)
     *
     * @returns {number}
     */
    var singleValueMax = function singleValueMax(data) {
      return d3__namespace.max(data.values, function (d) {
        return +d.value;
      });
    };

    /**
     * Value Extent (Single Series)
     *
     * @returns {Array}
     */
    var singleValueExtent = function singleValueExtent(data) {
      return d3__namespace.extent(data.values, function (d) {
        return +d.value;
      });
    };
    var reduceCoordinates = function reduceCoordinates(pick) {
      return coordinates.reduce(function (result, coord) {
        result[coord] = pick(coord);
        return result;
      }, {});
    };
    var foldCoordinateRows = function foldCoordinateRows(rows, compare) {
      return rows.reduce(function (result, row) {
        coordinates.forEach(function (coord) {
          result[coord] = coord in result ? compare(result[coord], +row[coord]) : row[coord];
        });
        return result;
      }, {});
    };
    var thresholdBands = [0.15, 0.40, 0.55, 0.90];
    var thresholdsBetween = function thresholdsBetween(min, max, decimalPlace) {
      var distance = max - min;
      return thresholdBands.map(function (v) {
        return Number((min + v * distance).toFixed(decimalPlace));
      });
    };

    /**
     * Coordinates Min (Single Series)
     *
     * @returns {Object}
     */
    var singleCoordinatesMin = function singleCoordinatesMin(data) {
      return reduceCoordinates(function (coord) {
        return d3__namespace.min(data.values, function (d) {
          return +d[coord];
        });
      });
    };

    /**
     * Coordinates Max (Single Series)
     *
     * @returns {Object}
     */
    var singleCoordinatesMax = function singleCoordinatesMax(data) {
      return reduceCoordinates(function (coord) {
        return d3__namespace.max(data.values, function (d) {
          return +d[coord];
        });
      });
    };

    /**
     * Coordinates Extent (Single Series)
     *
     * @returns {Object}
     */
    var singleCoordinatesExtent = function singleCoordinatesExtent(data) {
      return reduceCoordinates(function (coord) {
        return d3__namespace.extent(data.values, function (d) {
          return +d[coord];
        });
      });
    };

    /**
     * Thresholds (Single Series)
     *
     * @returns {Array}
     */
    var singleThresholds = function singleThresholds(data) {
      return thresholdsBetween(singleValueMin(data), singleValueMax(data), singleMaxDecimalPlace(data));
    };

    /**
     * Max Decimal Place (Single Series)
     *
     * @returns {number}
     */
    var singleMaxDecimalPlace = function singleMaxDecimalPlace(data) {
      return data.values.reduce(function (places, d) {
        places = d3__namespace.max([places, decimalPlaces(d.value)]);

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
      return d3__namespace.max(Object.values(multiRowTotals(data)));
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
        keys = union(keys, tmp);
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
      return d3__namespace.max(Object.values(multiColumnTotals(data)));
    };

    /**
     * Value Min (Multi Series)
     *
     * @returns {number}
     */
    var multiValueMin = function multiValueMin(data) {
      return d3__namespace.min(data.map(function (row) {
        return singleValueMin(row);
      }));
    };

    /**
     * Value Max (Multi Series)
     *
     * @returns {number}
     */
    var multiValueMax = function multiValueMax(data) {
      return d3__namespace.max(data.map(function (row) {
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
      return foldCoordinateRows(data.map(function (row) {
        return singleCoordinatesMin(row);
      }), function (left, right) {
        return d3__namespace.min([left, right]);
      });
    };

    /**
     * Coordinates Max (Multi Series)
     *
     * @returns {Object}
     */
    var multiCoordinatesMax = function multiCoordinatesMax(data) {
      return foldCoordinateRows(data.map(function (row) {
        return singleCoordinatesMax(row);
      }), function (left, right) {
        return d3__namespace.max([left, right]);
      });
    };

    /**
     * Coordinates Extent (Multi Series)
     *
     * @returns {Object}
     */
    var multiCoordinatesExtent = function multiCoordinatesExtent(data) {
      var minimums = multiCoordinatesMin(data);
      var maximums = multiCoordinatesMax(data);
      return reduceCoordinates(function (coord) {
        return [minimums[coord], maximums[coord]];
      });
    };

    /**
     * Thresholds (Multi Series)
     *
     * @returns {Array}
     */
    var multiThresholds = function multiThresholds(data) {
      return thresholdsBetween(multiValueMin(data), multiValueMax(data), multiMaxDecimalPlace(data));
    };

    /**
     * Max Decimal Place (Multi Series)
     *
     * @returns {number}
     */
    var multiMaxDecimalPlace = function multiMaxDecimalPlace(data) {
      return d3__namespace.max(data.map(function (d) {
        return singleMaxDecimalPlace(d);
      }));
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
     * Stack Data (for Stacked Bar Chart, Donut Chart)
     *
     * @returns {Array}
     */
    var stack = function stack() {
      var values = [];
      var y0 = 0;
      var y1 = 0;
      data.values.forEach(function (d, i) {
        y1 = y0 + d.value;
        values[i] = {
          key: d.key,
          value: d.value,
          y0: y0,
          y1: y1
        };
        y0 += d.value;
      });
      return {
        key: data.key,
        values: values
      };
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
      var samples = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
      var epsilon = 0.00001;
      var values = data.values.map(function (d) {
        return d.value;
      });
      var sampler = d3__namespace.range(0, 1, 1 / samples);
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
      stacked: stack,
      smooth: smooth
    };
  }

  /**
   * D3-style getter / setter methods.
   *
   * For each key of `state`, calling `my[key]()` returns the current value.
   * Calling `my[key](value)` writes that value and returns `my`.
   *
   * @module
   * @param {Function} my - Component or chart function.
   * @param {Object} state - Per-instance values. Keys become method names.
   * @returns {Function} The same component or chart function.
   */
  function attachAccessors(my, state) {
    Object.keys(state).forEach(function (key) {
      my[key] = function (_v) {
        if (!arguments.length) return state[key];
        state[key] = _v;
        return my;
      };
    });
    return my;
  }

  // @formatter:off
  /**
   * Definition of CSS color names
   * @type {Array}
   */
  var colorNames = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dodgerblue: "#1e90ff",
    feldspar: "#d19275",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgrey: "#d3d3d3",
    lightgreen: "#90ee90",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslateblue: "#8470ff",
    lightslategray: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370d8",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#d87093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    violetred: "#d02090",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
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
        parseInt("0x" + hex.substr(6, 2), 16) / 255.0;
      } else if (len === 6) {
        red = parseInt("0x" + hex.substr(0, 2), 16) / 255.0;
        green = parseInt("0x" + hex.substr(2, 2), 16) / 255.0;
        blue = parseInt("0x" + hex.substr(4, 2), 16) / 255.0;
      } else if (len === 4) {
        red = parseInt("0x" + hex.substr(0, 1), 16) / 15.0;
        green = parseInt("0x" + hex.substr(1, 1), 16) / 15.0;
        blue = parseInt("0x" + hex.substr(2, 1), 16) / 15.0;
        parseInt("0x" + hex.substr(3, 1), 16) / 15.0;
      } else if (len === 3) {
        red = parseInt("0x" + hex.substr(0, 1), 16) / 15.0;
        green = parseInt("0x" + hex.substr(1, 1), 16) / 15.0;
        blue = parseInt("0x" + hex.substr(2, 1), 16) / 15.0;
      }
    }
    red = red.toFixed(4);
    green = green.toFixed(4);
    blue = blue.toFixed(4);
    return "".concat(red, " ").concat(green, " ").concat(blue);
  }

  var colorHelper = /*#__PURE__*/Object.freeze({
    __proto__: null,
    colorParse: colorParse
  });

  /**
   * Draw a strip of quads as an IndexedFaceSet.
   *
   * X3DOM rejects an empty IndexedFaceSet, so the node is injected with .html().
   *
   * @param {d3.selection} element
   * @param {Object} state - Component scales, color, dimensions, and curve.
   * @param {{itemClass: string, transparency: number, quad: Function}} options
   */
  function drawIndexedFaceStrip(element, state, options) {
    var itemClass = options.itemClass,
      transparency = options.transparency,
      quad = options.quad;
    var faceData = function faceData(series) {
      if (state.smoothed) {
        series = dataTransform(series).smooth(state.smoothed, 100);
        var keys = d3__namespace.extent(series.values.map(function (d) {
          return d.key;
        }));
        state.xScale = d3__namespace.scaleLinear().domain(keys).range([0, state.dimensions.x]);
      }
      var coords = series.values.map(function (pointThis, indexThis, array) {
        var indexNext = indexThis + 1;
        if (indexNext >= array.length) {
          return null;
        }
        return quad(pointThis, array[indexNext]);
      }).filter(function (d) {
        return d !== null;
      });
      series.point = coords.map(function (d) {
        return d.join(" ");
      }).join(" ");
      series.coordIndex = coords.map(function (d, i) {
        var offset = i * 4;
        return [offset, offset + 1, offset + 2, offset + 3, -1].join(" ");
      }).join(" ");
      return [series];
    };
    var shape = function shape(el) {
      var node = el.append("Shape");
      node.html(function (d) {
        return "\n\t\t\t<IndexedFaceset coordIndex=\"".concat(d.coordIndex, "\" solid=\"false\">\n\t\t\t\t<Coordinate point=\"").concat(d.point, "\"></Coordinate>\n\t\t\t</IndexedFaceset>\n\t\t\t<Appearance>\n\t\t\t\t<Material diffuseColor=\"").concat(colorParse(state.color), "\" transparency=\"").concat(transparency, "\"></Material>\n\t\t\t</Appearance>\n\t\t");
      });
    };
    var items = element.selectAll("." + itemClass).data(function (d) {
      return faceData(d);
    }, function (d) {
      return d.key;
    });
    items.enter().append("Group").classed(itemClass, true).call(shape).merge(items);
    var itemTransition = items.transition().select("Shape");
    itemTransition.select("IndexedFaceset").attr("coordIndex", function (d) {
      return d.coordIndex;
    }).select("Coordinate").attr("point", function (d) {
      return d.point;
    });
    itemTransition.select("Appearance").select("Material").attr("diffuseColor", colorParse(state.color));
    items.exit().remove();
  }

  /**
   * Reusable 3D Area Chart Component
   *
   * @module
   */
  function componentArea () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 5
      },
      color: "blue",
      smoothed: d3__namespace.curveMonotoneX,
      xScale: undefined,
      yScale: undefined
    };
    var transparency = 0.1;
    var classed = "d3X3dArea";

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scalePoint().domain(columnKeys).range([0, dimensionX]);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]);
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
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        drawIndexedFaceStrip(element, state, {
          itemClass: "area",
          transparency: transparency,
          quad: function quad(pointThis, pointNext) {
            var x1 = state.xScale(pointThis.key);
            var x2 = state.xScale(pointNext.key);
            var y1 = state.yScale(pointThis.value);
            var y2 = state.yScale(pointNext.value);
            return [x1, 0, 0, x1, y1, 0, x2, y2, 0, x2, 0, 0];
          }
        });
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: {number}, y: {number}, z: {number}}} dimensions - 3D Object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     * @param {d3.curve} smoothed
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Concatenate two arrays and keep the first occurrence of each value.
   *
   * @module
   * @param {Array} array1
   * @param {Array} array2
   * @returns {Array}
   */
  function arrayUnique(array1, array2) {
    var seen = new Set();
    var unique = [];
    array1.concat(array2).forEach(function (item) {
      if (!seen.has(item)) {
        seen.add(item);
        unique.push(item);
      }
    });
    return unique;
  }

  /**
   * Build x, y, and z scales from a summary when they are missing.
   * Pass `overwrite: true` to replace scales on every call.
   *
   * @param {Object} state
   * @param {Array} data
   * @param {{xScale: Function, yScale: Function, zScale: Function, overwrite: boolean}} scales
   * @returns {Object} dataTransform summary
   */
  function assignSeriesScales(state, data, scales) {
    var summary = dataTransform(data).summary();
    var dimensions = state.dimensions;
    ["xScale", "yScale", "zScale"].forEach(function (key) {
      if (scales.overwrite || typeof state[key] === "undefined") {
        state[key] = scales[key](summary, dimensions);
      }
    });
    return summary;
  }

  /**
   * Build linear x, y, z, and size scales from coordinate extents when missing.
   *
   * @param {Object} state
   * @param {Array} data
   * @returns {Array} Row keys
   */
  function assignCoordinateScales(state, data) {
    var _dataTransform$summar = dataTransform(data).summary(),
      rowKeys = _dataTransform$summar.rowKeys,
      valueExtent = _dataTransform$summar.valueExtent,
      coordinatesExtent = _dataTransform$summar.coordinatesExtent;
    var extentX = coordinatesExtent.x,
      extentY = coordinatesExtent.y,
      extentZ = coordinatesExtent.z;
    var _state$dimensions = state.dimensions,
      dimensionX = _state$dimensions.x,
      dimensionY = _state$dimensions.y,
      dimensionZ = _state$dimensions.z;
    if (typeof state.xScale === "undefined") {
      state.xScale = d3__namespace.scaleLinear().domain(extentX).range([0, dimensionX]);
    }
    if (typeof state.yScale === "undefined") {
      state.yScale = d3__namespace.scaleLinear().domain(extentY).range([0, dimensionY]);
    }
    if (typeof state.zScale === "undefined") {
      state.zScale = d3__namespace.scaleLinear().domain(extentZ).range([0, dimensionZ]);
    }
    if (typeof state.sizeScale === "undefined") {
      state.sizeScale = d3__namespace.scaleLinear().domain(valueExtent).range(state.sizeRange);
    }
    return rowKeys;
  }

  /**
   * Reshape `{ value, x, y, z }` points into mapped `{ key, value }` pairs.
   *
   * @param {Array} data
   * @returns {Array}
   */
  function coordinateSeriesData(data) {
    return data.map(function (series) {
      return {
        key: series.key,
        values: series.values.map(function (point) {
          return {
            key: point.key,
            values: [{
              key: "size",
              value: point.value
            }, {
              key: "color",
              value: point.value
            }, {
              key: "x",
              value: point.x
            }, {
              key: "y",
              value: point.y
            }, {
              key: "z",
              value: point.z
            }]
          };
        })
      };
    });
  }

  /**
   * Place one translated group per series and draw the inner component into it.
   *
   * @param {d3.selection} element
   * @param {Object} state
   * @param {{groupClass: string, mark: Function, configure: Function, colorBySeries: boolean}} options
   */
  function drawSeriesGroups(element, state, options) {
    var groupClass = options.groupClass,
      mark = options.mark,
      configure = options.configure,
      colorBySeries = options.colorBySeries;
    mark.xScale(state.xScale).yScale(state.yScale).dimensions({
      x: state.dimensions.x,
      y: state.dimensions.y,
      z: state.zScale.bandwidth()
    });
    if (configure) configure(mark);
    var groups = element.selectAll("." + groupClass).data(function (d) {
      return d;
    }, function (d) {
      return d.key;
    });
    groups.enter().append("Transform").classed(groupClass, true).merge(groups).transition().attr("translation", function (d) {
      var x = 0;
      var y = 0;
      var z = state.zScale(d.key);
      return x + " " + y + " " + z;
    }).each(function (d) {
      if (colorBySeries) mark.color(state.colorScale(d.key));
      d3__namespace.select(this).call(mark);
    });
    groups.exit().remove();
  }

  /**
   * Reusable 3D Multi Series Area Chart Component
   *
   * @module
   */
  function componentAreaMultiSeries () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["orange", "red", "yellow", "steelblue", "green"],
      smoothed: d3__namespace.curveMonotoneX,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dAreaMultiSeries";

    /* Scales */
    var colorDomain = [];

    /* Components */
    var area = componentArea();

    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var summary = assignSeriesScales(state, data, {
        xScale: function xScale(seriesSummary, dimensions) {
          return d3__namespace.scalePoint().domain(seriesSummary.columnKeys).range([0, dimensions.x]);
        },
        yScale: function yScale(seriesSummary, dimensions) {
          return d3__namespace.scaleLinear().domain([0, seriesSummary.valueMax]).range([0, dimensions.y]);
        },
        zScale: function zScale(seriesSummary, dimensions) {
          return d3__namespace.scaleBand().domain(seriesSummary.rowKeys).range([0, dimensions.z]).padding(0.4);
        }
      });
      if (typeof state.colorScale === "undefined") {
        colorDomain = arrayUnique(colorDomain, summary.rowKeys);
        state.colorScale = d3__namespace.scaleOrdinal().domain(colorDomain).range(state.colors);
      }
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
        var element = d3__namespace.select(this).classed(classed, true);
        drawSeriesGroups(element, state, {
          groupClass: "areaGroup",
          mark: area,
          configure: function configure(mark) {
            return mark.smoothed(state.smoothed);
          },
          colorBySeries: true
        });
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {d3.curve} smoothed
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Axis Component
   *
   * @module
   */
  function componentAxis () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      color: "black",
      scale: undefined,
      direction: undefined,
      tickDirection: undefined,
      tickArguments: [],
      tickValues: null,
      tickFormat: null,
      tickSize: 1.5,
      tickPadding: 2.0
    };
    var classed = "d3X3dAxis";
    var labelPosition = "proximal";
    var labelInset = labelPosition === "distal" ? 1 : -1;

    /**
     * Get Axis Direction Vector
     *
     * @private
     * @param {string} axisDir
     * @returns {number[]}
     */
    var getAxisDirectionVector = function getAxisDirectionVector(axisDir) {
      var axisDirectionVectors = {
        x: [1, 0, 0],
        y: [0, 1, 0],
        z: [0, 0, 1]
      };
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
      var axisRotationVectors = {
        x: [1, 1, 0, Math.PI],
        y: [0, 0, 0, 0],
        z: [0, 1, 1, Math.PI]
      };
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
        var element = d3__namespace.select(this).classed(classed, true);
        var range = state.scale.range();
        var range0 = range[0];
        var range1 = range[range.length - 1];
        var axisDirectionVector = getAxisDirectionVector(state.direction);
        var tickDirectionVector = getAxisDirectionVector(state.tickDirection);
        var axisRotationVector = getAxisRotationVector(state.direction);
        var tickRotationVector = getAxisRotationVector(state.tickDirection);

        /*
        // FIXME: Currently the tickArguments option does not work.
        const tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
        tickValues = tickValues === null ? tickValuesDefault : tickValues;
        */
        state.tickValues = state.scale.ticks ? state.scale.ticks.apply(state.scale, state.tickArguments) : state.scale.domain();
        var tickFormatDefault = state.scale.tickFormat ? state.scale.tickFormat.apply(state.scale, state.tickArguments) : function (d) {
          return d;
        };
        state.tickFormat = state.tickFormat === null ? tickFormatDefault : state.tickFormat;
        var makeSolid = function makeSolid(el, color) {
          el.append("Appearance").append("Material").attr("diffuseColor", colorParse(color) || "0 0 0").attr("transparency", "0");
        };
        var shape = function shape(el, radius, height, color) {
          var shape = el.append("Shape");
          shape.append("Cylinder").attr("radius", radius).attr("height", height);
          shape.call(makeSolid, colorParse(color));
        };

        // Main Lines
        var domain = element.selectAll(".domain").data([null]);
        domain.enter().append("Transform").attr("class", "domain").attr("rotation", axisRotationVector.join(" ")).attr("translation", axisDirectionVector.map(function (d) {
          return d * (range0 + range1) / 2;
        }).join(" ")).call(shape, 0.1, range1 - range0, state.color).merge(domain);
        domain.exit().remove();

        // Tick Lines
        var ticks = element.selectAll(".tickLine").data(state.tickValues, function (d) {
          return d;
        });
        ticks.enter().append("Transform").attr("class", "tickLine").attr("translation", function (t) {
          return axisDirectionVector.map(function (a) {
            return state.scale(t) * a;
          }).join(" ");
        }).append("Transform").attr("translation", tickDirectionVector.map(function (d) {
          return d * state.tickSize / 2;
        }).join(" ")).attr("rotation", tickRotationVector.join(" ")).call(shape, 0.05, state.tickSize, "#f3f3f3").merge(ticks);
        ticks.transition().attr("translation", function (t) {
          return axisDirectionVector.map(function (a) {
            return state.scale(t) * a;
          }).join(" ");
        });
        ticks.exit().remove();

        // Tick Labels
        var labels = element.selectAll(".tickLabel").data(state.tickValues, function (d) {
          return d;
        });
        labels.enter().append("Transform").attr("class", "tickLabel").attr("translation", function (t) {
          return axisDirectionVector.map(function (a) {
            return state.scale(t) * a;
          }).join(" ");
        }).append("Transform").attr("translation", tickDirectionVector.map(function (d, i) {
          return labelInset * d * state.tickPadding + (labelInset + 1) / 2 * state.tickSize * tickDirectionVector[i];
        })).append("Billboard").attr("axisOfRotation", "0 0 0").append("Shape").call(makeSolid, "black").append("Text").attr("string", function (d) {
          return "\"".concat(state.tickFormat(d), "\"");
        }).append("FontStyle").attr("size", 1.3).attr("family", "\"SANS\"").attr("style", "BOLD").attr("justify", "\"MIDDLE\" \"MIDDLE\"").merge(labels);
        labels.transition().attr("translation", function (t) {
          return axisDirectionVector.map(function (a) {
            return state.scale(t) * a;
          }).join(" ");
        }).select("Transform").attr("translation", tickDirectionVector.map(function (d, i) {
          return labelInset * d * state.tickPadding + (labelInset + 1) / 2 * state.tickSize * tickDirectionVector[i];
        })).on("start", function () {
          d3__namespace.select(this).select("Billboard").select("Shape").select("Text").attr("string", function (d) {
            return "\"".concat(state.tickFormat(d), "\"");
          });
        });
        labels.exit().remove();
      });
    };

    /**
     * Label Position Getter / Setter
     *
     * @param {string} _v - Position ("proximal" or "distal")
     * @returns {*}
     */
    my.labelPosition = function (_v) {
      if (!arguments.length) return labelPosition;
      labelPosition = _v;
      labelInset = labelPosition === "distal" ? 1 : -1;
      return my;
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} scale - D3 Scale.
     * @param {string} direction - Direction of Axis (e.g. "x", "y", "z").
     * @param {string} tickDirection - Direction of Ticks (e.g. "x", "y", "z").
     * @param {Array} tickArguments - Tick arguments.
     * @param {Array} tickValues - Tick values.
     * @param {string} tickFormat - Tick format.
     * @param {number} tickSize - Tick length.
     * @param {number} tickPadding - Tick padding size.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Multi Plane Axis Component
   *
   * @module
   */
  function componentAxisThreePlane () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["blue", "red", "green"],
      labelPosition: "proximal",
      xScale: undefined,
      yScale: undefined,
      zScale: undefined
    };
    var classed = "d3X3dAxisThreePlane";

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
        var element = d3__namespace.select(this).classed(classed, true);
        var layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
        element.selectAll("group").data(layers).enter().append("Group").attr("class", function (d) {
          return d;
        });
        xzAxis.scale(state.xScale).direction("x").tickDirection("z").tickSize(state.zScale.range()[1] - state.zScale.range()[0]).color(state.colors[0]).labelPosition(state.labelPosition);
        yzAxis.scale(state.yScale).direction("y").tickDirection("z").tickSize(state.zScale.range()[1] - state.zScale.range()[0]).color(state.colors[1]).labelPosition(state.labelPosition);
        yxAxis.scale(state.yScale).direction("y").tickDirection("x").tickSize(state.xScale.range()[1] - state.xScale.range()[0]).color(state.colors[1]).labelPosition(state.labelPosition);
        zxAxis.scale(state.zScale).direction("z").tickDirection("x").tickSize(state.xScale.range()[1] - state.xScale.range()[0]).color(state.colors[2]).labelPosition(state.labelPosition);

        // We only want 2 sets of labels on the y axis if they are in distal position.
        if (state.labelPosition === "proximal") {
          // Make the tickFormat return nothing (i.e hide text).
          yxAxis.tickFormat(function () {
            return "";
          });
        } else {
          // Make the yxAxis tickFormat match the yzAxis.
          yxAxis.tickFormat(yzAxis.tickFormat());
        }
        element.select(".xzAxis").call(xzAxis);
        element.select(".yzAxis").call(yzAxis);
        element.select(".yxAxis").call(yxAxis);
        element.select(".zxAxis").call(zxAxis);
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {string} labelPosition - Position ("proximal" or "distal")
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Custom Dispatch Events
   *
   * @type {d3.dispatch}
   */
  var dispatch = d3__namespace.dispatch("d3X3dClick", "d3X3dMouseOver", "d3X3dMouseOut");

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
   * forwards the call to the D3 "click" event handler with the event.
   * Note: X3DOM and D3 event members slightly differ, so d3.mouse() function does not work.
   *
   * @param {event} event
   * @see https://bl.ocks.org/hlvoorhees/5376764
   */
  function forwardEvent(event) {
    var type = event.type;
    var target = d3__namespace.select(event.target);
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
      world: {
        x: event.hitPnt[0],
        y: event.hitPnt[1],
        z: event.hitPnt[2]
      },
      canvas: {
        x: event.layerX,
        y: event.layerY
      },
      page: {
        x: pagePoint.x,
        y: pagePoint.y
      }
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
      var paddingLeft = parseFloat(computedStyle.getPropertyValue("padding-left"));
      var borderLeftWidth = parseFloat(computedStyle.getPropertyValue("border-left-width"));
      var paddingTop = parseFloat(computedStyle.getPropertyValue("padding-top"));
      var borderTopWidth = parseFloat(computedStyle.getPropertyValue("border-top-width"));
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
      x3dom.debug.logError("Unable to find getBoundingClientRect or webkitConvertPointFromPageToNode");
    }
    return {
      x: pageX,
      y: pageY
    };
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
    var node = event.target;
    while (node.nodeName.toLowerCase() !== "x3d") {
      node = node.parentElement;
    }
    return node.parentNode;
  }

  var events = /*#__PURE__*/Object.freeze({
    __proto__: null,
    attachEventListners: attachEventListners,
    dispatch: dispatch,
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
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 2
      },
      colors: ["orange", "red", "yellow", "steelblue", "green"],
      transparency: 0,
      xScale: undefined,
      yScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dBars";

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.3);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]);
      }
      if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(state.colors);
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
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var shape = function shape(el) {
          var shape = el.append("Shape");
          attachEventListners(shape);
          shape.append("Box").attr("size", "1.0 1.0 1.0");
          shape.append("Appearance").append("Material").attr("diffuseColor", function (d) {
            // If colour scale is linear then use value for scale.
            var color = state.colorScale(d.key);
            if (typeof state.colorScale.interpolate === "function") {
              color = state.colorScale(d.value);
            }
            return colorParse(color);
          }).attr("ambientIntensity", 0.1).attr("transparency", state.transparency);
          return shape;
        };
        var bars = element.selectAll(".bar").data(function (d) {
          return d.values;
        }, function (d) {
          return d.key;
        });
        bars.enter().append("Transform").classed("bar", true).call(shape).merge(bars).transition().attr("scale", function (d) {
          var x = state.xScale.bandwidth();
          var y = state.yScale(d.value);
          var z = state.dimensions.z;
          return x + " " + y + " " + z;
        }).attr("translation", function (d) {
          var x = state.xScale(d.key);
          var y = state.yScale(d.value) / 2;
          var z = 0.0;
          return x + " " + y + " " + z;
        });
        bars.exit().remove();
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} colorScale - D3 scale.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {Number} transparency - Transparency level 0 - 1.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Multi Series Bar Chart Component
   *
   * @module
   */
  function componentBarsMultiSeries () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["orange", "red", "yellow", "steelblue", "green"],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dBarsMultiSeries";

    /* Components */
    var bars = componentBars();

    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var summary = assignSeriesScales(state, data, {
        xScale: function xScale(seriesSummary, dimensions) {
          return d3__namespace.scaleBand().domain(seriesSummary.columnKeys).range([0, dimensions.x]).padding(0.5);
        },
        yScale: function yScale(seriesSummary, dimensions) {
          return d3__namespace.scaleLinear().domain([0, seriesSummary.valueMax]).range([0, dimensions.y]).nice();
        },
        zScale: function zScale(seriesSummary, dimensions) {
          return d3__namespace.scaleBand().domain(seriesSummary.rowKeys).range([0, dimensions.z]).padding(0.7);
        }
      });
      if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleOrdinal().domain(summary.columnKeys).range(state.colors);
      }
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
        var element = d3__namespace.select(this).classed(classed, true);
        drawSeriesGroups(element, state, {
          groupClass: "barGroup",
          mark: bars,
          configure: function configure(mark) {
            return mark.colors(state.colors);
          },
          colorBySeries: false
        });
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Bubble Chart Component
   *
   * @module
   */
  function componentBubbles () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: d3__namespace.schemeRdYlGn[8],
      color: undefined,
      mappings: undefined,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined,
      sizeScale: undefined,
      sizeRange: [0.2, 4.0]
    };
    var classed = "d3X3dBubbles";

    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var newData = {};
      ['x', 'y', 'z', 'size', 'color'].forEach(function (dimension) {
        var set = {
          key: dimension,
          values: []
        };
        data.values.forEach(function (d) {
          var key = state.mappings[dimension];
          var value = d.values.find(function (v) {
            return v.key === key;
          }).value;
          set.values.push({
            key: key,
            value: value
          });
        });
        newData[dimension] = dataTransform(set).summary();
      });
      var extentX = newData.x.valueExtent;
      var extentY = newData.y.valueExtent;
      var extentZ = newData.z.valueExtent;
      var extentSize = newData.size.valueExtent;
      var extentColor = newData.color.valueExtent;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scaleLinear().domain(extentX).range([0, state.dimensions.x]);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(extentY).range([0, state.dimensions.y]);
      }
      if (typeof state.zScale === "undefined") {
        state.zScale = d3__namespace.scaleLinear().domain(extentZ).range([0, state.dimensions.z]);
      }
      if (typeof state.sizeScale === "undefined") {
        state.sizeScale = d3__namespace.scaleLinear().domain(extentSize).range(state.sizeRange);
      }
      if (state.color) {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range([state.color, state.color]);
      } else if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range(state.colors);
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
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var shape = function shape(el) {
          var shape = el.append("Shape");
          attachEventListners(shape);
          shape.append("Sphere").attr("radius", function (d) {
            var sizeVal = d.values.find(function (v) {
              return v.key === state.mappings.size;
            }).value;
            return state.sizeScale(sizeVal);
          });
          shape.append("Appearance").append("Material").attr("diffuseColor", function (d) {
            var colorVal = d.values.find(function (v) {
              return v.key === state.mappings.color;
            }).value;
            return colorParse(state.colorScale(colorVal));
          }).attr("ambientIntensity", 0.1);
          return shape;
        };
        var bubbles = element.selectAll(".bubble").data(function (d) {
          return d.values;
        }, function (d) {
          return d.key;
        });
        var bubblesEnter = bubbles.enter().append("Transform").attr("class", "bubble").call(shape).merge(bubbles);
        var bubblesTransition = bubblesEnter.transition();
        bubblesTransition.attr("translation", function (d) {
          var xVal = d.values.find(function (v) {
            return v.key === state.mappings.x;
          }).value;
          var yVal = d.values.find(function (v) {
            return v.key === state.mappings.y;
          }).value;
          var zVal = d.values.find(function (v) {
            return v.key === state.mappings.z;
          }).value;
          return state.xScale(xVal) + " " + state.yScale(yVal) + " " + state.zScale(zVal);
        });
        bubblesTransition.select("Shape").select("Sphere").attr("radius", function (d) {
          var sizeVal = d.values.find(function (v) {
            return v.key === state.mappings.size;
          }).value;
          return state.sizeScale(sizeVal);
        });
        bubblesTransition.select("Shape").select("Appearance").select("Material").attr("diffuseColor", function (d) {
          var colorVal = d.values.find(function (v) {
            return v.key === state.mappings.color;
          }).value;
          return colorParse(state.colorScale(colorVal));
        });
        bubbles.exit().remove();
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} sizeScale - D3 size scale.
     * @param {number[]} sizeRange - Size min and max (e.g. [1, 9]).
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     * @param {Array} colors - Array of colours used by color scale.
     * @param {Object} mappings - Map properties to size, colour etc.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Multi Series Bubble Chart Component
   *
   * @module
   */
  function componentBubblesMultiSeries () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["green", "red", "yellow", "steelblue", "orange"],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined,
      sizeScale: undefined,
      sizeRange: [0.5, 3.0]
    };
    var classed = "d3X3dBubblesMultiSeries";

    /* Scales */
    var colorDomain = [];

    /* Components */
    var bubbles = componentBubbles().mappings({
      x: 'x',
      y: 'y',
      z: 'z',
      size: 'size',
      color: 'color'
    }).colors(d3__namespace.schemeRdYlGn[8]).sizeRange([2, 2]);

    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var rowKeys = assignCoordinateScales(state, data);
      colorDomain = arrayUnique(colorDomain, rowKeys);
      state.colorScale = d3__namespace.scaleOrdinal().domain(colorDomain).range(state.colors);
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
        var element = d3__namespace.select(this).classed(classed, true);
        bubbles.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale).sizeScale(state.sizeScale);
        var addBubbles = function addBubbles(d) {
          var color = state.colorScale(d.key);
          bubbles.color(color);
          d3__namespace.select(this).call(bubbles);
        };
        var bubbleGroup = element.selectAll(".bubbleGroup").data(coordinateSeriesData, function (d) {
          return d.key;
        });
        bubbleGroup.enter().append("Group").classed("bubbleGroup", true).merge(bubbleGroup).transition().each(addBubbles);
        bubbleGroup.exit().remove();
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 Scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 Scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {d3.scale} sizeScale - D3 size scale.
     * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Crosshair Component
   *
   * @module
   */
  function componentCrosshair () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["blue", "red", "green"],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined
    };
    var classed = "d3X3dCrosshair";
    var radius = 0.1;

    /**
     * Constructor
     *
     * @constructor
     * @alias crosshair
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        state.dimensions.x = state.xScale ? Math.max.apply(Math, _toConsumableArray(state.xScale.range())) : state.dimensions.x;
        state.dimensions.y = state.yScale ? Math.max.apply(Math, _toConsumableArray(state.yScale.range())) : state.dimensions.y;
        state.dimensions.z = state.zScale ? Math.max.apply(Math, _toConsumableArray(state.zScale.range())) : state.dimensions.z;
        var xOff = state.dimensions.x / 2;
        var yOff = state.dimensions.y / 2;
        var zOff = state.dimensions.z / 2;
        var xVal = state.xScale(data.x);
        var yVal = state.yScale(data.y);
        var zVal = state.zScale(data.z);
        function getPositionVector(axisDir) {
          var positionVectors = {
            x: [xOff, yVal, zVal],
            y: [xVal, yOff, zVal],
            z: [xVal, yVal, zOff]
          };
          return positionVectors[axisDir];
        }
        function getRotationVector(axisDir) {
          var rotationVectors = {
            x: [1, 1, 0, Math.PI],
            y: [1, 0, 1, Math.PI],
            z: [0, 1, 1, Math.PI]
          };
          return rotationVectors[axisDir];
        }
        var colorScale = d3__namespace.scaleOrdinal().domain(Object.keys(state.dimensions)).range(state.colors);

        // Origin Ball
        var ballSelect = element.selectAll(".ball").data([data]);
        var ball = ballSelect.enter().append("Transform").attr("translation", "".concat(xVal, " ").concat(yVal, " ").concat(zVal)).classed("ball", true).append("Shape");
        ball.append("Appearance").append("Material").attr("diffuseColor", colorParse("blue"));
        ball.append("Sphere").attr("radius", 0.3);
        ball.merge(ballSelect);
        ballSelect.transition().ease(d3__namespace.easeQuadOut).attr("translation", "".concat(xVal, " ").concat(yVal, " ").concat(zVal));

        // Crosshair Lines
        var lineSelect = element.selectAll(".line").data(Object.keys(state.dimensions));
        var line = lineSelect.enter().append("Transform").classed("line", true).attr("translation", function (d) {
          return getPositionVector(d).join(" ");
        }).attr("rotation", function (d) {
          return getRotationVector(d).join(" ");
        }).append("Shape");
        line.append("cylinder").attr("radius", radius).attr("height", function (d) {
          return state.dimensions[d];
        });
        line.append("Appearance").append("Material").attr("diffuseColor", function (d) {
          return colorParse(colorScale(d));
        });
        line.merge(lineSelect);
        lineSelect.transition().ease(d3__namespace.easeQuadOut).attr("translation", function (d) {
          return getPositionVector(d).join(" ");
        });
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Donut Chart Component
   *
   * @module
   */
  function componentDonut () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["orange", "red", "yellow", "steelblue", "green"],
      xScale: undefined,
      yScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dDonut";

    /* Scales */
    var colorDomain = [];

    /**
     * Unique Array
     *
     * @param {array} array1
     * @param {array} array2
     * @returns {array}
     */
    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var _dataTransform$summar = dataTransform(data).summary(),
        columnKeys = _dataTransform$summar.columnKeys,
        rowTotal = _dataTransform$summar.rowTotal;
      state.xScale = d3__namespace.scaleLinear().domain([0, rowTotal]).range([0, Math.PI * 2]);
      state.yScale = d3__namespace.scaleLinear().domain([0, rowTotal]).range([Math.PI * 2, 0]);
      colorDomain = arrayUnique(colorDomain, columnKeys);
      state.colorScale = d3__namespace.scaleOrdinal().domain(colorDomain).range(state.colors);
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias donut
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        init(data);
        var _state$dimensions = state.dimensions,
          dimensionX = _state$dimensions.x,
          dimensionY = _state$dimensions.y,
          dimensionZ = _state$dimensions.z;
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var shape = function shape(el) {
          var shape = el.append("Shape");
          attachEventListners(shape);
          shape.append("Torus").attr("containerField", "geometry").attr("angle", function (d) {
            return state.xScale(d.value);
          }).attr("innerRadius", 0.25).attr("outerRadius", 1).attr("useGeoCache", false).attr("subdivision", "48,48");
          shape.append("Appearance").append("Material").attr("diffuseColor", function (d) {
            // If colour scale is linear then use value for scale.
            var color = state.colorScale(d.key);
            if (typeof state.colorScale.interpolate === "function") {
              color = state.colorScale(d.value);
            }
            return colorParse(color);
          });
          return shape;
        };
        var sectors = element.selectAll(".sector").data(function (d) {
          return dataTransform(d).stacked().values;
        }, function (d) {
          return d.key;
        });
        var sectorsEnter = sectors.enter().append("Transform").classed("sector", true).call(shape).merge(sectors);
        var sectorsTransition = sectorsEnter.transition().duration(300).ease(d3__namespace.easeBounce).attr("scale", function () {
          return [dimensionX, dimensionY, dimensionZ].map(function (d) {
            return d / 2;
          }).join(" ");
        }).attr("rotation", function (d) {
          return [0, 0, 1, state.yScale(d.y0)].join(" ");
        });
        sectorsTransition.select("Shape").select("Torus").attr("angle", function (d) {
          return state.xScale(d.value);
        });
        sectors.exit().remove();
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} colorScale - D3 scale.
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Heat Map Component
   *
   * @module
   */
  function componentHeatMap () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["#1e253f", "#e33b30"],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dHeatMap";

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y,
        dimensionZ = _state$dimensions.z;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scaleBand().domain(columnKeys).range([0, dimensionX]).paddingOuter(0.5).paddingInner(0.1).align(1);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
      }
      if (typeof state.zScale === "undefined") {
        state.zScale = d3__namespace.scaleBand().domain(rowKeys.reverse()).range([0, dimensionZ]).paddingOuter(0.5).paddingInner(0.1).align(1);
      }
      if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleLinear().domain(valueExtent).range(state.colors);
      }
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias heatMap
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        init(data);
        var element = d3__namespace.select(this).classed(classed, true);
        bars.xScale(state.xScale).yScale(state.yScale).dimensions({
          x: state.dimensions.x,
          y: state.dimensions.y,
          z: state.zScale.bandwidth()
        }).colorScale(state.colorScale).transparency(0.2);
        var addBars = function addBars() {
          d3__namespace.select(this).call(bars);
        };
        var barGroup = element.selectAll(".barGroup").data(function (d) {
          return d;
        }, function (d) {
          return d.key;
        });
        barGroup.enter().append("Transform").classed("barGroup", true).merge(barGroup).transition().attr("translation", function (d) {
          var x = 0;
          var y = 0;
          var z = state.zScale(d.key);
          return x + " " + y + " " + z;
        }).each(addBars);
        barGroup.exit().remove();
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Intersecting Planes Component
   *
   * @module
   */
  function componentIntersectPlanes () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["blue", "red", "green"],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined
    };
    var classed = "d3X3dIntersectPlanes";

    /**
     * Constructor
     *
     * @constructor
     * @alias intersectPlanes
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        state.dimensions.x = state.xScale ? Math.max.apply(Math, _toConsumableArray(state.xScale.range())) : state.dimensions.x;
        state.dimensions.y = state.yScale ? Math.max.apply(Math, _toConsumableArray(state.yScale.range())) : state.dimensions.y;
        state.dimensions.z = state.zScale ? Math.max.apply(Math, _toConsumableArray(state.zScale.range())) : state.dimensions.z;
        var xOff = state.dimensions.x / 2;
        var yOff = state.dimensions.y / 2;
        var zOff = state.dimensions.z / 2;
        var xVal = state.xScale(data.x);
        var yVal = state.yScale(data.y);
        var zVal = state.zScale(data.z);
        function getPositionVector(axisDir) {
          var positionVectors = {
            x: [xOff, yOff, zVal],
            y: [xVal, yOff, zOff],
            z: [xOff, yVal, zOff]
          };
          return positionVectors[axisDir];
        }
        function getRotationVector(axisDir) {
          var rotationVectors = {
            x: [1, 1, 0, Math.PI],
            y: [1, 0, 1, Math.PI],
            z: [0, 1, 1, Math.PI]
          };
          return rotationVectors[axisDir];
        }
        var colorScale = d3__namespace.scaleOrdinal().domain(Object.keys(state.dimensions)).range(state.colors);

        // Planes
        var planeSelect = element.selectAll(".plane").data(Object.keys(state.dimensions));
        var plane = planeSelect.enter().append("Transform").classed("plane", true).attr("translation", function (d) {
          return getPositionVector(d).join(" ");
        }).attr("rotation", function (d) {
          return getRotationVector(d).join(" ");
        }).append("Shape");
        plane.append("plane").attr("size", function () {
          return "".concat(state.dimensions.x, ",").concat(state.dimensions.y);
        }).attr("solid", false);
        plane.append("Appearance").append("Material").attr("transparency", 0.7).attr("diffuseColor", function (d) {
          return colorParse(colorScale(d));
        });
        plane.merge(planeSelect);
        planeSelect.transition().ease(d3__namespace.easeQuadOut).attr("translation", function (d) {
          return getPositionVector(d).join(" ");
        });
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Label Component
   *
   * @module
   */
  function componentLabel () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      color: "black",
      offset: 0,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined
    };
    var classed = "d3X3dLabel";

    /**
     * Constructor
     *
     * @constructor
     * @alias label
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var makeSolid = function makeSolid(el, color) {
          el.append("Appearance").append("Material").attr("diffuseColor", colorParse(color) || "0 0 0");
        };
        var labelSelect = element.selectAll(".label").data([data]);
        var label = labelSelect.enter().append("Transform").attr("translation", function (d) {
          return state.xScale(d.x) + " " + state.yScale(d.y) + " " + state.zScale(d.z);
        }).classed("label", true).append("Billboard").attr("axisOfRotation", "0 0 0").append("Transform").attr("translation", function () {
          return state.offset + " " + state.offset + " " + state.offset;
        }).append("Shape").call(makeSolid, state.color).append("Text").attr("string", function (d) {
          return d.key;
        }).append("FontStyle").attr("size", 1).attr("family", "SANS").attr("style", "BOLD").attr("justify", "START");
        label.merge(labelSelect);
        labelSelect.transition().ease(d3__namespace.easeQuadOut).attr("translation", function (d) {
          return state.xScale(d.x) + " " + state.yScale(d.y) + " " + state.zScale(d.z);
        });
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     * @param {number} offset - Label offset number.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable X3D Light Component
   *
   * @module
   */
  function componentLight () {
    /* Default Properties */
    var state = {
      direction: "1 0 -1",
      intensity: 0.5,
      shadowIntensity: 0
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias light
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function () {
        var light = d3__namespace.select(this).selectAll("DirectionalLight").data([null]);
        light.enter().append("DirectionalLight").attr("on", true).attr("direction", state.direction).attr("intensity", state.intensity).attr("shadowIntensity", state.shadowIntensity).merge(light);
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {string} direction - Direction vector (e.g. "1 0 -1").
     * @param {number} intensity - Intensity value.
     * @param {number} shadowIntensity - Intensity value.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Particle Plot Component
   *
   * @module
   */
  function componentParticles () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: d3__namespace.schemeRdYlGn[8],
      color: undefined,
      mappings: undefined,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dBubbles";

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
      var newData = {};
      ['x', 'y', 'z', 'color'].forEach(function (dimension) {
        var set = {
          key: dimension,
          values: []
        };
        data.values.forEach(function (d) {
          var key = state.mappings[dimension];
          var value = d.values.find(function (v) {
            return v.key === key;
          }).value;
          set.values.push({
            key: key,
            value: value
          });
        });
        newData[dimension] = dataTransform(set).summary();
      });
      var extentX = newData.x.valueExtent;
      var extentY = newData.y.valueExtent;
      var extentZ = newData.z.valueExtent;
      var extentColor = newData.color.valueExtent;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scaleLinear().domain(extentX).range([0, state.dimensions.x]);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(extentY).range([0, state.dimensions.y]);
      }
      if (typeof state.zScale === "undefined") {
        state.zScale = d3__namespace.scaleLinear().domain(extentZ).range([0, state.dimensions.z]);
      }
      if (state.color) {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range([state.color, state.color]);
      } else if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range(state.colors);
      }
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias particles
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        init(data);
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var particleData = function particleData(data) {
          var pointCoords = function pointCoords(Y) {
            return Y.values.map(function (d) {
              var xVal = d.values.find(function (v) {
                return v.key === state.mappings.x;
              }).value;
              var yVal = d.values.find(function (v) {
                return v.key === state.mappings.y;
              }).value;
              var zVal = d.values.find(function (v) {
                return v.key === state.mappings.z;
              }).value;
              return [state.xScale(xVal), state.yScale(yVal), state.zScale(zVal)];
            });
          };
          var pointColors = function pointColors(Y) {
            return Y.values.map(function (d) {
              var colorVal = d.values.find(function (v) {
                return v.key === state.mappings.color;
              }).value;
              var color = d3__namespace.color(state.colorScale(colorVal));
              return colorParse(color);
            });
          };
          data.point = array2dToString(pointCoords(data));
          data.color = array2dToString(pointColors(data));
          return [data];
        };
        var shape = function shape(el) {
          var shape = el.append("Shape");

          /*
          // FIXME: x3dom cannot have empty IFS nodes, we must to use .html() rather than .append() & .attr().
          const appearance = shape.append("Appearance");
          appearance.append("PointProperties")
          	.attr("colorMode", "POINT_COLOR")
          	.attr("pointSizeMinValue", 1)
          	.attr("pointSizeMaxValue", 100)
          	.attr("pointSizeScaleFactor", 5);
          	const pointset = shape.append("PointSet");
          pointset.append("Coordinate")
          	.attr("point", (d) => d.point);
          pointset.append("Color")
          	.attr("color", (d) => d.color);
          */

          shape.html(function (d) {
            return "\n\t\t\t\t\t<Appearance>\n\t\t\t\t\t\t<PointProperties colorMode=\"POINT_COLOR\" pointSizeMinValue=\"1\" pointSizeMaxValue=\"100\" pointSizeScaleFactor=\"5\"></PointProperties>\n\t\t\t\t\t</Appearance>\n\t\t\t\t\t<PointSet>\n\t\t\t\t\t\t<Coordinate point=\"".concat(d.point, "\"></Coordinate>\n\t\t\t\t\t\t<Color color=\"").concat(d.color, "\"></Color>\n\t\t\t\t\t</IndexedFaceset>\n\t\t\t\t  ");
          });
        };
        var particles = element.selectAll(".particle").data(function (d) {
          return particleData(d);
        }, function (d) {
          return d.key;
        });
        particles.enter().append("Group").classed("particle", true).call(shape).merge(particles);
        var particleTransition = particles.transition().select("Shape");
        particleTransition.select("PointSet").select("Coordinate").attr("point", function (d) {
          return d.point;
        });
        particleTransition.select("PointSet").select("Color").attr("color", function (d) {
          return d.color;
        });
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     * @param {Array} colors - Array of colours used by color scale.
     * @param {Object} mappings - Map properties to colour etc.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Ribbon Chart Component
   *
   * @module
   */
  function componentRibbon () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 5
      },
      color: "red",
      smoothed: d3__namespace.curveBasis,
      xScale: undefined,
      yScale: undefined
    };
    var transparency = 0.1;
    var classed = "d3X3dRibbon";

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scalePoint().domain(columnKeys).range([0, dimensionX]);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]);
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
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        drawIndexedFaceStrip(element, state, {
          itemClass: "ribbon",
          transparency: transparency,
          quad: function quad(pointThis, pointNext) {
            var x1 = state.xScale(pointThis.key);
            var x2 = state.xScale(pointNext.key);
            var y1 = state.yScale(pointThis.value);
            var y2 = state.yScale(pointNext.value);
            var z1 = 1 - state.dimensions.z / 2;
            var z2 = state.dimensions.z / 2;
            return [x1, y1, z1, x1, y1, z2, x2, y2, z2, x2, y2, z1];
          }
        });
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: {number}, y: {number}, z: {number}}} dimensions - 3D Object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     * @param {d3.curve} smoothed
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Multi Series Ribbon Chart Component
   *
   * @module
   */
  function componentRibbonMultiSeries () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["orange", "red", "yellow", "steelblue", "green"],
      smoothed: d3__namespace.curveBasis,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dRibbonMultiSeries";

    /* Scales */
    var colorDomain = [];

    /* Components */
    var ribbon = componentRibbon();

    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var summary = assignSeriesScales(state, data, {
        overwrite: true,
        xScale: function xScale(seriesSummary, dimensions) {
          return d3__namespace.scalePoint().domain(seriesSummary.columnKeys).range([0, dimensions.x]);
        },
        yScale: function yScale(seriesSummary, dimensions) {
          return d3__namespace.scaleLinear().domain([0, seriesSummary.valueMax]).range([0, dimensions.y]);
        },
        zScale: function zScale(seriesSummary, dimensions) {
          return d3__namespace.scaleBand().domain(seriesSummary.rowKeys).range([0, dimensions.z]).padding(0.4);
        }
      });
      colorDomain = arrayUnique(colorDomain, summary.rowKeys);
      state.colorScale = d3__namespace.scaleOrdinal().domain(colorDomain).range(state.colors);
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
        var element = d3__namespace.select(this).classed(classed, true);
        drawSeriesGroups(element, state, {
          groupClass: "ribbonGroup",
          mark: ribbon,
          configure: function configure(mark) {
            return mark.smoothed(state.smoothed);
          },
          colorBySeries: true
        });
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {d3.curve} smoothed
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Spot Plot Component
   *
   * @module
   */
  function componentSpots () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: d3__namespace.schemeRdYlGn[8],
      color: undefined,
      mappings: undefined,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined,
      sizeScale: undefined,
      sizeRange: [0.5, 3.5],
      plane: "x"
    };
    var classed = "d3X3dSpots";

    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var newData = {};
      ['x', 'y', 'z', 'size', 'color'].forEach(function (dimension) {
        var set = {
          key: dimension,
          values: []
        };
        data.values.forEach(function (d) {
          var key = state.mappings[dimension];
          var value = d.values.find(function (v) {
            return v.key === key;
          }).value;
          set.values.push({
            key: key,
            value: value
          });
        });
        newData[dimension] = dataTransform(set).summary();
      });
      var extentX = newData.x.valueExtent;
      var extentY = newData.y.valueExtent;
      var extentZ = newData.z.valueExtent;
      var extentSize = newData.size.valueExtent;
      var extentColor = newData.color.valueExtent;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scaleLinear().domain(extentX).range([0, state.dimensions.x]);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(extentY).range([0, state.dimensions.y]);
      }
      if (typeof state.zScale === "undefined") {
        state.zScale = d3__namespace.scaleLinear().domain(extentZ).range([0, state.dimensions.z]);
      }
      if (typeof state.sizeScale === "undefined") {
        state.sizeScale = d3__namespace.scaleLinear().domain(extentSize).range(state.sizeRange);
      }
      if (state.color) {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range([state.color, state.color]);
      } else if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range(state.colors);
      }
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias spots
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        init(data);
        function getPositionVector(axisDir, d) {
          var xVal = state.xScale(d.values.find(function (v) {
            return v.key === state.mappings.x;
          }).value);
          var yVal = state.yScale(d.values.find(function (v) {
            return v.key === state.mappings.y;
          }).value);
          var zVal = state.zScale(d.values.find(function (v) {
            return v.key === state.mappings.z;
          }).value);
          var positionVectors = {
            x: [0, yVal, zVal],
            y: [xVal, 0, zVal],
            z: [xVal, yVal, 0]
          };
          return positionVectors[axisDir];
        }
        function getRotationVector(axisDir) {
          var rotationVectors = {
            x: [1, 1, 0, Math.PI],
            y: [1, 0, 1, Math.PI],
            z: [0, 1, 1, Math.PI]
          };
          return rotationVectors[axisDir];
        }
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var shape = function shape(el) {
          var shape = el.append("Shape");
          shape.append("Cylinder").attr("radius", function (d) {
            var sizeVal = d.values.find(function (v) {
              return v.key === state.mappings.size;
            }).value;
            return state.sizeScale(sizeVal);
          }).attr("height", 0.1);
          shape.append("Appearance").append("Material").attr("transparency", 0.1).attr("diffuseColor", function (d) {
            var colorVal = d.values.find(function (v) {
              return v.key === state.mappings.color;
            }).value;
            return colorParse(state.colorScale(colorVal));
          });
          return shape;
        };
        var spots = element.selectAll(".spot").data(function (d) {
          return d.values;
        }, function (d) {
          return d.key;
        });
        var spotsEnter = spots.enter().append("Transform").attr("class", "spot").call(shape).merge(spots);
        var spotsTransition = spotsEnter.transition();
        spotsTransition.attr("translation", function (d) {
          return getPositionVector(state.plane, d).join();
        }).attr("rotation", function () {
          return getRotationVector(state.plane).join();
        });
        spotsTransition.select("Shape").select("Cylinder").attr("radius", function (d) {
          var sizeVal = d.values.find(function (v) {
            return v.key === state.mappings.size;
          }).value;
          return state.sizeScale(sizeVal);
        });
        spotsTransition.select("Shape").select("Appearance").select("Material").attr("diffuseColor", function (d) {
          var colorVal = d.values.find(function (v) {
            return v.key === state.mappings.color;
          }).value;
          return colorParse(state.colorScale(colorVal));
        });
        spots.exit().remove();
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {string} plane - Plane of Spots (e.g. "x", "y", "z").
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} sizeScale - D3 size scale.
     * @param {number[]} sizeRange - Size min and max (e.g. [1, 9]).
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     * @param {Array} colors - Array of colours used by color scale.
     * @param {Object} mappings - Map properties to size, colour etc.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Multi Series Spot Plot Component
   *
   * @module
   */
  function componentSpotsMultiSeries () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["green", "red", "yellow", "steelblue", "orange"],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined,
      sizeScale: undefined,
      sizeRange: [0.5, 3.0]
    };
    var classed = "d3X3dSpotsMultiSeries";

    /* Scales */
    var colorDomain = [];

    /* Components */
    var spots = componentSpots().mappings({
      x: 'x',
      y: 'y',
      z: 'z',
      size: 'size',
      color: 'color'
    }).colors(d3__namespace.schemeRdYlGn[8]).sizeRange([2, 2]);

    /**
     * Initialise Data and Scales
     *
     * @private
     * @param {Array} data - Chart data.
     */
    var init = function init(data) {
      var rowKeys = assignCoordinateScales(state, data);
      colorDomain = arrayUnique(colorDomain, rowKeys);
      state.colorScale = d3__namespace.scaleOrdinal().domain(colorDomain).range(state.colors);
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias spotsMultiSeries
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function (data) {
        init(data);
        spots.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale).sizeScale(state.sizeScale);
        var element = d3__namespace.select(this).classed(classed, true);
        var addSpots = function addSpots(d) {
          var color = state.colorScale(d.key);
          spots.color(color);
          d3__namespace.select(this).call(spots);
        };
        var spotGroup = element.selectAll(".spotGroup").data(['x', 'y', 'z']);
        var spotGroupEnter = spotGroup.enter().append("Group").classed("spotGroup", true).merge(spotGroup);
        spotGroupEnter.each(function (plane, i, nodes) {
          spots.plane(plane);
          var el = d3__namespace.select(nodes[i]);
          el.classed(plane, true);
          var spotSeries = el.selectAll(".spotSeries").data(coordinateSeriesData(data), function (d) {
            return d.key;
          });
          spotSeries.enter().append("Group").classed("spotSeries", true).merge(spotSeries).transition().each(addSpots);
          spotSeries.exit().remove();
        });
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 Scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 Scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {d3.scale} sizeScale - D3 size scale.
     * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Surface Area Component
   *
   * @module
   */
  function componentSurface () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["blue", "red"],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dSurface";

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y,
        dimensionZ = _state$dimensions.z;
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scalePoint().domain(rowKeys).range([0, dimensionX]);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]);
      }
      if (typeof state.zScale === "undefined") {
        state.zScale = d3__namespace.scalePoint().domain(columnKeys).range([0, dimensionZ]);
      }
      if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleLinear().domain(valueExtent).range(state.colors).interpolate(d3__namespace.interpolateLab);
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
        var element = d3__namespace.select(this).classed(classed, true);
        var surfaceData = function surfaceData(data) {
          var coordPoints = function coordPoints(Y) {
            return Y.map(function (X) {
              return X.values.map(function (d) {
                return [state.xScale(X.key), state.yScale(d.value), state.zScale(d.key)];
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
                var color = d3__namespace.color(state.colorScale(d.value));
                return colorParse(color);
              });
            });
          };
          data.coordIndex = array2dToString(coordIndex(data));
          data.point = array2dToString(coordPoints(data));
          data.color = array2dToString(colorFaceSet(data));
          return [data];
        };
        var shape = function shape(el) {
          var shape = el.append("Shape").classed("surface", true);
          var ifs = shape.append("IndexedFaceset").attr("coordIndex", function (d) {
            return d.coordIndex;
          }).attr("solid", false);
          ifs.append("Coordinate").attr("point", function (d) {
            return d.point;
          });
          ifs.append("Color").attr("color", function (d) {
            return d.color;
          });
          return shape;
        };
        var surface = element.selectAll(".surface").data(function (d) {
          return surfaceData(d);
        }, function (d) {
          return d.key;
        });
        surface.enter().call(shape).merge(surface);
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
     * Dispatch On Getter
     *
     * @returns {*}
     */
    my.on = function () {
      var value = dispatch.on.apply(dispatch, arguments);
      return value === dispatch ? my : value;
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Common utilities
   * @module glMatrix
   */

  // Configuration Constants
  var EPSILON = 0.000001;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;

  /**
   * 3x3 Matrix
   * @module mat3
   */

  /**
   * Creates a new identity mat3
   *
   * @returns {mat3} a new 3x3 matrix
   */
  function create$3() {
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
   * 3 Dimensional Vector
   * @module vec3
   */

  /**
   * Creates a new, empty vec3
   *
   * @returns {vec3} a new 3D vector
   */
  function create$2() {
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
   * @param {ReadonlyVec3} a vector to calculate length of
   * @returns {Number} length of a
   */
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
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
   * @param {ReadonlyVec3} a vector to normalize
   * @returns {vec3} out
   */
  function normalize$2(out, a) {
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
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {Number} dot product of a and b
   */
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  /**
   * Computes the cross product of two vec3's
   *
   * @param {vec3} out the receiving vector
   * @param {ReadonlyVec3} a the first operand
   * @param {ReadonlyVec3} b the second operand
   * @returns {vec3} out
   */
  function cross(out, a, b) {
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
  (function () {
    var vec = create$2();
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
  })();

  /**
   * 4 Dimensional Vector
   * @module vec4
   */

  /**
   * Creates a new, empty vec4
   *
   * @returns {vec4} a new 4D vector
   */
  function create$1() {
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
   * Normalize a vec4
   *
   * @param {vec4} out the receiving vector
   * @param {ReadonlyVec4} a vector to normalize
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
  (function () {
    var vec = create$1();
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
  })();

  /**
   * Quaternion in the format XYZW
   * @module quat
   */

  /**
   * Creates a new identity quat
   *
   * @returns {quat} a new quaternion
   */
  function create() {
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
   * Sets a quat from the given angle and rotation axis,
   * then returns it.
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyVec3} axis the axis around which to rotate
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
   * Gets the rotation axis and angle for a given
   *  quaternion. If a quaternion is created with
   *  setAxisAngle, this method will return the same
   *  values as providied in the original parameter list
   *  OR functionally equivalent values.
   * Example: The quaternion formed by axis [0, 0, 1] and
   *  angle -90 is the same as the quaternion formed by
   *  [0, 0, 1] and 270. This method favors the latter.
   * @param  {vec3} out_axis  Vector receiving the axis of rotation
   * @param  {ReadonlyQuat} q     Quaternion to be decomposed
   * @return {Number}     Angle, in radians, of the rotation
   */
  function getAxisAngle(out_axis, q) {
    var rad = Math.acos(q[3]) * 2.0;
    var s = Math.sin(rad / 2.0);
    if (s > EPSILON) {
      out_axis[0] = q[0] / s;
      out_axis[1] = q[1] / s;
      out_axis[2] = q[2] / s;
    } else {
      // If s is zero, return any axis (no rotation - axis does not matter)
      out_axis[0] = 1;
      out_axis[1] = 0;
      out_axis[2] = 0;
    }
    return rad;
  }

  /**
   * Performs a spherical linear interpolation between two quat
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a the first operand
   * @param {ReadonlyQuat} b the second operand
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
    var omega, cosom, sinom, scale0, scale1;

    // calc cosine
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    // adjust signs (if necessary)
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    // calculate coefficients
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
    }
    // calculate final values
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }

  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The resultant quaternion is not normalized, so you should be sure
   * to renormalize the quaternion yourself where necessary.
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyMat3} m rotation matrix
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
   * Normalize a quat
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a quaternion to normalize
   * @returns {quat} out
   * @function
   */
  var normalize = normalize$1;

  /**
   * Sets a quaternion to represent the shortest rotation from one
   * vector to another.
   *
   * Both vectors are assumed to be unit length.
   *
   * @param {quat} out the receiving quaternion.
   * @param {ReadonlyVec3} a the initial vector
   * @param {ReadonlyVec3} b the destination vector
   * @returns {quat} out
   */
  var rotationTo = function () {
    var tmpvec3 = create$2();
    var xUnitVec3 = fromValues(1, 0, 0);
    var yUnitVec3 = fromValues(0, 1, 0);
    return function (out, a, b) {
      var dot$1 = dot(a, b);
      if (dot$1 < -0.999999) {
        cross(tmpvec3, xUnitVec3, a);
        if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
        normalize$2(tmpvec3, tmpvec3);
        setAxisAngle(out, tmpvec3, Math.PI);
        return out;
      } else if (dot$1 > 0.999999) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      } else {
        cross(tmpvec3, a, b);
        out[0] = tmpvec3[0];
        out[1] = tmpvec3[1];
        out[2] = tmpvec3[2];
        out[3] = 1 + dot$1;
        return normalize(out, out);
      }
    };
  }();

  /**
   * Performs a spherical linear interpolation with two control points
   *
   * @param {quat} out the receiving quaternion
   * @param {ReadonlyQuat} a the first operand
   * @param {ReadonlyQuat} b the second operand
   * @param {ReadonlyQuat} c the third operand
   * @param {ReadonlyQuat} d the fourth operand
   * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
   * @returns {quat} out
   */
  (function () {
    var temp1 = create();
    var temp2 = create();
    return function (out, a, b, c, d, t) {
      slerp(temp1, a, d, t);
      slerp(temp2, b, c, t);
      slerp(out, temp1, temp2, 2 * t * (1 - t));
      return out;
    };
  })();

  /**
   * Sets the specified quaternion with values corresponding to the given
   * axes. Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   *
   * @param {ReadonlyVec3} view  the vector representing the viewing direction
   * @param {ReadonlyVec3} right the vector representing the local "right" direction
   * @param {ReadonlyVec3} up    the vector representing the local "up" direction
   * @returns {quat} out
   */
  (function () {
    var matr = create$3();
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
      return normalize(out, fromMat3(out, matr));
    };
  })();

  /**
   * Reusable 3D Vector Fields Component
   *
   * @module
   */
  function componentVectorFields () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: d3__namespace.schemeRdYlGn[8],
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined,
      sizeScale: undefined,
      sizeRange: [2.0, 5.0]
    };
    state.vectorFunction = function (x, y, z) {
      return {
        vx: x,
        vy: y,
        vz: z
      };
    };
    var classed = "d3X3dVectorFields";

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y,
        dimensionZ = _state$dimensions.z;
      var extent = d3__namespace.extent(data.values.map(function (f) {
        var vx, vy, vz;
        if ("vx" in f) {
          vx = f.vx;
          vy = f.vy;
          vz = f.vz;
        } else {
          var _state$vectorFunction = state.vectorFunction(f.x, f.y, f.z, f.value);
          vx = _state$vectorFunction.vx;
          vy = _state$vectorFunction.vy;
          vz = _state$vectorFunction.vz;
        }
        var vector = fromValues(vx, vy, vz);
        return length(vector);
      }));
      if (typeof state.xScale === "undefined") {
        state.xScale = d3__namespace.scaleLinear().domain([minX, maxX]).range([0, dimensionX]);
      }
      if (typeof state.yScale === "undefined") {
        state.yScale = d3__namespace.scaleLinear().domain([minY, maxY]).range([0, dimensionY]);
      }
      if (typeof state.zScale === "undefined") {
        state.zScale = d3__namespace.scaleLinear().domain([minZ, maxZ]).range([0, dimensionZ]);
      }
      if (typeof state.sizeScale === "undefined") {
        state.sizeScale = d3__namespace.scaleLinear().domain(extent).range(state.sizeRange);
      }
      if (typeof state.colorScale === "undefined") {
        state.colorScale = d3__namespace.scaleQuantize().domain(extent).range(state.colors);
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
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var vectorData = function vectorData(d) {
          return d.values.map(function (f) {
            var vx, vy, vz;
            if ("vx" in f) {
              vx = f.vx;
              vy = f.vy;
              vz = f.vz;
            } else {
              var _state$vectorFunction2 = state.vectorFunction(f.x, f.y, f.z, f.value);
              vx = _state$vectorFunction2.vx;
              vy = _state$vectorFunction2.vy;
              vz = _state$vectorFunction2.vz;
            }
            var vecStart = fromValues(0, 1, 0);
            var vecEnd = fromValues(vx, vy, vz);
            var vecLen = length(vecEnd);

            // rotationTo required unit vectors
            var vecNormal = create$2();
            normalize$2(vecNormal, vecEnd);
            var quat = create();
            rotationTo(quat, vecStart, vecNormal);
            var vecRotate = create$2();
            var angleRotate = getAxisAngle(vecRotate, quat);
            if (!vecLen) {
              // If there is no vector length return null (and filter them out after)
              return null;
            }

            // Calculate transform-translation attr
            f.translation = state.xScale(f.x) + " " + state.yScale(f.y) + " " + state.zScale(f.z);

            // Calculate vector length
            f.value = vecLen;

            // Calculate transform-rotation attr
            f.rotation = [].concat(_toConsumableArray(vecRotate), [angleRotate]).join(" ");
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
          var offset = state.sizeScale(d.value) / 2;
          return "0 " + offset + " 0";
        }).append("Group");
        var arrowHead = arrowsEnter.append("Shape");
        arrowHead.append("Appearance").append("Material").attr("diffuseColor", function (d) {
          return colorParse(state.colorScale(d.value));
        });
        arrowHead.append("Cylinder").attr("height", function (d) {
          return state.sizeScale(d.value);
        }).attr("radius", 0.1);
        var arrowShaft = arrowsEnter.append("Transform").attr("translation", function (d) {
          var offset = state.sizeScale(d.value) / 2;
          return "0 " + offset + " 0";
        }).append("Shape");
        arrowShaft.append("Appearance").append("Material").attr("diffuseColor", function (d) {
          return colorParse(state.colorScale(d.value));
        });
        arrowShaft.append("Cone").attr("height", 1).attr("bottomRadius", 0.4);
        arrowsEnter.merge(arrows);
        arrows.transition().attr("translation", function (d) {
          return d.translation;
        });
        arrows.exit().remove();
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} sizeScale - D3 color scale.
     * @param {number[]} sizeRange - Size min and max (e.g. [1, 9]).
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {function} vectorFunction - Vector Function.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable X3D Viewpoint Component
   *
   * @module
   */
  function componentViewpoint () {
    /* Default Properties */
    var state = {
      centerOfRotation: [0.0, 0.0, 0.0],
      viewPosition: [80.0, 15.0, 80.0],
      viewOrientation: [0.0, 1.0, 0.0, 0.8],
      fieldOfView: 0.8
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias viewpoint
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function () {
        var viewpoint = d3__namespace.select(this).selectAll("viewpoint").data([null]);
        viewpoint.enter().append("Viewpoint").attr("centerOfRotation", state.centerOfRotation.join(" ")).attr("position", state.viewPosition.join(" ")).attr("orientation", state.viewOrientation.join(" ")).attr("fieldOfView", state.fieldOfView).attr("set_bind", "true").merge(viewpoint);
      });
    };

    /**
     * Set Quick Viewpoint
     *
     * @param {string} view - "left", "side", "top", "dimetric"
     * @returns {my}
     */
    my.quickView = function (view) {
      switch (view) {
        case "left":
          state.centerOfRotation = [0.0, 0.0, 0.0];
          state.viewPosition = [37.10119, 18.70484, 51.01594];
          state.viewOrientation = [0.06724, 0.99767, -0.01148, 0.33908];
          state.fieldOfView = 1.0;
          break;
        case "side":
          state.centerOfRotation = [20.0, 0.0, 0.0];
          state.viewPosition = [20.00000, 20.00000, 50.00000];
          state.viewOrientation = [0.00000, 0.00000, 0.00000, 0.00000];
          state.fieldOfView = 1.0;
          break;
        case "top":
          state.centerOfRotation = [0.0, 0.0, 0.0];
          state.viewPosition = [27.12955, 106.67181, 31.65828];
          state.viewOrientation = [-0.86241, 0.37490, 0.34013, 1.60141];
          state.fieldOfView = 1.0;
          break;
        case "dimetric":
        default:
          state.centerOfRotation = [0.0, 0.0, 0.0];
          state.viewPosition = [80.0, 15.0, 80.0];
          state.viewOrientation = [0.0, 1.0, 0.0, 0.8];
          state.fieldOfView = 0.8;
      }
      return my;
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {number[]} centerOfRotation - Centre of rotation.
     * @param {number[]} viewPosition - View position.
     * @param {number[]} viewOrientation - View orientation.
     * @param {number} fieldOfView - Field of view.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Volume Slice Component
   *
   * @module
   */
  function componentVolumeSlice () {
    /* Default Properties */
    var state = {
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      imageUrl: undefined,
      numberOfSlices: undefined,
      slicesOverX: undefined,
      slicesOverY: undefined,
      volumeStyle: "OpacityMap"
    };
    var classed = "d3X3dVolumeSlice";

    /* Other Volume Properties */

    /**
     * Constructor
     *
     * @constructor
     * @alias volumeSlice
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      selection.each(function () {
        var element = d3__namespace.select(this).classed(classed, true).attr("id", function (d) {
          return d.key;
        });
        var _state$dimensions = state.dimensions,
          dimensionX = _state$dimensions.x,
          dimensionY = _state$dimensions.y,
          dimensionZ = _state$dimensions.z;
        var volumedata = element.append("Transform").append("VolumeData").attr("dimensions", "".concat(dimensionX, " ").concat(dimensionY, " ").concat(dimensionZ));
        volumedata.append("ImageTextureAtlas").attr("crossOrigin", "anonymous").attr("containerField", "voxels").attr("url", state.imageUrl).attr("numberOfSlices", state.numberOfSlices).attr("slicesOverX", state.slicesOverX).attr("slicesOverY", state.slicesOverY);
        switch (state.volumeStyle) {
          case "MPRVolume":
            volumedata.append("MPRVolumeStyle").attr("forceOpaic", true).selectAll(".plane").data(function (d) {
              return d.values;
            }).enter().append("MPRPlane").classed("plane", true).attr("normal", function (d) {
              return "".concat(d.x, " ").concat(d.y, " ").concat(d.z);
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
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {string} imageUrl - Image URL path.
     * @param {number} numberOfSlices - Total number of slices.
     * @param {number} slicesOverX - Number of slices over X axis.
     * @param {number} slicesOverY - Number of slices over Y axis.
     * @param {string} volumeStyle - Volume render style (either "MPRVolume" or "OpacityMap")
     */
    attachAccessors(my, state);
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
    donut: componentDonut,
    heatMap: componentHeatMap,
    intersectPlanes: componentIntersectPlanes,
    label: componentLabel,
    light: componentLight,
    particles: componentParticles,
    ribbon: componentRibbon,
    ribbonMultiSeries: componentRibbonMultiSeries,
    spots: componentSpots,
    spotsMultiSeries: componentSpotsMultiSeries,
    surface: componentSurface,
    vectorFields: componentVectorFields,
    viewpoint: componentViewpoint,
    volumeSlice: componentVolumeSlice
  };

  var torus$1="data:model/x3d+xml;charset=utf-8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIFgzRCBQVUJMSUMgIklTTy8vV2ViM0QvL0RURCBYM0QgMy4zLy9FTiIgImh0dHA6Ly93d3cud2ViM2Qub3JnL3NwZWNpZmljYXRpb25zL3gzZC0zLjMuZHRkIj4KPFgzRCBwcm9maWxlPSdGdWxsJyB2ZXJzaW9uPSczLjMnIHhtbG5zOnhzZD0naHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnCgkJIHhzZDpub05hbWVzcGFjZVNjaGVtYUxvY2F0aW9uPSdodHRwOi8vd3d3LndlYjNkLm9yZy9zcGVjaWZpY2F0aW9ucy94M2QtMy4zLnhzZCc+Cgk8aGVhZD4KCQk8bWV0YSBuYW1lPSdjb21tZW50JyBjb250ZW50PSdUb3J1cyBQcm90b3R5cGUnLz4KCQk8bWV0YSBuYW1lPSdjcmVhdG9yJyBjb250ZW50PSdKYW1lcyBTYXVuZGVycycvPgoJCTxtZXRhIG5hbWU9J2NyZWF0ZWQnIGNvbnRlbnQ9J1NhdCwgMjQgRGVjIDIwMjIgMjE6MDU6MDAgR01UJy8+Cgk8L2hlYWQ+Cgk8U2NlbmU+CgkJPFByb3RvRGVjbGFyZSBuYW1lPSdUb3J1cyc+CgkJCTxQcm90b0ludGVyZmFjZT4KCQkJCTxmaWVsZCBhY2Nlc3NUeXBlPSdpbnB1dE91dHB1dCcgdHlwZT0nU0ZGbG9hdCcgbmFtZT0nYW5nbGUnIHZhbHVlPSc2LjI4MzE4NTMwNzE4Jz48L2ZpZWxkPgoJCQkJPGZpZWxkIGFjY2Vzc1R5cGU9J2lucHV0T3V0cHV0JyB0eXBlPSdTRkZsb2F0JyBuYW1lPSdpbm5lclJhZGl1cycgdmFsdWU9JzAuNSc+PC9maWVsZD4KCQkJCTxmaWVsZCBhY2Nlc3NUeXBlPSdpbnB1dE91dHB1dCcgdHlwZT0nU0ZGbG9hdCcgbmFtZT0nb3V0ZXJSYWRpdXMnIHZhbHVlPScxLjAnPjwvZmllbGQ+CgkJCQk8ZmllbGQgYWNjZXNzVHlwZT0naW5wdXRPdXRwdXQnIHR5cGU9J1NGVmVjMmYnIG5hbWU9J3N1YmRpdmlzaW9uJyB2YWx1ZT0nMjQsMjQnPjwvZmllbGQ+CgkJCQk8ZmllbGQgYWNjZXNzVHlwZT0naW5pdGlhbGl6ZU9ubHknIHR5cGU9J1NGQm9vbCcgbmFtZT0nY2FwcycgdmFsdWU9J3RydWUnPjwvZmllbGQ+CgkJCQk8ZmllbGQgYWNjZXNzVHlwZT0naW5pdGlhbGl6ZU9ubHknIHR5cGU9J1NGQm9vbCcgbmFtZT0nc29saWQnIHZhbHVlPSd0cnVlJz48L2ZpZWxkPgoJCQk8L1Byb3RvSW50ZXJmYWNlPgoJCQk8UHJvdG9Cb2R5PgoJCQkJPEV4dHJ1c2lvbiBERUY9J0dlb21ldHJ5JyBiZWdpbkNhcD0ndHJ1ZScgZW5kQ2FwPSd0cnVlJyBzb2xpZD0ndHJ1ZScgY3JlYXNlQW5nbGU9JzEnPgoJCQkJCTxJUz4KCQkJCQkJPGNvbm5lY3Qgbm9kZUZpZWxkPSdzb2xpZCcgcHJvdG9GaWVsZD0nc29saWQnPjwvY29ubmVjdD4KCQkJCQkJPGNvbm5lY3Qgbm9kZUZpZWxkPSdiZWdpbkNhcCcgcHJvdG9GaWVsZD0nY2Fwcyc+PC9jb25uZWN0PgoJCQkJCQk8Y29ubmVjdCBub2RlRmllbGQ9J2VuZENhcCcgcHJvdG9GaWVsZD0nY2Fwcyc+PC9jb25uZWN0PgoJCQkJCTwvSVM+CgkJCQk8L0V4dHJ1c2lvbj4KCQkJCTxTY3JpcHQgdHlwZT0nbW9kZWwveDNkK3htbCc+CgkJCQkJPGZpZWxkIGFjY2Vzc1R5cGU9J2lucHV0T3V0cHV0JyB0eXBlPSdTRkZsb2F0JyBuYW1lPSdhbmdsZSc+PC9maWVsZD4KCQkJCQk8ZmllbGQgYWNjZXNzVHlwZT0naW5wdXRPdXRwdXQnIHR5cGU9J1NGRmxvYXQnIG5hbWU9J2lubmVyUmFkaXVzJz48L2ZpZWxkPgoJCQkJCTxmaWVsZCBhY2Nlc3NUeXBlPSdpbnB1dE91dHB1dCcgdHlwZT0nU0ZGbG9hdCcgbmFtZT0nb3V0ZXJSYWRpdXMnPjwvZmllbGQ+CgkJCQkJPGZpZWxkIGFjY2Vzc1R5cGU9J2lucHV0T3V0cHV0JyB0eXBlPSdTRlZlYzJmJyBuYW1lPSdzdWJkaXZpc2lvbic+PC9maWVsZD4KCQkJCQk8ZmllbGQgYWNjZXNzVHlwZT0naW5pdGlhbGl6ZU9ubHknIHR5cGU9J1NGTm9kZScgbmFtZT0nZ2VvbWV0cnknPgoJCQkJCQk8RXh0cnVzaW9uIFVTRT0nR2VvbWV0cnknPjwvRXh0cnVzaW9uPgoJCQkJCTwvZmllbGQ+CgkJCQkJPElTPgoJCQkJCQk8Y29ubmVjdCBub2RlRmllbGQ9J2FuZ2xlJyBwcm90b0ZpZWxkPSdhbmdsZSc+PC9jb25uZWN0PgoJCQkJCQk8Y29ubmVjdCBub2RlRmllbGQ9J2lubmVyUmFkaXVzJyBwcm90b0ZpZWxkPSdpbm5lclJhZGl1cyc+PC9jb25uZWN0PgoJCQkJCQk8Y29ubmVjdCBub2RlRmllbGQ9J291dGVyUmFkaXVzJyBwcm90b0ZpZWxkPSdvdXRlclJhZGl1cyc+PC9jb25uZWN0PgoJCQkJCQk8Y29ubmVjdCBub2RlRmllbGQ9J3N1YmRpdmlzaW9uJyBwcm90b0ZpZWxkPSdzdWJkaXZpc2lvbic+PC9jb25uZWN0PgoJCQkJCTwvSVM+CgkJCQkJPCFbQ0RBVEFbZWNtYXNjcmlwdDoKCgkJCQkJZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHsKCQkJCQkJZXZlbnRzUHJvY2Vzc2VkKCk7CgkJCQkJfQoKCQkJCQlmdW5jdGlvbiBldmVudHNQcm9jZXNzZWQoKSB7CgkJCQkJCWxldCBzcGluZSA9IG5ldyBNRlZlYzNmKCk7CgkJCQkJCWxldCBjcm9zc1NlY3Rpb24gPSBuZXcgTUZWZWMyZigpOwoKCQkJCQkJLy8gQ3Jvc3Mtc2VjdGlvbgoJCQkJCQlsZXQgbWlub3JTdWJkaXZpc2lvbiA9IHN1YmRpdmlzaW9uWzBdOwoJCQkJCQlmb3IgKGxldCBpID0gMDsgaSA8IG1pbm9yU3ViZGl2aXNpb247ICsraSkgewoJCQkJCQkJbGV0IHggPSBNYXRoLnNpbigyICogTWF0aC5QSSAqIGkgLyBtaW5vclN1YmRpdmlzaW9uKTsKCQkJCQkJCWxldCB5ID0gTWF0aC5jb3MoMiAqIE1hdGguUEkgKiBpIC8gbWlub3JTdWJkaXZpc2lvbik7CgkJCQkJCQljcm9zc1NlY3Rpb25baV0gPSBuZXcgU0ZWZWMyZih4LCB5KS5tdWx0aXBseShpbm5lclJhZGl1cyk7CgkJCQkJCX0KCQkJCQkJY3Jvc3NTZWN0aW9uW21pbm9yU3ViZGl2aXNpb25dID0gY3Jvc3NTZWN0aW9uWzBdOwoKCQkJCQkJLy8gU3BpbmUKCQkJCQkJbGV0IGEgPSBNYXRoLm1pbihhbmdsZSwgMiAqIE1hdGguUEkpOwoJCQkJCQlsZXQgbWFqb3JTdWJkaXZpc2lvbiA9IE1hdGguY2VpbChzdWJkaXZpc2lvblsxXSAqIChhIC8gKDIgKiBNYXRoLlBJKSkpOwoJCQkJCQlmb3IgKGxldCBpID0gMDsgaSA8PSBtYWpvclN1YmRpdmlzaW9uOyArK2kpIHsKCQkJCQkJCWxldCB4ID0gTWF0aC5jb3MoLWEgKiBpIC8gbWFqb3JTdWJkaXZpc2lvbik7CgkJCQkJCQlsZXQgeiA9IE1hdGguc2luKC1hICogaSAvIG1ham9yU3ViZGl2aXNpb24pOwoJCQkJCQkJc3BpbmVbaV0gPSBuZXcgU0ZWZWMzZih4LCB6LCAwKS5tdWx0aXBseShvdXRlclJhZGl1cyk7CgkJCQkJCX0KCgkJCQkJCS8vIElmIGl0IGlzIGEgZnVsbCBjaXJjbGUgd3JhcCBiYWNrIHRvIHN0YXJ0CgkJCQkJCWlmIChhID09PSAyICogTWF0aC5QSSkgewoJCQkJCQkJc3BpbmVbbWFqb3JTdWJkaXZpc2lvbl0gPSBzcGluZVswXTsKCQkJCQkJfSBlbHNlIHsKCQkJCQkJCS8vIEFkZCB0d28gcG9pbnRzIGJlZm9yZSBsYXN0IGFuZCBhZnRlciBmaXJzdCwgdG8gZ2V0IGNsb3NlciB0byBjaXJjbGUuCgkJCQkJCQlsZXQgeDIgPSBNYXRoLmNvcygtYSAqIDAuOTk5OSk7CgkJCQkJCQlsZXQgejIgPSBNYXRoLnNpbigtYSAqIDAuOTk5OSk7CgkJCQkJCQlzcGluZS5zcGxpY2UobWFqb3JTdWJkaXZpc2lvbiwgMCwgbmV3IFNGVmVjM2YoeDIsIHoyLCAwKS5tdWx0aXBseShvdXRlclJhZGl1cykpOwoJCQkJCQkJbGV0IHgxID0gTWF0aC5jb3MoLWEgKiAwLjAwMDEpOwoJCQkJCQkJbGV0IHoxID0gTWF0aC5zaW4oLWEgKiAwLjAwMDEpOwoJCQkJCQkJc3BpbmUuc3BsaWNlKDEsIDAsIG5ldyBTRlZlYzNmKHgxLCB6MSwgMCkubXVsdGlwbHkob3V0ZXJSYWRpdXMpKTsKCQkJCQkJfQoKCQkJCQkJZ2VvbWV0cnkuc2V0X2Nyb3NzU2VjdGlvbiA9IGNyb3NzU2VjdGlvbjsKCQkJCQkJZ2VvbWV0cnkuc2V0X3NwaW5lID0gc3BpbmU7CgkJCQkJfQoKCQkJCV1dPgoJCQkJPC9TY3JpcHQ+CgkJCTwvUHJvdG9Cb2R5PgoJCTwvUHJvdG9EZWNsYXJlPgoJPC9TY2VuZT4KPC9YM0Q+Cg==";var prototypes = {torus:torus$1};

  var torus = prototypes.torus;

  /**
   * Construct base X3D element
   *
   * @module
   */
  function buildX3d(selection, width, height, debug) {
    // Create X3D element (if it does not exist already)
    // See: https://www.web3d.org/x3d/profiles
    var x3d = selection.selectAll("X3D").data([0]).enter().append("X3D").attr("profile", "Interactive").attr("width", width + "px").attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false").attr("useGeoCache", false);
    x3d.append("head").append("component").attr("name", "Text").attr("level", "1");
    return x3d;
  }

  /**
   * Append External X3D Prototypes
   *
   * @module
   */
  function buildProtos(scene) {
    var proto = scene.append("ExternProtoDeclare").attr("name", "Torus").attr("url", "\"".concat(torus, "\""));
    proto.append("field").attr("accessType", "inputOutput").attr("type", "SFFloat").attr("name", "angle").attr("value", Math.PI * 2);
    proto.append("field").attr("accessType", "inputOutput").attr("type", "SFFloat").attr("name", "innerRadius").attr("value", 0.5);
    proto.append("field").attr("accessType", "inputOutput").attr("type", "SFFloat").attr("name", "outerRadius").attr("value", 1.0);
    proto.append("field").attr("accessType", "inputOutput").attr("type", "SFVec2f").attr("name", "subdivision").attr("value", "24,24");
    proto.append("field").attr("accessType", "initializeOnly").attr("type", "SFBool").attr("name", "caps").attr("value", true);
    proto.append("field").attr("accessType", "initializeOnly").attr("type", "SFBool").attr("name", "solid").attr("value", true);
    return proto;
  }

  /**
   * Construct base Scene elements
   *
   * @module
   */
  function buildScene(x3d, layers, classed) {
    // Create Scene
    var scene = x3d.selectAll("Scene").data([0]).enter().append("Scene");
    if (typeof x3dom !== "undefined") {
      // Gamma correction only works on X3DOM.
      scene.append("Environment").attr("gammaCorrectionDefault", "none");
    } else {
      // X_ITE does not support the Torus shape - load prototype Torus.
      scene.call(buildProtos);
    }

    // Add a white background
    scene.append("Background").attr("groundColor", "1 1 1").attr("skyColor", "1 1 1");

    // Add layer groups
    scene.classed(classed, true).selectAll("Group").data(layers).enter().append("Group").attr("class", function (d) {
      return d;
    });
    return scene;
  }

  /**
   * Reusable X3D Base and Scene Component
   *
   * @module
   */
  function createScene(selection, layers, classed, width, height, debug) {
    var x3d = buildX3d(selection, width, height, debug);
    var scene = buildScene(x3d, layers, classed);
    // For some reason we need to re-select the scene after building it to allow for charts to refresh.
    // Example: /examples/X3DOM/chart/BarChartMultiSeries.html adding additional series to chart does not
    // refresh without the line below.
    scene = selection.select("Scene");
    return scene;
  }

  /**
   * Column point scales shared by the area and ribbon charts.
   * Scales are replaced on every call.
   *
   * @param {Array} data
   * @param {Object} state
   */
  function initColumnPointScales(data, state) {
    var _dataTransform$summar = dataTransform(data).summary(),
      rowKeys = _dataTransform$summar.rowKeys,
      columnKeys = _dataTransform$summar.columnKeys,
      valueMax = _dataTransform$summar.valueMax;
    var valueExtent = [0, valueMax];
    var _state$dimensions = state.dimensions,
      dimensionX = _state$dimensions.x,
      dimensionY = _state$dimensions.y,
      dimensionZ = _state$dimensions.z;
    state.xScale = d3__namespace.scalePoint().domain(columnKeys).range([0, dimensionX]);
    state.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
    state.zScale = d3__namespace.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);
    state.colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(state.colors);
  }

  /**
   * Viewpoint orientation shared by the area and ribbon charts.
   *
   * @param {Function} viewpoint
   */
  function orientSeriesViewpoint(viewpoint) {
    viewpoint.viewOrientation([-0.61021, 0.77568, 0.16115, 0.65629]).viewPosition([77.63865, 54.69470, 104.38314]);
  }

  /**
   * Linear coordinate scales shared by the bubble chart and spot plot.
   * Scales are replaced on every call.
   *
   * @param {Array} data
   * @param {Object} state
   */
  function initCoordinateScales(data, state) {
    var _dataTransform$summar2 = dataTransform(data).summary(),
      valueExtent = _dataTransform$summar2.valueExtent,
      coordinatesExtent = _dataTransform$summar2.coordinatesExtent,
      rowKeys = _dataTransform$summar2.rowKeys;
    var extentX = coordinatesExtent.x,
      extentY = coordinatesExtent.y,
      extentZ = coordinatesExtent.z;
    var _state$dimensions2 = state.dimensions,
      dimensionX = _state$dimensions2.x,
      dimensionY = _state$dimensions2.y,
      dimensionZ = _state$dimensions2.z;
    state.xScale = d3__namespace.scaleLinear().domain(extentX).range([0, dimensionX]);
    state.yScale = d3__namespace.scaleLinear().domain(extentY).range([0, dimensionY]);
    state.zScale = d3__namespace.scaleLinear().domain(extentZ).range([0, dimensionZ]);
    state.colorScale = d3__namespace.scaleOrdinal().domain(rowKeys).range(state.colors);
    state.sizeScale = d3__namespace.scaleLinear().domain(valueExtent).range(state.sizeRange);
  }

  /**
   * Build a chart that creates a scene, viewpoint, axis, mark, and optional light.
   * `init` assigns scales on every call. `draw` covers marks that are not a single layer call.
   *
   * @param {Object} spec
   * @returns {Function}
   */
  function sceneChart(spec) {
    var state = _objectSpread2({}, spec.state);
    var viewpoint = component.viewpoint();
    var axis = spec.axis();
    var mark = spec.mark();
    var light = spec.light ? component.light() : null;
    var my = function my(selection) {
      var scene = createScene(selection, spec.layers, spec.classed, state.width, state.height, state.debug);
      selection.each(function (data) {
        spec.init(data, state);
        viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);
        if (spec.viewpoint) spec.viewpoint(viewpoint, state);
        scene.call(viewpoint);
        axis.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale);
        if (spec.configureAxis) spec.configureAxis(axis, state);
        scene.select(".axis").call(axis);
        mark.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale);
        if (spec.configureMark) spec.configureMark(mark, state);
        if (spec.markLayer) {
          scene.select(spec.markLayer).datum(data).call(mark);
        }
        if (spec.draw) {
          spec.draw({
            scene: scene,
            state: state,
            mark: mark,
            data: data
          });
        }
        if (light) scene.call(light);
      });
    };
    if (spec.events) {
      /**
       * Dispatch On Getter
       *
       * @returns {*}
       */
      my.on = function () {
        var value = dispatch.on.apply(dispatch, arguments);
        return value === dispatch ? my : value;
      };
    }
    attachAccessors(my, state);
    return my;
  }

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
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {Array} colors - Array of colours used by color scale.
   * @param {d3.curve} smoothed
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartAreaChartMultiSeries () {
    return sceneChart({
      classed: "d3X3dAreaChartMultiSeries",
      layers: ["axis", "areas"],
      markLayer: ".areas",
      light: true,
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 60,
          y: 40,
          z: 40
        },
        colors: ["green", "red", "yellow", "steelblue", "orange"],
        debug: false,
        smoothed: d3__namespace.curveMonotoneX,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane().labelPosition("distal");
      },
      mark: function mark() {
        return component.areaMultiSeries();
      },
      init: initColumnPointScales,
      viewpoint: orientSeriesViewpoint,
      configureMark: function configureMark(mark, chartState) {
        mark.colors(chartState.colors).smoothed(chartState.smoothed).dimensions(chartState.dimensions);
      }
    });
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
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {Array} colors - Array of colours used by color scale.
   * @param {string} labelPosition - Position ("proximal" or "distal")
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartBarChartMultiSeries () {
    return sceneChart({
      classed: "d3X3dBarChartMultiSeries",
      layers: ["axis", "bars"],
      markLayer: ".bars",
      light: true,
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 40,
          y: 40,
          z: 40
        },
        colors: ["green", "red", "yellow", "steelblue", "orange"],
        labelPosition: "distal",
        debug: false,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.barsMultiSeries();
      },
      init: function init(data, chartState) {
        var _dataTransform$summar = dataTransform(data).summary(),
          rowKeys = _dataTransform$summar.rowKeys,
          columnKeys = _dataTransform$summar.columnKeys,
          valueMax = _dataTransform$summar.valueMax;
        var valueExtent = [0, valueMax];
        var _chartState$dimension = chartState.dimensions,
          dimensionX = _chartState$dimension.x,
          dimensionY = _chartState$dimension.y,
          dimensionZ = _chartState$dimension.z;
        chartState.xScale = d3__namespace.scaleBand().domain(columnKeys).range([0, dimensionX]).padding(0.5).align(0.75);
        chartState.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
        chartState.zScale = d3__namespace.scaleBand().domain(rowKeys.reverse()).range([0, dimensionZ]).padding(0.5).align(0.75);
        chartState.colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(chartState.colors);
      },
      configureAxis: function configureAxis(axis, chartState) {
        axis.labelPosition(chartState.labelPosition);
      },
      configureMark: function configureMark(mark, chartState) {
        mark.colors(chartState.colors);
      }
    });
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
    /* Default Properties */
    var state = {
      width: 500,
      height: 500,
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["green", "red", "yellow", "steelblue", "orange"],
      debug: false,
      xScale: undefined,
      yScale: undefined,
      colorScale: undefined
    };
    var classed = "d3X3dBarChartVertical";

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y;
      state.xScale = d3__namespace.scaleBand().domain(columnKeys).range([0, dimensionX]).padding(0.5).align(0.75);
      state.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
      state.colorScale = d3__namespace.scaleOrdinal().domain(columnKeys).range(state.colors);
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias barChartVertical
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      var layers = ["xAxis", "yAxis", "bars"];
      var scene = createScene(selection, layers, classed, state.width, state.height, state.debug);
      selection.each(function (data) {
        init(data);

        // Add Viewpoint
        viewpoint.quickView("left");
        scene.call(viewpoint);

        // Add Axis
        xAxis.scale(state.xScale).direction("x").tickDirection("y").tickSize(0);
        yAxis.scale(state.yScale).direction("y").tickDirection("x").tickSize(state.yScale.range()[1] - state.yScale.range()[0]);
        scene.select(".xAxis").call(xAxis);
        scene.select(".yAxis").call(yAxis);

        // Add Bars
        bars.xScale(state.xScale).yScale(state.yScale).colors(state.colors);
        scene.select(".bars").datum(data).call(bars);

        // Add Light
        scene.call(light);
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {number} width - X3D canvas width in px.
     * @param {number} height - X3D canvas height in px.
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {boolean} debug - Show debug log and stats. True/False.
     */
    attachAccessors(my, state);
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
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {Array} colors - Array of colours used by color scale.
   * @param {d3.scale} sizeScale - D3 color scale.
   * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartBubbleChart () {
    return sceneChart({
      classed: "d3X3dBubbleChart",
      layers: ["axis", "bubbles"],
      markLayer: ".bubbles",
      light: true,
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 40,
          y: 40,
          z: 40
        },
        colors: ["green", "red", "yellow", "steelblue", "orange"],
        sizeRange: [0.5, 3.5],
        debug: false,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined,
        sizeScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.bubblesMultiSeries();
      },
      init: initCoordinateScales,
      configureMark: function configureMark(mark, chartState) {
        mark.sizeScale(chartState.sizeScale).colorScale(chartState.colorScale);
      }
    });
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
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartCrosshairPlot () {
    return sceneChart({
      classed: "d3X3dCrosshairPlot",
      layers: ["axis", "crosshairs"],
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 40,
          y: 40,
          z: 40
        },
        debug: false,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.crosshair();
      },
      init: function init(data, chartState) {
        var _dataTransform$summar = dataTransform(data).summary(),
          coordinatesMax = _dataTransform$summar.coordinatesMax;
        var maxX = coordinatesMax.x,
          maxY = coordinatesMax.y,
          maxZ = coordinatesMax.z;
        var _chartState$dimension = chartState.dimensions,
          dimensionX = _chartState$dimension.x,
          dimensionY = _chartState$dimension.y,
          dimensionZ = _chartState$dimension.z;
        chartState.xScale = d3__namespace.scaleLinear().domain([0, maxX]).range([0, dimensionX]);
        chartState.yScale = d3__namespace.scaleLinear().domain([0, maxY]).range([0, dimensionY]);
        chartState.zScale = d3__namespace.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
      },
      configureAxis: function configureAxis(axis, chartState) {
        axis.dimensions(chartState.dimensions);
      },
      draw: function draw(_ref) {
        var scene = _ref.scene,
          mark = _ref.mark,
          data = _ref.data;
        var crosshairs = scene.select(".crosshairs").datum(data).selectAll(".crosshair").data(function (d) {
          return d.values;
        });
        crosshairs.enter().append("group").classed("crosshair", true).merge(crosshairs).transition().each(function () {
          d3__namespace.select(this).call(mark);
        });
      }
    });
  }

  /**
   * Reusable 3D Donut Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.donutChart();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/donut-chart/
   */
  function chartDonutChart () {
    /* Default Properties */
    var state = {
      width: 500,
      height: 500,
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["green", "red", "yellow", "steelblue", "orange"],
      debug: false
    };
    var classed = "d3X3dDonutChart";

    /* Components */
    var viewpoint = component.viewpoint();
    var donut = component.donut();
    var light = component.light();

    /**
     * Constructor
     *
     * @constructor
     * @alias donutChart
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      var layers = ["donut"];
      var scene = createScene(selection, layers, classed, state.width, state.height, state.debug);
      selection.each(function (data) {
        // Add Viewpoint
        viewpoint.quickView("dimetric");

        // Add Donut
        donut.colors(state.colors);
        scene.call(viewpoint);
        scene.select(".donut").datum(data).call(donut);

        // Add Light
        scene.call(light);
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {number} width - X3D canvas width in px.
     * @param {number} height - X3D canvas height in px.
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {boolean} debug - Show debug log and stats. True/False.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Heat Map
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.heatMap();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/heat-map/
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {Array} colors - Array of colours used by color scale.
   * @param {string} labelPosition - Position ("proximal" or "distal")
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartHeatMap () {
    return sceneChart({
      classed: "d3X3dHeatMap",
      layers: ["axis", "bars"],
      markLayer: ".bars",
      light: true,
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 40,
          y: 20,
          z: 40
        },
        colors: ["#1e253f", "#e33b30"],
        labelPosition: "distal",
        debug: false,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.heatMap();
      },
      init: function init(data, chartState) {
        var _dataTransform$summar = dataTransform(data).summary(),
          rowKeys = _dataTransform$summar.rowKeys,
          columnKeys = _dataTransform$summar.columnKeys,
          valueMax = _dataTransform$summar.valueMax;
        var valueExtent = [0, valueMax];
        var _chartState$dimension = chartState.dimensions,
          dimensionX = _chartState$dimension.x,
          dimensionY = _chartState$dimension.y,
          dimensionZ = _chartState$dimension.z;
        chartState.xScale = d3__namespace.scaleBand().domain(columnKeys).range([0, dimensionX]).paddingOuter(0.5).paddingInner(0.1).align(1);
        chartState.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
        chartState.zScale = d3__namespace.scaleBand().domain(rowKeys.reverse()).range([0, dimensionZ]).paddingOuter(0.5).paddingInner(0.1).align(1);
        chartState.colorScale = d3__namespace.scaleLinear().domain(valueExtent).range(chartState.colors);
      },
      configureAxis: function configureAxis(axis, chartState) {
        axis.labelPosition(chartState.labelPosition);
      },
      configureMark: function configureMark(mark, chartState) {
        mark.colors(chartState.colors);
      }
    });
  }

  /**
   * Summarise one column for each mapped dimension.
   *
   * @module
   * @param {Object} data - Series whose values carry `{ key, value }` pairs.
   * @param {Object} mappings - Dimension name to value key.
   * @param {string[]} keys - Dimensions to summarise, such as "x" or "color".
   * @returns {Object} A dataTransform summary for each key.
   */
  function extentsFromMappings(data, mappings, keys) {
    var summaries = {};
    keys.forEach(function (dimension) {
      var set = {
        key: dimension,
        values: []
      };
      data.values.forEach(function (d) {
        var key = mappings[dimension];
        var value = d.values.find(function (v) {
          return v.key === key;
        }).value;
        set.values.push({
          key: key,
          value: value
        });
      });
      summaries[dimension] = dataTransform(set).summary();
    });
    return summaries;
  }

  /**
   * Reusable 3D Particle Plot Chart
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.particlePlot();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/3d-scatterplot/
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {string} color - Color (e.g. "red" or "#ff0000").
   * @param {Array} colors - Array of colours used by color scale.
   * @param {Object} mappings - Map properties to colour etc.
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartParticlePlot () {
    return sceneChart({
      classed: "d3X3dParticlePlot",
      layers: ["axis", "particles"],
      markLayer: ".particles",
      events: true,
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 40,
          y: 40,
          z: 40
        },
        colors: ["orange"],
        color: undefined,
        mappings: undefined,
        debug: false,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.particles();
      },
      init: function init(data, chartState) {
        var newData = extentsFromMappings(data, chartState.mappings, ["x", "y", "z", "color"]);
        var extentX = newData.x.valueExtent;
        var extentY = newData.y.valueExtent;
        var extentZ = newData.z.valueExtent;
        var extentColor = newData.color.valueExtent;
        chartState.xScale = d3__namespace.scaleLinear().domain(extentX).range([0, chartState.dimensions.x]);
        chartState.yScale = d3__namespace.scaleLinear().domain(extentY).range([0, chartState.dimensions.y]);
        chartState.zScale = d3__namespace.scaleLinear().domain(extentZ).range([0, chartState.dimensions.z]);
        if (chartState.color) {
          chartState.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range([chartState.color, chartState.color]);
        } else {
          chartState.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range(chartState.colors);
        }
      },
      configureMark: function configureMark(mark, chartState) {
        mark.mappings(chartState.mappings).colorScale(chartState.colorScale);
      }
    });
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
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {Array} colors - Array of colours used by color scale.
   * @param {d3.curve} smoothed
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartRibbonChartMultiSeries () {
    return sceneChart({
      classed: "d3X3dRibbonChartMultiSeries",
      layers: ["axis", "ribbons"],
      markLayer: ".ribbons",
      light: true,
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 60,
          y: 40,
          z: 40
        },
        colors: ["green", "red", "yellow", "steelblue", "orange"],
        debug: false,
        smoothed: d3__namespace.curveBasis,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.ribbonMultiSeries();
      },
      init: initColumnPointScales,
      viewpoint: orientSeriesViewpoint,
      configureMark: function configureMark(mark, chartState) {
        mark.colors(chartState.colors).smoothed(chartState.smoothed).dimensions(chartState.dimensions);
      }
    });
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
    /* Default Properties */
    var state = {
      width: 500,
      height: 500,
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: ["orange"],
      color: undefined,
      mappings: undefined,
      debug: false,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined,
      sizeScale: undefined,
      sizeRange: [0.2]
    };
    var classed = "d3X3dScatterPlot";

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
      var newData = extentsFromMappings(data, state.mappings, ["x", "y", "z", "size", "color"]);
      var extentX = newData.x.valueExtent;
      var extentY = newData.y.valueExtent;
      var extentZ = newData.z.valueExtent;
      var extentSize = newData.size.valueExtent;
      var extentColor = newData.color.valueExtent;
      state.xScale = d3__namespace.scaleLinear().domain(extentX).range([0, state.dimensions.x]);
      state.yScale = d3__namespace.scaleLinear().domain(extentY).range([0, state.dimensions.y]);
      state.zScale = d3__namespace.scaleLinear().domain(extentZ).range([0, state.dimensions.z]);
      state.sizeScale = d3__namespace.scaleLinear().domain(extentSize).range(state.sizeRange);
      if (state.color) {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range([state.color, state.color]);
      } else {
        state.colorScale = d3__namespace.scaleQuantize().domain(extentColor).range(state.colors);
      }
    };

    /**
     * Constructor
     *
     * @constructor
     * @alias scatterPlot
     * @param {d3.selection} selection - The chart holder D3 selection.
     */
    var my = function my(selection) {
      var layers = ["axis", "bubbles", "crosshair", "label"];
      var scene = createScene(selection, layers, classed, state.width, state.height, state.debug);
      selection.each(function (data) {
        init(data);

        // Add Viewpoint
        viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);
        scene.call(viewpoint);

        // Add Axis
        axis.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale);
        scene.select(".axis").call(axis);

        // Add Crosshair
        crosshair.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale);

        // Add Labels
        label.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale).offset(0.5);

        // Add Bubbles
        bubbles.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale).sizeScale(state.sizeScale).colorScale(state.colorScale).mappings(state.mappings).on("d3X3dClick", function (e) {
          var datum = d3__namespace.select(e.target).datum();
          var xVal = datum.values.find(function (v) {
            return v.key === "x";
          }).value;
          var yVal = datum.values.find(function (v) {
            return v.key === "y";
          }).value;
          var zVal = datum.values.find(function (v) {
            return v.key === "z";
          }).value;
          var d = {
            x: xVal,
            y: yVal,
            z: zVal
          };
          scene.select(".crosshair").datum(d).each(function () {
            d3__namespace.select(this).call(crosshair);
          });
        }).on("d3X3dMouseOver", function (e) {
          var datum = d3__namespace.select(e.target).datum();
          var xVal = datum.values.find(function (v) {
            return v.key === "x";
          }).value;
          var yVal = datum.values.find(function (v) {
            return v.key === "y";
          }).value;
          var zVal = datum.values.find(function (v) {
            return v.key === "z";
          }).value;
          var d = {
            x: xVal,
            y: yVal,
            z: zVal,
            key: datum.key
          };
          scene.select(".label").datum(d).each(function () {
            d3__namespace.select(this).call(label);
          });
        }).on("d3X3dMouseOut", function () {
          scene.select(".label").selectAll("*").remove();
        });
        scene.select(".bubbles").datum(data).call(bubbles);
      });
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

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {number} width - X3D canvas width in px.
     * @param {number} height - X3D canvas height in px.
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} sizeScale - D3 color scale.
     * @param {number[]} sizeRange - Size min and max (e.g. [1, 9]).
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {string} color - Color (e.g. "red" or "#ff0000").
     * @param {Array} colors - Array of colours used by color scale.
     * @param {Object} mappings - Map properties to size, colour etc.
     * @param {boolean} debug - Show debug log and stats. True/False.
     */
    attachAccessors(my, state);
    return my;
  }

  /**
   * Reusable 3D Spot Plot
   *
   * @module
   *
   * @example
   * let chartHolder = d3.select("#chartholder");
   *
   * let myData = [...];
   *
   * let myChart = d3.x3d.chart.spotPlot();
   *
   * chartHolder.datum(myData).call(myChart);
   *
   * @see https://datavizproject.com/data-type/bubble-chart/
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {Array} colors - Array of colours used by color scale.
   * @param {d3.scale} sizeScale - D3 color scale.
   * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartSpotPlot () {
    return sceneChart({
      classed: "d3X3dSpotPlot",
      layers: ["axis", "spots"],
      markLayer: ".spots",
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 40,
          y: 40,
          z: 40
        },
        colors: ["green", "red", "yellow", "steelblue", "orange"],
        sizeRange: [0.5, 3.5],
        debug: false,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined,
        sizeScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.spotsMultiSeries();
      },
      init: initCoordinateScales,
      configureMark: function configureMark(mark, chartState) {
        mark.sizeScale(chartState.sizeScale).colorScale(chartState.colorScale);
      }
    });
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
   *
   * @param {number} width - X3D canvas width in px.
   * @param {number} height - X3D canvas height in px.
   * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
   * @param {d3.scale} xScale - D3 scale.
   * @param {d3.scale} yScale - D3 scale.
   * @param {d3.scale} zScale - D3 scale.
   * @param {d3.scale} colorScale - D3 color scale.
   * @param {Array} colors - Array of colours used by color scale.
   * @param {boolean} debug - Show debug log and stats. True/False.
   */
  function chartSurfacePlot () {
    return sceneChart({
      classed: "d3X3dSurfacePlot",
      layers: ["axis", "surface"],
      markLayer: ".surface",
      state: {
        width: 500,
        height: 500,
        dimensions: {
          x: 40,
          y: 40,
          z: 40
        },
        colors: ["blue", "red"],
        debug: false,
        xScale: undefined,
        yScale: undefined,
        zScale: undefined,
        colorScale: undefined
      },
      axis: function axis() {
        return component.axisThreePlane();
      },
      mark: function mark() {
        return component.surface();
      },
      init: function init(data, chartState) {
        var _dataTransform$summar = dataTransform(data).summary(),
          rowKeys = _dataTransform$summar.rowKeys,
          columnKeys = _dataTransform$summar.columnKeys,
          valueMax = _dataTransform$summar.valueMax;
        var valueExtent = [0, valueMax];
        var _chartState$dimension = chartState.dimensions,
          dimensionX = _chartState$dimension.x,
          dimensionY = _chartState$dimension.y,
          dimensionZ = _chartState$dimension.z;
        chartState.xScale = d3__namespace.scalePoint().domain(rowKeys).range([0, dimensionX]);
        chartState.yScale = d3__namespace.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
        chartState.zScale = d3__namespace.scalePoint().domain(columnKeys).range([0, dimensionZ]);
        chartState.colorScale = d3__namespace.scaleLinear().domain(valueExtent).range(chartState.colors).interpolate(d3__namespace.interpolateLab);
      },
      configureAxis: function configureAxis(axis) {
        axis.labelPosition("distal");
      },
      configureMark: function configureMark(mark, chartState) {
        mark.colors(chartState.colors);
      }
    });
  }

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
    /* Default Properties */
    var state = {
      width: 500,
      height: 500,
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      colors: d3__namespace.schemeRdYlGn[8],
      debug: false,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      colorScale: undefined,
      sizeScale: undefined,
      sizeRange: [2.0, 5.0]
    };
    state.vectorFunction = function (x, y, z) {
      return {
        vx: x,
        vy: y,
        vz: z
      };
    };
    var classed = "d3X3dVectorFieldChart";

    /* Scales */
    var origin = {
      x: 0,
      y: 0,
      z: 0
    };

    /* Components */
    var viewpoint = component.viewpoint();
    var axis = component.crosshair();
    var vectorFields = component.vectorFields();

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
      var _state$dimensions = state.dimensions,
        dimensionX = _state$dimensions.x,
        dimensionY = _state$dimensions.y,
        dimensionZ = _state$dimensions.z;
      var extent = d3__namespace.extent(data.values.map(function (f) {
        var vx, vy, vz;
        if ("vx" in f) {
          vx = f.vx;
          vy = f.vy;
          vz = f.vz;
        } else {
          var _state$vectorFunction = state.vectorFunction(f.x, f.y, f.z, f.value);
          vx = _state$vectorFunction.vx;
          vy = _state$vectorFunction.vy;
          vz = _state$vectorFunction.vz;
        }
        var vector = fromValues(vx, vy, vz);
        return length(vector);
      }));
      state.xScale = d3__namespace.scaleLinear().domain([minX, maxX]).range([0, dimensionX]);
      state.yScale = d3__namespace.scaleLinear().domain([minY, maxY]).range([0, dimensionY]);
      state.zScale = d3__namespace.scaleLinear().domain([minZ, maxZ]).range([0, dimensionZ]);
      state.sizeScale = d3__namespace.scaleLinear().domain(extent).range(state.sizeRange);
      state.colorScale = d3__namespace.scaleQuantize().domain(extent).range(state.colors);

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
      var layers = ["axis", "vectorFields"];
      var scene = createScene(selection, layers, classed, state.width, state.height, state.debug);
      selection.each(function (data) {
        init(data);

        // Add Viewpoint
        viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);
        scene.call(viewpoint);

        // Add Axis
        axis.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale);
        scene.select(".axis").datum(origin).call(axis);

        // Add Vector Fields
        vectorFields.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale).colorScale(state.colorScale).sizeScale(state.sizeScale).vectorFunction(state.vectorFunction);
        scene.select(".vectorFields").datum(data).call(vectorFields);
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {number} width - X3D canvas width in px.
     * @param {number} height - X3D canvas height in px.
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {d3.scale} colorScale - D3 color scale.
     * @param {Array} colors - Array of colours used by color scale.
     * @param {d3.scale} sizeScale - D3 color scale.
     * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
     * @param {function} vectorFunction - Vector Function.
     * @param {boolean} debug - Show debug log and stats. True/False.
     */
    attachAccessors(my, state);
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
    /* Default Properties */
    var state = {
      width: 500,
      height: 500,
      dimensions: {
        x: 40,
        y: 40,
        z: 40
      },
      debug: false,
      xScale: undefined,
      yScale: undefined,
      zScale: undefined,
      imageUrl: undefined,
      numberOfSlices: undefined,
      slicesOverX: undefined,
      slicesOverY: undefined,
      volumeStyle: "OpacityMap"
    };
    var classed = "d3X3dVolumeSliceChart";

    /* Scales */
    var origin = {
      x: 0,
      y: 0,
      z: 0
    };

    /* Other Volume Properties */

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
      var layers = ["axis", "volume"];
      var scene = createScene(selection, layers, classed, state.width, state.height, state.debug);
      selection.each(function () {
        // Add Viewpoint
        viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);
        scene.call(viewpoint);

        // Add Axis
        axis.xScale(state.xScale).yScale(state.yScale).zScale(state.zScale);
        scene.select(".axis").datum(origin).call(axis);

        // Add Volume Slice
        volumeSlice.dimensions(state.dimensions).imageUrl(state.imageUrl).numberOfSlices(state.numberOfSlices).slicesOverX(state.slicesOverX).slicesOverY(state.slicesOverY).volumeStyle(state.volumeStyle);
        scene.select(".volume").append("transform").attr("translation", function () {
          var x = state.dimensions.x / 2;
          var y = state.dimensions.y / 2;
          var z = state.dimensions.z / 2;
          return x + " " + y + " " + z;
        }).datum(function (d) {
          return d;
        }).call(volumeSlice);
      });
    };

    /**
     * Getter / setters. No argument returns the value. One argument sets it and returns the component.
     *
     * @param {number} width - X3D canvas width in px.
     * @param {number} height - X3D canvas height in px.
     * @param {d3.scale} xScale - D3 scale.
     * @param {d3.scale} yScale - D3 scale.
     * @param {d3.scale} zScale - D3 scale.
     * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
     * @param {string} imageUrl - Image URL path.
     * @param {number} numberOfSlices - Total number of slices.
     * @param {number} slicesOverX - Number of slices over X axis.
     * @param {number} slicesOverY - Number of slices over Y axis.
     * @param {string} volumeStyle - Volume render style (either "MPRVolume" or "OpacityMap")
     * @param {boolean} debug - Show debug log and stats. True/False.
     */
    attachAccessors(my, state);
    return my;
  }

  var chart = {
    areaChartMultiSeries: chartAreaChartMultiSeries,
    barChartMultiSeries: chartBarChartMultiSeries,
    barChartVertical: chartBarChartVertical,
    bubbleChart: chartBubbleChart,
    donutChart: chartDonutChart,
    crosshairPlot: chartCrosshairPlot,
    heatMap: chartHeatMap,
    particlePlot: chartParticlePlot,
    ribbonChartMultiSeries: chartRibbonChartMultiSeries,
    scatterPlot: chartScatterPlot,
    spotPlot: chartSpotPlot,
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
    return {
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
  }

  /**
   * Random Dataset - Multi Series
   *
   * @returns {Array}
   */
  function dataset2() {
    return countries.map(function (d) {
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
  }

  /**
   * Random Dataset - Single Series Scatter Plot
   *
   * @param {number} points - Number of data points.
   * @returns {Array}
   */
  function dataset3() {
    var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    return {
      key: "Bubbles",
      values: d3__namespace.range(points).map(function (d, i) {
        return {
          key: "Point" + i,
          value: randomNum(),
          x: randomNum(),
          y: randomNum(),
          z: randomNum()
        };
      })
    };
  }

  /**
   * Convert Bubble/Particle Dataset Format
   *
   * @param {Array} data
   * @returns {Array}
   */
  function convert(data) {
    return {
      key: data.key,
      values: data.values.map(function (d) {
        return {
          key: d.key,
          values: [{
            key: "size",
            value: d.value
          }, {
            key: "color",
            value: d.value
          }, {
            key: "x",
            value: d.x
          }, {
            key: "y",
            value: d.y
          }, {
            key: "z",
            value: d.z
          }]
        };
      })
    };
  }

  /**
   * Random Dataset - Single Series Scatter Plot (with size and color values)
   *
   * @param {number} points - Number of data points.
   * @returns {Array}
   */
  function dataset6() {
    var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
    return convert(dataset3(points));
  }

  /**
   * Random Dataset - Surface Plot 1
   *
   * @returns {Array}
   */
  function dataset4() {
    return [{
      key: "a",
      values: [{
        key: "1",
        value: 4
      }, {
        key: "2",
        value: 0
      }, {
        key: "3",
        value: 2
      }, {
        key: "4",
        value: 0
      }, {
        key: "5",
        value: 0
      }]
    }, {
      key: "b",
      values: [{
        key: "1",
        value: 4
      }, {
        key: "2",
        value: 0
      }, {
        key: "3",
        value: 2
      }, {
        key: "4",
        value: 0
      }, {
        key: "5",
        value: 0
      }]
    }, {
      key: "c",
      values: [{
        key: "1",
        value: 1
      }, {
        key: "2",
        value: 0
      }, {
        key: "3",
        value: 1
      }, {
        key: "4",
        value: 0
      }, {
        key: "5",
        value: 0
      }]
    }, {
      key: "d",
      values: [{
        key: "1",
        value: 4
      }, {
        key: "2",
        value: 0
      }, {
        key: "3",
        value: 2
      }, {
        key: "4",
        value: 0
      }, {
        key: "5",
        value: 0
      }]
    }, {
      key: "e",
      values: [{
        key: "1",
        value: 1
      }, {
        key: "2",
        value: 1
      }, {
        key: "3",
        value: 1
      }, {
        key: "4",
        value: 1
      }, {
        key: "5",
        value: 1
      }]
    }];
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
    var xRange = d3__namespace.range(0, 1.05, 0.1);
    var zRange = d3__namespace.range(0, 1.05, 0.1);
    var nx = xRange.length;
    var nz = zRange.length;
    return d3__namespace.range(nx).map(function (i) {
      var values = d3__namespace.range(nz).map(function (j) {
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
  }

  var randomData = /*#__PURE__*/Object.freeze({
    __proto__: null,
    convert: convert,
    countries: countries,
    dataset1: dataset1,
    dataset2: dataset2,
    dataset3: dataset3,
    dataset4: dataset4,
    dataset5: dataset5,
    dataset6: dataset6,
    fruit: fruit,
    randomNum: randomNum
  });

  /**
   * d3-x3d
   *
   * @author James Saunders [james@saunders-family.net]
   * @copyright Copyright (C) 2023 James Saunders
   * @license GPLv2
   */

  var author = "James Saunders";
  var year = new Date().getFullYear();
  var copyright = "Copyright (C) ".concat(year, " ").concat(author);
  var version = packageJson.version;
  var license = packageJson.license;
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

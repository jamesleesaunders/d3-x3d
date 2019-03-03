/**
 * d3-x3dom
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2019 James Saunders
 * @license GPLv2
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.d3 = global.d3 || {}, global.d3.x3dom = factory(global.d3));
}(this, (function (d3) { 'use strict';

var version = "1.1.2";
var license = "GPL-2.0";

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

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * Data Transform
 *
 * @module
 * @returns {Array}
 */
function dataTransform(data) {

	var SINGLE_SERIES = 1;
	var MULTI_SERIES = 2;
	var coordinateKeys = ['x', 'y', 'z'];

	/**
  * Data Type
  *
  * @type {Number}
  */
	var dataType = data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;

	/**
  * Row Key
  *
  * @returns {Array}
  */
	var rowKey = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data)[0];
		}
	}();

	/**
  * Row Total
  *
  * @returns {Array}
  */
	var rowTotal = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.sum(data.values, function (d) {
				return d.value;
			});
		}
	}();

	/**
  * Row Keys
  *
  * @returns {Array}
  */
	var rowKeys = function () {
		if (dataType === MULTI_SERIES) {
			return data.map(function (d) {
				return d.key;
			});
		}
	}();

	/**
  * Row Totals
  *
  * @returns {Array}
  */
	var rowTotals = function () {
		if (dataType === MULTI_SERIES) {
			var ret = {};
			d3.map(data).values().forEach(function (d) {
				var rowKey = d.key;
				d.values.forEach(function (d) {
					ret[rowKey] = typeof ret[rowKey] === "undefined" ? 0 : ret[rowKey];
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
	var rowTotalsMax = function () {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(rowTotals));
		}
	}();

	/**
  * Row Value Keys
  *
  * @returns {Array}
  */
	var rowValuesKeys = function () {
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
  * Column Keys
  *
  * @returns {Array}
  */
	var columnKeys = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.values(data.values).map(function (d) {
				return d.key;
			});
		}

		var ret = [];
		d3.map(data).values().forEach(function (d) {
			var tmp = [];
			d.values.forEach(function (d, i) {
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
	var columnTotals = function () {
		if (dataType !== MULTI_SERIES) {
			return;
		}

		var ret = {};
		d3.map(data).values().forEach(function (d) {
			d.values.forEach(function (d) {
				var columnName = d.key;
				ret[columnName] = typeof ret[columnName] === "undefined" ? 0 : ret[columnName];
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
	var columnTotalsMax = function () {
		if (dataType === MULTI_SERIES) {
			return d3.max(d3.values(columnTotals));
		}
	}();

	/**
  * Value Min
  *
  * @returns {number}
  */
	var valueMin = function () {
		if (dataType === SINGLE_SERIES) {
			return d3.min(data.values, function (d) {
				return +d.value;
			});
		}

		var ret = void 0;
		d3.map(data).values().forEach(function (d) {
			d.values.forEach(function (d) {
				ret = typeof ret === "undefined" ? d.value : d3.min([ret, +d.value]);
			});
		});

		return +ret;
	}();

	/**
  * Value Max
  *
  * @returns {number}
  */
	var valueMax = function () {
		var ret = void 0;

		if (dataType === SINGLE_SERIES) {
			ret = d3.max(data.values, function (d) {
				return +d.value;
			});
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = typeof ret !== "undefined" ? d3.max([ret, +d.value]) : +d.value;
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
	var valueExtent = function () {
		return [valueMin, valueMax];
	}();

	/**
  * Coordinates Min
  *
  * @returns {Array}
  */
	var coordinatesMin = function () {
		var ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach(function (key) {
				ret[key] = d3.min(data.values, function (d) {
					return +d[key];
				});
			});
			return ret;
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					coordinateKeys.forEach(function (key) {
						ret[key] = key in ret ? d3.min([ret[key], +d[key]]) : d[key];
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
	var coordinatesMax = function () {
		var ret = {};

		if (dataType === SINGLE_SERIES) {
			coordinateKeys.forEach(function (key) {
				ret[key] = d3.max(data.values, function (d) {
					return +d[key];
				});
			});
			return ret;
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					coordinateKeys.forEach(function (key) {
						ret[key] = key in ret ? d3.max([ret[key], +d[key]]) : d[key];
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
	var coordinatesExtent = function () {
		var ret = {};
		coordinateKeys.forEach(function (key) {
			ret[key] = [coordinatesMin[key], coordinatesMax[key]];
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

	/**
  * Max Decimal Place
  *
  * @returns {number}
  */
	var maxDecimalPlace = function () {
		var ret = 0;
		if (dataType === MULTI_SERIES) {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = d3.max([ret, decimalPlaces(d.value)]);
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
	var thresholds = function () {
		var distance = valueMax - valueMin;
		var bands = [0.15, 0.40, 0.55, 0.90];

		return bands.map(function (v) {
			return Number((valueMin + v * distance).toFixed(maxDecimalPlace));
		});
	}();

	/**
  * Summary
  *
  * @returns {Array}
  */
	var summary = function summary() {
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

	return {
		summary: summary,
		rotate: rotate
	};
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
	var classed = "d3X3domAxis";

	/* Scale and Axis Options */
	var scale = void 0;
	var direction = void 0;
	var tickDirection = void 0;
	var tickArguments = [];
	var tickValues = null;
	var tickFormat = null;
	var tickSize = 1;
	var tickPadding = 1;

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
		selection.classed(classed, true);

		var makeSolid = function makeSolid(selection, color) {
			selection.append("appearance").append("material").attr("diffuseColor", color || "black");

			return selection;
		};

		var range = scale.range();
		var range0 = range[0];
		var range1 = range[range.length - 1];

		var axisDirectionVector = getAxisDirectionVector(direction);
		var tickDirectionVector = getAxisDirectionVector(tickDirection);
		var axisRotationVector = getAxisRotationVector(direction);
		var tickRotationVector = getAxisRotationVector(tickDirection);

		var path = selection.selectAll("transform").data([null]);

		var tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
		tickValues = tickValues === null ? tickValuesDefault : tickValues;

		var tick = selection.selectAll(".tick").data(tickValues, scale).order();

		var tickExit = tick.exit();
		var tickEnter = tick.enter().append("transform").attr("translation", function (t) {
			return axisDirectionVector.map(function (a) {
				return scale(t) * a;
			}).join(" ");
		}).attr("class", "tick");

		var line = tick.select(".tickLine");
		path = path.merge(path.enter().append("transform").attr("rotation", axisRotationVector.join(" ")).attr("translation", axisDirectionVector.map(function (d) {
			return d * (range0 + range1) / 2;
		}).join(" ")).append("shape").call(makeSolid, color).attr("class", "domain"));
		tick = tick.merge(tickEnter);
		line = line.merge(tickEnter.append("transform"));

		var tickFormatDefault = scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : function (d) {
			return d;
		};
		tickFormat = tickFormat === null ? tickFormatDefault : tickFormat;

		if (tickFormat !== "") {
			var text = tick.select("billboard");
			var newText = tickEnter.append("transform");
			newText.attr("translation", tickDirectionVector.map(function (d) {
				return -d * tickPadding;
			})).append("billboard").attr("axisofrotation", "0 0 0").append("shape").call(makeSolid, "black").append("text").attr("string", tickFormat).append("fontstyle").attr("size", 1.3).attr("family", "SANS").attr("style", "BOLD").attr("justify", "MIDDLE");
			text = text.merge(newText);
		}

		tickExit.remove();
		path.append("cylinder").attr("radius", 0.1).attr("height", range1 - range0);

		line.attr("translation", tickDirectionVector.map(function (d) {
			return d * tickSize / 2;
		}).join(" ")).attr("rotation", tickRotationVector.join(" ")).attr("class", "tickLine").append("shape").call(makeSolid, "#d3d3d3").append("cylinder").attr("radius", 0.05).attr("height", tickSize);
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
	var classed = "d3X3domAxisThreePlane";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias axisThreePlane
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		var layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];

		selection.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		// Construct Axis Components
		var xzAxis = componentAxis().scale(xScale).direction("x").tickDirection("z").tickSize(zScale.range()[1] - zScale.range()[0]).tickPadding(xScale.range()[0]).color("blue");

		var yzAxis = componentAxis().scale(yScale).direction("y").tickDirection("z").tickSize(zScale.range()[1] - zScale.range()[0]).color("red");

		var yxAxis = componentAxis().scale(yScale).direction("y").tickDirection("x").tickSize(xScale.range()[1] - xScale.range()[0]).tickFormat("").color("red");

		var zxAxis = componentAxis().scale(zScale).direction("z").tickDirection("x").tickSize(xScale.range()[1] - xScale.range()[0]).color("black");

		selection.select(".xzAxis").call(xzAxis);

		selection.select(".yzAxis").call(yzAxis);

		selection.select(".yxAxis").call(yxAxis);

		selection.select(".zxAxis").call(zxAxis);
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
 * Reusable 3D Bar Chart Component
 *
 * @module
 */
function componentBars () {

	/* Default Properties */
	var dimensions = { x: 40, y: 40, z: 2 };
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "d3X3domBars";

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
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var bars = selection.selectAll(".bar").data(function (d) {
				return d.values;
			});

			var barsEnter = bars.enter().append("transform").classed("bar", true).attr("scale", function (d) {
				var x = xScale.bandwidth();
				var y = yScale(d.value);
				var z = dimensions.z;
				return x + " " + y + " " + z;
			}).attr("translation", function (d) {
				var x = xScale(d.key);
				var y = yScale(d.value) / 2;
				var z = 0.0;
				return x + " " + y + " " + z;
			}).append("shape");

			barsEnter.append("box").attr("size", "1.0 1.0 1.0");

			barsEnter.append("appearance").append("material").attr("diffusecolor", function (d) {
				return colorScale(d.key);
			}).attr("ambientintensity", "0.1");

			barsEnter.merge(bars);

			bars.transition().attr("scale", function (d) {
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
	var classed = "d3X3domBarsMultiSeries";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

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
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.7);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
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
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			// Construct Bars Component
			var bars = componentBars().xScale(xScale).yScale(yScale).dimensions({
				x: dimensions.x,
				y: dimensions.y,
				z: zScale.bandwidth()
			}).colors(colors);

			// Create Bar Groups
			var barGroup = selection.selectAll(".barGroup").data(data);

			barGroup.enter().append("transform").classed("barGroup", true).attr("translation", function (d) {
				var x = 0;
				var y = 0;
				var z = zScale(d.key);
				return x + " " + y + " " + z;
			}).merge(barGroup).transition().each(function () {
				d3.select(this).call(bars);
			});

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
 * Custom Dispatch Events
 *
 * @type {d3.dispatch}
 */
var dispatch = d3.dispatch("d3X3domClick", "d3X3domMouseOver", "d3X3domMouseOut");

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

var events = Object.freeze({
	dispatch: dispatch,
	forwardEvent: forwardEvent,
	getEventCoordinates: getEventCoordinates,
	getEventPagePoint: getEventPagePoint,
	getX3domHolder: getX3domHolder
});

/**
 * Reusable 3D Bubble Chart Component
 *
 * @module
 */
function componentBubbles () {

	/* Default Properties */
	var dimensions = { x: 40, y: 40, z: 40 };
	var color = "orange";
	var classed = "d3X3domBubbles";

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
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var makeSolid = function makeSolid(selection, color) {
				selection.append("appearance").append("material").attr("diffusecolor", color || "black");
				return selection;
			};

			var bubbles = selection.selectAll(".bubble").data(function (d) {
				return d.values;
			});

			var bubblesEnter = bubbles.enter().append("group").attr("class", "bubble");

			bubblesEnter.append("transform").attr("translation", function (d) {
				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
			}).append("shape").attr("onclick", "d3.x3dom.events.forwardEvent(event);").on("click", function (e) {
				dispatch.call("d3X3domClick", this, e);
			}).attr("onmouseover", "d3.x3dom.events.forwardEvent(event);").on("mouseover", function (e) {
				dispatch.call("d3X3domMouseOver", this, e);
			}).attr("onmouseout", "d3.x3dom.events.forwardEvent(event);").on("mouseout", function (e) {
				dispatch.call("d3X3domMouseOut", this, e);
			}).call(makeSolid, color).append("sphere").attr("radius", function (d) {
				return sizeScale(d.value);
			});

			bubblesEnter.merge(bubbles);

			bubbles.transition().attr("translation", function (d) {
				return xScale(d.x) + ' ' + yScale(d.y) + ' ' + zScale(d.z);
			});

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
	var classed = "d3X3domBubblesMultiSeries";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;
	var sizeScale = void 0;
	var sizeDomain = [0.5, 3.0];

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


		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(valueExtent).range(sizeDomain);
		}
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias bubblesMultiSeries
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			// Construct Bars Component
			var bubbles = componentBubbles().xScale(xScale).yScale(yScale).zScale(zScale).sizeScale(sizeScale);

			// Create Bar Groups
			var bubbleGroup = selection.selectAll(".bubbleGroup").data(data);

			bubbleGroup.enter().append("group").classed("bubbleGroup", true).merge(bubbleGroup).transition().each(function (d) {
				var color = colorScale(d.key);
				bubbles.color(color);
				d3.select(this).call(bubbles);
			});

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
	var classed = "d3X3domCrosshair";
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
		selection.classed(classed, true);

		selection.each(function (data) {

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
			var ballSelect = selection.selectAll(".ball").data([data]);

			var ball = ballSelect.enter().append("transform").attr("translation", function (d) {
				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
			}).classed("ball", true).append("shape");

			ball.append("appearance").append("material").attr("diffusecolor", "blue");

			ball.append("sphere").attr("radius", 0.3);

			ball.merge(ballSelect);

			ballSelect.transition().ease(d3.easeQuadOut).attr("translation", function (d) {
				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
			});

			// Crosshair Lines
			var lineSelect = selection.selectAll(".line").data(Object.keys(dimensions));

			var line = lineSelect.enter().append("transform").classed("line", true).attr("translation", function (d) {
				return getPositionVector(d);
			}).attr("rotation", function (d) {
				return getRotationVector(d);
			}).append("shape");

			line.append("cylinder").attr("radius", radius).attr("height", function (d) {
				return dimensions[d];
			});

			line.append("appearance").append("material").attr("diffusecolor", function (d) {
				return colorScale(d);
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
	var classed = "d3X3domLabel";
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
		selection.classed(classed, true);

		selection.each(function (data) {

			var makeSolid = function makeSolid(selection, color) {
				selection.append("appearance").append("material").attr("diffusecolor", color || "black");
				return selection;
			};

			var labelSelect = selection.selectAll(".label").data([data]);

			var label = labelSelect.enter().append("transform").attr("translation", function (d) {
				return xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z);
			}).classed("label", true).append("billboard").attr("axisofrotation", "0 0 0").append("transform").attr("translation", function (d) {
				return offset + " " + offset + " " + offset;
			}).append("shape").call(makeSolid, color).append("text").attr("string", function (d) {
				return d.key;
			}).append("fontstyle").attr("size", 1).attr("family", "SANS").attr("style", "BOLD").attr("justify", "START");

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
 * Reusable 3D Ribbon Chart Component
 *
 * @module
 */
function componentRibbon () {

	/* Default Properties */
	var dimensions = { x: 40, y: 40, z: 5 };
	var color = "red";
	var classed = "d3X3domRibbon";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;

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
  * Array to Coordinate Index
  *
  * @private
  * @param {array} arr
  * @returns {string}
  */
	var arrayToCoordIndex = function arrayToCoordIndex(arr) {
		return arr.map(function (d, i) {
			return i;
		}).join(" ").concat(" -1");
	};

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
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var ribbonData = function ribbonData(d) {
				return d.values.map(function (pointThis, indexThis, array) {
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

					var points = [[x1, y1, z1], [x1, y1, z2], [x2, y2, z2], [x2, y2, z1], [x1, y1, z1]];

					return {
						key: pointThis.key,
						value: pointThis.value,
						coordindex: arrayToCoordIndex(points),
						point: array2dToString(points),
						color: color,
						transparency: 0.2
					};
				}).filter(function (d) {
					return d !== null;
				});
			};

			var ribbon = selection.selectAll(".ribbon").data(ribbonData);

			var ribbonEnter = ribbon.enter().append("shape").classed("ribbon", true);

			ribbonEnter.append("indexedfaceset").attr("coordindex", function (d) {
				return d.coordindex;
			}).attr("solid", true).append("coordinate").attr("point", function (d) {
				return d.point;
			});

			ribbonEnter.append("appearance").append("twosidedmaterial").attr("diffusecolor", function (d) {
				return d.color;
			}).attr("transparency", function (d) {
				return d.transparency;
			});

			ribbonEnter.merge(ribbon);

			ribbon.transition().select("indexedfaceset").attr("coordindex", function (d) {
				return d.coordindex;
			}).select("coordinate").attr("point", function (d) {
				return d.point;
			});

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
	var classed = "d3X3domRibbonMultiSeries";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

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
			xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias ribbonMultiSeries
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			// Construct Ribbon Component
			var ribbon = componentRibbon().xScale(xScale).yScale(yScale).dimensions({
				x: dimensions.x,
				y: dimensions.y,
				z: zScale.bandwidth()
			});

			// Create Bar Groups
			var ribbonGroup = selection.selectAll(".ribbonGroup").data(data);

			ribbonGroup.enter().append("transform").classed("ribbonGroup", true).attr("translation", function (d) {
				var x = 0;
				var y = 0;
				var z = zScale(d.key);
				return x + " " + y + " " + z;
			}).append("group").merge(ribbonGroup).transition().each(function (d) {
				var color = colorScale(d.key);
				ribbon.color(color);
				d3.select(this).call(ribbon);
			});

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
	var colors = ["blue", "red"];
	var classed = "d3X3domSurface";

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
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var surfaceData = function surfaceData(d) {

				var coordPoints = function coordPoints(data) {
					return data.map(function (X) {
						return X.values.map(function (d) {
							return [xScale(X.key), yScale(d.value), zScale(d.key)];
						});
					});
				};

				var coordIndex = function coordIndex(data) {
					var ny = data.length;
					var nx = data[0].values.length;

					var coordIndexFront = Array.apply(0, Array(ny - 1)).map(function (_, j) {
						return Array.apply(0, Array(nx - 1)).map(function (_, i) {
							var start = i + j * nx;
							return [start, start + nx, start + nx + 1, start + 1, start, -1];
						});
					});

					var coordIndexBack = Array.apply(0, Array(ny - 1)).map(function (_, j) {
						return Array.apply(0, Array(nx - 1)).map(function (_, i) {
							var start = i + j * nx;
							return [start, start + 1, start + nx + 1, start + nx, start, -1];
						});
					});

					return coordIndexFront.concat(coordIndexBack);
				};

				var colorFaceSet = function colorFaceSet(data) {
					return data.map(function (X) {
						return X.values.map(function (d) {
							var col = d3.color(colorScale(d.value));
							return '' + Math.round(col.r / 2.55) / 100 + ' ' + Math.round(col.g / 2.55) / 100 + ' ' + Math.round(col.b / 2.55) / 100;
						});
					});
				};

				return [{
					coordindex: array2dToString(coordIndex(d)),
					point: array2dToString(coordPoints(d)),
					color: array2dToString(colorFaceSet(d))
				}];
			};

			var surface = selection.selectAll(".surface").data(surfaceData);

			var surfaceSelect = surface.enter().append("shape").classed("surface", true).append("indexedfaceset").attr("coordindex", function (d) {
				return d.coordindex;
			});

			surfaceSelect.append("coordinate").attr("point", function (d) {
				return d.point;
			});

			surfaceSelect.append("color").attr("color", function (d) {
				return d.color;
			});

			surfaceSelect.merge(surface);

			var surfaceTransition = surface.transition().select("indexedfaceset").attr("coordindex", function (d) {
				return d.coordindex;
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

/**
 * Reusable 3D Vector Fields Component
 *
 * @module
 */
function componentVectorFields () {

	/* Default Properties */
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = d3.interpolateRdYlGn;
	var classed = "d3X3domVectorFields";

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
  * @param x
  * @param y
  * @param z
  * @returns {{x: number, y: number, z: number}}
  */
	var vectorFunction = function vectorFunction(x, y, z) {
		return {
			x: x,
			y: y,
			z: z
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
				var _vectorFunction = vectorFunction(f.x, f.y, f.z);

				vx = _vectorFunction.x;
				vy = _vectorFunction.y;
				vz = _vectorFunction.z;
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
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

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
						var _vectorFunction2 = vectorFunction(f.x, f.y, f.z);

						vx = _vectorFunction2.x;
						vy = _vectorFunction2.y;
						vz = _vectorFunction2.z;
					}

					var fromVector = new x3dom.fields.SFVec3f(0, 1, 0);
					var toVector = new x3dom.fields.SFVec3f(vx, vy, vz);
					var qDir = x3dom.fields.Quaternion.rotateFromTo(fromVector, toVector);
					var rot = qDir.toAxisAngle();

					if (!toVector.length()) {
						// If there is no vector length return null (and filter them out after)
						return null;
					}

					// Calculate transform-translation attr
					f.translation = xScale(f.x) + " " + yScale(f.y) + " " + zScale(f.z);

					// Calculate vector length
					f.value = toVector.length();

					// Calculate transform-rotation attr
					f.rotation = rot[0].x + " " + rot[0].y + " " + rot[0].z + " " + rot[1];

					return f;
				}).filter(function (f) {
					return f !== null;
				});
			};

			var arrows = selection.selectAll(".arrow").data(vectorData);

			var arrowsEnter = arrows.enter().append("transform").attr("translation", function (d) {
				return d.translation;
			}).attr("rotation", function (d) {
				return d.rotation;
			}).attr("class", "arrow").append("transform").attr("translation", function (d) {
				var offset = sizeScale(d.value) / 2;
				return "0 " + offset + " 0";
			}).append("group").attr("onclick", "d3.x3dom.events.forwardEvent(event);").attr("onmouseover", "d3.x3dom.events.forwardEvent(event);").attr("onmouseout", "d3.x3dom.events.forwardEvent(event);");

			var arrowHead = arrowsEnter.append("shape").on("click", function (e) {
				dispatch.call("d3X3domClick", this, e);
			}).on("mouseover", function (e) {
				dispatch.call("d3X3domMouseOver", this, e);
			}).on("mouseout", function (e) {
				dispatch.call("d3X3domMouseOut", this, e);
			});

			arrowHead.append("appearance").append("material").attr("diffusecolor", function (d) {
				return rgb2Hex(colorScale(d.value));
			});

			arrowHead.append("cylinder").attr("height", function (d) {
				return sizeScale(d.value);
			}).attr("radius", 0.1);

			var arrowShaft = arrowsEnter.append("transform").attr("translation", function (d) {
				var offset = sizeScale(d.value) / 2;
				return "0 " + offset + " 0";
			}).append("shape").on("click", function (e) {
				dispatch.call("d3X3domClick", this, e);
			}).on("mouseover", function (e) {
				dispatch.call("d3X3domMouseOver", this, e);
			}).on("mouseout", function (e) {
				dispatch.call("d3X3domMouseOut", this, e);
			});

			arrowShaft.append("appearance").append("material").attr("diffusecolor", function (d) {
				return rgb2Hex(colorScale(d.value));
			});

			arrowShaft.append("cone").attr("height", 1).attr("bottomradius", 0.4);

			arrowsEnter.merge(arrows);

			arrows.transition().attr("translation", function (d) {
				return d.translation;
			});

			arrows.exit().remove();
		});
	};

	/**
  * RGB Colour to Hex Converter
  *
  * @param {string} rgbStr - RGB colour string (e.g. 'rgb(155, 102, 102)').
  * @returns {string} - Hex Color (e.g. '#9b6666').
  */
	function rgb2Hex(rgbStr) {
		var _rgbStr$substring$rep = rgbStr.substring(4, rgbStr.length - 1).replace(/ /g, '').split(','),
		    _rgbStr$substring$rep2 = slicedToArray(_rgbStr$substring$rep, 3),
		    red = _rgbStr$substring$rep2[0],
		    green = _rgbStr$substring$rep2[1],
		    blue = _rgbStr$substring$rep2[2];

		var rgb = blue | green << 8 | red << 16; // eslint-disable-line no-bitwise
		return '#' + (0x1000000 + rgb).toString(16).slice(1);
	}

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
 * Reusable X3DOM Viewpoint Component
 *
 * @module
 */
function componentViewpoint () {

	/* Default Properties */
	var centerOfRotation = [0.0, 0.0, 0.0];
	var viewPosition = [80.0, 15.0, 80.0];
	var viewOrientation = [0.0, 1.0, 0.0, 0.8];
	var fieldOfView = 0.8;
	var classed = "d3X3domViewpoint";

	/**
  * Constructor
  *
  * @constructor
  * @alias viewpoint
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		selection.append("viewpoint").classed(classed, true).attr("centerofrotation", centerOfRotation.join(" ")).attr("position", viewPosition.join(" ")).attr("orientation", viewOrientation.join(" ")).attr("fieldofview", fieldOfView).attr("set_bind", "true");
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
	var classed = "d3X3domVolume";

	var imageUrl = "assets/scan1.png";
	var numberOfSlices = 96;
	var slicesOverX = 10;
	var slicesOverY = 10;

	/**
  * Constructor
  *
  * @constructor
  * @alias bars
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		selection.classed(classed, true);
		var _dimensions = dimensions,
		    dimensionX = _dimensions.x,
		    dimensionY = _dimensions.y,
		    dimensionZ = _dimensions.z;

		var html = "\n\t\t\t\t<transform>\n\t\t\t\t<volumedata id='volume' dimensions='" + dimensionX + " " + dimensionY + " " + dimensionZ + "'>\n\t\t\t\t<imagetextureatlas crossOrigin='anonymous' containerField='voxels' url='" + imageUrl + "' numberOfSlices='" + numberOfSlices + "' slicesOverX='" + slicesOverX + "' slicesOverY='" + slicesOverY + "'></imagetextureatlas>\n\t\t\t\t<opacitymapvolumestyle lightFactor='1.2' opacityFactor='6.0'>\n\t\t\t\t\t<imagetexture crossOrigin='anonymous' containerField='transferFunction' url='assets/transfer.png'></imagetexture>\n\t\t\t\t</opacitymapvolumestyle>\n\t\t\t\t</volumedata>\n\t\t\t\t</transform>\n\t\t\t";

		selection.append("group").html(html);
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

	return my;
}

var component = {
	axis: componentAxis,
	axisThreePlane: componentAxisThreePlane,
	bars: componentBars,
	barsMultiSeries: componentBarsMultiSeries,
	bubbles: componentBubbles,
	bubblesMultiSeries: componentBubblesMultiSeries,
	crosshair: componentCrosshair,
	label: componentLabel,
	ribbon: componentRibbon,
	ribbonMultiSeries: componentRibbonMultiSeries,
	surface: componentSurface,
	vectorFields: componentVectorFields,
	viewpoint: componentViewpoint,
	volumeSlice: componentVolumeSlice
};

/**
 * Reusable 3D Multi Series Bar Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 * let myData = [...];
 * let myChart = d3.x3dom.chart.barChartMultiSeries();
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 */
function chartBarChartMultiSeries () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "d3X3domBarChartMultiSeries";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

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
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.7);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartMultiSeries
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "bars"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bars Component
			var bars = component.barsMultiSeries().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			scene.call(viewpoint);

			scene.select(".axis").call(axis);

			scene.select(".bars").datum(function (d) {
				return d;
			}).call(bars);

			scene.append("directionallight").attr("direction", "1 0 -1").attr("on", "true").attr("intensity", "0.4").attr("shadowintensity", "0");
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

/**
 * Reusable 3D Vertical Bar Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 * let myData = [...];
 * let myChart = d3.x3dom.chart.barChartVertical();
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 */
function chartBarChartVertical () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "d3X3domBarChartVertical";
	var debug = false;

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
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensionX]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartVertical
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["xAxis", "yAxis", "bars"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().quickView("left");

			// Construct Axis Components
			var xAxis = component.axis().scale(xScale).direction('x').tickDirection('y');

			var yAxis = component.axis().scale(yScale).direction('y').tickDirection('x').tickSize(yScale.range()[1] - yScale.range()[0]);

			// Construct Bars Component
			var bars = component.bars().xScale(xScale).yScale(yScale).colors(colors);

			scene.call(viewpoint);

			scene.select(".xAxis").call(xAxis);

			scene.select(".yAxis").call(yAxis);

			scene.select(".bars").datum(function (d) {
				return d;
			}).call(bars);
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
 * let myData = [...];
 * let myChart = d3.x3dom.chart.bubbleChart();
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/bubble-chart/
 */
function chartBubbleChart () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "d3X3domBubbleChart";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;
	var sizeScale = void 0;
	var sizeDomain = [0.5, 3.5];

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


		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(valueExtent).range(sizeDomain);
		}
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias bubbleChart
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "bubbles"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bubbles Component
			var bubbles = component.bubblesMultiSeries().xScale(xScale).yScale(yScale).zScale(zScale).sizeScale(sizeScale).colorScale(colorScale);

			scene.call(viewpoint);

			scene.select(".axis").call(axis);

			scene.select(".bubbles").datum(function (d) {
				return d;
			}).call(bubbles);

			scene.append("directionallight").attr("direction", "1 0 -1").attr("on", "true").attr("intensity", "0.4").attr("shadowintensity", "0");
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
 * let myData = [...];
 * let myChart = d3.x3dom.chart.crosshairPlot();
 * chartHolder.datum(myData).call(myChart);
 */
function chartCrosshairPlot () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var classed = "d3X3domCrosshairPlot";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;

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


		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
		}
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias crosshairPlot
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "crosshairs"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Crosshair Component
			var crosshair = component.crosshair().xScale(xScale).yScale(yScale).zScale(zScale);

			scene.call(viewpoint);

			scene.select(".axis").call(axis);

			scene.select(".crosshairs").selectAll(".crosshair").data(function (d) {
				return d.values;
			}).enter().append("group").classed("crosshair", true).each(function () {
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
 * let myData = [...];
 * let myChart = d3.x3dom.chart.ribbonChartMultiSeries();
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/waterfall-plot/
 */
function chartRibbonChartMultiSeries () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 60, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "d3X3domRibbonChartMultiSeries";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

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
			xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	};

	/**
  * Constructor
  *
  * @constructor
  * @alias ribbonChartMultiSeries
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "ribbons"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]).viewOrientation([-0.61021, 0.77568, 0.16115, 0.65629]).viewPosition([77.63865, 54.69470, 104.38314]);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bars Component
			var ribbons = component.ribbonMultiSeries().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			scene.call(viewpoint);

			scene.select(".axis").call(axis);

			scene.select(".ribbons").datum(function (d) {
				return d;
			}).call(ribbons);

			scene.append("directionallight").attr("direction", "1 0 -1").attr("on", "true").attr("intensity", "0.4").attr("shadowintensity", "0");
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

/**
 * Reusable 3D Scatter Plot Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 * let myData = [...];
 * let myChart = d3.x3dom.chart.scatterPlot();
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 */
function chartScatterPlot () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var color = "orange";
	var classed = "d3X3domScatterPlot";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;

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


		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensionZ]);
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
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "bubbles", "crosshair", "label"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Crosshair Component
			var crosshair = component.crosshair().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Label Component
			var label = component.label().xScale(xScale).yScale(yScale).zScale(zScale).offset(0.5);

			// Construct Bubbles Component
			var bubbles = component.bubbles().xScale(xScale).yScale(yScale).zScale(zScale).color(color).sizeDomain([0.5, 0.5]).on("d3X3domClick", function (e) {
				var d = d3.select(e.target).datum();
				scene.select(".crosshair").datum(d).classed("crosshair", true).each(function () {
					d3.select(this).call(crosshair);
				});
			}).on("d3X3domMouseOver", function (e) {
				var d = d3.select(e.target).datum();
				scene.select(".label").datum(d).each(function () {
					d3.select(this).call(label);
				});
			}).on("d3X3domMouseOut", function (e) {
				scene.select(".label").selectAll("*").remove();
			});

			scene.call(viewpoint);

			scene.select(".axis").call(axis);

			scene.select(".bubbles").datum(function (d) {
				return d;
			}).call(bubbles);
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
 * let myData = [...];
 * let myChart = d3.x3dom.chart.surfacePlot();
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/three-dimensional-stream-graph/
 */
function chartSurfacePlot () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["blue", "red"];
	var classed = "d3X3domSurfacePlot";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

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
			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();
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
  * @alias surfacePlot
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	var my = function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "surface"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Surface Component
			var surface = component.surface().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			scene.call(viewpoint);

			scene.select(".axis").call(axis);

			scene.select(".surface").datum(function (d) {
				return d;
			}).call(surface);
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

/**
 * Reusable 3D Vector Field Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 * let myData = [...];
 * let myChart = d3.x3dom.chart.vectorFieldChart();
 * myChart.vectorFunction((x, y, z) => ({ x: -x, y: -y, z: -z }));
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://mathinsight.org/vector_field_overview
 */
function chartVectorField () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = d3.interpolateRdYlGn;
	var classed = "d3X3domVectorFieldChart";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;
	var sizeScale = void 0;
	var sizeDomain = [2.0, 5.0];
	var origin = { x: 0, y: 0, z: 0 };

	/**
  * Vector Field Function
  *
  * @param x
  * @param y
  * @param z
  * @returns {{x: number, y: number, z: number}}
  */
	var vectorFunction = function vectorFunction(x, y, z) {
		return {
			x: x,
			y: y,
			z: z
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
				var _vectorFunction = vectorFunction(f.x, f.y, f.z);

				vx = _vectorFunction.x;
				vy = _vectorFunction.y;
				vz = _vectorFunction.z;
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
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "vectorFields"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		scene.each(function (data) {
			init(data);

			// Construct Viewpoint Component
			var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			var axis = component.crosshair().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Vector Field Component
			var vectorFields = component.vectorFields().xScale(xScale).yScale(yScale).zScale(zScale).colorScale(colorScale).sizeScale(sizeScale).vectorFunction(vectorFunction);

			scene.call(viewpoint);

			scene.select(".axis").datum(origin).call(axis);

			scene.select(".vectorFields").datum(function (d) {
				return d;
			}).call(vectorFields);
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

	return my;
}

var chart = {
	barChartMultiSeries: chartBarChartMultiSeries,
	barChartVertical: chartBarChartVertical,
	bubbleChart: chartBubbleChart,
	crosshairPlot: chartCrosshairPlot,
	ribbonChartMultiSeries: chartRibbonChartMultiSeries,
	scatterPlot: chartScatterPlot,
	surfacePlot: chartSurfacePlot,
	vectorFieldChart: chartVectorField
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

var randomData = Object.freeze({
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
 * d3-x3dom
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2019 James Saunders
 * @license GPLv2
 */

var author$1 = "James Saunders";
var year = new Date().getFullYear();
var copyright = "Copyright (C) " + year + " " + author$1;

var index = {
	version: version,
	author: author$1,
	copyright: copyright,
	license: license,
	chart: chart,
	component: component,
	dataTransform: dataTransform,
	randomData: randomData,
	events: events
};

return index;

})));

/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv3
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.d3 = global.d3 || {}, global.d3.x3d = factory(global.d3));
}(this, (function (d3) { 'use strict';

var version = "1.0.5";
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

/**
 * Data Analysis
 *
 */
function dataTransform (data) {

	var SINGLE_SERIES = 1;
	var MULTI_SERIES = 2;

	/**
  * Row or Rows?
  */
	var dataStructure = function () {
		if (data["key"] !== undefined) {
			return SINGLE_SERIES;
		} else {
			return MULTI_SERIES;
		}
	}();

	/**
  * Row Key
  */
	var rowKey = function () {
		var ret = void 0;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.values(data)[0];
		}

		return ret;
	}();

	/**
  * Row Keys
  */
	var rowKeys = function () {
		var ret = void 0;
		if (MULTI_SERIES === dataStructure) {
			ret = data.map(function (d) {
				return d.key;
			});
		}

		return ret;
	}();

	/**
  * Row Totals
  */
	var rowTotals = function () {
		var ret = void 0;
		if (MULTI_SERIES === dataStructure) {
			ret = {};
			d3.map(data).values().forEach(function (d) {
				var rowKey = d.key;
				d.values.forEach(function (d) {
					ret[rowKey] = typeof ret[rowKey] === "undefined" ? 0 : ret[rowKey];
					ret[rowKey] += d.value;
				});
			});
		}

		return ret;
	}();

	/**
  * Row Totals Max
  */
	var rowTotalsMax = function () {
		var ret = void 0;
		if (MULTI_SERIES === dataStructure) {
			ret = d3.max(d3.values(rowTotals));
		}

		return ret;
	}();

	/**
  * Join two arrays
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
  */
	var columnKeys = function () {
		var ret = [];
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.values(data.values).map(function (d) {
				return d.key;
			});
		} else {
			d3.map(data).values().forEach(function (d) {
				var tmp = [];
				d.values.forEach(function (d, i) {
					tmp[i] = d.key;
				});

				ret = union(tmp, ret);
			});
		}

		return ret;
	}();

	/**
  * Row Totals
  */
	var rowTotal = function () {
		var ret = void 0;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.sum(data.values, function (d) {
				return d.value;
			});
		}

		return ret;
	}();

	/**
  * Column Totals
  */
	var columnTotals = function () {
		var ret = void 0;
		if (MULTI_SERIES === dataStructure) {
			ret = {};
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					var columnName = d.key;
					ret[columnName] = typeof ret[columnName] === "undefined" ? 0 : ret[columnName];
					ret[columnName] += d.value;
				});
			});
		}

		return ret;
	}();

	/**
  * Column Totals Max
  */
	var columnTotalsMax = function () {
		var ret = void 0;
		if (MULTI_SERIES === dataStructure) {
			ret = d3.max(d3.values(columnTotals));
		}

		return ret;
	}();

	/**
  * Min Value
  */
	var minValue = function () {
		var ret = void 0;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.min(data.values, function (d) {
				return +d.value;
			});
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = typeof ret === "undefined" ? d.value : d3.min([ret, +d.value]);
				});
			});
		}

		return +ret;
	}();

	/**
  * Max Value
  */
	var maxValue = function () {
		var ret = void 0;
		if (SINGLE_SERIES === dataStructure) {
			ret = d3.max(data.values, function (d) {
				return +d.value;
			});
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = typeof ret === "undefined" ? d.value : d3.max([ret, +d.value]);
				});
			});
		}

		return +ret;
	}();

	/**
  * Max Coordinates
  */
	var maxCoordinates = function () {
		var maxX = void 0,
		    maxY = void 0,
		    maxZ = void 0;

		if (SINGLE_SERIES === dataStructure) {
			maxX = d3.max(data.values, function (d) {
				return +d.x;
			});
			maxY = d3.max(data.values, function (d) {
				return +d.y;
			});
			maxZ = d3.max(data.values, function (d) {
				return +d.z;
			});
		} else {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					maxX = typeof maxX === "undefined" ? d.x : d3.max([maxX, +d.x]);
					maxY = typeof maxY === "undefined" ? d.y : d3.max([maxY, +d.y]);
					maxZ = typeof maxZ === "undefined" ? d.z : d3.max([maxZ, +d.z]);
				});
			});
		}

		return { x: maxX, y: maxY, z: maxZ };
	}();

	/**
  * How many decimal places?
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
  * Max decimal place
  */
	var maxDecimalPlace = function () {
		var ret = 0;
		if (MULTI_SERIES === dataStructure) {
			d3.map(data).values().forEach(function (d) {
				d.values.forEach(function (d) {
					ret = d3.max([ret, decimalPlaces(d.value)]);
				});
			});
		}

		return ret;
	}();

	// If thresholds values are not already set attempt to auto-calculate some thresholds
	var thresholds = function () {
		var distance = maxValue - minValue;

		return [+(minValue + 0.15 * distance).toFixed(maxDecimalPlace), +(minValue + 0.40 * distance).toFixed(maxDecimalPlace), +(minValue + 0.55 * distance).toFixed(maxDecimalPlace), +(minValue + 0.90 * distance).toFixed(maxDecimalPlace)];
	}();

	/**
  * Rotate Data
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
  * Summary
  */
	var summary = function summary() {
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
		};
	};

	return {
		summary: summary,
		rotate: rotate
	};
}

/**
 * Reusable 3D Axis
 *
 * @module
 */
function componentAxis () {

	/**
  * Default Properties
  */
	var dimensions = { x: 40, y: 40, z: 40 };
	var color = "black";
	var classed = "x3dAxis";

	/**
  * Scale and Axis Options
  */
	var scale = void 0;
	var dir = void 0;
	var tickDir = void 0;
	var tickArguments = [];
	var tickValues = null;
	var tickFormat = null;
	var tickSize = 1;
	var tickPadding = 1;

	/**
  * Get Axis Direction Vector
  *
  * @param {string} axisDir
  * @returns {[{number}, {number}, {number}]}
  */
	function getAxisDirectionVector(axisDir) {
		var result = void 0;
		switch (axisDir) {
			case "x":
				{
					result = [1, 0, 0];
					break;
				}
			case "y":
				{
					result = [0, 1, 0];
					break;
				}
			case "z":
				{
					result = [0, 0, 1];
					break;
				}
		}

		return result;
	}

	/**
  * Get Axis Rotation Vector
  *
  * @param {string} axisDir
  *  @returns {[{number}, {number}, {number}, {number}]}
  */
	function getAxisRotationVector(axisDir) {
		var result = void 0;
		switch (axisDir) {
			case "x":
				{
					result = [1, 1, 0, Math.PI];
					break;
				}
			case "y":
				{
					result = [0, 0, 0, 0];
					break;
				}
			case "z":
				{
					result = [0, 1, 1, Math.PI];
					break;
				}
		}

		return result;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
		selection.classed(classed, true);

		var identity = function identity(x) {
			return x;
		};

		var makeSolid = function makeSolid(selection, color) {
			selection.append("appearance").append("material").attr("diffuseColor", color || "black");

			return selection;
		};

		var values = tickValues === null ? scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain() : tickValues;
		var format = tickFormat === null ? scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity : tickFormat;
		var range = scale.range();
		var range0 = range[0];
		var range1 = range[range.length - 1];

		var dirVec = getAxisDirectionVector(dir);
		var tickDirVec = getAxisDirectionVector(tickDir);
		var rotVec = getAxisRotationVector(dir);
		var tickRotVec = getAxisRotationVector(tickDir);

		var path = selection.selectAll("transform").data([null]);

		var tick = selection.selectAll(".tick").data(values, scale).order();

		var tickExit = tick.exit();
		var tickEnter = tick.enter().append("transform").attr("translation", function (t) {
			return dirVec.map(function (a) {
				return scale(t) * a;
			}).join(" ");
		}).attr("class", "tick");

		var line = tick.select(".tickLine");
		var text = tick.select("billboard");

		path = path.merge(path.enter().append("transform").attr("rotation", rotVec.join(" ")).attr("translation", dirVec.map(function (d) {
			return d * (range0 + range1) / 2;
		}).join(" ")).append("shape").call(makeSolid, color).attr("class", "domain"));
		tick = tick.merge(tickEnter);
		line = line.merge(tickEnter.append("transform"));
		var newText = tickEnter.append("transform");

		newText.attr("translation", tickDirVec.map(function (d) {
			return -d * tickPadding;
		})).append("billboard").attr("axisOfRotation", "0 0 0").append("shape").call(makeSolid, "black").append("text").attr("string", format).append("fontstyle").attr("size", 1).attr("family", "SANS").attr("style", "BOLD").attr("justify", "MIDDLE ");
		text = text.merge(newText);

		tickExit.remove();
		path.append("cylinder").attr("radius", 0.1).attr("height", range1 - range0);

		line.attr("translation", tickDirVec.map(function (d) {
			return d * tickSize / 2;
		}).join(" ")).attr("rotation", tickRotVec.join(" ")).attr("class", "tickLine").append("shape").call(makeSolid).append("cylinder").attr("radius", 0.05).attr("height", tickSize);
	}

	/**
  * Slice
  *
  * @type {(start?: number, end?: number) => T[]}
  */
	var slice = Array.prototype.slice;

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.scale = function (_) {
		if (!arguments.length) return scale;
		scale = _;
		return my;
	};

	/**
  * Color Getter / Setter
  *
  * @param {string} _ - Color 'red' or '#ff0000'.
  * @returns {*}
  */
	my.color = function (_) {
		if (!arguments.length) return color;
		color = _;
		return my;
	};

	/**
  * Direction
  *
  * @param _
  * @returns {*}
  */
	my.dir = function (_) {
		return arguments.length ? (dir = _, my) : dir;
	};

	/**
  * Tick Direction
  *
  * @param _
  * @returns {*}
  */
	my.tickDir = function (_) {
		return arguments.length ? (tickDir = _, my) : tickDir;
	};

	/**
  * Ticks
  *
  */
	my.ticks = function () {
		return tickArguments = slice.call(arguments), my;
	};

	/**
  * Tick Arguments
  *
  * @param _
  * @returns {*[]}
  */
	my.tickArguments = function (_) {
		return arguments.length ? (tickArguments = _ === null ? [] : slice.call(_), my) : tickArguments.slice();
	};

	/**
  * Tick Values
  *
  * @param _
  * @returns {*}
  */
	my.tickValues = function (_) {
		return arguments.length ? (tickValues = _ === null ? null : slice.call(_), my) : tickValues && tickValues.slice();
	};

	/**
  * Tick Format
  *
  * @param _
  * @returns {*}
  */
	my.tickFormat = function (_) {
		return arguments.length ? (tickFormat = _, my) : tickFormat;
	};

	/**
  * Tick Size
  *
  * @param _
  * @returns {number}
  */
	my.tickSize = function (_) {
		return arguments.length ? (tickSize = +_, my) : tickSize;
	};

	/**
  * Tick Padding
  *
  * @param _
  * @returns {number}
  */
	my.tickPadding = function (_) {
		return arguments.length ? (tickPadding = +_, my) : tickPadding;
	};

	return my;
}

/**
 * Reusable 3D Multi Plane Axis
 *
 * @module
 */
function componentAxisThreePlane () {

	/**
  * Default Properties
  */
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["blue", "red", "green"];
	var classed = "x3dAxisMulti";

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {

		var layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
		selection.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		// Construct Axis Components
		var xzAxis = componentAxis().scale(xScale).dir('x').tickDir('z').tickSize(zScale.range()[1] - zScale.range()[0]).tickPadding(xScale.range()[0]).color("blue");

		var yzAxis = componentAxis().scale(yScale).dir('y').tickDir('z').tickSize(zScale.range()[1] - zScale.range()[0]).color("red");

		var yxAxis = componentAxis().scale(yScale).dir('y').tickDir('x').tickSize(xScale.range()[1] - xScale.range()[0]).tickFormat(function () {
			return '';
		}).color("red");

		var zxAxis = componentAxis().scale(zScale).dir('z').tickDir('x').tickSize(xScale.range()[1] - xScale.range()[0]).color("black");

		selection.select(".xzAxis").call(xzAxis);

		selection.select(".yzAxis").call(yzAxis);

		selection.select(".yxAxis").call(yxAxis);

		selection.select(".zxAxis").call(zxAxis);
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Bar Chart
 *
 * @module
 */
function componentBars () {

	/**
  * Default Properties
  */
	var dimensions = { x: 40, y: 40, z: 2 };
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "x3dBars";

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var seriesNames = dataSummary.columnKeys;
		var maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleBand().domain(seriesNames).rangeRound([0, dimentions.x]).padding(0.3) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0, dimentions.y]) : yScale;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
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
			}).append("shape").merge(bars);

			barsEnter.append("box").attr("size", "1.0 1.0 1.0");
			barsEnter.append("appearance").append("material").attr("diffuseColor", function (d) {
				return colorScale(d.key);
			});

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
		});
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Multi Series Bar Chart
 *
 * @module
 */
function componentBarsMultiSeries () {

	/**
  * Default Properties
  */
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "x3dBarsMulti";

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var categoryNames = dataSummary.rowKeys;
		var seriesNames = dataSummary.columnKeys;
		var maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleBand().domain(seriesNames).rangeRound([0, dimensions.x]).padding(0.5) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleBand().domain(categoryNames).range([0, dimensions.z]).padding(0.7) : zScale;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
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
			}).append("group").call(bars).merge(barGroup);

			barGroup.exit().remove();
		});
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Bubble Chart
 *
 * @module
 */
function componentBubbles () {

	/**
  * Default Properties
  */
	var dimensions = { x: 40, y: 40, z: 40 };
	var color = "orange";
	var classed = "x3dBubbles";

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var sizeScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var maxX = d3.max(data.values, function (d) {
			return +d.x;
		});
		var maxY = d3.max(data.values, function (d) {
			return +d.y;
		});
		var maxZ = d3.max(data.values, function (d) {
			return +d.z;
		});
		var maxValue = d3.max(data.values, function (d) {
			return +d.value;
		});

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxX]).range([0, dimensions.x]) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxY]).range([0, dimensions.y]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxZ]).range([0, dimensions.z]) : zScale;

		sizeScale = typeof sizeScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0.5, 3.0]) : sizeScale;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var makeSolid = function makeSolid(selection, color) {
				selection.append("appearance").append("material").attr("diffuseColor", color || "black");
				return selection;
			};

			var bubblesSelect = selection.selectAll(".point").data(function (d) {
				return d.values;
			});

			var bubbles = bubblesSelect.enter().append("transform").attr("class", "point").attr("translation", function (d) {
				return xScale(d.x) + ' ' + yScale(d.y) + ' ' + zScale(d.z);
			}).attr("onmouseover", "d3.select(this).select('billboard').attr('render', true);").attr("onmouseout", "d3.select(this).select('transform').select('billboard').attr('render', false);").merge(bubblesSelect);

			bubbles.append("shape").call(makeSolid, color).append("sphere").attr("radius", function (d) {
				return sizeScale(d.value);
			});

			bubbles.append("transform").attr('translation', "0.8 0.8 0.8") // FIXME: transation should be proportional to the sphere radius.
			.append("billboard").attr('render', false).attr("axisOfRotation", "0 0 0").append("shape").call(makeSolid, "blue").append("text").attr('class', "labelText").attr('string', function (d) {
				return d.key;
			}).append("fontstyle").attr("size", 1).attr("family", "SANS").attr("style", "BOLD").attr("justify", "START").attr('render', false);
		});
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.sizeScale = function (_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return my;
	};

	/**
  * Color Getter / Setter
  *
  * @param {string} _ - Color 'red' or '#ff0000'.
  * @returns {*}
  */
	my.color = function (_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};

	return my;
}

/**
 * Reusable 3D Multi Series Bubble Chart
 *
 * @module
 */
function componentBubblesMultiSeries () {

	/**
  * Default Properties
  */
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "x3dBubblesMulti";

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var seriesNames = dataSummary.rowKeys;
		var maxCoordinates = dataSummary.maxCoordinates;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]) : zScale;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			// Construct Bars Component
			var bubbles = componentBubbles().xScale(xScale).yScale(yScale).zScale(zScale).color(function (d) {
				return colorScale(d.key);
			});

			// Create Bar Groups
			var bubbleGroup = selection.selectAll(".bubbleGroup").data(data);

			bubbleGroup.enter().append("group").classed("bubbleGroup", true).each(function (d) {
				var color = colorScale(d.key);
				bubbles.color(color);
				d3.select(this).call(bubbles);
			}).merge(bubbleGroup);

			bubbleGroup.exit().remove();
		});
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Surface Area
 *
 * @module
 */
function componentSurfaceArea () {

	/**
  * Default Properties
  */
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["blue", "red"];
	var classed = "x3dSurface";

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Array to String
  *
  * @param arr
  * @returns {*}
  */
	function array2dToString(arr) {
		return arr.reduce(function (a, b) {
			return a.concat(b);
		}, []).reduce(function (a, b) {
			return a.concat(b);
		}, []).join(' ');
	}

	var coordinatePoints = function coordinatePoints(data) {
		var points = data.map(function (X) {
			return X.map(function (d) {
				return [xScale(d.x), yScale(d.y), zScale(d.z)];
			});
		});

		return array2dToString(points);
	};

	var colorFaceSet = function colorFaceSet(data) {
		var colors = data.map(function (X) {
			return X.map(function (d) {
				var col = d3.color(colorScale(d.y));
				return '' + Math.round(col.r / 2.55) / 100 + ' ' + Math.round(col.g / 2.55) / 100 + ' ' + Math.round(col.b / 2.55) / 100;
			});
		});

		return array2dToString(colors);
	};

	/**
  * Initialise Data and Scales
  *
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var maxX = d3.max(d3.merge(data), function (d) {
			return d.x;
		});
		var maxY = d3.max(d3.merge(data), function (d) {
			return d.y;
		});
		var maxZ = d3.max(d3.merge(data), function (d) {
			return d.z;
		});
		var extent = d3.extent(d3.merge(data), function (d) {
			return d.y;
		});

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleLinear().domain(extent).range(colors).interpolate(d3.interpolateLab) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxX]).range([0, dimensions.x]).nice() : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxY]).range([0, dimensions.y]).nice() : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxZ]).range([0, dimensions.z]).nice() : zScale;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var ny = data.length;
			var nx = data[0].length;

			var coordIndex = Array.apply(0, Array(ny - 1)).map(function (_, j) {
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

			var coords = array2dToString(coordIndex.concat(coordIndexBack));

			var surfaces = selection.selectAll('.surface').data([data]);

			surfaces.enter().append('shape').append('indexedfaceset').attr('coordIndex', coords).append("coordinate").attr('point', coordinatePoints);

			d3.selectAll('indexedFaceSet').append('color').attr('color', colorFaceSet);
		});
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

/**
 * Viewpoint
 *
 * @module
 */
function componentViewpoint () {

	/**
  * Default Properties
  */
	var viewPosition = [80.0, 15.0, 80.0];
	var viewOrientation = [0.0, 1.0, 0.0, 0.8];
	var fieldOfView = 0.8;

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
		selection.append("viewpoint").attr("position", viewPosition.join(" ")).attr("orientation", viewOrientation.join(" ")).attr("fieldOfView", fieldOfView).attr("set_bind", "true");
	}

	/**
  * View Position Getter / Setter
  *
  * @param {[{number}, {number}, {number}]} _
  * @returns {*}
  */
	my.viewPosition = function (_) {
		if (!arguments.length) return viewPosition;
		viewPosition = _;
		return my;
	};

	/**
  * View Orientation Getter / Setter
  *
  * @param {[{number}, {number}, {number}, {number}]} _
  * @returns {*}
  */
	my.viewOrientation = function (_) {
		if (!arguments.length) return viewOrientation;
		viewOrientation = _;
		return my;
	};

	/**
  * Field of View Getter / Setter
  *
  * @param {number} _
  * @returns {*}
  */
	my.fieldOfView = function (_) {
		if (!arguments.length) return fieldOfView;
		fieldOfView = _;
		return my;
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
	surfaceArea: componentSurfaceArea,
	viewpoint: componentViewpoint
};

/**
 * Reusable 3D Bar Chart
 *
 * @module
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 */
function chartBarChart () {

	/**
  * Default Properties
  */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "x3dBarChart";
	var debug = false;

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var categoryNames = dataSummary.rowKeys;
		var seriesNames = dataSummary.columnKeys;
		var maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleBand().domain(seriesNames).rangeRound([0, dimensions.x]).padding(0.5) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]).nice() : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleBand().domain(categoryNames).range([0, dimensions.z]).padding(0.7) : zScale;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "chart"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		var viewpoint = d3.x3d.component.viewpoint();
		scene.call(viewpoint);

		scene.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bars Component
			var chart = component.barsMultiSeries().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			scene.select(".axis").call(axis);

			scene.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _ - X3D Canvas Height in px.
  * @returns {*}
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _ - X3D Canvas Height in px.
  * @returns {*}
  */
	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {Object} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {Boolean} _ - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_) {
		if (!arguments.length) return debug;
		debug = _;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Scatter Plot
 *
 * @module
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 */
function chartScatterPlot () {

	/**
  * Default Properties
  */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "x3dScatterPlot";
	var debug = false;

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var seriesNames = dataSummary.rowKeys;
		var maxCoordinates = dataSummary.maxCoordinates;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]) : zScale;
	}

	/**
  * Constructor
  *
  * @constructor
  * @param {d3.selection} selection
  */
	function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "chart"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		var viewpoint = d3.x3d.component.viewpoint();
		scene.call(viewpoint);

		scene.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bubbles Component
			var chart = component.bubblesMultiSeries().xScale(xScale).yScale(yScale).zScale(zScale).colorScale(colorScale);

			scene.select(".axis").call(axis);

			scene.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _ - X3D Canvas Height in px.
  * @returns {*}
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _ - X3D Canvas Height in px.
  * @returns {*}
  */
	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {Object} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {Boolean} _ - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_) {
		if (!arguments.length) return debug;
		debug = _;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Surface Area
 * @see https://datavizproject.com/data-type/three-dimensional-stream-graph/
 */
function chartSurfaceArea () {

	/**
  * Default Properties
  */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["blue", "red"];
	var classed = "x3dSurfaceArea";
	var debug = false;

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Initialise Data and Scales
  */
	function init(data) {
		var maxX = d3.max(d3.merge(data), function (d) {
			return d.x;
		});
		var maxY = d3.max(d3.merge(data), function (d) {
			return d.y;
		});
		var maxZ = d3.max(d3.merge(data), function (d) {
			return d.z;
		});
		var extent = d3.extent(d3.merge(data), function (d) {
			return d.y;
		});

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleLinear().domain(extent).range(colors).interpolate(d3.interpolateLab) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxX]).range([0, dimensions.x]).nice() : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxY]).range([0, dimensions.y]).nice() : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxZ]).range([0, dimensions.z]).nice() : zScale;
	}

	/**
  * Constructor
  */
	function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "chart"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		var viewpoint = d3.x3d.component.viewpoint();
		scene.call(viewpoint);

		scene.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Surface Area Component
			var chart = component.surfaceArea().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			scene.select(".axis").call(axis);

			scene.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _ - X3D Canvas Height in px.
  * @returns {*}
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _ - X3D Canvas Height in px.
  * @returns {*}
  */
	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {Object} _ - D3 Scale.
  * @returns {*}
  */
	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _ - D3 Color Scale.
  * @returns {*}
  */
	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _ - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {Boolean} _ - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_) {
		if (!arguments.length) return debug;
		debug = _;
		return my;
	};

	return my;
}

var chart = {
	barChart: chartBarChart,
	scatterPlot: chartScatterPlot,
	surfaceArea: chartSurfaceArea
};

/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

var author$1 = "James Saunders";
var date = new Date();
var copyright = "Copyright (C) " + date.getFullYear() + " " + author$1;

var index = {
	version: version,
	author: author$1,
	copyright: copyright,
	license: license,
	chart: chart,
	component: component,
	dataTransform: dataTransform
};

return index;

})));

/**
 * d3-x3dom
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(global.d3 = global.d3 || {}, global.d3.x3dom = factory(global.d3));
}(this, (function (d3) { 'use strict';

var version = "1.0.17";
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
function dataTransform(data) {

	var SINGLE_SERIES = 1;
	var MULTI_SERIES = 2;

	/**
  * Row or Rows?
  */
	var dataStructure = data.key !== undefined ? SINGLE_SERIES : MULTI_SERIES;

	/**
  * Row Key
  */
	var rowKey = function () {
		if (dataStructure === SINGLE_SERIES) {
			return d3.values(data)[0];
		}
	}();

	/**
  * Row Keys
  */
	var rowKeys = function () {
		if (dataStructure === MULTI_SERIES) {
			return data.map(function (d) {
				return d.key;
			});
		}
	}();

	/**
  * Row Totals
  */
	var rowTotals = function () {
		if (MULTI_SERIES === dataStructure) {
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
  */
	var rowTotalsMax = function () {
		if (dataStructure === MULTI_SERIES) {
			return d3.max(d3.values(rowTotals));
		}
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
		if (dataStructure === SINGLE_SERIES) {
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
  * Row Totals
  */
	var rowTotal = function () {
		if (dataStructure === SINGLE_SERIES) {
			return d3.sum(data.values, function (d) {
				return d.value;
			});
		}
	}();

	/**
  * Column Totals
  */
	var columnTotals = function () {
		if (dataStructure !== MULTI_SERIES) {
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
  */
	var columnTotalsMax = function () {
		if (dataStructure === MULTI_SERIES) {
			return d3.max(d3.values(columnTotals));
		}
	}();

	/**
  * Min Value
  */
	var minValue = function () {
		if (dataStructure === SINGLE_SERIES) {
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
  * Max Value
  */
	var maxValue = function () {
		if (dataStructure === SINGLE_SERIES) {
			return d3.max(data.values, function (d) {
				return +d.value;
			});
		}

		var ret = void 0;
		d3.map(data).values().forEach(function (d) {
			d.values.forEach(function (d) {
				ret = typeof ret === "undefined" ? d.value : d3.max([ret, +d.value]);
			});
		});

		return +ret;
	}();

	/**
  * Max Coordinates
  */
	var maxCoordinates = function () {
		var maxX = void 0,
		    maxY = void 0,
		    maxZ = void 0;

		if (dataStructure === SINGLE_SERIES) {
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
		if (dataStructure === MULTI_SERIES) {
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
  * Attempt to auto-calculate some thresholds
  */
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
 * Reusable 3D Axis Component
 *
 * @module
 */
function componentAxis () {

	/* Default Properties */
	var dimensions = { x: 40, y: 40, z: 40 };
	var color = "black";
	var classed = "x3dAxis";

	/* Scale and Axis Options */
	var scale = void 0;
	var dir = void 0;
	var tickDir = void 0;
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
	function getAxisDirectionVector(axisDir) {
		return axisDirectionVectors[axisDir];
	}

	/**
  * Get Axis Rotation Vector
  *
  * @private
  * @param {string} axisDir
  * @returns {number[]}
  */
	function getAxisRotationVector(axisDir) {
		return axisRotationVectors[axisDir];
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias axis
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.classed(classed, true);

		var makeSolid = function makeSolid(selection, color) {
			selection.append("appearance").append("material").attr("diffuseColor", color || "black");

			return selection;
		};

		var range = scale.range();
		var range0 = range[0];
		var range1 = range[range.length - 1];

		var dirVec = getAxisDirectionVector(dir);
		var tickDirVec = getAxisDirectionVector(tickDir);
		var rotVec = getAxisRotationVector(dir);
		var tickRotVec = getAxisRotationVector(tickDir);

		var path = selection.selectAll("transform").data([null]);

		var tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
		tickValues = tickValues === null ? tickValuesDefault : tickValues;

		var tick = selection.selectAll(".tick").data(tickValues, scale).order();

		var tickExit = tick.exit();
		var tickEnter = tick.enter().append("transform").attr("translation", function (t) {
			return dirVec.map(function (a) {
				return scale(t) * a;
			}).join(" ");
		}).attr("class", "tick");

		var line = tick.select(".tickLine");
		path = path.merge(path.enter().append("transform").attr("rotation", rotVec.join(" ")).attr("translation", dirVec.map(function (d) {
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
			newText.attr("translation", tickDirVec.map(function (d) {
				return -d * tickPadding;
			})).append("billboard").attr("axisOfRotation", "0 0 0").append("shape").call(makeSolid, "black").append("text").attr("string", tickFormat).append("fontstyle").attr("size", 1.3).attr("family", "SANS").attr("style", "BOLD").attr("justify", "MIDDLE");
			text = text.merge(newText);
		}

		tickExit.remove();
		path.append("cylinder").attr("radius", 0.1).attr("height", range1 - range0);

		line.attr("translation", tickDirVec.map(function (d) {
			return d * tickSize / 2;
		}).join(" ")).attr("rotation", tickRotVec.join(" ")).attr("class", "tickLine").append("shape").call(makeSolid).append("cylinder").attr("radius", 0.05).attr("height", tickSize);
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return my;
	};

	/**
  * Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 Scale.
  * @returns {*}
  */
	my.scale = function (_x) {
		if (!arguments.length) return scale;
		scale = _x;
		return my;
	};

	/**
  * Direction Getter / Setter
  *
  * @param {string} _x - Direction of Axis (e.g. 'x', 'y', 'z').
  * @returns {*}
  */
	my.dir = function (_x) {
		if (!arguments.length) return dir;
		dir = _x;
		return my;
	};

	/**
  * Tick Direction Getter / Setter
  *
  * @param {string} _x - Direction of Ticks (e.g. 'x', 'y', 'z').
  * @returns {*}
  */
	my.tickDir = function (_x) {
		if (!arguments.length) return tickDir;
		tickDir = _x;
		return my;
	};

	/**
  * Tick Arguments Getter / Setter
  *
  * @param {Array} _x - Tick arguments.
  * @returns {Array<*>}
  */
	my.tickArguments = function (_x) {
		if (!arguments.length) return tickArguments;
		tickArguments = _x;
		return my;
	};

	/**
  * Tick Values Getter / Setter
  *
  * @param {Array} _x - Tick values.
  * @returns {*}
  */
	my.tickValues = function (_x) {
		if (!arguments.length) return tickValues;
		tickValues = _x;
		return my;
	};

	/**
  * Tick Format Getter / Setter
  *
  * @param {string} _x - Tick format.
  * @returns {*}
  */
	my.tickFormat = function (_x) {
		if (!arguments.length) return tickFormat;
		tickFormat = _x;
		return my;
	};

	/**
  * Tick Size Getter / Setter
  *
  * @param {number} _x - Tick length.
  * @returns {*}
  */
	my.tickSize = function (_x) {
		if (!arguments.length) return tickSize;
		tickSize = _x;
		return my;
	};

	/**
  * Tick Padding Getter / Setter
  *
  * @param {number} _x - Tick padding size.
  * @returns {*}
  */
	my.tickPadding = function (_x) {
		if (!arguments.length) return tickPadding;
		tickPadding = _x;
		return my;
	};

	/**
  * Color Getter / Setter
  *
  * @param {string} _x - Color (e.g. 'red' or '#ff0000').
  * @returns {*}
  */
	my.color = function (_x) {
		if (!arguments.length) return color;
		color = _x;
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
	var classed = "x3dAxisThreePlane";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Constructor
  *
  * @constructor
  * @alias axisThreePlane
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {

		var layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
		selection.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		// Construct Axis Components
		var xzAxis = componentAxis().scale(xScale).dir("x").tickDir("z").tickSize(zScale.range()[1] - zScale.range()[0]).tickPadding(xScale.range()[0]).color("blue");

		var yzAxis = componentAxis().scale(yScale).dir("y").tickDir("z").tickSize(zScale.range()[1] - zScale.range()[0]).color("red");

		var yxAxis = componentAxis().scale(yScale).dir("y").tickDir("x").tickSize(xScale.range()[1] - xScale.range()[0]).tickFormat("").color("red");

		var zxAxis = componentAxis().scale(zScale).dir("z").tickDir("x").tickSize(xScale.range()[1] - xScale.range()[0]).color("black");

		selection.select(".xzAxis").call(xzAxis);

		selection.select(".yzAxis").call(yzAxis);

		selection.select(".yxAxis").call(yxAxis);

		selection.select(".zxAxis").call(zxAxis);
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
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
	var classed = "x3dBars";

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
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.3);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias bars
  * @param {d3.selection} selection - The chart holder D3 selection.
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
			}).attr("ambientIntensity", "0.1");

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
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
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
	var classed = "x3dBarsMultiSeries";

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
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensions.z]).padding(0.7);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barsMultiSeries
  * @param {d3.selection} selection - The chart holder D3 selection.
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
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
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
	var classed = "x3dBubbles";

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
		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxX]).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxY]).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxZ]).range([0, dimensions.z]);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(extent).range(sizeDomain);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias bubbles
  * @param {d3.selection} selection - The chart holder D3 selection.
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
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_x) {
		if (!arguments.length) return sizeScale;
		sizeScale = _x;
		return my;
	};

	/**
  * Size Domain Getter / Setter
  *
  * @param {number[]} _x - Size min and max (e.g. [1, 9]).
  * @returns {*}
  */
	my.sizeDomain = function (_x) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _x;
		return my;
	};

	/**
  * Color Getter / Setter
  *
  * @param {string} _x - Color (e.g. 'red' or '#ff0000').
  * @returns {*}
  */
	my.color = function (_x) {
		if (!arguments.length) return color;
		color = _x;
		return my;
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
	var classed = "x3dBubblesMultiSeries";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;
	var sizeScale = void 0;
	var sizeDomain = [0.5, 3.0];

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    maxCoordinates = _dataTransform$summar.maxCoordinates,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(extent).range(sizeDomain);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias bubblesMultiSeries
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			// Construct Bars Component
			var bubbles = componentBubbles().xScale(xScale).yScale(yScale).zScale(zScale).sizeScale(sizeScale).color(function (d) {
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
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 Scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 Scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_x) {
		if (!arguments.length) return sizeScale;
		sizeScale = _x;
		return my;
	};

	/**
  * Size Domain Getter / Setter
  *
  * @param {number[]} _x - Size min and max (e.g. [0.5, 3.0]).
  * @returns {*}
  */
	my.sizeDomain = function (_x) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
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
	var classed = "x3dSurface";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/**
  * Array to String
  *
  * @private
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

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scalePoint().domain(rowKeys).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scalePoint().domain(columnKeys).range([0, dimensions.z]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear().domain(extent).range(colors).interpolate(d3.interpolateLab);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias surface
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var ny = data.length;
			var nx = data[0].values.length;

			var coordinatePoints = function coordinatePoints(data) {
				var points = data.map(function (X) {
					return X.values.map(function (d) {
						return [xScale(X.key), yScale(d.value), zScale(d.key)];
					});
				});
				return array2dToString(points);
			};

			var colorFaceSet = function colorFaceSet(data) {
				var colors = data.map(function (X) {
					return X.values.map(function (d) {
						var col = d3.color(colorScale(d.value));
						return '' + Math.round(col.r / 2.55) / 100 + ' ' + Math.round(col.g / 2.55) / 100 + ' ' + Math.round(col.b / 2.55) / 100;
					});
				});
				return array2dToString(colors);
			};

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

			var surfaces = selection.selectAll(".surface").data([data]);

			var indexedfaceset = surfaces.enter().append("shape").append("indexedfaceset").attr("coordIndex", coords);

			indexedfaceset.append("coordinate").attr("point", coordinatePoints);

			indexedfaceset.append("color").attr("color", colorFaceSet);
		});
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
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
	var classed = "x3dViewpoint";

	/**
  * Constructor
  *
  * @constructor
  * @alias viewpoint
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.append("viewpoint").classed(classed, true).attr("centerOfRotation", centerOfRotation.join(" ")).attr("position", viewPosition.join(" ")).attr("orientation", viewOrientation.join(" ")).attr("fieldOfView", fieldOfView).attr("set_bind", "true");
	}

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
  * @param {number[]} _x - Centre of rotation.
  * @returns {*}
  */
	my.centerOfRotation = function (_x) {
		if (!arguments.length) return centerOfRotation;
		centerOfRotation = _x;
		return my;
	};

	/**
  * View Position Getter / Setter
  *
  * @param {number[]} _x - View position.
  * @returns {*}
  */
	my.viewPosition = function (_x) {
		if (!arguments.length) return viewPosition;
		viewPosition = _x;
		return my;
	};

	/**
  * View Orientation Getter / Setter
  *
  * @param {number[]} _x - View orientation.
  * @returns {*}
  */
	my.viewOrientation = function (_x) {
		if (!arguments.length) return viewOrientation;
		viewOrientation = _x;
		return my;
	};

	/**
  * Field of View Getter / Setter
  *
  * @param {number} _x - Field of view.
  * @returns {*}
  */
	my.fieldOfView = function (_x) {
		if (!arguments.length) return fieldOfView;
		fieldOfView = _x;
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
	var dimensions = { x: 40, y: 40, z: 40 };
	var color = "red";
	var classed = "x3dRibbon";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.3);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias ribbon
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			var ribbonSelect = selection.selectAll(".point").data(function (d) {
				return d.values;
			});

			var ribbon = ribbonSelect.enter().append("transform").attr("translation", function (d) {
				var x = xScale(d.key);
				var y = yScale(d.value) / 2;
				return x + " " + y + " 0";
			}).attr("rotation", function () {
				return "0,-1,0,1.57079633";
			}).append("shape");

			ribbon.append("rectangle2d").attr("size", function (d) {
				var width = 5;
				var height = yScale(d.value);
				return width + " " + height;
			}).attr("solid", "true");

			ribbon.append("appearance").append("twosidedmaterial").attr("diffuseColor", color);
		});
	}

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: {number}, y: {number}, z: {number}}} _x - 3D Object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Color Getter / Setter
  *
  * @param {string} _x - Color (e.g. 'red' or '#ff0000').
  * @returns {*}
  */
	my.color = function (_x) {
		if (!arguments.length) return color;
		color = _x;
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
	surface: componentSurface,
	viewpoint: componentViewpoint,
	ribbon: componentRibbon
};

/**
 * Reusable 3D Bar Chart
 *
 * @module
 *
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.barChartMultiSeries();
 * chartHolder.datum(myData).call(myChart);
 */
function chartBarChartMultiSeries () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "x3dBarChartMultiSeries";
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
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensions.z]).padding(0.7);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartMultiSeries
  * @param {d3.selection} selection - The chart holder D3 selection.
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

		var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.append("directionallight").attr("direction", "1 0 -1").attr("on", "true").attr("intensity", "0.4").attr("shadowintensity", "0");

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
  * @param {number} _x - X3D canvas width in px.
  * @returns {*}
  */
	my.width = function (_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _x - X3D canvas height in px.
  * @returns {*}
  */
	my.height = function (_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {boolean} _x - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_x) {
		if (!arguments.length) return debug;
		debug = _x;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Bar Chart
 *
 * @module
 *
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.barChartVertical();
 * chartHolder.datum(myData).call(myChart);
 */
function chartBarChartVertical () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "x3dBarChartVertical";
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
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]).nice();
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias barChartVertical
  * @param {d3.selection} selection - The chart holder D3 selection.
  */
	function my(selection) {
		var x3d = selection.append("x3d").attr("width", width + "px").attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true");
		}

		var scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		var layers = ["xAxis", "yAxis", "chart"];
		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		var viewpoint = component.viewpoint().quickView("left");
		scene.call(viewpoint);

		scene.each(function (data) {
			init(data);

			// Construct Axis Components
			var xAxis = component.axis().scale(xScale).dir('x').tickDir('y');

			var yAxis = component.axis().scale(yScale).dir('y').tickDir('x').tickSize(yScale.range()[1] - yScale.range()[0]);

			// Construct Bars Component
			var chart = component.bars().xScale(xScale).yScale(yScale).colors(colors);

			scene.select(".xAxis").call(xAxis);

			scene.select(".yAxis").call(yAxis);

			scene.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _x - X3D canvas width in px.
  * @returns {*}
  */
	my.width = function (_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _x - X3D canvas height in px.
  * @returns {*}
  */
	my.height = function (_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {boolean} _x - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_x) {
		if (!arguments.length) return debug;
		debug = _x;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Bubble Chart
 *
 * @module
 *
 * @see https://datavizproject.com/data-type/bubble-chart/
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.bubbleChart();
 * chartHolder.datum(myData).call(myChart);
 */
function chartBubbleChart () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "x3dBubbleChart";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;
	var sizeScale = void 0;
	var sizeDomain = [0.5, 4.0];

	/**
  * Initialise Data and Scales
  *
  * @private
  * @param {Array} data - Chart data.
  */
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    maxCoordinates = _dataTransform$summar.maxCoordinates,
		    rowKeys = _dataTransform$summar.rowKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(rowKeys).range(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear().domain(extent).range(sizeDomain);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias bubbleChart
  * @param {d3.selection} selection - The chart holder D3 selection.
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

		var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.append("directionallight").attr("direction", "1 0 -1").attr("on", "true").attr("intensity", "0.4").attr("shadowintensity", "0");

		scene.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bubbles Component
			var chart = component.bubblesMultiSeries().xScale(xScale).yScale(yScale).zScale(zScale).sizeScale(sizeScale).colorScale(colorScale);

			scene.select(".axis").call(axis);

			scene.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _x - X3D canvas width in px.
  * @returns {*}
  */
	my.width = function (_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _x - X3D canvas height in px.
  * @returns {*}
  */
	my.height = function (_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	/**
  * Size Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.sizeScale = function (_x) {
		if (!arguments.length) return sizeScale;
		sizeScale = _x;
		return my;
	};

	/**
  * Size Domain Getter / Setter
  *
  * @param {number[]} _x - Size min and max (e.g. [0.5, 3.0]).
  * @returns {*}
  */
	my.sizeDomain = function (_x) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _x;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {boolean} _x - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_x) {
		if (!arguments.length) return debug;
		debug = _x;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Scatter Plot Chart
 *
 * @module
 *
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.scatterPlot();
 * chartHolder.datum(myData).call(myChart);
 */
function chartScatterPlot () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var color = "orange";
	var classed = "x3dScatterPlot";
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
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    maxCoordinates = _dataTransform$summar.maxCoordinates;

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias scatterPlot
  * @param {d3.selection} selection - The chart holder D3 selection.
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

		var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bubbles Component
			var chart = component.bubbles().xScale(xScale).yScale(yScale).zScale(zScale).color(color).sizeDomain([0.5, 0.5]);

			scene.select(".axis").call(axis);

			scene.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _x - X3D canvas width in px.
  * @returns {*}
  */
	my.width = function (_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _x - X3D canvas height in px.
  * @returns {*}
  */
	my.height = function (_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Getter / Setter
  *
  * @param {string} _x - Color (e.g. 'red' or '#ff0000').
  * @returns {*}
  */
	my.color = function (_x) {
		if (!arguments.length) return color;
		color = _x;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {boolean} _x - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_x) {
		if (!arguments.length) return debug;
		debug = _x;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Surface Plot Chart
 *
 * @module
 *
 * @see https://datavizproject.com/data-type/three-dimensional-stream-graph/
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.surfacePlot();
 * chartHolder.datum(myData).call(myChart);
 */
function chartSurfacePlot () {

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["blue", "red"];
	var classed = "x3dSurfacePlot";
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
	function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
		    rowKeys = _dataTransform$summar.rowKeys,
		    columnKeys = _dataTransform$summar.columnKeys,
		    maxValue = _dataTransform$summar.maxValue;

		var extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scalePoint().domain(rowKeys).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scalePoint().domain(columnKeys).range([0, dimensions.z]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear().domain(extent).range(colors).interpolate(d3.interpolateLab);
		}
	}

	/**
  * Constructor
  *
  * @constructor
  * @alias surfacePlot
  * @param {d3.selection} selection - The chart holder D3 selection.
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

		var viewpoint = component.viewpoint().centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisThreePlane().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Surface Component
			var chart = component.surface().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			scene.select(".axis").call(axis);

			scene.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Width Getter / Setter
  *
  * @param {number} _x - X3D canvas width in px.
  * @returns {*}
  */
	my.width = function (_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	};

	/**
  * Height Getter / Setter
  *
  * @param {number} _x - X3D canvas height in px.
  * @returns {*}
  */
	my.height = function (_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	};

	/**
  * Dimensions Getter / Setter
  *
  * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
  * @returns {*}
  */
	my.dimensions = function (_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
  * X Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.xScale = function (_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
  * Y Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.yScale = function (_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
  * Z Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 scale.
  * @returns {*}
  */
	my.zScale = function (_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
  * Color Scale Getter / Setter
  *
  * @param {d3.scale} _x - D3 color scale.
  * @returns {*}
  */
	my.colorScale = function (_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
  * Colors Getter / Setter
  *
  * @param {Array} _x - Array of colours used by color scale.
  * @returns {*}
  */
	my.colors = function (_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	/**
  * Debug Getter / Setter
  *
  * @param {boolean} _x - Show debug log and stats. True/False.
  * @returns {*}
  */
	my.debug = function (_x) {
		if (!arguments.length) return debug;
		debug = _x;
		return my;
	};

	return my;
}

var chart = {
	barChartMultiSeries: chartBarChartMultiSeries,
	barChartVertical: chartBarChartVertical,
	bubbleChart: chartBubbleChart,
	scatterPlot: chartScatterPlot,
	surfacePlot: chartSurfacePlot
};

/**
 * d3-x3dom
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
	dataTransform: dataTransform,
	chart: chart,
	component: component
};

return index;

})));

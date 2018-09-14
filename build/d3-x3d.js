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

var version = "1.0.3";
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
 */
function componentAxis () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
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
  * Constructor
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
  * Configuration Getters & Setters
  */
	var slice = Array.prototype.slice;

	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.scale = function (_) {
		if (!arguments.length) return scale;
		scale = _;
		return my;
	};

	my.color = function (_) {
		if (!arguments.length) return color;
		color = _;
		return my;
	};

	my.dir = function (_) {
		return arguments.length ? (dir = _, my) : dir;
	};

	my.tickDir = function (_) {
		return arguments.length ? (tickDir = _, my) : tickDir;
	};

	my.ticks = function () {
		return tickArguments = slice.call(arguments), my;
	};

	my.tickArguments = function (_) {
		return arguments.length ? (tickArguments = _ === null ? [] : slice.call(_), my) : tickArguments.slice();
	};

	my.tickValues = function (_) {
		return arguments.length ? (tickValues = _ === null ? null : slice.call(_), my) : tickValues && tickValues.slice();
	};

	my.tickFormat = function (_) {
		return arguments.length ? (tickFormat = _, my) : tickFormat;
	};

	my.tickSize = function (_) {
		return arguments.length ? (tickSize = +_, my) : tickSize;
	};

	my.tickPadding = function (_) {
		return arguments.length ? (tickPadding = +_, my) : tickPadding;
	};

	return my;
}

/**
 * Reusable 3D Multi Plane Axis
 *
 */
function componentbarsAxisMulti () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
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
  */
	function my(selection) {

		var layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
		selection.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		// Construct Axis Components
		var xzAxis = componentAxis().scale(xScale).dir('x').tickDir('z').tickSize(xScale.range()[1] - xScale.range()[0]).tickPadding(xScale.range()[0]).color("blue");

		var yzAxis = componentAxis().scale(yScale).dir('y').tickDir('z').tickSize(yScale.range()[1] - yScale.range()[0]).color("red");

		var yxAxis = componentAxis().scale(yScale).dir('y').tickDir('x').tickSize(yScale.range()[1] - yScale.range()[0]).tickFormat(function () {
			return '';
		}).color("red");

		var zxAxis = componentAxis().scale(zScale).dir('z').tickDir('x').tickSize(zScale.range()[1] - zScale.range()[0]).color("black");

		selection.select(".xzAxis").call(xzAxis);

		selection.select(".yzAxis").call(yzAxis);

		selection.select(".yxAxis").call(yxAxis);

		selection.select(".zxAxis").call(zxAxis);
	}

	/**
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

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
 */
function componentBars () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 2.0;
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
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var seriesNames = dataSummary.columnKeys;
		var maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleBand().domain(seriesNames).rangeRound([0, width]).padding(0.3) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0, height]) : yScale;
	}

	/**
  * Constructor
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
				var z = depth;
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
				var z = depth;
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
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

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
 */
function componentbarsBarsMulti () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
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
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var categoryNames = dataSummary.rowKeys;
		var seriesNames = dataSummary.columnKeys;
		var maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleBand().domain(seriesNames).rangeRound([0, width]).padding(0.5) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0, height]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleBand().domain(categoryNames).range([0, depth]).padding(0.7) : zScale;
	}

	/**
  * Constructor
  */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function (data) {
			init(data);

			// Construct Bars Component
			var bars = componentBars().xScale(xScale).yScale(yScale).depth(zScale.bandwidth()).colors(colors);

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
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

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
 */
function componentBubbles () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
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
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxX]).range([0, width]) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxY]).range([0, height]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxZ]).range([0, depth]) : zScale;

		sizeScale = typeof sizeScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0.5, 3.0]) : sizeScale;
	}

	/**
  * Constructor
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
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.sizeScale = function (_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return my;
	};

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
 */
function componentbarsBubblesMulti () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
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
  */
	function init(data) {
		var dataSummary = dataTransform(data).summary();
		var seriesNames = dataSummary.rowKeys;
		var maxCoordinates = dataSummary.maxCoordinates;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, width]) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, height]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, depth]) : zScale;
	}

	/**
  * Constructor
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
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

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
 */
function componentbarsSurface () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
	var colors = ["blue", "red"];
	var classed = "x3dSurface";

	/**
  * Scales
  */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

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
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxX]).range([0, width]).nice() : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxY]).range([0, height]).nice() : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxZ]).range([0, depth]).nice() : zScale;
	}

	/**
  * Constructor
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
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

var component = {
	axis: componentAxis,
	axisMulti: componentbarsAxisMulti,
	bars: componentBars,
	barsMulti: componentbarsBarsMulti,
	bubbles: componentBubbles,
	bubblesMulti: componentbarsBubblesMulti,
	surface: componentbarsSurface
};

/**
 * Reusable 3D Bar Chart
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 */
function chartBarChart () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "x3dBarChart";

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
		var dataSummary = dataTransform(data).summary();
		var categoryNames = dataSummary.rowKeys;
		var seriesNames = dataSummary.columnKeys;
		var maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleBand().domain(seriesNames).rangeRound([0, width]).padding(0.5) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxValue]).range([0, height]).nice() : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleBand().domain(categoryNames).range([0, depth]).padding(0.7) : zScale;
	}

	/**
  * Constructor
  */
	function my(selection) {

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "chart"];
		selection.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisMulti().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bars Component
			var chart = component.barsMulti().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			selection.select(".axis").call(axis);

			selection.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

/**
 * Reusable 3D Scatter Plot
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 */
function chartScatterPlot () {

	/**
  * Default Properties
  */
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "x3dScatterPlot";

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
		var dataSummary = dataTransform(data).summary();
		var seriesNames = dataSummary.rowKeys;
		var maxCoordinates = dataSummary.maxCoordinates;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = typeof colorScale === "undefined" ? d3.scaleOrdinal().domain(seriesNames).range(colors) : colorScale;

		// Calculate Scales.
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, width]) : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, height]) : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, depth]) : zScale;
	}

	/**
  * Constructor
  */
	function my(selection) {

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "chart"];
		selection.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisMulti().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Bubbles Component
			var chart = component.bubblesMulti().xScale(xScale).yScale(yScale).zScale(zScale).colorScale(colorScale);

			selection.select(".axis").call(axis);

			selection.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
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
	var width = 40.0;
	var height = 40.0;
	var depth = 40.0;
	var colors = ["blue", "red"];
	var classed = "x3dSurfaceArea";

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
		xScale = typeof xScale === "undefined" ? d3.scaleLinear().domain([0, maxX]).range([0, width]).nice() : xScale;

		yScale = typeof yScale === "undefined" ? d3.scaleLinear().domain([0, maxY]).range([0, height]).nice() : yScale;

		zScale = typeof zScale === "undefined" ? d3.scaleLinear().domain([0, maxZ]).range([0, depth]).nice() : zScale;
	}

	/**
  * Constructor
  */
	function my(selection) {

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "chart"];
		selection.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function (d) {
			return d;
		});

		selection.each(function (data) {
			init(data);

			// Construct Axis Component
			var axis = component.axisMulti().xScale(xScale).yScale(yScale).zScale(zScale);

			// Construct Surface Component
			var chart = component.surface().xScale(xScale).yScale(yScale).zScale(zScale).colors(colors);

			selection.select(".axis").call(axis);

			selection.select(".chart").datum(data).call(chart);
		});
	}

	/**
  * Configuration Getters & Setters
  */
	my.width = function (_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function (_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function (_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function (_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function (_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function (_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function (_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function (_) {
		if (!arguments.length) return colors;
		colors = _;
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

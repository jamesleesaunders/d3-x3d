import * as d3 from "d3";
import dataTransform from "../dataTransform";
import componentArea from "./area";

/**
 * Reusable 3D Multi Series Area Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	var dimensions = { x: 40, y: 40, z: 40 };
	var colors = ["orange", "red", "yellow", "steelblue", "green"];
	var classed = "d3X3domAreaMultiSeries";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;
	let colorDomain = [];

	/* Components */
	var area = componentArea();

	/**
	 * Unique Array
	 *
	 * @param {array} array1
	 * @param {array} array2
	 * @returns {array}
	 */
	const arrayUnique = function(array1, array2) {
		let array = array1.concat(array2);

		let a = array.concat();
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
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
		selection.each(function(data) {
			init(data);

			var element = d3.select(this)
				.classed(classed, true);

			area.xScale(xScale)
				.yScale(yScale)
				.dimensions({
					x: dimensions.x,
					y: dimensions.y,
					z: zScale.bandwidth()
				});

			var addArea = function addArea(d) {
				var color = colorScale(d.key);
				area.color(color);
				d3.select(this).call(area);
			};

			var areaGroup = element.selectAll(".areaGroup")
				.data(function(d) { return d; }, function(d) { return d.key; });

			areaGroup.enter()
				.append("transform")
				.classed("areaGroup", true)
				.merge(areaGroup)
				.transition()
				.attr("translation", function(d) {
					var x = 0;
					var y = 0;
					var z = zScale(d.key);
					return x + " " + y + " " + z;
				})
				.each(addArea);

			areaGroup.exit()
				.remove();
		});
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_v) {
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
	my.xScale = function(_v) {
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
	my.yScale = function(_v) {
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
	my.zScale = function(_v) {
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
	my.colorScale = function(_v) {
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
	my.colors = function(_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	return my;
}

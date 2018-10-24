import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable 3D Ribbon Chart
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "red";
	let classed = "x3dRibbon";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).rangeRound([0, dimensions.x]).padding(0.3) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]) :
			yScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			let ribbonSelect = selection.selectAll(".point")
				.data(function(d) { return d.values; });

			let ribbon = ribbonSelect.enter()
				.append("transform")
				.attr("translation", function(d, i) {
					let x = xScale(d.key);
					return x + " 0 0";
				})
				.attr("rotation", function(d, i) {
					return "0,-1,0,1.0472";
				})
				.append("shape");

			ribbon.append("rectangle2d")
				.attr("size", "40 10")
				.attr("solid", "true");

			ribbon.append("appearance")
				.append("twosidedmaterial")
				.attr("diffuseColor", color);

			/*
				<transform translation="0 0 0" render="true" bboxCenter="0,0,0" bboxSize="-1,-1,-1" center="0,0,0" rotation="1,0,0,1.5708" scale="1,1,1" scaleOrientation="0,0,0,0">

					<transform translation="0 0 0" render="true" bboxCenter="0,0,0" bboxSize="-1,-1,-1" center="0,0,0" rotation="0,1,0,1.0472" scale="1,1,1" scaleOrientation="0,0,0,0">
					<shape render="true" bboxCenter="0,0,0" bboxSize="-1,-1,-1" isPickable="true">
						<rectangle2d size="40 10" solid="true" ccw="true" useGeoCache="true" lit="true" subdivision="1,1"></rectangle2d>
						<appearance>
							<twosidedmaterial diffuseColor="red"></twosidedmaterial>
						</appearance>
					</shape>
					</transform>

					<transform translation="20 0 0" render="true" bboxCenter="0,0,0" bboxSize="-1,-1,-1" center="0,0,0" rotation="0,-1,0,1.0472" scale="1,1,1" scaleOrientation="0,0,0,0">
						<shape render="true" bboxCenter="0,0,0" bboxSize="-1,-1,-1" isPickable="true">
							<rectangle2d size="40 10" solid="true" ccw="true" useGeoCache="true" lit="true" subdivision="1,1"></rectangle2d>
							<appearance>
								<twosidedmaterial diffuseColor="red"></twosidedmaterial>
							</appearance>
						</shape>
					</transform>

				</transform>
  		*/
		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_) {
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
	my.xScale = function(_) {
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
	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _ - Color 'red' or '#ff0000'.
	 * @returns {*}
	 */
	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};

	return my;
}

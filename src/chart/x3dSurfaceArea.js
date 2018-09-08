import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as component } from "../component";

/**
 * Reusable 3D Surface Area
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 40.0;
	let height = 40.0;
	let depth = 40.0;
	let colors = ["blue", "red"];
	let classed = "x3dSurfaceArea";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		console.log(data);

		let maxX = d3.max(d3.merge(data), function(d) { return d.x; });
		let maxY = d3.max(d3.merge(data), function(d) { return d.y; });
		let maxZ = d3.max(d3.merge(data), function(d) { return d.z; });
		let extent = d3.extent(d3.merge(data), function(d) { return d.y; });

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleLinear().domain(extent).range(colors).interpolate(d3.interpolateLab) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleLinear().domain([0, maxX]).range([0, width]).nice() :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxY]).range([0, height]).nice() :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleLinear().domain([0, maxZ]).range([0, depth]).nice() :
			zScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		let scene = selection;

		// Update the chart dimensions and add layer groups
		let layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis", "barChart"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		selection.each(function(data) {
			init(data);

			// Construct Axis Components
			let xzAxis = d3.ez.component.x3dAxis()
				.scale(xScale)
				.dir('x')
				.tickDir('z')
				.tickSize(xScale.range()[1] - xScale.range()[0])
				.tickPadding(xScale.range()[0])
				.color("blue");

			let yzAxis = d3.ez.component.x3dAxis()
				.scale(yScale)
				.dir('y')
				.tickDir('z')
				.tickSize(yScale.range()[1] - yScale.range()[0])
				.color("red");

			let yxAxis = d3.ez.component.x3dAxis()
				.scale(yScale)
				.dir('y')
				.tickDir('x')
				.tickSize(yScale.range()[1] - yScale.range()[0])
				.tickFormat(function(d) { return ''; })
				.color("red");

			let zxAxis = d3.ez.component.x3dAxis()
				.scale(zScale)
				.dir('z')
				.tickDir('x')
				.tickSize(zScale.range()[1] - zScale.range()[0])
				.color("black");

			// Surface Area Component
			let barChart = d3.ez.component.x3dSurfaceArea()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colors(colors);

			scene.select(".xzAxis")
				.call(xzAxis);

			scene.select(".yzAxis")
				.call(yzAxis);

			scene.select(".yxAxis")
				.call(yxAxis);

			scene.select(".zxAxis")
				.call(zxAxis);

			scene.select(".barChart")
				.datum(data)
				.call(barChart);
		});
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function(_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function(_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}

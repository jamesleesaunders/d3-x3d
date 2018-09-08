import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable 3D Bar Chart
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 40.0;
	let height = 40.0;
	let depth = 2.0;
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "x3dBars";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).rangeRound([0, width]).padding(0.3) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, height]) :
			yScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		let scene = selection;
		scene.classed(classed, true);

		selection.each(function(data) {
			init(data);
			let bars = scene.selectAll(".bar")
				.data(function(d) { return d.values; });

			let barsEnter = bars.enter()
				.append("transform")
				.classed("bar", true)
				.attr("scale", function(d) {
					let x = xScale.bandwidth();
					let y = yScale(d.value);
					let z = depth;
					return x + " " + y + " " + z;
				})
				.attr("translation", function(d) {
					let x = xScale(d.key);
					let y = yScale(d.value) / 2;
					let z = 0.0;
					return x + " " + y + " " + z;
				})
				.append("shape")
				.merge(bars);

			barsEnter.append("box")
				.attr("size", "1.0 1.0 1.0");
			barsEnter.append("appearance")
				.append("material")
				.attr("diffuseColor", function(d) {
					return colorScale(d.key);
				});

			bars.transition()
				.attr("scale", function(d) {
					let x = xScale.bandwidth();
					let y = yScale(d.value);
					let z = depth;
					return x + " " + y + " " + z;
				})
				.attr("translation", function(d) {
					let x = xScale(d.key);
					let y = yScale(d.value) / 2;
					let z = 0.0;
					return x + " " + y + " " + z;
				});
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

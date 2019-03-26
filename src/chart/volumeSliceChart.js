import * as d3 from "d3";
import component from "../component";

/**
 * Reusable 3D Vertical Volume Slice Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myChart = d3.x3dom.chart.volumeSliceChart();
 *    .dimensions({ x: 40, y: 40, z: 30 })
 *    .imageUrl("assets/scan2.png")
 *    .numberOfSlices(35)
 *    .slicesOverX(7)
 *    .slicesOverY(5);
 *
 * chartHolder.call(myChart);
 */
export default function() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let classed = "d3X3domVolumeSliceChart";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let origin = { x: 0, y: 0, z: 0 };

	/* Other Volume Properties */
	let imageUrl;
	let numberOfSlices;
	let slicesOverX;
	let slicesOverY;
	let volumeStyle = "opacitymap";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias volumeSliceChartVertical
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const x3d = selection.append("x3d")
			.attr("width", width + "px")
			.attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true")
		}

		const scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		const layers = ["axis", "volumeSlice"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", (d) => d);

		selection.each((data) => {

			// Construct Viewpoint Component
			const viewpoint = component.viewpoint()
				.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			const axis = component.crosshair()
				.dimensions(dimensions)
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Volume Slice Component
			const volumeSlice = component.volumeSlice()
				.dimensions(dimensions)
				.imageUrl(imageUrl)
				.numberOfSlices(numberOfSlices)
				.slicesOverX(slicesOverX)
				.slicesOverY(slicesOverY);

			scene.call(viewpoint);

			scene.select(".axis")
				.datum(origin)
				.call(axis);

			scene.select(".volumeSlice")
				.append("transform")
				.attr("translation", (d) => {
					const x = dimensions.x / 2;
					const y = dimensions.y / 2;
					const z = dimensions.z / 2;
					return x + " " + y + " " + z;
				})
				.datum((d) => d)
				.call(volumeSlice);
		});
	};

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _v - X3D canvas width in px.
	 * @returns {*}
	 */
	my.width = function(_v) {
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
	my.height = function(_v) {
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
	 * Image URL Getter / Setter
	 *
	 * @param {string} _v - Image URL path.
	 * @returns {*}
	 */
	my.imageUrl = function(_v) {
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
	my.numberOfSlices = function(_v) {
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
	my.slicesOverX = function(_v) {
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
	my.slicesOverY = function(_v) {
		if (!arguments.length) return slicesOverY;
		slicesOverY = _v;
		return this;
	};

	/**
	 * Volume Style Getter / Setter
	 *
	 * @param {string} _v - Volume render style (either 'mprvolume' or 'opacitymap')
	 * @returns {*}
	 */
	my.volumeStyle = function(_v) {
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
	my.debug = function(_v) {
		if (!arguments.length) return debug;
		debug = _v;
		return my;
	};

	return my;
}

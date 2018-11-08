import * as d3 from "d3";

/**
 * Reusable 3D Bubble Chart
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "orange";
	let classed = "x3dBubbles";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let sizeScale;
	let sizeDomain = [0.5, 4.0];

	/**
	 * Initialise Data and Scales
	 *
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const maxX = d3.max(data.values, function(d) { return +d.x; });
		const maxY = d3.max(data.values, function(d) { return +d.y; });
		const maxZ = d3.max(data.values, function(d) { return +d.z; });
		const maxValue = d3.max(data.values, function(d) { return +d.value; });

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleLinear().domain([0, maxX]).range([0, dimensions.x]) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxY]).range([0, dimensions.y]) :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleLinear().domain([0, maxZ]).range([0, dimensions.z]) :
			zScale;

		sizeScale = (typeof sizeScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range(sizeDomain) :
			sizeScale;
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

			const makeSolid = function(selection, color) {
				selection
					.append("appearance")
					.append("material")
					.attr("diffuseColor", color || "black");
				return selection;
			};

			const bubblesSelect = selection.selectAll(".point")
				.data(function(d) { return d.values; });

			const bubbles = bubblesSelect.enter()
				.append("transform")
				.attr("class", "point")
				.attr("translation", function(d) { return xScale(d.x) + ' ' + yScale(d.y) + ' ' + zScale(d.z); })
				.attr("onmouseover", "d3.select(this).select('billboard').attr('render', true);")
				.attr("onmouseout", "d3.select(this).select('transform').select('billboard').attr('render', false);")
				.merge(bubblesSelect);

			bubbles.append("shape")
				.call(makeSolid, color)
				.append("sphere")
				.attr("radius", function(d) { return sizeScale(d.value); });

			bubbles
				.append("transform")
				.attr('translation', "0.8 0.8 0.8") // FIXME: transation should be proportional to the sphere radius.
				.append("billboard")
				.attr('render', false)
				.attr("axisOfRotation", "0 0 0")
				.append("shape")
				.call(makeSolid, "blue")
				.append("text")
				.attr('class', "labelText")
				.attr('string', function(d) { return d.key; })
				.append("fontstyle")
				.attr("size", 1)
				.attr("family", "SANS")
				.attr("style", "BOLD")
				.attr("justify", "START")
				.attr('render', false);
		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} value - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(value) {
		if (!arguments.length) return dimensions;
		dimensions = value;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.xScale = function(value) {
		if (!arguments.length) return xScale;
		xScale = value;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.yScale = function(value) {
		if (!arguments.length) return yScale;
		yScale = value;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.zScale = function(value) {
		if (!arguments.length) return zScale;
		zScale = value;
		return my;
	};

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Color Scale.
	 * @returns {*}
	 */
	my.sizeScale = function(value) {
		if (!arguments.length) return sizeScale;
		sizeScale = value;
		return my;
	};

	/**
	 * Size Domain Getter / Setter
	 *
	 * @param {number[]} value - Size min and max.
	 * @returns {*}
	 */
	my.sizeDomain = function(value) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = value;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} value - Color 'red' or '#ff0000'.
	 * @returns {*}
	 */
	my.color = function(value) {
		if (!arguments.length) return color;
		color = value;
		return this;
	};

	return my;
}

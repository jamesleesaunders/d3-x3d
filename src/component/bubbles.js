import * as d3 from "d3";

/**
 * Reusable 3D Bubble Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "orange";
	let classed = "x3dBubbles";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let sizeScale;
	let sizeDomain = [0.5, 4.0];

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const maxX = d3.max(data.values, function(d) { return +d.x; });
		const maxY = d3.max(data.values, function(d) { return +d.y; });
		const maxZ = d3.max(data.values, function(d) { return +d.z; });
		const maxValue = d3.max(data.values, function(d) { return +d.value; });
		const extent = [0, maxValue];

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
	 * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_x) {
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
	my.xScale = function(_x) {
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
	my.yScale = function(_x) {
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
	my.zScale = function(_x) {
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
	my.sizeScale = function(_x) {
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
	my.sizeDomain = function(_x) {
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
	my.color = function(_x) {
		if (!arguments.length) return color;
		color = _x;
		return my;
	};

	return my;
}

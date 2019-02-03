import * as d3 from "d3";
// import * as x3dom from "x3dom";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Vector Fields Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = d3.interpolateRdYlGn;
	let classed = "x3dVectorFields";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeDomain = [1, 8];

	/**
	 * Vector Field Function
	 *
	 * @param x
	 * @param y
	 * @param z
	 * @returns {{x: number, y: number, z: number}}
	 */
	let vectorFunction = function(x, y, z) {
		return {
			x: x,
			y: y,
			z: z
		};
	};

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { coordinatesMax, coordinatesMin } = dataTransform(data).summary();
		const { x: minX, y: minY, z: minZ } = coordinatesMin;
		const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		const extent = d3.extent(data.values.map((f) => {
			let vx, vy, vz;
			if ('vx' in f) {
				({ vx, vy, vz } = f);
			} else {
				({ x: vx, y: vy, z: vz } = vectorFunction(f.x, f.y, f.z));
			}

			return new x3dom.fields.SFVec3f(vx, vy, vz).length();
		}));

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain([minX, maxX])
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain([minY, maxY])
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain([minZ, maxZ])
				.range([0, dimensionZ]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleSequential()
				.domain(extent)
				.interpolator(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(extent.reverse())
				.range(sizeDomain);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias vectorFields
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.classed(classed, true);

		selection.each((data) => {
			init(data);

			const vectorData = function(d) {
				return d.values.map((f) => {

					let vx, vy, vz;
					if ('vx' in f) {
						({ vx, vy, vz } = f);
					} else {
						({ x: vx, y: vy, z: vz } = vectorFunction(f.x, f.y, f.z));
					}

					let fromVector = new x3dom.fields.SFVec3f(0, 1, 0);
					let toVector = new x3dom.fields.SFVec3f(vx, vy, vz);
					let qDir = x3dom.fields.Quaternion.rotateFromTo(fromVector, toVector);
					let rot = qDir.toAxisAngle();

					// Calculate transform-translation attr
					f.translation = xScale(f.x) + " " + yScale(f.y) + " " + zScale(f.z);

					// Calculate vector length
					f.value = toVector.length();

					// Calculate transform-rotation attr
					f.rotation = rot[0].x + " " + rot[0].y + " " + rot[0].z + " " + rot[1];

					return f;
				});
			};

			const arrows = selection.selectAll(".arrow")
				.data(vectorData);

			const arrowsEnter = arrows.enter()
				.append("transform")
				.attr("class", "arrow")
				.attr("translation", (d) => d.translation)
				.attr("rotation", (d) => d.rotation)
				.append("transform")
				.attr("translation", (d) => {
					let offset = sizeScale(d.value) / 2;
					return "0 " + offset + " 0";
				});

			let arrowHead = arrowsEnter.append("shape");

			arrowHead.append("appearance")
				.append("material")
				.attr("diffusecolor", (d) => rgb2hex(colorScale(d.value)));

			arrowHead.append("cylinder")
				.attr("height", (d) => sizeScale(d.value))
				.attr("radius", 0.1);

			let arrowShaft = arrowsEnter
				.append("transform")
				.attr("translation", (d) => {
					let offset = sizeScale(d.value) / 2;
					return "0 " + offset + " 0";
				})
				.append("shape");

			arrowShaft.append("appearance")
				.append("material")
				.attr("diffusecolor", (d) => rgb2hex(colorScale(d.value)));

			arrowShaft
				.append("cone")
				.attr("height", 1)
				.attr("bottomradius", 0.4);

			arrowsEnter.merge(arrows);

			arrows.transition()
				.attr("translation", (d) => d.translation);

			arrows.exit()
				.remove();
		});
	};

	/**
	 * RGB Colour to Hex Converter
	 *
	 * @param {string} rgb - RGB colour string.
	 * @returns {string}
	 */
	const rgb2hex = function(rgb) {
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

		return (rgb && rgb.length === 4) ? "#" +
			("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
			("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
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

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Size Domain Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [1, 9]).
	 * @returns {*}
	 */
	my.sizeDomain = function(_v) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _v;
		return my;
	};

	/**
	 * Vector Function Getter / Setter
	 *
	 * @param {string} _v - Vector Function.
	 * @returns {*}
	 */
	my.vectorFunction = function(_v) {
		if (!arguments.length) return vectorFunction;
		vectorFunction = _v;
		return my;
	};

	return my;
}

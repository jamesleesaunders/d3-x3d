import * as d3 from "d3";

/**
 * Reusable 3D Crosshair Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red", "green"];
	let classed = "x3dCrosshair";
	let radius = 0.1;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias crosshair
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.classed(classed, true);

		selection.each((data) => {

			const xOff = dimensions["x"] / 2;
			const yOff = dimensions["y"] / 2;
			const zOff = dimensions["z"] / 2;
			const xVal = xScale(data.x);
			const yVal = yScale(data.y);
			const zVal = zScale(data.z);

			const positionVectors = {
				x: [xOff, yVal, zVal],
				y: [xVal, yOff, zVal],
				z: [xVal, yVal, zOff]
			};

			function getPositionVector(axisDir) {
				return positionVectors[axisDir].join(" ");
			}

			const rotationVectors = {
				x: [1, 1, 0, Math.PI],
				y: [0, 0, 0, 0],
				z: [0, 1, 1, Math.PI]
			};

			function getRotationVector(axisDir) {
				return rotationVectors[axisDir].join(" ");
			}

			const colorScale = d3.scaleOrdinal()
				.domain(Object.keys(dimensions))
				.range(colors);

			// Origin Ball
			const ballSelect = selection.selectAll(".ball")
				.data([data]);

			let ball = ballSelect.enter()
				.append("transform")
				.attr("translation", (d) => (xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z)))
				.classed("ball", true)
				.append("shape");

			ball.append("appearance")
				.append("material")
				.attr("diffusecolor", "blue");

			ball.append("sphere")
				.attr("radius", 0.3);

			ball.merge(ballSelect);

			ballSelect.transition()
				.ease(d3.easeQuadOut)
				.attr("translation", (d) => (xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z)));

			// Crosshair Lines
			const lineSelect = selection.selectAll(".line")
				.data(Object.keys(dimensions));

			const line = lineSelect.enter()
				.append("transform")
				.classed("line", true)
				.attr("translation", (d) => getPositionVector(d))
				.attr("rotation", (d) => getRotationVector(d))
				.append("shape");

			line.append("cylinder")
				.attr("radius", radius)
				.attr("height", (d) => dimensions[d]);

			line.append("appearance")
				.append("material")
				.attr("diffusecolor", (d) => colorScale(d));

			line.merge(lineSelect);

			lineSelect.transition()
				.ease(d3.easeQuadOut)
				.attr("translation", (d) => getPositionVector(d));
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

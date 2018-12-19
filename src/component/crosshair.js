// import * as d3 from "d3";

/**
 * Random Number Generator between 1 and 10
 *
 * @returns {number}
 */
function randomNum() {
	return Math.floor(Math.random() * 10) + 1;
}

/**
 * Reusable 3D Crosshair Component
 *
 * @module
 */
function crosshair() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red", "green"];
	let radius = 0.1;
	let classed = "x3dCrosshair";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 */
	function init() {
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;
		const extent = [0, 10];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain(extent)
				.rangeRound([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(extent)
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain(extent)
				.range([0, dimensionZ]);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias crosshair
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		init();
		selection.classed(classed, true);

		let data = [
			{ color: "blue", direction: "x" },
			{ color: "red", direction: "y" },
			{ color: "green", direction: "z" }
		];

		let xVal = xScale(randomNum());
		let yVal = yScale(randomNum());
		let zVal = zScale(randomNum());

		const axisDirectionVectors = {
			x: [20, yVal, zVal],
			y: [xVal, 20, zVal],
			z: [xVal, yVal, 20]
		};

		const axisRotationVectors = {
			x: [1, 1, 0, Math.PI],
			y: [0, 0, 0, 0],
			z: [0, 1, 1, Math.PI]
		};

		function getAxisDirectionVector(axisDir) {
			return axisDirectionVectors[axisDir];
		}

		function getAxisRotationVector(axisDir) {
			return axisRotationVectors[axisDir];
		}

		data.forEach((d) => {
				let shape = selection
					.append("transform")
					.attr("translation", getAxisDirectionVector(d.direction).join(" "))
					.attr("rotation", getAxisRotationVector(d.direction).join(" "))
					.append("shape")
					.attr("class", "tickLine");

				shape.append("cylinder")
					.attr("radius", radius)
					.attr("height", dimensions[d.direction]);

				shape
					.append("appearance")
					.append("material")
					.attr("diffuseColor", d.color);
			}
		);
	}

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

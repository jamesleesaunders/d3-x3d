import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable 3D Surface Area
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red"];
	let classed = "x3dSurface";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	function array2dToString(arr) {
		return arr.reduce(function(a, b) { return a.concat(b); }, [])
			.reduce(function(a, b) { return a.concat(b); }, [])
			.join(' ');
	}

	let coordinatePoints = function(data) {
		let points = data.map(function(X) {
			return X.map(function(d) {
				return [xScale(d.x), yScale(d.y), zScale(d.z)];
			})
		});

		return array2dToString(points);
	};

	let colorFaceSet = function(data) {
		let colors = data.map(function(X) {
			return X.map(function(d) {
				let col = d3.color(colorScale(d.y));
				return '' + Math.round(col.r / 2.55) / 100 + ' ' + Math.round(col.g / 2.55) / 100 + ' ' + Math.round(col.b / 2.55) / 100;
			})
		});

		return array2dToString(colors);
	};

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
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
			d3.scaleLinear().domain([0, maxX]).range([0, dimensions.x]).nice() :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxY]).range([0, dimensions.y]).nice() :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleLinear().domain([0, maxZ]).range([0, dimensions.z]).nice() :
			zScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			let ny = data.length;
			let nx = data[0].length;

			let coordIndex = Array.apply(0, Array(ny - 1)).map(function(_, j) {
				return Array.apply(0, Array(nx - 1)).map(function(_, i) {
					let start = i + j * nx;
					return [start, start + nx, start + nx + 1, start + 1, start, -1];
				});
			});

			let coordIndexBack = Array.apply(0, Array(ny - 1)).map(function(_, j) {
				return Array.apply(0, Array(nx - 1)).map(function(_, i) {
					let start = i + j * nx;
					return [start, start + 1, start + nx + 1, start + nx, start, -1];
				});
			});

			let coords = array2dToString(coordIndex.concat(coordIndexBack));

			let surfaces = selection.selectAll('.surface')
				.data([data]);

			surfaces
				.enter()
				.append('shape')
				.append('indexedfaceset')
				.attr('coordIndex', coords)
				.append("coordinate")
				.attr('point', coordinatePoints);

			d3.selectAll('indexedFaceSet')
				.append('color')
				.attr('color', colorFaceSet);
		});
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.dimensions = function(_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
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

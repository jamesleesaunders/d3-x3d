import { line as shapeLine, curveBasis } from "d3-shape";
import { range as arrayRange } from "d3-array";
import { interpolateBasis } from "d3-interpolate";

/**
 * Curve Polator
 *
 * @param points
 * @param curveFunction
 * @param epsilon
 * @param samples
 * @returns {Function}
 */
function curvePolator(points, curveFunction, epsilon, samples) { // eslint-disable-line max-params
	const path = shapeLine().curve(curveFunction)(points);

	return svgPathInterpolator(path, epsilon, samples);
}

/**
 * SVG Path Interpolator
 *
 * @param path
 * @param epsilon
 * @param samples
 * @returns {Function}
 */
function svgPathInterpolator(path, epsilon, samples) {
	// Create detached SVG path
	path = path || "M0,0L1,1";

	const area = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	area.innerHTML = "<path></path>";
	const svgpath = area.querySelector("path");
	svgpath.setAttribute("d", path);

	// Calculate lengths and max points
	const totalLength = svgpath.getTotalLength();
	const minPoint = svgpath.getPointAtLength(0);
	const maxPoint = svgpath.getPointAtLength(totalLength);
	let reverse = maxPoint.x < minPoint.x;
	const range = reverse ? [maxPoint, minPoint] : [minPoint, maxPoint];
	reverse = reverse ? -1 : 1;

	// Return function
	return function(x) {
		// Check for 0 and null/undefined
		const targetX = x === 0 ? 0 : x || minPoint.x;
		// Clamp
		if (targetX < range[0].x) return range[0];
		if (targetX > range[1].x) return range[1];

		function estimateLength(l, mn, mx) {
			let delta = svgpath.getPointAtLength(l).x - targetX;
			let nextDelta = 0;
			let iter = 0;

			while (Math.abs(delta) > epsilon && iter < samples) {
				if (iter > samples) return false;
				iter++;

				if (reverse * delta < 0) {
					mn = l;
					l = (l + mx) / 2;
				} else {
					mx = l;
					l = (mn + l) / 2;
				}
				nextDelta = svgpath.getPointAtLength(l).x - targetX;

				delta = nextDelta;
			}

			return l;
		}

		const estimatedLength = estimateLength(totalLength / 2, 0, totalLength);

		return svgpath.getPointAtLength(estimatedLength).y;
	}
}

/**
 * Interpolate From Curve
 *
 * @param values
 * @param curveFunction
 * @param epsilon
 * @param samples
 * @returns {Function}
 */
export default function(values, curveFunction, epsilon = 0.00001, samples = 100) { // eslint-disable-line max-params
	const length = values.length;
	const xrange = arrayRange(length).map(function(d, i) { return i * (1 / (length - 1)); });
	const points = values.map((v, i) => [xrange[i], v]);

	// If curveFunction is curveBasis then reach straight for D3's native 'interpolateBasis' function (it's faster!)
	if (curveFunction === curveBasis) {
		return interpolateBasis(values);
	} else {
		return curvePolator(points, curveFunction, epsilon, samples);
	}
}

import * as d3 from "d3";
import { default as prototypes } from "./prototypes/prototypes.json" assert { type: 'json' };

let { torus } = prototypes;

/**
 * Construct base X3D element
 *
 * @module
 */
function buildX3d(selection, width, height, debug) {
	// Create X3D element (if it does not exist already)
	// See: https://www.web3d.org/x3d/profiles
	let x3d = selection.selectAll("X3D")
		.data([0])
		.enter()
		.append("X3D")
		.attr("profile", "Interactive")
		.attr("width", width + "px")
		.attr("height", height + "px")
		.attr("showLog", debug ? "true" : "false")
		.attr("showStat", debug ? "true" : "false")
		.attr("useGeoCache", false);

	x3d.append("head")
		.append("component")
		.attr("name", "Text")
		.attr("level", "1");

	return x3d;
}

/**
 * Construct base Scene elements
 *
 * @module
 */
function buildScene(x3d, layers, classed) {
	// Create Scene
	let scene = x3d.selectAll("Scene")
		.data([0])
		.enter()
		.append("Scene");

	if (typeof x3dom !== "undefined") {
		// Gamma correction only works on X3DOM.
		scene.append("Environment")
			.attr("gammaCorrectionDefault", "none");
	} else {
		// X_ITE does not support the Torus shape - load prototype Torus.
		let proto = scene.append("ExternProtoDeclare")
			.attr("name", "Torus")
			.attr("url", `"${torus}"`);

		proto.append("field")
			.attr("accessType", "inputOutput")
			.attr("type", "SFFloat")
			.attr("name", "angle")
			.attr("value", "6.28318530718");

		proto.append("field")
			.attr("accessType", "inputOutput")
			.attr("type", "SFFloat")
			.attr("name", "innerRadius")
			.attr("value", "0.5");

		proto.append("field")
			.attr("accessType", "inputOutput")
			.attr("type", "SFFloat")
			.attr("name", "outerRadius")
			.attr("value", "1.0");

		proto.append("field")
			.attr("accessType", "inputOutput")
			.attr("type", "SFVec2f")
			.attr("name", "subdivision")
			.attr("value", "24,24");

		proto.append("field")
			.attr("accessType", "initializeOnly")
			.attr("type", "SFBool")
			.attr("name", "caps")
			.attr("value", "true");

		proto.append("field")
			.attr("accessType", "initializeOnly")
			.attr("type", "SFBool")
			.attr("name", "solid")
			.attr("value", "true");
	}

	// Add a white background
	scene.append("Background")
		.attr("groundColor", "1 1 1")
		.attr("skyColor", "1 1 1");

	// Add layer groups
	scene.classed(classed, true)
		.selectAll("Group")
		.data(layers)
		.enter()
		.append("Group")
		.attr("class", (d) => d);

	return scene;
}

/**
 * Reusable X3D Base and Scene Component
 *
 * @module
 */
export function createScene(selection, layers, classed, width, height, debug) {
	let x3d = buildX3d(selection, width, height, debug);
	let scene = buildScene(x3d, layers, classed);
	// For some reason we need to re-select the scene after building it to allow for charts to refresh.
	// Example: /examples/X3DOM/chart/BarChartMultiSeries.html adding additional series to chart does not
	// refresh without the line below.
	scene = selection.select("Scene");
	return scene;
}

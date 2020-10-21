/**
 * Reusable X3D Base and Scene Component
 *
 * @module
 */
export default function() {

	const createBase = (selection, layers, classed, width, height, debug) => {

		// Create x3d element (if it does not exist already)
		let x3d = selection.selectAll("X3D")
			.data([0]);

		let x3dEnter = x3d.enter()
			.append("X3D")
			.attr("width", width + "px")
			.attr("height", height + "px")
			.attr("showLog", debug ? "true" : "false")
			.attr("showStat", debug ? "true" : "false")
			.attr("useGeoCache", false);

		let scene = x3dEnter.append("Scene");

		// Disable gamma correction
		scene.append("Environment")
			.attr("gammaCorrectionDefault", "none");

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

		x3dEnter.merge(x3d);

		return selection.select("Scene");
	};

	return createBase;
}


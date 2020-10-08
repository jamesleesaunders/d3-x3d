import * as d3 from "d3";

/**
 * Reusable X3D Base and Scene Component
 *
 * @module
 */
export default function() {

  const createBase = (selection, layers) => {
	  // Create x3d element (if it does not exist already)
		if (!x3d) {
	  	x3d = selection.append("X3D");
	  	scene = x3d.append("Scene");
	  	x3d.attr("width", width + "px")
	  		.attr("height", height + "px")
	  		.attr("showLog", debug ? "true" : "false")
	  		.attr("showStat", debug ? "true" : "false")
	  		.attr("useGeoCache", false);
	  	// Disable gamma correction
	  	scene.append("Environment")
	  		.attr("gammaCorrectionDefault", "none");
	  	// Add a white background
	  	scene.append("Background")
	  		.attr("groundColor", "1 1 1")
	  		.attr("skyColor", "1 1 1");
	  }
	  // Add layer groups
	  scene.classed(classed, true)
	  	.selectAll("Group")
	  	.data(layers)
	  	.enter()
	  	.append("Group")
      .attr("class", (d) => d);
  	}

		return {
      createBase,
		}
}


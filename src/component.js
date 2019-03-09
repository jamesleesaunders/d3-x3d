import componentAxis from "./component/axis";
import componentAxisThreePlane from "./component/axisThreePlane";
import componentBars from "./component/bars";
import componentBarsMultiSeries from "./component/barsMultiSeries";
import componentBubbles from "./component/bubbles";
import componentBubblesMultiSeries from "./component/bubblesMultiSeries";
import componentCrosshair from "./component/crosshair";
import componentLabel from "./component/label";
import componentRibbon from "./component/ribbon";
import componentRibbonMultiSeries from "./component/ribbonMultiSeries";
import componentSurface from "./component/surface";
import componentVectorFields from "./component/vectorFields";
import componentViewpoint from "./component/viewpoint";
import componentVolumeSlice from "./component/volumeSlice";

export default {
	axis: componentAxis,
	axisThreePlane: componentAxisThreePlane,
	bars: componentBars,
	barsMultiSeries: componentBarsMultiSeries,
	bubbles: componentBubbles,
	bubblesMultiSeries: componentBubblesMultiSeries,
	crosshair: componentCrosshair,
	label: componentLabel,
	ribbon: componentRibbon,
	ribbonMultiSeries: componentRibbonMultiSeries,
	surface: componentSurface,
	vectorFields: componentVectorFields,
	viewpoint: componentViewpoint,
	volumeSlice: componentVolumeSlice
};

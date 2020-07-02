# d3-x3d

## 3D Data Driven Charting Library with D3 and X3D

[![npm version](https://badge.fury.io/js/d3-x3d.svg)](https://badge.fury.io/js/d3-x3d)
[![Build Status](https://travis-ci.org/jamesleesaunders/d3-x3d.svg?branch=master)](https://travis-ci.org/jamesleesaunders/d3-x3d)

<a href="https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/logos/d3-x3d-logo-x3dom.html">
   <img src="https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/logos/d3-x3d-logo.png" align="left" width="150px" hspace="10" vspace="6">
</a>

Combining the power of the [D3.js](http://www.d3js.org/) data-driven documents visualisation library and the Extensible 3D [X3D](https://www.web3d.org/x3d/what-x3d) 3D graphics standard, d3-x3d makes it simple to produce beautiful 3D data visualisations with minimal code.

Inspired by Mike Bostock's [reusable charts](http://bost.ocks.org/mike/chart/), d3-x3d is built on a foundation of building blocks, called components, which can be combined to create a variety of different data visualisations.

* [Examples](#examples)
* [Getting Started](#getting-started)
* [API Reference](https://jamesleesaunders.github.io/d3-x3d/)
* [Components and Charts](#components-and-charts)
* [Data Structures](#data-structures)
* [Download from GitHub](https://github.com/jamesleesaunders/d3-x3d)
* [Download from NPM](https://www.npmjs.com/package/d3-x3d)

The aspiration for the X3D specification is for it to become the de facto HTML5 standard for 3D graphics in the browser, in a similar manner to that of SVG (Scalable Vector Graphics).
The aim is that one day X3D will be integrated as standard into all browsers, without the need for additional plugins. For the time being, there are two JavaScript based players for X3D:

* [X3DOM](https://www.x3dom.org/)
* [X_ITE](http://create3000.de/x_ite/)

Both these players are compatible with modern browsers supporting HTML5 and enable X3D scenes to be embedded in any HTML page. d3-x3d has been tested to work with both X3DOM and X_ITE (there are a couple of more advanced features and charts which currently only work with X3DOM).

### <a name="examples"></a>Examples

| Example                | X3DOM                                                                                                           | X_ITE                                                                                                           | Observable                                                                              |
|------------------------|-----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Area Chart             | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/AreaChartMultiSeries.html)   | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/AreaChartMultiSeries.html)   | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-area-chart)         |
| Multi Series Bar Chart | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/BarChartMultiSeries.html)    | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/BarChartMultiSeries.html)    | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-bar-charts)         |
| Vertical Bar Chart     | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/BarChartVertical.html)       | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/BarChartVertical.html)       | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-bar-charts)         |
| Bubble Chart           | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/BubbleChart.html)            | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/BubbleChart.html)            | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-bubbles)            |
| Scatter Plot           | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/ScatterPlot.html)            | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/ScatterPlot.html)            | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-bubbles)            |
| Surface Plot           | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/SurfacePlot.html)            | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/SurfacePlot.html)            | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-surface-plot)       |
| Ribbon Chart           | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/RibbonChartMultiSeries.html) | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/RibbonChartMultiSeries.html) | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-ribbon-chart)       |
| Vector Field Chart     | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/VectorFieldChart.html)       | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X_ITE/chart/VectorFieldChart.html)       | [View](https://observablehq.com/@jamesleesaunders/d3-x3d-components-vector-field-chart) |
| Volume Slice           | [View](https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/X3DOM/chart/VolumeSliceChart.html)       | WIP                                                                                                             | WIP                                                                                     |

### <a name="getting-started"></a>Getting Started

#### TL;DR

You can find an example in `examples/index.html`, which shows you an example of
the text below.


#### Will read it

Include the following JavaScript and CSS files in the `<head>` section of your page:

If using X3DOM:
```html
<head>
   <script src="https://d3js.org/d3.v5.min.js"></script>
   <script src="https://x3dom.org/release/x3dom.js"></script>
   <link rel="stylesheet" href="https://x3dom.org/release/x3dom.css" />
   <script src="https://raw.githack.com/jamesleesaunders/d3-x3d/master/dist/d3-x3d.js"></script>
</head>
```

If using X_ITE:
```html
<head>
   <script src="https://d3js.org/d3.v5.min.js"></script>
   <script src="https://code.create3000.de/x_ite/latest/dist/x_ite.min.js"></script>
   <script src="https://raw.githack.com/andreasplesch/x_ite_dom/master/latest/x_ite_dom.js"></script>
   <link rel="stylesheet" href="https://code.create3000.de/x_ite/latest/dist/x_ite.css" />
   <script src="https://raw.githack.com/jamesleesaunders/d3-x3d/master/dist/d3-x3d.js"></script>
</head>
```

Add the following chartholder `<div>` (or `<X3DCanvas>`) and `<script>` tags to your page `<body>`:

If using X3DOM:
```html
<body>
   <div id="chartholder"></div>
   <script></script>
</body>
```

If using X_ITE:
```html
<body>
   <X3DCanvas id="chartholder"></X3DCanvas>
   <script></script>
</body>
```

Place the following code between the `<script></script>` tags:
```javascript
// Select chartholder
var chartHolder = d3.select("#chartholder");

// Generate some data
var myData = [
	{
		key: "UK",
		values: [
			{ key: "Apples", value: 9 },
			{ key: "Oranges", value: 3 },
			{ key: "Pears", value: 5 },
			{ key: "Bananas", value: 7 }
		]
	},
	{
		key: "France",
		values: [
			{ key: "Apples", value: 5 },
			{ key: "Oranges", value: 4 },
			{ key: "Pears", value: 6 },
			{ key: "Bananas", value: 2 }
		]
	}
];

// Declare the chart component
var myChart = d3.x3d.chart.barChartMultiSeries();

// Attach chart and data to the chartholder
chartHolder
	.datum(myData)
	.call(myChart);
```

That's all there is to it! View the page in your browser and you should see a basic 3D bar chart:

<img src="https://raw.githack.com/jamesleesaunders/d3-x3d/master/examples/assets/BarChartMultiSeries.png" width="400px">

#### Install from NPM

If your project is using ES6 modules you can also import d3-x3d, for example [from NPM](https://www.npmjs.com/package/d3-x3d):

```bash
npm install --save d3-x3d
```

Then in your project:

```javascript
let d3X3d = require("d3-x3d");
```

### <a name="components-and-charts"></a>Components and Charts

d3-x3d has two types of reusable module: `component` and `chart`. For more information see the [API Reference](https://jamesleesaunders.github.io/d3-x3d/).

#### Components

The `component` modules are lower level building blocks which can be used independently, or combined to build higher level `chart` modules.
For example, combining `component.bars()`, `component.axis()` and `component.viewpoint()` modules together we have built the `chart.barChartMultiSeries()`.
Component modules do not generate a `<X3D>` tag, these should be attached to an exiting `<X3D>` tag.

| Function                       | Description                         | Documentation                                                             |
|--------------------------------|-------------------------------------|---------------------------------------------------------------------------|
| component.area()               | Single series Area Chart            | [View](https://jamesleesaunders.github.io/d3-x3d/area.html)               |
| component.areaMultiSeries()    | Multi series Area Chart             | [View](https://jamesleesaunders.github.io/d3-x3d/areaMultiSeries.html)    |
| component.axis()               | Single plane x/y Axis               | [View](https://jamesleesaunders.github.io/d3-x3d/axis.html)               |
| component.axisThreePlane()     | Three plane x/y/z Axis              | [View](https://jamesleesaunders.github.io/d3-x3d/axisThreePlane.html)     |
| component.bars()               | Single series Bar Chart             | [View](https://jamesleesaunders.github.io/d3-x3d/bars.html)               |
| component.barsMultiSeries()    | Multi series Bar Chart              | [View](https://jamesleesaunders.github.io/d3-x3d/barsMultiSeries.html)    |
| component.bubbles()            | Bubble / Scatter Plot               | [View](https://jamesleesaunders.github.io/d3-x3d/bubbles.html)            |
| component.bubblesMultiSeries() | Multi series Bubbles / Scatter Plot | [View](https://jamesleesaunders.github.io/d3-x3d/bubblesMultiSeries.html) |
| component.crosshair()          | Crosshair                           | [View](https://jamesleesaunders.github.io/d3-x3d/crosshair.html)          |
| component.ribbon()             | Ribbon Chart / Line Chart           | [View](https://jamesleesaunders.github.io/d3-x3d/ribbon.html)             |
| component.ribbonMultiSeries()  | Multi series Ribbon Chart           | [View](https://jamesleesaunders.github.io/d3-x3d/ribbonMultiSeries.html)  |
| component.surface()            | Surface Area                        | [View](https://jamesleesaunders.github.io/d3-x3d/surface.html)            |
| component.vectorFields()       | Vector Field Chart                  | [View](https://jamesleesaunders.github.io/d3-x3d/vectorFields.html)       |
| component.viewpoint()          | Camera position                     | [View](https://jamesleesaunders.github.io/d3-x3d/viewpoint.html)          |
| component.volumeSlice()        | Volume Slice (MRI Scan)             | [View](https://jamesleesaunders.github.io/d3-x3d/volumeSlice.html)        |

#### Charts

The `chart` modules are higher level, pre-combined components, making it even easier to quickly create charts.
All the chart modules are typically constructed from viewpoint, axis and one or more of the other components above.
Chart modules also generate the `<X3D>` tag, these should be attached to a regular HTML `<div>` tag.

| Function                       | Description                    | Documentation                                                                 |
|--------------------------------|--------------------------------|-------------------------------------------------------------------------------|
| chart.areaChartMultiSeries()   | Multi series Area Chart & Axis | [View](https://jamesleesaunders.github.io/d3-x3d/areaChartMultiSeries.html)   |
| chart.barChartMultiSeries()    | Multi series Bar Chart & Axis  | [View](https://jamesleesaunders.github.io/d3-x3d/barChartMultiSeries.html)    |
| chart.barChartVertical()       | Vertical Bar Chart & Axis      | [View](https://jamesleesaunders.github.io/d3-x3d/barChartVertical.html)       |
| chart.bubbleChart()            | Bubble Chart & Axis            | [View](https://jamesleesaunders.github.io/d3-x3d/bubbleChart.html)            |
| chart.ribbonChartMultiSeries() | Multi series Ribbon Chart      | [View](https://jamesleesaunders.github.io/d3-x3d/ribbonChartMultiSeries.html) |
| chart.scatterPlot()            | Scatter Plot & Axis            | [View](https://jamesleesaunders.github.io/d3-x3d/scatterPlot.html)            |
| chart.surfacePlot()            | Surface Plot & Axis            | [View](https://jamesleesaunders.github.io/d3-x3d/surfacePlot.html)            |
| chart.vectorFieldChart()       | Vector Field Chart             | [View](https://jamesleesaunders.github.io/d3-x3d/vectorFieldChart.html)       |
| chart.volumeSliceChart()       | Volume Slice Chart             | [View](https://jamesleesaunders.github.io/d3-x3d/volumeSliceChart.html)       |

### <a name="data-structures"></a>Data Structures

At its most basic description, the format of the d3-x3d data is a series of key / value pairs. Depending on whether the chart is a single series or multi series chart the data structure differ slightly.

#### Single Series Data

Used by charts such as a single series bar chart, the data structure is an object with the following structure:
* `key` {string} - The series name
* `values` {array} - An array of objects containing:
  * `key` {string} - The value name
  * `value` {number} - The value
  * `x` {number} - X axis value\*
  * `y` {number} - Y axis value\*
  * `z` {number} - Z axis value\*

_\*optional, `x`, `y` & `z` values are used for cartesian coordinate type graphs such as the scatter plot._

```javascript
var myData = {
	key: "UK",
	values: [
		{ key: "Apples", value: 9, x: 1, y: 2, z: 5 },
		/* ... */
		{ key: "Bananas", value: 7, x: 6, y: 3, z: 8 }
	]
};
```

#### Multi Series Data

Used by charts such as the multi series scatter plot or area chart, the multi series data structure is simply an array of the single series data objects above.

```javascript
var myData = [
	{
		key: "UK",
		values: [
			{ key: "Apples", value: 2 },
			/* ... */
			{ key: "Bananas", value: 3 }
		]
	},
	/* ... */
	{
		key: "France",
		values: [
			{ key: "Apples", value: 5 },
			/* ... */
			{ key: "Bananas", value: 9 }
		]
	}
];
```

### Credits

* Fabian Dubois - For the original [3D Axis](http://bl.ocks.org/fabid/61cbfe14de686cc25c47/), [Surface Area](https://github.com/fabid/d3-x3dom-shape) and [Scatter Plot](http://bl.ocks.org/fabid/acb5dc4961ffa741b52b).
* David Sankel - For the original [Bar Chart](http://bl.ocks.org/camio/5087116).
* Victor Glindås - Various contributions to JSDoc and ES6 standardisation.
* Jefferson Hudson - For contributions to axis labels and transitions.
* Andreas Plesch - For contributing the Area Chart and Components (and generally being an x3dom hero!).
* Also see alternative [d3-3d](https://github.com/Niekes/d3-3d) by @Niekes.

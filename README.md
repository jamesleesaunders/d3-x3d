# d3-x3d
## D3 X3DOM Data Visualisation Library

[![npm version](https://badge.fury.io/js/d3-x3d.svg)](https://badge.fury.io/js/d3-x3d)
[![Build Status](https://travis-ci.org/jamesleesaunders/d3-x3d.svg?branch=master)](https://travis-ci.org/jamesleesaunders/d3-x3d)
[![Known Vulnerabilities](https://snyk.io/test/github/jamesleesaunders/d3-x3d/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jamesleesaunders/d3-x3d?targetFile=package.json)

Combining the power the [D3.js](http://www.d3js.org/) data-driven documents visualisation library and the [X3DOM](https://github.com/x3dom/x3dom) declarative 3D DOM framework, **d3-x3d** makes it easy to quickly produce beautiful 3D data visualisations with minimal code.

Inspired by Mike Bostock's [reusable charts](http://bost.ocks.org/mike/chart/), **d3-x3d** is built on a foundation of building blocks, called components, which can be combined to create a variety of different data visualisations.

### Examples

* [Bar Chart](https://rawgit.com/jamesleesaunders/d3-x3d/master/examples/BarChart.html)
* [Scatter Plot](https://rawgit.com/jamesleesaunders/d3-x3d/master/examples/ScatterPlot.html)
* [Surface Area](https://rawgit.com/jamesleesaunders/d3-x3d/master/examples/SurfaceArea.html)
* [Components Showcase](https://rawgit.com/jamesleesaunders/d3-x3d/master/examples/Components.html)

### Getting Started

Include D3.js, X3DOM and d3-x3d js and css files in the `<head>` section of your page:

```html
<head>
   <script src="https://d3js.org/d3.v5.min.js"></script>   
   <script src="https://x3dom.org/download/dev/x3dom-full.js"></script>
   <link rel="stylesheet" href="https://x3dom.org/download/dev/x3dom.css" />
   <script src="d3-x3d.js"></script>
</head>
```

Add a chartholder `<div>` and `<script>` tags to your page `<body>`:

```html
<body>
   <div id="chartholder"></div>
   <script></script>
</body>
```

Place the following code between the `<script>` tags of your page:

Attach `x3d` and `scene` to the chartholder div:

```javascript
var x3d = d3.select("#chartholder")
	.append("x3d")
	.attr("width", "500px")
	.attr("height", "500px");

var scene = x3d.append("scene");
```

Generate some [data](#data-structure):

```javascript
var myData = [
	{
		key: "UK",
		values: [
			{ key: "Apples", value: 9 },
			{ key: "Oranges", value: 3 },
			{ key: "Grapes", value: 5 },
			{ key: "Bananas", value: 7 }
		]
	},
	{
		key: "France",
		values: [
			{ key: "Apples", value: 5 },
			{ key: "Oranges", value: 4 },
			{ key: "Grapes", value: 6 },
			{ key: "Bananas", value: 2 }
		]
	}
];
```

Declare the [chart component](#components-and-charts):

```javascript
var myChart = d3.x3d.chart.barChart();
```

Attach data and chart to scene:

```javascript
scene.datum(myData).call(myChart);
```

### Components and Charts

**d3-x3d** has two types of components: `chart` and `component`.

The `component` modules are lower level building blocks which can be used independently or combined to build more advanced charts. For example combining the `bubbles()` and `axis()` components together we create the `scatterPlot()` chart:

| Function                        | Description                     |
| ------------------------------- | ------------------------------- |
| d3.x3d.component.axis()         | Single plane x/y Axis           |
| d3.x3d.component.axisMulti()    | Multi plane x/y/z Axis          |
| d3.x3d.component.bars()         | Single series Bar Chart         |
| d3.x3d.component.barsMulti()    | Multi Series Bar Chart          |
| d3.x3d.component.bubbles()      | Bubble / Scatter Plot           |
| d3.x3d.component.bubblesMulti() | Multi Series Bubbles / Scatter  |
| d3.x3d.component.surface()      | Surface Area                    |
| d3.x3d.component.viewpoint()    | Viewpoint camera                |

The `chart` modules are higher level, pre-combined components, making it even simpler to quickly create charts. All the charts typically include an axis and one or more of the other components above.

| Function                        | Description                     |
| ------------------------------- | ------------------------------- |
| d3.x3d.chart.barChart()         | Bar Chart & Axis                |
| d3.x3d.chart.scatterPlot()      | Scatter Plot & Axis             |
| d3.x3d.chart.surfaceArea()      | Surface Area & Axis             |

### Data Structures

At its most basic description, the format of the d3-x3d data is a series of key / value pairs. Depending on whether the chart is a single series or multi series chart the data structure differs slightly.

#### Single Series Data
Used by charts such as a single series bar chart, the data structure is an object with the following structure:
* `key` {string} - The series name.
* `values` {array} - An array of objects containing:
  * `key` {string} - The value name.
  * `value` {number} - The value.
  * `x` {number} - \*X axis value.
  * `y` {number} - \*Y axis value.
  * `z` {number} - \*Z axis value.
	
_\*optional, `x`, `y` & `z` values are used for cartesian coordinate graphs such as scatter plot._

```javascript
var myData = {
	key: "Fruit",
	values: [
		{ key: "Apples", value: 9, x: 1, y: 2, z: 5 },
		// ...
		{ key: "Oranges", value: 7, x: 6, y: 3, z: 8 }
	]
};
```

#### Multi Series Data 
Used for charts such as the multi series scatter plot, the data structure is simply an array the single series objects described above.

```javascript
var myData = [
	{
		key: "UK",
		values: [
			{ key: "Apples", value: 9 },
			// ...
			{ key: "Oranges", value: 7 }
		]
	},
	// ...
	{
		key: "France",
		values: [
			{ key: "Apples", value: 5 },
			// ...
			{ key: "Oranges", value: 2 }
		]
	}
];
```

### Credits

* Fabian Dubois - For the original [3D Axis](http://bl.ocks.org/fabid/61cbfe14de686cc25c47/), [Surface Area](https://github.com/fabid/d3-x3dom-shape) and [Scatter Plot](http://bl.ocks.org/fabid/acb5dc4961ffa741b52b).
* David Sankel - For the original [Bar Chart](http://bl.ocks.org/camio/5087116).

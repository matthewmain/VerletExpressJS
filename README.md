# VerletExpressJS

VerletExpressJS is a lightweight physics engine for 2D or 3D environments. Based on [Verlet Integration](https://en.wikipedia.org/wiki/Verlet_integration) physics logic, the library can be used to create structures or particles that are subject to physical parameters, such as velocity, gravity, and collisions.

<br>
<br>


## Adding VerletExpressJS To Your Project

To use VerletExpressJS, you'll first need to add the [VerletExpressJS library](https://github.com/matthewmain/VerletExpressJS/blob/master/verletExpress.js) to your project and reference the source in your html.

```
<script src="js/verletExpress.js"></script>
```

Or, you can reference the CDN directly.

```
<script src="https://cdn.jsdelivr.net/gh/matthewmain/VerletExpress@latest/verletExpress.js"></script>
```

<br>

## 2D

### Initialization

To establish a 2D physics environment, use `VX.initialize()` with five arguments: **1) dimensions** ("2d"), **2) medium** (either "canvas" or "svg", **3) target element id** (whatever id name you've given your target element), **4) interface width** (however many units wide you want your interface to be), and **5) interface height** (however many units tall you want your interface to be).

For example, to initialize a 2D physics environment of 1000 units by 1000 units in an established canvas element with an id of "physics-interface", use the following: 

```
VX.initialize( "2d", "canvas", "physics-interface", "1000", "1000" );
```

<br>

### Points

Y values correspond to canvas or SVG positions, so they _increase_ downwards.

### Spans

### Skins

pointsArray can be an array of point objects or point ids
stylesObject: {fillColor: <string>, outlineColor: <string>, outlineThickness: <string>}

<br>


## Settings

### Gravity...

<br>



## Options

runOnFrameRefresh()

<br>



## 3D

Unlike 2D, needs to run alongside WebGL or a 3D engine like Three.js...
Y values correspnd to 3D axis, so they _decrease_ downwards.











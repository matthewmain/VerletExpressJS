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
<br>


### Initialization

To establish a 2D physics environment, use `VX.initialize()` with five arguments: 

1. _dimensions_ (string). In this case, "2d".
2. _medium_ (string). Either "canvas" or "svg".
3. _target element id_ (string). Whatever id name you've given your target element.
4. _interface width_ (integer). However many units wide you want your interface to be.
5. _interface height_ (integer). However many units tall you want your interface to be.

For example, to initialize a 2D physics environment of 1000 units by 1000 units in an established canvas element with an id of "physics-interface", use the following: 

```
VX.initialize( "2d", "canvas", "physics-interface", "1000", "1000" );
```

To establish a 3D physics enviroment, use `VX.initialize()` with just one argument, "3d". To display a three-dimensional scene, you will need to first build it using WebGL or a library such as [ThreeJS](https://threejs.org/).

```
VX.initialize( "3d" );
```

<br>


### Points

Points are the fundamental units of a VerletExpressJS physical object. They can be used as individual particles, or they can be connected to form joints between larger structures. 

To create a new point and add it to the physics environment, use `addPoint()` with the following one or two arguments:

1. _coordinates_ (object: { x: \<number\>, y: \<number\> [, z: \<number\> ] }). The 2d or 3d coordinates where the point's center will first exist. 
2. optional: _materiality_ (string: "material" or "immaterial"). Whether a point is "material" and collides with walls or potentially other points, or "immaterial" and passes through walls and other points. Default is "material".

For example:
  
```
var point1 = VX.addPoint( { x: 480, y: 10 } );
```
  
**_Note: 2d y values correspond to canvas or SVG positions, so they_ increase _downwards. 3d y values Y values correspnd to a 3D axis, so they_ decrease _downwards._**

A point can be further configured by updating its `.mass` (defaults as 1 unit), `.width` (defaults as 0 units), or `.fixed` (whether a point is subject to physics and moveable or remains fixed at its current coordinates, defaults as false). 

<br>


### Spans

Spans join points at a distance which may expand or contract depending on the forces of physics applied to each point.

To create a new span and add it to the physics environment, use `addSpan()` with two arguments:

1. _first point_ (point object or point id as integer). The first point that the span will connect.
2. _second point_ (point object or point id as integer). The second point that the span will connect.

For example:

```
var span1 = VX.addSpan( point1, point2 );
```

A span can be further configured by updating its `.strength` (how rigidly the span will hold its points at the base distance, defaults to 1).

<br>


### Skins

Skins (2D only) provide a visible layer that corresponds to a series of points. (For 3D structures, visible layers need to be handled with WebGL or a library such as [ThreeJS](https://threejs.org/).) 

To create a new skin and add it to the physics environment, use `addSkin()` with two arguments:

1. _points_ (array). An array or point objects or point ids as integers which the skin will cover.
2. _styles_ (object: {fillColor: <string>, outlineColor: <string>, outlineThickness: <number or string>}). An object with values for the skin's fill color, outline color, and outline thickness.
  
For example, to place a blue skin with a black outline over a square constructed from four points:

```
var skin1 = VX.addSkins( [ point1, point2, point3 ], {fillColor: "blue", outlineColor: "#000000", outlineThickness: 1 } );
```

<br>
<br>


## Settings

A VerletExpressJS environment can be further configured by adjusting the following settings:

`VX.viewPoints` (boolean). Whether points are visible (2D only; defaults as false).
`VX.viewSpans` (boolean). Whether spans are visible (2D only; defaults as false).
`VX.viewSkins` (boolean). Whether skins are visible (2D only; defaults as true).
`VX.xRange` (object: { min: <integer>, max: <integer> }). The min & max X values that points can inhabit (objects bounce at values; null is infinite space).
`VX.yRange` (object: { min: <integer>, max: <integer> }). The min & max Y values that points can inhabit (objects bounce at values; null is infinite space).
`VX.zRange` (object: { min: <integer>, max: <integer> }). The min & max Z values that points can inhabit (3D only; objects bounce at values; null is infinite space).
`VX.pointsCollide` (boolean). Whether points collide with one other or pass through one another (defaults as true).
`VX.gravity` (number). The force of gravity (as rate of y-valocity increase per frame per point mass of one; defaults as 0.01).
`VX.rigidity` (number). The global span strength (as iterations of position accuracy refinement; defaults as 5).
`VX.friction` (number): The force of friction as points pass through space (as proportion of previous velocity after frame refresh; defaults as 0.999).
`VX.bounceLoss` (number). The affect of bouncing on a point's velocity (as proportion of previous velocity after bouncing; defaults as 0.9).
`VX.skidLoss` (number). The affect of skidding on a point's velocity (as proportion of previous velocity after skidding; defaults as 0.9).
`VX.breeze` (number). The air's breeziness level (applied as brief, randomized left & right gusts; defaults as 0).

<br>
<br>


## Options

+object collections
+worldtime
+functions...

runOnFrameRefresh()

<br>















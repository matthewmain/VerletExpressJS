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

1. _coordinates_ ( { x: \<number\>, y: \<number\> [, z: \<number\> ] } ). The 2d or 3d coordinates where the point's center will first exist. 
2. optional: _materiality_ (string: "material" or "immaterial"). Whether a point is "material" and collides with walls or potentially other points, or "immaterial" and passes through walls and other points. Default is "material".

For example:
  
```
VX.addPoint( { x: 480, y: 10 } );
```
  
**Note: 2d y values correspond to canvas or SVG positions, so they _increase_ downwards. 3d y values Y values correspnd to a 3D axis, so they _decrease_ downwards.**

<br>

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















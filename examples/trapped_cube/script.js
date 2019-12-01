

///////////////////////////////////////////////////
///////////   3D VERLET TRAPPED CUBE    ///////////
///////////////////////////////////////////////////




////---Initiation---////


///settings

//local
var containerWidth = 300;
var cubeWidth = 50;
var cubeDropHeight = 200;
var initialSpin = 10;
var jumpStrength = 30;
var jumpFrequency = 3000;  //jump frequency in milliseconds
var jumpTimeStamp = Math.floor(Date.now());  //logs time of last jump in miliseconds
var timeNow = Math.floor(Date.now());  //tracks time in miliseconds

//VerletExpressJS
VX.initialize( "3d" );
VX.gravity = 0.25; 
VX.skidLoss = 0.5;



////---functions---////


///builds cube's underlying verlet structure  
function buildCube(width) {
  //clears old points and spans arrays if populated from previous cube
  VX.points = []; VX.pointCount = 0;
  VX.spans = [];
  //points (from center at 0,0,0)
  var hcw = cubeWidth/2;  //half cube width
  var l = cubeDropHeight-(containerWidth/2);  //change to y-values to lift cube to drop height above floor
  VX.addPoint({ x: hcw, y: hcw+l, z: hcw }); VX.addPoint({ x: hcw, y: hcw+l, z: -hcw });
  VX.addPoint({ x: hcw, y: -hcw+l, z: hcw }); VX.addPoint({ x: hcw, y: -hcw+l, z: -hcw });
  VX.addPoint({ x: -hcw, y: hcw+l, z: -hcw }); VX.addPoint({ x: -hcw, y: hcw+l, z: hcw });
  VX.addPoint({ x: -hcw, y: -hcw+l, z: -hcw }); VX.addPoint({ x: -hcw, y: -hcw+l, z: hcw }); 
  //spans
  VX.addSpan(1,2); VX.addSpan(2,3); VX.addSpan(3,4); VX.addSpan(4,1);  //bottom edges
  VX.addSpan(1,5); VX.addSpan(2,6); VX.addSpan(3,7); VX.addSpan(4,8);  //side edges
  VX.addSpan(5,6); VX.addSpan(6,7); VX.addSpan(7,8); VX.addSpan(8,5);  //top edges
  VX.addSpan(1,3); VX.addSpan(1,6); VX.addSpan(2,7); VX.addSpan(3,8); VX.addSpan(4,5); VX.addSpan(5,7);  //surface braces
  VX.addSpan(1,7); VX.addSpan(2,8); VX.addSpan(3,5); VX.addSpan(4,6);  //internal braces 
  //initial spin
  spin(initialSpin);
  //resets jump timestamps
  jumpTimeStamp = Math.floor(Date.now());  //logs time of last jump in miliseconds
  timeNow = Math.floor(Date.now());  //tracks time in miliseconds
}

///adds spin
function spin(intensity) {
  VX.points[0].px = VX.points[0].cx+VX.rib(-intensity,intensity);
  VX.points[0].py = VX.points[0].cy+VX.rib(-intensity,intensity);
  VX.points[0].pz = VX.points[0].cz+VX.rib(-intensity,intensity);
  VX.points[6].px = VX.points[6].cx+VX.rib(-intensity,intensity);
  VX.points[6].py = VX.points[6].cy+VX.rib(-intensity,intensity);
  VX.points[6].pz = VX.points[6].cz+VX.rib(-intensity,intensity);
}

///makes cube jump
function jump(intensity,frequency) {
  timeNow = Math.floor(Date.now());
  if (timeNow-jumpTimeStamp>frequency) { 
    //upward motion
    VX.points[0].py = VX.points[0].cy+VX.rib(-intensity,-intensity/2);
    VX.points[1].py = VX.points[1].cy+VX.rib(-intensity,-intensity/2);
    VX.points[2].py = VX.points[2].cy+VX.rib(-intensity,-intensity/2);
    VX.points[3].py = VX.points[3].cy+VX.rib(-intensity,-intensity/2);
    //leftward/rightward motion
    VX.points[0].px = VX.points[0].cx+VX.rib(-intensity,intensity);
    //forward/backward motion
    VX.points[0].pz = VX.points[0].cz+VX.rib(-intensity,intensity);
    //resets timer
    jumpTimeStamp = Math.floor(Date.now());
  }
}

///checks whether cube is in the box
function cubeInTheBox() {
  var allPointsIn = true;
  for (i=0; i<VX.points.length; i++) {
    if (VX.points[i].outOfTheBox == true) { allPointsIn = false } 
  }
  return allPointsIn;
}

///adapts VerletExpressJS's applyBoundaries() function to conform to container boundaries
VX.applyBoundaries = function() {
  for (var i=0; i<VX.points.length; i++) {
    var p = VX.points[i];
    var xv = p.cx - p.px;  // x velocity
    var yv = p.cy - p.py;  // y velocity
    var zv = p.cz - p.pz;  // z velocity
    var hcw = containerWidth/2;  // half container width
    if ( p.cy > hcw + cubeWidth ) {
      p.outOfTheBox = true;
    } else if (p.cx < hcw && p.cx > -hcw && p.cy > -hcw && p.cz < hcw && p.cz > -hcw) {
      p.outOfTheBox = false;
    }
    //left/right walls
    if ( p.cx > hcw && cubeInTheBox() ) {
      p.cx = hcw;
      p.px = p.cx + xv * VX.bounceLoss;
    } else if (p.cx < -hcw && cubeInTheBox() ) {
      p.cx = -hcw;
      p.px = p.cx + (p.cx - p.px) * VX.bounceLoss;
    }
    //floor
    if ( p.cy < -hcw && cubeInTheBox() ) {
      p.cy = -hcw;
      p.py = p.cy + yv * VX.bounceLoss;
    }
    //front/back walls
    if (p.cz > hcw && cubeInTheBox() ) {
      p.cz = hcw;
      p.pz = p.cz + (p.cz - p.pz) * VX.bounceLoss;
    } else if ( p.cz < -hcw && cubeInTheBox() ) {
      p.cz = -hcw;
      p.pz = p.cz + zv * VX.bounceLoss;
    }
  }
}

///adapts VerletExpressJS's updatePoints() function to conform to handle skidloss on the container floor
VX.updatePoints = function() {
  for ( var i=0; i<VX.points.length; i++ ) {
    var p = VX.points[i];  // point object
    var hcw = containerWidth/2;  // half container width
    //stores velocity
    var xv = ( p.cx - p.px ) * VX.friction;  // x velocity
    var yv = ( p.cy - p.py ) * VX.friction;  // y velocity
    var zv = ( p.cz - p.pz ) * VX.friction;  // z velocity
    //verlet
    p.px = p.cx;  // updates previous x as current x
    p.py = p.cy;  // updates previous y as current y
    p.pz = p.cz;  // updates previous z as current z
    //skidloss
    if ( p.cy <= -hcw && cubeInTheBox() ) { xv *= VX.skidLoss; zv *= VX.skidLoss; }
    //applies velocity
    p.cx += xv; 
    p.cy += yv; 
    p.cz += zv;
    //gravity
    p.cy -= VX.gravity * p.mass; 
    //breeze
    if ( VX.worldTime % VX.rib( 100, 200 ) == 0 ) { p.cx += VX.rfb( -VX.breeze, VX.breeze ); }  
  }
}



////---ThreeJS---////


///ThreeJS settings

//object variables
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 100000 );
var renderer = new THREE.WebGLRenderer( { antialias: true } );
controls = new THREE.OrbitControls(camera, renderer.domElement);

//background
renderer.setClearColor (0x70d0ff, 1);

//html
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//camera
camera.position.y = 500;
camera.position.x = 0;
camera.position.z = 1000;
camera.rotation.x = -0.48; //(in radians)
camera.zoom += 1.2;

//cube
var geometry = new THREE.BoxGeometry( 20, 20, 20);
var material = new THREE.MeshLambertMaterial( { color: 0xdb471e, wireframe: false } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//container
var geometry = new THREE.BoxGeometry( containerWidth, containerWidth, containerWidth);
var material = new THREE.MeshPhongMaterial( { 
  side: THREE.DoubleSide,
  color: 0xCCCCCC, 
  transparent: true, 
  opacity: 0.25,
  depthWrite: false
} );
var container = new THREE.Mesh( geometry, material );
container.geometry.faces.splice(4, 2);  //removes container top
scene.add( container );

//light sources
var lightP1 = new THREE.PointLight( 0xFFFFFF, .25, 0, 0 );
lightP1.position.set( 0, 0, 0 );
var lightP2 = new THREE.PointLight( 0xFFFFFF, .25, 0, 2 );
lightP2.position.set( 500, 0, 500 );
var lightP3 = new THREE.PointLight( 0xFFFFFF, .25, 0, 2 );
lightP3.position.set( -500, 0, 500 );
var lightA1 = new THREE.AmbientLight( 0xFFFFFF, 0.75 );
scene.add( lightP1 );
scene.add( lightP2 );
scene.add( lightP3 );
scene.add( lightA1 );


///ThreeJs functions

//sets vertices to verlet point positions
function updateVertices() {
  for (var i=0; i<VX.points.length; i++) {
    cube.geometry.vertices[i].x = VX.points[i].cx;
    cube.geometry.vertices[i].y = VX.points[i].cy;
    cube.geometry.vertices[i].z = VX.points[i].cz;
  }
}

///ThreeJS rendering

function render() {  
  cube.geometry.verticesNeedUpdate = true;
  if ( VX.points[0].cy < -50000 ) { buildCube(cubeWidth); }
  updateVertices();
  VX.applyBoundaries();
  if ( cubeInTheBox() ) { jump(jumpStrength,jumpFrequency); }
  camera.updateProjectionMatrix();
  renderer.render(scene,camera);
  requestAnimationFrame(render);
};

buildCube(cubeWidth);
render();







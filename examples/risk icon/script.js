

////////////////////////////////////
/////////    Risk Icon     /////////
////////////////////////////////////




///---INITIATION---///


///settings
var expOrig = { x: 150, y: 190 };  // explosion origin
var expInt = 8;  // explosion intensity (as velocity in svg units)
var explosionDelay = 300;
var assemblyDelay = 300;
var reasSpd = 3;  // reassemble speed (as svg units per iteration)
var shardStyleObject = { 
  fillColor: "#FFFFFF",
  outlineColor: "#0B419E",
  outlineThickness: "5"
}

//trackers
var isExploded = false;
var iterationsSinceLastExplosion = 0;
var iterationsSinceLastAssembly = 0;

///VerletExpressJS
VX.initialize( "2d", "svg", "risk-icon-svg", "300", "300" );
VX.yRange.max = 190.95;
VX.gravity = 0.1;




///---SHAPES---///

//svg home points (forms broken triangle icon, clockwise from top)
let spT1 =  { x: 150,     y: 111.97 };  // svg point tip 1
let spE1a = { x: 167.88,  y: 143.12 };  // svg point edge 1a
let spE1b = { x: 177.5,   y: 159.89 };  // svg point edge 1b
let spT2 =  { x: 195.31,  y: 190.95 };  // svg point tip 2
let spE2a = { x: 166,     y: 190.95 };  // svg point edge 2a
let spE2b = { x: 114,     y: 190.95 };  // svg point edge 2b
let spT3 =  { x: 104.69,  y: 190.95 };  // svg point tip 3
let spE3 =  { x: 135.98,  y: 136.39 };  // svg point edge 3
let spC =   { x: 154.34,  y: 169.77 };  // svg point center

//shard 1 verlet components
var vpS1a = VX.addPoint( spT1 ); vpS1a.homePoint = spT1;  // verlet point shard 1a  //{{{{{{{{{{{{{{ ADD HOME POINTS }}}}}}}}}}}}}}
var vpS1b = VX.addPoint( spE1a ); vpS1b.homePoint = spE1a;  // verlet point shard 1b
var vpS1c = VX.addPoint( spC ); vpS1c.homePoint = spC;  // verlet point shard 1c
var vpS1d = VX.addPoint( spE3 ); vpS1d.homePoint = spE3;  // verlet point shard 1d
var vsS2a = VX.addSpan( vpS1a, vpS1b );  // verlet span shard 1a
var vsS2b = VX.addSpan( vpS1b, vpS1c );  // verlet span shard 1b
var vsS2c = VX.addSpan( vpS1c, vpS1d );  // verlet span shard 1c
var vsS2d = VX.addSpan( vpS1d, vpS1a );  // verlet span shard 1d
var vsS2e = VX.addSpan( vpS1b, vpS1d );  // verlet span shard 1e  (scaffold)
var skinShard1 = VX.addSkin( [ vpS1a, vpS1b, vpS1c, vpS1d ], shardStyleObject );  // border as skin object

//shard 3 verlet components
var vpS3a = VX.addPoint( spE1b ); vpS3a.homePoint = spE1b;  // verlet point shard 1a
var vpS3b = VX.addPoint( spT2 ); vpS3b.homePoint = spT2;  // verlet point shard 1b
var vpS3c = VX.addPoint( spE2a ); vpS3c.homePoint = spE2a;  // verlet point shard 1c
var vpS3d = VX.addPoint( spC ); vpS3d.homePoint = spC;  // verlet point shard 1d
var vsS2a = VX.addSpan( vpS3a, vpS3b );  // verlet span shard 1a
var vsS2b = VX.addSpan( vpS3b, vpS3c );  // verlet span shard 1b
var vsS2c = VX.addSpan( vpS3c, vpS3d );  // verlet span shard 1c
var vsS2d = VX.addSpan( vpS3d, vpS3a );  // verlet span shard 1d
var vsS2e = VX.addSpan( vpS3a, vpS3c );  // verlet span shard 1e (scaffold)
var skinShard3 = VX.addSkin( [ vpS3a, vpS3b, vpS3c, vpS3d ], shardStyleObject );  // border as skin object

//shard 4 verlet components
var vpS4a = VX.addPoint( spC ); vpS4a.homePoint = spC;  // verlet point shard 2a
var vpS4b = VX.addPoint( spE2a ); vpS4b.homePoint = spE2a;  // verlet point shard 2b
var vpS4c = VX.addPoint( spE2b ); vpS4c.homePoint = spE2b;  // verlet point shard 2c
var vsS4a = VX.addSpan( vpS4a, vpS4b );  // verlet span shard 2a
var vsS4b = VX.addSpan( vpS4b, vpS4c );  // verlet span shard 2b
var vsS4c = VX.addSpan( vpS4c, vpS4a );  // verlet span shard 2c
var skinShard4 = VX.addSkin( [ vpS4a, vpS4b, vpS4c ], shardStyleObject );  // border as skin object

//shard 5 verlet components
var vpS5a = VX.addPoint( spE3 ); vpS5a.homePoint = spE3;  // verlet point shard 2a
var vpS5b = VX.addPoint( spC ); vpS5b.homePoint = spC;  // verlet point shard 2b
var vpS5c = VX.addPoint( spE2b ); vpS5c.homePoint = spE2b;  // verlet point shard 2c
var vpS5d = VX.addPoint( spT3 ); vpS5d.homePoint = spT3;  // verlet point shard 2d
var vsS5a = VX.addSpan( vpS5a, vpS5b );  // verlet span shard 2a
var vsS5b = VX.addSpan( vpS5b, vpS5c );  // verlet span shard 2b
var vsS5c = VX.addSpan( vpS5c, vpS5d );  // verlet span shard 2c
var vsS5d = VX.addSpan( vpS5d, vpS5a );  // verlet span shard 2d
var vsS5e = VX.addSpan( vpS5a, vpS5c );  // verlet span shard 2e (scaffold)
var vsS5f = VX.addSpan( vpS5b, vpS5d );  // verlet span shard 2f (scaffold)
var skinShard5 = VX.addSkin( [ vpS5a, vpS5b, vpS5c, vpS5d ], shardStyleObject );   // border as skin object

//shard 2 verlet components
var vpS2a = VX.addPoint( spE1a ); vpS2a.homePoint = spE1a;  // verlet point shard 2a
var vpS2b = VX.addPoint( spE1b ); vpS2b.homePoint = spE1b;  // verlet point shard 2b
var vpS2c = VX.addPoint( spC ); vpS2c.homePoint = spC;  // verlet point shard 2c
var vsS2a = VX.addSpan( vpS2a, vpS2b );  // verlet span shard 2a
var vsS2b = VX.addSpan( vpS2b, vpS2c );  // verlet span shard 2b
var vsS2c = VX.addSpan( vpS2c, vpS2a );  // verlet span shard 2c
var skinShard2 = VX.addSkin( [ vpS2a, vpS2b, vpS2c ], shardStyleObject );  // border as skin object



///---FUNCTIONS---///

//pins all points to current locations
function pinPoints() {
  for (var i=0; i<VX.points.length; i++) {
    VX.points[i].fixed = true;
  }
}

//unpins all points
function unpinPoints() {
  for (var i=0; i<VX.points.length; i++) {
    VX.points[i].fixed = false;
  }
}

//explodes triangle
function explode() {
  unpinPoints();
  isExploded = true;
  iterationsSinceLastExplosion = 0;
  varExpInt = VX.rib( expInt-2, expInt+2 );  // varying explosion intensity
  for (i=0; i<VX.points.length; i++) {
    var p = VX.points[i];
    var xDist = p.cx - expOrig.x;  // x distance from explosion origin to point 
    var yDist = p.cy - expOrig.y;  // y distance from explosion origin to point
    var dist = Math.sqrt( xDist*xDist + yDist*yDist );  // distance from explosion origin to point
    var distRat = varExpInt / dist;  // distance ratio (of velocity to distance from explosion origin point)
    p.px = p.cx - xDist * distRat;
    p.py = p.cy - yDist * distRat;
  }
}

function explodeIfReady() {
  iterationsSinceLastAssembly++;
  if ( iterationsSinceLastAssembly > explosionDelay && !isExploded ) {
    explode();
  }
}

function reassemble() {
  gravity = 0;
  VX.yRange.max = 200;  // clears ground so shapes don't get stuck during reassembly
  isExploded = false;
  for (i=0; i<VX.points.length; i++) {
    var p = VX.points[i];
    var xDist = p.cx - p.homePoint.x;  // x distance from current point to home point 
    var yDist = p.cy - p.homePoint.y;  // y distance from current point to home point
    var dist = Math.sqrt( xDist*xDist + yDist*yDist );  // distance from current point to home point
    var distRat = reasSpd / dist;  // distance ratio (of velocity to distance from home point)
    p.cx = p.px = p.cx - xDist * distRat;
    p.cy = p.py = p.cy - yDist * distRat;
    if ( dist < 2 ) {
      p.cx = p.px = p.homePoint.x;
      p.cy = p.py = p.homePoint.y;
      p.pinned = true;
    } else {
      isExploded = true;
    }
  }
  if ( !isExploded ) {
    VX.yRange.max = 190.95;  // returns ground to normal position
    pinPoints();
    gravity = 0.1;
    iterationsSinceLastAssembly = 0;
  }
}

function reassembleIfReady() {
  iterationsSinceLastExplosion++;
  if ( iterationsSinceLastExplosion > assemblyDelay && isExploded ) {
    reassemble();
  }
}



///---EVENTS---///


VX.svg.addEventListener("click", explode );



///---EXECUTION---///


pinPoints()

VX.runOnFrameRefresh = function() {
  explodeIfReady();
  reassembleIfReady();
}




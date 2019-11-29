

///////////////////////////////////////////////////
////////////       VERLET MARBLES       ///////////
///////////////////////////////////////////////////



///---INITIALIZATION---///


///environment
var container = document.getElementById("container_div");

///scaling
scaleToWindow();

///VerletExpressJS
VX.initialize( "2d", "canvas", "canvas", "1000", "780" );
VX.viewPoints = true;
VX.gravity = 0.5;
VX.bounceLoss = 0.5;
VX.skidLoss = 0.999;

//initital marbles
for ( var i=0; i<15; i++ ) { releaseMarble() };  // releases marbles at beginning



///---FUNCTIONS---///


//scaling
function scaleToWindow() {
  if ( window.innerWidth > window.innerHeight) {
    container.style.height = window.innerHeight*.8+"px";
    container.style.width = container.style.height;
  } else {
    container.style.width = window.innerWidth*.8+"px";
    container.style.height = container.style.width;
  }
}

///adapts VX.renderPoints() to display gradients in points as marbles
VX.renderPoints = function() {
  for ( var i=0; i<VX.points.length; i++ ) {
    var p = VX.points[i];
    var grd = VX.ctx.createRadialGradient( p.cx, p.cy, p.width*0.2, p.cx, p.cy, p.width*1.5);
    grd.addColorStop( 0, p.color );
    grd.addColorStop( 1, "#000000" );
    VX.ctx.fillStyle = grd;
    VX.ctx.beginPath();
    VX.ctx.arc( p.cx, p.cy, p.width/2, 0, Math.PI*2 );
    VX.ctx.fill();
  }
}

//creates and releases a new marble
function releaseMarble() {
  var marble = VX.addPoint( { x: VX.rib(0,VX.xRange.max), y: 0 } );
  marble.width = VX.rib( 50, 150 );
  marble.color = randomColor();
  marble.px = VX.rib( marble.cx-20, marble.cx+20 );
  marble.py = VX.rib( marble.cy-20, marble.cy );
} 

//generates a random hex color
function randomColor() {
  var color = "#";
  var hex = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
  for (var i=0; i<6; i++) { color += hex[VX.rib(0,15)] };
  return color;
}



///---EVENTS---///


//scaling
window.addEventListener('resize', scaleToWindow);

//new marble
document.getElementById("release_button").addEventListener('click', releaseMarble);






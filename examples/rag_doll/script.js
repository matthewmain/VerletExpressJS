
////////////////////////////////////////////
////////////   VERLET RAG DOLL   ///////////
////////////////////////////////////////////


////--INITIATION--////


///style settings
let fc = "green"  // fill color
let oc = "red"  // outline color
let ot = "10"  // outline thickness

///VerletExpressJS
VX.initialize( "2d", "canvas", "canvas-element", 1000, 1000 );
VX.gravity = 0.25;
VX.rigidity = 20;
VX.skidLoss = 0.5;
VX.breeze = 8;

///scaling
var container = document.getElementById("container_div");
var canvasPositionLeft = VX.canvas.getBoundingClientRect().left + window.scrollX;
var canvasPositionTop = VX.canvas.getBoundingClientRect().top + window.scrollY;
scaleToWindow();

///interaction
var mouseCanvasX;
var mouseCanvasY;
var grabbedPointId = null;



////--RAG DOLL COMPONENTS--////


///points  
// (head)
VX.addPoint( { x: 480, y: 10 } ); VX.addPoint( { x: 520, y: 10 } );  //id 1,2
VX.addPoint( { x: 480, y: 60 } ); VX.addPoint( { x: 520, y: 60 } );  //id 3,4 
// (neck base)
VX.addPoint( { x: 500, y: 80 } );  // id 5
// (torso)
VX.addPoint( { x: 440, y: 80 } ); VX.addPoint( { x: 560, y: 80 } );  //id 6,7
VX.addPoint( { x: 470, y: 200 } ); VX.addPoint( { x: 530, y: 200 } );  //id 8,9
// (arms)
VX.addPoint( { x: 370, y: 130 } ); VX.addPoint( { x: 420, y: 120 } ); VX.addPoint( { x: 320, y: 200 } ); VX.addPoint( { x: 370, y: 160 } );  //id 10,11,12,13
VX.addPoint( { x: 630, y: 130 } ); VX.addPoint( { x: 580, y: 120 } ); VX.addPoint( { x: 680, y: 200 } ); VX.addPoint( { x: 630, y: 160 } );  //id 14,15,16,17
// (legs)
VX.addPoint( { x: 450, y: 330 } ); VX.addPoint( { x: 490, y: 260 } ); VX.addPoint( { x: 460, y: 440 } ); VX.addPoint( { x: 475, y: 360 } );  //id 18,19,20,21
VX.addPoint( { x: 550, y: 330 } ); VX.addPoint( { x: 510, y: 260 } ); VX.addPoint( { x: 540, y: 440 } ); VX.addPoint( { x: 525, y: 360 } );  //id 22,23,24,25
// (forearm bindings)
VX.addPoint( { x: 390, y: 140 }, "immaterial" ); VX.addPoint( { x: 610, y: 140 }, "immaterial" );  //id 26,27
// (lower leg bindings)
VX.addPoint( { x: 480, y: 320 }, "immaterial" ); VX.addPoint( { x: 520, y: 320 }, "immaterial" );  //id 28,29
// (arm bindings & scaffolding)
VX.addPoint( { x: 370, y: 80 }, "immaterial" ); VX.addPoint( { x: 310, y: 110 }, "immaterial" );  //id 30,31
VX.addPoint( { x: 630, y: 80 }, "immaterial" ); VX.addPoint( { x: 690, y: 110 }, "immaterial" );  //id 32,33
VX.addPoint( { x: 390, y: 180 }, "immaterial" ); VX.addPoint( { x: 370, y: 190 }, "immaterial" );  //id 34,35
VX.addPoint( { x: 610, y: 180 }, "immaterial" ); VX.addPoint( { x: 630, y: 190 }, "immaterial" );  //id 36,37
// (leg bindings & scaffolding)
VX.addPoint( { x: 490, y: 350 }, "immaterial" ); VX.addPoint( { x: 480, y: 390 }, "immaterial" );  //id 38,39 
VX.addPoint( { x: 510, y: 350 }, "immaterial" ); VX.addPoint( { x: 520, y: 390 }, "immaterial" );  //id 40,41
VX.addPoint( { x: 410, y: 240 }, "immaterial" ); VX.addPoint( { x: 370, y: 280 }, "immaterial" );  //id 42,43 
VX.addPoint( { x: 590, y: 240 }, "immaterial" ); VX.addPoint( { x: 630, y: 280 }, "immaterial" );  //id 44,45
VX.addPoint( { x: 500, y: 310 }, "immaterial" );  //id 46

///spans
// (head)
VX.addSpan(1,2); VX.addSpan(1,3); VX.addSpan(2,4); 
VX.addSpan(1,4,"hidden"); VX.addSpan(2,3,"hidden"); VX.addSpan(3,4,"hidden");
// (head scaffolding)
VX.addSpan(1,7,"hidden"); VX.addSpan(1,6,"hidden"); VX.addSpan(1,9,"hidden"); VX.addSpan(2,6,"hidden");
VX.addSpan(2,7,"hidden"); VX.addSpan(2,8,"hidden"); VX.addSpan(3,6,"hidden"); VX.addSpan(4,7,"hidden"); 
VX.addSpan(6,9,"hidden"); VX.addSpan(7,8,"hidden");
// (neck)
VX.addSpan(1,5,"hidden"); VX.addSpan(2,5,"hidden"); 
// (shoulders)
VX.addSpan(3,7); VX.addSpan(4,6); 
// (torso)
VX.addSpan(6,5,"hidden"); VX.addSpan(6,7,"hidden"); VX.addSpan(6,8); VX.addSpan(5,7,"hidden"); 
VX.addSpan(5,8,"hidden"); VX.addSpan(5,9,"hidden"); VX.addSpan(7,9); VX.addSpan(8,9); 
// (arms)
VX.addSpan(6,10); VX.addSpan(6,11); VX.addSpan(10,11); VX.addSpan(10,12); VX.addSpan(10,13); VX.addSpan(12,13); 
VX.addSpan(7,14); VX.addSpan(7,15); VX.addSpan(14,15); VX.addSpan(14,16); VX.addSpan(14,17); VX.addSpan(16,17); 
// (legs)
VX.addSpan(8,18); VX.addSpan(8,19); VX.addSpan(18,19); VX.addSpan(18,20); VX.addSpan(18,21); VX.addSpan(20,21); 
VX.addSpan(9,22); VX.addSpan(9,23); VX.addSpan(22,23); VX.addSpan(22,24); VX.addSpan(22,25); VX.addSpan(24,25); 
// (forearm bindings)
VX.addSpan(26,11,"hidden"); VX.addSpan(26,13,"hidden"); VX.addSpan(27,15,"hidden"); VX.addSpan(27,17,"hidden");
// (lower leg binding)
VX.addSpan(28,19,"hidden"); VX.addSpan(28,21,"hidden"); VX.addSpan(29,23,"hidden"); VX.addSpan(29,25,"hidden");
// (arm bindings & scaffolding)
VX.addSpan(30,6,"hidden"); VX.addSpan(30,8,"hidden"); VX.addSpan(30,31,"hidden"); VX.addSpan(31,10,"hidden");
VX.addSpan(32,7,"hidden"); VX.addSpan(32,9,"hidden"); VX.addSpan(32,33,"hidden"); VX.addSpan(33,14,"hidden");
VX.addSpan(34,6,"hidden"); VX.addSpan(34,10,"hidden"); VX.addSpan(34,35,"hidden"); VX.addSpan(35,12,"hidden");
VX.addSpan(36,7,"hidden"); VX.addSpan(36,14,"hidden"); VX.addSpan(36,37,"hidden"); VX.addSpan(37,16,"hidden");  
// (leg bindings and scaffolding)
VX.addSpan(38,8,"hidden"); VX.addSpan(38,16,"hidden"); VX.addSpan(38,39,"hidden"); VX.addSpan(39,20,"hidden");
VX.addSpan(40,9,"hidden"); VX.addSpan(40,22,"hidden"); VX.addSpan(40,41,"hidden"); VX.addSpan(41,24,"hidden");
VX.addSpan(42,6,"hidden"); VX.addSpan(42,8,"hidden"); VX.addSpan(42,43,"hidden"); VX.addSpan(43,18,"hidden");
VX.addSpan(44,7,"hidden"); VX.addSpan(44,9,"hidden"); VX.addSpan(44,45,"hidden"); VX.addSpan(45,22,"hidden");
VX.addSpan(46,19,"hidden"); VX.addSpan(46,23,"hidden");

///skins
// (head & torso)
VX.addSkin( [1,2,4,6,8,9,7,3,1], {fillColor: fc, outlineColor: oc, outlineThickness: ot} );
// (legs)
VX.addSkin( [8,18,20,21,18,19,8], {fillColor: fc, outlineColor: oc, outlineThickness: ot} ); 
VX.addSkin( [9,23,22,25,24,22,9], {fillColor: fc, outlineColor: oc, outlineThickness: ot} );
// (arms)
VX.addSkin( [6,10,12,13,10,11,6], {fillColor: fc, outlineColor: oc, outlineThickness: ot} ); 
VX.addSkin( [7,14,16,17,14,15,7], {fillColor: fc, outlineColor: oc, outlineThickness: ot} );

///adds a little initial random velocity
VX.points[5].px = VX.points[5].cx + VX.rib(-50,50);
VX.points[8].px = VX.points[8].cx + VX.rib(-50,50);
VX.points[6].py = VX.points[6].cy + VX.rib(-50,50);
VX.points[7].py = VX.points[7].cy + VX.rib(-50,50);



////--FUNCTIONS--////


///scaling
function scaleToWindow() {
  if (window.innerWidth > window.innerHeight) {
    VX.canvas.style.height = window.innerHeight*0.8+"px";
    VX.canvas.style.width = VX.canvas.style.height;
  } else {
    VX.canvas.style.width = window.innerWidth*0.8+"px";
    VX.canvas.style.height = VX.canvas.style.width;
  }
  canvasPositionLeft = VX.canvas.getBoundingClientRect().left + window.scrollX;
	canvasPositionTop = VX.canvas.getBoundingClientRect().top + window.scrollY;
}

///tethers grabbed point to mouse
function followMouseifGrabbed() {
  if ( grabbedPointId ) {
    VX.points[grabbedPointId].px = VX.points[grabbedPointId].cx = mouseCanvasX; 
    VX.points[grabbedPointId].py = VX.points[grabbedPointId].cy = mouseCanvasY;
  }
}

///grabs doll on click
function grabDoll(e) {
	var actualCanvasWidth = parseFloat( VX.canvas.style.width );
	var actualCanvasHeight = parseFloat( VX.canvas.style.height );
  mouseCanvasX = ( e.pageX - canvasPositionLeft ) * VX.interfaceWidth / actualCanvasWidth ;  //mouse canvas x
  mouseCanvasY = ( e.pageY - canvasPositionTop ) * VX.interfaceHeight / actualCanvasHeight ;  //mouse canvas y
  var nearestPointDist = VX.interfaceWidth;
  var nearestPoint;
  // (finds point nearest to click) 
  for ( var i=0; i<VX.points.length; i++ ) {
    var x_diff = VX.points[i].cx - mouseCanvasX;
    var	y_diff = VX.points[i].cy - mouseCanvasY;
    var dist = Math.sqrt( x_diff*x_diff + y_diff*y_diff );
    if (dist < nearestPointDist && VX.points[i].materiality == "material") {
      nearestPointDist = dist; 
      nearestPoint = VX.points[i]; 
    };
  };    
  // (if point is near click, i.e. less than pelvis width, grab it)
  if ( nearestPointDist < VX.distance( VX.points[7], VX.points[8] ) ) {
    grabbedPointId = nearestPoint.id;
  }
}

///moves doll
function moveDoll(e) {
	var actualCanvasWidth = parseFloat( VX.canvas.style.width );
	var actualCanvasHeight = parseFloat( VX.canvas.style.height );
  mouseCanvasX = ( e.pageX - canvasPositionLeft ) * VX.interfaceWidth / actualCanvasWidth ;  //mouse canvas x
  mouseCanvasY = ( e.pageY - canvasPositionTop ) * VX.interfaceHeight / actualCanvasHeight ;  //mouse canvas y
  // (drops doll if mouse leaves canvas)
  if (   mouseCanvasX < 0
      || mouseCanvasX > VX.interfaceWidth 
      || mouseCanvasY < 0 
      || mouseCanvasY > VX.interfaceHeight) { 
    grabbedPointId = null 
  }; 
  followMouseifGrabbed();
}

///drops doll
function dropDoll(e) {
  grabbedPointId = null;
}



////--EVENTS--////

//scaling
window.addEventListener('resize', scaleToWindow);

//interaction
document.addEventListener("mousedown", grabDoll);
document.addEventListener("mousemove", moveDoll);
document.addEventListener("mouseup", dropDoll);

document.addEventListener("touchstart", grabDoll);
document.addEventListener("touchmove", moveDoll);
document.addEventListener("touchend", dropDoll);
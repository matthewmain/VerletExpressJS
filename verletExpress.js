

////////////////////////////////////////////////////////////////
////////////////////  Verlet Express JS  ///////////////////////
////////////////////////////////////////////////////////////////

// A lightweight Verlet integration physics engine for 2D or 3D scenes.
// © Matthew Main 2019


 
var VX = {



  ////---SETTINGS---////


  viewPoints: false,  // point visibility
  viewSpans: false,  // span visibility
  viewSkins: true, // skin visibility
  xRange: { min: null, max: null },  // min and max x values (objects bounce at set values; use null for infinite space )
  yRange: { min: null, max: null },  // min and max y values (objects bounce at set values; use null for infinite space )
  zRange: { min: null, max: null },  // min and max z values (objects bounce at set values; use null for infinite space ) 
  gravity: 0.01,  // rate of y-velocity increase per frame per point mass of 1
  rigidity: 5,  // global span rigidity (as iterations of position accuracy refinement)
  friction: 0.999,  // proportion of previous velocity after frame refresh
  bounceLoss: 0.9,  // proportion of previous velocity after bouncing
  skidLoss: 0.9,  // proportion of previous velocity if touching the ground
  breeze: 0,  // breeziness level (applied as brief, randomized left & right gusts)



  ////---TRACKERS---////


  points: [], pointCount: 0,
  spans: [], spanCount: 0,
  skins: [], skinCount: 0,
  worldTime: 0,



  ////---INITIALIZATION---////


  ///initializes physics environment
  //dimensions can be "2d" or "3d"; 
  //medium, used only for 2d, can be "canvas" or "svg"
  //elementId should be an id associated with the target canvas or svg element
  initialize: function( dimensions, medium, elementId ) {  
    VX.dimensions = dimensions.toLowerCase();
    if ( VX.dimensions == "2d") { VX.medium = medium.toLowerCase(); } else { VX.medium = null; }  // forces medium to null for 3d
    if ( VX.medium == "canvas" ) { 
      VX.canvas = document.getElementById( elementId );
      VX.ctx = VX.canvas.getContext("2d");
      VX.interfaceWidth = VX.canvas.width;  // interface width, 
      VX.interfaceHeight = VX.canvas.height;  // 
    } else if ( VX.medium == "svg" ) {
      //...
    }
    VX.run();
  },



  ////---OBJECTS---////


  ///point constructor
  Point: function( currentX, currentY, materiality="material" ) {  // materiality can be "material" or "immaterial"
    VX.pointCount += 1;
    this.cx = currentX;
    this.cy = currentY; 
    this.px = this.cx;  // previous x value
    this.py = this.cy;  // previous y value
    this.mass = 1;  // (as ratio of gravity)
    this.width = 0;
    this.materiality = materiality;
    this.fixed = false;
    this.id = VX.pointCount;
  },

  ///span constructor
  Span: function( point1, point2 ) {
    VX.spanCount += 1;
    this.p1 = point1;
    this.p2 = point2;
    this.l = VX.distance( this.p1, this.p2 ); // length
    this.strength = 1;  // (as ratio of rigidity)
    this.id = VX.spanCount;
  },

  ///skins constructor
  Skin: function( pointsArray, outlineColor="black", fillColor = "blue" ) {
    VX.skinCount += 1;
    this.points = pointsArray;  // an array of points for skin outline path
    this.outlineColor = outlineColor;
    this.fillColor = fillColor;
    this.id = VX.skinCount;
  },



  ////---FUNCTIONS---////


  ///gets distance between two points
  distance: function( point1, point2 ) {
    var xDiff = point2.cx - point1.cx;
    var yDiff = point2.cy - point1.cy;
    return Math.sqrt( xDiff*xDiff + yDiff*yDiff );
  },

  ///gets a point by id number
  getPoint: function( id ) {
    for ( var i=0; i<VX.points.length; i++ ) { 
      if ( VX.points[i].id == id ) { return VX.points[i]; }
    }
  },

  ///creates a point object instance
  addPoint: function( xValue, yValue, materiality="material" ) {
    VX.points.push( new VX.Point( xValue, yValue, materiality ) );
    return VX.points[ VX.points.length-1 ];
  },

  ///creates a span object instance
  addSpan: function( point1Id, point2Id ) {
    VX.spans.push( new VX.Span( VX.getPoint( point1Id ), VX.getPoint( point2Id ) ) );
    return VX.spans[ VX.spans.length-1 ];
  },

  ///creates a skin object instance
  addSkin: function( pointIdArray, outlineColor="black", fillColor = "blue" ) {
    var skinPointsArray = [];
    for ( var i=0; i<pointIdArray.length; i++ ) {
      for( var j=0; j<VX.points.length; j++ ){ 
        if ( VX.points[j].id == pointIdArray[i] ) { 
          skinPointsArray.push( VX.points[j] ); 
        }
      }
    }
    VX.skins.push( new VX.Skin( skinPointsArray, outlineColor, fillColor ) );
    return VX.skins[ VX.skins.length-1 ];
  },

  ///removes a point by id  
  removePoint: function( id ) {
    for ( var i=0; i<VX.points.length; i++ ){ 
      if ( VX.points[i].id == id ) { VX.points.splice(i,1); }
    }
  },

  ///removes a span by id
  removeSpan: function( id ) {
    for ( var i=0; i<VX.spans.length; i++ ){ 
      if ( VX.spans[i].id == id ) { VX.spans.splice(i,1); }
    }
  },

  ///removes a skin by id
  removeSkin: function( id ) {
    for ( var i=0; i<VX.skins.length; i++ ){ 
      if ( VX.skins[i].id == id ) { VX.skins.splice(i,1); }
    }
  },

  ///updates point positions based on verlet velocity (i.e., current coord minus previous coord)
  updatePoints: function() {
    for ( var i=0; i<VX.points.length; i++ ) {
      var p = VX.points[i];  // point object
      if (!p.fixed) {
        var xv = (p.cx - p.px) * VX.friction;  // x velocity
        var yv = (p.cy - p.py) * VX.friction;  // y velocity
        if ( p.py >= VX.yValue.max-p.width/2 ) { xv *= skidLoss; }
        p.px = p.cx;  // updates previous x as current x
        p.py = p.cy;  // updates previous y as current y
        p.cx += xv;  // updates current x with new velocity
        p.cy += yv;  // updates current y with new velocity
        p.cy += VX.gravity * p.mass;  // add gravity to y
        if ( VX.worldTime % rib( 100, 200 ) == 0 ) { p.cx += rfb( -breeze, breeze ); }  // apply breeze to x
      }
    }
  },

  ///applies boundaries
  applyBoundaries: function() {
    for ( var i=0; i<VX.points.length; i++ ) {
      var p = points[i];
      var pr = p.width/2;  // point radius
      var xv = p.cx - p.px;  // x velocity
      var yv = p.cy - p.py;  // y velocity
      if ( p.materiality == "material" ) {
        //left boundary
        if ( VX.xRange.min && p.cx < VX.xRange.min + pr ) {
          p.cx = VX.xRange.min + pr;  // move point back to boundary
          p.px = p.cx + xv * VX.bounceLoss;  // reverse velocity
        }
        //right boundary
        if ( VX.xRange.max && p.cx > VX.xRange.max - pr ) { 
          p.cx = VX.xRange.max - pr;
          p.px = p.cx + xv * VX.bounceLoss;
        }
        //ceiling
        if ( VX.yRange.min && p.cy < VX.yRange.min + pr ) { 
          p.cy = VX.yRange.min + pr;
          p.py = p.cy + yv * VX.bounceLoss;
        }
        //floor
        if ( VX.yRange.max && p.cy > VX.yRange.max - pr ) {
          p.cy = VX.yRange.max - pr;
          p.py = p.cy + yv * VX.bounceLoss;
        }
      }
    }
  },

  ///updates span positions and adjusts associated points
  updateSpans: function( currentRefinementIteration ) {
    for ( var i=0; i<VX.spans.length; i++ ) {
      var refinementIterationsNeededForCurrentSpan = Math.round( VX.rigidity * VX.spans[i].strength );
      if ( currentRefinementIteration <= refinementIterationsNeededForCurrentSpan ) {
        var s = VX.spans[i];
        var dx = s.p2.cx - s.p1.cx;  // distance between x values
        var dy = s.p2.cy - s.p1.cy;  // distance between y values
        var d = Math.sqrt( dx*dx + dy*dy);  // distance between the points
        var r = s.l / d;  // ratio (span length over distance between points)
        var mx = s.p1.cx + dx / 2;  // midpoint between x values 
        var my = s.p1.cy + dy / 2;  // midpoint between y values
        var ox = dx / 2 * r;  // offset of each x value (compared to span length)
        var oy = dy / 2 * r;  // offset of each y value (compared to span length)
        if ( !s.p1.fixed ) {
          s.p1.cx = mx - ox;  // updates span's first point x value
          s.p1.cy = my - oy;  // updates span's first point y value
        }
        if ( !s.p2.fixed ) {
          s.p2.cx = mx + ox;  // updates span's second point x value
          s.p2.cy = my + oy;  // updates span's second point y value
        }
      }
    }
  },

  ///refines points for position accuracy & shape rigidity by updating spans and applying boundaries iteratively
  refinePositions: function() {
    var maxRequiredRefinementIterations = VX.rigidity;
    for ( var i=0; i<VX.spans.length; i++ ) {
      var refinementIterationsNeededForCurrentSpan = Math.round( VX.rigidity * VX.spans[i].strength );
      if ( refinementIterationsNeededForCurrentSpan > maxRequiredRefinementIterations ) { 
        maxRequiredRefinementIterations = refinementIterationsNeededForCurrentSpan; 
      }
    }
    for ( var j=0; j<maxRequiredRefinementIterations; j++ ) {
      var currentRefinementIteration = j;
      VX.updateSpans( currentRefinementIteration );
      VX.applyBoundaries();
    }
  },

  ///displays points
  renderPoints: function() {
    if ( VX.medium == "canvas" ) {
      for ( var i=0; i<VX.points.length; i++ ) {
        var p = VX.points[i];
        var radius = p.width >= 2 ? p.width/2 : 1;
        VX.ctx.beginPath();
        VX.ctx.fillStyle = "red";
        VX.ctx.arc( p.cx, p.cy, radius, 0 , Math.PI*2 );
        VX.ctx.fill(); 
      }
    } else if ( VX.medium == "svg" ) {
      //...
    }
  },

  ///displays spans
  renderSpans: function() {
    if ( VX.medium == "canvas" ) {
      for ( var i=0; i<VX.spans.length; i++ ) {
        var s = VX.spans[i];
        if ( s.visibility == "visible" ) {
          VX.ctx.beginPath();
          VX.ctx.lineWidth = 1;
          VX.ctx.strokeStyle = "blue";
          VX.ctx.moveTo(s.p1.cx, s.p1.cy);
          VX.ctx.lineTo(s.p2.cx, s.p2.cy);
          VX.ctx.stroke(); 
        }
      }
    } else if ( VX.medium == "svg" ) {
      //...
    }
  },

  ///displays skins 
  renderSkins: function() {
    if ( VX.medium == "canvas" ) {
      for ( var i=0; i<VX.skins.length; i++ ) {
        var s = VX.skins[i];
        VX.ctx.beginPath();
        VX.ctx.strokeStyle = s.color;
        VX.ctx.lineWidth = 0;
        VX.ctx.lineJoin = "round";
        VX.ctx.lineCap = "round";
        VX.ctx.fillStyle = s.color;
        VX.ctx.moveTo(s.points[0].cx, s.points[0].cy);
        for ( var j=1; j<s.points.length; j++) { VX.ctx.lineTo(s.points[j].cx, s.points[j].cy); }
        VX.ctx.lineTo(s.points[0].cx, s.points[0].cy);
        VX.ctx.stroke();
        VX.ctx.fill();  
      }
    } else if ( VX.medium == "svg" ) {
      //...
    }
  },

  ///clears canvas frame
  clearInterface: function() {
    if ( VX.medium == "canvas" ) {
      VX.ctx.clearRect(0, 0, interfaceWidth, interfaceHeight);
    } else if ( VX.medium == "svg" ) {
      //...
    }    
  },

  ///renders all visible components
  renderImages: function() {
    if ( VX.viewSkins ) { VX.renderSkins(); }
    if ( VX.viewSpans ) { VX.renderSpans(); }
    if ( VX.viewPoints ) { VX.renderPoints(); }
  },



  ////---EXECUTION---////


  run: function() {
    VX.updatePoints();
    VX.refinePositions();
    VX.clearInterface();
    VX.renderImages();
    VX.worldTime++;
    window.requestAnimationFrame( VX.run );
  },



}



////--- HELPER FUNCTIONS ---////

//random integer between two numbers (min/max inclusive)
function rib( min, max ) {
  return Math.floor( Math.random() * ( Math.floor(max) - Math.ceil(min) + 1 ) ) + Math.ceil(min);
}

//random float between two numbers
function rfb( min, max ) {
  return Math.random() * ( max - min ) + min;
}











////////////////////////////////////////////////////////////////


// VX.addPoint( 0, 0 );
// VX.addPoint( 0, 10 );
// VX.addPoint( 10, 0 );

// VX.addSpan( 1, 2 );
// VX.addSpan( 2, 3 );
// VX.addSpan( 3, 1 );

// VX.addSkin( [ 1, 2, 3 ] );


// console.log( VX.skins.length );
// VX.removeSkin(1);
// console.log( VX.skins.length );




////////////////////////////////////////////////////////////////






// ///scales canvas to window
// function scaleToWindow() {
//   if (window.innerWidth > window.innerHeight) {
//     canvasContainerDiv.style.height = window.innerHeight*canvRatio+"px";
//     canvasContainerDiv.style.width = canvasContainerDiv.style.height;
//   } else {
//     canvasContainerDiv.style.width = window.innerWidth*canvRatio+"px";
//     canvasContainerDiv.style.height = canvasContainerDiv.style.width;
//   }
//   canvasPositionLeft = canvas.getBoundingClientRect().left + window.scrollX;
//   canvasPositionTop = canvas.getBoundingClientRect().top + window.scrollY;
// }

// ///converts percentage to canvas x value
// function xValFromPct(percent) {
//   return percent * canvas.width / 100;
// }

// ///converts percentage to canvas y value
// function yValFromPct(percent) {
//   return percent * canvas.height / 100;
// }

// ///converts canvas x value to percentage of canvas width
// function pctFromXVal(xValue) {
//   return xValue * 100 / canvas.width;
// }

// ///converts canvas y value to percentage of canvas height
// function pctFromYVal(yValue) {
//   return yValue * 100 / canvas.height;
// }

// ///gets a span's mid point (returns object: { x: <value>, y: <value> } )
// function spanMidPoint( span ) {
//   var mx = ( span.p1.cx + span.p2.cx ) / 2;  // mid x value
//   var my = ( span.p1.cy + span.p2.cy ) / 2;  // mid y value
//   return { x: mx, y: my};
// }

// ///gets the mid point between two points (returns object: { x: <value>, y: <value> } )
// function midPoint( point1, point2 ) {
//   var mx = ( point1.cx + point2.cx ) / 2;  // mid x value
//   var my = ( point1.cy + point2.cy ) / 2;  // mid y value
//   return { x: mx, y: my};
// }


// ////---EVENTS---////

// ///scaling
// window.addEventListener('resize', scaleToWindow);







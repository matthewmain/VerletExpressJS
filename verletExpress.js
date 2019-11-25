

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



  ////---OBJECTS---////


  ///point constructor
  Point: function( coordinates, materiality="material" ) {  // materiality can be "material" or "immaterial"
    VX.pointCount += 1;
    this.cx = coordinates.x;
    this.cy = coordinates.y; 
    if ( VX.dimensions = "3d" ) { this.cz = coordinates.z; }
    this.px = this.cx;  // previous x value
    this.py = this.cy;  // previous y value
    if ( VX.dimensions = "3d" ) { this.pz = this.cz; }  // previous z value
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
  Skin: function( pointIdArray, fillColor="blue", outlineColor="black" ) {
    VX.skinCount += 1;
    this.points = pointIdArray;  // an array of points for skin outline path
    this.fillColor = fillColor;
    this.outlineColor = outlineColor;
    this.id = VX.skinCount;
  },



  ////---FUNCTIONS---////


  ///creates a point object instance
  addPoint: function( coordinates, materiality="material" ) {
    VX.points.push( new VX.Point( coordinates, materiality ) );
    return VX.points[ VX.points.length-1 ];
  },

  ///creates a span object instance
  addSpan: function( point1Id, point2Id ) {
    VX.spans.push( new VX.Span( VX.getPoint( point1Id ), VX.getPoint( point2Id ) ) );
    return VX.spans[ VX.spans.length-1 ];
  },

  ///creates a skin object instance
  addSkin: function( pointIdArray, fillColor="blue", outlineColor="black" ) {
    var skinPointsArray = [];
    for ( var i=0; i<pointIdArray.length; i++ ) {
      for( var j=0; j<VX.points.length; j++ ){ 
        if ( VX.points[j].id == pointIdArray[i] ) { 
          skinPointsArray.push( VX.points[j] ); 
        }
      }
    }
    VX.skins.push( new VX.Skin( skinPointsArray, fillColor, outlineColor ) );
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

  ///gets distance between two points
  distance: function( point1, point2 ) {
    var xDiff = point2.cx - point1.cx;
    var yDiff = point2.cy - point1.cy;
    var xyDist = Math.sqrt( xDiff*xDiff + yDiff*yDiff );
    if ( VX.dimensions == "2d" ) {
      return xyDist;
    } else if ( VX.dimensions == "3d" ) {
      var zDiff = point2.cz - point1.cz;
      var xzDist = Math.sqrt( xyDist*xyDist + zDiff*zDiff );
      return xzDist;
    }
  },

  ///gets a point by id number
  getPoint: function( id ) {
    for ( var i=0; i<VX.points.length; i++ ) { 
      if ( VX.points[i].id == id ) { return VX.points[i]; }
    }
  },

  ///updates point positions based on verlet velocity (i.e., current coord minus previous coord)
  updatePoints: function() {
    for ( var i=0; i<VX.points.length; i++ ) {
      var p = VX.points[i];  // point object
      if ( !p.fixed ) {
        //x
        var xv = (p.cx - p.px) * VX.friction;  // x velocity
        p.px = p.cx;  // updates previous x as current x
        p.cx += xv;  // updates current x with new velocity
        if ( VX.worldTime % VX.rib( 100, 200 ) == 0 ) { p.cx += VX.rfb( -VX.breeze, VX.breeze ); }  // apply breeze to x
        //y
        var yv = (p.cy - p.py) * VX.friction;  // y velocity
        p.py = p.cy;  // updates previous y as current y
        if ( VX.dimensions == "2d") { p.cy += VX.gravity * p.mass; } else { p.cy -= VX.gravity * p.mass; }  // apply gravity
        p.cy += yv;  // updates current y with new velocity
        //z
        if ( VX.dimensions == "3d" ) { 
          var zv = (p.cz - p.pz) * VX.friction; // z velocity
          p.pz = p.cz;  // updates previous z as current z
          p.cz += zv;  // updates current z with new velocity
        }
        //skidloss
        if ( VX.dimensions == "3d" ) {  // apply skidloss to x
          if ( VX.yRange.min != null && p.cy <= VX.yRange.min+p.width/2 ) { xv *= VX.skidLoss; zv *= VX.skidLoss; }  
        } else if ( VX.dimensions == "2d" ) {
          if ( VX.yRange.max != null && p.cy >= VX.yRange.max-p.width/2 ) { xv *= VX.skidLoss; }  
        }
      }
    }
  },

  ///applies boundaries
  applyBoundaries: function() {
    for ( var i=0; i<VX.points.length; i++ ) {
      var p = VX.points[i];
      var pr = p.width/2;  // point radius
      var xv = p.cx - p.px;  // x velocity
      var yv = p.cy - p.py;  // y velocity
      var zv = p.cz - p.pz;  // z velocity
      if ( p.materiality == "material" ) {
        //left/right boundary
        if ( VX.xRange.min != null && p.cx < VX.xRange.min + pr ) {
          p.cx = VX.xRange.min + pr;  // move point back to boundary
          p.px = p.cx + xv * VX.bounceLoss;  // reverse velocity
        } else if ( VX.xRange.max != null && p.cx > VX.xRange.max - pr ) { 
          p.cx = VX.xRange.max - pr;
          p.px = p.cx + xv * VX.bounceLoss;
        }
        //top/bottom boundary
        if ( VX.yRange.min != null && p.cy < VX.yRange.min + pr ) { 
          p.cy = VX.yRange.min + pr;
          p.py = p.cy + yv * VX.bounceLoss;
        } else if ( VX.yRange.max != null && p.cy > VX.yRange.max - pr ) {
          p.cy = VX.yRange.max - pr;
          p.py = p.cy + yv * VX.bounceLoss;
        }
        //front/back boundary
        if ( VX.zRange.min != null && p.cz < VX.zRange.min + pr ) { 
          p.cz = VX.zRange.min + pr;
          p.pz = p.cz + zv * VX.bounceLoss;
        } else if ( VX.zRange.max != null && p.cz > VX.zRange.max - pr ) {
          p.cz = VX.zRange.max - pr;
          p.pz = p.cz + zv * VX.bounceLoss;
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
        var dz = s.p2.cz - s.p1.cz;  // distance between z values
        var d = VX.distance( s.p1, s.p2 );
        var r = s.l / d;  // ratio (span length over distance between points)
        var mx = s.p1.cx + dx / 2;  // midpoint between x values 
        var my = s.p1.cy + dy / 2;  // midpoint between y values
        var mz = s.p1.cz + dz / 2;  // midpoint between z values
        var ox = dx / 2 * r;  // offset of each x value (compared to span length)
        var oy = dy / 2 * r;  // offset of each y value (compared to span length)
        var oz = dz / 2 * r;  // offset of each z value (compared to span length)
        if ( !s.p1.fixed ) {
          s.p1.cx = mx - ox;  // updates span's first point x value
          s.p1.cy = my - oy;  // updates span's first point y value
          if ( VX.dimensions == "3d" ) { s.p1.cz = mz - oz; }  // updates span's first point z value
        }
        if ( !s.p2.fixed ) {
          s.p2.cx = mx + ox;  // updates span's second point x value
          s.p2.cy = my + oy;  // updates span's second point y value
          if ( VX.dimensions == "3d" ) { s.p2.cz = mz + oz; }  // updates span's second point z value
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
        VX.ctx.strokeStyle = s.strokeColor;
        VX.ctx.lineWidth = 0;
        VX.ctx.lineJoin = "round";
        VX.ctx.lineCap = "round";
        VX.ctx.fillStyle = s.fillColor;
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
      VX.ctx.clearRect(0, 0, VX.interfaceWidth, VX.interfaceHeight);
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

  ///random integer between two numbers (min/max inclusive)
  rib: function( min, max ) {
    return Math.floor( Math.random() * ( Math.floor(max) - Math.ceil(min) + 1 ) ) + Math.ceil(min);
  },

  ///random float between two numbers
  rfb: function( min, max ) {
    return Math.random() * ( max - min ) + min;
  },



  ////---INITIALIZATION---////


  ///initializes physics environment
  initialize: function( dimensions, medium, targetElementId, interfaceWidth, interfaceHeight ) { 
    VX.dimensions = dimensions.toLowerCase();
    //2D
    if ( VX.dimensions == "2d") { 
      VX.medium = medium.toLowerCase(); 
      //canvas
      if ( VX.medium == "canvas" ) {
        VX.canvas = document.getElementById( targetElementId );
        VX.ctx = VX.canvas.getContext("2d");
        VX.interfaceWidth = interfaceWidth;
        VX.interfaceHeight = interfaceHeight; 
        VX.canvas.width = VX.interfaceWidth;
        VX.canvas.height = VX.interfaceHeight;
        VX.xRange = { min: 0, max: VX.interfaceWidth };
        VX.yRange = { min: 0, max: VX.interfaceHeight };
      //svg
      } else if ( VX.medium == "svg" ) {
        //...
      }
    //3D
    } else if ( VX.dimensions == "3d" ) {
      VX.xRange = { min: null, max: null };
      VX.yRange = { min: null, max: null };
      VX.zRange = { min: null, max: null };
    }
    VX.run();
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






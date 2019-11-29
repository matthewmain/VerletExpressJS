

////////////////////////////////////////////////////////////////
////////////////////  Verlet Express JS  ///////////////////////
////////////////////////////////////////////////////////////////

// A lightweight Verlet integration physics engine for 2D or 3D scenes.
// © Matthew Main 2019


 

var VX = {



  ////---SETTINGS---////


  viewPoints: false,  // point visibility (2D)
  viewSpans: false,  // span visibility (2D)
  viewSkins: true, // skin visibility (2D)
  xRange: { min: null, max: null },  // min & max x values (objects bounce at values; null is infinite space)
  yRange: { min: null, max: null },  // min & max y values (objects bounce at values; null is infinite space)
  zRange: { min: null, max: null },  // min & max z values (objects bounce at values; null is infinite space)
  pointsCollide: true,  // whether points collide with one other or pass through one another
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
    this.cx = coordinates.x;  // current x value
    this.cy = coordinates.y;  // current y value
    if ( VX.dimensions == "3d" ) { this.cz = coordinates.z; }  // current z value
    this.px = this.cx;  // previous x value
    this.py = this.cy;  // previous y value
    if ( VX.dimensions == "3d" ) { this.pz = this.cz; }  // previous z value
    this.mass = 1;  // (as ratio of gravity)
    this.width = 0;
    this.color = "black";
    this.materiality = materiality;  // "material" points collide with obstacles; "immaterial" points don't
    this.fixed = false;  // whether the point moves in response to physics or remains in a fixed position
    this.id = VX.pointCount;
  },

  ///span constructor (arguments can be point objects or point ids)
  Span: function( point1, point2 ) {
    VX.spanCount += 1;
    if ( Number.isInteger( point1 ) ) { this.p1 = VX.getPoint( point1 ); } else { this.p1 = point1; }
    if ( Number.isInteger( point2 ) ) { this.p2 = VX.getPoint( point2 ); } else { this.p2 = point2; }
    this.l = VX.distance( this.p1, this.p2 ); // length
    this.strength = 1;  // (as ratio of rigidity)
    this.color = "lightgray";
    this.id = VX.spanCount;
  },

  ///skins constructor 
  Skin: function( pointsArray, stylesObject ) {
    VX.skinCount += 1;
    this.points = pointsArray;  // an array of points for skin outline path (can be point objects or point ids)
    this.fillColor = stylesObject.fillColor;
    this.outlineColor = stylesObject.outlineColor;
    this.outlineThickness = stylesObject.outlineThickness;
    this.id = VX.skinCount;
  },



  ////---FUNCTIONS---////


  ///creates a point object instance
  addPoint: function( coordinates, materiality="material" ) {
    VX.points.push( new VX.Point( coordinates, materiality ) );
    return VX.points[ VX.points.length-1 ];
  },

  ///creates a span object instance (arguments can be point objects or point ids)
  addSpan: function( point1, point2 ) {
    VX.spans.push( new VX.Span( point1, point2 ) );
    return VX.spans[ VX.spans.length-1 ];
  },

  ///creates a skin object instance 
  addSkin: function( pointsArray, stylesObject ) {
    var skinPointsArray = [];
    for ( var i=0; i<pointsArray.length; i++ ) {
      for( var j=0; j<VX.points.length; j++ ){ 
        var pointId = Number.isInteger(pointsArray[i]) ? VX.getPoint(pointsArray[i]).id : pointsArray[i].id;
        if ( VX.points[j].id == pointId ) { 
          skinPointsArray.push( VX.points[j] ); 
        }
      }
    }
    VX.skins.push( new VX.Skin( skinPointsArray, stylesObject ) );
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

  ///gets distance between two points' centers
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

  ///gets distance between two points' surfaces
  surfaceDistance: function( point1, point2 ) {
    var centerDist = VX.distance( point1, point2 );
    return centerDist - ( point1.width/2 + point2.width/2 );
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
        //stores velocity
        var xv = ( p.cx - p.px ) * VX.friction;  // x velocity
        var yv = ( p.cy - p.py ) * VX.friction;  // y velocity
        if ( VX.dimensions == "3d" ) { var zv = ( p.cz - p.pz ) * VX.friction; } // z velocity
        //applies verlet
        p.px = p.cx;  // updates previous x as current x
        p.py = p.cy;  // updates previous y as current y
        if ( VX.dimensions == "3d" ) { p.pz = p.cz; }  // updates previous z as current z
        //applies skidloss
        if ( VX.dimensions == "3d" ) {  
          if ( VX.yRange.min != null && p.cy <= VX.yRange.min+p.width/2 ) { xv *= VX.skidLoss; zv *= VX.skidLoss; }  
        } else if ( VX.dimensions == "2d" ) {
          if ( VX.yRange.max != null && p.cy >= VX.yRange.max-p.width/2 ) { xv *= VX.skidLoss; }  
        }
        //applies velocity
        p.cx += xv; 
        p.cy += yv; 
        if ( VX.dimensions == "3d" ) { p.cz += zv; }
        //applies gravity
        if ( VX.dimensions == "2d") { p.cy += VX.gravity * p.mass; } else { p.cy -= VX.gravity * p.mass; } 
        //applies breeze
        if ( VX.worldTime % VX.rib( 100, 200 ) == 0 ) { p.cx += VX.rfb( -VX.breeze, VX.breeze ); }  
      }
    }
  },

  ///applies collisions (objects bounce off of walls and/or points bounce off one other)
  applyCollisions: function() {
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
        //point collisions
        if ( VX.pointsCollide ) {
          for ( var j=0; j<VX.points.length; j++ ) {
            var p2 = VX.points[j];  // second point
            var xv2 = ( p2.cx - p2.px );  // marble 2 x velocity
            var yv2 = ( p2.cy - p2.py );  // marble 2 y velocity
            var zv2 = ( p2.cz - p2.pz );  // marble 2 z velocity
            var cd = VX.distance( p, p2 );  // distance between point centers
            var sd = VX.surfaceDistance( p, p2 );  // distance between surfaces
            //if marbles are overlapping (and marble is not self),
            if ( sd < 0 && p.id != p2.id ) { 
              //get depth of overlap for x & y (based on ratio of sd/cd to x & y depth/diff)
              var xDiff = p.cx - p2.cx;  // x difference between marbles
              var yDiff = p.cy - p2.cy;  // y difference between marbles
              var xDepth = xDiff * sd / cd;  // x depth of overlap
              var yDepth = yDiff * sd / cd;  // y depth of overlap
              //move marbles' x and y values back by half of shared depth each (altering velocities)
              p.cx -= xDepth * 0.5;
              p.cy -= yDepth * 0.5;
              p2.cx += xDepth * 0.5;
              p2.cy += yDepth * 0.5;
            }
          }
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
      VX.applyCollisions();
    }
  },

  ///displays points
  renderPoints: function() {
    if ( VX.medium == "canvas" ) {
      for ( var i=0; i<VX.points.length; i++ ) {
        var p = VX.points[i];
        var radius = p.width >= 2 ? p.width/2 : 1;
        VX.ctx.beginPath();
        VX.ctx.fillStyle = p.color;
        VX.ctx.arc( p.cx, p.cy, radius, 0 , Math.PI*2 );
        VX.ctx.fill();
      }
    } else if ( VX.medium == "svg" ) {
      if ( !VX.svgPointsAddedToDOM ) {
        for ( var i=0; i<VX.points.length; i++ ) {
          var p = VX.points[i];
          var pointCircle = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
          pointCircle.classList.add( "point" );
          pointCircle.id = "pt"+p.id;
          pointCircle.fill = p.color;
          pointCircle.cx = p.cx;
          pointCircle.cy = p.cy;
          pointCircle.r = "1";
          VX.svg.appendChild( pointCircle );
          VX.svgPointsAddedToDOM = true;
        }
      } else {
        for ( var i=0; i<VX.points.length; i++ ) {
          var p = VX.points[i];
          var pointCircle = document.getElementById( "pt"+p.id );
          pointCircle.setAttribute( "fill", p.color );
          pointCircle.setAttribute( "cx", p.cx );
          pointCircle.setAttribute( "cy", p.cy );
          pointCircle.setAttribute( "r", 1 );
        }
      }
    }
  },

  ///displays spans
  renderSpans: function() {
    if ( VX.medium == "canvas" ) {
      for ( var i=0; i<VX.spans.length; i++ ) {
        var s = VX.spans[i];
        VX.ctx.beginPath();
        VX.ctx.lineWidth = "1";
        VX.ctx.strokeStyle = s.color;
        VX.ctx.moveTo(s.p1.cx, s.p1.cy);
        VX.ctx.lineTo(s.p2.cx, s.p2.cy);
        VX.ctx.stroke(); 
      }
    } else if ( VX.medium == "svg" ) {
      if ( !VX.svgSpansAddedToDOM ) {
        for ( var i=0; i<VX.spans.length; i++ ) {
          var s = VX.spans[i];
          var spanPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          spanPath.classList.add( "span" );
          spanPath.id = "sp"+s.id;
          spanPath.style.stroke = s.color;
          spanPath.style.strokeWidth = "1";
          var pathString = "M" + s.p1.cx + "," + s.p1.cy + " " + "L" + s.p2.cx + "," + s.p2.cy + " " + "Z";
          spanPath.setAttribute("d", pathString );
          VX.svg.appendChild( spanPath );
          VX.svgSpansAddedToDOM = true;
        }
      } else {
        for ( var i=0; i<VX.spans.length; i++ ) {
          var s = VX.spans[i];
          var spanPath = document.getElementById("sp"+s.id);
          var pathString = "M" + s.p1.cx + "," + s.p1.cy + " " + "L" + s.p2.cx + "," + s.p2.cy + " " + "Z";
          spanPath.setAttribute("d", pathString);
        }
      }
    }
  },

  ///displays skins 
  renderSkins: function() {
    if ( VX.medium == "canvas" ) {
      for ( var i=0; i<VX.skins.length; i++ ) {
        var s = VX.skins[i];
        VX.ctx.lineJoin = "round";
        VX.ctx.lineCap = "round";
        VX.ctx.beginPath();
        VX.ctx.fillStyle = s.fillColor;
        VX.ctx.strokeStyle = s.outlineColor;
        VX.ctx.lineWidth = s.outlineThickness;
        VX.ctx.moveTo(s.points[0].cx, s.points[0].cy);
        for ( var j=1; j<s.points.length; j++) { VX.ctx.lineTo(s.points[j].cx, s.points[j].cy); }
        VX.ctx.lineTo(s.points[0].cx, s.points[0].cy);
        VX.ctx.stroke();
        VX.ctx.fill();  
      }
    } else if ( VX.medium == "svg") {
      if ( !VX.svgSkinsAddedToDOM ) {
        for ( var i=0; i<VX.skins.length; i++ ) {
          var s = VX.skins[i];
          var skinPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          skinPath.classList.add("skin");
          skinPath.id = "sk"+s.id;
          skinPath.style.fill = s.fillColor;
          skinPath.style.stroke = s.outlineColor;
          skinPath.style.strokeWidth = s.outlineThickness;
          var pathString = "M" + (s.points[0].cx) + "," + s.points[0].cy + " ";
          for ( var j=1; j<s.points.length; j++ ) {
            pathString += "L" + (s.points[j].cx) + "," + s.points[j].cy + " ";
          }
          pathString += "Z";
          skinPath.setAttribute("d", pathString );
          VX.svg.appendChild( skinPath );
          VX.svgSkinsAddedToDOM = true;
        }
      } else {
        for ( var i=0; i<VX.skins.length; i++ ) {
          var s = VX.skins[i];
          var skinPath = document.getElementById("sk"+s.id);  // gets svg element by id value
          var pathString = "M" + (s.points[0].cx) + "," + s.points[0].cy + " ";
          for (j=1; j<s.points.length; j++) {
            pathString += "L" + (s.points[j].cx) + "," + s.points[j].cy + " ";
          }
          pathString += "Z";
          skinPath.setAttribute("d", pathString);
        }
      }
    }
  },

  ///clears canvas frame
  clearCanvas: function() {
    if ( VX.medium == "canvas" ) {
      VX.ctx.clearRect(0, 0, VX.interfaceWidth, VX.interfaceHeight);
    }   
  },

  ///renders all visible components (2D)
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

  ///runs every frame refresh (an empty function in which to add custom scripts)
  runOnFrameRefresh: function() { },



  ////---INITIALIZATION---////


  ///initializes physics environment
  initialize: function( dimensions, medium, targetElementId, interfaceWidth, interfaceHeight ) { 
    VX.dimensions = dimensions.toLowerCase();
    //2D
    if ( VX.dimensions == "2d") { 
      VX.medium = medium.toLowerCase(); 
      VX.interfaceWidth = interfaceWidth;
      VX.interfaceHeight = interfaceHeight; 
      VX.xRange = { min: 0, max: VX.interfaceWidth };
      VX.yRange = { min: 0, max: VX.interfaceHeight };
      //canvas
      if ( VX.medium == "canvas" ) {
        VX.canvas = document.getElementById( targetElementId );
        VX.ctx = VX.canvas.getContext("2d");
        VX.canvas.width = VX.interfaceWidth;
        VX.canvas.height = VX.interfaceHeight;
      //svg
      } else if ( VX.medium == "svg" ) {
        VX.svg = document.getElementById( targetElementId );
        VX.svg.setAttribute("viewBox", `0 0 ${VX.interfaceWidth} ${VX.interfaceHeight}` );
        VX.svgPointsAddedToDOM = false;
        VX.svgSpansAddedToDOM = false;
        VX.svgSkinsAddedToDOM = false;
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
    VX.clearCanvas();
    VX.renderImages();
    VX.runOnFrameRefresh();
    VX.worldTime++;
    window.requestAnimationFrame( VX.run );
  },



}






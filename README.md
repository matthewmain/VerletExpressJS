
#Verlet Express


	+initiation
  //dimensions can be "2d" or "3d"; 
  //medium (2d only) can be "canvas" or "svg"
  //targetElementId (2d only) should be an id associated with the target canvas or svg element
  //interfaceWidth/Height (2d only) will set the canvas or svg element's dimensions


  +runOnFrameRefresh section


  +skins constructor 
  //pointsArray can be an array of point objects or point ids
  //stylesObject: {fillColor: <string>, outlineColor: <string>, outlineThickness: <string>}


###2D

Y values correspond to canvas positions, so they _increase_ downwards.



###3D

Y values corresppnd to 3D axis, so they _decrease_ downwards.



+ADD POINT COLLISIONS; USE EDIBLE MARBLES AS TEST CASE/EXAMPLE
/* global d3, THREE */
//----------------------------------------------------------------------------
// opts
// {
//  height: width,
//  width: depth,
//  linesHeight: b,
//  linesWidth: c,
//  color: 0xcccccc
// }
//
//____________________________________________________________________________

let regularSample = (range, x) => {
  let r = d3.range(x)
  let s = d3.scalePoint().domain(r).range(range)
  return r.map(d => s(d))
}

export function createScaleGrid(scaleW, scaleH, color=0xcccccc, gridNum=10, opacity=0.2) {

  let grids
  let W = Math.abs(scaleW.range()[1] - scaleW.range()[0])
  let H = Math.abs(scaleH.range()[1] - scaleH.range()[0])
  let w = (scaleW.bandwidth !== undefined)?scaleW.bandwidth(): W/gridNum
  let h = (scaleH.bandwidth !== undefined)?scaleH.bandwidth(): H/gridNum

  let material = new THREE.LineBasicMaterial({
    color: color,
    opacity: opacity
  })

  let gridObject = new THREE.Object3D(),
      gridGeo = new THREE.Geometry()

  // width
  if(scaleW.__type == "ordinal") {
    grids = scaleW.domain()
  } else {
    grids = regularSample(scaleW.domain(), gridNum)
  }

  grids.forEach(g => {
    gridGeo.vertices.push(new THREE.Vector3(scaleW(g), scaleH.range()[0], 0))
    gridGeo.vertices.push(new THREE.Vector3(scaleW(g), scaleH.range()[1], 0))
  })

  // height
  if(scaleH.__type == "ordinal") {
    grids = scaleH.domain()
  } else {
    grids = regularSample(scaleH.domain(), gridNum)
  }

  grids.forEach(g => {
    gridGeo.vertices.push(new THREE.Vector3(scaleW.range()[0], scaleH(g), 0))
    gridGeo.vertices.push(new THREE.Vector3(scaleW.range()[1], scaleH(g), 0))
  })

  let line = new THREE.Line(gridGeo, material, THREE.LinePieces)
  gridObject.add(line)

  return gridObject
}


export function createAGrid(opts) {
  var config = opts || {
    height: 500,
    width: 500,
    linesHeight: 10,
    linesWidth: 10,
    color: 0xDD006C
  }

  var material = new THREE.LineBasicMaterial({
    color: config.color,
    opacity: 0.2
  })

  var gridObject = new THREE.Object3D(),
    gridGeo = new THREE.Geometry(),
    stepw = 2 * config.width / config.linesWidth,
    steph = 2 * config.height / config.linesHeight

  //width
  for (var i = -config.width; i <= config.width; i += stepw) {
    gridGeo.vertices.push(new THREE.Vector3(-config.height, i, 0))
    gridGeo.vertices.push(new THREE.Vector3(config.height, i, 0))

  }
  //height
  for (i = -config.height; i <= config.height; i += steph) {
    gridGeo.vertices.push(new THREE.Vector3(i, -config.width, 0))
    gridGeo.vertices.push(new THREE.Vector3(i, config.width, 0))
  }

  var line = new THREE.Line(gridGeo, material, THREE.LinePieces)
  gridObject.add(line)

  return gridObject
}

export function createAxesGrids(dataCluster) {

  let boundingGrid = new THREE.Object3D()
  let axesGridXY = createScaleGrid(
    dataCluster.getAxisScale("x"),
    dataCluster.getAxisScale("y"),
    0xff0000)
  axesGridXY.position.z = dataCluster.getAxisScale("z").range()[0]

  let axesGridYZ = createScaleGrid(
    dataCluster.getAxisScale("z"),
    dataCluster.getAxisScale("y"),
    0x00ff00)
  axesGridYZ.rotation.y = Math.PI/2
  axesGridYZ.position.x = dataCluster.getAxisScale("x").range()[0]

  let axesGridXZ = createScaleGrid(
    dataCluster.getAxisScale("x"),
    dataCluster.getAxisScale("z"),
    0x0000ff)
  axesGridXZ.rotation.x = Math.PI/2
  axesGridXZ.position.y = dataCluster.getAxisScale("y").range()[0]


  boundingGrid.add(axesGridXY)
  boundingGrid.add(axesGridYZ)
  boundingGrid.add(axesGridXZ)

  dataCluster.el.setObject3D("grid", boundingGrid)
}

// export function _createAxesGrid(dataCluster, gridNum=10) {

//  	var boundingGrid = new THREE.Object3D(),
// 			depth = graphDimensions.w/2, //depth
// 			width = graphDimensions.d/2, //width
// 			height = graphDimensions.h/2, //height
// 			a =data.labels.y.length,
// 			b= data.labels.x.length,
// 			c= data.labels.z.length;

// 	//pink
// 	var newGridXY = createAGrid({
// 				height: width,
// 				width: height,
// 				linesHeight: b,
// 				linesWidth: a,
// 				color: 0xcccccc
// 			});
// 			//newGridXY.position.y = height;
// 	  	newGridXY.position.z = -depth;
// 			boundingGrid.add(newGridXY);

// 	//blue
// 	var newGridYZ = createAGrid({
// 				height: width,
// 				width: depth,
// 				linesHeight: b,
// 				linesWidth: c,
// 				color: 0xcccccc
// 			});
// 	 		newGridYZ.rotation.x = Math.PI/2;
// 	 		newGridYZ.position.y = -height;
// 			boundingGrid.add(newGridYZ);

// 	//green
// 	var newGridXZ = createAGrid({
// 				height: depth,
// 				width: height,
// 				linesHeight:c,
// 				linesWidth: a,
// 				color: 0xcccccc
// 			});

// 			newGridXZ.position.x = width;
// 			//newGridXZ.position.y = height;
// 	 		newGridXZ.rotation.y = Math.PI/2;
// 			boundingGrid.add(newGridXZ);

// 	glScene.add(boundingGrid);

// }

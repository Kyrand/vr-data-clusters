/* global THREE */
export default {
  getPointsInCuboid(xFaces, yFaces, zFaces, width, startPt=false, centeredFlag=false) {
    if (!startPt) startPt = new THREE.Vector3(0, 0, 0)
    let points = []

    if(centeredFlag) {
      startPt.set(width * (-xFaces/2), width * (-yFaces/2), width * (-zFaces/2) )
    }

    for(let y=0; y<yFaces; y++)
      for(let z=0; z<zFaces; z++)
        for(let x=0; x<xFaces; x++) {
          let p = new THREE.Vector3(x * width, y * width, z * width)
          points.push(p.add(startPt))
        }

    return points
  },

  getHighestPosition(pts) {
    let highY = -999999999
    pts.forEach(pt => {
      if(pt.y > highY) highY = pt.y
    })
    return highY
  }

}

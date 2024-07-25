/* global AFRAME, THREE */
import afu from "../aframe-utils"
import cfg from "../config"

AFRAME.registerComponent("data-crucible", {

  schema: {
    key: {type: "string"}
  },

  init() {
    console.log("Creating dataset: " + this.data.key)
    let el = this.el
    el.sceneEl.addEventListener("hitstart", (evt) => {
      console.log("Data-crucible hit!")
      let dskey = this.getDatasetKey(evt)
      if(dskey) {
        this.endGrab(evt)
        let sl = afu.SceneLoader()
        // let pos = this.el.object3D.position.clone()
        // pos.y += afu.strToVec3(cfg.components["data-cluster"].scale).y/2
        // // pos.y += afu.strToVec3(cfg.components["data-crucible"].scale).y/2
        // pos.y += 0.2
        sl.addTemplate("data-cluster", {
          ...cfg.datasets[dskey],
          position: afu.Vec3ToStr(cfg.cluster.pos)
        })
      }
    })
  },

  endGrab(evt) {
    let gb = evt.srcElement.components.grabbable
    if(gb.grabbers.length > 0) {
      let sh = gb.grabbers[0].components["super-hands"]
      console.log("Ungrabbing the dataset!")
      sh.onGrabEndButton()
    }
  },

  getDatasetKey(evt) {
    let dataset
    if(!evt.detail) return null

    // this is a dataset object we've collided with?
    dataset = evt.srcElement.components.dataset
    if(dataset) {
      return dataset.data.key
    }
  },

  update() {

  },

  tick(time, delta) {

  }
})

/* global AFRAME */

AFRAME.registerComponent("dataset", {

  schema: {
    key: {type: "string"}
  },

  init() {
    console.log("Creating dataset: " + this.data.key)
    let el = this.el
    let defaultPos = this._defaultPos = el.object3D.position.clone()
    el.sceneEl.addEventListener("hitstart", (evt) => {
      console.log("Dataset hit!")
      console.log(evt)
      el.object3D.position.copy(defaultPos)
      el.components["dynamic-body"].syncToPhysics()
    })
  },

  update() {

  },

  tick(time, delta) {

  }
})

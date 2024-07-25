/* global AFRAME */
import globe from "./globe"

AFRAME.registerComponent("data-globe", {

  schema: {
    key: {type: "string"}
  },

  init() {
    console.log("Creating dataset: " + this.data.key)
    this._world = globe(this.el)
  },

  update() {

  },

  tick(time, delta) {

  }
})

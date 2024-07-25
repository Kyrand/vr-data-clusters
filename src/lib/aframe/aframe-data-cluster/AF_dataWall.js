/* global AFRAME, THREE */
import afu from "../aframe-utils"
import store from "./store"
import {select, scaleBand, range} from "d3"
import cfg from "../config"

AFRAME.registerComponent("data-wall", {

  schema: {
    key: {type: "string"},
    width: {type: "number", default: 2},
    height: {type: "number", default: 2}
  },

  init() {
    console.log("Creating data-wall: " + this.data.key)
  },

  update(oldData) {
    if (Object.keys(oldData).length === 0) { return }
    afu.log("Updated data-wall: " + this.data)
    //if(oldData.key !== this.data.key) {}
  },

  onDataChange(data) {
    if(!this._initialized) {
      let el = select(this.el)
      let sceneLoader = afu.SceneLoader()
      let chartableFields = data.fields.filter(f => cfg.datasets[data.key].ignoreFields.indexOf(f) === -1)
      afu.log("Chartable fields: ", chartableFields)
      let grids = Math.ceil(Math.sqrt(chartableFields.length))
      let scale = scaleBand()
          .domain(range(grids))
          .padding(0.1)
          .range([-this.data.width/2, this.data.width/2])
      let w = scale.bandwidth()
      chartableFields.forEach((f, i) => {
        let x = scale(i%grids) + w/2
        let y = scale(parseInt(i/grids)) + w/2
        sceneLoader.addTemplate("data-chart", {
          position: `${x} ${y} 0.05`,
          width: w, height: w,
          xKey: f

        }, el)
      })
      this._initialized = true
    }
  },

  tick(time, delta) {}
})

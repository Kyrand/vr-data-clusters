/* global AFRAME, THREE */
import {select} from "d3"
import PS from "pubsub-js"

import afu from "../aframe-utils"
import store from "./store"
import {Barchart} from "./charts"


AFRAME.registerComponent("data-chart", {

  schema: {
    type: {type: "string", default: "bar"},
    key: {type: "string"},
    xKey: {type: "string"},
    yKey: {type: "string", default: ""},
    width: {type: "int", default: 1200},
    height: {type: "int", default: 1200}
  },

  init() {
    afu.log("Creating data-chart: " + this.data.key)
    this._canvas = document.createElement("canvas")
    //this._canvas = document.querySelector("canvas#test-canvas")
    this._chart = Barchart({
      xKey: this.data.xKey,
      canvas: this._canvas
    })
    this._texture = new THREE.Texture(this._canvas)
    this._texture.needsUpdate = true
    this._material = new THREE.MeshBasicMaterial({
      map: this._texture
    })
    let plane = this.el.children[0].getObject3D("mesh")
    plane.material = this._material
    //this.testCanvas()
    // PS.subscribe(store.evt.DATA_STREAM, (msg, data) => {
    //   afu.log("data stream channel publishing..", {msg, data})
    // })
  },

  testCanvas() {
    let ctx = this._canvas.getContext("2d")
    ctx.fillStyle = "red"
    ctx.font = "36px Georgia"
    ctx.fillText("Hello World!", 0, 0)
  },

  update(oldData) {
    if (Object.keys(oldData).length === 0) { return }
    afu.log("Updated chart data: " + this.data.key)
    // if(oldData.key !== this.data.key) {
    //   this._dataset = store.action("GET_CHART_DATA", this.data.key)
    //   afu.log("Updated dataset:", this._dataset)
    //   this.updateChart(this._dataset.data)
    // }
  },

  onDataChange(data) {
    this._chart.update(data.data)
    this._texture.needsUpdate = true
  },

  tick(time, delta) { }
})

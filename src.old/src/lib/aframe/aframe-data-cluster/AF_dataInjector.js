/* global AFRAME, THREE */
import PS from "pubsub-js"

import _ from "lodash"
import afu from "../aframe-utils"
import store from "./store"

AFRAME.registerComponent("data-injector", {

  schema: {
    key: {type: "string"},
    active: {type: "boolean", default: true}
  },

  init() {
    afu.log("Creating data-injector: " + this.data.key)
    this._data = store.getData()
    afu.log("Fetched data: ", this._data)

    this._dataComponents = []
    _.each(this.el.components, (v) => {
      if(v.attrName !== "data-injector" && v.attrName.startsWith("data-")) {
        this._dataComponents.push(v)
      }
    })
    this._componentsInitialized = false
    if(this._data) { this.handleDataInit("initial data load", this._data )}
    this.handleDataChange = this.handleDataChange.bind(this)
    PS.subscribe(store.evt.DATA_STREAM, this.handleDataChange)
  },

  handleDataInit(msg, data) {
    afu.log("INITIALIZE DATA COMPONENTS")
    this._componentsInitialized = true
    this._dataComponents.forEach(c => c.onDataInit && c.onDataInit(data))
  },

  handleDataChange(msg, data) {
    afu.log("INJECT DATA INTO COMPONENTS")
    if(!this._componentsInitialized) {
      this._componentsInitialized = true
      this._dataComponents.forEach(c => c.onDataInit && c.onDataInit(data))
    }
    this._dataComponents.forEach(c => c.onDataChange && c.onDataChange(data))
  },

  update(oldData) {
    if (Object.keys(oldData).length === 0) { return }
    afu.log("Updated data-injector: " + this.data)
    //if(oldData.key !== this.data.key) {}
  },

  tick(time, delta) {}
})

/* global dat, AFRAME */

AFRAME.registerComponent("datgui", {

  schema: {
    key: {type: "string"}
  },

  init() {
    let controllerEl = this.el
    console.log("Creating datgui.")

    const {camera, renderer} = this.el.sceneEl
    const scene = this.el.sceneEl.object3D

    dat.GUIVR.enableMouse(camera, renderer)

    let guiInput = dat.GUIVR.addInputObject(controllerEl.object3D);
    ["trigger", "trackpad", "grip"].forEach((baseEvent) => {
      ["up", "down"].forEach(e => {
        controllerEl.addEventListener(baseEvent + e, () => {
          let gripEvent = baseEvent === "grip"
          console.log((gripEvent ? "gripped" : "pressed") + " " + controllerEl + " " + e)
          let value = (e === "down")
          gripEvent ? guiInput.gripped(value) : guiInput.pressed(value)
        })
      })
    })
    scene.add(guiInput)
  },

  update() {

  },

  tick(time, delta) {

  }
})

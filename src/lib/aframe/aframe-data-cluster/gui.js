/* global dat */
import consts from "../consts"
import _ from "lodash"

let sayHello = () => {
  console.log("Hi, I'm the datgui menu!")
}

export default function(dataCluster) {
  let dc = dataCluster

  const {camera, renderer} = dc.el.sceneEl
  const scene = dc.el.sceneEl.object3D

  dat.GUIVR.enableMouse(camera, renderer);

  //  add an input object (any Object3D like ViveController or Camera)
  //  you can add multiple objects
  [dc.data.rightHandControl, dc.data.leftHandControl].forEach(controllerEl => {
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
  })

  dc.data.rightHandControl.addEventListener("menudown", ()=>sayHello() )

  // Create the GUIVR
  const gui = dat.GUIVR.create("Field selectors")
  gui.position.y = 2
  gui.position.z = -2
  gui.position.x = 1
  gui.rotation.x = -45
  scene.add(gui)

  // Bind callbacks to field selectors
  let fields = ["xField", "yField", "zField", "colorField", "groupField"]
  fields.map(field => {
    gui.add(dc.data, field, dc.fields)
      .listen()
      .onChange(dc.onChange.bind(dc))
  })

  let keys = _.keys(consts.CLOUD_TYPES)
  gui.add(dc.data, "cloudType", keys)
    .listen().onChange((type) => {
      dc.data.cloudType = type
      dc.onChange()
    })

  gui.add(dc.data, "jitterFactor", 0, 0.2)
    .listen()
    .onChange(dc.onChange.bind(dc))

}

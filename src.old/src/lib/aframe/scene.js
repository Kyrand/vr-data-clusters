//import "aframe-dev-components"
import * as d3 from "d3"
import "aframe-template-component"

import "./AF_components"
import cfg from "./config"
import afu from "./aframe-utils"
import "./aframe-utils"
import "./aframe-data-cluster"

function getParam(_param, deflt=null) {
  let param = new URLSearchParams(window.location.search).get(_param)
  if(param) return param
  return deflt
}

export default () => {

  document.addEventListener("keydown", (event) => {
    if(event.key === "n") { // "r"
      let n = d3.select("#cameraWrapper")
          .node()

      n.setAttribute("rotation", "0 0 0")
      n.setAttribute("position", "0 0 0.25")
    }
  })

  let api = {}
  let sceneLoader = afu.SceneLoader()
  api.loadBoids = (width=32, height=64) => {
    width = getParam("width", width)
    height = getParam("height", height)
    console.log(`Setting height ${height}, width ${width}`)
    // .attr("position", "100 0 0")
    // .attr("geometry", "primitive: sphere; radius: 1000")
    // .attr("material", "side: double")
    //.attr("rotation", "90 0 0")
    //.attr("scale", "0.25 0.25 0.25")
    //.attr("scale", "0.003 0.003 0.003")
    //.attr("scale", "0.0125 0.0125 0.0125")
    //d3.selectAll("[hand-controls]")
    //  .attr("data-whip", true)

    sceneLoader.addTemplate("data-whip", {
      hand: "right",
    }, "#cameraRig")

    sceneLoader.addTemplate("data-whip", {
      hand: "left",
    }, "#cameraRig")

    d3.select("a-scene")
      .append("a-entity")
      .attr("data-particles", `sim: boids; width: ${width}; height: ${height}`)
      //.attr("data-particles", "sim: boids; width: 128; particleNum: ")
  }

  api.loadScene = () => {
    // sceneLoader.addTemplate("gantry")
    // sceneLoader.addTemplate("dataset", {
    //   position: "-0.5 1 -0",
    //   rotation: "0 180 0",
    //   key: "titanic",
    //   label: cfg.datasets.titanic.title
    // })

    // sceneLoader.addTemplate("data-crucible", {
    //   position: afu.Vec3ToStr(cfg.crucible.pos),
    //   scale: afu.Vec3ToStr(cfg.crucible.scale)
    // })

    // sceneLoader.addTemplate("data-wall", {
    //   key: "titanic", position: afu.Vec3ToStr(cfg.dataWall.pos)
    // })

    // sceneLoader.addTemplate("data-chart", {
    //   xKey: "sex", position: "0 1 -0.75"
    // })

    // sceneLoader.addTemplate("data-globe", {
    //   key: "titanic", position: "0 1 -3"})

    // sceneLoader.addTemplate("data-cluster", {
    //   ...cfg.datasets.titanic,
    //   position: afu.Vec3ToStr(cfg.cluster.pos),
    // })

    // sceneEl.append("a-entity")
    //   .attr("template", "src: templates/dataset.html; type:nunjucks")
    //   .attr("data-position", "0 1 -1")

    d3.select("a-scene")
      .append("a-entity")
      .attr("data-particles", "sim: boids")
    // .attr("position", "100 0 0")
    // .attr("geometry", "primitive: sphere; radius: 1000")
    // .attr("material", "side: double")
    //.attr("rotation", "90 0 0")
    //.attr("scale", "0.25 0.25 0.25")
    //.attr("scale", "0.003 0.003 0.003")
    //.attr("scale", "0.0125 0.0125 0.0125")
    d3.selectAll("[hand-controls]")
      .attr("data-whip", true)
  }

  return api
}

// Age: 29
// Id : 0
// Name : "Allen, Miss. Elisabeth Walton"
// PClass : 1
// Sex : "female"
// Survived : 1
// boat : "2"
// body : null
// fare : 211.3375
// home.dest : "St Louis, MO"
// parch : 0
// sibsp : 0
// ticket : "24160"

/* global THREE */
import "./index.css"
import * as d3 from "d3"
import * as topojson from "topojson-client"

export default function(globeEl) {

  let genKey = function (arr) {
    let key = '';
    arr.forEach(function (str) {
      key += str.toLowerCase().replace(/[^a-z0-9]/g, '');
    });
    return key;
  };

  // used for working with three.js globe and lat/lon
  let twoPI = Math.PI * 2;
  let halfPI = Math.PI / 2;;

  let world = {
    glEl : {},
    sunColor     : '#fbfccc',
    countryColor : d3.rgb('orange').darker().darker().toString(),
    waterColor   : '#0419a0',
    gratiColor   : '',
    landColor    : '#185f18',
    borderColor  : '',
    //d3Canvas     : d3.select('#d3-canvas'),
    d3Canvas     : document.createElement("canvas"),
    projection   : d3.geoEquirectangular().translate([1024, 512]).scale(325),
    sphereRadius : 0.5,

    geoCache : {
      keys : {},
      textures: [],
      init :  function (countries, names) {
        let self = this;
        this.countries = countries.filter(function(d) {
          return names.some(function(n) {
            if (d.id == n.name) {
              d.name = d.id;
              return d.id = n.id;
            }
          });
        }).sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });
        this.countries.forEach(function(country, cx) {
          country.key = genKey([country.name, country.id])
          self.keys[country.id] = { name: country.name, idx : cx };
        });
      }
    },

    init : function (opts) {
      //this.glEl = d3.select(opts.selector);
      this.d3Canvas.setAttribute("width", "2048px")
      this.d3Canvas.setAttribute("height", "1024px")

      this.slug = d3.select('#slug');

      this.gratiColor = d3.rgb(this.sunColor).darker().toString();
      this.borderColor = d3.rgb(this.landColor).darker().toString();

      let countries = topojson.feature(opts.data, opts.data.objects.countries).features;

      this.geoCache.init(countries, opts.names);

      this.initD3(opts);
    },

    initD3 : function(opts) {
      // will create textures for three.js globe
      this.land = topojson.feature(opts.data, opts.data.objects.countries);
      this.borders = topojson.mesh(
        opts.data, opts.data.objects.countries, function(a, b) { return a !== b; }
      );
      //this.initThree({ selector: opts.selector, land : land, borders : borders });
      this.initThree()
    },

    //scene : new THREE.Scene(),
    globeEl : globeEl,
    globe: globeEl.object3D,
    initThree : function() {
      let segments = 155; // number of vertices. Higher = better mouse accuracy, slower loading

      // Set up cache for country textures
      // let glRect = this.glEl.node().getBoundingClientRect();
      // let canvas = this.glEl.append('canvas')
      //     .attr('width', glRect.width)
      //     .attr('height', glRect.height);

      // canvas.node().getContext('webgl');

      // this.renderer = new THREE.WebGLRenderer({ canvas: canvas.node(), antialias: true });
      // this.renderer.setSize(glRect.width, glRect.height);
      // this.renderer.setClearColor( 0x000000 );
      // this.glEl.node().appendChild(this.renderer.domElement);

      // this.camera = new THREE.PerspectiveCamera(70, glRect.width / glRect.height, 1, 5000);
      // this.camera.position.z = 1000;

      // let ambientLight = new THREE.AmbientLight(this.sunColor);
      // this.scene.add(ambientLight);

      // let light = new THREE.DirectionalLight( this.sunColor, .85 );
      // light.position.set(this.camera.position.x, this.camera.position.y + glRect.height/2, this.camera.position.z);
      // this.scene.add( light );

      // base globe with 'water'
      let waterMaterial = new THREE.MeshPhongMaterial({ color: this.waterColor, transparent: true });
      let sphere = new THREE.SphereGeometry(this.sphereRadius, segments, segments);
      let baseGlobe = new THREE.Mesh(sphere, waterMaterial);
      baseGlobe.rotation.y = Math.PI + halfPI; // centers inital render at lat 0, lon 0

      // base map with land, borders, graticule
      let baseMap = this.genMesh({ land: this.land, borders: this.borders });

      // add the two meshes to the container object
      //this.globe.scale.set(2.5, 2.5, 2.5);
      this.globeEl.setObject3D("baseGlobe", baseGlobe);
      this.globeEl.setObject3D("baseMap", baseMap);
      //this.scene.add(this.globe);
      //this.renderer.render(this.scene, this.camera);

      //this.rotateTo(this.geoCache.countries, 0, this.geoCache.countries.length);

      // let self = this;
      // window.addEventListener('resize', function(evt) {
      //   requestAnimationFrame(function () {
      //     let glRect = self.glEl.node().getBoundingClientRect();
      //     self.camera.aspect = glRect.width / glRect.height;
      //     self.camera.updateProjectionMatrix();
      //     self.renderer.setSize(glRect.width, glRect.height);
      //     self.renderer.render(self.scene, self.camera);
      //   });
      // });
    },

    rotateTo : function (countries, cx, cLen) {
      let self = this;
      let globe = this.globe;
      let country = countries[cx];
      let mesh = this.genMesh({country : country});
      let from = {
        x: globe.rotation.x,
        y: globe.rotation.y
      };
      let centroid = d3.geoCentroid(country)
      let to = {
        x: this.latToX3(centroid[1]),
        y: this.lonToY3(centroid[0])
      }
      globe.add(mesh);

      let hasta = globe.getObjectByName(this.currentId);
      this.setSlug(country.name);
      if (hasta) {
        globe.remove(hasta)
        //requestAnimationFrame(function() { self.renderer.render(self.scene, self.camera); });
      }
      this.currentId = country.key;

      //requestAnimationFrame(function() { self.renderer.render(self.scene, self.camera); });

      d3.transition()
        .delay(500)
        .duration(1250)
        .on('start', function() {
          self.terpObj = d3.interpolateObject(from, to);
        })
        .tween('rotate', function() {
          return function (t) {
            globe.rotation.x = self.terpObj(t).x;
            globe.rotation.y = self.terpObj(t).y;
            //requestAnimationFrame(function() { self.renderer.render(self.scene, self.camera); });
          };
        })
        .transition()
        .on('end', function () {
          cx += 1;
          if (cx >= cLen) { cx = 0; }
          self.rotateTo(countries, cx, cLen);
        });
    },

    genMesh : function (opts) {
      let rotation;
      let segments = 155;
      let texture = this.genTexture(opts);
      let material = new THREE.MeshPhongMaterial({ map: texture, transparent: true });
      let mesh = new THREE.Mesh(new THREE.SphereGeometry(this.sphereRadius, segments, segments), material);

      if ( opts.land ) {
        mesh.name = 'land';
        mesh.rotation.y = Math.PI + halfPI;
      } else {
        mesh.name = opts.country.key;
        rotation = this.globe.getObjectByName('land').rotation;
        mesh.rotation.x = rotation.x;
        mesh.rotation.y = rotation.y;
      }
      return mesh;
    },

    setSlug : function (countryname) {
      let self = this;
      this.slug.transition()
        .duration(500)
        .style('opacity', 0)
        .each('end', function () {
          self.slug.text(countryname);
        })
        .transition()
        .duration(1250)
        .style('opacity', 1);
    },

    genTexture : function(opts) {
      let graticule;

      let ctx = this.d3Canvas.getContext('2d');
      ctx.clearRect(0, 0, 2048, 1024);
      let path = d3.geoPath()
          .projection(this.projection)
          .context(ctx);

      if (opts.land) {
        graticule = d3.geoGraticule();
        ctx.fillStyle = this.landColor; ctx.beginPath(); path(opts.land); ctx.fill();
        ctx.strokeStyle = this.borderColor; ctx.lineWidth = .5; ctx.beginPath(); path(opts.borders); ctx.stroke();
        ctx.strokeStyle = this.gratiColor; ctx.lineWidth = .25; ctx.beginPath(); path(graticule()); ctx.stroke();
      }
      if (opts.country) {
        ctx.fillStyle = this.countryColor; ctx.beginPath(); path(opts.country); ctx.fill();
      }

      // DEBUGGING, disable when done.
      // testImg(canvas.node().toDataURL());

      let texture = new THREE.Texture(this.d3Canvas);
      texture.needsUpdate = true;

      return texture;
    },

    /*
      x3ToLat & y3ToLon adapted from Peter Lux,
      http://www.plux.co.uk/converting-radians-in-degrees-latitude-and-longitude/
      convert three.js rotation.x & rotation.y (radians) to lat/lon

      globe.rotation.x + blah === northward
      globe.rotation.y - blah === southward
      globe.rotation.y + blah === westward
      globe.rotation.y - blah === eastward
    */
    x3ToLat : function(rad) {
      // convert radians into latitude
      // 90 to -90

      // first, get everthing into the range -2pi to 2pi
      rad = rad % (Math.PI*2);

      // convert negatives to equivalent positive angle
      if (rad < 0) {
        rad = twoPI + rad;
      }

      // restrict to 0 - 180
      let rad180 = rad % (Math.PI);

      // anything above 90 is subtracted from 180
      if (rad180 > Math.PI/2) {
        rad180 = Math.PI - rad180;
      }
      // if greater than 180, make negative
      if (rad > Math.PI) {
        rad = -rad180;
      } else {
        rad = rad180;
      }

      return (rad/Math.PI*180);
    },

    latToX3 : function(lat) {
      return (lat / 90) * halfPI;
    },

    y3ToLon : function(rad) {
      // convert radians into longitude
      // 180 to -180
      // first, get everything into the range -2pi to 2pi
      rad = rad % twoPI;
      if (rad < 0) {
        rad = twoPI + rad;
      }
      // convert negatives to equivalent positive angle
      let rad360 = rad % twoPI;

      // anything above 90 is subtracted from 360
      if (rad360 > Math.PI) {
        rad360 = twoPI - rad360;
      }

      // if greater than 180, make negative
      if (rad > Math.PI) {
        rad = -rad360;
      } else {
        rad = rad360;
      }
      return rad / Math.PI * 180;
    },

    lonToY3 : function(lon) {
      return -(lon / 180) * Math.PI;
    }
  };

  function testImg(dataURI) {
    let img = document.createElement('img');
    img.src = dataURI;
    img.width = 2048;
    img.height = 1024;
    document.body.appendChild(img);
  }

  let loaded = function (geojson, names) {
    let worldOpts = {
      selector : '#three-box',
      data     : geojson,
      names    : names
    };
    world.init(worldOpts);
  };

  let promises = []
  promises.push(d3.json("data/world.json"))
  promises.push(d3.tsv("data/world-country-names.tsv"))

  Promise.all(promises)
    .then(values => {
      loaded(values[0], values[1])
    })

  return world
  // window.addEventListener('DOMContentLoaded', function () {
  //   queue()
  //     .defer(d3.json, 'world.json')
  //     .defer(d3.tsv, 'world-country-names.tsv')
  //     .await(loaded);
  // });
}

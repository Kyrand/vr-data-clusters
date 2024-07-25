## Using the compute renderer

### Import using glslify
> import * as computeShaderVelocity from '!raw-loader!glslify-loader!./shaders/vel.frag'

### Declare necessary uniforms
```
  let velocityVariable
  let positionVariable
  let positionUniforms
  let velocityUniforms
```

### Initialize the compute renderer
```
  function initComputeRenderer() {

    gpuCompute = new afu.GPUComputationRenderer( WIDTH, WIDTH, renderer )

    var dtVelocity = gpuCompute.createTexture()

    fillTextures( dtPosition, dtVelocity )

    velocityVariable = gpuCompute.addVariable( "textureVelocity", computeShaderVelocity, dtVelocity )

    gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] )

    velocityUniforms = velocityVariable.material.uniforms

    velocityUniforms.gravityConstant = { value: 0.0 }
    velocityUniforms.density = { value: 0.0 }

  }
```

### Filling the textures
```
  function fillTextures( texturePosition, textureVelocity ) {

    var velArray = textureVelocity.image.data

    var maxVel = effectController.velocity
    var velExponent = effectController.velocityExponent
    var randVel = effectController.randVelocity


    for ( var k = 0, kl = velArray.length; k < kl; k += 4 ) {
      // Velocity
      var vel = maxVel * Math.pow( rr, velExponent )

      var vx = vel * z + ( Math.random() * 2 - 1 ) * randVel
      var vy = ( Math.random() * 2 - 1 ) * randVel * 0.05
      var vz = - vel * x + ( Math.random() * 2 - 1 ) * randVel

      velArray[ k + 0 ] = vx
      velArray[ k + 1 ] = vy
      velArray[ k + 2 ] = vz
      velArray[ k + 3 ] = mass

```

### Initializing the simplex
With our texture variables defined, let's attach those values to a shader

```
  function initProtoplanets() {
  // We use a buffer geometry to store the vertices
    geometry = new THREE.BufferGeometry()
    // The initial position of the particles
    var positions = new Float32Array( PARTICLES * 3 )
    var p = 0
    for ( var i = 0; i < PARTICLES; i++ ) {

      positions[ p++ ] = ( Math.random() * 2 - 1 ) * effectController.radius
      positions[ p++ ] = 0//( Math.random() * 2 - 1 ) * effectController.radius
      positions[ p++ ] = ( Math.random() * 2 - 1 ) * effectController.radius

    }
    // This array is used to locate the pos/vel in the textureVelocity array, uv pairs being passed to the cores
    var uvs = new Float32Array( PARTICLES * 2 )
    p = 0
    for ( var j = 0; j < WIDTH; j++ ) {
      for ( i = 0; i < WIDTH; i++ ) {

        uvs[ p++ ] = i / ( WIDTH - 1 )
        uvs[ p++ ] = j / ( WIDTH - 1 )

      }
    }

    geometry.addAttribute( "position", new THREE.BufferAttribute( positions, 3 ) )
    geometry.addAttribute( "uv", new THREE.BufferAttribute( uvs, 2 ) )
    // These will be passed to the shader
    particleUniforms = {
      texturePosition: { value: null },
      textureVelocity: { value: null },
      cameraConstant: { value: getCameraConstant( camera ) },
      density: { value: 0.0 }
    }

    // ShaderMaterial
    let partRad = 0.5 //0.0125

    let fragStr = `
      varying vec4 vColor;

      void main() {

        float f = length( gl_PointCoord - vec2( ${partRad}, ${partRad} ) );
        if ( f > ${partRad} ) {
          discard;
        }
        gl_FragColor = vColor;

      }
    `
    var material = new THREE.ShaderMaterial( {
      uniforms:       particleUniforms,
      // vertexShader:   document.getElementById( "particleVertexShader" ).textContent,
      // fragmentShader: document.getElementById( "particleFragmentShader" ).textContent
      vertexShader: particleVertexShader,
      //fragmentShader: particleFragmentShader
      fragmentShader: fragStr
    })
    material.extensions.drawBuffers = true

    var particles = new THREE.Points( geometry, material )
    particles.matrixAutoUpdate = false
    particles.updateMatrix()

    //scene.add( particles )
    el.setObject3D("particles", particles)
  }
```

## Computing the positions and velocities

Now we compute them by using the renderer (called during gpuCompute.compute()) and then setting the associated particle uniforms, to be used by the vertex and fragment shaders:

```
  api.render = function() {

    var now = performance.now()
    var delta = (now - last) / 1000

    if (delta > 1) delta = 1 // safety cap on large deltas
    last = now

    gpuCompute.compute()

    particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture
    particleUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture

    //renderer.render( scene, camera )

  }
```

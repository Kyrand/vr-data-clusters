attribute vec3 fromVector;
attribute vec3 toVector;
attribute vec3 color;
attribute vec3 position;

uniform float progress;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vColor;

void main() {
  // vec3 fromVac;
  // offset.xz = vector.xz * time;
  // offset.y = vector.y * time - 0.5 * g * time * time;
  //vec3 newPos = toVector + vec3(0.0, 0.1, 0.0);
  //if(newPos.y > 1.0){newPos.y = 0.0;}
  //toVector = newPos;
  vec3 newPos = fromVector + mix(fromVector, toVector, progress);
  //gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  vColor = color;
}

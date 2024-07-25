attribute vec3 fromVector;
attribute vec3 toVector;
attribute vec3 color;
uniform float progress;
varying vec3 vColor;

void main() {
  // vec3 fromVac;
  // offset.xz = vector.xz * time;
  // offset.y = vector.y * time - 0.5 * g * time * time;
  vec3 newPos = position + mix(fromVector, toVector, progress);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  vColor = color;
}

attribute vec3 translate;
attribute vec3 vector;
attribute vec3 color;
uniform float time;
varying vec3 vColor;
const float g = 9.8 * 1.5;
void main() {
  vec3 offset;
  offset.xz = vector.xz * time;
  offset.y = vector.y * time - 0.5 * g * time * time;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position + translate + offset 1.0 );
  vColor = color;
}

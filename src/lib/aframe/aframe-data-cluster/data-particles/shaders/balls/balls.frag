varying vec4 vColor;
varying float z;

uniform vec3 color;

void main() {
  // Fake colors for now

     float fac = 0.2 + ( 1000. - z ) / 1000.;
  //float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;
  //gl_FragColor = vec4( z2, z2, z2, 1. );
  //vec4 v = vColor * fac;
  //gl_FragColor = vec4( v.x, v.y, v.z, 1. );
  gl_FragColor = vec4(vColor, 1.0)

}

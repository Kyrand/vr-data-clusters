varying vec4 vColor;

void main() {

  float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
  if ( f > 0.5 ) {
    discard;
  }

  // vec2 pos = gl_PointCoord - vec2(0.5, 0.5);
  // pos.x = abs(pos.x); pos.y = abs(pos.y);
  // float f = length(vec2(0.5, 0.5) - pos);
  // if(f < 0.5){ discard; }

  gl_FragColor = vColor;
}

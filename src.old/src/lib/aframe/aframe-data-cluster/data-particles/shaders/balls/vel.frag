uniform float time;
uniform float radius;

const float width = resolution.x;
const float height = resolution.y;

const float PI = 3.141592653589793;
const float PI_2 = PI * 2.0;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 ballPosition, ballVelocity, ballMass, ballRadius;

  vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
  vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;
  vec3 selfMass = texture2D( textureMass, uv ).xyz;
  vec3 selfRadius = texture2D( textureRadius, uv ).xyz;

  vec3 newVelocity;
  vec3 BtoB;
  float dist;
  float m1m2;

  for(float x=0.0; x < width; x++) {
    for(float y=0.0; y < height; y++) {

      vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;
      ballPosition = texture2D( texturePosition, ref ).xyz;
      ballVelocity = texture2D( textureVelocity, ref ).xyz;
      ballMass = texture2D( textureMass, ref ).xyz;
      ballRadius = texture2D( textureRadius, ref ).xyz;

      // check for a collision
      BtoB = ballPosition - selfPosition;
      dist = length(BtoB);

      if(dist < selfRadius + ballRadius) {
        m1m2 = ballMass + selfMass;
        newVelocity = ((2. * ballMass) / m1m2) * ballVelocity + (selfMass - ballMass) / m1m2;
      }

    }
  }

  velocity = newVelocity;

  gl_FragColor = vec4( velocity, 1.0 );

}

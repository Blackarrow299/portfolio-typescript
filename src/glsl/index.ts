
export const deformationVertex = `
      uniform vec2 uOffset;
      varying vec2 vUv;

      float M_PI = 3.141529;

      vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset){
          position.x = position.x + sin(uv.y * M_PI) * offset.x;
          position.y = position.y + sin(uv.x * M_PI) * offset.y;
          return position;
      }

      void main(){
          vUv = uv;
          vec3 newPosition = deformationCurve(position, uv, uOffset);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `
export const cursorFragment = `
      uniform sampler2D uTexture;
      uniform float uAlpha;
      varying vec2 vUv;

      void main(){
          vec3 color = texture2D(uTexture, vUv).rgb;
          gl_FragColor = texture2D(uTexture, vUv);
}`

export const portfolioNoiseFragment = `
uniform sampler2D uTexture; // Texture input
uniform vec2 uResolution; // Resolution of the canvas
uniform float uDisp; // displacement amount
uniform float uAlpha;
uniform float uOverlay;
varying vec2 vUv;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = vUv; // Normalized pixel coordinates (from 0 to 1)
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st *= 200.0; // Scale up the noise
    float n = noise(st) - 0.65; // Animate the noise over time
    uv += n * uDisp; // Adjust the displacement strength

    vec4 textureColor = texture2D(uTexture, uv);
    
    gl_FragColor = mix(vec4(textureColor.xyz, uAlpha), vec4(0.0,0.0,0.0,1.0), uOverlay);
}
`

export const defaultVertex = `
    varying vec2 vUv;
     void main(){
           vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`
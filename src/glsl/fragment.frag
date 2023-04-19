uniform sampler2D uTexture;
uniform sampler2D uTexture1;
uniform float uProgress;
uniform float uMix;
uniform vec2 uResolution;
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

void main(){
    vec2 uv = vUv; // Normalized pixel coordinates (from 0 to 1)
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st *= 50.0; // Scale up the noise
    float n = noise(st); // Animate the noise over time
    uv += n * uProgress; // Adjust the displacement strength
    gl_FragColor = mix(texture2D(uTexture, uv), texture2D(uTexture1, uv), uMix);
}
uniform sampler2D u_image;
uniform float u_alpha;
varying vec2 vUv;

void main(){
    vec3 color = texture2D(u_image, vUv).rgb;
    gl_FragColor = texture2D(u_image, vUv);
}
#include utils/noise3D.glsl

uniform sampler2D u_image;
uniform sampler2D u_nextImage;
uniform float u_progress;
uniform float u_power;
uniform float u_disp;
uniform vec2 u_res;
uniform float u_hover;
uniform float u_time;
varying vec2 vUv;

void main(){
    vec2 uv = vUv;
    float time = u_time * 0.05;
    vec2 res = u_res * PR;
    vec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);
	st.y *= u_res.y / u_res.x;

    float offX = uv.x + sin(uv.y + time * 2.);
    float offY = uv.y - time * .2 - cos(time * 2.) * 0.1;

    float nh = (snoise(vec3(offX, offY, time * .5 ) * 8.)) * 1.;

    float n = (snoise(vec3(offX * u_power, offY  * u_power, time * 2.) * 8.)) * 1.;


    vec4 currentColor = texture2D(u_image, uv + n * u_disp + (nh * u_hover)) * (-0.5 * u_hover + 1.);

    currentColor.a = 1.;
    vec4 nextColor = texture2D(u_nextImage, uv + n * u_disp );


    vec4 mixedColor = mix(currentColor , nextColor, clamp(0., 1., n * u_progress + u_progress * 2.));
   
    gl_FragColor = mixedColor;
}
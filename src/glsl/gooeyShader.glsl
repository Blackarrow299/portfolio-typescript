#include utils/noise3D.glsl

uniform sampler2D u_map;
uniform sampler2D u_hovermap;

uniform sampler2D uTexture;
uniform float u_alpha;
uniform float uTime;
uniform float u_progressHover;
uniform float u_progressClick;

uniform vec2 uResolution;
uniform vec2 u_mouse;
uniform vec2 u_ratio;
uniform vec2 u_hoverratio;

varying vec2 vUv;

float circle(in vec2 _st, in float _radius, in float blurriness){
    vec2 dist = _st;
	  return 1. - smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
}

void main() {
  vec2 resolution = uResolution * PR;
  float time = uTime * 0.05;
  float progress = u_progressClick;

  float progressHover = u_progressHover;
  vec2 uv = vUv;
  vec2 uv_h = vUv;

  vec2 st = gl_FragCoord.xy / resolution.xy - vec2(.5);
  st.y *= resolution.y / resolution.x;

  vec2 mouse = vec2((u_mouse.x / uResolution.x) * 2. - 1.,-(u_mouse.y / uResolution.y) * 2. + 1.) * -.5;
  mouse.y *= resolution.y / resolution.x;

  vec2 cpos = st + mouse;

  float grd = 0.1 * progressHover;

  float sqr = 100. * ((smoothstep(0., grd, uv.x) - smoothstep(1. - grd, 1., uv.x)) * (smoothstep(0., grd, uv.y) - smoothstep(1. - grd, 1., uv.y))) - 10.;

  float c = circle(cpos, .04 * progressHover + progress * 0.8, 2.) * 50.;
  float c2 = circle(cpos, .01 * progressHover + progress * 0.5, 2.);

  float offX = uv.x + sin(uv.y + time * 2.);
  float offY = uv.y - time * .2 - cos(time * 2.) * 0.1;
  float nc = (snoise(vec3(offX, offY, time * .5) * 8.)) * progressHover;
  float nh = (snoise(vec3(offX, offY, time * .5 ) * 2.)) * .01;

  c2 = smoothstep(.1, .8, c2 * 5. + nc * 3. - 1.);

  uv_h -= vec2(0.5);
  uv_h *= 1. - u_progressHover * 0.1;
  uv_h += vec2(0.5);

  uv_h *= u_hoverratio;

  // uv -= vec2(0.5);
  // uv *= 1. - u_progressHover * 0.2;
  // uv += mouse * 0.1 * u_progressHover;
  // uv *= u_ratio;
  // uv += vec2(0.5);

  vec4 color = vec4(0.0314, 0.0314, 0.2235, 1.);

  vec4 image = texture2D(u_map, uv);
  vec4 hover = texture2D(u_hovermap, uv_h + vec2(nh) * progressHover * (1. - progress));
  hover = mix(hover, color * hover, .8 * (1. - progress));

  float finalMask = smoothstep(.0, .1, sqr - c);

  image = mix(image, hover, clamp(c2 + progress, 0., 1.));

  //gl_FragColor = vec4(image.rgb, u_alpha * finalMask);

  gl_FragColor = vec4(texture2D(uTexture, uv + nh).rgb * c2, 1.);
}

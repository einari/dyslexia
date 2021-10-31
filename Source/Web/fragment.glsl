#ifdef GL_ES
precision highp float;
#endif

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_seed[2];

void main() {
    float uni = fract(
    tan(distance(
        gl_FragCoord.xy,
        u_resolution * (u_seed[0] + 1.0)
    )) * distance(
        gl_FragCoord.xy,
        u_resolution * (u_seed[1] - 2.0)
    )
    );
    gl_FragColor = vec4(uni, uni, uni, 1.0);
}

precision mediump float;

uniform sampler2D fsInputTex;

varying vec3 fsInputColor;
varying vec2 fsInputTexCoord;
void main()
{
	vec4 defaultColor =vec4(fsInputColor,1.0);
	gl_FragColor = defaultColor * texture2D(fsInputTex, fsInputTexCoord);
}
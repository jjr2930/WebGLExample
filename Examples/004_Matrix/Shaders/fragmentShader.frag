precision mediump float;

varying vec3 fsInputColor;
void main()
{
	gl_FragColor = vec4(fsInputColor,1.0);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);
}
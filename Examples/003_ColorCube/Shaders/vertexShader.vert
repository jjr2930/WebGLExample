precision mediump float;
attribute vec3 vsInputPosition;
attribute vec4 vsInputColor;

varying vec4 fsInputColor;
void main()
{
	gl_Position = vec4(vsInputPosition,1.0);
	fsInputColor = vsInputColor;
}

precision mediump float;

attribute vec3 vsInputposition;
attribute vec4 vsInputColor;

varying vec4 fsInputColor;
void main(void)
{
	gl_Position = vec4(vsInputposition,1.0);
	fsInputColor = vsInputColor;
}
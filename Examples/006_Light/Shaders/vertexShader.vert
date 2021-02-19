precision mediump float;
attribute vec3 vsInputPosition;
attribute vec3 vsInputColor;
attribute vec2 vsInputTexCoord;
attribute vec3 vsInputNormal;
attribute vec3 vsWorldViewDir;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 worldLightDir;

varying vec3 fsInputColor;
varying vec2 fsInputTexCoord;
varying vec4 fsInputWorldNormal;

void main()
{
	vec4 localPos = vec4(vsInputPosition, 1.0);
	vec4 normal = vec4(vsInputNormal,1.0);
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * localPos;
	
	fsInputWorldNormal = worldMatrix * normal;

	fsInputColor = vsInputColor;
	fsInputTexCoord = vsInputTexCoord;
	fsInputWorldViewDir = norm(vsWorldViewDir);
}
﻿precision mediump float;
attribute vec3 vsInputPosition;
attribute vec4 vsInputColor;

uniform mat4 worldMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec4 fsInputColor;
void main()
{
	vec4 localPos = vec4(vsInputPosition, 1.0);
	gl_Position = projectionMatrix * viewMatrix * worldMatrix * localPos;
	fsInputColor = vsInputColor;
}

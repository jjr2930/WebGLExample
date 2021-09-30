precision mediump float;

uniform sampler2D fsInputTex;
uniform vec4 lightColor;
uniform vec3 worldLightDir;
uniform vec4 diffuseColor;
uniform float specularPower;
uniform vec4 ambientColor;
uniform vec3 worldViewDir;

varying vec3 fsInputColor;
varying vec2 fsInputTexCoord;
varying vec3 fsInputWorldNormal;

void main()
{
	vec4 ambientColor = vec4(0.1, 0.2, 0.1, 1.0);
	float diffuseAmount = max(dot(fsInputWorldNormal, worldLightDir), 0.0);

	vec4 texColor = texture2D(fsInputTex, fsInputTexCoord); 
	vec4 diffuse = (lightColor * diffuseAmount);

	vec3 reflectDir = reflect(-worldLightDir,fsInputWorldNormal);
	float reflectAmount = clamp(dot(worldViewDir, reflectDir), 0.0, 1.0);
	reflectAmount = max(reflectAmount, 0.0);
	reflectAmount = pow(reflectAmount , specularPower);
	vec4 specularColor = reflectAmount * lightColor;
		
	gl_FragColor = ambientColor + diffuse + specularColor;
}
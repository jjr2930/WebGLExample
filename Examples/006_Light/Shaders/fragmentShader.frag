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
varying vec4 fsInputWorldNormal;

void main()
{
	vec4 lightDir = vec4(worldLightDir, 0.0);
	vec4 viewDir = vec4(worldViewDir, 0.0);
	float diffuse = max(dot(fsInputWorldNormal, lightDir), 0.0);
	vec4 calcDiffuseColor = diffuse * diffuseColor;

	vec4 reflectDir = reflect(-lightDir,fsInputWorldNormal);
	float reflectAmount = dot(viewDir, reflectDir);
	reflectAmount = max(reflectAmount, 0.0);
	reflectAmount = pow(reflectAmount,specularPower);
	vec4 specularColor = reflectAmount * lightColor;


	vec4 texColor = texture2D(fsInputTex, fsInputTexCoord); 
	gl_FragColor = ambientColor * calcDiffuseColor * specularColor;
}
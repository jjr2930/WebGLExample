﻿import { Matrix4x4 } from "../WebGL_CommonModule/Matrix4x4.js"
import { Vector3 } from "../WebGL_CommonModule/Vector3.js"
import { Utilities } from "../WebGL_CommonModule/Utilities.js"
import { Color } from "../WebGL_CommonModule/Color.js"
window.onload = async function ()
{
    //create canvas
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    if (null === canvas)
    {
        alert("create canvas failer");
        return;
    }

    //add to document
    document.body.appendChild(canvas);

    canvas.width = 600;
    canvas.height = 400;
    //get webgl context
    const gl = canvas.getContext('webgl');
    if (null === gl)
    {
        alert("your browser not support webgl");
        return;
    }

    const vertexShader = await Utilities.CreateNewShader(gl, "006_Light/Shaders/vertexShader.vert", gl.VERTEX_SHADER);
    const fragmentShader = await Utilities.CreateNewShader(gl, "006_Light/Shaders/fragmentShader.frag", gl.FRAGMENT_SHADER);
    const program = await Utilities.CreateNewProgram(gl, vertexShader, fragmentShader);

    //create cube vertex
    const vertices = [
        // front
        -1.0, -1.0, 1.0,
        1.0, -1.0, 1.0,
        1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        // back
        -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, 1.0, -1.0,
        -1.0, 1.0, -1.0
    ];

    const uvs = [
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,

        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0
    ];

    const indices = [
        // front
        0, 1, 2,
        2, 3, 0,
        // right
        1, 5, 6,
        6, 2, 1,
        // back
        7, 6, 5,
        5, 4, 7,
        // left
        4, 0, 3,
        3, 7, 4,
        // bottom
        4, 5, 1,
        1, 0, 4,
        // top
        3, 2, 6,
        6, 7, 3
    ]

    const colors = [
        // front colors
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 1.0,
        // back colors
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,
        0.0, 1.0, 1.0
    ];

    const lightColor = new Color(1, 0, 0, 1);

    const lightDir = new Vector3();
    lightDir.Set(1, 1, 1);
    lightDir.Normalize();

    const specularPower = 5.0;

    const ambientColor = new Color(1, 1, 1, 1);

    const camViewDir = new Vector3();
    camViewDir.Set(0, 0, -1);
    

    const [vertexBuffer, positionAttributeLoctaion] =
        Utilities.CreateArrayBuffer(gl, program, "vsInputPosition", 3, vertices);

    const [colorBuffer, colorAttributeLocation] =
        Utilities.CreateArrayBuffer(gl, program, "vsInputColor", 3, colors);

    const [uvBuffer, uvAttributeLocation] =
        Utilities.CreateArrayBuffer(gl, program, "vsInputTexCoord", 2, uvs);

    const indexBuffer = Utilities.CreateIndexBufferU16(gl, indices);
    /*
     * mapping texture at here
     */
    const cubeTexture = await Utilities.LoadTexture(gl, program, "fsInputTex", "006_Light/Textures/brick1.jpg");
    

    const worldMatrixUnifromLocation = gl.getUniformLocation(program, "worldMatrix");
    const viewMatrixUniformLocation = gl.getUniformLocation(program, "viewMatrix");
    const projectionUniformLocation = gl.getUniformLocation(program, "projectionMatrix");
    const lightColorUniformLocation = gl.getUniformLocation(program, "lightColor");
    const worldLightDirUniformLocation = gl.getUniformLocation(program, "worldLightDir");
    const diffuseColorUniformLocation = gl.getUniformLocation(program, "diffuseColor");
    const specularPowerUniformLocation = gl.getUniformLocation(program, "specularPower");
    const ambientColorUniformLocation = gl.getUniformLocation(program, "ambientColor");
    const worldViewDirUniformLocation = gl.getUniformLocation(program, "worldViewDir");

    gl.useProgram(program);
    let rotation = 0.0;
    let oldTime = 0.0;
    function animate(time: number)
    {
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0.5, 0.5, 0.5, 0.9);
        gl.clearDepth(1);

        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const delta = time - oldTime;
        oldTime = time;
        rotation += delta * 0.1;

        if (rotation > 360.0)
            rotation = rotation % 360;
        if (rotation < 0)
            rotation = 0;

        const worldMatrix = new Matrix4x4();
        worldMatrix.SetIdentity();
        worldMatrix.TranslateXYZ(0, 0, 0);
        worldMatrix.ScaleXYZ(1, 1, 1);

        const rotMatrix = new Matrix4x4();
        rotMatrix.RotateAxis(rotation, Vector3.Up);
        worldMatrix.Mul(rotMatrix);

        const viewMatrix = new Matrix4x4();
        const eyePosition = new Vector3(null);
        eyePosition.Z -= 3;

        viewMatrix.SetViewMatrix(eyePosition, Vector3.Zero, Vector3.Up);


        const projectionMatrix = new Matrix4x4();

        projectionMatrix.SetPerspectiveMatrix(100.0, canvas.width / canvas.height, 0.001, 1000);

        gl.uniformMatrix4fv(worldMatrixUnifromLocation, false, worldMatrix.GetArray());
        gl.uniformMatrix4fv(viewMatrixUniformLocation, false, viewMatrix.GetArray());
        gl.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix.GetArray());
        gl.uniform4f(lightColorUniformLocation, lightColor[0], lightColor[1], lightColor[2], lightColor[3]);
        gl.uniform3f(worldLightDirUniformLocation, lightDir.X, lightDir.Y, lightDir.Z);
        gl.uniform4f(diffuseColorUniformLocation, lightColor.r, lightColor.g, lightColor.b, lightColor.a);
        gl.uniform1f(specularPowerUniformLocation, specularPower);
        gl.uniform4f(ambientColorUniformLocation, ambientColor.r, ambientColor.g, ambientColor.b, ambientColor.a);
        gl.uniform3f(worldViewDirUniformLocation, camViewDir.X, camViewDir.Y, camViewDir.Z);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        window.requestAnimationFrame(animate);
    }

    animate(0);
}
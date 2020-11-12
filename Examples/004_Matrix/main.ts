import {Matrix4x4} from "../WebGL_CommonModule/Matrix4x4.js"
import { Vector3 } from "../WebGL_CommonModule/Vector3.js";
import { MathUtils } from "../WebGL_CommonModule/MathUtils.js";

function delay(ms: number)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = async function ()
{
    const canvas = document.createElement("canvas");
    canvas.id = "glCanvas";
    canvas.width = 600;
    canvas.height = 400;

    document.body.appendChild(canvas);

    const gl = canvas.getContext("webgl");
    if (null === gl)
    {
        alert("your browser not support webgl, please check your browser");
        return;
    }

    //load shader
    const vertexShaderText = await fetch("004_Matrix/Shaders/vertexShader.vert").then(res => res.text());
    console.log(vertexShaderText);
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.error("vertex shader compile failed", gl.getShaderInfoLog(vertexShader));
        return;
    }

    const fragmentShaderText = await fetch("004_Matrix/Shaders/fragmentShader.frag").then(res => res.text());
    console.log(fragmentShaderText);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    {
        console.error("fragment shader compile faield", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.error("program link error", gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
    {
        console.error("validate failed", gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    //generate vertices
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
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        // back colors1.0,
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
    ];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const vertexAttributeLocation = gl.getAttribLocation(program, "vsInputPosition");
    gl.vertexAttribPointer(vertexAttributeLocation,
        3,
        gl.FLOAT,
        false,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0);

    gl.enableVertexAttribArray(vertexAttributeLocation);

    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(program, "vsInputColor");
    gl.vertexAttribPointer(colorAttributeLocation,
        4,
        gl.FLOAT,
        false,
        4 * Float32Array.BYTES_PER_ELEMENT,
        0);
    gl.enableVertexAttribArray(colorAttributeLocation);

    let rotation = 0.0;
    while (true)
    {
        rotation += 1.0;
        if (rotation > 360.0)
            rotation = rotation % 360;
        if (rotation < 0)
            rotation = 0;

        let worldMatrix = new Matrix4x4();
        worldMatrix.SetIdentity();
        worldMatrix.TranslateXYZ(0, 0, 0);
        worldMatrix.ScaleXYZ(1, 1, 1);

        worldMatrix.RotateAxis(45, Vector3.Up);
        worldMatrix.RotateAxis(rotation, Vector3.Right);

        let viewMatrix = new Matrix4x4();
        let eyePosition = new Vector3(null);
        eyePosition.Z += 5;

        viewMatrix.SetViewMatrix(eyePosition, Vector3.Zero, Vector3.Up);

        let projectionMatrix = new Matrix4x4();

        //let top = 0.001 * Math.tan(MathUtils.DEG2RAD * 0.5 * 45);
        //let height = 2 * top;
        //let width = 1.3 * height;
        //let left = - 0.5 * width;

        projectionMatrix.SetPerspectiveMatrix(-10, 10, 10, -10, 0.001, 1000);
        //projectionMatrix.SetOrthographicMatrix(-10, 10, 10, -10, 0.001, 1000);

        //bind matrix to vertexshader
        const worldMatrixUnifromLocation = gl.getUniformLocation(program, "worldMatrix");
        const viewMatrixUniformLocation = gl.getUniformLocation(program, "viewMatrix");
        const projectionUniformLocation = gl.getUniformLocation(program, "projectionMatrix");

        gl.uniformMatrix4fv(worldMatrixUnifromLocation, false, new Float32Array(worldMatrix.GetArray()));
        gl.uniformMatrix4fv(viewMatrixUniformLocation, false, new Float32Array(viewMatrix.GetArray()));
        gl.uniformMatrix4fv(projectionUniformLocation, false, new Float32Array(projectionMatrix.GetArray()));

        gl.enable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        await delay(10);
    }
}

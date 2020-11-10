window.onload = async function () {
    var canvas = document.createElement("canvas");
    canvas.id = "glCanvas";
    canvas.width = 600;
    canvas.height = 400;

    var body = document.body.appendChild(canvas);

    var gl = canvas.getContext("webgl");
    if (null == gl) {
        alert("your browser not support webgl, please check your browser");
        return;
    }

    //load shader
    var vertexShaderText: string;
    vertexShaderText = await fetch("Shaders/vertexShader.vert").then(res => res.text());
    console.log(vertexShaderText);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("vertex shader compile failed", gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShaderText: string;
    fragmentShaderText = await fetch("Shaders/fragmentShader.frag").then(res => res.text());
    console.log(fragmentShaderText);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("fragment shader compile faield", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("program link error", gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
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
    
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let vertexAttributeLocation = gl.getAttribLocation(program, "vsInputPosition");
    gl.vertexAttribPointer(vertexAttributeLocation,
        3,
        gl.FLOAT,
        false,
        3 * Float32Array.BYTES_PER_ELEMENT,
        0);

    gl.enableVertexAttribArray(vertexAttributeLocation);

    let indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    let colorAttributeLocation = gl.getAttribLocation(program, "vsInputColor");
    gl.vertexAttribPointer(colorAttributeLocation,
        4,
        gl.FLOAT,
        false,
        4 * Float32Array.BYTES_PER_ELEMENT,
        0);
    gl.enableVertexAttribArray(colorAttributeLocation);

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}
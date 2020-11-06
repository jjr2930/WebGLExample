window.onload = async function () {
    var canvas = document.createElement("canvas");
    document.querySelector("body").appendChild(canvas);
    var gl = canvas.getContext("webgl2");
    if (null == gl) {
        alert("init falied");
        return;
    }
    canvas.width = 640;
    canvas.height = 480;
    //gl.clearColor(0, 0, 0, 1);
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //setup sample vertex
    var vertices = [
        -0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        -0.0, -0.5, 0.0
    ];
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    var vertexShaderText;
    await readTextFile("/Shaders/vertexShader.vert").then(text => vertexShaderText = text);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.compileShader(vertexShader);
    var fragmentShaderText;
    await readTextFile("/Shaders/fragmentShader.frag").then(text => fragmentShaderText = text);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    gl.compileShader(fragmentShader);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
    //Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    //Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "position");
    //point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    //Enable the attribute
    gl.enableVertexAttribArray(coord);
    /* Step5: Drawing the required object (triangle) */
    // Clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);
    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);
    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Set the view port
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
async function readTextFile(path) {
    var result;
    await fetch(path)
        .then(response => response.text())
        .then(function (text) {
        result = text;
    });
    return result;
}
//# sourceMappingURL=main.js.map
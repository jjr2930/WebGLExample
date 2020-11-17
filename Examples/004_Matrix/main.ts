import {Matrix4x4} from "../WebGL_CommonModule/Matrix4x4.js"
import { Vector3 } from "../WebGL_CommonModule/Vector3.js";
import { MathUtils } from "../WebGL_CommonModule/MathUtils.js";


/*
 * Note : gl.enableVertexAttribArray()의 순서가 매우 중요함
 * 버텍스 버퍼의 바인딩, 데이터 입력 EnableAtrribute가 세트로 실행되어야함
 * 예를들어 
 * 포지션 버퍼 바인딩, 
 * 컬러버퍼 바인딩, 
 * 포지션 버퍼 입력, 
 * 컬러버퍼 입력, 
 * 포지션 어트리뷰트 활성화
 * 컬러 어트리뷰트 활성화
 * 이렇게 하면 마지막에 넣은 컬러가 버텍스 어트리뷰트에 적용됨
 * 다음과 같이 해야 잘됨
 * 포지션 버퍼 생성
 * 포지션 버퍼 바인딩
 * 포지션 버퍼 데이터 입력
 * 포지선 어트리뷰트 로케이션 얻어오기
 * 포지션 어트리뷰트 포인터 설정
 * 포지션 어트리뷰트 활성화
 * 
 * 컬러 버퍼 생성
 * 컬러 버퍼 바인딩
 * 컬러 버퍼 데이터 입력
 * 컬러 어트리뷰트 로케이션 얻어오기
 * 컬러 어트리뷰트 포인터 설정
 * 컬러 어트리뷰트 활성화
 * 
 * 순서대로 활성화 시켜주면 아주 잘됨
 */
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

    const program = gl.createProgram();
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



    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, "vsInputPosition");
    gl.vertexAttribPointer(positionAttributeLocation,
        3,
        gl.FLOAT,
        false,
        0,
        0);

    gl.enableVertexAttribArray(positionAttributeLocation);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(program, "vsInputColor");
    gl.vertexAttribPointer(colorAttributeLocation,
        3,
        gl.FLOAT,
        false,
        0,
        0);
    gl.enableVertexAttribArray(colorAttributeLocation);


    //bind matrix to vertexshader
    const worldMatrixUnifromLocation = gl.getUniformLocation(program, "worldMatrix");
    const viewMatrixUniformLocation = gl.getUniformLocation(program, "viewMatrix");
    const projectionUniformLocation = gl.getUniformLocation(program, "projectionMatrix");


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
        rotation += delta * 0.01;

        if (rotation > 360.0)
            rotation = rotation % 360;
        if (rotation < 0)
            rotation = 0;

        let worldMatrix = new Matrix4x4();
        worldMatrix.SetIdentity();
        worldMatrix.TranslateXYZ(0, 0, 0);
        worldMatrix.ScaleXYZ(1, 1, 1);

        let rotMatrix = new Matrix4x4();
        rotMatrix.RotateAxis(rotation, Vector3.Right);
        worldMatrix.Mul(rotMatrix);

        let viewMatrix = new Matrix4x4();
        let eyePosition = new Vector3(null);
        eyePosition.Z += 5;

        //viewMatrix.SetViewMatrix(eyePosition, Vector3.Zero, Vector3.Up);
        viewMatrix.SetIdentity();
        //viewMatrix.TranslateXYZ(0, 0, -5);
        let projectionMatrix = new Matrix4x4();

        //let top = 0.001 * Math.tan(MathUtils.DEG2RAD * 0.5 * 45);
        //let height = 2 * top;
        //let width = 1.3 * height;
        //let left = - 0.5 * width;

        projectionMatrix.SetPerspectiveMatrix(40.0, canvas.width / canvas.height, 0.001, 1000);
        //projectionMatrix.Transepose();
        //projectionMatrix.SetOrthographicMatrix(-10, 10, 10, -10, 0.001, 1000);
        
        const identityMatrix = new Matrix4x4();
        identityMatrix.SetIdentity();

        function get_projection(angle, a, zMin, zMax)
        {
            var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
            return [
                0.5 / ang, 0, 0, 0,
                0, 0.5 * a / ang, 0, 0,
                0, 0, -(zMax + zMin) / (zMax - zMin), -1,
                0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
            ];
        }


        const proj = get_projection(40, canvas.width/canvas.height, 0.001, 1000);

        const viewArray = viewMatrix.GetArray();
        viewArray[14] -= 5;

        const projArray = projectionMatrix.GetArray();
        gl.uniformMatrix4fv(worldMatrixUnifromLocation, false, worldMatrix.GetArray());
        gl.uniformMatrix4fv(viewMatrixUniformLocation, false, viewArray);
        gl.uniformMatrix4fv(projectionUniformLocation, false, proj);


        const indicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

       window.requestAnimationFrame(animate);
    }

    animate(0);
}


















//window.onload = async function ()
//{
//    /*============= Creating a canvas =================*/
//    var canvas = document.getElementById('my_Canvas') as HTMLCanvasElement;
//    var gl = canvas.getContext('webgl');

//    /*============ Defining and storing the geometry =========*/

//    const vertices = [
//        // front
//        -1.0, -1.0, 1.0,
//        1.0, -1.0, 1.0,
//        1.0, 1.0, 1.0,
//        -1.0, 1.0, 1.0,
//        // back
//        -1.0, -1.0, -1.0,
//        1.0, -1.0, -1.0,
//        1.0, 1.0, -1.0,
//        -1.0, 1.0, -1.0
//    ];

//    const indices = [
//        // front
//        0, 1, 2,
//        2, 3, 0,
//        // right
//        1, 5, 6,
//        6, 2, 1,
//        // back
//        7, 6, 5,
//        5, 4, 7,
//        // left
//        4, 0, 3,
//        3, 7, 4,
//        // bottom
//        4, 5, 1,
//        1, 0, 4,
//        // top
//        3, 2, 6,
//        6, 7, 3
//    ]

//    const colors = [
//        // front colors
//        1.0, 0.0, 0.0,
//        0.0, 1.0, 0.0,
//        0.0, 0.0, 1.0,
//        0.0, 1.0, 1.0,
//        // back colors
//        1.0, 0.0, 0.0,
//        0.0, 1.0, 0.0,
//        0.0, 0.0, 1.0,
//        0.0, 1.0, 1.0
//    ];


//    // Create and store data into vertex buffer
//    var vertex_buffer = gl.createBuffer();
//    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//    // Create and store data into color buffer
//    var color_buffer = gl.createBuffer();
//    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//    // Create and store data into index buffer
//    var index_buffer = gl.createBuffer();
//    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
//    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

//    /*=================== Shaders =========================*/
//    const vertCode = await fetch("004_Matrix/Shaders/vertexShader.vert").then(res => res.text());
//    const fragCode = await fetch("004_Matrix/Shaders/fragmentShader.frag").then(res => res.text());


//    var vertShader = gl.createShader(gl.VERTEX_SHADER);
//    gl.shaderSource(vertShader, vertCode);
//    gl.compileShader(vertShader);

//    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
//    gl.shaderSource(fragShader, fragCode);
//    gl.compileShader(fragShader);

//    var shaderProgram = gl.createProgram();
//    gl.attachShader(shaderProgram, vertShader);
//    gl.attachShader(shaderProgram, fragShader);
//    gl.linkProgram(shaderProgram);

//    /* ====== Associating attributes to vertex shader =====*/
//    var Pmatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
//    var Vmatrix = gl.getUniformLocation(shaderProgram, "viewMatrix");
//    var Mmatrix = gl.getUniformLocation(shaderProgram, "worldMatrix");

//    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//    var position = gl.getAttribLocation(shaderProgram, "vsInputPosition");
//    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

//    // Position
//    gl.enableVertexAttribArray(position);
//    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
//    var color = gl.getAttribLocation(shaderProgram, "vsInputColor");
//    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);

//    // Color
//    gl.enableVertexAttribArray(color);
//    gl.useProgram(shaderProgram);

//    /*==================== MATRIX =====================*/

//    function get_projection(angle, a, zMin, zMax)
//    {
//        var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
//        return [
//            0.5 / ang, 0, 0, 0,
//            0, 0.5 * a / ang, 0, 0,
//            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
//            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
//        ];
//    }

//    var proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);

//    var mov_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
//    var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

//    // translating z
//    //view_matrix[14] = view_matrix[14] - 6;//zoom
//    view_matrix[14] -= 5;

//    /*==================== Rotation ====================*/

//    function rotateZ(m, angle)
//    {
//        var c = Math.cos(angle);
//        var s = Math.sin(angle);
//        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

//        m[0] = c * m[0] - s * m[1];
//        m[4] = c * m[4] - s * m[5];
//        m[8] = c * m[8] - s * m[9];

//        m[1] = c * m[1] + s * mv0;
//        m[5] = c * m[5] + s * mv4;
//        m[9] = c * m[9] + s * mv8;
//    }

//    function rotateX(m, angle)
//    {
//        var c = Math.cos(angle);
//        var s = Math.sin(angle);
//        var mv1 = m[1], mv5 = m[5], mv9 = m[9];

//        m[1] = m[1] * c - m[2] * s;
//        m[5] = m[5] * c - m[6] * s;
//        m[9] = m[9] * c - m[10] * s;

//        m[2] = m[2] * c + mv1 * s;
//        m[6] = m[6] * c + mv5 * s;
//        m[10] = m[10] * c + mv9 * s;
//    }

//    function rotateY(m, angle)
//    {
//        var c = Math.cos(angle);
//        var s = Math.sin(angle);
//        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

//        m[0] = c * m[0] + s * m[2];
//        m[4] = c * m[4] + s * m[6];
//        m[8] = c * m[8] + s * m[10];

//        m[2] = c * m[2] - s * mv0;
//        m[6] = c * m[6] - s * mv4;
//        m[10] = c * m[10] - s * mv8;
//    }

//    /*================= Drawing ===========================*/
//    var time_old = 0;

//    var animate = function (time)
//    {

//        var dt = time - time_old;
//        //rotateZ(mov_matrix, dt * 0.005);//time
//        //rotateY(mov_matrix, dt * 0.002);
//        //rotateX(mov_matrix, dt * 0.003);
//        time_old = time;

//        gl.enable(gl.DEPTH_TEST);
//        gl.depthFunc(gl.LEQUAL);
//        gl.clearColor(0.5, 0.5, 0.5, 0.9);
//        gl.clearDepth(1.0);

//        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
//        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
//        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
//        gl.uniformMatrix4fv(Mmatrix, false, view_matrix);
//        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
//        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

//        window.requestAnimationFrame(animate);
//    }
//    animate(0);
//}





































//window.onload = function(){
//    /*============= Creating a canvas =================*/
//    var canvas = document.getElementById('my_Canvas') as HTMLCanvasElement;
//    var gl = canvas.getContext('webgl');

//    /*============ Defining and storing the geometry =========*/

//    const vertices = [
//        // front
//        -1.0, -1.0, 1.0,
//        1.0, -1.0, 1.0,
//        1.0, 1.0, 1.0,
//        -1.0, 1.0, 1.0,
//        // back
//        -1.0, -1.0, -1.0,
//        1.0, -1.0, -1.0,
//        1.0, 1.0, -1.0,
//        -1.0, 1.0, -1.0
//    ];

//    const indices = [
//        // front
//        0, 1, 2,
//        2, 3, 0,
//        // right
//        1, 5, 6,
//        6, 2, 1,
//        // back
//        7, 6, 5,
//        5, 4, 7,
//        // left
//        4, 0, 3,
//        3, 7, 4,
//        // bottom
//        4, 5, 1,
//        1, 0, 4,
//        // top
//        3, 2, 6,
//        6, 7, 3
//    ]

//    const colors = [
//        // front colors
//        1.0, 0.0, 0.0,
//        0.0, 1.0, 0.0,
//        0.0, 0.0, 1.0,
//        0.0, 1.0, 1.0,
//        // back colors
//        1.0, 0.0, 0.0,
//        0.0, 1.0, 0.0,
//        0.0, 0.0, 1.0,
//        0.0, 1.0, 1.0
//    ];


//    // Create and store data into vertex buffer
//    var vertex_buffer = gl.createBuffer();
//    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

//    // Create and store data into color buffer
//    var color_buffer = gl.createBuffer();
//    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
//    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

//    // Create and store data into index buffer
//    var index_buffer = gl.createBuffer();
//    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
//    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

//    /*=================== Shaders =========================*/

//    var vertCode = 'attribute vec3 position;' +
//        'uniform mat4 Pmatrix;' +
//        'uniform mat4 Vmatrix;' +
//        'uniform mat4 Mmatrix;' +
//        'attribute vec3 color;' +//the color of the point
//        'varying vec3 vColor;' +

//        'void main(void) { ' +//pre-built function
//        'gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);' +
//        'vColor = color;' +
//        '}';

//    var fragCode = 'precision mediump float;' +
//        'varying vec3 vColor;' +
//        'void main(void) {' +
//        'gl_FragColor = vec4(vColor, 1.);' +
//        '}';

//    var vertShader = gl.createShader(gl.VERTEX_SHADER);
//    gl.shaderSource(vertShader, vertCode);
//    gl.compileShader(vertShader);

//    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
//    gl.shaderSource(fragShader, fragCode);
//    gl.compileShader(fragShader);

//    var shaderProgram = gl.createProgram();
//    gl.attachShader(shaderProgram, vertShader);
//    gl.attachShader(shaderProgram, fragShader);
//    gl.linkProgram(shaderProgram);

//    /* ====== Associating attributes to vertex shader =====*/
//    var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
//    var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
//    var Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

//    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
//    var position = gl.getAttribLocation(shaderProgram, "position");
//    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

//    // Position
//    gl.enableVertexAttribArray(position);
//    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
//    var color = gl.getAttribLocation(shaderProgram, "color");
//    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);

//    // Color
//    gl.enableVertexAttribArray(color);
//    gl.useProgram(shaderProgram);

//    /*==================== MATRIX =====================*/

//    function get_projection(angle, a, zMin, zMax)
//    {
//        var ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
//        return [
//            0.5 / ang, 0, 0, 0,
//            0, 0.5 * a / ang, 0, 0,
//            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
//            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
//        ];
//    }

//    var proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);

//    var mov_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
//    var view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

//    // translating z
//    view_matrix[14] = view_matrix[14] - 6;//zoom

//    /*==================== Rotation ====================*/

//    function rotateZ(m, angle)
//    {
//        var c = Math.cos(angle);
//        var s = Math.sin(angle);
//        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

//        m[0] = c * m[0] - s * m[1];
//        m[4] = c * m[4] - s * m[5];
//        m[8] = c * m[8] - s * m[9];

//        m[1] = c * m[1] + s * mv0;
//        m[5] = c * m[5] + s * mv4;
//        m[9] = c * m[9] + s * mv8;
//    }

//    function rotateX(m, angle)
//    {
//        var c = Math.cos(angle);
//        var s = Math.sin(angle);
//        var mv1 = m[1], mv5 = m[5], mv9 = m[9];

//        m[1] = m[1] * c - m[2] * s;
//        m[5] = m[5] * c - m[6] * s;
//        m[9] = m[9] * c - m[10] * s;

//        m[2] = m[2] * c + mv1 * s;
//        m[6] = m[6] * c + mv5 * s;
//        m[10] = m[10] * c + mv9 * s;
//    }

//    function rotateY(m, angle)
//    {
//        var c = Math.cos(angle);
//        var s = Math.sin(angle);
//        var mv0 = m[0], mv4 = m[4], mv8 = m[8];

//        m[0] = c * m[0] + s * m[2];
//        m[4] = c * m[4] + s * m[6];
//        m[8] = c * m[8] + s * m[10];

//        m[2] = c * m[2] - s * mv0;
//        m[6] = c * m[6] - s * mv4;
//        m[10] = c * m[10] - s * mv8;
//    }

//    /*================= Drawing ===========================*/
//    var time_old = 0;

//    var animate = function (time)
//    {

//        var dt = time - time_old;
//        //rotateZ(mov_matrix, dt * 0.005);//time
//        //rotateY(mov_matrix, dt * 0.002);
//        //rotateX(mov_matrix, dt * 0.003);
//        time_old = time;

//        gl.enable(gl.DEPTH_TEST);
//        gl.depthFunc(gl.LEQUAL);
//        gl.clearColor(0.5, 0.5, 0.5, 0.9);
//        gl.clearDepth(1.0);

//        gl.viewport(0.0, 0.0, canvas.width, canvas.height);
//        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//        gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
//        gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
//        gl.uniformMatrix4fv(Mmatrix, false, view_matrix);
//        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
//        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

//        window.requestAnimationFrame(animate);
//    }
//    animate(0);
//}
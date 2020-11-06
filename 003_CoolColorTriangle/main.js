var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
window.onload = function () {
    return __awaiter(this, void 0, void 0, function () {
        var canvas, body, gl, vertexShaderText, vertexShader, fragmentShaderText, fragmentShader, program, vertices, colors, vertexBuffer, vertexAttributeLocation, colorBuffer, colorAttributeLocation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = document.createElement("canvas");
                    canvas.id = "glCanvas";
                    canvas.width = 600;
                    canvas.height = 400;
                    body = document.body.appendChild(canvas);
                    gl = canvas.getContext("webgl");
                    if (null == gl) {
                        alert("your browser not support webgl, please check your browser");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("Shaders/vertexShader.vert").then(function (res) { return res.text(); })];
                case 1:
                    vertexShaderText = _a.sent();
                    console.log(vertexShaderText);
                    vertexShader = gl.createShader(gl.VERTEX_SHADER);
                    gl.shaderSource(vertexShader, vertexShaderText);
                    gl.compileShader(vertexShader);
                    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                        console.error("vertex shader compile failed", gl.getShaderInfoLog(vertexShader));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("Shaders/fragmentShader.frag").then(function (res) { return res.text(); })];
                case 2:
                    fragmentShaderText = _a.sent();
                    console.log(fragmentShaderText);
                    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
                    gl.shaderSource(fragmentShader, fragmentShaderText);
                    gl.compileShader(fragmentShader);
                    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                        console.error("fragment shader compile faield", gl.getShaderInfoLog(fragmentShader));
                        return [2 /*return*/];
                    }
                    program = gl.createProgram();
                    gl.attachShader(program, vertexShader);
                    gl.attachShader(program, fragmentShader);
                    gl.linkProgram(program);
                    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                        console.error("program link error", gl.getProgramInfoLog(program));
                        return [2 /*return*/];
                    }
                    gl.validateProgram(program);
                    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                        console.error("validate failed", gl.getProgramInfoLog(program));
                        return [2 /*return*/];
                    }
                    gl.useProgram(program);
                    vertices = [
                        -0.5, -0.5, 0.0,
                        0.0, 0.5, 0.0,
                        0.5, -0.5, 0.0
                    ];
                    colors = [
                        1.0, 0.0, 0.0, 1.0,
                        0.0, 1.0, 0.0, 1.0,
                        0.0, 0.0, 1.0, 1.0
                    ];
                    vertexBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
                    vertexAttributeLocation = gl.getAttribLocation(program, "vsInputposition");
                    gl.vertexAttribPointer(vertexAttributeLocation, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
                    gl.enableVertexAttribArray(vertexAttributeLocation);
                    colorBuffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
                    colorAttributeLocation = gl.getAttribLocation(program, "vsInputColor");
                    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
                    gl.enableVertexAttribArray(colorAttributeLocation);
                    gl.clearColor(0, 0, 0, 1);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLES, 0, 3);
                    return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=main.js.map
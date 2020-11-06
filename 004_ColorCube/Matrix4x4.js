"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js
 */
var Matrix4x4 = /** @class */ (function () {
    function Matrix4x4(other) {
        if (other === void 0) { other = null; }
        this.ROW = 4;
        this.COLUMN = 4;
        this.SIZE = 16;
        this.m = [];
        for (var i = 0; i < this.SIZE; ++i) {
            if (null === other)
                this.m.push(0);
            else
                this.m.push(other.m[i]);
        }
    }
    Matrix4x4.prototype.SetData1D = function (value, index) {
        this.m[index] = value;
    };
    Matrix4x4.prototype.SetData2D = function (value, i, j) {
        if (i >= 4) {
            alert("i must be smaller than 4");
            return;
        }
        if (j >= 4) {
            alert(" j must be smaller than 4");
            return;
        }
        var index = this.COLUMN * i + j;
        this.m[index] = value;
    };
    Matrix4x4.prototype.TranslateXYZ = function (x, y, z) {
        this.m[3] = x;
        this.m[7] = y;
        this.m[11] = z;
    };
    Matrix4x4.prototype.ScaleXYZ = function (x, y, z) {
        this.m[0] = x;
        this.m[5] = y;
        this.m[10] = z;
    };
    Matrix4x4.prototype.Add = function (other) {
        for (var i = 0; i < this.m.length; ++i) {
            this.m[i] += other.m[i];
        }
    };
    Matrix4x4.prototype.MultiplyScalar = function (scalar) {
        for (var i = 0; i < this.m.length; ++i) {
            ;
            this.m[i] *= scalar;
        }
    };
    Matrix4x4.prototype.SetZero = function () {
        for (var i = 0; i < this.SIZE; ++i) {
            this.m[i] = 0;
        }
    };
    Matrix4x4.prototype.SetIdentity = function () {
        this.SetZero();
        this.m[0] = 1;
        this.m[5] = 1;
        this.m[10] = 1;
        this.m[15] = 1;
    };
    Matrix4x4.prototype.Mul = function (b) {
        var a = new Matrix4x4(this);
        var a11 = a.m[0], a12 = a.m[4], a13 = a.m[8], a14 = a.m[12];
        var a21 = a.m[1], a22 = a.m[5], a23 = a.m[9], a24 = a.m[13];
        var a31 = a.m[2], a32 = a.m[6], a33 = a.m[10], a34 = a.m[14];
        var a41 = a.m[3], a42 = a.m[7], a43 = a.m[11], a44 = a.m[15];
        var b11 = b.m[0], b12 = b.m[4], b13 = b.m[8], b14 = b.m[12];
        var b21 = b.m[1], b22 = b.m[5], b23 = b.m[9], b24 = b.m[13];
        var b31 = b.m[2], b32 = b.m[6], b33 = b.m[10], b34 = b.m[14];
        var b41 = b.m[3], b42 = b.m[7], b43 = b.m[11], b44 = b.m[15];
        this.m[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        this.m[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        this.m[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        this.m[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        this.m[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        this.m[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        this.m[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        this.m[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        this.m[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        this.m[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        this.m[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        this.m[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        this.m[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        this.m[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        this.m[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        this.m[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    };
    Matrix4x4.prototype.GetPerspectiveMatrix = function (nearPlane, farPlane, fieldOfView, verticalAngle, horizontalAngle) {
        var pm;
        return pm;
    };
    return Matrix4x4;
}());
exports.Matrix4x4 = Matrix4x4;
//# sourceMappingURL=Matrix4x4.js.map
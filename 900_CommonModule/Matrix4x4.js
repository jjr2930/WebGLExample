export class Matrix4x4 {
    constructor(other = null) {
        this.ROW = 4;
        this.COLUMN = 4;
        this.SIZE = 16;
        this.m = [];
        for (var i = 0; i < this.SIZE; ++i) {
            if (null == other)
                this.m.push(0);
            else
                this.m.push(other.m[i]);
        }
    }
    SetData1D(value, index) {
        this.m[index] = value;
    }
    SetData2D(value, i, j) {
        if (i >= 4) {
            alert("i must be smaller than 4");
            return;
        }
        if (j >= 4) {
            alert(" j must be smaller than 4");
            return;
        }
        let index = this.COLUMN * i + j;
        this.m[index] = value;
    }
    TranslateXYZ(x, y, z) {
        this.m[3] = x;
        this.m[7] = y;
        this.m[11] = z;
    }
    ScaleXYZ(x, y, z) {
        this.m[0] = x;
        this.m[5] = y;
        this.m[10] = z;
    }
    Add(other) {
        for (var i = 0; i < this.m.length; ++i) {
            this.m[i] += other.m[i];
        }
    }
    MultiplyScalar(scalar) {
        for (var i = 0; i < this.m.length; ++i) {
            ;
            this.m[i] *= scalar;
        }
    }
    SetZero() {
        for (var i = 0; i < this.SIZE; ++i) {
            this.m[i] = 0;
        }
    }
    SetIdentity() {
        for (var i = 0; i < this.SIZE; ++i) {
            this.m[i] = 0;
        }
        this.m[0] = 1;
        this.m[5] = 1;
        this.m[10] = 1;
        this.m[15] = 1;
    }
    MultiplyMatrix(b) {
        var a = new Matrix4x4(this);
        for (var i = 0; i < this.ROW; ++i) {
            for (var j = 0; j < this.COLUMN; j++) {
                var r = this.COLUMN * i; //row
                var sum = 0;
                for (var k = 0; k < this.COLUMN; ++k) {
                    sum += a.m[r + k] * b.m[this.COLUMN * k + j];
                }
                this.m[r + j] = sum;
            }
        }
    }
}
//# sourceMappingURL=Matrix4x4.js.map
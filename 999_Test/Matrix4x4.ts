export class Matrix4x4 
{
    public readonly ROW: number = 4;
    public readonly COLUMN: number = 4;
    public readonly SIZE: number = 16;

    private m: number[];

    constructor(other: Matrix4x4 = null) {
        this.m = [];
        for (var i = 0; i < this.SIZE; ++i)
        {            
            if (null == other)
                this.m.push(0);
            else
                this.m.push(other.m[i]);
        }
    }

    public SetData1D(value : number, index: number): void
    {
        this.m[index] = value;
    }

    public SetData2D(value: number, i: number, j: number): void
    {
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

    public TranslateXYZ(x: number, y: number, z: number): void {
        this.m[3] = x;
        this.m[7] = y;
        this.m[11] = z;
    }

    public ScaleXYZ(x: number, y: number, z: number): void
    {
        this.m[0] = x;
        this.m[5] = y;
        this.m[10] = z;
    }

    public Add(other: Matrix4x4): void
    {
        for (var i = 0; i < this.m.length; ++i)
        {
            this.m[i] += other.m[i];
        }
    }

    public MultiplyScalar(scalar: number): void
    {
        for (var i = 0; i < this.m.length; ++i) {;
            this.m[i] *= scalar;
        }
    }

    public SetZero(): void {
        for (var i = 0; i < this.SIZE; ++i) {
            this.m[i] = 0;
        }
    }

    public SetIdentity(): void {

        for (var i = 0; i < this.SIZE; ++i) {
            this.m[i] = 0;
        }

        this.m[0] = 1;
        this.m[5] = 1;
        this.m[10] = 1;
        this.m[15] = 1;
    }

    public MultiplyMatrix(b: Matrix4x4): void {
        var a = new Matrix4x4(this);

        for (var i = 0; i < this.ROW; ++i) {
            for (var j = 0; j < this.COLUMN; j++) {
                var r = this.COLUMN * i;//row
                var sum = 0;
                for (var k = 0; k < this.ROW; ++k) {
                    sum += a.m[r + k] * b.m[this.COLUMN * k + j];
                }    
                this.m[r + j] = sum;
            }
        }
    }
}
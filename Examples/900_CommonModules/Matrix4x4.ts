import { MathUtils } from "./MathUtils.js"
export class Matrix4x4 
{
    public readonly ROW: number = 4;
    public readonly COLUMN: number = 4;
    public readonly SIZE: number = 16;

    private m: number[];

    constructor(other: Matrix4x4 = null)
    {
        this.m = [];
        for (let i = 0; i < this.SIZE; ++i)
        {
            if (null === other)
                this.m.push(0);
            else
                this.m.push(other.m[i]);
        }
    }

    public SetData1D(value: number, index: number): void
    {
        this.m[index] = value;
    }

    public SetData2D(value: number, i: number, j: number): void
    {
        if (i >= 4)
        {
            alert("i must be smaller than 4");
            return;
        }

        if (j >= 4)
        {
            alert(" j must be smaller than 4");
            return;
        }

        const index = this.COLUMN * i + j;
        this.m[index] = value;
    }

    public TranslateXYZ(x: number, y: number, z: number): void
    {
        this.SetIdentity();
        this.m[3] = x;
        this.m[7] = y;
        this.m[11] = z;
    }

    public ScaleXYZ(x: number, y: number, z: number): void
    {
        this.SetIdentity();
        this.m[0] = x;
        this.m[5] = y;
        this.m[10] = z;
    }

    // Based on http://www.gamedev.net/reference/articles/article1199.asp
    public RotateAxis(angle: number, axis: number[]): void
    {
        const radAngle = angle * MathUtils.DEG2RAD;
        const c = Math.cos(radAngle);
        const s = Math.sin(radAngle);
        const t = 1 - c;
        const x = axis[0];
        const y = axis[1];
        const z = axis[2];
        const tx = t * x;
        const ty = t * y;

        this.m[0] = tx * x + c;         this.m[4] = tx * y - s * z; this.m[8] = tx * z + s * y; this.m[12] = 0;
        this.m[1] = tx * y + s * z;     this.m[5] = ty * y + c;     this.m[9] = ty * z - s * x; this.m[13] = 0;
        this.m[2] = tx * z - s * y;     this.m[6] = ty * z + s * x; this.m[10] = t * z * z + c; this.m[14] = 0;
        this.m[3] = 0;                  this.m[7] = 0;              this.m[11] = 0;             this.m[15] = 1;
    }

    public Add(other: Matrix4x4): void
    {
        for (let i = 0; i < this.m.length; ++i)
        {
            this.m[i] += other.m[i];
        }
    }

    public MultiplyScalar(scalar: number): void
    {
        for (let i = 0; i < this.m.length; ++i)
        {
            ;
            this.m[i] *= scalar;
        }
    }

    public SetZero(): void
    {
        for (let i = 0; i < this.SIZE; ++i)
        {
            this.m[i] = 0;
        }
    }

    public SetIdentity(): void
    {

        for (let i = 0; i < this.SIZE; ++i)
        {
            this.m[i] = 0;
        }

        this.m[0] = 1;
        this.m[5] = 1;
        this.m[10] = 1;
        this.m[15] = 1;
    }

    public Mul(b: Matrix4x4): void
    {
        const a = new Matrix4x4(this);

        const a11 = a.m[0], a12 = a.m[4], a13 = a.m[8], a14 = a.m[12];
        const a21 = a.m[1], a22 = a.m[5], a23 = a.m[9], a24 = a.m[13];
        const a31 = a.m[2], a32 = a.m[6], a33 = a.m[10], a34 = a.m[14];
        const a41 = a.m[3], a42 = a.m[7], a43 = a.m[11], a44 = a.m[15];

        const b11 = b.m[0], b12 = b.m[4], b13 = b.m[8], b14 = b.m[12];
        const b21 = b.m[1], b22 = b.m[5], b23 = b.m[9], b24 = b.m[13];
        const b31 = b.m[2], b32 = b.m[6], b33 = b.m[10], b34 = b.m[14];
        const b41 = b.m[3], b42 = b.m[7], b43 = b.m[11], b44 = b.m[15];

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
    }


    public SetPerspectiveMatrix(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number): void 
    {
        const [l, r, t, b, n, f] = this.ValidateProjectionMatrixParameters(left, right, top, bottom, near, far);

        const x = 2 * n / (r - l);
        const y = 2 * n / (t - b);

        const aa = (r + l) / (r - l);
        const bb = (t + b) / (t - b);
        const cc = -(f + n) / (f - n);
        const dd = -2 * f * n / (f - n);

        this.m[0] = x; this.m[4] = 0; this.m[8] = aa; this.m[12] = 0;
        this.m[1] = 0; this.m[5] = y; this.m[9] = bb; this.m[13] = 0;
        this.m[2] = 0; this.m[6] = 0; this.m[10] = cc; this.m[14] = dd;
        this.m[3] = 0; this.m[7] = 0; this.m[11] = 0; this.m[15] = 0;
    }

    public SetOrthographicMatrix(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number): void
    {
        const [l, r, t, b, n, f] = this.ValidateProjectionMatrixParameters(left, right, top, bottom, near, far);

        const w = 1.0 / (r - l);
        const h = 1.0 / (t - b);
        const p = 1.0 / (f - n);

        const x = (r + l) * w;
        const y = (t + b) * h;
        const z = (f + n) * p;

        this.m[0] = 2 * w;  this.m[4] = 0;      this.m[8] = 0;          this.m[12] = -x;
        this.m[1] = 0;      this.m[5] = 2 * h;  this.m[9] = 0;          this.m[13] = -y;
        this.m[2] = 0;      this.m[6] = 0;      this.m[10] = -2 * p;    this.m[14] = -z;
        this.m[3] = 0;      this.m[7] = 0;      this.m[11] = 0;         this.m[15] = 1;
    }

    private ValidateProjectionMatrixParameters(
        left: number,
        right: number,
        top: number,
        bottom: number,
        near: number,
        far: number): [number, number, number, number, number, number]
    {
        let l: number;
        let r: number;
        let t: number;
        let b: number;
        let n: number;
        let f: number;

        if (MathUtils.IsSame(left, right))
        {
            l = -1;
            r = 1;
        }

        if (MathUtils.IsSame(top, bottom))
        {
            t = 1;
            b = -1;
        }

        if (MathUtils.IsSame(near, far))
        {
            n = 0.001;
            f = 1000;
        }

        if (far < near)
        {
            const temp = near;
            near = far;
            far = temp;
        }

        if (MathUtils.IsSame(n, 0))
        {
            n = 0.001;
        }

        if (MathUtils.IsSame(f, 0))
        {
            f = 1000;
        }

        return [l, r, t, b, n, f];
    }

    public ToString(): string
    {
        let res = "";
        res += this.m[0].toFixed(5) + " , "; res += this.m[4].toFixed(5) + " , "; res += this.m[8].toFixed(5) + " , "; res += this.m[12].toFixed(5) + " , "; res += "\n";
        res += this.m[1].toFixed(5) + " , "; res += this.m[5].toFixed(5) + " , "; res += this.m[9].toFixed(5) + " , "; res += this.m[13].toFixed(5) + " , "; res += "\n";
        res += this.m[2].toFixed(5) + " , "; res += this.m[6].toFixed(5) + " , "; res += this.m[10].toFixed(5) + " , "; res += this.m[14].toFixed(5) + " , "; res += "\n";
        res += this.m[3].toFixed(5) + " , "; res += this.m[7].toFixed(5) + " , "; res += this.m[11].toFixed(5) + " , "; res += this.m[15].toFixed(5) + " , "; res += "\n";

        return res;
    }
}
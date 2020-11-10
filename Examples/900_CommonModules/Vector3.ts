export class Vector3
{
    x: number;
    y: number;
    z: number;
   

    get X(): number { return this.x; }
    set X(v: number) { this.x = v; }

    get Y(): number { return this.y; }
    set Y(v: number) { this.y = v; }

    get Z(): number { return this.z; }
    set Z(v: number) { this.z = v; }
   
    AddScalar(scalar: number): void
    {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
    }

    SubScalar(scalar: number): void
    {
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
    }

    MulScalar(scalar: number): void
    {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;   
    }

    DivScalar(scalar: number): void
    {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }

    SqrtMagnitude(): number
    {
        const xx = this.x * this.x;
        const yy = this.y * this.y;
        const zz = this.z * this.z;

        return xx + yy + zz;
    }

    Magnitude(): number
    {
        return Math.sqrt(this.SqrtMagnitude());
    }

    Normalize(): void
    {
        const magn = this.Magnitude();
        if (magn === 0)
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return;
        }

        this.x /= magn;
        this.y /= magn;
        this.z /= magn;
    }

    Normalized(): Vector3
    {
        let result: Vector3;
        result.x = this.x;
        result.y = this.y;
        result.z = this.z;

        result.Normalize();
        return result;  
    }
    /*
     * static functions
     */

    static Dot(v1: Vector3, v2: Vector3): number
    {
        const x1 = v1.x * v2.x;
        const x2 = v1.y * v2.y;
        const x3 = v1.z * v2.z;

        return x1 + x2 + x3;
    }

    static Cross(v1: Vector3, v2: Vector3): Vector3
    {
        let result: Vector3;
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = v1.z * v2.x - v1.x * v2.z;
        const z = v1.x * v2.y - v1.y * v2.x;

        result.x = x;
        result.y = y;
        result.z = z;

        return result;
    }

    static Angle(v1: Vector3, v2: Vector3): number
    {
        const normV1 = v1.Normalized();
        const normV2 = v2.Normalized();
        
        const dot = Vector3.Dot(normV1, normV2);
        const angle = Math.acos(dot);
        return angle;        
    }

    static Add(v1: Vector3, v2: Vector3): Vector3
    {
        let result: Vector3;
        result.x += v1.x + v2.x;
        result.y += v1.y + v2.y;
        result.z += v1.z + v2.z;

        return result;
    }

    static Sub(v1: Vector3, v2: Vector3): Vector3
    {
        let result: Vector3;
        result.x = v1.x - v2.x;
        result.y = v1.y - v2.y;
        result.z = v1.z - v2.z;

        return result;
    }
}
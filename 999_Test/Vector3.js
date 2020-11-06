export class Vector3 {
    get X() { return this.x; }
    set X(v) { this.x = v; }
    get Y() { return this.y; }
    set Y(v) { this.y = v; }
    get Z() { return this.z; }
    set Z(v) { this.z = v; }
    AddScalar(scalar) {
        this.x += scalar;
        this.y += scalar;
        this.z += scalar;
    }
    SubScalar(scalar) {
        this.x -= scalar;
        this.y -= scalar;
        this.z -= scalar;
    }
    MulScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }
    DivScalar(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        this.z /= scalar;
    }
    SqrtMagnitude() {
        const xx = this.x * this.x;
        const yy = this.y * this.y;
        const zz = this.z * this.z;
        return xx + yy + zz;
    }
    Magnitude() {
        return Math.sqrt(this.SqrtMagnitude());
    }
    Normalize() {
        const magn = this.Magnitude();
        if (magn === 0) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return;
        }
        this.x /= magn;
        this.y /= magn;
        this.z /= magn;
    }
    Normalized() {
        let result;
        result.x = this.x;
        result.y = this.y;
        result.z = this.z;
        result.Normalize();
        return result;
    }
    /*
     * static functions
     */
    static Dot(v1, v2) {
        const x1 = v1.x * v2.x;
        const x2 = v1.y * v2.y;
        const x3 = v1.z * v2.z;
        return x1 + x2 + x3;
    }
    static Cross(v1, v2) {
        let result;
        const x = v1.y * v2.z - v1.z * v2.y;
        const y = v1.z * v2.x - v1.x * v2.z;
        const z = v1.x * v2.y - v1.y * v2.x;
        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    }
    static Angle(v1, v2) {
        const normV1 = v1.Normalized();
        const normV2 = v2.Normalized();
        const dot = Vector3.Dot(normV1, normV2);
        const angle = Math.acos(dot);
        return angle;
    }
    static Add(v1, v2) {
        let result;
        result.x += v1.x + v2.x;
        result.y += v1.y + v2.y;
        result.z += v1.z + v2.z;
        return result;
    }
    static Sub(v1, v2) {
        let result;
        result.x = v1.x - v2.x;
        result.y = v1.y - v2.y;
        result.z = v1.z - v2.z;
        return result;
    }
}
//# sourceMappingURL=Vector3.js.map
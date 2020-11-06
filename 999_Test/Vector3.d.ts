export declare class Vector3 {
    x: number;
    y: number;
    z: number;
    get X(): number;
    set X(v: number);
    get Y(): number;
    set Y(v: number);
    get Z(): number;
    set Z(v: number);
    AddScalar(scalar: number): void;
    SubScalar(scalar: number): void;
    MulScalar(scalar: number): void;
    DivScalar(scalar: number): void;
    SqrtMagnitude(): number;
    Magnitude(): number;
    Normalize(): void;
    Normalized(): Vector3;
    static Dot(v1: Vector3, v2: Vector3): number;
    static Cross(v1: Vector3, v2: Vector3): Vector3;
    static Angle(v1: Vector3, v2: Vector3): number;
    static Add(v1: Vector3, v2: Vector3): Vector3;
    static Sub(v1: Vector3, v2: Vector3): Vector3;
}

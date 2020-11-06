export declare class Matrix4x4 {
    readonly ROW: number;
    readonly COLUMN: number;
    readonly SIZE: number;
    private m;
    constructor(other?: Matrix4x4);
    SetData1D(value: number, index: number): void;
    SetData2D(value: number, i: number, j: number): void;
    TranslateXYZ(x: number, y: number, z: number): void;
    ScaleXYZ(x: number, y: number, z: number): void;
    Add(other: Matrix4x4): void;
    MultiplyScalar(scalar: number): void;
    SetZero(): void;
    SetIdentity(): void;
    MultiplyMatrix(b: Matrix4x4): void;
}

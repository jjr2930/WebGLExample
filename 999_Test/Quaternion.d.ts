import { Vector3 } from "./Vector3.js";
export declare class Quaternion {
    private w;
    private x;
    private y;
    private z;
    SetRotate(w: number, axis: number[]): void;
    ToEuler(): Vector3;
    FromEuler(euler: Vector3): Quaternion;
    SetIdentity(): void;
}

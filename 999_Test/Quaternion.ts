import { Vector3 } from "./Vector3.js"
import { Matrix4x4 } from "./Matrix4x4.js"
export class Quaternion
{
    private w: number;
    private x: number;
    private y: number;
    private z: number;

    public SetRotate(w: number, axis: number[])
    {
        if (3 !== axis.length)
            return;

        this.w = w;
        this.x = axis[0];
        this.y = axis[1];
        this.z = axis[2];
    }

    public ToEuler(): Vector3
    {
        let res: Vector3;
        const r11 = -2 * (this.y * this.z - this.w * this.x);
        const r12 = this.w * this.w - this.x * this.x - this.y * this.y + this.z * this.z;
        const r21 = 2 * (this.x * this.z + this.w * this.y);
        const r31 = -2 * (this.x * this.y - this.w * this.z);
        const r32 = this.w * this.w + this.x * this.x - this.y * this.y - this.z * this.z;
        
        res.X = Math.atan2(r31, r32);
        res.Y = Math.asin(r21);
        res.Z = Math.atan2(r11, r12);

        return res;
    }

    public FromEuler(euler: Vector3)
    {
        // Abbreviations for the various angular functions
        const cy = Math.cos(euler.y * 0.5); // 0: 1
        const sy = Math.sin(euler.y * 0.5); // 0: 0
        const cp = Math.cos(euler.z * 0.5); // 0: 1
        const sp = Math.sin(euler.z * 0.5); // 0: 0
        const cr = Math.cos(euler.x * 0.5); // 0: 1
        const sr = Math.sin(euler.x * 0.5); // 0: 0

        let res: Quaternion;
        res.w = cr * cp * cy + sr * sp * sy;
        res.x = sr * cp * cy - cr * sp * sy;
        res.y = cr * sp * cy + sr * cp * sy;
        res.z = cr * cp * sy - sr * sp * cy;

        return res;
    }

    public SetIdentity()
    {
        this.w = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    //https://neoplanetz.tistory.com/entry/CV-%EC%BF%BC%ED%84%B0%EB%8B%88%EC%96%B8%EC%9D%84-%EB%A1%9C%ED%85%8C%EC%9D%B4%EC%85%98-%EB%A7%A4%ED%8A%B8%EB%A6%AD%EC%8A%A4%EB%A1%9C-%EB%B3%80%ED%99%98-Quaternion-to-Rotation-Matrix
    public ToMatrix4x4(): Matrix4x4
    {
        let res: Matrix4x4;

        const xx = this.x * this.x;
        const xy = this.x * this.y;
        const xz = this.x * this.z;
        const xw = this.x * this.w;

        const yy =this.y * this.y;
        const yz =this.y * this.z;
        const yw =this.y * this.w;
        const zz =this.z * this.z;
        const zw = this.z * this.w;

        res.SetIdentity();
        res.SetData1D(1 - 2 * (yy + zz), 0);
        res.SetData1D(2 * (xy - zw), 1);
        res.SetData1D(2 * (xz + yw), 2);
        res.SetData1D(2 * (xy + zw), 4);
        res.SetData1D(1 - 2 * (xx + zz), 5);
        res.SetData1D(2 * (yz - xw), 6);
        res.SetData1D(2 * (xz - yw), 8);
        res.SetData1D(2 * (yz + xw), 9);
        res.SetData1D(1 - 2 * (xx + yy), 10);
    }
}
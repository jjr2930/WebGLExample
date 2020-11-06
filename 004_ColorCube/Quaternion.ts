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
}
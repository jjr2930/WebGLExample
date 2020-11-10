export class MathUtils
{
    public static readonly DEG2RAD = Math.PI / 180.0; 
    public static readonly RAD2DEG = 180.0 / Math.PI;

    public static IsSame(a: number, b: number): boolean
    {
        return a >= b - Number.EPSILON && a <= b + Number.EPSILON;
    }

    public static Clamp(value: number, min: number, max: number): number
    {
        let result = value;
        if (result < min)
            result = min
        else if (result > max)
            result = max;

        return result;
    }
}
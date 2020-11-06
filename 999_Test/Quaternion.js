export class Quaternion {
    SetRotate(w, axis) {
        if (3 !== axis.length)
            return;
        this.w = w;
        this.x = axis[0];
        this.y = axis[1];
        this.z = axis[2];
    }
    ToEuler() {
        let res;
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
    FromEuler(euler) {
        // Abbreviations for the various angular functions
        const cy = Math.cos(euler.y * 0.5); // 0: 1
        const sy = Math.sin(euler.y * 0.5); // 0: 0
        const cp = Math.cos(euler.z * 0.5); // 0: 1
        const sp = Math.sin(euler.z * 0.5); // 0: 0
        const cr = Math.cos(euler.x * 0.5); // 0: 1
        const sr = Math.sin(euler.x * 0.5); // 0: 0
        let res;
        res.w = cr * cp * cy + sr * sp * sy;
        res.x = sr * cp * cy - cr * sp * sy;
        res.y = cr * sp * cy + sr * cp * sy;
        res.z = cr * cp * sy - sr * sp * cy;
        return res;
    }
    SetIdentity() {
        this.w = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
//# sourceMappingURL=Quaternion.js.map
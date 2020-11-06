import { Matrix4x4 } from "./Matrix4x4.js";
window.onload = function () {
    const m1 = new Matrix4x4();
    for (let i = 0; i < 16; i++) {
        m1.SetData1D(i, i);
    }
    
    let m2 = new Matrix4x4();
    for (let i = 0; i < 16; ++i) {
        m2.SetData1D(i, i);
    }

    m1.MultiplyMatrix(m2);

    console.log("HI");
}
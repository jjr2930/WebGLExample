"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Quaternion = /** @class */ (function () {
    function Quaternion() {
    }
    Quaternion.prototype.SetRotate = function (w, axis) {
        if (3 !== axis.length)
            return;
        this.w = w;
        this.x = axis[0];
        this.y = axis[1];
        this.z = axis[2];
    };
    return Quaternion;
}());
exports.Quaternion = Quaternion;
//# sourceMappingURL=Quaternion.js.map
﻿window.onload = function ()
{
    const canvas = document.createElement("canvas");
    document.querySelector("body").appendChild(canvas);
    const gl = canvas.getContext("webgl");
    canvas.width = 640;
    canvas.height = 480;

    if (null === gl)
    {
        alert("Initializing Failed");
        return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}
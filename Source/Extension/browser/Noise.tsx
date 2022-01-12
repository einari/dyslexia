import { useEffect, useRef, useState } from 'react';

import { default as vertexShader } from './vertices.glsl';
import { default as fragmentShader } from './fragment.glsl';

function getVerticesFor(canvas: HTMLCanvasElement) {
    let aspect = canvas.width / canvas.height;
    aspect = 1;

    return new Float32Array([
        -1, 1 * aspect, 1, 1 * aspect, 1, -1 * aspect,
        -1, 1 * aspect, 1, -1 * aspect, -1, -1 * aspect
    ]);
}

export const Noise = () => {
    const canvasRef = useRef<HTMLCanvasElement>();

    const [milliseconds, setMilliseconds] = useState(100);
    const [opacity, setOpacity] = useState(0.5);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const gl = canvas.getContext("webgl");

            const vs = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vs, vertexShader);
            gl.compileShader(vs);

            const fs = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fs, fragmentShader);
            gl.compileShader(fs);

            const program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);

            if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
                console.log(gl.getShaderInfoLog(vs));

            if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
                console.log(gl.getShaderInfoLog(fs));

            if (!gl.getProgramParameter(program, gl.LINK_STATUS))
                console.log(gl.getProgramInfoLog(program));


            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

            gl.useProgram(program);

            const dim = [512, 512];
            program.u_resolution = gl.getUniformLocation(program, "u_resolution");
            program.u_seed = gl.getUniformLocation(program, "u_seed");
            gl.uniform2fv(program.u_resolution, dim);


            const vertices = getVerticesFor(canvas);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            const itemSize = 2;
            const numItems = vertices.length / itemSize;

            program.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            gl.enableVertexAttribArray(program.aVertexPosition);
            gl.vertexAttribPointer(program.aVertexPosition, itemSize, gl.FLOAT, false, 0, 0);

            const render = () => {
                const seed = Array(4).fill(0).map(Math.random);
                gl.uniform2fv(program.u_seed, seed);

                gl.clearColor(1, 0, 0, 0.5);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, numItems);

                canvas.width = canvas.parentElement.offsetWidth - 16;
                canvas.height = canvas.parentElement.offsetHeight;
                canvas.style.top = `${canvas.parentElement.offsetTop}px`;
                gl.viewport(0, 0, canvas.width, canvas.height);
                const vertices = getVerticesFor(canvas);
                gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            };

            const timer = setInterval(() => window.requestAnimationFrame(render), milliseconds);
            return () => clearInterval(timer);
        }
        return () => { };
    }, [milliseconds, opacity]);

    useEffect(() => {
        chrome.storage.sync.get(['milliseconds', 'opacity'], result => {
            setMilliseconds(result.milliseconds);
            setOpacity(result.opacity);
        });

        chrome.storage.onChanged.addListener(changes => {
            if (changes.milliseconds) {
                setMilliseconds(changes.milliseconds.newValue);
            }
            if (changes.opacity) {
                setOpacity(changes.opacity.newValue);
            }
        });

        return () => { };
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                opacity,
                position: 'fixed',
                top: '0px',
                width: '100%',
                height: '100%',
                zIndex: 1000
            }}
        />
    );
};


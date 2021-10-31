import { useEffect, useRef } from 'react';
import { default as styles } from './Noise.module.scss';

import { default as vertexShader } from './vertices.glsl';
import { default as fragmentShader } from './fragment.glsl';

export interface NoiseProps {
    milliseconds: number;
    opacity: number;
}

export const Noise = (props: NoiseProps) => {
    const canvasRef = useRef<HTMLCanvasElement>();

    function getVerticesFor(canvas: HTMLCanvasElement) {
        let aspect = canvas.width / canvas.height;
        aspect = 1;

        return new Float32Array([
            -1, 1 * aspect, 1, 1 * aspect, 1, -1 * aspect,
            -1, 1 * aspect, 1, -1 * aspect, -1, -1 * aspect
        ]);
    }


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

                canvas.width = canvas.parentElement.offsetWidth-16;
                canvas.height = canvas.parentElement.offsetHeight;
                canvas.style.top = `${canvas.parentElement.offsetTop}px`;
                gl.viewport(0, 0, canvas.width, canvas.height);
                const vertices = getVerticesFor(canvas);
                gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            };

            const timer = setInterval(() => window.requestAnimationFrame(render), props.milliseconds);
            return () => clearInterval(timer);
        }
        return () => { };
    }, [props]);

    return (
        <canvas
            ref={canvasRef}
            style={{ opacity: props.opacity }}
            className={styles.noise} />
    );
};

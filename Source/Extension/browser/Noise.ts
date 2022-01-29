import { default as vertexShader } from './vertices.glsl';
import { default as fragmentShader } from './fragment.glsl';

interface NoiseProgram extends WebGLProgram {
    u_seed: any;
    u_resolution: any;
    aVertexPosition: any;
}

export class Noise {
    private _milliseconds: number = 60;
    private _gl: WebGLRenderingContext;
    private _timer: any;
    private _program!: NoiseProgram;
    private _numItems: number = 0;


    constructor(private readonly _canvas: HTMLCanvasElement) {
        this._gl = this._canvas.getContext("webgl")!;
        this.initialize();
        this.startRendering();
    }

    get milliseconds() {
        return this._milliseconds;
    }

    set milliseconds(value: number) {
        this._milliseconds = value;
        this.startRendering();
    }

    private getVerticesFor() {
        let aspect = this._canvas.width / this._canvas.height;
        aspect = 1;

        return new Float32Array([
            -1, 1 * aspect, 1, 1 * aspect, 1, -1 * aspect,
            -1, 1 * aspect, 1, -1 * aspect, -1, -1 * aspect
        ]);
    }

    private initialize() {
        const vs = this._gl.createShader(this._gl.VERTEX_SHADER)!;
        this._gl.shaderSource(vs, vertexShader);
        this._gl.compileShader(vs);

        const fs = this._gl.createShader(this._gl.FRAGMENT_SHADER)!;
        this._gl.shaderSource(fs, fragmentShader);
        this._gl.compileShader(fs);

        this._program = this._gl.createProgram()! as NoiseProgram;
        this._gl.attachShader(this._program, vs);
        this._gl.attachShader(this._program, fs);
        this._gl.linkProgram(this._program);

        const vertexBuffer = this._gl.createBuffer();
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer);

        this._gl.useProgram(this._program);

        const dim = [512, 512];
        this._program.u_resolution = this._gl.getUniformLocation(this._program, "u_resolution");
        this._program.u_seed = this._gl.getUniformLocation(this._program, "u_seed");
        this._gl.uniform2fv(this._program.u_resolution, dim);

        const vertices = this.getVerticesFor();
        this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);

        const itemSize = 2;
        this._numItems = vertices.length / itemSize;

        this._program.aVertexPosition = this._gl.getAttribLocation(this._program, "aVertexPosition");
        this._gl.enableVertexAttribArray(this._program.aVertexPosition);
        this._gl.vertexAttribPointer(this._program.aVertexPosition, itemSize, this._gl.FLOAT, false, 0, 0);
    }

    private render() {
        const seed = Array(4).fill(0).map(Math.random);
        this._gl.uniform2fv(this._program.u_seed, seed);

        this._gl.clearColor(1, 0, 0, 0.5);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        this._gl.drawArrays(this._gl.TRIANGLES, 0, this._numItems);

        this._canvas.width = this._canvas.parentElement!.offsetWidth - 16;
        this._canvas.height = this._canvas.parentElement!.offsetHeight;
        this._canvas.style.top = `${this._canvas.parentElement!.offsetTop}px`;
        this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
        const vertices = this.getVerticesFor();
        this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW);
    };

    private startRendering() {
        if (this._timer) {
            clearInterval(this._timer);
        }
        this._timer = setInterval(this.render.bind(this), this._milliseconds);
    }
}

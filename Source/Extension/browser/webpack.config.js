const path = require('path');

const webpack = require('@cratis/webpack/frontend');
module.exports = (env, argv) => {
    return webpack(env, argv, '', config => {
        config.module.rules.push({
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
                'raw-loader',
                'glslify-loader'
            ]
        });
        config.output.filename = 'index.js';
        config.output.publicPath = '';
        config.output.sourceMapFilename = 'index.map';
        config.optimization.runtimeChunk = false;
        config.optimization.splitChunks = undefined;
        config.output.path = path.resolve(process.cwd(), '../package/browser');
        config.devServer.port = 9000;
        config.plugins[2].userOptions.publicPath = '';
    }, 'Dyslexia');
};

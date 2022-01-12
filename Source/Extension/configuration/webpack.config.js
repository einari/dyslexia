const path = require('path');

const webpack = require('@cratis/webpack/frontend');
module.exports = (env, argv) => {
    return webpack(env, argv, '', config => {
        config.output.filename = 'index.js';
        config.output.publicPath = '';
        config.output.sourceMapFilename = 'index.map';
        config.optimization.runtimeChunk = false;
        config.optimization.splitChunks = undefined;
        config.output.path = path.resolve(process.cwd(), '../package/configuration');
        config.devServer.port = 9000;
        config.plugins[2].userOptions.publicPath = '';
    }, 'Dyslexia');
};

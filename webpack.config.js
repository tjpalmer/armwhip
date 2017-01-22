let prod = process.argv.indexOf('-p') >= 0;
let webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/main.ts',
    vendor: [
      'three',
    ],
  },
  output: {filename: "app.js"},
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css',
      }, {
        test: /\.html$/,
        loader: 'html',
      }, {
        test: /\.ts$/,
        loader: 'awesome-typescript',
      },
    ],
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'tslint',
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
  ],
  resolve: {
    alias: {},
    extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
  },
  tslint: {
    configuration: {
      rules: {
        curly: true,
        indent: [true, 'spaces'],
        'no-constructor-vars': true,
        'no-var-keyword': true,
        quotemark: [true, 'single', 'avoid-escape'],
      },
    },
  },
};

if (prod) {
  module.exports.resolve.alias.three = 'three/build/three.min.js';
}

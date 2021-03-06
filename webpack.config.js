const path = require('path'),
  webpack = require('webpack'),
  uglifyJsPlugin = require('uglifyjs-webpack-plugin');

const rootPreFix = '.',
  entryFile = rootPreFix + '/index.js',
  polyfillFile = '@babel/polyfill';

const webpackOption = {
  target: 'web',
  node: { fs: 'empty' },
  entry: {
    'mosaic-tbd': [polyfillFile, entryFile],
    'mosaic-tbd.min': [polyfillFile, entryFile]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [new webpack.NormalModuleReplacementPlugin(/libs\/AbiBinProvider\.js/, '../tmp/AbiBinProvider.js')],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: '> 0.25%, not dead'
                    }
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: '//__NOT_FOR_WEB__BEGIN__.*?//__NOT_FOR_WEB__END__',
          replace: '',
          flags: 'isg'
        }
      },
      {
        test: require.resolve('./index.js'),
        use: [
          {
            loader: 'expose-loader',
            options: 'MosaicTbd'
          }
        ]
      },
      {
        test: /package\.json$/,
        loader: 'package-json-cleanup-loader',
        options: {
          only: ['version', 'name', 'otherParam']
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new uglifyJsPlugin({
        include: /\.min\.js$/
      })
    ]
  }
};

module.exports = webpackOption;

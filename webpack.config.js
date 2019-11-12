const path = require('path');
const fs = require('fs');

const readdir = require('readdir-enhanced');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function generateHtmlPlugins (templateDir) {
  var options = {
    withFileTypes: true,
    deep: true,
  };
  // Read files recursively in template directory
  const templateFiles = readdir.sync.stat(path.resolve(__dirname, templateDir), options);
  const filteredTemplateFiles = templateFiles.filter(item => {
    return item.isFile();
  });
  return filteredTemplateFiles.map(item => {
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: item.path,
      template: path.resolve(__dirname, templateDir, item.path),
      'meta': {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      },
    })
  });
}
const htmlPlugins = generateHtmlPlugins('./src/html/pages');

module.exports = [{
  entry: {
    app: './src/js/index.js',
  },
  output: {
    filename: 'js/[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          { loader: 'css-loader' },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./node_modules'],
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src/js'),
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          interpolate: true,
        },
      },
      {
        test: /\.*$/,
        include: path.join(__dirname, 'src/assets'),
        loader: 'file-loader',
        options: {
          name: '[path]/[name].[ext]',
          context: 'src',
        }
      },
      {
        test: /(robots.txt|favicon.ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        }
      },
      {
        test: /(.htaccess)$/,
        loader: 'file-loader',
        options: {
          name: '[name]',
        }
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
    }),
  ]
  .concat(htmlPlugins),
}];

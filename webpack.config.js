const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['ES2015', 'env']
          }
        }
      },
      {
        test: /\.mp3$/,
        //exclude: /node_modules/,
        use: 'file-loader'
    }
    ],
  },
  resolve: {
     extensions: [ '.ts', '.js', `.mp3` ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
/*
not needed in Stephen's kickcrowdfunding project...

------------== Andrew Mead #51
set entry file name
set output file name
add script in package.json: "build-webpack": "webpack",
yarn run build-webpack


Just run webpack and it will produce unminified output with sourcemaps.
Run "NODE_ENV=production webpack" as a package script and it will minify the output and de-dupe all the unnecessary code.
*/
const path = require('path');
//console.log(path.join(__dirname,'public'));

var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./pages/index.js",//or ./src/app.js
  output: {
    path: path.join(__dirname,'pages'),//__dirname + "/pages",
    filename: "index.min.js"//or bundle.js
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};

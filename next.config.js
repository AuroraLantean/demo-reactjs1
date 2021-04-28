/* next.config.js
For production deployment

make this next.config.js according to
https://github.com/zeit/next.js#static-html-export

Add to package.json
    "export": "next build && next export",

$ yarn run export
$ cd out
$ surge
*/
module.exports = {
  exportPathMap: function() {
    return {
      '/': { page: '/' }
    }
  }
}
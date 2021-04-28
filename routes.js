//https://github.com/fridays/next-routes
//setup all dynamic routes
// /campaigns/0x81473/requests ... needs index.js and add .. in route.js

const routes = require('next-routes')();//returns a function
// "()" returns a function and it will be invoked immediately after you require it

routes
.add('/campaigns/new', '/campaigns/new')
.add('/campaigns/:address', '/campaigns/show')
.add('/campaigns/:address/requests','/campaigns/requests/index')
.add('/campaigns/:address/requests/new','/campaigns/requests/new');
//clear our ; before adding a new route
//1st argument: specify the excluded routes first
//specify the url for matching... add : before the variable!
//2nd arguement: in working directory component file name to show
//restart the server!

//routes()
module.exports = routes;//used in new-campaign.js
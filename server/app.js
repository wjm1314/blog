const express = require('express');
const bodyParser = require('body-parser');
const route = require('./api/index');
const app = express();

//app.set('port',(process.env.port || 3003));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

//route(app);
app.use('/',route)



/*app.listen(app.get('port'),function () {
  console.log('GetData http://localhost:' + app.get('port'));
})*/
app.listen(8004);

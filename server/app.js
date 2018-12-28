const express = require('express');
const bodyParser = require('body-parser');
const route = require('./api/index');
const app = express();

//app.set('port',(process.env.port || 3003));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

//route(app);
app.use('/',route)

/*app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  // res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200); /!*让options请求快速返回*!/
  } else {
    next();
  }
})*/

/*app.listen(app.get('port'),function () {
  console.log('GetData http://localhost:' + app.get('port'));
})*/
app.listen(8004);

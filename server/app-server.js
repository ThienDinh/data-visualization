var express = require('express');

var app = express();

app.use(express.static('./client/public'))
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('./analysis'))

app.listen(3000);

console.log('Server is running at port ' + 3000)
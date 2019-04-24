const path = require('path');
const express = require("express");
const bodyParser  = require("body-parser");
const search = require(__dirname + "/search/search.js");
const app  = express();

function REST(){
    let self = this;
    self.configureExpress();
};

REST.prototype.configureExpress = function() {
    let self = this;
      app.set('view engine', 'jade');
      app.use(express.static(path.join('node_modules')));
      app.use("/", express.static(path.join(__dirname +'/html')));
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
    let router = express.Router();
      app.use('/api', router);
    let search_router = new search(router);
      self.startServer();
};

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
};

REST.prototype.stop = function(err) {
    console.log("ISSUE n" + err);
    process.exit(1);
};


new REST();


// app.get('/', function (req, res) {
//   res.send('Hello elodie !!');
// });
//
// app.get('/dev/search', function(req, res) {
//     res.sendFile(path.join(__dirname + '/html/index.html'));
// });
//
// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });

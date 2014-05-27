

var markov = require('./markov');
var express = require('express');
var router = express.Router();

var http = require('http');


// Got the data, just testing for now
var count = 0;
var start = 0;
var end = 102;
var generator = new markov.MarkovGenerator(2,500,' ');

function loadVenue(venue) {
  var gotJSON = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      //console.log(str);
      var data = JSON.parse(str);
      if (data.length > 0) {
        for (var j = 0; j < data.length; j++) {
          var txt = data[j].elevator_pitch; // project_name;
          if (txt) {
            //console.log(txt);
            generator.feed(txt);
          }
        }
      }
    });
  };
  var options = {
    host: 'itp.nyu.edu',
    path: '/dev/test/projectsDump.php?venue_id=' + venue + '&fields=project_name,elevator_pitch,description'
  };
  http.request(options, gotJSON).end();
}

for (var i = start; i < end; i++) {
  loadVenue(i);
  console.log("loading venue: " + i);
}


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'What is my ITP Project?', generated: generator.generate() });
});

module.exports = router;




var markov = require('./markov');
var express = require('express');
var router = express.Router();

var http = require('http');


// Got the data, just testing for now
var count = 0;
var start = 0;
var end = 102;
var loadedcount = 0;
var generator = new markov.MarkovGenerator(2,500,' ');
var tgenerator = new markov.MarkovGenerator(4,50,'');



function clean(txt) {
  var rg = /<.*?>/g;
  var ntxt = txt.replace(rg,'');
  ntxt = ntxt.replace(/&#039;/gi,"'");
  ntxt = ntxt.replace(/&QUOT;/gi,'"');
  ntxt = ntxt.replace(/&lt;br \/&gt;/gi,'');
  ntxt = ntxt.replace(/&amp;/gi,'&');
  ntxt = ntxt.replace(/&ndash;/gi,'-');
  return ntxt;
}

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
          var name = data[j].project_name;


          var txt = data[j].elevator_pitch; // project_name;
          //var txt = data[j].description; // project_name;
          if (txt && name) {
            // Lots of names have parenthese which don't get closed
            name = name.replace(/(\(|\))/g,'');

            txt = clean(txt);
            name = clean(name);

            //console.log(name);
            if (generator.valid(txt.toLowerCase()) && tgenerator.valid(name.toUpperCase())) {
              generator.feed(txt.toLowerCase());
              tgenerator.feed(name.toUpperCase());
              count++;
            }
          }
        }
      }
      loadedcount++;
      console.log("loading: " + loadedcount + " out of " + (end-start));

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
}

function capIt(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function process(s) {
  var sentences = s.match( /[^\.!\?]+[\.!\?]+/g );
  if (sentences != null) {
    for (var i = 0; i < sentences.length; i++) {
      sentences[i] = sentences[i].replace(/^\s+/,'');
      sentences[i] = capIt(sentences[i]);
    }
    return sentences.join(' ');
  } else {
    return s;
  }
}


/* Get an id */
router.get('/:id', function(req, res) {
  //console.log(req.params);
  var seed = Number(req.params.id);
  tgenerator.setSeed(seed);
  generator.setSeed(seed);
  var gtitle = tgenerator.generate();
  var gpitch = process(generator.generate(tgenerator.lastChoice));
  res.render('index', { title: 'What is my ITP Project?', gentitle: gtitle, pitch: gpitch, perma: seed });
});

/* No id */
router.get('/', function(req, res) {
  var seed = Math.floor(Math.random()*521288629);
  tgenerator.setSeed(seed);
  generator.setSeed(seed);
  var gtitle = tgenerator.generate();
  var gpitch = process(generator.generate(tgenerator.lastChoice));
  res.render('index', { title: 'What is my ITP Project?', gentitle: gtitle, pitch: gpitch, perma: seed });
});

module.exports = router;


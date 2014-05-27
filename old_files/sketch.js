var generator;

// Got the data, just testing for now
var count = 0;

var start = 0;
var end = 102;

var loading;

window.onload = function() {
  loading = document.getElementById('loading');
}

function gotit(data) {
  if (data.length > 0) {
    for (var j = 0; j < data.length; j++) {
      var txt = data[j].elevator_pitch; // project_name;
      if (txt) {
        generator.feed(txt);
      }
    }
    //console.log("Got a venue " + count);
  }
  loading.innerHTML += '.';
  count++;

  if (count >= end-start) {
    document.getElementById('generator').style.display = 'block';
    document.getElementById('setparameters').style.display = 'none';
    var output = document.getElementById('markov');
    output.innerHTML = '';
  }
}

function reload() {
  generator = null;
  count = 0;
  document.getElementById('generator').style.display = 'none';
  document.getElementById('setparameters').style.display = 'block';
  loading.innerHTML = ''
}

function loadData() {
  var order = document.getElementById('order');    
  // No delimiter means do it by char
  var delimiter = '';
  if(document.getElementById('word').checked) {
    delimiter = ' ';
  }
  var len = Number(document.getElementById('length').value);
  generator = new MarkovGenerator(order.value,len,delimiter);
  for (var i = start; i < end; i++) {
    loadVenue(i);  
  }

  loading.innerHTML = 'loading venues.';
}

function loadVenue(venue) {
  // Hardcode the URL I want the JSON from
  // I could just store all data locally but in theory I might want to pull dynamically
  var url = 'http://itp.nyu.edu/dev/test/projectsDump.php?venue_id=' + venue;
  url += '&fields=project_name,elevator_pitch,description';
  url += '&jsonp=true'
  url += '&callback=gotit';

  // JSONP sans JQuery
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.head.appendChild(script);
}




function generate() {
  var output = document.getElementById('markov');
  output.innerHTML = generator.generate();
}

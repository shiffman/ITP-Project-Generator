// This is all based on Adam Parrish's great examples
// for his ITP class RWET
// https://github.com/aparrish/rwet-examples

function MarkovGenerator(n,max,del) {
  this.delimiter = del;
  this.n = Number(n);// # order (length) of ngrams
  this.max = max;// # maximum number of elements to generate
  this.ngrams = {}; // # ngrams as keys; next elements as values
  this.beginnings = []; // beginning ngram of every line
  this.lastChoice;
  this.random = Marsaglia.createRandomized();
}

MarkovGenerator.prototype.setSeed = function(seed) {
  this.lastChoice = seed;
  this.random = new Marsaglia(seed);
}

MarkovGenerator.prototype.tokenize = function(text) {
  return text.split(this.delimiter);
};

// called from generate() to join together generated elements
// TODO: Is this joining an array of strings into a string?
MarkovGenerator.prototype.concatenate = function(source) {
  //return " ".join(source);
  return source.join(this.delimiter);
};

MarkovGenerator.prototype.valid = function(text) {
  var tokens = this.tokenize(text);
  if (tokens.length < this.n) {
    return false;
  } else {
    return true;
  }
}

MarkovGenerator.prototype.feed = function(text) {

  var tokens = this.tokenize(text);
  //console.log(tokens);

  // discard this line if it's too short
  if (tokens.length < this.n) {
    return false;
  }

  // store the first ngram of this line
  var beginning = tokens.slice(0,this.n);
  this.beginnings.push(beginning.join(this.delimiter));
  //console.log(this.beginnings.length);

  //console.log(this.beginnings);

  for (var i = 0; i < tokens.length-this.n; i++) {
    // I don't want it to be an array, let's make it a string again
    var gram = tokens.slice(i,i+this.n).join(this.delimiter);
    // We can leave the value as an array?
    var next = tokens[i+this.n]; // # get the element after the gram

    //console.log(gram);

    // if we've already seen this ngram, append; otherwise, set the
    // value for this key as a new list
    if (this.ngrams.hasOwnProperty(gram)) {
      this.ngrams[gram].push(next);
    } else {
      this.ngrams[gram] = [next];
    }
  }

};



// Like python's choice
// Includes ridiculous workaround to start title and description with same random choice
MarkovGenerator.prototype.choice = function(somelist,i,doit) {
  if (i === undefined) {
    i = Math.floor(this.random.nextDouble()*somelist.length);
  }
  
  if (doit) {
    this.lastChoice = i;
  }

  return somelist[i];
}

// generate a text from the information in self.ngrams
MarkovGenerator.prototype.generate = function(i) {

  // get a random line beginning; convert to a list. 
  var current = this.choice(this.beginnings,i,true);

  var output = current.split(this.delimiter);

  for (var i = 0; i < this.max; i++) {
    //console.log("Current: " + current);
    if (this.ngrams.hasOwnProperty(current)) {
      var possible_next = this.ngrams[current];
      var next = this.choice(possible_next);
      output.push(next);
      // get the last N entries of the output; we'll use this to look up
      // an ngram in the next iteration of the loop
      current = output.slice(output.length-this.n,output.length).join(this.delimiter);
    } else {
      break;
    }
  }
  var output_str = this.concatenate(output);
  return output_str;
};

module.exports.MarkovGenerator = MarkovGenerator;

// Pseudo-random generator
function Marsaglia(i1, i2) {

  // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
  var z=i1 || 362436069, w= i2 || 521288629;

  var nextInt = function() {
    z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
    w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
    return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
  };

  this.nextDouble = function() {
    var i = nextInt() / 4294967296;
    return i < 0 ? 1 + i : i;
  };

  this.nextInt = nextInt;
}
Marsaglia.createRandomized = function() {
  var now = new Date();
  return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};
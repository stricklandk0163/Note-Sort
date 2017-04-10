var sortingAlgorithms = require('../sortingAlgorithms');
var songs = require('../data/songs');
var algs = require('../data/algs');

//Shuffles array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

module.exports = function(app) {
  //Run the passed sorting algorithm on the given song and return the list of frames from the sort
  app.get('/sort/frames', (req,res) => {
    var algorithm = req.query.algorithm;
    var song = req.query.song;

    //Check if song is in songs json
    if (!songs.hasOwnProperty(song)){ //TODO make this work with database
      res.json("Song does not exist")
    }

    //Map song to a scrambled array of values
    var data = songs[song].map((tuple) => {return tuple.index});
    data = shuffle(data);

    //Run the selected sorting algorithm and get the list of frames from running the sort
    var frames = [];
    switch(algorithm) {
    case "MERGE":
        frames = sortingAlgorithms.mergesortWrapper(data);
        break;
    case "SELECT":
        frames = sortingAlgorithms.selectsort(data);
        break;
    case "INSERT":
        frames = sortingAlgorithms.insertsort(data);
        break;
    case "QUICK":
        frames = sortingAlgorithms.quickSortWrapper(data);
        break;
    case "COCKTAIL":
        frames = sortingAlgorithms.cocktailsort(data);
        break;
    case "BUBBLE":
        frames = sortingAlgorithms.bubblesort(data);
        break;
    default:
        res.json("Algorithm not found");
    }

    //Add song frames based on the final frame in the sort
    var songFrames = sortingAlgorithms.songFrames(frames[frames.length -1].data)

    //Add the song frames to the frames array
    res.json(frames.concat(songFrames));
  });

  //TODO: Janky AF right now. This method only needs to serve the song names. Also please clean up the song names, right now they're in camel case
  app.get('/songs', (req, res) => {
    var songTitles = [];
    for (var song in songs) {
      if (songs.hasOwnProperty(song)) {
        songTitles.push(song);
      }
    }
    res.json(songTitles);
  });

  //Get all sort types TODO: make this work with database
  app.get('/sortTypes', (req,res)=>{
    var types = [];
    for(var i = 0; i < algs.length; i++){
      types.push(algs[i].name);
    }
    res.json(types);
  });

  //Get the pseudo code for a give sort types TODO: make this work with database
  app.get('/sortTypes/psuedoCode', (req, res) => {
    var algorithm = req.query.algorithm;
    for(var i = 0; i < algs.length; i++){
      if(algs[i].name == algorithm){
        res.json(algs[i].pseudo);
      }
    }
    res.json("Algorithm not found");
  });
}

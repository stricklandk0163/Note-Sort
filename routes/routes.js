var sortingAlgorithms = require('../sortingAlgorithms');
var songs = require('../data/songs');
module.exports = function(app) {
  //Run the passed sorting algorithm on the given song and return the list of frames from the sort
  app.get('/sort/frames', (req,res) => {
    var algorithm = req.query.algorithm;
    var song = req.query.song;
    var data = [5,4,3,2,1];

    switch(algorithm) {
    case "MERGE":
        res.json(sortingAlgorithms.mergesortWrapper(data));
        break;
    case "SELECT":
        res.json(sortingAlgorithms.selectsort(data));
        break;
    case "INSERT":
        res.json(sortingAlgorithms.insertsort(data));
        break;
    case "QUICK":
        res.json(sortingAlgorithms.quickSortWrapper(data));
        break;
    case "COCKTAIL":
        res.json(sortingAlgorithms.cocktailsort(data));
        break;
    case "BUBBLE":
        res.json(sortingAlgorithms.bubblesort(data));
        break;
    default:
        res.json("Algorithm not found");
    }
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

  //Get all sort types
  app.get('/sortTypes', (req,res)=>{
    res.json(['MERGE', 'QUICK', 'INSERT', 'SELECT', 'COCKTAIL', 'BUBBLE']);
  });
}

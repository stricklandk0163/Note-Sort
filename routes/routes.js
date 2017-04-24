var sortingAlgorithms = require('../sortingAlgorithms');
var db = require('couchdb-promises')({
     baseUrl: 'http://localhost:5984'
})

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
    db.getView("note-sort", "song", "notes").then((data) => {
      var finalData = data.data.rows.find((row) => {
        if(row.value.name == req.query.song){
          return true;
        }
      });
      if(finalData){
        var noteData = finalData.value.notes.map((tuple) => {return tuple.index});
        noteData = shuffle(noteData);
        //Run the selected sorting algorithm and get the list of frames from running the sort
        var frames = [];
        switch(req.query.algorithm) {
        case "MERGE":
            frames = sortingAlgorithms.mergesortWrapper(noteData);
            break;
        case "SELECT":
            frames = sortingAlgorithms.selectsort(noteData);
            break;
        case "INSERT":
            frames = sortingAlgorithms.insertsort(noteData);
            break;
        case "QUICK":
            frames = sortingAlgorithms.quickSortWrapper(noteData);
            break;
        case "COCKTAIL":
            frames = sortingAlgorithms.cocktailsort(noteData);
            break;
        case "BUBBLE":
            frames = sortingAlgorithms.bubblesort(noteData);
            break;
        default:
            res.json("Algorithm not found");
            return;
        }

        //Add song frames based on the final frame in the sort
        var songFrames = sortingAlgorithms.songFrames(frames[frames.length -1].data)

        //Add the song frames to the frames array
        res.json(frames.concat(songFrames));
      }else{
        res.json("Song not found");
      }
    });
  });

  //Get all song names
  app.get('/songs', (req, res) => {
    db.getView("note-sort", "song", "names").then((data) => {
      var sort = []
      //console.info(data);
      data.data.rows.forEach((row) => {
        sort.push(row.value);
      })
      //console.info(sort);
      res.json(sort);
    });
  });

  //Get a single song by id
  app.get('/songs/notes', (req, res) => {
    db.getView("note-sort", "song", "notes").then((data) => {
      var finalData = data.data.rows.find((row) => {
        if(row.value.name == req.query.song){
          return true;
        }
      });
      if(finalData){
        res.json(finalData.value.notes);
      }else{
        res.json("Algorithm not found");
      }
    });
  })

  //Get all sort type names
  app.get('/sortTypes', (req,res)=>{
    db.getView("note-sort", "alg", "names").then((data) => {
      var sort = []
      //console.info(data);
      data.data.rows.forEach((row) => {
        sort.push(row.value);
      })
      //console.info(sort);
      res.json(sort);
    });
    //res.json(types);
  });

  //Get the pseudo code for a given sort type
  app.get('/sortTypes/psuedoCode', (req, res) => {
    db.getView("note-sort", "alg", "pseudo").then((data) => {
      var finalData = data.data.rows.find((row) => {
        if(row.key == req.query.algorithm){
          return true;
        }
      });
      if(finalData){
        res.json(finalData.value);
      }else{
        res.json("Algorithm not found");
      }
    });
  });
}

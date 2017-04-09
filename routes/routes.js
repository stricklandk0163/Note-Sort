var sortingAlgorithms = require('../sortingAlgorithms.js');
module.exports = function(app) {
  //Run the passed sorting algorithm and on the given song
  app.get('/sort/frames', (req,res) => {
    var algorithm = req.query.algorithm;
    //var song = req.query.song;
    var data = [5,4,3,2,1];

    switch(algorithm) {
    case "merge":
        res.json(sortingAlgorithms.mergesortWrapper(data));
        break;
    case "select":
        res.json(sortingAlgorithms.selectsort(data));
        break;
    case "insert":
        res.json(sortingAlgorithms.insertsort(data));
        break;
    case "quick":
        res.json(sortingAlgorithms.quickSortWrapper(data));
        break;
    case "cocktail":
        res.json(sortingAlgorithms.cocktailsort(data));
        break;
    case "bubble":
        res.json(sortingAlgorithms.bubblesort(data));
        break;
    default:
        res.json("Algorithm not found");
    }
    var frames = sortingAlgorithms.selectsort([5,4,3,2,1]);
    res.json(frames);
  });
}

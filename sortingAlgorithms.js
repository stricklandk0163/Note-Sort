function swap(array, i, j) {
  var t = array[i];
  array[i] = array[j];
  array[j] = t;
}

//Run select sort
// Params : (A) the array to sort
// Returns: (frames) an array of frames each frame represents a step in the sort
module.exports.selectsort = function(A) {
  frames = [];
  frames.push({data:A.slice(), algorithmSteps:[0], importantIndices:[0]});
  for (var i = 0; i < A.length; i++) {
    frames.push({data:A.slice(), algorithmSteps:[1], importantIndices:[i]});
    var min = i;
    frames.push({data:A.slice(), algorithmSteps:[2], importantIndices:[i]});
    for (var j = i + 1; j < A.length; j ++) {
      frames.push({data:A.slice(), algorithmSteps:[3], importantIndices:[j]});
      if (A[j] < A[min]) {
        frames.push({data:A.slice(), algorithmSteps:[4], importantIndices:[j, min]});
        min = j;
        frames.push({data:A.slice(), algorithmSteps:[5], importantIndices:[j, min]});
      }
    }
    if (i != min) {
      frames.push({data:A.slice(), algorithmSteps:[6], importantIndices:[i, min]});
      swap(A, i, min);
      frames.push({data:A.slice(), algorithmSteps:[7], importantIndices:[i, min]});
    }
  }
  return frames;
};

//Runs cocktail sort
// Params : (A) the array to sort
// Returns: (frames) an array of frames each frame represents a step in the sort
module.exports.cocktailsort = function(A) {
  var frames = [];
  frames.push({data:A.slice(), algorithmSteps:[0], importantIndices:[0]});
  var sorted = true;
  frames.push({data:A.slice(), algorithmSteps:[1], importantIndices:[0]});
  while (sorted) {
    frames.push({data:A.slice(), algorithmSteps:[2], importantIndices:[0]});
    for (var i = 0; i < A.length - 2; i++) {
      frames.push({data:A.slice(), algorithmSteps:[3], importantIndices:[i]});
      if (A[i] > A[i + 1]) {
        frames.push({data:A.slice(), algorithmSteps:[4], importantIndices:[i, i + 1]});
        swap(A, i, i + 1);
        frames.push({data:A.slice(), algorithmSteps:[5], importantIndices:[i, i + 1]});
        sorted = true;
        frames.push({data:A.slice(), algorithmSteps:[6], importantIndices:[0]});
      }
    }
    if (!sorted) {
      frames.push({data:A.slice(), algorithmSteps:[7], importantIndices:[0]});
      break;
    }
    sorted = false;
    frames.push({data:A.slice(), algorithmSteps:[8], importantIndices:[0]});
    for (var i = A.length - 2; i > 0; i--) {
      frames.push({data:A.slice(), algorithmSteps:[9], importantIndices:[i]});
      if (A[i] > A[i + 1]) {
        frames.push({data:A.slice(), algorithmSteps:[10], importantIndices:[i, i + 1]});
        swap(A, i, i + 1);
        frames.push({data:A.slice(), algorithmSteps:[11], importantIndices:[i, i + 1]});
        sorted = true;
        frames.push({data:A.slice(), algorithmSteps:[12], importantIndices:[0]});
      }
    }
  }
  return frames;
};

//Runs insertsort
// Params : (A) the array to sort
// Returns: (frames) an array of frames each frame represents a step in the sort
module.exports.insertsort = function(A) {
  var frames = [];
  frames.push({data:A.slice(), algorithmSteps:[0], importantIndices:[0]});
  for (var i = 1; i < A.length; i++) {
    frames.push({data:A.slice(), algorithmSteps:[1], importantIndices:[i]});
    var temp = A[i];
    frames.push({data:A.slice(), algorithmSteps:[2], importantIndices:[i]});
    var j = i - 1;
    for (; j >= 0 && A[j] > temp; j--) {
      frames.push({data:A.slice(), algorithmSteps:[3], importantIndices:[j, i - 1, i]});
      A[j + 1] = A[j];
      frames.push({data:A.slice(), algorithmSteps:[4], importantIndices:[j + 1, j]});
    }
    A[j + 1] = temp;
    frames.push({data:A.slice(), algorithmSteps:[5], importantIndices:[j + 1, i]});
  }
  return frames;
}

//Wrapper for in place merge sort
// Params : (A) the array to sort
// Returns: (frames) an array of frames each frame represents a step in the sort
module.exports.mergesortWrapper = function(A) {
  frames = [];
  inplacemergesort(A, 0, A.length - 1, frames);
  return frames;
}

//Runs in place merge sort
// Params: (A) the array we are sorting
// (First) the indice of the first element in our recursive sort
// (Last) the indice of the last element in our recursive sort
// (Frames) A reference to the frames array so we can recursively push to it (yes I know all arrays are references anyways)
// Returns: Nothing
function inplacemergesort(A, first, last, frames) {
  frames.push({data:A.slice(), algorithmSteps:[0], importantIndices:[0]});
  if (first >= last) {
    frames.push({data:A.slice(), algorithmSteps:[1, 2], importantIndices:[first, last]});
    return A;
  }
  frames.push({data:A.slice(), algorithmSteps:[1], importantIndices:[first, last]});
  var mid = parseInt((first + last) / 2);
  frames.push({data:A.slice(), algorithmSteps:[3], importantIndices:[mid]});
  frames.push({data:A.slice(), algorithmSteps:[4], importantIndices:[first, mid]});
  inplacemergesort(A, first, mid, frames);
  frames.push({data:A.slice(), algorithmSteps:[5], importantIndices:[mid + 1, last]});
  inplacemergesort(A, mid + 1, last, frames);
  var lt = first;
  var rt = mid + 1;
  frames.push({data:A.slice(), algorithmSteps:[6], importantIndices:[first, mid + 1]});
  while (lt <= mid && rt <= last) {
    frames.push({data:A.slice(), algorithmSteps:[7], importantIndices:[lt, mid, rt, last]});
    frames.push({data:A.slice(), algorithmSteps:[8], importantIndices:[lt, rt]});
    if (A[lt] <= A[rt]) {
      frames.push({data:A.slice(), algorithmSteps:[9], importantIndices:[lt]});
      lt++;
    }
    else {
      frames.push({data:A.slice(), algorithmSteps:[10], importantIndices:[first, mid + 1]});
      var temp = A[rt];
      frames.push({data:A.slice(), algorithmSteps:[11], importantIndices:[rt]});
      for (var i = rt; i > lt; i--) {
        frames.push({data:A.slice(), algorithmSteps:[12], importantIndices:[i, lt]});
        A[i] = A[i - 1];
        frames.push({data:A.slice(), algorithmSteps:[13], importantIndices:[i, i - 1]});
      }
      A[lt] = temp;
      frames.push({data:A.slice(), algorithmSteps:[14], importantIndices:[temp]});
      lt++;
      mid++;
      rt++;
      frames.push({data:A.slice(), algorithmSteps:[15], importantIndices:[lt, rt, mid]});
    }
  }
}

//Runs bubble sort
// Params : (A) the array to sort
// Returns: (frames) an array of frames each frame represents a step in the sort
module.exports.bubblesort = function(A) {
  var frames = [];
  frames.push({data:A.slice(), algorithmSteps:[0], importantIndices:[0]});
  for (var i = 0; i < A.length; i++) {
    frames.push({data:A.slice(), algorithmSteps:[1], importantIndices:[i]});
    for (var j = 0; j < (A.length - i - 1); j++) {
      frames.push({data:A.slice(), algorithmSteps:[2], importantIndices:[j]});
      if (A[j] > A[j + 1]) {
        frames.push({data:A.slice(), algorithmSteps:[3], importantIndices:[j, j + 1]});
        swap(A, j, j + 1);
        frames.push({data:A.slice(), algorithmSteps:[4], importantIndices:[j, j + 1]});
      }
    }
  }
  return frames;
};

//A wrapper for the quick sort method
// Params : (A) the array to sort
// Returns: (frames) an array of frames each frame represents a step in the sort
module.exports.quickSortWrapper = function(A) {
  var frames = [];
  quicksort(A, 0, A.length - 1, frames);
  return frames;

};

//Runs quick sort
// Special param (frames) reference to frames array
function quicksort(A, lo, hi, frames) {
  frames.push({data:A.slice(), algorithmSteps:[0, 1], importantIndices:[lo, hi]});
  if (lo < hi) {
    frames.push({data:A.slice(), algorithmSteps:[0, 2], importantIndices:[lo, hi]});
    var p = partition(A, lo, hi, frames);
    frames.push({data:A.slice(), algorithmSteps:[0, 3], importantIndices:[lo, hi]});
    quicksort(A, lo, p - 1, frames);
    frames.push({data:A.slice(), algorithmSteps:[0, 4], importantIndices:[lo, hi]});
    quicksort(A, p + 1, hi, frames);
  }
}

//Runs partition step of quick sort
// Special param (frames) reference to frames array
function partition(A, lo, hi, frames) {
  frames.push({data:A.slice(), algorithmSteps:[6, 7], importantIndices:[hi]});
  var pivot = A[hi];
  frames.push({data:A.slice(), algorithmSteps:[6, 8], importantIndices:[lo]});
  var i = lo;
  frames.push({data:A.slice(), algorithmSteps:[6, 9], importantIndices:[lo, hi]});
  for (var j = lo; j < hi; j++) {
    frames.push({data:A.slice(), algorithmSteps:[6, 10], importantIndices:[j, hi]});
    if (A[j] <= pivot) {
      frames.push({data:A.slice(), algorithmSteps:[6, 11], importantIndices:[i, j]});
      swap(A, i, j);
      frames.push({data:A.slice(), algorithmSteps:[6, 12], importantIndices:[i]});
      i++;
    }
  }
  frames.push({data:A.slice(), algorithmSteps:[6, 13], importantIndices:[i, hi]});
  swap(A, i, hi);
  frames.push({data:A.slice(), algorithmSteps:[6, 14], importantIndices:[i]});
  return i;
}

//Add the frames needed to play a song based on the sorted song array
module.exports.songFrames = function(A){
  var frames = [];
  for(var i=0; i<A.length; i++){
    frames.push({data:A.slice(), algorithmSteps:[0], importantIndices:[i]});
  }
  return frames;
}

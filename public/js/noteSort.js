var app = angular.module('noteSort', ['rzModule']);

//Provider for the draw function
app.config(function($provide) {
  $provide.value('draw', function(frameData, importantIndices) {
    //Remove the previous graph
    d3.select("svg").remove();

    //Width and height
    var w = 500;
    var h = 400;
    var barPadding =1;

    //Create SVG element
    var svg = d3.select("#myDiv")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    svg.selectAll("rect")
     .data(frameData)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {
        return i * (w / frameData.length);
     })
     .attr("y", function(d) {
        return h-(h/frameData.length) * (d+1);
     })
     .attr("width", w / frameData.length - barPadding)
     .attr("height", function(d) {
        return (h/frameData.length) * (d+1);
     })
     .attr("fill", function(d, i) {
        if(importantIndices.indexOf(i) >= 0){
          return("White");
        }
        else{
          if(d == 0){
            return "rgb(103,200,255)"
          }
          else{
            var r = Math.round(103+145*(d/(frameData.length-1)));
            var g = Math.round(200-190*(d/(frameData.length-1)));
            var b = Math.round(255-107*(d/(frameData.length-1)));
            return "rgb("+ r +","+ g +","+ b +")";
          }
        }
     });
  });
});

//Controller to view an individual advertisement
app.controller("SortAlgCtrl", function($scope,$http, $location, draw){
  //Get the list of songs and set the scope variable
  $scope.getSongTitles = function(){
    return new Promise(function(resolve){
      $http({
        method: 'GET',
        url: '/songs',
      }).then(function successCallback(response) {
        $scope.songs = response.data;
        $scope.activeSong = $scope.songs[0];
        resolve();
      }, function errorCallback(response) {
          $scope.songs = [];
          resolve();
      });
    });
  };

  //Get the list of sort types and set the scope variable
  $scope.getSortTypes = function(){
    return new Promise(function(resolve){
      $http({
    		method: 'GET',
    		url: '/sortTypes'
    	}).then(function successCallback(response) {
    		$scope.sortTypes = response.data;
        $scope.activeAlgorithm = $scope.sortTypes[0];
        resolve();
    	}, function errorCallback(response) {
    	    $scope.sortTypes = [];
          resolve();
    	});
    });
  };

  //Use the currently active song and algorithm to generate list of frames
  $scope.getSortFrames = function(){
    return new Promise(function(resolve){
      $http({
        method: 'GET',
        url: '/sort/frames',
        params: {
          algorithm: $scope.activeAlgorithm,
          song: $scope.activeSong
        }
      }).then(function successCallback(response) {
    		$scope.frames = response.data;
        console.log($scope.frames);
        resolve();
    	}, function errorCallback(response) {
    	  $scope.frames = [];
        resolve();
    	});
    });
  };

  //Load the algorithmTypes and songs titles for the UI Also set active song and algorithm
  $scope.loadPageInfo = function(){
    return new Promise(function(resolve){
      $scope.getSongTitles()
        .then(function(data){$scope.getSortTypes()
          .then(function(data){resolve();})
        })
    });
  };

  //Get the psuedo code for the currently active algorithm
  $scope.getActiveAlgorithmPsuedo = function(){
    return new Promise(function(resolve){
      $http({
        method: 'GET',
        url: '/sortTypes/psuedoCode',
        params: {
          algorithm: $scope.activeAlgorithm
        }
      }).then(function successCallback(response) {
    		$scope.psuedoCode = response.data;
        console.log($scope.psuedoCode);
        resolve();
    	}, function errorCallback(response) {
    	  $scope.psuedoCode = [];
        resolve();
    	});
    });
  };

  //Check if a step with the given index is active for the current frame
  $scope.stepIsActive = function(stepNum){
    var activeSteps = $scope.frames[$scope.currentFrame].algorithmSteps;
    if(activeSteps.indexOf(stepNum) >= 0)
      return true;
    return false;
  };

  //Update the active algorithm and generate new frames based on it
  $scope.setActiveAlgorithm = function(algorithm){
    $scope.activeAlgorithm = algorithm;
    $scope.reset();
  };

  //Update the active song and generate new frames based on it
  $scope.setActiveSong = function(song){
    $scope.activeSong = song;
    $scope.reset();
  };

  //If paused, start playing the a new draw loop
  //If playing, pause
  $scope.play = function(){
    if($scope.paused){
      $scope.paused = false;
      $scope.playButtonText = "Pause";
      $scope.currentDrawLoop++;
      drawLoop($scope.currentDrawLoop);
    }
    else{
      $scope.paused = true;
      $scope.playButtonText = "Play";
    }

  };

  //Continue to loop drawing the current frame until either
  // A. We run out of frames
  // B. The application is paused
  // C. A new draw loop is started
  var drawLoop = function(loopId){
    setTimeout(function(){
      $scope.currentFrame++;
      var currentFrame = $scope.frames[$scope.currentFrame];
      draw(currentFrame.data, currentFrame.importantIndices);
      $scope.$apply();
      if(loopId == $scope.currentDrawLoop && !$scope.paused && $scope.currentFrame < $scope.frames.length-1)
        drawLoop(loopId);
    }, 100/$scope.sliderValue)
  };

  $scope.step = function(){
    if($scope.paused && $scope.currentFrame < $scope.frames.length-1){
      $scope.currentFrame++;
      var currentFrame = $scope.frames[$scope.currentFrame];
      draw(currentFrame.data, currentFrame.importantIndices);
    }
  };

  $scope.reset = function(){
    $scope.playButtonText = "Play";
    $scope.paused = true;
    $scope.currentFrame = 0;
    $scope.getSortFrames().then(function(data){
      var currentFrame = $scope.frames[$scope.currentFrame];
      draw(currentFrame.data, currentFrame.importantIndices);
    });
    $scope.getActiveAlgorithmPsuedo();
  }

  //Initialize variables
  $scope.songs = [];
  $scope.sortTypes = [];
  $scope.activeAlgorithm = "";
  $scope.activeSong = "";
  $scope.frames = [];
  $scope.psuedoCode = [];
  $scope.currentFrame = 0;
  $scope.sliderValue = 1;
  $scope.currentDrawLoop = 0; //Used as an id for the currently running draw loop
  $scope.playButtonText = "Play";
  $scope.paused = true;

  //Load page info and initialize a sorting algorithm /song
  $scope.loadPageInfo()
    .then(function(data){
      $scope.getSortFrames()
        .then(function(data){
          var currentFrame = $scope.frames[$scope.currentFrame];
          draw(currentFrame.data, currentFrame.importantIndices);
          $scope.getActiveAlgorithmPsuedo()
        })
    });
});

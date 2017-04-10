var app = angular.module('noteSort', []);

//Controller to view an individual advertisement
app.controller("SortAlgCtrl", function($scope,$http, $location){
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
  }

  //Update the active algorithm and generate new frames based on it
  $scope.setActiveAlgorithm = function(algorithm){
    $scope.activeAlgorithm = algorithm;
    $scope.getSortFrames();
    $scope.getActiveAlgorithmPsuedo();
  }

  //Update the active song and generate new frames based on it
  $scope.setActiveSong = function(song){
    $scope.activeSong = song;
    $scope.getSortFrames();
    $scope.getActiveAlgorithmPsuedo();
  }

  //Initialize page
  $scope.songs = [];
  $scope.sortTypes = [];
  $scope.activeAlgorithm = "";
  $scope.activeSong = "";
  $scope.frames = [];
  $scope.psuedoCode = [];
  $scope.loadPageInfo()
    .then(function(data){
      $scope.getSortFrames()
        .then(function(data){
          $scope.getActiveAlgorithmPsuedo()
        })
    });
});

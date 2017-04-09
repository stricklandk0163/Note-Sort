var app = angular.module('noteSort', []);

//Controller to view an individual advertisement
app.controller("SortAlgCtrl", function($scope,$http, $location){
  $scope.songs = [];
  $scope.sortTypes = [];
  //Get the list of songs
	$http({
		method: 'GET',
		url: '/songs',
	}).then(function successCallback(response) {
		$scope.songs = response.data;
	}, function errorCallback(response) {
	    $scope.songs = [];
	});
  //Get the list of sort types
  $http({
		method: 'GET',
		url: '/sortTypes',
	}).then(function successCallback(response) {
		$scope.sortTypes = response.data;
	}, function errorCallback(response) {
	    $scope.sortTypes = [];
	});
});

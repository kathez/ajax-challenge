"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var commentsUrl = 'https://api.parse.come/1/classes/comments';

angular.module('CommentApp', [ui.bootstrap])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'ek2oVa8EOZdAc4jOrusIMJQS8TkJwgPQ6kzgLmwU';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'mu82CmM7Skmh5mtT7kJ9vcXubGvixGSIgSRanvgw';
    })
    .controller('CommentsController', function($scope,$http) {
        $scope.refreshComments = function() {
            $scope.loading = false;
            $http.get(commentsUrl + '?where={"done":false}')
                .success(function(data) {
                    $scope.comments = data.results;
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.refreshComments();

        $scope.newComment = {done:false};

        $scope.addComment = function() {

            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {done: false};
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                });
        };

        $scope.updateComment = function(comment) {
            $http.put(commentsUrl + '/' + comment.objectId, comment)
                .success(function() {

                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.updating = false;
                })
        };

    });

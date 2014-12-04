"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('CommentApp', ["ui.bootstrap"])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'ek2oVa8EOZdAc4jOrusIMJQS8TkJwgPQ6kzgLmwU';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'mu82CmM7Skmh5mtT7kJ9vcXubGvixGSIgSRanvgw';
    })
    .controller('CommentsController', function($scope,$http) {
        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(commentsUrl)
                .success(function(data) {
                    $scope.comments = data.results;
                    $scope.comments = _.sortBy($scope.comments, 'votes').reverse();
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };


        $scope.refreshComments();

        $scope.newComment = {
            votes: 0
        };

        //work on DELETE, button to delete
        $scope.addComment = function() {
            $scope.loading = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {
                        votes: 0
                    };
                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.loading = false;
                });
        };

        $scope.deleteComment = function(comment) {
            $http.delete(commentsUrl + '/' + comment.objectId)
                .success(function(responseData) {

                })
                .error(function(err) {
                    $scope.errorMessage = err;
                })
                .finally(function() {
                    $scope.refreshComments();
                    $scope.deleting = false;
                });
        };

        $scope.incrementVotes = function(comment, amount) {
            if (comment.votes + amount >= 0) {
                $scope.updating = true;
                $http.put(commentsUrl + '/' + comment.objectId, {
                    votes: {
                        __op: 'Increment',
                        amount: amount
                    }
                    })
                        .success(function(responseData) {
                            comment.votes = responseData.votes;
                        })
                        .error(function(err) {
                            console.log(err);
                        })
                        .finally(function() {
                            $scope.updating= false;
                        });
            }
        }; //incrementVotes()

    });

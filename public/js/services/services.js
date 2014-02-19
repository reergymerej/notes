'use strict';

/* Services */

angular.module('myApp.services', [])

.value('API_PATH', '/api/')

.factory('jgLocalStorage', ['$http', function ($http) {

  function loadCollection (x) {
    var x = localStorage.getItem(x) || '[]';
    return JSON.parse(x);
  }

  function saveCollection (x, name) {
    localStorage.setItem(name, JSON.stringify(x));
  }

  return {
    get: function (noun, id) {
      var collection = loadCollection(noun);
      return id === undefined ? collection : collection[id];
    },
    post: function (noun, item) {
    },
    put: function (x) {

    },
    delete: function (x) {

    },

    saveCollection: function (collection, noun) {
      var i,
        newCollection = {};


      saveCollection(collection, noun);

      // save in alternate way as well
      for (i = 0; i < collection.length; i ++) {
        newCollection[i] = collection[i];
      }

      saveCollection(newCollection, noun + '-new');
    }
  };
}]);